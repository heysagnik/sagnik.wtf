import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CompactHeaderProps {
  isVisible: boolean;
}

const ANIMATION_CONFIG = {
  container: {
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
  },
  child: {
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
  }
} as const;

const PROFILE_DATA = {
  name: "Sagnik Sahoo",
  title: "Developer",
  avatar: "/char.png",
  socialUrl: "https://x.com/heysagnik"
} as const;

const BUTTON_STYLES = [
  "ml-auto px-3 py-1.5 text-xs font-medium text-white",
  "bg-gradient-to-b from-blue-500 to-blue-700",
  "border-b-2 border-blue-900",
  "shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]",
  "hover:translate-y-[-1px] hover:shadow-[0_6px_8px_-1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]",
  "active:translate-y-[1px] active:shadow-[0_2px_3px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
  "rounded-md transition-all duration-150",
  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
  "flex items-center gap-1.5"
].join(" ");

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const UserAvatar = memo(() => (
  <motion.div 
    className="rounded-full relative w-10 h-10 mr-3"
    variants={ANIMATION_CONFIG.child}
  >
    <div className="rounded-full overflow-hidden w-full h-full">
      <Image
        src={PROFILE_DATA.avatar}
        alt="User Avatar"
        width={40}
        height={40}
        className="w-full h-full object-cover border border-white/10"
        priority
      />
    </div>
    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white/10 z-10" />
  </motion.div>
));

UserAvatar.displayName = 'UserAvatar';

const UserInfo = memo(() => (
  <div className="flex-grow">
    <motion.h1 
      className="font-medium text-white/90 text-base"
      variants={ANIMATION_CONFIG.child}
    >
      {PROFILE_DATA.name}
    </motion.h1>
    <motion.p 
      className="text-white/50 text-xs"
      variants={ANIMATION_CONFIG.child}
    >
      {PROFILE_DATA.title}
    </motion.p>
  </div>
));

UserInfo.displayName = 'UserInfo';

const FollowButton = memo(() => {
  const handleFollowClick = () => {
    window.open(PROFILE_DATA.socialUrl, '_blank');
  };

  return (
    <motion.button
      variants={ANIMATION_CONFIG.child}
      className={BUTTON_STYLES}
      onClick={handleFollowClick}
      aria-label="Follow me on X (Twitter)"
    >
      <TwitterIcon />
      Follow Me
    </motion.button>
  );
});

FollowButton.displayName = 'FollowButton';

const CompactHeader = memo<CompactHeaderProps>(({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[2000] backdrop-blur-md bg-black/85 border-b border-white/5 overflow-hidden"
          variants={ANIMATION_CONFIG.container}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="max-w-[500px] mx-auto h-full flex items-center px-3">
            <UserAvatar />
            <UserInfo />
            <FollowButton />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

CompactHeader.displayName = 'CompactHeader';
export default CompactHeader;