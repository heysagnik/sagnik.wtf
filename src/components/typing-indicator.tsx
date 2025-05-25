import { memo } from 'react';

interface TypingIndicatorProps {
  showAvatar?: boolean;
  skipAnimation?: boolean;
}

const STYLES = {
  container: "flex items-end pl-2",
  bubble: "bg-[#262628] px-3 py-2 rounded-full inline-flex items-center",
  dotsContainer: "flex space-x-1",
  dot: "typing-dot",
  staticDot: "w-[5px] h-[5px] rounded-full bg-[#8e8e93] opacity-80"
} as const;

const ANIMATION_STYLES = `
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
`;

const TypingIndicator = memo<TypingIndicatorProps>(({ skipAnimation = false }) => {
  const dotClass = skipAnimation ? STYLES.staticDot : STYLES.dot;

  return (
    <div className={STYLES.container}>
      <div 
        className={STYLES.bubble}
        role="status"
        aria-label="Someone is typing"
      >
        <div className={STYLES.dotsContainer}>
          <div className={dotClass} />
          <div className={dotClass} />
          <div className={dotClass} />
        </div>
      </div>

      {!skipAnimation && <style jsx>{ANIMATION_STYLES}</style>}
    </div>
  )
})

TypingIndicator.displayName = 'TypingIndicator'
export default TypingIndicator