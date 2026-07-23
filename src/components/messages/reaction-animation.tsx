import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface ReactionAnimationProps {
  emoji: string;
  onComplete: () => void;
}

const getEmojiAnimationConfig = (emoji: string) => {
  switch (emoji) {
    case '❤️':
      return {
        duration: 1200,
        hero: {
          scale: [0, 1.5, 1.25, 1.6, 0],
          y: [10, -25, -45, -75],
          rotate: [0, -6, 6, 0],
        },
        heroTransition: { duration: 1.15, ease: [0.34, 1.56, 0.64, 1] },
        particles: [
          { x: -35, y: -65, scale: 0.9, delay: 0, rotate: -15 },
          { x: 35, y: -65, scale: 0.9, delay: 0.05, rotate: 15 },
          { x: -18, y: -85, scale: 1.15, delay: 0.08, rotate: -8 },
          { x: 18, y: -85, scale: 1.15, delay: 0.1, rotate: 8 },
          { x: 0, y: -105, scale: 1.3, delay: 0.12, rotate: 0 },
        ],
      };

    case '🔥':
      return {
        duration: 1100,
        hero: {
          scale: [0.2, 1.7, 1.3, 0.4],
          y: [15, -45, -80, -120],
          rotate: [-15, 15, -10, 5, 0],
        },
        heroTransition: { duration: 1.0, ease: "easeOut" },
        particles: [
          { x: -15, y: -70, scale: 0.9, delay: 0, rotate: -10 },
          { x: 15, y: -75, scale: 1.0, delay: 0.03, rotate: 10 },
          { x: -8, y: -100, scale: 1.2, delay: 0.06, rotate: -5 },
          { x: 8, y: -110, scale: 1.1, delay: 0.09, rotate: 5 },
          { x: -25, y: -50, scale: 0.75, delay: 0.04, rotate: -20 },
          { x: 25, y: -55, scale: 0.8, delay: 0.07, rotate: 20 },
        ],
      };

    case '😂':
      return {
        duration: 1200,
        hero: {
          scale: [0, 1.5, 1.2, 1.4, 0.8, 0],
          x: [0, -15, 15, -10, 5, 0],
          y: [10, -30, -45, -60, -75],
          rotate: [0, -25, 25, -20, 15, 0],
        },
        heroTransition: { duration: 1.15, ease: "easeInOut" },
        particles: [
          { x: -45, y: -40, scale: 1.0, delay: 0, rotate: -30 },
          { x: 45, y: -40, scale: 1.0, delay: 0.05, rotate: 30 },
          { x: -25, y: -70, scale: 1.2, delay: 0.08, rotate: -15 },
          { x: 25, y: -70, scale: 1.2, delay: 0.1, rotate: 15 },
          { x: 0, y: -55, scale: 0.8, delay: 0.03, rotate: 0 },
        ],
      };

    case '💀':
      return {
        duration: 1250,
        hero: {
          scale: [0, 1.4, 1.3, 1.4, 0],
          x: [0, -10, 10, -8, 8, -4, 0],
          y: [10, -25, -55, -85],
          rotate: [0, -10, 10, -5, 5, 0],
        },
        heroTransition: { duration: 1.2, ease: "easeInOut" },
        particles: [
          { x: -50, y: -45, scale: 0.8, delay: 0.02, rotate: -30 },
          { x: 50, y: -45, scale: 0.8, delay: 0.05, rotate: 30 },
          { x: -30, y: -75, scale: 1.0, delay: 0.08, rotate: -15 },
          { x: 30, y: -75, scale: 1.0, delay: 0.1, rotate: 15 },
          { x: 0, y: -95, scale: 1.2, delay: 0.12, rotate: 0 },
        ],
      };

    case '😯':
      return {
        duration: 1100,
        hero: {
          scale: [0, 1.8, 1.4, 0.9, 0],
          y: [10, -35, -55, -70],
          rotate: [0, 0, 0, 0],
        },
        heroTransition: { duration: 1.05, ease: [0.175, 0.885, 0.32, 1.275] },
        // 8 Radial Starburst Directional Particles
        particles: [
          { x: 0, y: -75, scale: 1.1, delay: 0, rotate: 0 },
          { x: 55, y: -55, scale: 1.0, delay: 0.02, rotate: 45 },
          { x: 75, y: 0, scale: 0.9, delay: 0.04, rotate: 90 },
          { x: 55, y: 55, scale: 0.8, delay: 0.06, rotate: 135 },
          { x: 0, y: 70, scale: 0.8, delay: 0.08, rotate: 180 },
          { x: -55, y: 55, scale: 0.8, delay: 0.06, rotate: 225 },
          { x: -75, y: 0, scale: 0.9, delay: 0.04, rotate: 270 },
          { x: -55, y: -55, scale: 1.0, delay: 0.02, rotate: 315 },
        ],
      };

    case '😢':
      return {
        duration: 1200,
        hero: {
          scale: [0, 1.3, 1.1, 0.6, 0],
          y: [0, -30, -15, 30, 60],
          rotate: [-6, 6, -4, 4, 0],
        },
        heroTransition: { duration: 1.15, ease: "easeIn" },
        particles: [
          { x: -20, y: -20, scale: 0.9, delay: 0, rotate: -10 },
          { x: 20, y: -20, scale: 0.9, delay: 0.04, rotate: 10 },
          { x: -35, y: 15, scale: 1.1, delay: 0.1, rotate: -15 },
          { x: 35, y: 15, scale: 1.1, delay: 0.12, rotate: 15 },
          { x: 0, y: 45, scale: 1.2, delay: 0.15, rotate: 0 },
        ],
      };

    case '👍':
    default:
      return {
        duration: 1050,
        hero: {
          scale: [0, 1.75, 1.3, 0],
          y: [20, -45, -60, -75],
          rotate: [-20, 0, -5, 0],
        },
        heroTransition: { duration: 1.0, ease: [0.34, 1.56, 0.64, 1] },
        particles: [
          { x: -35, y: -50, scale: 0.85, delay: 0, rotate: -20 },
          { x: 35, y: -50, scale: 0.85, delay: 0.03, rotate: 20 },
          { x: -18, y: -75, scale: 1.1, delay: 0.05, rotate: -10 },
          { x: 18, y: -75, scale: 1.1, delay: 0.07, rotate: 10 },
          { x: 0, y: -90, scale: 1.25, delay: 0.09, rotate: 0 },
        ],
      };
  }
};

