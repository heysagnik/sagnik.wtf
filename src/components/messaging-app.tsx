"use client"

import { useState, useEffect, useRef, useMemo, memo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Message from "./message-bubble"
import TypingIndicator from "./typing-indicator"
import type { MessageType } from "@/lib/types"
import { generateInitialMessages } from "@/lib/data"

const ScrollToBottomButton = memo(({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className="absolute bottom-24 right-4 z-50 rounded-full p-2.5 bg-white/10 backdrop-blur-md flex items-center justify-center"
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 } 
    }}
    exit={{ opacity: 0, scale: 0.8, y: 10 }}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
    whileTap={{ scale: 0.95 }}
    style={{
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
      border: "1px solid rgba(255, 255, 255, 0.15)"
    }}
    aria-label="Scroll to bottom"
  >
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 256 256"
        className="text-white/90"
        fill="currentColor"
      >
        <path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z"></path>
      </svg>
  </motion.button>
));
ScrollToBottomButton.displayName = 'ScrollToBottomButton';

const PullToRefreshIndicator = memo(({ pullDistance, rotation }: { pullDistance: number, rotation: number }) => (
  <div 
    className="absolute left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300"
    style={{ 
      top: Math.max(0, pullDistance - 50),
      opacity: pullDistance > 20 ? Math.min(1, pullDistance / 60) : 0
    }}
  >
    {pullDistance > 60 ? (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl py-3 px-5 flex items-center justify-center border border-white/10 shadow-lg">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 ring-2 ring-blue-500/30">
          <Image
            src="https://github.com/heysagnik.png" 
            alt="@heysagnik" 
            width={32}
            height={32}
            priority
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white/90 font-medium text-sm">@heysagnik</div>
      </div>
    ) : (
      <div className="bg-white/10 backdrop-blur-xl rounded-full p-3 flex items-center justify-center border border-white/10 shadow-lg">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-white/90 drop-shadow-md transition-transform duration-200"
          style={{
            transform: `rotate(${rotation}deg)`
          }}
        >
          <polyline points="1 4 1 10 7 10"></polyline>
          <polyline points="23 20 23 14 17 14"></polyline>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
        </svg>
      </div>
    )}
  </div>
));
PullToRefreshIndicator.displayName = 'PullToRefreshIndicator';

const MessageInput = memo(() => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = "36px";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = Math.min(120, Math.max(36, scrollHeight)) + "px";
  };
  
  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim()) {
      // Handle sending message here
      setInputValue("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="px-3 py-3">
      <motion.div 
        className="flex items-end gap-2 rounded-2xl p-1 transition-all border border-white/10"
        animate={{
          backgroundColor: isFocused ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.05)",
          boxShadow: isFocused ? "0 0 15px rgba(255, 255, 255, 0.05)" : "none"
        }}
        initial={false}
      >
        {/* Plus icon */}
        <motion.button 
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
          whileTap={{ scale: 0.92 }}
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          aria-label="Add content"
        >
            <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            fill="currentColor" 
            viewBox="0 0 256 256" 
            className="text-white"
            >
            <path d="M253.93,154.63c-1.32-1.46-24.09-26.22-61-40.56-1.72-18.42-8.46-35.17-19.41-47.92C158.87,49,137.58,40,112,40,60.48,40,26.89,86.18,25.49,88.15a8,8,0,0,0,13,9.31C38.8,97.05,68.81,56,112,56c20.77,0,37.86,7.11,49.41,20.57,7.42,8.64,12.44,19.69,14.67,32A140.87,140.87,0,0,0,140.6,104c-26.06,0-47.93,6.81-63.26,19.69C63.78,135.09,56,151,56,167.25A47.59,47.59,0,0,0,69.87,201.3c9.66,9.62,23.06,14.7,38.73,14.7,51.81,0,81.18-42.13,84.49-84.42a161.43,161.43,0,0,1,49,33.79,8,8,0,1,0,11.86-10.74Zm-94.46,21.64C150.64,187.09,134.66,200,108.6,200,83.32,200,72,183.55,72,167.25,72,144.49,93.47,120,140.6,120a124.34,124.34,0,0,1,36.78,5.68C176.93,144.44,170.46,162.78,159.47,176.27Z"></path>
            </svg></motion.button>
        
        <div className="flex-grow relative">
          <textarea 
            ref={textareaRef}
            className="bg-transparent text-white/90 w-full px-3 py-2 resize-none outline-none text-sm rounded-lg placeholder:text-white/40 transition-colors"
            placeholder="Type a message..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            style={{minHeight: "36px", maxHeight: "120px"}}
          />
        </div>
        
        {/* Send button */}
        <motion.button 
          onClick={handleSend}
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white/90"
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
          aria-label="Send message"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 256 256" 
            width="18" 
            height="18" 
            className="text-white"
          >
            <rect width="256" height="256" fill="none"/>
            <line x1="144" y1="128" x2="80" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
            <path d="M48.49,221.28A8,8,0,0,0,59.93,231l168-96.09a8,8,0,0,0,0-14l-168-95.85a8,8,0,0,0-11.44,9.67L80,128Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
          </svg>
        </motion.button>
      </motion.div>
      <div className="h-0.5 w-[40%] bg-gradient-to-r from-transparent via-white/10 to-transparent mx-auto mt-3 rounded-full"></div>
    </div>
  );
});
MessageInput.displayName = 'MessageInput';

export default function MessagingApp() {
  // State and refs remain unchanged
  const [allMessages, setAllMessages] = useState<MessageType[]>([])
  const [visibleMessages, setVisibleMessages] = useState<MessageType[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isScrolledUp, setIsScrolledUp] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isInitialScroll = useRef(true)
  const isAutoScrolling = useRef(false)
  const lastScrollTop = useRef(0)

  // Effects and handlers remain unchanged
  useEffect(() => {
    setAllMessages(generateInitialMessages())
  }, [])

  useEffect(() => {
    if (allMessages.length === 0) return;
    
    if (currentIndex === 0) {
      setVisibleMessages([allMessages[0]])
      setCurrentIndex(1)
      return;
    }
    
    if (currentIndex < allMessages.length) {
      setIsTyping(true)
      
      const message = allMessages[currentIndex]
      const typingDelay = Math.min(1500, Math.max(1000, message.content.length * 30))
      
      const typingTimer = setTimeout(() => {
        setIsTyping(false)
        setVisibleMessages(prev => [...prev, message])
        setCurrentIndex(currentIndex + 1)
      }, typingDelay)
      
      return () => clearTimeout(typingTimer)
    }
  }, [currentIndex, allMessages])

  useEffect(() => {
    if (!messagesContainerRef.current) return;

    const handleScroll = () => {
      if (!messagesContainerRef.current || isAutoScrolling.current) return;

      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
      
      setIsScrolledUp(!isAtBottom);
      
      if (scrollTop < 0) {
        const pullAmount = Math.min(80, Math.abs(scrollTop / 2));
        setPullDistance(pullAmount);
      } else {
        setPullDistance(0);
      }
      
      lastScrollTop.current = scrollTop;
    };

    const container = messagesContainerRef.current;
    container.addEventListener("scroll", handleScroll);
    
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    
    if (isInitialScroll.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      isInitialScroll.current = false;
    } else if (!isScrolledUp) {
      isAutoScrolling.current = true;
      
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 300);
    }
  }, [visibleMessages, isTyping, isScrolledUp]);

  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;
    
    isAutoScrolling.current = true;
    setIsScrolledUp(false);
    
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      isAutoScrolling.current = false;
    }, 300);
  };

  const rotation = useMemo(() => Math.min(180, (pullDistance / 80) * 180), [pullDistance]);

  // Improved responsive return JSX
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      {/* Safe area spacer for mobile devices with notches */}
      <div className="h-safe-area-top bg-black flex-shrink-0"></div>
      
      {/* Top gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-20 z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-b from-black via-black/80 to-transparent"></div>
      </div>
      
      {/* Pull to refresh indicator */}
      <PullToRefreshIndicator pullDistance={pullDistance} rotation={rotation} />
      
      {/* Main scrollable messages container */}
      <div 
        ref={messagesContainerRef} 
        className="flex-1 px-3 sm:px-4 md:px-6 overflow-y-auto overflow-x-hidden overscroll-contain flex flex-col"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Top spacing - adjusts for different screen sizes */}
        <div className="h-24 sm:h-32 md:h-40 flex-shrink-0"></div>
        
        {/* Messages container with responsive spacing */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-auto w-full max-w-3xl mx-auto">
          <AnimatePresence>
            {visibleMessages.map((message, index) => (
              <motion.div 
                key={index}
                className="w-full"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  duration: 0.4 
                }}
              >
                <Message message={message} showAvatar={true} />
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                key="typing"
                className="w-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Bottom padding to ensure messages aren't hidden behind input */}
        <div className="h-4 sm:h-6 md:h-8 flex-shrink-0"></div>
      </div>
      
      {/* Scroll to bottom button */}
      <AnimatePresence>
        {isScrolledUp && <ScrollToBottomButton onClick={scrollToBottom} />}
      </AnimatePresence>
      
      {/* Input container with responsive sizing */}
      <div className="bg-black/95 backdrop-blur-sm w-full flex-shrink-0 border-t border-white/5">
        <div className="absolute top-[-1px] inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-3xl mx-auto w-full">
          <MessageInput />
        </div>
      </div>
      
      {/* Safe area bottom spacer for mobile devices */}
      <div className="h-safe-area-bottom bg-black w-full flex-shrink-0"></div>
      
      {/* Global styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 4px 6px rgba(0, 0, 0, 0.1); }
          100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
        }
        
        /* Define safe area variables with fallbacks */
        :root {
          --sat: env(safe-area-inset-top, 0px);
          --sab: env(safe-area-inset-bottom, 0px);
          --sal: env(safe-area-inset-left, 0px);
          --sar: env(safe-area-inset-right, 0px);
        }
        
        /* Apply safe area spacers */
        .h-safe-area-top {
          height: var(--sat);
        }
        
        .h-safe-area-bottom {
          height: var(--sab);
        }
      `}</style>
    </div>
  )
}
