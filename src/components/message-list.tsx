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
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { 
    type: "spring", 
    stiffness: 260, 
    damping: 20, 
    duration: 0.4 
  }
} as const;

/**
 * MessageList component displays a list of messages with proper spacing and animations
 */
const MessageList = memo<MessageListProps>(({ 
  messages, 
  onTimestampVisibilityChange, 
  skipAnimation = false 
}) => {
  // Deduplicate messages by ID
  const uniqueMessages = useMemo(() => 
    [...new Map(messages.map(msg => [msg.id, msg])).values()],
    [messages]
  );
  
  // Calculate message display properties
  const animationProps = useMemo(() => 
    skipAnimation 
      ? { initial: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : ANIMATION_CONFIG,
    [skipAnimation]
  );
  
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col">
      {/* Top spacing area */}
      <div className="h-16 sm:h-20 md:h-24 flex-shrink-0"></div>
      
      {/* Header section */}
      <div className="mb-8 relative">
        <Header onTimestampVisibilityChange={onTimestampVisibilityChange} />
      </div>
      <div className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 flex-shrink-0"></div>
      
      {/* Messages container */}
      <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-auto">
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
        
        {/* Bottom spacing */}
        <div className="h-6 sm:h-8 md:h-10 flex-shrink-0"></div>
      </div>
    </div>
  );
});

MessageList.displayName = 'MessageList';
export default MessageList;