"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Animation timing constants (in ms)
const ANIMATION = {
  FADE_IN_DURATION: 300,
  DISPLAY_DURATION: 800,
  FADE_OUT_DURATION: 400,
};

type GreetingType = {
  text: string;
  language: string;
};

export default function BootScreen() {
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const greetings: GreetingType[] = [
    { text: "Hello", language: "English" },
    { text: "こんにちは", language: "Japanese" },
    { text: "Bonjour", language: "French" },
    { text: "नमस्ते", language: "Hindi" },
    { text: "Hola", language: "Spanish" },
    { text: "Ciao", language: "Italian" },
    { text: "안녕하세요", language: "Korean" },
    { text: "你好", language: "Chinese" },
    { text: "Olá", language: "Portuguese" },
    { text: "Hallo", language: "German" },
  ];

  const rotateGreetings = useCallback(
    (index: number) => {
      if (index >= greetings.length) return;

      setCurrentGreeting(index);
      setIsVisible(true);

      const fadeOutTimer = setTimeout(() => {
        setIsVisible(false);

        const nextGreetingTimer = setTimeout(() => {
          rotateGreetings(index + 1);
        }, ANIMATION.FADE_OUT_DURATION);

        return () => clearTimeout(nextGreetingTimer);
      }, ANIMATION.DISPLAY_DURATION);

      return () => clearTimeout(fadeOutTimer);
    },
    [greetings.length]
  );

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      rotateGreetings(0);
    }, 100);

    return () => clearTimeout(initialTimer);
  }, [rotateGreetings]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black overflow-hidden">
      {/* Subtle background pulse */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-purple-900/5 to-black/0 animate-pulse-slow opacity-50 blur-3xl"></div>

      <div className="relative flex flex-col items-center">
        {/* Greeting Text Animation */}
        <AnimatePresence mode="wait">
          {currentGreeting < greetings.length && (
            <motion.div
              key={currentGreeting}
              initial={{ opacity: 0, y: 15, scale: 0.9, filter: "blur(5px)" }}
              animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 15,
                scale: isVisible ? 1 : 0.9,
                filter: isVisible ? "blur(0px)" : "blur(5px)",
                transition: {
                  duration: isVisible
                    ? ANIMATION.FADE_IN_DURATION / 1000
                    : ANIMATION.FADE_OUT_DURATION / 1000,
                  ease: isVisible ? "easeOut" : "easeIn",
                },
              }}
              exit={{
                opacity: 0,
                y: -15,
                scale: 0.9,
                filter: "blur(5px)",
                transition: {
                  duration: ANIMATION.FADE_OUT_DURATION / 1000,
                  ease: "easeIn",
                },
              }}
              className="text-white text-3xl sm:text-4xl font-light tracking-wider"
            >
              {greetings[currentGreeting].text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-10 h-1 w-20 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-400"
            style={{
              width: `${
                ((currentGreeting + 1) / greetings.length) * 100
              }%`,
              transition: "width 0.4s ease-in-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}