import { memo, useState, useCallback } from "react"
import { motion } from "framer-motion"

interface NewMessagesNotificationProps {
  count: number
  onClick: () => void
}

const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    scale: [1, 1.03, 1] as number[],
    transition: { 
      y: { type: "spring", stiffness: 200, damping: 20 },
      opacity: { duration: 0.2 },
      scale: { 
        times: [0, 0.5, 1] as number[],
        duration: 2,
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.97 }
} as const;

const GLOW_ANIMATION = {
  animate: {
    boxShadow: [
      "0 0 8px rgba(59, 130, 246, 0.3)",
      "0 0 16px rgba(59, 130, 246, 0.5)",
      "0 0 8px rgba(59, 130, 246, 0.3)"
    ]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const
  }
};

const STYLES = {
  button: `absolute left-1/2 top-[82px] z-[2002] transform -translate-x-1/2 rounded-full py-2 px-5
           bg-blue-500/80 backdrop-blur-md flex items-center justify-center`,
  text: "text-white text-xs sm:text-sm font-medium tracking-wide",
  glow: "absolute inset-0 rounded-full -z-10"
} as const;

const BUTTON_STYLE = {
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.2)"
} as const;

const formatMessageText = (count: number): string => {
  return count === 1 ? "1 new message" : `${count} new messages`;
};

const useNotificationVisibility = (onClick: () => void) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleClick = useCallback(() => {
    onClick();
    setIsVisible(false);
  }, [onClick]);
  
  return { isVisible, handleClick };
};

const NewMessagesNotification = memo<NewMessagesNotificationProps>(({ count, onClick }) => {
  const { isVisible, handleClick } = useNotificationVisibility(onClick);
  const messageText = formatMessageText(count);
  
  if (!isVisible) return null;
  
  return (
    <motion.button
      onClick={handleClick}
      className={STYLES.button}
      {...ANIMATION_CONFIG}
      whileHover={ANIMATION_CONFIG.hover}
      whileTap={ANIMATION_CONFIG.tap}
      style={BUTTON_STYLE}
      aria-label={`${messageText}, tap to view`}
    >
      <span className={STYLES.text}>
        {messageText}
      </span>
      
      <motion.div
        className={STYLES.glow}
        animate={GLOW_ANIMATION.animate}
        transition={GLOW_ANIMATION.transition}
      />
    </motion.button>
  );
});

NewMessagesNotification.displayName = 'NewMessagesNotification';
export default NewMessagesNotification;