import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING } from '@/lib/motion';
import { REACTIONS } from '@/lib/reactions';

interface MessageReactionProps {
  onSelectReaction: (reaction: string) => void;
  onClose: () => void;
  isVisible: boolean;
  selectedReaction?: string | null;
}

const containerVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 25,
      mass: 0.8,
      staggerChildren: 0.025,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 4,
    transition: { duration: 0.12, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 24 },
  },
};

export const MessageReaction = ({
  onSelectReaction,
  onClose,
  isVisible,
  selectedReaction,
}: MessageReactionProps) => {
  const reactionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (reactionRef.current && !reactionRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={reactionRef}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute bottom-full mb-2.5 left-0 z-50 select-none"
        >
          <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#1c1c1e]/90 dark:bg-[#2c2c2e]/90 backdrop-blur-xl rounded-full shadow-xl border border-white/10">
            {REACTIONS.map((emoji) => {
              const isSelected = selectedReaction === emoji;

              return (
                <motion.button
                  key={emoji}
                  variants={itemVariants}
                  whileHover={{ scale: 1.3, y: -2, transition: SPRING.quick }}
                  whileTap={{ scale: 0.85, transition: SPRING.quick }}
                  onClick={() => onSelectReaction(emoji)}
                  className={`relative p-1.5 rounded-full text-xl leading-none focus:outline-none transition-colors ${
                    isSelected ? 'bg-white/15' : 'hover:bg-white/10'
                  }`}
                  aria-label={`React with ${emoji}`}
                >
                  <span className="block transform-gpu">{emoji}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};