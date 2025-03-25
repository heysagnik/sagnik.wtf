"use client"
import { useState, useEffect, useCallback } from "react"
import MessagingApp from "@/components/messaging-app"

// Animation timing constants (in ms)
const ANIMATION = {
  FADE_IN_DURATION: 300,
  DISPLAY_DURATION: 800,
  FADE_OUT_DURATION: 400,
  BOOT_SCREEN_DURATION: 6000,
  FINAL_TRANSITION: 1000
}

type GreetingType = {
  text: string;
  language: string;
}

function BootScreen() {
  const [currentGreeting, setCurrentGreeting] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
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
    { text: "Hallo", language: "German" }
  ]

  const rotateGreetings = useCallback((index: number) => {
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
  }, [greetings.length]);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      rotateGreetings(0);
    }, 100);
    
    return () => clearTimeout(initialTimer);
  }, [rotateGreetings]);
  
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl opacity-30 rounded-full" />
        <div className="relative flex flex-col items-center">
          {currentGreeting < greetings.length && (
            <div 
              className="text-white text-3xl sm:text-4xl font-light tracking-wide transition-all duration-700"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                filter: isVisible ? 'blur(0)' : 'blur(4px)'
              }}
            >
              {greetings[currentGreeting].text}
            </div>
          )}
          <div className="mt-8 h-1 w-16 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white" 
              style={{
                width: `${(currentGreeting / greetings.length) * 100}%`,
                transition: 'width 0.3s ease-in-out'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setFadeOut(true)
      
      const transitionTimer = setTimeout(() => {
        setLoading(false)
      }, ANIMATION.FINAL_TRANSITION)
      
      return () => clearTimeout(transitionTimer)
    }, ANIMATION.BOOT_SCREEN_DURATION)

    return () => clearTimeout(bootTimer)
  }, [])

  return (
    <main className="h-full w-full overflow-hidden">
      {loading ? (
        <div className={`fixed inset-0 z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <BootScreen />
        </div>
      ) : (
        <MessagingApp />
      )}
    </main>
  )
}

