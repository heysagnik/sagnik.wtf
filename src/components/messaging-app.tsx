"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useMessageReactions } from "@/hooks/useMessageReactions";
import Header from "@/components/header";
import MessageBubble from "@/components/message-bubble";
import { MessageInput } from "@/components/message-input";
import CompactHeader from "@/components/compact-header";
import TypingIndicator from "@/components/typing-indicator";
import { SPACING } from "@/lib/layout";
import { computeLastInGroupFlags } from "@/lib/message-grouping";

interface MessagingAppProps {
  /** Returning from another page (e.g. blog) — load messages instantly instead of the staggered reveal. */
  skipIntroAnimation?: boolean;
}

const TIMING_CONFIG = {
  timestampVisibility: 100,
  scrollToBottom: 100,
} as const;

// If the reader has scrolled further than this from the bottom, treat them as
// reading — new messages arriving during the staggered reveal won't yank the
// view back down.
const NEAR_BOTTOM_THRESHOLD = 80;

const LAYOUT_CONFIG = {
  topGradient: "absolute top-0 left-0 right-0 h-16 sm:h-20 z-10 pointer-events-none",
  container: "flex-1 overflow-y-auto overflow-x-hidden overscroll-contain flex flex-col scrollbar-hide px-3",
  footer: "bg-black/95 backdrop-blur-sm w-full flex-shrink-0 border-t border-white/5",
  footerGradient: "absolute top-[-1px] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
} as const;

const TopGradient = () => (
  <div className={LAYOUT_CONFIG.topGradient}>
    <div className="w-full h-full bg-gradient-to-b from-black via-black/80 to-transparent"></div>
  </div>
);

const FooterSection = ({ onSend }: { onSend: (content: string) => void }) => (
  <div className={LAYOUT_CONFIG.footer}>
    <div className={LAYOUT_CONFIG.footerGradient}></div>
    <MessageInput onSend={onSend} isEnabled />
  </div>
);

const SafeAreaSpacer = ({ position }: { position: 'top' | 'bottom' }) => (
  <div className={`h-safe-area-${position} bg-black flex-shrink-0`}></div>
);

const MessagingApp = ({ skipIntroAnimation = false }: MessagingAppProps) => {
  const { messages, isTyping: isApiTyping, addMessage, messageIds } = useMessages(skipIntroAnimation);
  const [isTimestampVisible, setIsTimestampVisible] = useState(false);

  const uniqueMessages = useMemo(() =>
    [...new Map(messages.map(msg => [msg.id, msg])).values()],
    [messages]
  );

  // messageIds is the full scripted set, known and stable from mount — unlike
  // uniqueMessages it doesn't grow through the staggered reveal, so this
  // fetches reactions once instead of once per reveal step.
  const { reactionsForMessage, toggleReaction } = useMessageReactions(messageIds);

  // A message is the "last in group" — and gets the avatar + tail corner —
  // when the next message switches sender or arrives after a long enough
  // pause (see lib/message-grouping.ts), or it's the last message overall
  // and no reply is still in flight. While isApiTyping is true, the typing
  // indicator is the visual tail instead, so the last message hands it off.
  const lastInGroupFlags = useMemo(
    () => computeLastInGroupFlags(uniqueMessages, isApiTyping),
    [uniqueMessages, isApiTyping]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD;
  }, []);

  useEffect(() => {
    // Only follow new messages down if the reader hasn't scrolled away to
    // read earlier ones — lets them scroll up mid-reveal without being
    // pulled back to the bottom every time the next message pops in.
    if (isNearBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, isApiTyping, scrollToBottom]);

  const handleTimestampVisibilityChange = useCallback((isVisible: boolean) => {
    setTimeout(() => {
      setIsTimestampVisible(isVisible);
    }, isVisible ? 0 : TIMING_CONFIG.timestampVisibility);
  }, []);

  const handleSendMessage = useCallback((content: string) => {
    addMessage(content);
    isNearBottomRef.current = true;
    setTimeout(scrollToBottom, TIMING_CONFIG.scrollToBottom);
  }, [addMessage, scrollToBottom]);

  const showCompactHeader = !isTimestampVisible;

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      <SafeAreaSpacer position="top" />
      <TopGradient />
      
      <CompactHeader isVisible={showCompactHeader} />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={LAYOUT_CONFIG.container}
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        <div className="w-full max-w-3xl mx-auto flex flex-col">
          <div className={`${SPACING.top} flex-shrink-0`} />

          <div className={`${SPACING.header} relative`}>
            <Header onTimestampVisibilityChange={handleTimestampVisibilityChange} />
          </div>

          <div className={`${SPACING.headerBottom} flex-shrink-0`} />

          <div className={`${SPACING.messages} mt-auto`}>
            {uniqueMessages.map((message, index) => (
              <div key={message.id || `msg-${index}`} className="w-full">
                <MessageBubble
                  message={message}
                  animate={!skipIntroAnimation}
                  isLastInGroup={lastInGroupFlags[index]}
                  reactions={reactionsForMessage(message.id)}
                  onToggleReaction={toggleReaction}
                />
              </div>
            ))}

            <div className={`${SPACING.bottom} flex-shrink-0`} />
          </div>
        </div>
        <div className="h-4" ref={messagesEndRef}></div>
      </div>

      {isApiTyping && (
        <div className="px-3 pt-1 pb-1">
          <TypingIndicator />
        </div>
      )}

      <FooterSection onSend={handleSendMessage} />
      <SafeAreaSpacer position="bottom" />
    </div>
  );
};

export default MessagingApp;