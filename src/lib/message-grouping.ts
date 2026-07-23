import type { MessageType } from "./types";

// Messages from the same sender within this window count as one visual
// burst — only the last one gets the avatar + tail corner, like iOS
// Messages collapsing quick back-to-back texts into a single group.
const GROUP_TIME_GAP_MS = 60_000;

const toMs = (timestamp: MessageType["timestamp"]) => {
  const value = typeof timestamp === "string" ? Date.parse(timestamp) : timestamp;
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
};

/**
 * @param groupContinues Whether the sender's turn continues past the last
 * message (e.g. a typing indicator is up) — keeps its avatar off too.
 */
export function computeLastInGroupFlags(messages: MessageType[], groupContinues: boolean): boolean[] {
  return messages.map((message, index) => {
    const next = messages[index + 1];
    if (!next) return !groupContinues;
    if (next.sender !== message.sender) return true;

    const currentMs = toMs(message.timestamp);
    const nextMs = toMs(next.timestamp);
    if (currentMs === null || nextMs === null) return true;

    return nextMs - currentMs > GROUP_TIME_GAP_MS;
  });
}
