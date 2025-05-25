"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMessages } from "@/hooks/useMessages";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";
import MessageList from "@/components/message-list";
import StaticMessageList from "@/components/static-message-list";
import { MessageInput } from "@/components/message-input";
import CompactHeader from "@/components/compact-header";
import NewMessagesNotification from "@/components/new-messages-notification";
import TypingIndicator from "@/components/typing-indicator";
import type { MessageType } from "@/lib/types";

interface MessagingAppProps {
  skipIntroAnimation?: boolean;
}

const TIMING_CONFIG = {
  CHAR_DELAY_MS: 20,
  MIN_DURATION_MS: 200,
  MAX_DURATION_MS: 1500,
  TIMESTAMP_VISIBILITY_MS: 100,
  SCROLL_TO_BOTTOM_MS: 100,
  TYPING_INDICATOR_ANIMATION_MS: 100
} as const;

const TYPING_ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 },
  transition: { duration: TIMING_CONFIG.TYPING_INDICATOR_ANIMATION_MS / 1000 }
} as const;

const NO_TYPING_ANIMATION_CONFIG = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
  transition: { duration: 0 }
} as const;

const MessagingApp = ({ skipIntroAnimation = false }: MessagingAppProps) => {
  const { messages, isTyping: isApiTyping, addMessage } = useMessages();
  
  const [visibleMessages, setVisibleMessages] = useState<MessageType[]>(
    skipIntroAnimation ? messages : []
  );
  const [isGraduallyTyping, setIsGraduallyTyping] = useState(!skipIntroAnimation);
  const [isTimestampVisible, setIsTimestampVisible] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  
  const prevProcessedMessagesLength = useRef(0);

  const {
    containerRef,
    isScrolledUp,
    isHeaderScrolled,
    scrollToBottom,
    autoScrollOnNewContent,
  } = useScrollBehavior();

  const isTyping = skipIntroAnimation ? false : (isApiTyping || isGraduallyTyping);
  const showCompactHeader = isHeaderScrolled && !isTimestampVisible;

  const typingAnimationConfig = skipIntroAnimation ? NO_TYPING_ANIMATION_CONFIG : TYPING_ANIMATION_CONFIG;

  useEffect(() => {
    if (skipIntroAnimation) {
      setIsGraduallyTyping(false);
      return;
    }
  }, [skipIntroAnimation]);

  useEffect(() => {
    if (skipIntroAnimation && messages.length > 0) {
      setVisibleMessages(messages);
      setIsGraduallyTyping(false);
      prevProcessedMessagesLength.current = messages.length;
      return;
    }
    
    if (messages.length === 0 || messages.length <= prevProcessedMessagesLength.current) {
      return;
    }

    const nextMessageToReveal = messages[visibleMessages.length];
    if (!nextMessageToReveal) {
      if (prevProcessedMessagesLength.current < messages.length) {
        prevProcessedMessagesLength.current = messages.length;
      }
      return;
    }

    setIsGraduallyTyping(true);

    const messageContent = nextMessageToReveal.content || "";
    const typingDelay = Math.min(
      Math.max(
        TIMING_CONFIG.MIN_DURATION_MS,
        messageContent.length * TIMING_CONFIG.CHAR_DELAY_MS
      ),
      TIMING_CONFIG.MAX_DURATION_MS
    );

    const timer = setTimeout(() => {
      setIsGraduallyTyping(false);
      setVisibleMessages((current) => {
        const newVisible = [...current, nextMessageToReveal];
        prevProcessedMessagesLength.current = newVisible.length;
        return newVisible;
      });
    }, typingDelay);

    return () => clearTimeout(timer);
  }, [messages, visibleMessages, skipIntroAnimation]);

  const handleTimestampVisibilityChange = useCallback((isVisible: boolean) => {
    setTimeout(() => {
      setIsTimestampVisible(isVisible);
    }, isVisible ? 0 : TIMING_CONFIG.TIMESTAMP_VISIBILITY_MS);
  }, []);

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
    setNewMessageCount(0);
  }, [scrollToBottom]);

  const handleSendMessage = useCallback((content: string) => {
    addMessage(content);
    setTimeout(scrollToBottom, TIMING_CONFIG.SCROLL_TO_BOTTOM_MS);
    setNewMessageCount(0);
  }, [addMessage, scrollToBottom]);

  useEffect(() => {
    if (isScrolledUp && messages.length > 0) {
      const currentNewMessageCount = newMessageCount;
      if (currentNewMessageCount < messages.length) {
        setNewMessageCount(currentNewMessageCount + 1);
      }
    }
  }, [isScrolledUp, messages.length, newMessageCount]);

  useEffect(() => {
    autoScrollOnNewContent();
  }, [visibleMessages, isTyping, autoScrollOnNewContent]);

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      <div className="h-safe-area-top bg-black flex-shrink-0"></div>

      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-black via-black/80 to-transparent"></div>
      </div>

      <CompactHeader isVisible={showCompactHeader}  />

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
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {skipIntroAnimation ? (
          <StaticMessageList />
        ) : (
          <MessageList
            messages={visibleMessages}
            onTimestampVisibilityChange={handleTimestampVisibilityChange}
            skipAnimation={skipIntroAnimation}
          />
        )}
        <div className="h-4"></div> {/* Spacer at the bottom of the list */}
      </div>

      <AnimatePresence>
        {isTyping && (
          <motion.div
            className="px-3 pt-1 pb-1"
            {...typingAnimationConfig}
          >
            <TypingIndicator showAvatar skipAnimation={skipIntroAnimation} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-black/95 backdrop-blur-sm w-full flex-shrink-0 border-t border-white/5">
        <div className="absolute top-[-1px] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <MessageInput onSend={handleSendMessage} isEnabled />
      </div>

      <div className="h-safe-area-bottom bg-black w-full flex-shrink-0"></div>
    </div>
  );
};

export default MessagingApp;