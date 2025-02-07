'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import BentoGrid from './BentoGrid'
import Image from 'next/image'
const menuItems = [
  { title: 'Home', href: '/' },
  { title: 'Projects', href: '/projects' },
  { title: 'Experiments', href: '/experiments' },
  { title: 'About', href: '/about' },
]


export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => { document.body.style.overflow = 'auto' }
  }, [isOpen])

  const MobileMenu = () => (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 bg-white z-40 flex flex-col"
    >
      {/* Header section with gradient */}
      <div className="h-24 bg-gradient-to-b from-gray-50 to-white" />

      <div className="flex flex-col flex-1 p-8">
        <nav className="space-y-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeInOut' }}
            >
              <Link 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center gap-4"
              >
                <motion.div
                  className="absolute -left-6 w-4 h-0.5 bg-gray-900 origin-left scale-x-0 
                    transition-transform duration-300 group-hover:scale-x-100"
                />
                <span className="text-2xl font-medium text-gray-900 
                  transition-colors duration-200 group-hover:text-gray-600">
                  {item.title}
                </span>
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="border-t border-gray-100 pt-8">
            <div className="flex gap-6 px-4">
              <Link href="https://github.com" className="group">
          <Image 
            src='/github-mark.png' 
            width={24} 
            height={24} 
            alt="GitHub" 
            quality={100}
            className="opacity-50 transition-opacity duration-200 group-hover:opacity-100"
          />
              </Link>
              <Link href="https://linkedin.com" className="group">
          <Image 
            src='/linkedin.png' 
            width={24} 
            height={24} 
            alt="LinkedIn" 
            quality={100}
            className="opacity-50 transition-opacity duration-200 group-hover:opacity-100"
          />
              </Link>
              <Link href="https://twitter.com" className="group">
          <Image 
            src='/twitter.png' 
            width={24} 
            height={24} 
            alt="Twitter" 
            quality={100}
            className="opacity-50 transition-opacity duration-200 group-hover:opacity-100"
          />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <motion.div 
          className={`mx-4 sm:mx-auto px-4 max-w-6xl ${
        isScrolled ? 'bg-white/70 backdrop-blur-lg shadow-md rounded-xl' : 'bg-white/30 backdrop-blur-sm'
          }`}
          initial={false}
          animate={{
        padding: isScrolled ? '0.5rem' : '0.75rem',
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <nav className="flex items-center justify-between px-2">
        <Link href="/">
        <motion.div
          className="px-2 sm:px-4 py-2.5 rounded-full 
          transition-all duration-300 flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-100">
            <Image 
          src="/relax.jpg" 
          width={40}
          height={40}
          alt="Sagnik"
          className="w-full h-full object-cover"
            />
            </div>
        
          {/* Name and Role */}
          <div className="flex flex-col -space-y-0.5">
          <span className="font-instrument-serif text-lg text-gray-900 leading-tight">
        sagnik
          </span>
          <span className="text-xs text-gray-500 font-mono tracking-wide">
        tinkerer
          </span>
          </div>
        </motion.div>
        </Link>
          
        <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-50 w-10 h-10 rounded-full 
        bg-white/70 backdrop-blur-sm border border-gray-100
        hover:shadow-md transition-all duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        >
        <div className="flex items-center justify-center w-full h-full">
        <motion.span
        className="absolute h-[1.5px] bg-gray-800 rounded-full"
        animate={{
          rotate: isOpen ? 45 : 0,
          width: 18,
          translateY: isOpen ? 0 : -4
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        <motion.span
        className="absolute h-[1.5px] bg-gray-800 rounded-full"
        animate={{
          rotate: isOpen ? -45 : 0,
          width: 18,
          translateY: isOpen ? 0 : 4
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
        </div>
        </motion.button>
          </nav>
        </motion.div>
      </header>

      <AnimatePresence>
        {isOpen && (
          isMobile ? <MobileMenu /> : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="fixed inset-0 bg-white z-40"
            >
              <div className="container mx-auto px-6 pt-32">
                <BentoGrid  />
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </>
  )
}