"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { useMessages } from "@/hooks/useMessages";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";
import MessageList from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import CompactHeader from "@/components/compact-header";
import NewMessagesNotification from "@/components/new-messages-notification";
import TypingIndicator from "@/components/typing-indicator";
import type { MessageType } from '@/lib/types';

// Animation timing constants (in ms)
const ANIMATION = {
  FADE_IN_DURATION: 300,
  DISPLAY_DURATION: 800,
  FADE_OUT_DURATION: 400,
  BOOT_SCREEN_DURATION: 6000,
  FINAL_TRANSITION: 1000
}

type GreetingType = {
  text: string;
  language: string;
}

function BootScreen() {
  const [currentGreeting, setCurrentGreeting] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  const greetings: GreetingType[] = [
    { text: "Hello", language: "English" },
    { text: "こんにちは", language: "Japanese" },
    { text: "Bonjour", language: "French" },
    { text: "नमस्ते", language: "Hindi" },
    { text: "Hola", language: "Spanish" },
    { text: "Ciao", language: "Italian" },
    { text: "안녕하세요", language: "Korean" },
    { text: "你好", language: "Chinese" },
    { text: "Olá", language: "Portuguese" },
    { text: "Hallo", language: "German" }
  ]

  const rotateGreetings = useCallback((index: number) => {
    if (index >= greetings.length) return;
    
    setCurrentGreeting(index);
    setIsVisible(true);
    
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
      
      const nextGreetingTimer = setTimeout(() => {
        rotateGreetings(index + 1);
      }, ANIMATION.FADE_OUT_DURATION);
      
      return () => clearTimeout(nextGreetingTimer);
    }, ANIMATION.DISPLAY_DURATION);
    
    return () => clearTimeout(fadeOutTimer);
  }, [greetings.length]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      rotateGreetings(0);
    }, 100);
    
    return () => clearTimeout(initialTimer);
  }, [rotateGreetings]);
  
  return (
    <div className="flex h-full w-full items-center justify-center bg-black overflow-hidden">
      {/* Subtle background pulse */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-purple-900/5 to-black/0 animate-pulse-slow opacity-50 blur-3xl"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Greeting Text Animation */}
        <AnimatePresence mode="wait">
          {currentGreeting < greetings.length && (
            <motion.div
              key={currentGreeting}
              initial={{ opacity: 0, y: 15, scale: 0.9, filter: 'blur(5px)' }}
              animate={{ 
                opacity: isVisible ? 1 : 0, 
                y: isVisible ? 0 : 15, 
                scale: isVisible ? 1 : 0.9,
                filter: isVisible ? 'blur(0px)' : 'blur(5px)',
                transition: { 
                  duration: isVisible ? ANIMATION.FADE_IN_DURATION / 1000 : ANIMATION.FADE_OUT_DURATION / 1000, 
                  ease: isVisible ? "easeOut" : "easeIn" 
                } 
              }}
              exit={{ 
                opacity: 0, 
                y: -15, 
                scale: 0.9, 
                filter: 'blur(5px)',
                transition: { duration: ANIMATION.FADE_OUT_DURATION / 1000, ease: "easeIn" } 
              }}
              className="text-white text-3xl sm:text-4xl font-light tracking-wider"
            >
              {greetings[currentGreeting].text}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Progress Bar */}
        <div className="mt-10 h-1 w-20 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gray-400" 
            style={{ width: `${((currentGreeting + 1) / greetings.length) * 100}%`, transition: 'width 0.4s ease-in-out' }}
          />
        </div>
      </div>
    </div>
  )
}

function MessagingApp() {
  // Get messages from the hook
  const { messages, isTyping: isApiTyping, addMessage } = useMessages();
  const { 
    containerRef, 
    isScrolledUp, 
    isHeaderScrolled, 
    scrollToBottom, 
    autoScrollOnNewContent 
  } = useScrollBehavior();
  
  // Track visible messages for gradual revealing
  const [visibleMessages, setVisibleMessages] = useState<MessageType[]>([]);
  const [isGraduallyTyping, setIsGraduallyTyping] = useState(false);
  const prevMessagesLength = useRef(0);
  
  const [isTimestampVisible, setIsTimestampVisible] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  
  // Combined typing indicator state (from API or from gradual typing)
  const isTyping = isApiTyping || isGraduallyTyping;
  
  // Handle slow message revealing - moved from MessageList component
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Check if we have new messages
    if (messages.length > prevMessagesLength.current) {
      // Get the new messages that should be revealed
      const newMessages = messages.slice(visibleMessages.length);
      
      if (newMessages.length === 0) return;
      
      // Show typing indicator before revealing the message
      setIsGraduallyTyping(true);
      
      // Calculate typing time based on message length (around 30-60 chars per second)
      const messageContent = newMessages[0].content || '';
      // faster typing indicator: 20ms per char, min 200ms, max 1500ms
      const TYPING_CHAR_DELAY = 20;
      const TYPING_MIN = 200;
      const TYPING_MAX = 1500;
      const typingDelay = Math.min(
        Math.max(TYPING_MIN, messageContent.length * TYPING_CHAR_DELAY),
        TYPING_MAX
      );
      
      // After delay, reveal the next message
      const timer = setTimeout(() => {
        setIsGraduallyTyping(false);
        setVisibleMessages(current => [...current, newMessages[0]]);
        prevMessagesLength.current = visibleMessages.length + 1;
      }, typingDelay);
      
      return () => clearTimeout(timer);
    }
  }, [messages, visibleMessages]);
  
  const handleTimestampVisibilityChange = useCallback((isVisible: boolean) => {
    setTimeout(() => {
      setIsTimestampVisible(isVisible);
    }, isVisible ? 0 : 100);
  }, []);
  
  const showCompactHeader = isHeaderScrolled && !isTimestampVisible;
  
  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
    setNewMessageCount(0);
  }, [scrollToBottom]);
  
  useEffect(() => {
    if (isScrolledUp && messages.length > 0) {
      const prevMessageCount = newMessageCount;
      if (prevMessageCount < messages.length) {
        setNewMessageCount(prevMessageCount + 1);
      }
    }
  }, [isScrolledUp, messages.length, newMessageCount]);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  }, [containerRef]);

  useEffect(() => {
    autoScrollOnNewContent();
  }, [visibleMessages, isTyping, autoScrollOnNewContent]);

  const handleSendMessage = useCallback((content: string) => {
    addMessage(content);
    setTimeout(scrollToBottom, 100);
    setNewMessageCount(0);
  }, [addMessage, scrollToBottom]);

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      <div className="h-safe-area-top bg-black flex-shrink-0"></div>
      
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
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <MessageList 
          messages={visibleMessages} 
          onTimestampVisibilityChange={handleTimestampVisibilityChange}
        />
        <div className="h-4"></div>
      </div>
      
      {/* Typing indicator positioned just above the input bar */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            className="px-3 pt-1 pb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.1 }}
          >
            <TypingIndicator showAvatar/>
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
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setFadeOut(true)
      const transitionTimer = setTimeout(() => {
        setLoading(false)
      }, ANIMATION.FINAL_TRANSITION)
      return () => clearTimeout(transitionTimer)
    }, ANIMATION.BOOT_SCREEN_DURATION)

    return () => clearTimeout(bootTimer)
  }, [])

  return (
    <main className="h-full w-full flex justify-center bg-black overflow-hidden">
      <div className="w-full max-w-[500px] h-full">
        {loading ? (
          <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <BootScreen />
          </div>
        ) : (
          <MessagingApp />
        )}
      </div>
      
      <style jsx global>{`
        body {
          background-color: black;
          overflow: hidden;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Added animation for the background pulse */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Existing keyframes */
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 4px 6px rgba(0, 0, 0, 0.1); }
          100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Existing CSS variables and safe area styles */
        :root {
          --sat: env(safe-area-inset-top, 0px);
          --sab: env(safe-area-inset-bottom, 0px);
          --sal: env(safe-area-inset-left, 0px);
          --sar: env(safe-area-inset-right, 0px);
        }
        
        .h-safe-area-top {
          height: var(--sat);
        }
        
        .h-safe-area-bottom {
          height: var(--sab);
        }
      `}</style>
    </main>
  )
}

