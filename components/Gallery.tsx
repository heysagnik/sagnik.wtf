// components/Gallery.tsx
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import Image from "next/image";

const images = [
  { 
    src: '/school.jpg', 
    title: 'DAV School',
    aspectRatio: '4/3'
  },
  { 
    src: '/vit.jpg', 
    title: 'VIT Bhopal',
    aspectRatio: '16/9'
  },
  { 
    src: '/kolkata.png', 
    title: 'Memories',
    aspectRatio: '4/3'
  },
  { 
    src: '/kolkata.png', 
    title: 'Fun Times',
    aspectRatio: '16/9'
  },
  { 
    src: '/howrah.png', 
    title: 'Adventures',
    aspectRatio: '4/3'
  },
  { 
    src: '/kolkata.png', 
    title: 'Fun Times',
    aspectRatio: '16/9'
  },
  { 
    src: '/howrah.png', 
    title: 'Adventures',
    aspectRatio: '4/3'
  },
  { 
    src: '/kolkata.png', 
    title: 'Fun Times',
    aspectRatio: '16/9'
  },
  { 
    src: '/howrah.png', 
    title: 'Adventures',
    aspectRatio: '4/3'
  },
];

interface ImagePosition {
  left: number;
  rotate: number;
  zIndex: number;  // Add zIndex
}

const GalleryCard = React.memo(({
  image,
  index,
  position,
  hovered,
  setHovered,
}: {
  image: typeof images[0];
  index: number;
  position: ImagePosition;
  hovered: number | null;
  setHovered: React.Dispatch<React.SetStateAction<number | null>>;
}) => (
  <div
    onMouseEnter={() => {
      setHovered(index);
    }}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "absolute p-1 bg-white rounded-sm shadow-lg transition-all duration-300 will-change-transform",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}
    style={{
      left: `${position.left}%`,
      transform: `
        translateX(-50%)
        rotate(${hovered === index ? 0 : position.rotate}deg)
      `,
      width: '200px',
      zIndex: hovered === index ? 50 : position.zIndex,
    }}
  >
    <div 
      className="relative overflow-hidden rounded-sm"
      style={{ aspectRatio: image.aspectRatio }}
    >
      <Image
        src={image.src}
        alt={image.title}
        fill
        className="object-cover"
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end p-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-sm md:text-base font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
          {image.title}
        </div>
      </div>
    </div>
  </div>
));

GalleryCard.displayName = "GalleryCard";

const Gallery: React.FC = () => {
  const [positions, setPositions] = useState<ImagePosition[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const newPositions = images.map((_, index) => ({
      left: 15 + (index * 18),
      rotate: Math.random() * 8 - 4,
      zIndex: 10, // Base z-index
    }));
    setPositions(newPositions);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-x-auto overflow-y-visible">
      <div className="absolute inset-0 flex items-center">
        {images.map((image, index) => {
          const position = positions[index];
          if (!position) return null;

          return (
            <GalleryCard
              key={index}
              image={image}
              index={index}
              position={position}
              hovered={hovered}
              setHovered={setHovered}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;