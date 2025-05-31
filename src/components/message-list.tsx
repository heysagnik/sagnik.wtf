import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './header';
import MessageBubble from './message-bubble';
import type { MessageType } from '@/lib/types';

interface MessageListProps {
  messages: MessageType[];
  onTimestampVisibilityChange?: (isVisible: boolean) => void;
  skipAnimation?: boolean; 
}

const ANIMATION_CONFIG = {
  default: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20, 
      duration: 0.4 
    }
  },
  skip: {
    initial: { opacity: 1, y: 0 },
    transition: { duration: 0 }
  }
} as const;

const SPACING_CONFIG = {
  top: "h-16 sm:h-20 md:h-24",
  header: "mb-8",
  headerBottom: "h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24",
  messages: "space-y-3 sm:space-y-4 md:space-y-5",
  bottom: "h-6 sm:h-8 md:h-10"
} as const;

const useUniqueMessages = (messages: MessageType[]) => {
  return useMemo(() => 
    [...new Map(messages.map(msg => [msg.id, msg])).values()],
    [messages]
  );
};

const useAnimationProps = (skipAnimation: boolean) => {
  return useMemo(() => 
    skipAnimation ? ANIMATION_CONFIG.skip : ANIMATION_CONFIG.default,
    [skipAnimation]
  );
};

const MessageList = memo<MessageListProps>(({ 
  messages, 
  onTimestampVisibilityChange, 
  skipAnimation = false 
}) => {
  const uniqueMessages = useUniqueMessages(messages);
  const animationProps = useAnimationProps(skipAnimation);
  
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col">
      <div className={`${SPACING_CONFIG.top} flex-shrink-0`} />
      
      <div className={`${SPACING_CONFIG.header} relative`}>
        <Header onTimestampVisibilityChange={onTimestampVisibilityChange} />
      </div>
      
      <div className={`${SPACING_CONFIG.headerBottom} flex-shrink-0`} />
      
      <div className={`${SPACING_CONFIG.messages} mt-auto`}>
        <AnimatePresence mode="sync">
          {uniqueMessages.map((message, index) => (
            <motion.div 
              key={message.id || `msg-${index}`}
              className="w-full"
              {...animationProps}
            >
              <MessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div className={`${SPACING_CONFIG.bottom} flex-shrink-0`} />
      </div>
    </div>
  );
});

MessageList.displayName = 'MessageList';
export default MessageList;