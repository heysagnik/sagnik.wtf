import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REACTIONS = [
    { emoji: '😭', label: 'Crying' },
    { emoji: '💀', label: 'Skull' },
    { emoji: '❤️', label: 'Heart' },
    { emoji: '😂', label: 'Laughing' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '👀', label: 'Eyes' },
    { emoji: '🫢', label: 'Surprise' }
];

interface MessageReactionProps {
    onSelectReaction: (reaction: string) => void;
    onClose: () => void;
    isVisible: boolean;
}

const SPRING_CONFIG = {
    stiff: { type: 'spring', stiffness: 600, damping: 15, mass: 0.6 },
    smooth: { type: 'spring', stiffness: 400, damping: 20, mass: 0.8 },
    quick: { type: 'spring', stiffness: 800, damping: 20, duration: 0.08 }
} as const;

const EASING = {
    easeOut: [0.25, 0.46, 0.45, 0.94],
    easeInOut: [0.32, 0.72, 0, 1]
} as const;

const containerVariants = {
    hidden: { 
        opacity: 0, 
        scale: 0.75, 
        y: 20,
        filter: "blur(4px)"
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            ...SPRING_CONFIG.smooth,
            stiffness: 300,
            damping: 25,
            mass: 1,
            when: "beforeChildren",
            staggerChildren: 0.03,
            delayChildren: 0.05
        }
    },
    exit: {
        opacity: 0,
        scale: 0.85,
        y: 12,
        filter: "blur(2px)",
        transition: {
            duration: 0.2,
            ease: EASING.easeOut,
            when: "afterChildren",
            staggerChildren: 0.02,
            staggerDirection: -1
        }
    }
};

const itemVariants = {
    hidden: { 
        opacity: 0, 
        scale: 0.4, 
        y: 15,
        rotate: -5
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotate: 0,
        transition: SPRING_CONFIG.smooth
    },
    exit: {
        opacity: 0,
        scale: 0.6,
        y: 8,
        rotate: 5,
        transition: {
            duration: 0.15,
            ease: EASING.easeInOut
        }
    }
};

const animationConfigs = {
    itemHover: {
        scale: 1.4,
        y: -3,
        rotate: 2,
        transition: SPRING_CONFIG.stiff
    },
    itemTap: {
        scale: 0.9,
        y: 1,
        transition: SPRING_CONFIG.quick
    },
    backgroundHover: {
        scale: 1.2,
        opacity: 1,
        transition: SPRING_CONFIG.smooth
    },
    emojiHover: {
        filter: "brightness(1.1) saturate(1.2)",
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    }
};

export const MessageReaction = ({ onSelectReaction, onClose, isVisible }: MessageReactionProps) => {
    const reactionRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (reactionRef.current && 
                !reactionRef.current.contains(event.target as Node) && 
                isVisible) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, isVisible]);

    const containerStyle = {
        initial: { 
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(8px)"
        },
        animate: { 
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(12px)"
        },
        transition: { 
            duration: 0.4,
            ease: EASING.easeOut
        }
    };

    const glowStyle = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { 
            opacity: 1, 
            scale: 1.05,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.2
            }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.1 }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isVisible && (
                <motion.div 
                    ref={reactionRef}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute bottom-full mb-2 left-0 -translate-x-4 z-50"
                >
                    <motion.div 
                        className="flex items-center gap-[6px] px-3 py-2 bg-[#242424]/90 backdrop-blur-md rounded-full shadow-2xl border border-white/10"
                        {...containerStyle}
                    >
                        {REACTIONS.map((reaction) => (
                            <motion.button
                                key={reaction.emoji}
                                variants={itemVariants}
                                whileHover={animationConfigs.itemHover}
                                whileTap={animationConfigs.itemTap}
                                onClick={() => onSelectReaction(reaction.emoji)}
                                className="text-[20px] relative focus:outline-none px-1 py-1 rounded-full overflow-hidden"
                                aria-label={`React with ${reaction.label}`}
                                style={{ transformOrigin: 'center' }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/8 rounded-full -z-10"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileHover={animationConfigs.backgroundHover}
                                />
                                <motion.span
                                    style={{ display: 'inline-block' }}
                                    whileHover={animationConfigs.emojiHover}
                                >
                                    {reaction.emoji}
                                </motion.span>
                            </motion.button>
                        ))}
                    </motion.div>
                    
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full -z-10"
                        {...glowStyle}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};