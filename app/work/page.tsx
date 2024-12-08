"use client";

import React from 'react';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedName } from '@/components/Name';

const inter = Inter({ subsets: ['latin'] });

interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
  link: string;
  logo: string;
  badge?: {
    text: string;
    color: string;
  };
}

const experiences: WorkExperience[] = [

    {
        company: "Google Developer Comunnity",
        role: "Android Tech Lead",
        period: "2024 - Present",
        description: "Leading the Android development team and organizing workshops.",
        link: "https://gdg.community.dev/gdg-on-campus-vellore-institute-of-technology-bhopal-india/",
        logo: "/gdg.jpeg"
    },
    {
        company: "docq",
        role: "CTO & Co-Founder",
        period: "2024 - Present",
        description: "Providing Healcare services without waits ",
        link: "https://docq.in/",
        logo: "/docq.png"
    },
    {
        company: "Bleesie",
        role: "Founder",
        period: "2024 - 2024",
        description: "Solving the mental health problems with Gen-AI ",
        link: "/work",
        logo: "/bleesie.png",
        badge: {
          text: "AQCUQIRED",
          color: "blue",
        },
    },
    {
        company: "GSSoC'24",
        role: "Student Mentor",
        period: "2024 - 2024",
        description: "Trained and mentored students in open-source contributions.",
        link: "https://gssoc.girlscript.tech/",
        logo: "/gssoc.jpeg",
        badge: {
            text: "#TOP10 Mentor",
            color: "yellow",
            },

    },
   
    {
        company: "SpotOn",
        role: "Founder",
        period: "2024 - 2024",
        description: "A mission to make parking easier and smarter.",
        link: "/work",
        logo: "/park.png",
        badge: {
          text: "FAILED",
          color: "red",
        },
    },
  {
    company: "Intrazeal",
    role: "Founding Member",
    period: "2022 - 2023",
    description: "Leading product development and innovation initiatives.",
    link: "https://intrazeal-nine.vercel.app/",
    logo: "/intrazeal.svg"
  },
  {
    company: "raid.farm",
    role: "Intern",
    period: "2022 - 2022",
    description: "Built and scaled developer tools and infrastructure.",
    link: "/work",
    logo: "/induced.jpeg"
  },
  // Add more experiences
];

// Create a mapping for badge colors to Tailwind classes
const badgeColorClasses = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  gray: 'bg-gray-500',
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: 'tween',
  duration: 0.3,
};

const WorkPage: React.FC = () => {
  return (
    <motion.main
      className={`min-h-screen ${inter.className}`}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className='max-w-2xl mx-auto'>
        <h1 className="text-4xl font-bold mb-2">Work</h1>
        <AnimatedName/>
        {/* <p className="text-gray-600 mb-2">My Journey so far ...</p> */}

        <div className="space-y-2">
          {experiences.map((exp) => (
            <div key={exp.company} className="relative">
              <Link href={exp.link} className="group block p-6 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 relative">
                    <Image src={exp.logo} alt={exp.company} fill className="object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold">{exp.company}</h3>
                      {exp.badge && (
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs font-medium text-white rounded-full ${
                            badgeColorClasses[exp.badge.color as keyof typeof badgeColorClasses]
                          }`}
                        >
                          {exp.badge.text}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 text-sm text-gray-400 mb-2">
                      <span>{exp.role}</span>
                      <span>•</span>
                      <span>{exp.period}</span>
                    </div>
                    <p className="text-gray-500">{exp.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

       
      </div>
    </motion.main>
  );
};

export default WorkPage;