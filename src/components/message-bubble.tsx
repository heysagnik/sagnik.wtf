import { useState, useEffect, memo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { MessageType } from "@/lib/types"
import MapWidget from "./map-widget"
import { SpotifyPlaylist } from "./spotify-widget"

interface MessageBubbleProps {
  message: MessageType
  showAvatar?: boolean
  hideThreadLine?: boolean | null
  noTail?: boolean | null
}

// Define proper types instead of using 'any'
interface BlogItemType {
  title: string;
  description: string;
  link?: string;
}

interface ProjectType {
  title: string;
  image?: string;
  description?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies?: string[];
}

const ShimmerEffect = memo(({ 
  direction = "ltr", 
  speed = 1.8, 
  color = "white", 
}: { 
  direction?: "ltr" | "rtl" | "ttb" | "btt",
  speed?: number,
  color?: string,
  size?: string
}) => {
  const isHorizontal = direction === "ltr" || direction === "rtl";
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Primary shimmer layer */}
      <div 
        className="absolute inset-0 w-[200%] h-[200%]"
        style={{
          background: isHorizontal 
            ? `linear-gradient(90deg, transparent 0%, ${color}/15 50%, transparent 100%)` 
            : `linear-gradient(180deg, transparent 0%, ${color}/15 50%, transparent 100%)`,
          backgroundSize: isHorizontal ? '50% 100%' : '100% 50%',
          animation: `shimmer-${direction} ${speed}s cubic-bezier(0.4, 0.0, 0.2, 1) infinite`
        }}
      />
      
      {/* Secondary shimmer layer - adds depth */}
      <div 
        className="absolute inset-0 w-[200%] h-[200%] opacity-70"
        style={{
          background: isHorizontal 
            ? `linear-gradient(90deg, transparent 10%, ${color}/10 50%, transparent 90%)` 
            : `linear-gradient(180deg, transparent 10%, ${color}/10 50%, transparent 90%)`,
          backgroundSize: isHorizontal ? '70% 100%' : '100% 70%',
          animation: `shimmer-${direction} ${speed * 1.5}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
          animationDelay: `${speed * 0.2}s`
        }}
      />
      
      {/* Particle effects */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              backgroundColor: `${color}/25`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `particle-fade ${Math.random() * 3 + 2}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes shimmer-ltr {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes shimmer-rtl {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes shimmer-ttb {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shimmer-btt {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes particle-fade {
          0% { opacity: 0.2; transform: translate(0, 0) scale(0.8); }
          100% { opacity: 0.7; transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) scale(1.2); }
        }
      `}</style>
    </div>
  );
});

ShimmerEffect.displayName = "ShimmerEffect";

const BlogItem = memo(({ blog}: { blog: BlogItemType }) => (
  <div
    className={`
      group relative rounded-xl p-3 
      bg-[#1A1A1A]
      hover:shadow-xl 
      transition-all duration-300 ease-out 
    `}
  >
    <div className="relative">
      <h3 className="text-slate-100 text-sm font-semibold line-clamp-2 pr-7"> {/* Crisper, brighter title */}
        {blog.title}
      </h3>

      <div className="w-10 h-px bg-slate-600 my-2" /> {/* Themed separator, blends well */}

      <p className="text-slate-400 text-xs leading-snug line-clamp-3"> {/* Softer, readable description text */}
        {blog.description}
      </p>
    </div>

    {blog.link && (
      <a
        href={blog.link}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-100 transition-colors duration-150 p-1 rounded-full group-hover:bg-slate-600/50" // Icon styling consistent with the new theme
        aria-label={`Open ${blog.title}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      </a>
    )}
  </div>
));

BlogItem.displayName = "BlogItem";


const ProjectMedia = memo(({ project, onMediaLoad }: { 
  project: ProjectType, 
  onMediaLoad: () => void 
}) => {
  const isVideo = project.image?.endsWith('.mp4') || project.image?.endsWith('.webm');
  
  if (isVideo) {
    return (
      <video
        src={project.image || "/placeholder.svg"}
        title={project.title}
        className="object-cover w-full h-full rounded-lg"
        autoPlay
        muted
        loop
        playsInline
        onLoadedData={onMediaLoad}
      />
    );
  }
  
  return (
    <Image
      src={project.image || "/placeholder.svg"}
      alt={project.title}
      fill
      sizes="(max-width: 640px) 85vw, 320px"
      className="object-cover rounded-lg"
      
      onLoad={onMediaLoad}
    />
  );
});

ProjectMedia.displayName = "ProjectMedia";

const TechnologyBadge = memo(({ tech }: { tech: string }) => (
  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/10 text-white/90">
    {tech}
  </span>
));

TechnologyBadge.displayName = "TechnologyBadge";

const TimestampDisplay = memo(({ timestamp, isUser }: { timestamp: string | number, isUser: boolean }) => (
  <div className={`${isUser ? 'text-white/40 text-right' : 'text-white/40'} text-[9px] mt-1 select-none`}>
    {typeof timestamp === 'string' 
      ? timestamp 
      : new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
  </div>
));

TimestampDisplay.displayName = "TimestampDisplay";


const messageBubbleStyles = `
  :root {
    --sentColor: #0b93f6;
    --receiveColor: #e5e5ea;
    --tailBg: #121212;
  }

  .bubble-sent {
    position: relative;
    background: var(--sentColor);
    color: white;
    border-radius: 18px;
  }
  .bubble-sent:not(.no-tail):before {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    border-right: 20px solid var(--sentColor);
    border-bottom-left-radius: 16px 14px;
    transform: translateX(15px);
    z-index: 1;
  }
  .bubble-sent:not(.no-tail):after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    border-right: 26px solid var(--tailBg);
    border-bottom-left-radius: 10px;
    transform: translateX(25px);
    z-index: 0;
  }

  .bubble-received {
    position: relative;
    background: var(--receiveColor);
    color: black;
    border-radius: 18px;
  }
  .bubble-received:not(.no-tail):before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    border-left: 20px solid var(--receiveColor);
    border-bottom-right-radius: 16px 14px;
    transform: translateX(-15px);
    z-index: 1;
  }
  .bubble-received:not(.no-tail):after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    border-left: 26px solid var(--tailBg);
    border-bottom-right-radius: 10px;
    transform: translateX(-25px);
    z-index: 0;
  }

  /* hide tails when no-tail is applied */
  .bubble-sent.no-tail:before,
  .bubble-sent.no-tail:after,
  .bubble-received.no-tail:before,
  .bubble-received.no-tail:after {
    display: none;
  }

  @media (prefers-color-scheme: dark) {
    .bubble-received {
      background: #3C3C3E;
      color: white;
    }
    .bubble-received:not(.no-tail):before {
      border-left-color: #3C3C3E;
    }
  }
`;

export default function MessageBubble(
  { message, showAvatar = true, hideThreadLine, noTail }: MessageBubbleProps
) {
  const [isVisible, setIsVisible] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const isUser = message.sender === "user";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMediaLoad = useCallback(() => {
    setMediaLoaded(true);
  }, []);

  const bubbleClass = isUser 
    ? "bubble-sent" + (noTail ? " no-tail" : "")
    : "bubble-received theme-dark" + (noTail ? " no-tail" : "");
  
  const bubbleMaxWidth = message.type === "project" 
    ? "max-w-[250px] sm:max-w-[280px]" 
    : message.type === "music" 
      ? "max-w-[300px] sm:max-w-[320px]"
      : "max-w-[85%]";

  const renderContent = () => {
    if (message.type === "location") {
      return (
        <div className="rounded-[18px] overflow-hidden shadow-sm w-full max-w-[200px] sm:max-w-[240px]">
          {message.location && <MapWidget location={message.location} />}
        </div>
      );
    }

    if (message.type === "music" && !message.content) {
      return (
        <div className="rounded-[18px] overflow-hidden shadow-sm w-full max-w-[85%] sm:max-w-[300px] md:max-w-[320px]">
          <SpotifyPlaylist />
        </div>
      );
    }

    return (
      <div
        className={`${bubbleClass} px-4 py-2 ${bubbleMaxWidth} relative`}
      >
        {message.type === "blog" && (
          <div className="space-y-2">
            <p className="text-[14px] leading-tight mb-3">{message.content}</p>
            {message.blogs && message.blogs.length > 0 && (
              <div className="space-y-2 mt-3">
                {message.blogs.map((blog, index) => (
                  <BlogItem key={index} blog={blog}/>
                ))}
              </div>
            )}
          </div>
        )}

        {message.type === "music" && (
          <div className="space-y-2">
            <p className="text-[14px] leading-tight">{message.content}</p>
            <div className="overflow-hidden rounded-xl mt-1.5">
              <SpotifyPlaylist />
            </div>
          </div>
        )}

        {message.type === "project" && message.project && (
          <div className="space-y-2">
            {message.content && (
              <p className="text-[14px] leading-tight">{message.content}</p>
            )}
            <div className="overflow-hidden rounded-lg">
              <div className="flex flex-col">
                <div className="relative h-[112px] bg-gray-800/40">
                  {!mediaLoaded && (
                    <div className="absolute inset-0 overflow-hidden bg-gray-800/80 rounded-lg">
                      <ShimmerEffect />
                    </div>
                  )}
                  
                  <ProjectMedia 
                    project={message.project} 
                    onMediaLoad={handleMediaLoad} 
                  />
                </div>
                
                <div className="p-2.5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[14px] font-medium text-white/95">{message.project.title}</h3>
                    {(message.project.demoUrl || message.project.githubUrl) && (
                      <a
                        href={message.project.demoUrl || message.project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors ml-1.5 flex-shrink-0"
                        aria-label={`Open ${message.project.title} project`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="7" y1="17" x2="17" y2="7"></line>
                          <polyline points="7 7 17 7 17 17"></polyline>
                        </svg>
                      </a>
                    )}
                  </div>
                  
                  {message.project.description && (
                    <p className="text-[12px] text-white/70 leading-tight mt-1">
                      {message.project.description}
                    </p>
                  )}

                  {message.project.technologies && message.project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {message.project.technologies.map((tech, i) => (
                        <TechnologyBadge key={i} tech={tech} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {message.type === "cta" && (
          <div className="space-y-2">
            <p className="text-[14px] leading-tight">{message.content}</p>
            {message.link && (
              <Link 
                href={message.link} 
                className={`${isUser 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-[#0071e3] text-white hover:bg-[#0077ED]'} 
                  rounded-full py-1.5 px-3 text-[12px] font-medium flex items-center justify-center mt-1.5 transition-all duration-200`}
              >
                {message.linkText || "Learn More"}
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1.5">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            )}
          </div>
        )}

        {(!message.type || message.type === "text") && (
          <p className="text-[16px] leading-[21px] font-[-apple-system,BlinkMacSystemFont,sans-serif] whitespace-pre-line">
            {message.content}
          </p>
        )}

        {message.timestamp && (
          <div className={`${isUser ? 'text-white/50' : 'text-white/50'} text-right text-[9px] mt-1 select-none`}>
            {typeof message.timestamp === 'string' 
              ? message.timestamp 
              : new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        )}
      </div>
    );
  };

  const gapClass = hideThreadLine ? "gap-1" : "gap-2";

  return (
    <motion.div
      className={`flex items-end ${gapClass} my-0.5 ${isUser ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 8, scale: isVisible ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {!isUser && showAvatar && !hideThreadLine && (
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-0.5 border border-white/10 shadow-sm">
          <Image
            src="/globe.svg"
            alt="Bot Avatar"
            width={24}
            height={24}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {!isUser && !showAvatar && !hideThreadLine && (
        <div className="w-6 h-6 flex-shrink-0 mb-0.5"></div>
      )}

      <div className={`flex-1 flex ${isUser ? "justify-end" : "justify-start"}`}>
        {renderContent()}
      </div>

      {isUser && !hideThreadLine && (
        <div className="w-6 h-6 flex-shrink-0 mb-0.5"></div>
      )}
      
      <style jsx global>{`
        ${messageBubbleStyles}
        
        /* Add this to your global styles */
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        
        .animate-shine {
          animation: shine 1.2s ease-in-out;
        }
      `}</style>
    </motion.div>
  );
}