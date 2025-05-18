"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import BootScreen from "@/components/boot-screen";
import MessagingApp from "@/components/messaging-app";

// Animation timing constants (in ms)
const ANIMATION = {
  INITIAL_DELAY: 100,
  FINAL_TRANSITION: 1000,
};

export default function HomePageContent() {
  const searchParams = useSearchParams();
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [fadeOutBootScreen, setFadeOutBootScreen] = useState(false);
  const bootScreenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [charImageLoaded, setCharImageLoaded] = useState(false);
  const [skipIntroAnimation, setSkipIntroAnimation] = useState(false);

  // Check if user is navigating within the same domain based on query parameter
  useEffect(() => {
    const fromParam = searchParams.get('from');
    
    if (fromParam === 'home' || fromParam === 'blog') {
      setShowBootScreen(false);
      setSkipIntroAnimation(true);
      console.log("Skipping animations due to navigation from within site, fromParam:", fromParam);
    }
  }, [searchParams]);
  
  // Handle character image preloading
  useEffect(() => {
    let charLoaded = false;
    let mapLoaded = false;
    
    const charImg = new window.Image();
    charImg.src = "/char.png";
    charImg.onload = () => {
      console.log("Character image loaded");
      if (mapLoaded) {
        setCharImageLoaded(true);
      } else {
        charLoaded = true;
      }
    };
    charImg.onerror = (error) => {
      console.error("Failed to load character image:", error);
      if (mapLoaded) {
        setCharImageLoaded(true);
      } else {
        charLoaded = true;
      }
    };
    
    const mapImg = new window.Image();
    mapImg.src = "/map-haldia.webp";
    mapImg.onload = () => {
      console.log("Map image loaded");
      if (charLoaded) {
        setCharImageLoaded(true);
      } else {
        mapLoaded = true;
      }
    };
    mapImg.onerror = (error) => {
      console.error("Failed to load map image:", error);
      if (charLoaded) {
        setCharImageLoaded(true);
      } else {
        mapLoaded = true;
      }
    };
  }, []);

  // Transition from boot screen to messaging app
  useEffect(() => {
    if (showBootScreen && !fadeOutBootScreen) {
      if (charImageLoaded) {
        console.log("Character loaded, proceeding with boot sequence");
        
        bootScreenTimerRef.current = setTimeout(() => {
          console.log("Starting fade out animation");
          setFadeOutBootScreen(true);
        }, 2000); // Time to display boot screen after resources are loaded
      }
    }
    return () => {
      if (bootScreenTimerRef.current) {
        clearTimeout(bootScreenTimerRef.current);
        bootScreenTimerRef.current = null;
      }
    };
  }, [showBootScreen, fadeOutBootScreen, charImageLoaded]);

  useEffect(() => {
    if (fadeOutBootScreen && !transitionTimerRef.current) {
      transitionTimerRef.current = setTimeout(() => {
        setShowBootScreen(false);
      }, ANIMATION.FINAL_TRANSITION);
    }
    
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [fadeOutBootScreen]);

  return (
    <main className="h-full w-full flex justify-center bg-black overflow-hidden">
      <div className="w-full max-w-[500px] h-full">
        {showBootScreen ? (
          <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${fadeOutBootScreen ? 'opacity-0' : 'opacity-100'}`}>
            <BootScreen />
          </div>
        ) : (
          <MessagingApp skipIntroAnimation={skipIntroAnimation} />
        )}
      </div>
    </main>
  );
}