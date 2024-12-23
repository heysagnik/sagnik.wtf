'use client'

import { ArrowUpRight } from 'lucide-react'
import { motion, Variants } from 'framer-motion'

const fadeInUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

const buttonVariants: Variants = {
  initial: {},
  whileHover: { scale: 1.07 },
  whileTap: { scale: 0.95 }
}

const HERO_CONTENT = {
  images: {
    dimensions: { 
      width: { mobile: 60, tablet: 70, desktop: 80 },
      height: { mobile: 60, tablet: 70, desktop: 80 }
    },
    secondImage: { 
      width: { mobile: 90, tablet: 100, desktop: 120 },
      height: { mobile: 90, tablet: 100, desktop: 120 }
    }
  },
  sections: [
    {
      text: "I'm Sagnik",
      image: {
        src: "https://images.unsplash.com/photo-1734387981971-037a15511ef6",
        alt: "Profile"
      }
    },
    {
      text: "a Product",
      image: { src: "", alt: "" }
    },
    {
      text: "based in India",
      image: {
        src: "https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7",
        alt: "India"
      }
    }
  ]
}

export function Hero() {
  return (
    <section className="relative min-h-[80vh] bg-gradient-to-b from-gray-200 via-white to-gray-100 py-6 sm:py-8 md:py-12">
      <motion.div
        variants={fadeInUpVariants}
        initial="initial"
        animate="animate"
        className="container mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="mb-4 sm:mb-6 font-instrument-serif">
          {HERO_CONTENT.sections.map((section, index) => (
            <span key={index} className="mb-2 sm:mb-4 block text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="relative">
                {index === 0 ? <em>{section.text}</em> : section.text}
                <img
                  src={section.image.src}
                  alt={section.image.alt}
                  width={
                    index === 2
                      ? HERO_CONTENT.images.secondImage.width.mobile
                      : HERO_CONTENT.images.dimensions.width.mobile
                  }
                  height={
                    index === 2
                      ? HERO_CONTENT.images.secondImage.height.mobile
                      : HERO_CONTENT.images.dimensions.height.mobile
                  }
                  className={`
                    absolute 
                    ${index === 0 
                      ? 'left-full ml-2 sm:ml-4' 
                      : '-right-16 sm:-right-24 lg:-right-32'
                    } 
                    top-1/2 -translate-y-1/2
                    ${section.image.src ? 
                      'rounded-md bg-white p-1 shadow-xl transition-transform hover:scale-110' : 
                      'hidden'
                    }
                    object-cover
                    ${index === 0 ? 'rotate-3 hover:rotate-0' : '-rotate-3 hover:rotate-0'}
                    hidden sm:block
                  `}
                />
                {index === 0 && ','}
              </span>
              {index === 1 && <em> Designer</em>}
            </span>
          ))}
        </h1>
        <p className="mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg text-gray-700 px-4 sm:px-6">
          I love cooking new experiences and pushing innovation.
        </p>
               
        <motion.button
          variants={buttonVariants}
          whileHover="whileHover"
          whileTap="whileTap"
          className="relative group w-36 sm:w-48 h-12 sm:h-14 flex items-center justify-center overflow-visible"
        >
          {/* Letter animation */}
          <motion.div
            className="absolute w-20 sm:w-24 h-14 sm:h-16 left-1/2 -translate-x-1/2"
            style={{ top: 'calc(-1rem)' }}
            initial={{ y: 0, opacity: 0, rotate: 0, scale: 0.9 }}
            whileHover={{
              y: -25,
              opacity: 1,
              rotate: 6,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
              }
            }}
          >
            <div className="w-full h-full bg-white rounded-sm shadow-lg p-2 sm:p-3 border border-gray-200">
              <p className="text-[8px] sm:text-[10px] leading-snug text-gray-600 font-mono mb-1 sm:mb-2 
                border-b border-gray-100 pb-1">
                Dear visitor,
              </p>
              <p className="text-[7px] sm:text-[8px] leading-relaxed text-gray-500 font-mono">
                Thank you for visiting here
              </p>
              <div className="mt-1 sm:mt-2 space-y-1">
                <div className="h-px w-full bg-gray-200" />
                <div className="h-px w-2/3 bg-gray-200" />
              </div>
            </div>
          </motion.div>
        
          {/* Inner borders */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              margin: '3px',
              background: 'linear-gradient(0deg, rgb(0, 0, 0) -83%, rgb(102, 102, 102) 100%)',
              borderRadius: '10px'
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              margin: '6px',
              background: 'linear-gradient(189.16deg, #1C1918 0%, #515151 100%)',
              borderRadius: '8px'
            }}
          />
        
          {/* Button text & icon */}
          <div className="relative z-10 flex items-center gap-1 sm:gap-2 text-white">
            <span className="text-xs sm:text-sm font-medium">Reach Out</span>
          </div>
        </motion.button>
      </motion.div>
    </section>
  )
}