export const ReactionAnimation = ({ emoji, onComplete }: ReactionAnimationProps) => {
  const config = getEmojiAnimationConfig(emoji);

  useEffect(() => {
    const timer = setTimeout(onComplete, config.duration);
    return () => clearTimeout(timer);
  }, [onComplete, config.duration]);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Impact flash — a quick radial pulse right as the reaction lands,
          giving the burst some weight before the particles scatter. */}
      <motion.div
        initial={{ opacity: 0.55, scale: 0.3 }}
        animate={{ opacity: 0, scale: 2.1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute w-10 h-10 rounded-full bg-white/40 blur-md"
      />

      {/* Custom Tailored Directional Particles */}
      {config.particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.2, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: p.x,
            y: p.y,
            scale: [0.2, p.scale, p.scale * 0.9, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: config.duration / 1000 * 0.85,
            delay: p.delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute text-xl select-none transform-gpu"
        >
          {emoji}
        </motion.span>
      ))}

      {/* Custom Tailored Main Hero Emoji Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 10 }}
        animate={{
          opacity: [0, 1, 1, 0],
          ...config.hero,
        }}
        transition={config.heroTransition}
        className="text-4xl select-none transform-gpu drop-shadow-lg"
      >
        {emoji}
      </motion.div>
    </div>
  );
};