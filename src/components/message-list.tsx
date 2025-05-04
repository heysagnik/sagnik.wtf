import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './header';
import Message from './message-bubble';
import type { MessageType } from '@/lib/types';

interface MessageListProps {
  messages: MessageType[];
  onTimestampVisibilityChange?: (isVisible: boolean) => void;
}

const MessageList = memo(({ messages, onTimestampVisibilityChange }: MessageListProps) => {
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
          {[...new Map(messages.map(msg => [msg.id, msg])).values()].map((message, index) => (
            <motion.div 
              key={message.id || `msg-${index}`}
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
              <Message 
                message={message} 
                showAvatar={index === 0 || 
                  (messages[index - 1]?.sender !== message.sender) ||
                  ((Date.now() - (messages[index - 1]?.timestamp as number)) > 300000)
                } 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Added bottom spacing after the last message */}
        <div className="h-6 sm:h-8 md:h-10 flex-shrink-0"></div>
      </div>
    </div>
  );
});

MessageList.displayName = 'MessageList';
export default MessageList;