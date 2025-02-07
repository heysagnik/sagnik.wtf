import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] }
  },
  hover: { 
    y: -10,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  }
}

const ArrowIcon = () => (
  <motion.div 
    className="absolute bottom-8 right-8"
    whileHover={{ x: 6 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <ArrowRight className="h-6 w-6 text-white" />
  </motion.div>
)

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Column 1 */}
      <div className="space-y-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="relative h-[400px] rounded-2xl bg-white/30 backdrop-blur-md overflow-hidden group"
        >
          <Image
            src="/tiny.png"
            alt="Experiments"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 p-8 flex flex-col justify-end">
            <h2 className="text-2xl font-bold text-white">Experiments</h2>
            <p className="text-gray-100 mt-2">Tiny experiments & creative explorations</p>
          </div>
          <ArrowIcon />
        </motion.div>
        
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="relative h-[200px] rounded-2xl bg-white/30 backdrop-blur-md p-8 hover:bg-white hover:shadow-md transition-colors duration-500"
        >
          <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
          <p className="mt-2 text-gray-600">Designer, Developer & Maker</p>
          <motion.div 
            className="absolute bottom-8 right-8"
            whileHover={{ x: 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-900" />
          </motion.div>
        </motion.div>
      </div>

      {/* Column 2 */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="relative h-[624px] rounded-2xl bg-white/30 backdrop-blur-md overflow-hidden group"
      >
        <Image
          src="/project.png"
          alt="Projects"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 p-8 flex flex-col justify-end">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-gray-100 mt-2">Selected works and case studies</p>
        </div>
        <ArrowIcon />
      </motion.div>

      {/* Column 3 */}
      <div className="space-y-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="relative h-[400px] rounded-2xl bg-white/30 backdrop-blur-md overflow-hidden group"
        >
          <Image
            src="/relax.jpg"
            alt="Connect"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 p-8 flex flex-col justify-end">
            <h2 className="text-2xl font-bold text-white">Connect</h2>
            <p className="text-gray-100 mt-2">Let&apos;s build something together</p>
          </div>
        </motion.div>
        
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="h-[100px] rounded-2xl bg-white/30 backdrop-blur-md p-6 hover:bg-white hover:shadow-md transition-colors duration-500 transform hover:-rotate-2"
        >
          <div className="flex justify-between items-center px-4">
            <Link href="https://github.com" className="text-gray-600 hover:text-gray-900 transition-colors">
              <Image 
                src='/github-mark.png' 
                width={40} 
                height={40} 
                alt="GitHub" 
                quality={100}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </Link>
            <Link href="https://linkedin.com" className="text-gray-600 hover:text-gray-900 transition-colors">
              <Image 
                src='/linkedin.png' 
                width={40} 
                height={40} 
                alt="LinkedIn" 
                quality={100}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </Link>
            <Link href="https://twitter.com" className="text-gray-600 hover:text-gray-900 transition-colors">
              <Image 
                src='/twitter.png' 
                width={40} 
                height={40} 
                alt="Twitter" 
                quality={100}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}