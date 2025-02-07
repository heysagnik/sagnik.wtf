import React from 'react';
import Image from 'next/image';

interface SocialLinkProps {
  href: string;
  label: string;
  tilt: number;
  className?: string;
}

const SocialLink: React.FC<SocialLinkProps & { username?: string }> = ({ 
  href, 
  label, 
  tilt,
  username = '@username', 
  className
}) => (
  <a
    href={href}
    className="group relative inline-block pt-5"
    target="_blank"
    rel="noopener noreferrer"
    style={{ transform: `rotate(${tilt}deg)` }}
  >
    <div className="relative">
      <div className="relative p-4 bg-white rounded-lg" style={{ minWidth: '180px' }}>
        <Image
          src="/tape.png" 
          alt="Tape" 
          width={30}
          height={30}
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20"
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
        <div className="absolute inset-0 rounded-lg border-2 border-dashed border-blue-300" />
        
        <div className="relative overflow-hidden">
          <span className="block font-sans text-[clamp(0.875rem,1.25vw,1.5rem)] font-medium text-blue-500 transition-all duration-300 transform group-hover:translate-y-[-100%] whitespace-nowrap">
            {label}
          </span>
          <span className={`absolute top-full left-0 w-full text-[clamp(0.875rem,1.25vw,1.5rem)] font-medium text-blue-600 transition-all duration-300 transform group-hover:translate-y-[-100%] whitespace-nowrap ${className || ''}`}>
            {username}
          </span>
        </div>
      </div>
    </div>
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white px-8 pt-32 pb-6 overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(209, 213, 219, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(209, 213, 219, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px, 24px 24px',
        mask: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
      }} />

      <div className="relative mx-auto max-w-4xl text-center">
        <h2 className="mb-8 text-6xl font-bold">
          Let&apos;s connect and craft
          <br/>{' '}
          <span className="inline text-blue-500 text-600 italic font-playfair-display">experiences</span> together
        </h2>
        
        <p className="mb-12 text-xl text-gray-600 max-w-2xl mx-auto">
          I&apos;m passionate about user flows, research, and visuals—and I love
          discussing ideas over a cup of chai. Drop me a message, and let&apos;s chat!
        </p>

        <div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 max-w-3xl mx-auto">
            <SocialLink
              href="https://x.com/heysagnik"
              label="X"
              username='@heysagnik'
              tilt={-5}
            />
            <SocialLink
              href="mailto:sahoosagnik1@gmail.com"
              label="Email"
              tilt={3}
              username='sahoosagnik1'
              className="text-[18px]"
            />
            <SocialLink
              href="https://linkedin.com/in/heysagnik"
              label="LinkedIn"
              username='@heysagnik'
              tilt={4}
            />
            
            <div className="relative">
              <Image 
                src="/click.png" 
                alt="Instagram" 
                height={51}
                width={86}

                className="absolute -top-6 -right-4 w-[86px] h-[51px] z-30"
              />
              <SocialLink
                href="https://instagram.com/heysagnik"
                label="Instagram"
                username='@heysagnik'
                tilt={-2}
              />
            </div>
          </div>
        </div>

        <div className="mt-16 text-sm text-gray-500">
          <p>Made with &lt;3 © {new Date().getFullYear()} All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;