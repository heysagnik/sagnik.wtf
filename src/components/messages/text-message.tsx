import { JSX, useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageReaction } from './message-reaction';
import { ReactionAnimation } from './reaction-animation';
import { bubbleClassFor, type BubbleProps } from '@/lib/message-styles';
import type { ReactionState } from '@/lib/reactions';

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

interface TextMessageProps extends BubbleProps {
  content: string;
  /** Guest-aggregated reaction counts for this message, and which one (if any) is mine. */
  reactions?: ReactionState;
  onToggleReaction?: (emoji: string) => void;
}

// Reaction picker visibility + the local "burst" animation, which only plays
// for the guest's own action. The counts/mine themselves are server state,
// passed in as props — this hook no longer owns that.
const useReactionUI = (onToggleReaction: ((emoji: string) => void) | undefined, myReaction: string | null) => {
  const [showReactions, setShowReactions] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);

  const handleReactionTap = useCallback((emoji: string) => {
    const isRemoving = myReaction === emoji;
    onToggleReaction?.(emoji);

    if (!isRemoving) {
      setAnimatingEmoji(emoji);
      setShowAnimation(true);
    }
  }, [onToggleReaction, myReaction]);

  const handleSelectReaction = useCallback((emoji: string) => {
    setShowReactions(false);
    setTimeout(() => handleReactionTap(emoji), 50);
  }, [handleReactionTap]);

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    setAnimatingEmoji(null);
  }, []);

  return {
    showReactions,
    showAnimation,
    animatingEmoji,
    setShowReactions,
    handleSelectReaction,
    handleAnimationComplete,
    handleReactionTap,
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

export const TextMessage = ({ content, isUser, maxWidth, isTail, reactions, onToggleReaction }: TextMessageProps) => {
  const myReaction = reactions?.mine ?? null;
  const reactionEntries = useMemo(
    () => Object.entries(reactions?.counts ?? {}).filter(([, count]) => count > 0),
    [reactions]
  );

  const {
    showReactions,
    showAnimation,
    animatingEmoji,
    setShowReactions,
    handleSelectReaction,
    handleAnimationComplete,
    handleReactionTap,
  } = useReactionUI(onToggleReaction, myReaction);

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

      parts = processRegex(parts, MARKDOWN_PATTERNS.CODE, (match, ...rest) => {
        const idx = rest.pop() as number;
        const codeContent = rest[0];
        return (
          <code key={`${parentKey}-code-${idx}`} className={`px-1.5 py-0.5 rounded text-[15px] font-mono ${
            isUser
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
              isUser
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
              isUser
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
    [processRegex, isUser]
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

  return (
    <div
      className={`${bubbleClassFor(isUser, isTail)} px-3 py-2 ${maxWidth} relative group transition-all duration-200`}
      data-testid="text-message"
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        minHeight: '32px',
        border: isUser ? 'none' : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <MessageReaction
        isVisible={showReactions}
        onClose={() => setShowReactions(false)}
        onSelectReaction={handleSelectReaction}
        selectedReaction={myReaction}
      />

      {showAnimation && animatingEmoji && (
        <ReactionAnimation
          key={animatingEmoji}
          emoji={animatingEmoji}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* iMessage-style tapback cluster: one circular badge per distinct
          reaction (not per guest), fanned in a slight overlapping stack above
          the bubble's outer-top corner, with the count as a tiny corner
          badge rather than inline text. */}
      {reactionEntries.length > 0 && (
        <div className={`absolute -top-2.5 flex items-center z-10 ${isUser ? 'left-1' : 'right-1'}`}>
          <AnimatePresence initial={false}>
            {reactionEntries.map(([emoji, count], index) => {
              const isMine = myReaction === emoji;

              return (
                <motion.button
                  key={emoji}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.12, ease: "easeIn" } }}
                  whileHover={{ scale: 1.15, zIndex: 20 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReactionTap(emoji);
                  }}
                  style={{ zIndex: reactionEntries.length - index }}
                  className={`relative flex items-center justify-center h-6 w-6 rounded-full shadow-md ring-2 ring-black cursor-pointer select-none bg-white dark:bg-[#3a3a3c] ${
                    index > 0 ? '-ml-2.5' : ''
                  } ${isMine ? 'border-2 border-blue-500' : 'border border-black/10 dark:border-white/10'}`}
                  aria-label={isMine ? `Remove ${emoji} reaction` : `React with ${emoji}`}
                >
                  <span className="text-[13px] leading-none">{emoji}</span>
                  {count > 1 && (
                    <span className="absolute -bottom-1 -right-1 flex items-center justify-center min-w-[15px] h-[15px] px-[3px] rounded-full bg-[#8e8e93] ring-2 ring-black text-[8px] leading-none font-bold text-white">
                      {count}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <div
        className={`text-[17px] leading-[22px] font-normal ${
          isUser ? 'text-white' : 'text-black dark:text-white'
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

      <style jsx>{`
        @media (hover: hover) {
          .group:active {
            transform: scale(0.98);
          }

          .group:active::before {
            content: '';
            position: absolute;
            inset: 0;
            background-color: ${isUser
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
