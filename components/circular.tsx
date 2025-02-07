import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
}

interface Props {
  items: CarouselItem[];
}

const CircularCarousel = ({ items }: Props) => {
  const [angle, setAngle] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = typeof window !== 'undefined' ? window.innerWidth / 2.5 : 500;
  const center = {
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 1.5 : 400,
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setAngle(prev => prev + (e.deltaY > 0 ? 0.1 : -0.1));
  };

  const getPosition = (index: number) => {
    const itemAngle = angle + ((2 * Math.PI) / items.length) * index;
    const x = center.x + radius * Math.cos(itemAngle) - 150;
    const y = center.y + radius * Math.sin(itemAngle) - 200;
    const rotateY = (itemAngle * 180) / Math.PI + 90;
    const scale = 0.8 + Math.cos(itemAngle) * 0.2;

    return { x, y, rotateY, scale };
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        className="relative w-full h-screen perspective-[1000px]"
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="absolute w-[300px] h-[400px] origin-center"
              initial={getPosition(index)}
              animate={getPosition(index)}
              transition={{
                type: "spring",
                stiffness: 60,
                damping: 20
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden
                            shadow-[0_0_30px_rgba(0,0,0,0.5)] transform-gpu">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300"
                />
                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t 
                              from-black/70 to-transparent">
                  <h3 className="text-white text-xl font-bold">
                    {item.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CircularCarousel;