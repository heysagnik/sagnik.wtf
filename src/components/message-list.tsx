import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './header';
import Message from './message-bubble';
import type { MessageType } from '@/lib/types';

interface MessageListProps {
  messages: MessageType[];
  onTimestampVisibilityChange?: (isVisible: boolean) => void;
  skipAnimation?: boolean; 
}

const MessageList = memo(({ 
  messages, 
  onTimestampVisibilityChange, 
  skipAnimation = false 
}: MessageListProps) => {
  const uniqueMessages = [...new Map(messages.map(msg => [msg.id, msg])).values()];
  
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col">
      {/* Large top spacer - always present */}
      <div className="h-16 sm:h-20 md:h-24 flex-shrink-0"></div>
      
      {/* Header with consistent spacing - always full size */}
      <div className="mb-8 relative">
        <Header onTimestampVisibilityChange={onTimestampVisibilityChange} />
      </div>
      <div className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 flex-shrink-0"></div>
      
      {/* Messages container */}
      <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-auto">
        <AnimatePresence mode="sync">
          {uniqueMessages.map((message, index) => {
            const nextMessage = index < uniqueMessages.length - 1 ? uniqueMessages[index + 1] : null;
            
            const isLast = index === uniqueMessages.length - 1;
            
            const isConsecutiveWithNext = nextMessage && 
              nextMessage.sender === message.sender && 
              ((nextMessage.timestamp as number) - (message.timestamp as number) < 300000); // 5 min threshold
            
            const noTail = !isLast && isConsecutiveWithNext;
            const isTailEndMessage = isLast || !isConsecutiveWithNext;
            
            return (
              <motion.div 
                key={message.id || `msg-${index}`}
                className="w-full"
                initial={skipAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  duration: skipAnimation ? 0 : 0.4 
                }}
              >
                <Message 
                  message={message} 
                  noTail={noTail}
                  isTailEndMessage={isTailEndMessage}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Added bottom spacing after the last message */}
        <div className="h-6 sm:h-8 md:h-10 flex-shrink-0"></div>
      </div>
    </div>
  );
});

MessageList.displayName = 'MessageList';
export default MessageList;