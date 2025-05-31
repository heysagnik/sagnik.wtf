import React, { JSX, useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageReaction } from './message-reaction';
import { ReactionAnimation } from './reaction-animation';

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

const MARKDOWN_PATTERNS = {
  BOLD: /\*\*(.*?)\*\*|__(.*?)__/g,
  ITALIC: /\*(.*?)\*|_(.*?)_/g,
  CODE: /`([^`]+)`/g,
  LINK: /\[([^\]]+)\]\(([^)]+)\)/g,
  HEADER: /^(#{1,3})\s+(.+)$/gm
} as const;

const LONG_PRESS_DURATION = 500;
const MAX_URL_DISPLAY_LENGTH = 35;

const HEADER_CLASSES = {
  1: "text-xl font-bold my-1.5",
  2: "text-lg font-bold my-1",
  3: "text-base font-semibold my-0.5"
} as const;

interface TextMessageProps {
  content: string;
  bubbleClass: string;
  bubbleMaxWidth: string;
}

const useReactions = () => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);

  const handleSelectReaction = (reaction: string) => {
    setShowReactions(false);
    
    setTimeout(() => {
      setAnimatingEmoji(reaction);
      setShowAnimation(true);
      setSelectedReaction(reaction);
    }, 50);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setAnimatingEmoji(null);
  };

  return {
    showReactions,
    selectedReaction,
    showAnimation,
    animatingEmoji,
    setShowReactions,
    handleSelectReaction,
    handleAnimationComplete
  };
};

const useLongPress = (onLongPress: () => void) => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    const timer = setTimeout(onLongPress, LONG_PRESS_DURATION);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return { handleTouchStart, handleTouchEnd };
};

export const TextMessage = ({ content, bubbleClass, bubbleMaxWidth }: TextMessageProps) => {
  const {
    showReactions,
    selectedReaction,
    showAnimation,
    animatingEmoji,
    setShowReactions,
    handleSelectReaction,
    handleAnimationComplete
  } = useReactions();

  const { handleTouchStart, handleTouchEnd } = useLongPress(() => setShowReactions(true));

  const processRegex = useCallback(
    (
      parts: Array<string | React.ReactNode>,
      regex: RegExp,
      createNode: (fullMatch: string, ...capturedGroupsAndCounter: [...(string | undefined)[], number]) => React.ReactNode
    ): Array<string | React.ReactNode> => {
      const result: Array<string | React.ReactNode> = [];
      let nodeCounter = 0;
      
      for (const part of parts) {
        if (typeof part !== 'string') {
          result.push(part);
          continue;
        }
        
        let lastIndex = 0;
        const text = part;
        let match;
        
        regex.lastIndex = 0;
        
        while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            result.push(text.substring(lastIndex, match.index));
          }
          
          const capturedGroups = match.slice(1);
          result.push(createNode(match[0], ...capturedGroups, nodeCounter++));
          
          lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < text.length) {
          result.push(text.substring(lastIndex));
        }
      }
      
      return result;
    },
    []
  );

  const processLine = useCallback(
    (text: string, parentKey: string): React.ReactNode[] => {
      let parts: Array<string | React.ReactNode> = [text];
      const isUserBubble = bubbleClass.includes('bubble-sent');
      
      parts = processRegex(parts, MARKDOWN_PATTERNS.CODE, (match, ...rest) => {
        const idx = rest.pop() as number;
        const codeContent = rest[0];
        return (
          <code key={`${parentKey}-code-${idx}`} className={`px-1.5 py-0.5 rounded text-[15px] font-mono ${
            isUserBubble 
              ? 'bg-white/20 text-white' 
              : 'bg-white/20 dark:bg-gray-700 text-black dark:text-gray-200'
          }`}>
            {codeContent}
          </code>
        );
      });
      
      parts = processRegex(parts, MARKDOWN_PATTERNS.LINK, (match, ...rest) => {
        const idx = rest.pop() as number;
        const [linkText = "", url = ""] = rest.map(item => 
          typeof item === 'string' ? item : String(item || '')
        );
        
        return (
          <a 
            key={`${parentKey}-link-${idx}`}
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`underline decoration-[0.5px] underline-offset-[1.5px] ${
              isUserBubble 
                ? 'text-white/90' 
                : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {linkText}
          </a>
        );
      });
      
      parts = processRegex(parts, URL_REGEX, (match, ...rest) => {
        const idx = rest.pop() as number;
        const url = match.startsWith('http') ? match : `https://${match}`;
        const displayUrl = match.length > MAX_URL_DISPLAY_LENGTH ? `${match.substring(0, 32)}...` : match;
        
        return (
          <a 
            key={`${parentKey}-url-${idx}`}
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`underline decoration-[0.5px] underline-offset-[1.5px] ${
              isUserBubble 
                ? 'text-white/90' 
                : 'text-blue-600 dark:text-blue-400'
            }`}
          >
            {displayUrl}
          </a>
        );
      });
      
      parts = processRegex(parts, MARKDOWN_PATTERNS.BOLD, (match, ...rest) => {
        const idx = rest.pop() as number;
        const content1 = rest[0];
        const content2 = rest[1];
        return (
          <strong key={`${parentKey}-bold-${idx}`} className="font-semibold">
            {content1 || content2}
          </strong>
        );
      });
      
      parts = processRegex(parts, MARKDOWN_PATTERNS.ITALIC, (match, ...rest) => {
        const idx = rest.pop() as number;
        const content1 = rest[0];
        const content2 = rest[1];
        return (
          <em key={`${parentKey}-italic-${idx}`} className="italic">
            {content1 || content2}
          </em>
        );
      });
      
      return parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <span key={`${parentKey}-text-${idx}`}>{part}</span>;
        }
        return part;
      });
    },
    [processRegex, bubbleClass]
  );

  const formatMessage = useCallback(
    (text: string): React.ReactNode[] => {
      try {
        const lines = text.split('\n');
        
        return lines.map((line, lineIndex) => {
          if (line.trim() === '') {
            return <div key={`empty-${lineIndex}`} className="h-[0.5em]" aria-hidden="true" />;
          }
          
          const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
          if (headerMatch) {
            const level = headerMatch[1].length as 1 | 2 | 3;
            const headerContent = processLine(headerMatch[2], `header-${lineIndex}`);
            const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
            
            return (
              <HeaderTag key={`h${level}-${lineIndex}`} className={HEADER_CLASSES[level]}>
                {headerContent}
              </HeaderTag>
            );
          }
          
          return (
            <div 
              key={`line-${lineIndex}`} 
              className={lineIndex < lines.length - 1 ? "mb-[0.35em]" : ""}
            >
              {processLine(line, `line-${lineIndex}`) || " "}
            </div>
          );
        });
      } catch (error) {
        console.error("Error formatting message:", error);
        return [<span key="error" className="text-red-500">Message could not be displayed</span>];
      }
    },
    [processLine]
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowReactions(true);
  };
  
  const formattedContent = useMemo(() => formatMessage(content), [content, formatMessage]);
  const isUserBubble = bubbleClass.includes('bubble-sent');

  return (
    <div 
      className={`${bubbleClass} px-3 py-2 ${bubbleMaxWidth} relative group transition-all duration-200 ${
        isUserBubble 
          ? 'bg-[#007AFF] text-white shadow-sm' 
          : 'bg-[#E5E5EA] dark:bg-[#3A3A3C] text-black dark:text-white shadow-sm'
      }`}
      data-testid="text-message"
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        borderRadius: '18px',
        minHeight: '32px',
        backdropFilter: 'blur(10px)',
        border: isUserBubble ? 'none' : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <MessageReaction 
        isVisible={showReactions} 
        onClose={() => setShowReactions(false)} 
        onSelectReaction={handleSelectReaction} 
      />
      
      {showAnimation && animatingEmoji && (
        <ReactionAnimation 
          emoji={animatingEmoji} 
          onComplete={handleAnimationComplete} 
        />
      )}
      
      {selectedReaction && (
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -top-2 -right-2 text-lg bg-white dark:bg-gray-800 rounded-full h-7 w-7 flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-600"
        >
          {selectedReaction}
        </motion.div>
      )}
      
      <div 
        className={`text-[17px] leading-[22px] font-normal ${
          isUserBubble ? 'text-white' : 'text-black dark:text-white'
        }`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          wordBreak: 'break-word',
          msUserSelect: 'none',
          MozUserSelect: 'none',
          fontWeight: '400',
          letterSpacing: '-0.01em',
        }}
      >
        {formattedContent}
      </div>
      
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-50 text-[10px] text-gray-400 dark:text-gray-500 pointer-events-none transition-opacity`}
      >
        <span className="desktop-hint">Right click</span>
        <span className="mobile-hint">Long press</span>
      </div>
      
      <style jsx>{`
        .desktop-hint { display: none; }
        .mobile-hint { display: inline; }

        @media (hover: hover) {
          .desktop-hint { display: inline; }
          .mobile-hint { display: none; }
        }
        
        @media (hover: hover) {
          .group:active {
            transform: scale(0.98);
          }
          
          .group:active::before {
            content: '';
            position: absolute;
            inset: 0;
            background-color: ${isUserBubble 
              ? 'rgba(255,255,255,0.15)' 
              : 'rgba(0,0,0,0.08)'
            };
            border-radius: inherit;
            pointer-events: none;
          }
        }
        
        @media (hover: none) {
          .group:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};