'use client'

import { useEffect, useRef, useState } from 'react'
import { useScroll, useSpring, useTransform, motion, useAnimation, Variants } from 'framer-motion'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { backgroundStyles } from './background'
import { section } from 'framer-motion/m'

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

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

const MAX_SPREAD_THRESHOLD = 1.0

const getProjectPositions = (screenWidth: number): Project[] => {
  const isMobile = screenWidth < BREAKPOINTS.md
  const scale = isMobile ? 0.8 : 1 // Increased scale for better visibility on mobile
  
  return [
    {
      id: '1',
      title: 'Project One',
      description: 'Some description',
      image: '/placeholder.png',
      position: { 
        x: -900 * scale,
        y: 120 * scale,
        rotate: -15
      }
    },
    {
      id: '2', 
      title: 'Project Two',
      description: 'Some description',
      image: '/placeholder.png',
      position: {
        x: -450 * scale,
        y: -80 * scale,
        rotate: -8
      }
    },
    {
      id: '3',
      title: 'Project Three', 
      description: 'Some description',
      image: '/placeholder.png',
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
      image: '/placeholder.png',
      position: {
        x: 450 * scale,
        y: -40 * scale,
        rotate: 8 
      }
    },
    {
      id: '5',
      title: 'Project Five',
      description: 'Some description',
      image: '/placeholder.png',
      position: {
        x: 900 * scale,
        y: 100 * scale,
        rotate: 15
      }
    }
  ]
}

interface ProjectCardProps {
  project: Project
  smoothProgress: any
  isMobile: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, smoothProgress, isMobile }) => {
  if (isMobile) {
    return (
      <div className="w-72 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300 mb-12">
        <div className="relative w-full h-64">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="100vw"
            style={{objectFit: "cover"}}
            quality={100}
            priority
          />
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2">
            <Plus className="text-white" size={16} />
          </div>
        </div>
        <div className="w-full backdrop-blur-md bg-white/20 p-6 border border-white/30">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-base text-gray-800">{project.description}</p>
        </div>
      </div>
    )
  }

  // Create transformed motion values based on scroll progress
  const translateX = useTransform(smoothProgress, [0, 1], [0, project.position.x * MAX_SPREAD_THRESHOLD])
  const translateY = useTransform(smoothProgress, [0, 1], [0, project.position.y * MAX_SPREAD_THRESHOLD])
  const rotate = useTransform(smoothProgress, [0, 1], [0, project.position.rotate * MAX_SPREAD_THRESHOLD])

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        translateX,
        translateY,
        rotate
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
      drag
      dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
    >
      <div className="relative w-72 h-96 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300">
        <div className="relative flex-1">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{objectFit: "cover"}}
            quality={100}
          />
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2">
            <Plus className="text-white" size={16} />
          </div>
        </div>
        <div className="w-full backdrop-blur-md bg-white/20 p-4 border border-white/30">
          <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
          <p className="text-sm text-gray-800">{project.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [projects, setProjects] = useState<Project[]>(getProjectPositions(0))
  const controls = useAnimation()

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
      setProjects(getProjectPositions(window.innerWidth))
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end 20%"]
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('work-section'); // Updated id
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          controls.start("visible");
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [controls]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0.1 },
    visible: { opacity: 1 }
  };

  const isMobile = dimensions.width < BREAKPOINTS.md

  return (
    <section 
    ref={containerRef} 
    id="work-section"
    className={`relative ${isMobile ? 'min-h-[200vh] py-32' : 'min-h-[120vh]'} ${backgroundStyles.section} overflow-hidden w-full`}
  >
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(to right, 
              rgba(255,255,255,1) 0%, 
              rgba(255,255,255,0) 20%, 
              rgba(255,255,255,0) 80%, 
              rgba(255,255,255,1) 100%
            ),
            linear-gradient(to bottom, 
              rgba(255,255,255,1) 0%, 
              rgba(255,255,255,0) 20%, 
              rgba(255,255,255,0) 80%, 
              rgba(255,255,255,1) 100%
            ),
            linear-gradient(to bottom, rgba(128,128,128,0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(128,128,128,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
          mask: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* Title */}
      <div className={`${isMobile ? 'relative mb-40' : 'absolute top-[10%]'} left-1/2 -translate-x-1/2 z-10 text-center`}>
      <h2 className="text-5xl md:text-6xl font-bold text-gray-800">
        Works
      </h2>
    </div>

      {/* Projects */}
      <motion.div
      className={`${isMobile ? 'flex flex-col items-center justify-start z-20 space-y-8' : 'absolute inset-0 z-20 flex items-center justify-center'}`}
    >
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            smoothProgress={smoothProgress} 
            isMobile={isMobile}
          />
        ))}
      </motion.div>

      {/* "and many more" */}
      <div className={`${isMobile ? 'relative mt-10 mb-20 flex justify-center' : 'absolute inset-0 z-30 flex items-end justify-center pb-20'}`}>
        <motion.h3 
          className="text-xl md:text-2xl font-inter font-normal cursor-default tracking-tight"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            lineHeight: '1.3em'
          }}
        >
          { "and many more".split('').map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{
                display: 'inline-block',
                margin: char === ' ' ? '0 4px' : '0',
                opacity: 0.1
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
                delay: index * 0.03
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h3>
      </div>
    </section>
  )
}