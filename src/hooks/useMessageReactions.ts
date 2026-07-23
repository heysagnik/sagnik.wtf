import { useCallback, useEffect, useRef, useState } from "react";
import { getGuestId } from "@/lib/guest";
import type { ReactionState } from "@/lib/reactions";

type ReactionsByMessage = Record<string, ReactionState>;

const EMPTY_STATE: ReactionState = { counts: {}, mine: null };

/**
 * @param messageIds Should be a referentially stable array (e.g. memoized by
 * the caller) — it's an effect dependency, so a fresh array every render
 * would refetch on every render.
 */
export function useMessageReactions(messageIds: string[]) {
  const [reactionsByMessage, setReactionsByMessage] = useState<ReactionsByMessage>({});
  const guestIdRef = useRef("");
  const reactionsRef = useRef<ReactionsByMessage>({});
  reactionsRef.current = reactionsByMessage;

  useEffect(() => {
    if (messageIds.length === 0) return;

    const guestId = getGuestId();
    guestIdRef.current = guestId;

    const params = new URLSearchParams({ ids: messageIds.join(","), guestId });

    fetch(`/api/reactions?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: ReactionsByMessage) => setReactionsByMessage((prev) => ({ ...prev, ...data })))
      .catch(() => {});
  }, [messageIds]);

  const toggleReaction = useCallback((messageId: string, emoji: string) => {
    const guestId = guestIdRef.current || getGuestId();
    guestIdRef.current = guestId;

    const previous = reactionsRef.current[messageId] || EMPTY_STATE;
    const wasMine = previous.mine === emoji;

    const optimisticCounts = { ...previous.counts };
    if (previous.mine) {
      const remaining = (optimisticCounts[previous.mine] || 1) - 1;
      if (remaining > 0) optimisticCounts[previous.mine] = remaining;
      else delete optimisticCounts[previous.mine];
    }
    if (!wasMine) {
      optimisticCounts[emoji] = (optimisticCounts[emoji] || 0) + 1;
    }

    setReactionsByMessage((prev) => ({
      ...prev,
      [messageId]: { counts: optimisticCounts, mine: wasMine ? null : emoji },
    }));

    fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, guestId, emoji }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { counts: Record<string, number>; mine: string | null } | null) => {
        if (!data) throw new Error("Reaction request failed");
        setReactionsByMessage((prev) => ({
          ...prev,
          [messageId]: { counts: data.counts, mine: data.mine },
        }));
      })
      .catch(() => {
        setReactionsByMessage((prev) => ({ ...prev, [messageId]: previous }));
      });
  }, []);

  const reactionsForMessage = useCallback(
    (messageId: string) => reactionsByMessage[messageId] || EMPTY_STATE,
    [reactionsByMessage]
  );

  return { reactionsForMessage, toggleReaction };
}
