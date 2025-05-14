"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMessages } from "@/hooks/useMessages";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";
import MessageList from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import CompactHeader from "@/components/compact-header";
import NewMessagesNotification from "@/components/new-messages-notification";
import TypingIndicator from "@/components/typing-indicator";
import type { MessageType } from "@/lib/types";

// Constants for animations and delays
const TYPING_ANIMATION = {
  CHAR_DELAY_MS: 20, // Milliseconds per character for typing indicator duration
  MIN_DURATION_MS: 200, // Minimum duration for the typing indicator
  MAX_DURATION_MS: 1500, // Maximum duration for the typing indicator
};

const UI_DELAYS = {
  TIMESTAMP_VISIBILITY_MS: 100, // Delay for timestamp visibility change
  SCROLL_TO_BOTTOM_MS: 100, // Delay for scrolling to bottom after sending a message
  TYPING_INDICATOR_ANIMATION_MS: 100, // Duration for typing indicator fade in/out
};

export default function MessagingApp() {
  const { messages, isTyping: isApiTyping, addMessage } = useMessages();
  const {
    containerRef,
    isScrolledUp,
    isHeaderScrolled,
    scrollToBottom,
    autoScrollOnNewContent,
  } = useScrollBehavior();

  const [visibleMessages, setVisibleMessages] = useState<MessageType[]>([]);
  const [isGraduallyTyping, setIsGraduallyTyping] = useState(false);
  const prevProcessedMessagesLength = useRef(0); // Tracks messages processed for gradual display

  const [isTimestampVisible, setIsTimestampVisible] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const isTyping = isApiTyping || isGraduallyTyping;

  // Effect for gradually revealing new messages
  useEffect(() => {
    // Only run if there are messages and new messages have arrived
    if (messages.length === 0 || messages.length <= prevProcessedMessagesLength.current) {
      return;
    }

    // Get the next message to reveal (oldest message not yet in visibleMessages)
    const nextMessageToReveal = messages[visibleMessages.length];

    if (!nextMessageToReveal) {
      // All messages currently in `messages` array are already visible or being processed
      // Update prevProcessedMessagesLength to current messages length if it fell behind
      if (prevProcessedMessagesLength.current < messages.length) {
        prevProcessedMessagesLength.current = messages.length;
      }
      return;
    }

    setIsGraduallyTyping(true);

    const messageContent = nextMessageToReveal.content || "";
    const typingDelay = Math.min(
      Math.max(
        TYPING_ANIMATION.MIN_DURATION_MS,
        messageContent.length * TYPING_ANIMATION.CHAR_DELAY_MS
      ),
      TYPING_ANIMATION.MAX_DURATION_MS
    );

    const timer = setTimeout(() => {
      setIsGraduallyTyping(false);
      setVisibleMessages((current) => [...current, nextMessageToReveal]);
      // Mark that this message from the source `messages` array has been processed for display
      prevProcessedMessagesLength.current = visibleMessages.length + 1;
    }, typingDelay);

    return () => clearTimeout(timer);
  }, [messages, visibleMessages]); // Reruns when new messages arrive or a message becomes visible

  const handleTimestampVisibilityChange = useCallback((isVisible: boolean) => {
    setTimeout(() => {
      setIsTimestampVisible(isVisible);
    }, isVisible ? 0 : UI_DELAYS.TIMESTAMP_VISIBILITY_MS);
  }, []);

  const showCompactHeader = isHeaderScrolled && !isTimestampVisible;

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
    setNewMessageCount(0);
  }, [scrollToBottom]);

  // Effect to update new message count when scrolled up
  useEffect(() => {
    if (isScrolledUp && messages.length > 0) {
      const currentNewMessageCount = newMessageCount;
      // Increment if new messages have arrived (messages.length increased)
      // This counts distinct "new message arrival events" while scrolled up.
      if (currentNewMessageCount < messages.length) {
        setNewMessageCount(currentNewMessageCount + 1);
      }
    }
  }, [isScrolledUp, messages.length, newMessageCount]);

  // Effect for auto-scrolling when new content (messages or typing indicator) appears
  useEffect(() => {
    autoScrollOnNewContent();
  }, [visibleMessages, isTyping, autoScrollOnNewContent]);

  const handleSendMessage = useCallback(
    (content: string) => {
      addMessage(content);
      // Delay scroll to allow DOM update and message to appear
      setTimeout(scrollToBottom, UI_DELAYS.SCROLL_TO_BOTTOM_MS);
      setNewMessageCount(0); // Reset new message count on send
    },
    [addMessage, scrollToBottom]
  );

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      <div className="h-safe-area-top bg-black flex-shrink-0"></div>

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-black via-black/80 to-transparent"></div>
      </div>

      <CompactHeader isVisible={showCompactHeader} />

      <AnimatePresence>
        {isScrolledUp && newMessageCount > 0 && showCompactHeader && (
          <NewMessagesNotification
            count={newMessageCount}
            onClick={handleScrollToBottom}
          />
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain flex flex-col scrollbar-hide px-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <MessageList
          messages={visibleMessages}
          onTimestampVisibilityChange={handleTimestampVisibilityChange}
        />
        <div className="h-4"></div> {/* Spacer at the bottom of the list */}
      </div>

      <AnimatePresence>
        {isTyping && (
          <motion.div
            className="px-3 pt-1 pb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: UI_DELAYS.TYPING_INDICATOR_ANIMATION_MS / 1000 }} // Framer motion uses seconds
          >
            <TypingIndicator showAvatar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input Area */}
      <div className="bg-black/95 backdrop-blur-sm w-full flex-shrink-0 border-t border-white/5">
        {/* Subtle top border highlight */}
        <div className="absolute top-[-1px] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <MessageInput onSend={handleSendMessage} isEnabled />
      </div>

      <div className="h-safe-area-bottom bg-black w-full flex-shrink-0"></div>
    </div>
  );
}