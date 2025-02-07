'use client'

import { motion } from 'framer-motion';
import React from 'react';

export default function InfiniteMarquee() {
  // Using a constant marquee speed instead of the scroll-based transform
  const marqueeSpeed = 1;

  const marqueeStyle: React.CSSProperties & { '--marquee-speed': string } = {
    maskImage:
      'linear-gradient(to right, transparent, black 10%, black 90%, transparent 100%)',
    WebkitMaskImage:
      'linear-gradient(to right, transparent, black 10%, black 90%, transparent 100%)',
    '--marquee-speed': marqueeSpeed.toString(),
  };

  return (
    <div className="flex flex-col justify-center gap-2">
      {/* First marquee - moving left */}
      <motion.div 
        className="relative flex overflow-x-hidden"
        style={marqueeStyle}
      >
        <div className="animate-marquee whitespace-nowrap py-12">
          <span className="text-[120px] font-bold text-black mx-4 tracking-wide font-clash-display">
            FEATURED WORKS ✦
          </span>
          <span className="text-[120px] font-bold text-black mx-4 tracking-wide font-clash-display">
            FEATURED WORKS ✦
          </span>
          <span className="text-[120px] font-bold text-black mx-4 tracking-wide font-clash-display">
            FEATURED WORKS ✦
          </span>
        </div>
      </motion.div>

      {/* Second marquee - moving right */}
      <motion.div 
        className="relative flex overflow-x-hidden"
        style={marqueeStyle}
      >
        <div className="animate-marquee-reverse whitespace-nowrap py-12">
          <span className="text-[120px] font-bold text-black/20 mx-4 tracking-wide font-clash-display">
            FEATURED WORKS ✦
          </span>
          <span className="text-[120px] font-bold text-black/20 mx-4 tracking-wide font-clash-display">
            FEATURED WORKS ✦
          </span>
          <span className="text-[120px] font-bold text-black/20 mx-4 tracking-wide font-clash-display">
            FEATURED WORKS ✦
          </span>
        </div>
      </motion.div>
    </div>
  );
}