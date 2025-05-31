"use client";

import { memo, useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

const ANIMATION_CONFIG = {
  plane: {
    offscreenOffset: 50,
    flightDurationMin: 8000,
    flightDurationMax: 12000,
    opacityTransitionPoint: 0.2,
    defaultScale: 0.9,
    shadow: {
      offsetX: -5,
      offsetY: 10,
      scale: 0.8,
      opacity: 0.5,
    }
  }
} as const;

const MAP_CONFIG = {
  defaultDimensions: { width: 300, height: 252 } as { width: number; height: number },
  images: {
    cloud: { src: "/cloud.webp", width: 390, height: 347 },
    plane: { src: "/plane.webp", width: 28, height: 60 },
    planeShadow: { src: "/plane-shadow.webp", width: 28, height: 28 },
    map: { src: "/map-haldia.png" }
  }
} as const;

interface MapWrapperProps {
  locationCity: string;
  className?: string;
}

interface FlightParams {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation: number;
  duration: number;
  startTime: number;
  peakOpacity: number;
}

interface PlaneState {
  x: number;
  y: number;
  rotation: number;
  shadowX: number;
  shadowY: number;
  shadowRotation: number;
  opacity: number;
}

const useMapDimensions = () => {
  const [dimensions, setDimensions] = useState(MAP_CONFIG.defaultDimensions);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(container);
    setDimensions({
      width: container.offsetWidth,
      height: container.offsetHeight,
    });

    return () => resizeObserver.unobserve(container);
  }, []);

  return { dimensions, containerRef };
};

