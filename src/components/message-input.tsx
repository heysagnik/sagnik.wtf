import { motion } from "framer-motion";
import { memo, useCallback, useRef, useState } from "react";

interface MessageInputProps {
  onSend?: (content: string) => void;
  isEnabled?: boolean;
  placeholder?: string;
}

const EMAIL_CONFIG = {
  address: "sahoosagnik1@gmail.com",
  subject: "Message from Portfolio Website"
} as const;

const ANIMATION_CONFIG = {
  tap: { scale: 0.92 },
  focus: { backgroundColor: "rgba(255, 255, 255, 0.12)" },
  blur: { backgroundColor: "rgba(255, 255, 255, 0.1)" },
  opacity: { duration: 0.2 },
  background: { duration: 0.2 }
} as const;

const AppStoreIcon = memo(() => (
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
));

AppStoreIcon.displayName = 'AppStoreIcon';

const SendIcon = memo(() => (
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
));

SendIcon.displayName = 'SendIcon';

const AppStoreButton = memo(({ isEnabled }: { isEnabled: boolean }) => (
  <motion.button 
    className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white/70 focus:outline-none"
    whileTap={ANIMATION_CONFIG.tap}
    aria-label="App Store"
    disabled={!isEnabled}
  >
    <AppStoreIcon />
  </motion.button>
));

AppStoreButton.displayName = 'AppStoreButton';

const MessageInput = memo<MessageInputProps>(({ 
  onSend, 
  isEnabled = true, 
  placeholder = "Say Hi ..." 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const createMailtoLink = useCallback((message: string) => {
    const subject = encodeURIComponent(EMAIL_CONFIG.subject);
    const body = encodeURIComponent(message);
    return `mailto:${EMAIL_CONFIG.address}?subject=${subject}&body=${body}`;
  }, []);
  
  const handleSend = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue || !isEnabled) return;
    
    window.location.href = createMailtoLink(trimmedValue);
    onSend?.(trimmedValue);
    setInputValue("");
    
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [inputValue, isEnabled, onSend, createMailtoLink]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && isEnabled) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend, isEnabled]);

  const canSend = inputValue.trim() && isEnabled;

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-2">
        <AppStoreButton isEnabled={isEnabled} />
        
        <motion.div 
          className="flex-grow flex items-center bg-white/10 rounded-full transition-all h-9 px-4"
          animate={isFocused && isEnabled ? ANIMATION_CONFIG.focus : ANIMATION_CONFIG.blur}
          initial={false}
          transition={ANIMATION_CONFIG.background}
        >
          <input 
            ref={inputRef}
            className="bg-transparent text-white w-full resize-none outline-none border-none text-sm placeholder:text-white/40 focus:outline-none focus:border-none focus:ring-0"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={!isEnabled}
            style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
          />
        </motion.div>
        
        <motion.button 
          onClick={handleSend}
          className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full focus:outline-none ${
            canSend 
              ? "bg-blue-500 text-white" 
              : "bg-white/10 text-white/40"
          }`}
          whileTap={canSend ? ANIMATION_CONFIG.tap : {}}
          initial={false}
          animate={{ 
            opacity: isEnabled ? 1 : 0.7,
            transition: ANIMATION_CONFIG.opacity
          }}
          aria-label="Send message"
          disabled={!canSend}
        >
          <SendIcon />
        </motion.button>
      </div>
      
      <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-white/5 to-transparent mx-auto mt-2.5 rounded-full"></div>
    </div>
  );
});

MessageInput.displayName = 'MessageInput';
export { MessageInput };