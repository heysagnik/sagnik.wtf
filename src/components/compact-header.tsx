import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CompactHeaderProps {
  isVisible: boolean;
}

const CompactHeader = memo(({ isVisible }: CompactHeaderProps) => {
  const containerVariants = {
    hidden: { 
      height: 0, 
      opacity: 0,
      y: -10,
    },
    visible: { 
      height: 70, 
      opacity: 1,
      y: 0,
      transition: {
        height: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        y: { type: "spring", stiffness: 500, damping: 25 },
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      y: -10,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.15 },
        y: { duration: 0.15 },
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      y: -8,
      transition: { duration: 0.15 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[2000] backdrop-blur-md bg-black/85 border-b border-white/5 overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          {/* Changed from max-w-3xl to max-w-[500px] to match the app container */}
          <div className="max-w-[500px] mx-auto h-full flex items-center px-3">
            <motion.div 
              className="rounded-full relative w-10 h-10 mr-3"
              variants={childVariants}
            >
              <div className="rounded-full overflow-hidden w-full h-full">
                <Image
                  src="/char.png"
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover border border-white/10"
                  priority
                />
              </div>
              {/* Online indicator dot */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white/10 z-10"></div>
            </motion.div>
            
            <div className="flex-grow">
              <motion.h1 
                className="font-medium text-white/90 text-base"
                variants={childVariants}
              >
                Sagnik Sahoo
              </motion.h1>
              <motion.p 
                className="text-white/50 text-xs"
                variants={childVariants}
              >
                Developer
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

CompactHeader.displayName = 'CompactHeader';
export default CompactHeader;