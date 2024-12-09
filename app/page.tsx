"use client";

import Link from 'next/link';
import { Inter } from 'next/font/google';
import Name from '@/components/Name';
import { useState } from 'react';
import DialogContent from '@/components/Dialog';
import Gallery from '@/components/Gallery';
import { motion } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });

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

const Home: React.FC = () => {
  const [isCollegeDialogOpen, setIsCollegeDialogOpen] = useState(false);

  return (
    <motion.main
      className={`min-h-screen ${inter.className}`}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="max-w-2xl mx-auto">
        <Name />
        <div className="space-y-4">
          <p className="mt-2">
            I&apos;m a product developer and entrepreneur who turns wild ideas into reality. Currently, I&apos;m pursuing my graduation at{' '}
            <span
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => setIsCollegeDialogOpen(true)}
            >
              VIT University
            </span>{' '}
            in Bhopal.
          </p>

          {/* Dialog for VIT University */}
          <DialogContent
            title="VIT University"
            imgSrc="/vit.jpg"
            alt="College"
            isOpen={isCollegeDialogOpen}
            onClose={() => setIsCollegeDialogOpen(false)}
          />

          <p className="mt-2">
            I’ve racked up some serious experience working at{' '}
            <Link href="/work" className="text-blue-500 hover:underline">
              Intrazeal
            </Link>{' '}
            and{' '}
            <Link href="/work" className="text-blue-500 hover:underline">
              raid.farm
            </Link>{' '}
            (now induced.ai). Having co-founded startups such as{' '}
            <Link href="/work" className="text-blue-500 hover:underline">
              SpotOn
            </Link>
            ,{' '}
            <Link href="/work" className="text-blue-500 hover:underline">
              Bleesie
            </Link>
            , and{' '}
            <Link href="/work" className="text-blue-500 hover:underline">
              docq
            </Link>
            , I’ve navigated the startup scene like a pro.
          </p>

          <p className="mt-2">
            Beyond the screen, I&apos;m all about traveling, binge-watching movies, and vibing to music. In my downtime, I&apos;m a side project ninja, freelancing wizard, and open-source contributor. Plus, I&apos;ve got hackathon wins under my belt to back it up.
          </p>

          <p className="mt-2">
            My mission? To build sleek, polished products that make life easier and a whole lot more interesting.
          </p>

            <p className="mt-2">
            Best way to reach me is twitter DMs or{' '}
            <Link href="mailto:sahoosagnik1@gmail.com" className="text-blue-500 hover:underline">
            sahoosagnik1@gmail.com
            </Link>
            . I go by @heysagnik on most places online.
            </p>
        </div>
        
        <Gallery/>
        {/* <div className="mt-12 flex justify-between text-gray-500">
          <span>2024</span>
          <span>Family Values</span>
          <span>08/07</span>
        </div>

         */}
       
      </div>
      
    </motion.main>
  );
};

export default Home;