"use client";
import InfiniteMarquee from "./infinite-marquee";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import React from "react";

// Project Data
const PROJECTS = [
  {
    title: "Despiration",
    description:
      "Despiration is an inspiration board for web designers with more than 5k monthly visitors. This is my pet project and fully designed and developed by me on Framer",
    category: "Web Design",
    year: "2024",
    timeline: "2 weeks",
    role: "UX Designer",
    imageUrl: "https://framerusercontent.com/images/fwvSex4RaIfUBgfgLWxK0cJEMuM.jpg?scale-down-to=2048",
  },
  {
    title: "Fundex Crypto",
    description:
      "A revolutionary platform transforming the future of digital asset management with modern design principles",
    category: "Web3 Platform",
    year: "2024",
    timeline: "4 weeks",
    role: "Lead Designer",
    imageUrl: "https://cdn.dribbble.com/userupload/13816037/file/original-0050c2b690b9a146f905c7e416148205.png",
  },
  {
    title: "Smart Farming",
    description:
      "Integrating technology to revolutionize agriculture through innovative solutions and user-centric design",
    category: "AgriTech",
    year: "2023",
    timeline: "6 weeks",
    role: "Product Designer",
    imageUrl: "https://framerusercontent.com/images/fwvSex4RaIfUBgfgLWxK0cJEMuM.jpg?scale-down-to=2048",
  },
  {
    title: "Lala Crypto",
    description:
      "A revolutionary platform transforming the future of digital asset management with modern design principles",
    category: "Web3 Platform",
    year: "2024",
    timeline: "4 weeks",
    role: "Lead Designer",
    imageUrl: "https://cdn.dribbble.com/userupload/13816037/file/original-0050c2b690b9a146f905c7e416148205.png",
  },
  {
    title: "LA  Farming",
    description:
      "Integrating technology to revolutionize agriculture through innovative solutions and user-centric design",
    category: "AgriTech",
    year: "2023",
    timeline: "6 weeks",
    role: "Product Designer",
    imageUrl: "https://framerusercontent.com/images/fwvSex4RaIfUBgfgLWxK0cJEMuM.jpg?scale-down-to=2048",
  },
] as const;

// Marquee Background Component
const MarqueeBackground = () => {
  const { scrollYProgress } = useScroll();
  const marqueeY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const marqueeOpacity = useTransform(scrollYProgress, [0.1, 0.3], [1, 0.3]);
  const marqueeScale = useTransform(scrollYProgress, [0.1, 0.3], [1, 0.9]);

  return (
    <motion.div
      className="sticky top-0 h-screen z-[1] overflow-hidden pointer-events-none"
      style={{
        y: marqueeY,
        opacity: marqueeOpacity,
        scale: marqueeScale,
      }}
    >
      <div className="absolute inset-0">
        <InfiniteMarquee />
      </div>
    </motion.div>
  );
};

// Custom hook to compute scroll progress for an element using Lenis-based (window) scroll
function useLenisProgress(ref: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const updateProgress = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Calculate progress: 0 when card is below viewport, 1 when it's above
        const prog = 1 - (rect.top + rect.height) / (windowHeight + rect.height);
        setProgress(Math.min(Math.max(prog, 0), 1));
      }
    };
    const handle = () => {
      updateProgress();
      requestAnimationFrame(handle);
    };
    // start the loop
    handle();
    return () => {};
  }, [ref]);
  return progress;
}

// Updated ProjectCard Component to render as full-screen sections
const ProjectCard = ({
  project,
  index,
}: {
  project: typeof PROJECTS[number];
  index: number;
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const progress = useLenisProgress(cardRef);
  const motionProgress = useMotionValue(progress);

  React.useEffect(() => {
    motionProgress.set(progress);
  }, [progress, motionProgress]);

  // Removed rotation transform for a clean parallax effect
  const cardY = useTransform(motionProgress, [0, 1], [100, -100]);
  const cardOpacity = useTransform(motionProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const cardScale = useTransform(motionProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const topPosition = `calc(20vh + ${index * 2.5}vh)`;
  const backgroundColor = `hsl(${index * 60}, 70%, 95%)`;
  const transition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    delay: index * 0.1,
  };

  // Make the last card cover the rest by giving it a higher zIndex
  const isLastCard = index === PROJECTS.length - 1;
  const zIndex = isLastCard ? 100 : index + 1;

  return (
    <motion.div
      ref={cardRef}
      key={project.title}
      style={{
        y: cardY,
        opacity: cardOpacity,
        scale: cardScale,
        // Remove any rotation styling
        rotate: 0,
        position: "sticky",
        top: topPosition,
        backgroundColor: backgroundColor,
        zIndex,
      }}
      // initial and animate without rotation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition }}
      className="w-full rounded-xl shadow-xl relative flex flex-col h-[700px]"
    >
      {/* Card Content */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-12">
          <div className="flex-1 mb-6 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
              {project.title}
            </h2>
          </div>
          <div className="flex-1 space-y-4 lg:space-y-8">
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              {project.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Year</p>
                <p className="font-medium">{project.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Timeline</p>
                <p className="font-medium">{project.timeline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Role</p>
                <p className="font-medium">{project.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Updated image container with fixed height */}
      <div
        className="rounded-b-xl overflow-hidden w-full h-[500px]"
        style={{ backgroundColor: `hsl(${index * 60}, 70%, 90%)` }}
      >
        <Image
          src={project.imageUrl || "/default-image.jpg"}
          alt={project.title}
          width={800}
          height={500}
          className="w-full h-full object-cover rounded-b-lg"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/default-image.jpg";
          }}
        />
      </div>
    </motion.div>
  );
};

// Featured Work Component
export default function FeaturedWork() {
  return (
    <div className="relative bg-gray-50">
      {/* Marquee Background */}
      <MarqueeBackground />

      {/* Project Cards Section */}
      <div className="relative z-[2] pt-[10vh]">
        <div className="min-h-[200vh] py-12" style={{ marginTop: "5vh", marginBottom: "5vh" }}>
          <div className="max-w-6xl mx-auto px-6 perspective-1000">
            {PROJECTS.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        </div>

        {/* View More Section */}
        {/* <div className="text-center py-5 relative z-[2]">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-black text-white rounded-full font-medium tracking-wide shadow-lg hover:shadow-xl transition-shadow"
            aria-label="Browse Portfolio"
          >
            Browse Portfolio
          </motion.button>
        </div> */}
      </div>
    </div>
  );
}