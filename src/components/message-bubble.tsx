import { useState, useEffect, memo, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { MessageType } from "@/lib/types" 
import MapWidget from "./map-widget"
import { MusicPlaylist } from "./music-widget"
import { Drawer } from 'vaul';


interface MessageBubbleProps {
  message: MessageType
  showAvatar?: boolean
  hideThreadLine?: boolean | null
  noTail?: boolean | null
}

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

const BlogItem = memo(({ blog }: { blog: BlogItemType }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    // Get the card's position and dimensions
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate the rotation angles (-15 to 15 degrees)
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
  }, []);
  
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`
        group relative
        ${blog.link ? 'cursor-pointer' : ''}
        [perspective:800px]
      `}
      onClick={() => {
        if (blog.link) {
          window.open(blog.link, "_blank", "noopener,noreferrer");
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`
          relative rounded-xl p-3
          bg-[#1A1A1A]
          hover:shadow-xl
          transition-all duration-300 ease-out
          [transform-style:preserve-3d]
        `}
        style={{
          transform: isHovering 
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.05)` 
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
        }}
      >
        <div 
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: isHovering ? 'translateZ(20px)' : 'translateZ(0)'
          }}
        >
          <h3 className="text-white-100 text-sm font-semibold line-clamp-2 pr-7">
            {blog.title}
          </h3>
          <p className="text-white-400 text-xs leading-snug line-clamp-3 mt-0.5">
            {blog.description}
          </p>
        </div>

        {blog.link && (
          <div
            className="absolute top-2.5 right-2.5 text-slate-400 group-hover:text-slate-100 
                     p-1 rounded-full group-hover:bg-slate-600/50
                     transition-all duration-300 ease-out"
            style={{
              transform: isHovering ? 'translateZ(40px)' : 'translateZ(0)'
            }}
            aria-label={`Open ${blog.title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
});

BlogItem.displayName = "BlogItem";

const ProjectMedia = memo(({ project, onMediaLoad }: { 
  project: ProjectType, 
  onMediaLoad: () => void 
}) => {
  const isVideo = project.image?.endsWith('.mp4') || project.image?.endsWith('.webm');
  
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <div className="w-full h-full cursor-pointer relative">
          {isVideo ? (
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
          ) : (
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              sizes="(max-width: 640px) 85vw, 320px"
              className="object-cover rounded-lg"
              onLoad={onMediaLoad}
            />
          )}
           {/* Optional: Add an icon or overlay to indicate it's clickable for a drawer */}
           <div className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full backdrop-blur-sm">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="15 3 21 3 21 9"></polyline>
               <polyline points="9 21 3 21 3 15"></polyline>
               <line x1="21" y1="3" x2="14" y2="10"></line>
               <line x1="3" y1="21" x2="10" y2="14"></line>
             </svg>
           </div>
        </div>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-[5000]" />
        <Drawer.Content className="bg-[#1E1E1E] text-white flex flex-col rounded-t-[20px] h-[90%] fixed bottom-0 left-0 right-0 z-[5001] outline-none max-w-[500px] mx-auto">
          <div className="p-4 bg-[#2A2A2A] rounded-t-[10px] flex-shrink-0">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-500 mb-4" />
            <Drawer.Title className="font-semibold text-lg mb-1 text-slate-100">
              {project.title}
            </Drawer.Title>
          </div>
          <div className="p-4 overflow-y-auto flex-grow">
            {project.image && (
              <div className="mb-4 rounded-lg overflow-hidden aspect-video relative">
                {isVideo ? (
                  <video
                    src={project.image}
                    title={project.title}
                    className="object-contain w-full h-full"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                )}
              </div>
            )}
            {project.description && (
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">{project.description}</p>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-slate-200 mb-1.5 text-sm">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <TechnologyBadge key={i} tech={tech} />
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm"
                >
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${
                    project.demoUrl ? 'bg-gray-600 hover:bg-gray-700 text-slate-100' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  View Code
                </a>
              )}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
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
    --tailBg: #121212; /* Assuming this is your chat background color */
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
    border-right: 15px solid var(--sentColor); /* Width of the tail */
    border-bottom-left-radius: 15px; /* Creates a 15px quarter-circle curve */
    transform: translateX(5px); /* How much the tail sticks out (effective right: -5px) */
    z-index: 1;
  }
  .bubble-sent:not(.no-tail):after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    border-right: 20px solid var(--tailBg); /* Width of the background element for the tail */
    border-bottom-left-radius: 12px; /* Curve for the background element, can be same or slightly different */
    transform: translateX(10px); /* Position for the background element (effective right: -10px) */
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
    border-left: 15px solid var(--receiveColor); /* Width of the tail */
    border-bottom-right-radius: 15px; /* Creates a 15px quarter-circle curve */
    transform: translateX(-5px); /* How much the tail sticks out (effective left: -5px) */
    z-index: 1;
  }
  .bubble-received:not(.no-tail):after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    border-left: 20px solid var(--tailBg); /* Width of the background element for the tail */
    border-bottom-right-radius: 12px; /* Curve for the background element */
    transform: translateX(-10px); /* Position for the background element (effective left: -10px) */
    z-index: 0;
  }

 
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
  
  let currentBubbleMaxWidth = "max-w-[85%]"; // Default
  if (message.type === "project") {
    currentBubbleMaxWidth = "max-w-[250px] sm:max-w-[280px]";
  } else if (message.type === "music") { // Covers both music with and without content for max-width
    currentBubbleMaxWidth = "max-w-[300px] sm:max-w-[320px]";
  } else if (message.type === "location") {
    currentBubbleMaxWidth = "max-w-[200px] sm:max-w-[240px]";
  }
  // Add specific max-width for photos or resume if needed, e.g.:
  // else if (message.type === "photos") { currentBubbleMaxWidth = "max-w-lg"; }


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
          <MusicPlaylist />
        </div>
      );
    }

    if (message.type === "photos" && message.photos) {
      return (
        <div className={`${bubbleClass} px-3 py-2.5 ${currentBubbleMaxWidth} relative`}>
          {message.content && (
            <p className="text-[14px] leading-tight mb-2.5">{message.content}</p>
          )}
          <div className="flex flex-wrap gap-2 justify-center"> {/* Centering items if they don't fill the row */}
            {message.photos.map((photo, index) => (
              <div key={index} className="w-[calc(50%-4px)] sm:w-[calc(33.333%-6px)] aspect-square rounded-md overflow-hidden relative group shadow-md">
                <Image
                  src={photo.src}
                  alt={photo.alt || `Photo ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 150px" // Adjusted sizes
                  className="object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
                />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/75 to-transparent">
                    <p className="text-white text-[10px] leading-tight line-clamp-2">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === "resume" && message.resumeLink) {
      return (
        <div className={`${bubbleClass} px-4 py-3 ${currentBubbleMaxWidth} relative`}> {/* Slightly more padding for a button-like feel */}
          {message.content && (
            <p className="text-[14px] leading-tight mb-2.5">{message.content}</p>
          )}
          <a
            href={message.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`${isUser 
              ? 'bg-white/20 text-white hover:bg-white/30 active:bg-white/40' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'} 
              rounded-lg py-2.5 px-4 text-sm font-medium flex items-center justify-center mt-1.5 transition-all duration-200 group w-full sm:w-auto text-center shadow-md`}
          >
            {message.resumeLinkText || "View Resume"}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-2 opacity-80 group-hover:opacity-100 transition-opacity">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>
      );
    }

    // Fallback for existing types (text, blog, project, cta, music with content)
    return (
      <div
        className={`${bubbleClass} px-4 py-2 ${currentBubbleMaxWidth} relative`}
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

        {message.type === "music" && message.content && (
          <div className="space-y-2">
            <p className="text-[14px] leading-tight">{message.content}</p>
            <div className="overflow-hidden rounded-xl mt-1.5">
              <MusicPlaylist />
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
            src="/char.png"
            alt="Avatar"
            width={30}
            height={30}
            className="w-full h-full object-cover"
            priority
            quality={100}
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