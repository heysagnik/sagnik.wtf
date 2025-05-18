"use client";

import { memo, useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

// --- Constants for Animation & Layout --- 
const PLANE_OFFSCREEN_OFFSET = 50; // How far off-screen the plane starts/ends
const PLANE_FLIGHT_DURATION_MIN = 8000; // ms
const PLANE_FLIGHT_DURATION_MAX = 12000; // ms
const PLANE_OPACITY_TRANSITION_POINT = 0.2; // 20% of flight for fade in/out
const PLANE_SHADOW_OFFSET_X = -5;
const PLANE_SHADOW_OFFSET_Y = 10;
const PLANE_DEFAULT_SCALE = 0.9;
const PLANE_SHADOW_DEFAULT_SCALE = 0.8;

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

const MapInner = memo(({ locationCity, className = "" }: MapWrapperProps) => {
  const [planeState, setPlaneState] = useState({
    x: -PLANE_OFFSCREEN_OFFSET,
    y: 100, // Initial Y, will be updated once dimensions are known
    rotation: 0,
    shadowX: -PLANE_OFFSCREEN_OFFSET,
    shadowY: 115, // Initial Y for shadow
    shadowRotation: 0,
    opacity: 0,
  });

  const animationFrameId = useRef<number | null>(null);
  const currentFlight = useRef<FlightParams | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 300, height: 252 }); // Default/initial

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setMapDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(container);
    // Initial set
    setMapDimensions({
      width: container.offsetWidth,
      height: container.offsetHeight,
    });
    return () => resizeObserver.unobserve(container);
  }, []);

  const generateRandomRoute = useCallback(() => {
    const { width: mapWidth, height: mapHeight } = mapDimensions;
    if (mapWidth === 0 || mapHeight === 0) return; // Avoid division by zero if dimensions not ready

    const startEdge = Math.floor(Math.random() * 4);
    let sx, sy;

    if (startEdge === 0) { // Top
      sx = Math.random() * mapWidth;
      sy = -PLANE_OFFSCREEN_OFFSET;
    } else if (startEdge === 1) { // Right
      sx = mapWidth + PLANE_OFFSCREEN_OFFSET;
      sy = Math.random() * mapHeight;
    } else if (startEdge === 2) { // Bottom
      sx = Math.random() * mapWidth;
      sy = mapHeight + PLANE_OFFSCREEN_OFFSET;
    } else { // Left (default)
      sx = -PLANE_OFFSCREEN_OFFSET;
      sy = Math.random() * mapHeight;
    }

    // Aim towards a general area in the center, or slightly off-center
    const targetX = mapWidth / 2 + (Math.random() * (mapWidth / 3) - (mapWidth / 6));
    const targetY = mapHeight / 2 + (Math.random() * (mapHeight / 3) - (mapHeight / 6));

    const dxToTarget = targetX - sx;
    const dyToTarget = targetY - sy;
    
    // Extend endX, endY to ensure plane flies past the target and off-screen
    const endX = targetX + dxToTarget * 1.5; // Fly further beyond the target
    const endY = targetY + dyToTarget * 1.5;

    const angleToTarget = Math.atan2(dyToTarget, dxToTarget) * (180 / Math.PI);
    const finalRotation = angleToTarget + 90; // Plane image points North (0deg is up)
    
    const duration = PLANE_FLIGHT_DURATION_MIN + Math.random() * (PLANE_FLIGHT_DURATION_MAX - PLANE_FLIGHT_DURATION_MIN);

    currentFlight.current = {
      startX: sx,
      startY: sy,
      endX: endX,
      endY: endY,
      rotation: finalRotation,
      duration,
      startTime: performance.now(),
      peakOpacity: 1,
    };
    
    setPlaneState(prevState => ({ 
      ...prevState, // Preserve other potential state parts if any
      x: sx, y: sy, rotation: finalRotation, 
      shadowX: sx + PLANE_SHADOW_OFFSET_X, 
      shadowY: sy + PLANE_SHADOW_OFFSET_Y, 
      shadowRotation: finalRotation,
      opacity: 0
    }));
  }, [mapDimensions]);

  useEffect(() => {
    // Start first flight only when map dimensions are known
    if (mapDimensions.width > 0 && mapDimensions.height > 0 && !currentFlight.current) {
      generateRandomRoute();
    }
  }, [mapDimensions, generateRandomRoute]);

  useEffect(() => {
    const animatePlane = (timestamp: number) => {
      if (!currentFlight.current || mapDimensions.width === 0) {
        // If no flight or map dimensions not ready, request next frame and wait
        animationFrameId.current = requestAnimationFrame(animatePlane);
        return;
      }

      const flight = currentFlight.current;
      const elapsed = timestamp - flight.startTime;
      const progress = elapsed / flight.duration;

      if (progress >= 1) {
        generateRandomRoute(); // Start a new flight
        animationFrameId.current = requestAnimationFrame(animatePlane);
        return;
      }
      
      let currentOpacity;
      if (progress < PLANE_OPACITY_TRANSITION_POINT) { 
        currentOpacity = (progress / PLANE_OPACITY_TRANSITION_POINT) * flight.peakOpacity;
      } else if (progress > (1 - PLANE_OPACITY_TRANSITION_POINT)) { 
        currentOpacity = ((1 - progress) / PLANE_OPACITY_TRANSITION_POINT) * flight.peakOpacity;
            } else {
        currentOpacity = flight.peakOpacity;
      }
      currentOpacity = Math.max(0, Math.min(flight.peakOpacity, currentOpacity));

      const newX = flight.startX + (flight.endX - flight.startX) * progress;
      const newY = flight.startY + (flight.endY - flight.startY) * progress;
      
      setPlaneState({
        x: newX,
        y: newY,
        rotation: flight.rotation, 
        shadowX: newX + PLANE_SHADOW_OFFSET_X,
        shadowY: newY + PLANE_SHADOW_OFFSET_Y,
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
  }, [generateRandomRoute, mapDimensions]); // Add mapDimensions as dependency

  return (
    // Assign ref to this div for dimension measurement
    <div ref={mapContainerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <Image
        src="/cloud.webp"
        width={390} height={347}
        alt="Cloud decorative element" draggable="false"
        className="absolute top-0 left-0 w-full h-auto cloud-animation opacity-60 blur-sm z-[1] pointer-events-none"
      />
      <div className="relative w-full h-full z-[2]">
        <Image
          src="/plane.webp"
          width={28} height={60}
          alt="Plane decorative element" draggable="false"
          className="absolute z-[4] pointer-events-none transition-opacity duration-100"
          style={{
            transform: `translate(${planeState.x}px, ${planeState.y}px) rotate(${planeState.rotation}deg) scale(${PLANE_DEFAULT_SCALE})`,
            opacity: planeState.opacity,
            willChange: 'transform, opacity',
          }}
        />
        <Image
          src="/plane-shadow.webp"
          width={28} height={28}
          alt="Plane shadow decorative element" draggable="false"
          className="absolute z-[3] pointer-events-none transition-opacity duration-100"
           style={{ 
            transform: `translate(${planeState.shadowX}px, ${planeState.shadowY}px) rotate(${planeState.shadowRotation}deg) skewX(-15deg) scale(${PLANE_SHADOW_DEFAULT_SCALE})`,
            opacity: planeState.opacity * 0.5,
            filter: 'blur(1.5px)',
            willChange: 'transform, opacity',
          }}
        />
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/map-haldia.webp"
            alt={`Map showing ${locationCity}`}
            fill
            className="object-cover scale-200 -translate-x-10 -translate-y-8"
            priority
          />
      </div>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/5 via-black/5 to-transparent z-[5] pointer-events-none"></div>
        <div className="absolute left-1/2 top-[70%] transform -translate-x-1/2 -translate-y-1/2 z-10">
          <span className="relative flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 border-2 border-white"></span>
            </span>
        </div>
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
          <span className="text-xs font-medium">{locationCity}</span>
        </div>
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
        @keyframes intro-swoop { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .intro-animation-active { animation: intro-swoop 0.5s ease-out forwards; }
        @keyframes cloud-drift { 
          0% { transform: translateX(-80%) translateY(-10%); opacity: 0.4; } 
          50% { opacity: 0.7; } 
          100% { transform: translateX(20%) translateY(10%); opacity: 0.4; } 
        }
        .cloud-animation { animation: cloud-drift 70s linear infinite alternate; }
      `}</style>
      <MapInner locationCity={locationCity} />
    </div>
  );
}