import { memo } from 'react';

interface TypingIndicatorProps {
  showAvatar?: boolean;
}

const TypingIndicator = memo(({ }: TypingIndicatorProps) => {
  return (
    <div className="flex items-end pl-2">
      <div 
        className="bg-[#262628] px-3 py-2 rounded-full inline-flex items-center"
        role="status"
        aria-label="Someone is typing"
      >
        <div className="flex space-x-1">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>

      <style jsx>{`
        .typing-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #8e8e93;
          opacity: 0.8;
          animation: typingAnimation 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typingAnimation {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

export default TypingIndicator;