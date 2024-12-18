'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useScroll, MotionValue } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

interface Project {
  id: string
  title: string
  description: string
  image: string
  color: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Project One',
    description: 'Some description',
    image: '/placeholder.svg?height=400&width=600',
    color: 'bg-pink-100'
  },
  {
    id: '2',
    title: 'Project Two',
    description: 'Some description',
    image: '/placeholder.svg?height=400&width=600',
    color: 'bg-green-100'
  },
  {
    id: '3',
    title: 'Project Three',
    description: 'Some description',
    image: '/placeholder.svg?height=400&width=600',
    color: 'bg-blue-100'
  },
  {
    id: '4',
    title: 'Project Four',
    description: 'Some description',
    image: '/placeholder.svg?height=400&width=600',
    color: 'bg-purple-100'
  },
  {
    id: '5',
    title: 'Project Five',
    description: 'Some description',
    image: '/placeholder.svg?height=400&width=600',
    color: 'bg-sky-100'
  }
]

export function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  return (
    <section ref={containerRef} className="relative min-h-screen py-20">
      <h2 className="mb-24 text-center text-6xl font-bold text-gray-300">Work</h2>
      <div className="relative flex h-[150vh] items-center justify-center">
        {projects.map((project, index) => (
          <FlyingCard key={project.id} project={project} progress={scrollYProgress} index={index} />
        ))}
      </div>
    </section>
  )
}

function FlyingCard({ project, progress, index }: { project: Project; progress: MotionValue<number>; index: number }) {
  const xOffset = [-200, -100, 0, 100, 200][index]
  const yOffset = [-200, -100, 0, 100, 200][index]

  const x = useTransform(progress, [0, 1], [0, xOffset])
  const y = useTransform(progress, [0, 1], [0, yOffset])
  const rotate = useTransform(progress, [0, 1], [0, (index - 2) * 10])
  const scale = useTransform(progress, [0, 1], [0.8, 1])

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-80"
      style={{
        x,
        y,
        rotate,
        scale,
        zIndex: projects.length - index,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        dragElastic={0.1}
        dragMomentum={false}
        whileHover={{ scale: 1.05, zIndex: 10 }}
        whileTap={{ scale: 1.02, cursor: 'grabbing' }}
      >
        <Card className={`overflow-hidden shadow-lg transition-shadow hover:shadow-xl ${project.color}`}>
          <CardContent className="p-0">
            <div className="group relative">
              <Image
                src={project.image}
                alt={project.title}
                width={400}
                height={300}
                className="w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="mt-1 text-sm text-gray-200">{project.description}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