const useFlightAnimation = (mapDimensions: { width: number; height: number }) => {
  const [planeState, setPlaneState] = useState<PlaneState>({
    x: -ANIMATION_CONFIG.plane.offscreenOffset,
    y: 100,
    rotation: 0,
    shadowX: -ANIMATION_CONFIG.plane.offscreenOffset,
    shadowY: 115,
    shadowRotation: 0,
    opacity: 0,
  });

  const animationFrameId = useRef<number | null>(null);
  const currentFlight = useRef<FlightParams | null>(null);

  const generateRandomRoute = useCallback(() => {
    const { width: mapWidth, height: mapHeight } = mapDimensions;
    if (mapWidth === 0 || mapHeight === 0) return;

    const startEdge = Math.floor(Math.random() * 4);
    const { offscreenOffset } = ANIMATION_CONFIG.plane;
    
    const startPositions = [
      { x: Math.random() * mapWidth, y: -offscreenOffset },
      { x: mapWidth + offscreenOffset, y: Math.random() * mapHeight },
      { x: Math.random() * mapWidth, y: mapHeight + offscreenOffset },
      { x: -offscreenOffset, y: Math.random() * mapHeight }
    ];

    const { x: sx, y: sy } = startPositions[startEdge];

    const targetX = mapWidth / 2 + (Math.random() * (mapWidth / 3) - (mapWidth / 6));
    const targetY = mapHeight / 2 + (Math.random() * (mapHeight / 3) - (mapHeight / 6));

    const dxToTarget = targetX - sx;
    const dyToTarget = targetY - sy;
    
    const endX = targetX + dxToTarget * 1.5;
    const endY = targetY + dyToTarget * 1.5;

    const angleToTarget = Math.atan2(dyToTarget, dxToTarget) * (180 / Math.PI);
    const finalRotation = angleToTarget + 90;
    
    const { flightDurationMin, flightDurationMax } = ANIMATION_CONFIG.plane;
    const duration = flightDurationMin + Math.random() * (flightDurationMax - flightDurationMin);

    currentFlight.current = {
      startX: sx,
      startY: sy,
      endX,
      endY,
      rotation: finalRotation,
      duration,
      startTime: performance.now(),
      peakOpacity: 1,
    };
    
    const { shadow } = ANIMATION_CONFIG.plane;
    setPlaneState(prevState => ({ 
      ...prevState,
      x: sx, 
      y: sy, 
      rotation: finalRotation, 
      shadowX: sx + shadow.offsetX, 
      shadowY: sy + shadow.offsetY, 
      shadowRotation: finalRotation,
      opacity: 0
    }));
  }, [mapDimensions]);

  useEffect(() => {
    if (mapDimensions.width > 0 && mapDimensions.height > 0 && !currentFlight.current) {
      generateRandomRoute();
    }
  }, [mapDimensions, generateRandomRoute]);

  useEffect(() => {
    const animatePlane = (timestamp: number) => {
      if (!currentFlight.current || mapDimensions.width === 0) {
        animationFrameId.current = requestAnimationFrame(animatePlane);
        return;
      }

      const flight = currentFlight.current;
      const elapsed = timestamp - flight.startTime;
      const progress = elapsed / flight.duration;

      if (progress >= 1) {
        generateRandomRoute();
        animationFrameId.current = requestAnimationFrame(animatePlane);
        return;
      }
      
      const { opacityTransitionPoint } = ANIMATION_CONFIG.plane;
      let currentOpacity;
      
      if (progress < opacityTransitionPoint) { 
        currentOpacity = (progress / opacityTransitionPoint) * flight.peakOpacity;
      } else if (progress > (1 - opacityTransitionPoint)) { 
        currentOpacity = ((1 - progress) / opacityTransitionPoint) * flight.peakOpacity;
      } else {
        currentOpacity = flight.peakOpacity;
      }
      
      currentOpacity = Math.max(0, Math.min(flight.peakOpacity, currentOpacity));

      const newX = flight.startX + (flight.endX - flight.startX) * progress;
      const newY = flight.startY + (flight.endY - flight.startY) * progress;
      
      const { shadow } = ANIMATION_CONFIG.plane;
      setPlaneState({
        x: newX,
        y: newY,
        rotation: flight.rotation, 
        shadowX: newX + shadow.offsetX,
        shadowY: newY + shadow.offsetY,
        shadowRotation: flight.rotation,
        opacity: currentOpacity,
      });

      animationFrameId.current = requestAnimationFrame(animatePlane);
    };

    animationFrameId.current = requestAnimationFrame(animatePlane);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [generateRandomRoute, mapDimensions]);

  return planeState;
};

const LocationPin = memo(() => (
  <div className="absolute left-1/2 top-[70%] transform -translate-x-1/2 -translate-y-1/2 z-10">
    <span className="relative flex h-6 w-6">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
      <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 border-2 border-white"></span>
    </span>
  </div>
));

LocationPin.displayName = "LocationPin";

const LocationLabel = memo(({ city }: { city: string }) => (
  <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg shadow-md z-20">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="text-red-600"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor"></path>
      <circle cx="12" cy="10" r="5" fill="white"></circle>
    </svg>
    <span className="text-xs font-medium">{city}</span>
  </div>
));

LocationLabel.displayName = "LocationLabel";

const MapInner = memo(({ locationCity, className = "" }: MapWrapperProps) => {
  const { dimensions, containerRef } = useMapDimensions();
  const planeState = useFlightAnimation(dimensions);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <Image
        src={MAP_CONFIG.images.cloud.src}
        width={MAP_CONFIG.images.cloud.width} 
        height={MAP_CONFIG.images.cloud.height}
        alt="Cloud decorative element" 
        draggable="false"
        className="absolute top-0 left-0 w-full h-auto cloud-animation opacity-60 blur-sm z-[1] pointer-events-none"
      />
      
      <div className="relative w-full h-full z-[2]">
        <Image
          src={MAP_CONFIG.images.plane.src}
          width={MAP_CONFIG.images.plane.width} 
          height={MAP_CONFIG.images.plane.height}
          alt="Plane decorative element" 
          draggable="false"
          className="absolute z-[4] pointer-events-none transition-opacity duration-100"
          style={{
            transform: `translate(${planeState.x}px, ${planeState.y}px) rotate(${planeState.rotation}deg) scale(${ANIMATION_CONFIG.plane.defaultScale})`,
            opacity: planeState.opacity,
            willChange: 'transform, opacity',
          }}
        />
        
        <Image
          src={MAP_CONFIG.images.planeShadow.src}
          width={MAP_CONFIG.images.planeShadow.width} 
          height={MAP_CONFIG.images.planeShadow.height}
          alt="Plane shadow decorative element" 
          draggable="false"
          className="absolute z-[3] pointer-events-none transition-opacity duration-100"
          style={{ 
            transform: `translate(${planeState.shadowX}px, ${planeState.shadowY}px) rotate(${planeState.shadowRotation}deg) skewX(-15deg) scale(${ANIMATION_CONFIG.plane.shadow.scale})`,
            opacity: planeState.opacity * ANIMATION_CONFIG.plane.shadow.opacity,
            filter: 'blur(1.5px)',
            willChange: 'transform, opacity',
          }}
        />
        
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src={MAP_CONFIG.images.map.src}
            alt={`Map showing ${locationCity}`}
            fill
            className="object-cover scale-200 -translate-x-10 -translate-y-8"
            priority
          />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 via-black/5 to-transparent z-[5] pointer-events-none"></div>
        
        <LocationPin />
        <LocationLabel city={locationCity} />
      </div>
    </div>
  );
});

MapInner.displayName = "MapInner";

export default function MapWidget({ locationCity }: { locationCity: string }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg bg-gray-100 h-[252px] transition-opacity duration-500 ease-out ${visible ? 'opacity-100 intro-animation-active' : 'opacity-0'}`}
    >
      <style jsx global>{`
        @keyframes intro-swoop { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .intro-animation-active { 
          animation: intro-swoop 0.5s ease-out forwards; 
        }
        @keyframes cloud-drift { 
          0% { transform: translateX(-80%) translateY(-10%); opacity: 0.4; } 
          50% { opacity: 0.7; } 
          100% { transform: translateX(20%) translateY(10%); opacity: 0.4; } 
        }
        .cloud-animation { 
          animation: cloud-drift 70s linear infinite alternate; 
        }
      `}</style>
      <MapInner locationCity={locationCity} />
    </div>
  );
}

export const LocationMessage = ({
  locationCity
}: {
  locationCity: string;
}) => {
  return (
    <div className="rounded-[18px] overflow-hidden shadow-sm w-full max-w-[200px] sm:max-w-[240px]">
      <MapWidget locationCity={locationCity} />
    </div>
  );
};