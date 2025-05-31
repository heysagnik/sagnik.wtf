"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import SplashScreen from "@/components/splash-screen";
import MessagingApp from "@/components/messaging-app";

const ANIMATION_CONFIG = {
  splashDuration: 2000,
  transitionDuration: 1000,
} as const;

const NAVIGATION_SOURCES = {
  HOME: 'home',
  BLOG: 'blog'
} as const;

const useSplashScreenState = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const [fadeSplashScreen, setFadeSplashScreen] = useState(false);
  const splashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startSplashSequence = () => {
    splashTimerRef.current = setTimeout(() => {
      setFadeSplashScreen(true);
    }, ANIMATION_CONFIG.splashDuration);
  };

  const startTransition = () => {
    if (!transitionTimerRef.current) {
      transitionTimerRef.current = setTimeout(() => {
        setShowSplashScreen(false);
      }, ANIMATION_CONFIG.transitionDuration);
    }
  };

  const skipSplash = () => {
    setShowSplashScreen(false);
  };

  const cleanup = () => {
    if (splashTimerRef.current) {
      clearTimeout(splashTimerRef.current);
      splashTimerRef.current = null;
    }
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  };

  return {
    showSplashScreen,
    fadeSplashScreen,
    startSplashSequence,
    startTransition,
    skipSplash,
    cleanup
  };
};

const useNavigationCheck = () => {
  const searchParams = useSearchParams();
  const [skipIntroAnimation, setSkipIntroAnimation] = useState(false);

  const shouldSkipAnimation = () => {
    const fromParam = searchParams.get('from');
    return fromParam === NAVIGATION_SOURCES.HOME || fromParam === NAVIGATION_SOURCES.BLOG;
  };

  return { skipIntroAnimation, setSkipIntroAnimation, shouldSkipAnimation };
};

export default function HomePageContent() {
  const { skipIntroAnimation, setSkipIntroAnimation, shouldSkipAnimation } = useNavigationCheck();
  const { 
    showSplashScreen, 
    fadeSplashScreen, 
    startSplashSequence, 
    startTransition, 
    skipSplash, 
    cleanup 
  } = useSplashScreenState();

  useEffect(() => {
    if (shouldSkipAnimation()) {
      skipSplash();
      setSkipIntroAnimation(true);
    }
  }, [shouldSkipAnimation, skipSplash, setSkipIntroAnimation]);
  
  useEffect(() => {
    if (showSplashScreen && !fadeSplashScreen) {
      startSplashSequence();
    }
    return cleanup;
  }, [showSplashScreen, fadeSplashScreen, startSplashSequence, cleanup]);

  useEffect(() => {
    if (fadeSplashScreen) {
      startTransition();
    }
    return cleanup;
  }, [fadeSplashScreen, startTransition, cleanup]);

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