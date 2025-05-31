import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReactionAnimationProps {
  emoji: string;
  onComplete: () => void;
}

const ANIMATION_CONFIG = {
  duration: 1200,
  exitDelay: 350,
  backgroundBlur: { duration: 0.25 },
  emojiAnimation: { 
    duration: 1.4, 
    times: [0, 0.3, 0.6, 1],
    ease: "easeOut"
  },
  shadowAnimation: {
    duration: 1.1,
    times: [0, 0.3, 0.6, 1],
    ease: "easeInOut"
  },
  rotationAnimation: {
    duration: 0.8,
    times: [0, 0.6, 1],
    ease: [0.34, 1.31, 0.64, 1]
  },
  particleAnimation: {
    duration: 0.85,
    delay: 0.1,
    ease: "easeOut"
  },
  glowAnimation: {
    duration: 0.9,
    times: [0, 0.3, 0.7, 1],
    ease: "easeOut"
  }
} as const;

const PARTICLE_CONFIGS = [
  { 
    className: "w-3 h-3 top-0 left-[40%]",
    animate: { y: [-2, -12], opacity: [0.7, 0] },
    transition: { duration: 0.7, ease: "easeOut" }
  },
  {
    className: "w-2.5 h-2.5 top-[20%] right-[30%]",
    animate: { y: [-1, -10], x: [0, 5], opacity: [0.6, 0] },
    transition: { duration: 0.65, delay: 0.05, ease: "easeOut" }
  },
  {
    className: "w-2 h-2 bottom-[30%] left-[20%]",
    animate: { y: [0, -8], x: [0, -4], opacity: [0.5, 0] },
    transition: { duration: 0.6, delay: 0.08, ease: "easeOut" }
  }
];

const BackgroundBlur = () => (
  <motion.div 
    className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={ANIMATION_CONFIG.backgroundBlur}
  />
);

const ShadowEffect = ({ emoji }: { emoji: string }) => (
  <motion.div 
    className="absolute inset-0 blur-md opacity-30 scale-90 -z-10"
    animate={{
      opacity: [0.2, 0.4, 0.3, 0.25],
      scale: [0.85, 0.9, 0.95, 0.9],
    }}
    transition={ANIMATION_CONFIG.shadowAnimation}
  >
    {emoji}
  </motion.div>
);

const MainEmoji = ({ emoji }: { emoji: string }) => (
  <motion.div
    animate={{
      rotate: [-2, 3, 0],
      y: [0, -3, 0],
      x: [0, 1, 0],
    }}
    transition={ANIMATION_CONFIG.rotationAnimation}
  >
    {emoji}
  </motion.div>
);

const ParticleEffect = () => (
  <motion.div 
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
    initial={{ scale: 0.6, opacity: 0 }}
    animate={{ 
      scale: [0.8, 1.7],
      opacity: [0.8, 0],
    }}
    transition={ANIMATION_CONFIG.particleAnimation}
  >
    {PARTICLE_CONFIGS.map((config, index) => (
      <motion.div
        key={index}
        className={`absolute bg-white rounded-full blur-sm ${config.className}`}
        animate={config.animate}
        transition={config.transition}
      />
    ))}
  </motion.div>
);

const GlowEffect = () => (
  <motion.div
    className="absolute inset-0 rounded-full bg-white/5 blur-xl -z-20"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: [0, 0.4, 0.2, 0], 
      scale: [0.8, 1.2, 1.4, 1.6]
    }}
    transition={ANIMATION_CONFIG.glowAnimation}
  />
);

export const ReactionAnimation = ({ emoji, onComplete }: ReactionAnimationProps) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, ANIMATION_CONFIG.exitDelay);
    }, ANIMATION_CONFIG.duration);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
        >
          <BackgroundBlur />
          
          <motion.div
            className="text-7xl relative"
            initial={{ scale: 0.1, y: 150, opacity: 0 }}
            animate={{ 
              scale: [0.2, 1.5, 1.35, 1.3],
              opacity: [0, 1, 1, 0.95],
              y: [150, -15, -50, -200],
            }}
            exit={{ 
              opacity: [0.95, 0.7, 0],
              scale: [1.3, 1.1, 0.8],
              y: [-200, -230, -250],
            }}
            transition={ANIMATION_CONFIG.emojiAnimation}
          >
            <ShadowEffect emoji={emoji} />
            <MainEmoji emoji={emoji} />
            <ParticleEffect />
            <GlowEffect />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};