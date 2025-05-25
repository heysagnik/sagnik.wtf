"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const TIMING_CONFIG = {
  DISPLAY_DURATION: 2200,
  FADE_DURATION: 0.8
} as const

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
        duration: TIMING_CONFIG.FADE_DURATION,
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
} as const

const BRAND_DATA = {
  name: "sagnik",
  domain: ".wtf",
  title: "Product developer",
  avatar: "/char.png"
} as const

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, TIMING_CONFIG.DISPLAY_DURATION);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black overflow-hidden">
      {/* Subtle background gradient */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.2) 0%, rgba(17, 24, 39, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
      />
      
      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')"
        }}
      />
      
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            {...ANIMATION_CONFIG.container}
            className="flex flex-col items-center text-center px-6 z-10 relative"
          >
            {/* Logo/avatar element */}
            <motion.div 
              {...ANIMATION_CONFIG.avatar}
              className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 mb-5"
            >
              <Image 
                src={BRAND_DATA.avatar} 
                alt="Avatar" 
                width={64} 
                height={64} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            
            {/* Top divider */}
            <motion.div 
              {...ANIMATION_CONFIG.divider}
              className="h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5"
            />
            
            {/* Main title */}
            <motion.div
              {...ANIMATION_CONFIG.content}
              className="relative"
            >
              <h2 className="text-white/90 text-2xl font-medium tracking-wide">
                {BRAND_DATA.name}<span className="text-blue-500">{BRAND_DATA.domain}</span>
              </h2>
              
              <p className="text-white/50 text-sm mt-2 font-light">
                {BRAND_DATA.title}
              </p>
            </motion.div>
            
            {/* Bottom divider */}
            <motion.div 
              {...ANIMATION_CONFIG.bottomDivider}
              className="h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent mt-5"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SplashScreen;