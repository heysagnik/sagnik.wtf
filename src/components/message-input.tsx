import { motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";

interface MessageInputProps {
  onSend?: (content: string) => void;
  isEnabled?: boolean;
  placeholder?: string;
}

// Replace with your email address
const YOUR_EMAIL = "sahoosagnik1@gmail.com"; 

export const MessageInput = memo(({ 
  onSend, 
  isEnabled = true, 
  placeholder = "Say Hi ..." 
}: MessageInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLInputElement>(null);
  
  // Automatically adjust textarea height based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = "30px";
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = Math.min(120, Math.max(36, scrollHeight)) + "px";
  };
  
  useEffect(() => {
    adjustHeight();
  }, [inputValue]);

  const handleSend = () => {
    if (inputValue.trim() && onSend && isEnabled) {
      const messageToSend = inputValue.trim();
      
      const subject = encodeURIComponent("Message from Portfolio Website");
      const body = encodeURIComponent(messageToSend);
      const mailtoUrl = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
      
      // You can still call onSend if you want to update the local UI as well
      onSend?.(messageToSend);
      
      setInputValue("");
      
      // Reset focus to textarea after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 10);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && isEnabled) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2">
        {/* Camera button */}
        {/* <motion.button 
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white/70"
          whileTap={{ scale: 0.92 }}
          aria-label="Take photo"
          disabled={!isEnabled}
        >
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
            className="text-white/80"
          >
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
            <circle cx="12" cy="13" r="3"></circle>
          </svg>
        </motion.button> */}

        {/* App Store button */}
        <motion.button 
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white/70"
          whileTap={{ scale: 0.92 }}
          aria-label="App Store"
          disabled={!isEnabled}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white/80"
          >
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>
        </motion.button>
        
        <motion.div 
          className={`flex-grow flex items-center bg-white/10 rounded-full transition-all h-9 px-4
                     ${isFocused ? 'ring-1 ring-white/10' : ''}`}
          animate={{
            backgroundColor: isFocused && isEnabled 
              ? "rgba(255, 255, 255, 0.12)" 
              : "rgba(255, 255, 255, 0.1)",
          }}
          initial={false}
          transition={{ duration: 0.2 }}
        >
          <input 
            ref={textareaRef}
            className="bg-transparent text-white w-full resize-none outline-none text-sm placeholder:text-white/40"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={!isEnabled}
          />
        </motion.div>
        
        {/* Send button */}
        <motion.button 
          onClick={handleSend}
          className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full ${
            inputValue.trim() && isEnabled 
              ? "bg-blue-500 text-white" 
              : "bg-white/10 text-white/40"
          }`}
          whileTap={isEnabled && inputValue.trim() ? { scale: 0.95 } : {}}
          initial={false}
          animate={{ 
            opacity: isEnabled ? 1 : 0.7,
            transition: { duration: 0.2 }
          }}
          aria-label="Send message"
          disabled={!isEnabled || !inputValue.trim()}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m12 19V5"></path>
            <path d="m5 12 7-7 7 7"></path>
          </svg>
        </motion.button>
      </div>
      
      <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent mx-auto mt-2.5 rounded-full"></div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';