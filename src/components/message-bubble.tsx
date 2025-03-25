import type { MessageType } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import MapWidget from "./map-widget"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { SpotifyPlaylist } from "./spotify-widget"

interface MessageBubbleProps {
  message: MessageType
  showAvatar?: boolean
}

export default function MessageBubble({ message, showAvatar }: MessageBubbleProps) {
  const [, setIsVisible] = useState(false)
  const isUser = message.sender === "user"

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const bubbleStyle = isUser
    ? "bg-gradient-to-br from-[#0c84fe] to-[#0071e3] text-white rounded-[18px] rounded-br-md"
    : "bg-[#1c1c1e] dark:bg-[#1c1c1e] text-white rounded-[18px] rounded-bl-md"

  return (
    <motion.div
      className={`flex items-end gap-2 my-0.5 ${isUser ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {showAvatar && !isUser && (
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-0.5 border border-white/10 shadow-sm">
          <Image
            src="/globe.svg"
            alt="Avatar"
            width={24}
            height={24}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`flex-1 flex ${isUser ? "justify-end" : "justify-start"}`}>
        {message.type === "location" ? (
            <div className="rounded-[18px] overflow-hidden shadow-sm w-full max-w-[200px] sm:max-w-[240px]">
            {message.location && <MapWidget location={message.location} />}
            </div>
        ) : message.type === "music" && !message.content ? (
          // Standalone music widget with proper styling when no content is provided
            <div className="rounded-[18px] overflow-hidden shadow-sm w-full max-w-[85%] sm:max-w-[300px] md:max-w-[320px]">
            <SpotifyPlaylist />
            </div>
        ) : (
          <div
            className={`${bubbleStyle} px-3 py-2 max-w-[85%] shadow-sm ${
              message.type === "project" ? "max-w-[250px] sm:max-w-[280px]" : 
              message.type === "music" ? "max-w-[300px] sm:max-w-[320px]" : ""
            }`}
            style={{
              boxShadow: isUser
                ? "0 1px 2px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2)"
                : "0 1px 2px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.08)",
            }}
          >
            {message.type === "blog" ? (
                <div className="space-y-2">
                <p className="text-[14px] leading-tight mb-3">{message.content}</p>
                {message.blogs && (
                  <div className="space-y-2 mt-3">
                  {message.blogs.map((blog, index) => (
                  <div 
                  key={index} 
                  className={`${isUser 
                  ? 'bg-[#0071e3]/60 backdrop-blur-sm border border-white/10' 
                  : 'bg-[#2c2c2e] border border-white/5'} 
                  rounded-xl p-2.5 transition-all hover:shadow-md hover:translate-y-[-1px] relative`}
                  >
                  <h3 className="text-white/95 text-[14px] font-medium line-clamp-2 pr-6">{blog.title}</h3>
                  <p className="text-white/70 text-[12px] leading-snug mt-1 line-clamp-3">{blog.description}</p>
                  {blog.link && (
                  <>
                  <a 
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="absolute top-2.5 right-2.5 text-white/70 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </a>
                  
                  </>
                  )}
                  </div>
                  ))}
                  </div>
                )}
                </div>
            ) : message.type === "music" ? (
              <div className="space-y-2">
                <p className="text-[14px] leading-tight">{message.content}</p>
                <div className="overflow-hidden rounded-xl mt-1.5">
                  <SpotifyPlaylist />
                </div>
              </div>
            ) : message.type === "project" && message.project ? (
              <div className="space-y-2">
                {message.content && (
                  <p className="text-[14px] leading-tight">{message.content}</p>
                )}
                <div className="overflow-hidden rounded-lg">
                  <div className="flex flex-col">
                    <div className="relative h-[112px]">
                      {message.project.image?.endsWith('.mp4') || message.project.image?.endsWith('.webm') ? (
                        <video
                          src={message.project.image || "/placeholder.svg"}
                          title={message.project.title}
                          className="object-cover w-full h-full"
                          autoPlay
                          muted
                          loop
                        />
                      ) : (
                        <Image
                          src={message.project.image || "/placeholder.svg"}
                          alt={message.project.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    <div className=" p-2.5">
                      <div className="flex justify-between items-start">
                        <h3 className="text-[14px] font-medium text-white/95">{message.project.title}</h3>
                        {(message.project.demoUrl || message.project.githubUrl) && (
                          <a
                            href={message.project.demoUrl || message.project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 hover:text-white transition-colors ml-1.5 flex-shrink-0"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="7" y1="17" x2="17" y2="7"></line>
                              <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                          </a>
                        )}
                      </div>
                      
                      {message.project.description && (
                        <p className="text-[12px] text-white/70 leading-tight mt-1">{message.project.description}</p>
                      )}

                      {message.project.technologies && message.project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {message.project.technologies.map((tech, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/10 text-white/90"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : message.type === "cta" ? (
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
            ) : (
              <p className="text-[14px] leading-snug whitespace-pre-line">{message.content}</p>
            )}

            {/* {message.link && message.type !== "cta" && (
              <Link 
                href={message.link} 
                className={`${isUser 
                  ? 'text-white/90 hover:text-white underline' 
                  : 'text-[#0a84ff] hover:text-[#0071e3] underline'} block mt-1 text-[12px] font-medium`}
              >
                {message.linkText || message.link}
              </Link>
            )} */}

            {message.timestamp && (
              <div className={`${isUser ? 'text-white/40 text-right' : 'text-white/40'} text-[9px] mt-1 select-none`}>
                {typeof message.timestamp === 'string' 
                  ? message.timestamp 
                  : new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            )}
          </div>
        )}
      </div>

      {!showAvatar && !isUser && <div className="w-6 flex-shrink-0"></div>}
    </motion.div>
  )
}
