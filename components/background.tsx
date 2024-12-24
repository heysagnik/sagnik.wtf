'use client'

import { createContext, useContext, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const BackgroundContext = createContext({
  backgroundColor: 'rgb(245, 245, 245)'
})

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll()
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [
      'rgb(245, 245, 245)', // Start color
      'rgb(245, 245, 245)', // Hold initial color
      'rgb(229, 231, 235)', // Transition start
      'rgb(209, 213, 219)'  // End color
    ]
  )

  return (
    <BackgroundContext.Provider value={{ backgroundColor: backgroundColor as any }}>
      <motion.div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor }}
      />
      {children}
    </BackgroundContext.Provider>
  )
}

export const useBackground = () => useContext(BackgroundContext)


export const backgroundStyles = {
    section: "relative min-h-[80vh] bg-gradient-to-b from-gray-100 via-white to-gray-200  backdrop-blur-sm bg-opacity-50",
    grid: {
      className: "absolute inset-0 z-0",
      style: {
        background: `
          linear-gradient(to right, 
            rgba(255,255,255,1) 0%, 
            rgba(255,255,255,0) 15%, 
            rgba(255,255,255,0) 85%, 
            rgba(255,255,255,1) 100%
          ),
          linear-gradient(to bottom, 
            rgba(255,255,255,1) 0%, 
            rgba(255,255,255,0) 15%, 
            rgba(255,255,255,0) 85%, 
            rgba(255,255,255,1) 100%
          ),
          linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 24px 24px, 24px 24px'
      }
    }
  }