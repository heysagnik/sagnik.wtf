"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { useMessages } from "@/hooks/useMessages";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";
import MessageList from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import CompactHeader from "@/components/compact-header";
import NewMessagesNotification from "@/components/new-messages-notification";
import TypingIndicator from "@/components/typing-indicator";

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
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl opacity-30 rounded-full" />
        <div className="relative flex flex-col items-center">
          {currentGreeting < greetings.length && (
            <div 
              className="text-white text-3xl sm:text-4xl font-light tracking-wide transition-all duration-700"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                filter: isVisible ? 'blur(0)' : 'blur(4px)'
              }}
            >
              {greetings[currentGreeting].text}
            </div>
          )}
          <div className="mt-8 h-1 w-16 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white" 
              style={{
                width: `${(currentGreeting / greetings.length) * 100}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MessagingApp() {
  // Fixed: Removed unused destructured variables
  const { messages, isTyping, addMessage } = useMessages();
  const { 
    containerRef, 
    isScrolledUp, 
    isHeaderScrolled, 
    scrollToBottom, 
    autoScrollOnNewContent 
  } = useScrollBehavior();
  
  const [isTimestampVisible, setIsTimestampVisible] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  
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
  }, [isScrolledUp, messages.length, newMessageCount]); // Fixed: Added missing dependency
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
  },  [containerRef]);

  useEffect(() => {
    autoScrollOnNewContent();
  }, [messages, isTyping, autoScrollOnNewContent]);

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
          messages={messages} 
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
            transition={{ duration: 0.2 }}
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
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 4px 6px rgba(0, 0, 0, 0.1); }
          100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
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

