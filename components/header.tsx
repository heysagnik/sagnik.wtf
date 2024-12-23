'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Twitter, Linkedin, Instagram } from 'lucide-react'

const menuVariants = {
  initial: {
    opacity: 0,
    y: -20,
    transformOrigin: "100% 0%"
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20
  }
}

const linkVariants = {
  initial: { x: -20, opacity: 0 },
  animate: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
          }}
        >
          <Link href="/" className="relative group">
            <motion.div
              className="font-instrument-serif text-2xl px-10 py-4 rounded-full 
            bg-gradient-to-r from-white to-white/90
            shadow-[0_4px_20px_rgba(0,0,0,0.08)]
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
            transition-all duration-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r 
                from-gray-900 to-gray-600
                relative z-10">
          <em>Sagnik</em>
              </span>
              <motion.div
          className="absolute inset-0 rounded-full opacity-0 
              bg-gradient-to-r from-pink-100 to-violet-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
              />
            </motion.div>
          </Link>
        </motion.div>

        {/* Animated Menu Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 rounded-full bg-white/50 backdrop-blur-md shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
            <motion.div
            className="flex flex-col justify-center items-center w-full h-full"
            animate={isOpen ? "open" : "closed"}
            >
            <motion.span
              className="w-5 h-[1px] bg-black rounded-full absolute"
              animate={{
              rotate: isOpen ? 45 : 0,
              translateY: isOpen ? 0 : -3
              }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="w-5 h-[1px] bg-black rounded-full absolute"
              animate={{
              rotate: isOpen ? -45 : 0,
              translateY: isOpen ? 0 : 3
              }}
              transition={{ duration: 0.3 }}
            />
            </motion.div>
        </motion.button>

        {/* Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="initial"
              animate="animate" 
              exit="exit"
              className="fixed top-24 right-6 w-72 bg-white/90 backdrop-blur-md shadow-lg p-8 rounded-[24px_8px_24px_24px]"
            >
              <div className="flex flex-col space-y-6">
                {['Work', 'About', 'Side Stuffs', 'Writings'].map((item, i) => (
                  <motion.div
                    key={item}
                    custom={i}
                    variants={linkVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <Link
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      onClick={() => setIsOpen(false)}
                      className="block text-xl font-medium hover:text-gray-600 transition-colors"
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="flex space-x-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    className="p-2 rounded-full border border-black/50 hover:bg-black hover:text-white transition-all"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}