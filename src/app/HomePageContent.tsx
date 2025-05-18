"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import SplashScreen from "@/components/splash-screen";
import MessagingApp from "@/components/messaging-app";

// Animation timing constants (in ms)
const ANIMATION = {
  INITIAL_DELAY: 100,
  FINAL_TRANSITION: 1000,
};

export default function HomePageContent() {
  const searchParams = useSearchParams();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [fadeSplashScreen, setFadeSplashScreen] = useState(false);
  const splashScreenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [skipIntroAnimation, setSkipIntroAnimation] = useState(false);

  // Check if user is navigating within the same domain based on query parameter
  useEffect(() => {
    const fromParam = searchParams.get('from');
    
    if (fromParam === 'home' || fromParam === 'blog') {
      setShowSplashScreen(false);
      setSkipIntroAnimation(true);
      console.log("Skipping animations due to navigation from within site, fromParam:", fromParam);
    }
  }, [searchParams]);
  
  // Transition from splash screen to messaging app
  useEffect(() => {
    if (showSplashScreen && !fadeSplashScreen) {
      console.log("Starting splash screen sequence");
      splashScreenTimerRef.current = setTimeout(() => {
        console.log("Starting fade out animation");
        setFadeSplashScreen(true);
      }, 2000); // Time to display splash screen
    }
    
    return () => {
      if (splashScreenTimerRef.current) {
        clearTimeout(splashScreenTimerRef.current);
        splashScreenTimerRef.current = null;
      }
    };
  }, [showSplashScreen, fadeSplashScreen]);

  useEffect(() => {
    if (fadeSplashScreen && !transitionTimerRef.current) {
      transitionTimerRef.current = setTimeout(() => {
        setShowSplashScreen(false);
      }, ANIMATION.FINAL_TRANSITION);
    }
    
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, [fadeSplashScreen]);

  return (
    <main className="h-full w-full flex justify-center bg-black overflow-hidden">
      <div className="w-full max-w-[500px] h-full">
        {showSplashScreen ? (
          <SplashScreen />
        ) : (
          <MessagingApp skipIntroAnimation={skipIntroAnimation} />
        )}
      </div>
    </main>
  );
}