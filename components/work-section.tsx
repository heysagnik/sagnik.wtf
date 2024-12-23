'use client'

import { useEffect, useRef, useState } from 'react'
import { useScroll, useSpring } from 'framer-motion'
import { Plus } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  image: string
  position: {
    x: number
    y: number
    rotate: number
  }
}

// Add responsive breakpoints
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

// Add responsive card sizes
const CARD_SIZES = {
  sm: {
    width: 260,
    height: 360,
    fontSize: {
      title: 20,
      description: 14
    }
  },
  md: {
    width: 300, 
    height: 420,
    fontSize: {
      title: 26,
      description: 16  
    }
  }
}

// Add max spread threshold
const MAX_SPREAD_THRESHOLD = 0.55;

// Update project positions based on screen size
const getProjectPositions = (screenWidth: number) => {
  const isMobile = screenWidth < BREAKPOINTS.md
  const scale = isMobile ? 0.6 : 1

  return [
    {
      id: '1',
      title: 'Project One',
      description: 'Some description',
      image: '/placeholder.svg?height=400&width=600',
      position: { 
        x: -800 * scale, 
        y: 120 * scale, 
        rotate: -15
      }
    },
    {
      id: '2',
      title: 'Project Two',
      description: 'Some description',
      image: '/placeholder.svg?height=400&width=600',
      position: { 
        x: -400 * scale, 
        y: -80 * scale, 
        rotate: -8
      }
    },
    {
      id: '3',
      title: 'Project Three',
      description: 'Some description',
      image: '/placeholder.svg?height=400&width=600',
      position: { 
        x: 0 * scale, 
        y: 40 * scale, 
        rotate: 0
      }
    },
    {
      id: '4',
      title: 'Project Four',
      description: 'Some description',
      image: '/placeholder.svg?height=400&width=600',
      position: { 
        x: 300 * scale, 
        y: -40 * scale, 
        rotate: 6
      }
    },
    {
      id: '5',
      title: 'Project Five',
      description: 'Some description',
      image: '/placeholder.svg?height=400&width=600',
      position: { 
        x: 600 * scale, 
        y: 100 * scale, 
        rotate: 12
      }
    }
  ]
}

export function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [projects, setProjects] = useState(getProjectPositions(0))

  // Update projects when screen size changes
  useEffect(() => {
    setProjects(getProjectPositions(dimensions.width))
  }, [dimensions.width])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Handle window resize with debounce
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
          })
        }, 150)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Enable high DPI for better rendering on retina displays
    const setCanvasDPI = () => {
      const dpr = window.devicePixelRatio || 1
      canvasRef.current!.width = dimensions.width * dpr
      canvasRef.current!.height = dimensions.height * dpr
      ctx.scale(dpr, dpr)
    }

    setCanvasDPI()

    const drawProjectCard = (
      x: number,
      y: number,
      width: number,
      height: number,
      rotation: number,
      project: Project
    ) => {
      // Get card sizes based on screen width
      const cardSizes = dimensions.width < BREAKPOINTS.md ? CARD_SIZES.sm : CARD_SIZES.md

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((rotation * Math.PI) / 180)

      // Shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetY = 5

      // Draw rounded rectangle
      const radius = 20
      ctx.beginPath()
      ctx.moveTo(-width / 2 + radius, -height / 2)
      ctx.lineTo(width / 2 - radius, -height / 2)
      ctx.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius)
      ctx.lineTo(width / 2, height / 2 - radius)
      ctx.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2)
      ctx.lineTo(-width / 2 + radius, height / 2)
      ctx.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius)
      ctx.lineTo(-width / 2, -height / 2 + radius)
      ctx.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2)
      ctx.closePath()

      // Card background
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      // Subtle gradient overlay
      const gradient = ctx.createLinearGradient(
        -width / 2, -height / 2,
        -width / 2, height / 2
      )
      gradient.addColorStop(0, 'rgba(0,0,0,0)')
      gradient.addColorStop(0.8, 'rgba(0,0,0,0.3)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.5)')
      ctx.fillStyle = gradient
      ctx.fill()

      // Project Title
      ctx.fillStyle = 'white'
      ctx.font = `bold ${cardSizes.fontSize.title}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText(project.title, -width / 2 + 20, height / 2 - 60)

      // Project Description
      ctx.font = `${cardSizes.fontSize.description}px Arial`
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fillText(project.description, -width / 2 + 20, height / 2 - 25)

      // Plus Button
      ctx.beginPath()
      ctx.arc(width / 2 - 30, height / 2 - 30, 18, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fill()

      // Plus Icon
      ctx.strokeStyle = 'white'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(width / 2 - 35, height / 2 - 30)
      ctx.lineTo(width / 2 - 25, height / 2 - 30)
      ctx.moveTo(width / 2 - 30, height / 2 - 35)
      ctx.lineTo(width / 2 - 30, height / 2 - 25)
      ctx.stroke()

      ctx.restore()
    }

    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

    const animate = () => {
      const progressRaw = smoothProgress.get()
      // Clamp the progress at MAX_SPREAD_THRESHOLD
      const progress = Math.min(easeInOut(progressRaw), MAX_SPREAD_THRESHOLD)
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Get card sizes based on screen width
      const cardSizes = dimensions.width < BREAKPOINTS.md ? CARD_SIZES.sm : CARD_SIZES.md

      projects.forEach((project) => {
        const CARD_WIDTH = cardSizes.width
        const CARD_HEIGHT = cardSizes.height

        // Adjust spread multiplier to respect threshold
        const spreadMultiplier = dimensions.width < BREAKPOINTS.md ? 
          (1 + (progress * 0.2)) : 
          (1 + (progress * 0.5))
          
  
          const startX = (dimensions.width / 2) 
          const startY = dimensions.height / 2
          const endX = startX + (project.position.x * spreadMultiplier)
          const endY = startY + (project.position.y * spreadMultiplier)
  
          const currentX = startX + (endX - startX) * progress
          const currentY = startY + (endY - startY) * progress
          const currentRotate = project.position.rotate * progress
          const currentScale = dimensions.width < BREAKPOINTS.md ?
            (0.4 + (0.4 * progress)) :
            (0.5 + (0.5 * progress))

        drawProjectCard(
          currentX,
          currentY,
          CARD_WIDTH * currentScale,
          CARD_HEIGHT * currentScale,
          currentRotate,
          project
        )
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
    }
  }, [smoothProgress, dimensions, projects])

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[100vh] bg-gradient-to-b from-gray-100 to-gray-300"
    >
      <div className="sticky top-0 h-screen w-full">
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 max-w-full"
          width={dimensions.width}
          height={dimensions.height}
        />
      </div>
    </section>
  )
}