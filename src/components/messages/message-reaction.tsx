import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Standard set of iMessage reactions
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

export const MessageReaction = ({ onSelectReaction, onClose, isVisible }: MessageReactionProps) => {
    const reactionRef = useRef<HTMLDivElement>(null);
    
    // Close reactions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (reactionRef.current && !reactionRef.current.contains(event.target as Node) && isVisible) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, isVisible]);

    // Animation variants - refined for Apple-like springiness
    const containerVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.85, 
            y: 15 
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 450,
                damping: 22,
                mass: 0.9,
                when: "beforeChildren",
                staggerChildren: 0.025 // Slightly faster staggering
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 8,
            transition: {
                duration: 0.12, // Faster exit to sync better with animation
                ease: [0.32, 0.72, 0, 1]
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.6, 
            y: 8
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 550,
                damping: 14,
                mass: 0.8
            }
        }
    };

    const handleReactionSelect = (emoji: string) => {
        onSelectReaction(emoji);
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
                    className="absolute bottom-full mb-2 left-1/3 translate-x-2 z-50"
                >
                    <motion.div 
                        className="flex items-center gap-[4px] px-2 py-1.5 bg-[#242424]/95 backdrop-blur-sm rounded-full shadow-xl border border-white/5"
                        initial={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)" }}
                        animate={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)" }}
                        transition={{ duration: 0.3 }}
                    >
                        {REACTIONS.map((reaction, index) => (
                            <motion.button
                                key={reaction.emoji}
                                variants={itemVariants}
                                custom={index}
                                whileHover={{ 
                                    scale: 1.35,
                                    y: -1,
                                    transition: { 
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 10,
                                        mass: 0.8
                                    }
                                }}
                                whileTap={{ 
                                    scale: 0.85,
                                    transition: { 
                                        type: 'spring',
                                        stiffness: 300,
                                        duration: 0.1
                                    }
                                }}
                                onClick={() => handleReactionSelect(reaction.emoji)}
                                className="text-[19px] relative focus:outline-none px-0.5 py-0.5"
                                aria-label={`React with ${reaction.label}`}
                            >
                                {reaction.emoji}
                                <motion.div
                                    className="absolute inset-0 bg-white/5 rounded-full -z-10"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                />
                            </motion.button>
                        ))}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};