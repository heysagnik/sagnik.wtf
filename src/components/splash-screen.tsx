"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TIMING_CONFIG = {
  displayDuration: 2200,
  fadeDuration: 0.8
} as const;

const ANIMATION_CONFIG = {
  container: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      filter: "blur(8px)",
      transition: {
        duration: TIMING_CONFIG.fadeDuration,
        ease: "easeInOut",
        opacity: { duration: 1.0 },
        scale: { duration: 0.7 }
      }
    }
  },
  avatar: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, delay: 0.2 }
  },
  divider: {
    initial: { width: 0 },
    animate: { width: "60%" },
    transition: { duration: 0.4, delay: 0.3 }
  },
  content: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.4, duration: 0.5 }
  },
  bottomDivider: {
    initial: { width: 0 },
    animate: { width: "40%" },
    transition: { duration: 0.4, delay: 0.5 }
  }
} as const;

const BRAND_DATA = {
  name: "sagnik",
  domain: ".wtf",
  title: "Product developer",
  avatar: "/char.png"
} as const;

const STYLES = {
  container: "flex h-full w-full items-center justify-center bg-black overflow-hidden",
  backgroundGradient: "absolute inset-0 z-0",
  noiseTexture: "absolute inset-0 z-0 opacity-10",
  content: "flex flex-col items-center text-center px-6 z-10 relative",
  avatar: "w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 mb-5",
  avatarImage: "w-full h-full object-cover",
  divider: "h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5",
  bottomDivider: "h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent mt-5",
  title: "text-white/90 text-2xl font-medium tracking-wide",
  domain: "text-blue-500",
  subtitle: "text-white/50 text-sm mt-2 font-light"
} as const;

const BACKGROUND_STYLES = {
  gradient: {
    background: "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.2) 0%, rgba(17, 24, 39, 0.1) 50%, rgba(0, 0, 0, 0) 100%)"
  },
  noise: {
    backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')"
  }
} as const;

type DividerConfig = {
  initial: { width: number | string };
  animate: { width: string };
  transition: { duration: number; delay: number };
};

const useSplashVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, TIMING_CONFIG.displayDuration);
    
    return () => clearTimeout(timer);
  }, []);

  return isVisible;
};

const BackgroundElements = () => (
  <>
    <div className={STYLES.backgroundGradient} style={BACKGROUND_STYLES.gradient} />
    <div className={STYLES.noiseTexture} style={BACKGROUND_STYLES.noise} />
  </>
);

const Avatar = () => (
  <motion.div {...ANIMATION_CONFIG.avatar} className={STYLES.avatar}>
    <Image 
      src={BRAND_DATA.avatar} 
      alt="Avatar" 
      width={64} 
      height={64} 
      className={STYLES.avatarImage} 
    />
  </motion.div>
);

const Divider = ({ config, className }: { config: DividerConfig; className: string }) => (
  <motion.div {...config} className={className} />
);

const BrandContent = () => (
  <motion.div {...ANIMATION_CONFIG.content} className="relative">
    <h2 className={STYLES.title}>
      {BRAND_DATA.name}<span className={STYLES.domain}>{BRAND_DATA.domain}</span>
    </h2>
    <p className={STYLES.subtitle}>{BRAND_DATA.title}</p>
  </motion.div>
);

const SplashScreen = () => {
  const isVisible = useSplashVisibility();

  return (
    <div className={STYLES.container}>
      <BackgroundElements />
      
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div {...ANIMATION_CONFIG.container} className={STYLES.content}>
            <Avatar />
            <Divider config={ANIMATION_CONFIG.divider} className={STYLES.divider} />
            <BrandContent />
            <Divider config={ANIMATION_CONFIG.bottomDivider} className={STYLES.bottomDivider} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashScreen;