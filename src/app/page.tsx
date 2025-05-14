"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Location } from '@/lib/types';
import { MusicPlaylist } from "@/components/music-widget";
import MapWidget from "@/components/map-widget";
import BootScreen from "@/components/boot-screen"; // Import BootScreen
import MessagingApp from "@/components/messaging-app"; // Import MessagingApp

// Animation timing constants (in ms)
const ANIMATION = {
  FADE_IN_DURATION: 300,
  DISPLAY_DURATION: 800,
  FADE_OUT_DURATION: 400,
  BOOT_SCREEN_DURATION: 6000,
  FINAL_TRANSITION: 1000
}

export default function Home() {
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [fadeOutBootScreen, setFadeOutBootScreen] = useState(false);
  const bootScreenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [musicPreloadReady, setMusicPreloadReady] = useState(false);
  const [mapPreloadReady, setMapPreloadReady] = useState(false);
  const [charImageLoaded, setCharImageLoaded] = useState(false);

  // Effect for cleaning up timers on component unmount
  useEffect(() => {
    return () => {
      if (bootScreenTimerRef.current) {
        clearTimeout(bootScreenTimerRef.current);
        bootScreenTimerRef.current = null;
      }
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  const endBootScreenSequence = useCallback(() => {
    // Clear any existing timers this sequence might interact with or supersede
    if (bootScreenTimerRef.current) {
      clearTimeout(bootScreenTimerRef.current);
      bootScreenTimerRef.current = null;
    }
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    if (showBootScreen && !fadeOutBootScreen) {
      console.log("Starting fade out of boot screen.");
      setFadeOutBootScreen(true);
      transitionTimerRef.current = setTimeout(() => {
        console.log("Fade out complete. Hiding boot screen.");
        setShowBootScreen(false);
      }, ANIMATION.FINAL_TRANSITION);
    } else if (showBootScreen && fadeOutBootScreen) {
      // If already fading, ensure the timer is set to hide it eventually
      console.log("Boot screen already fading out. Ensuring final transition timer is active.");
      if (!transitionTimerRef.current) { // Only set if not already set by a concurrent call
        transitionTimerRef.current = setTimeout(() => {
          setShowBootScreen(false);
        }, ANIMATION.FINAL_TRANSITION);
      }
    } else if (!showBootScreen) {
      console.log("Boot screen already hidden.");
    }
  }, [showBootScreen, fadeOutBootScreen]);

  useEffect(() => {
    const img = new Image();
    img.src = "/char.png";
    img.onload = () => {
      console.log("/char.png loaded successfully.");
      setCharImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Failed to load /char.png. Boot screen might proceed based on timeout or other resources.");
      // Set to true to not block indefinitely, or handle error more gracefully
      setCharImageLoaded(true); 
    };
  }, []);

  useEffect(() => {
    if (showBootScreen && !fadeOutBootScreen) {
      if (musicPreloadReady && charImageLoaded) {
        console.log("Music and char.png loaded. Ending boot screen sequence.");
        // endBootScreenSequence will clear bootScreenTimerRef if it was running.
        endBootScreenSequence();
      } else {
        // Resources not yet loaded, ensure the fallback timer is (re)set.
        // Clear previous timer before setting a new one.
        if (bootScreenTimerRef.current) {
          clearTimeout(bootScreenTimerRef.current);
          bootScreenTimerRef.current = null; 
        }
        console.log(`Setting/Resetting boot screen fallback timer for ${ANIMATION.BOOT_SCREEN_DURATION}ms. Waiting for: music (${musicPreloadReady}), char.png (${charImageLoaded})`);
        bootScreenTimerRef.current = setTimeout(() => {
          console.warn(`Boot screen fallback timer (${ANIMATION.BOOT_SCREEN_DURATION}ms) expired. Forcing end of boot sequence.`);
          endBootScreenSequence();
        }, ANIMATION.BOOT_SCREEN_DURATION);
      }
    }

    // Cleanup for this specific effect run
    return () => {
      // This effect is responsible for setting and managing bootScreenTimerRef (the fallback timer).
      // Clean it up if the effect re-runs. The general unmount effect handles final unmount.
      if (bootScreenTimerRef.current) {
        clearTimeout(bootScreenTimerRef.current);
        bootScreenTimerRef.current = null;
      }
      // DO NOT clear transitionTimerRef.current here, as this cleanup runs on dependency changes,
      // and could prematurely clear the timer set by endBootScreenSequence.
      // endBootScreenSequence and the unmount effect handle transitionTimerRef.
    };
  }, [musicPreloadReady, charImageLoaded, showBootScreen, fadeOutBootScreen, endBootScreenSequence]);

  const handleMusicReady = useCallback(() => {
    if (!musicPreloadReady) {
      console.log("All playlist audios in MusicPlaylist are processed.");
      setMusicPreloadReady(true);
    }
  }, [musicPreloadReady]);

  const handleMapWidgetReady = useCallback(() => {
    if (!mapPreloadReady) {
      setMapPreloadReady(true);
    }
  }, [mapPreloadReady]);

  const defaultLocationForPreload: Location = {
      name: "Haldia", 
      city: "Haldia, West Bengal",
  };

  return (
    <main className="h-full w-full flex justify-center bg-black overflow-hidden">
      {/* Render hidden widgets for preloading */}
      {showBootScreen && (
        <div style={{ display: 'none' }}>
          <MusicPlaylist onAllAudiosProcessed={handleMusicReady} />
          
          {defaultLocationForPreload && (
            <MapWidget
              location={defaultLocationForPreload}
              onMapReady={handleMapWidgetReady}
            />
          )}
        </div>
      )}

      <div className="w-full max-w-[500px] h-full">
        {showBootScreen ? (
          <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${fadeOutBootScreen ? 'opacity-0' : 'opacity-100'}`}>
            <BootScreen />
          </div>
        ) : (
          <MessagingApp />
        )}
      </div>
      
      <style jsx global>{`
        body {
          background-color: black;
          overflow: hidden;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Added animation for the background pulse */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Existing keyframes */
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 4px 6px rgba(0, 0, 0, 0.1); }
          100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5), 0 4px 6px rgba(0, 0, 0, 0.1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        /* Existing CSS variables and safe area styles */
        :root {
          --sat: env(safe-area-inset-top, 0px);
          --sab: env(safe-area-inset-bottom, 0px);
          --sal: env(safe-area-inset-left, 0px);
          --sar: env(safe-area-inset-right, 0px);
        }
        
        .h-safe-area-top {
          height: var(--sat);
        }
        
        .h-safe-area-bottom {
          height: var(--sab);
        }
      `}</style>
    </main>
  )
}

