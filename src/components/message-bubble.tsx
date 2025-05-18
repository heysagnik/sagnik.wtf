import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { MessageType } from "@/lib/types"

import { BlogMessage } from "./messages/blog-message"
import { ProjectMessage } from "./messages/project-message"
import { MusicMessage } from "./music-widget"
import { LocationMessage } from "./map-widget"
import { PhotosMessage } from "./messages/photos-message"
import { ResumeMessage } from "./messages/resume-message"
import { TextMessage } from "./messages/text-message"

// Move interfaces to a separate types file in a real project
interface MessageBubbleProps {
  message: MessageType;
}

// Simplified message bubble styles
const messageBubbleStyles = `
  .bubble-sent {
    background: #0b93f6;
    color: white;
    border-radius: 18px;
  }

  .bubble-received {
    background: #e5e5ea;
    color: black;
    border-radius: 18px;
  }

  @media (prefers-color-scheme: dark) {
    .bubble-received {
      background: #3C3C3E;
      color: white;
    }
  }
`;

/**
 * MessageBubble component displays different types of message bubbles in a chat interface
 * Supports text, blog, project, cta, music, location, photos and resume messages
 */
export default function MessageBubble({ message }: MessageBubbleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isUser = message.sender === "user";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const bubbleClass = useMemo(() => 
    isUser ? "bubble-sent" : "bubble-received theme-dark",
  [isUser]);
  
  // Determine bubble width based on content type
  const bubbleMaxWidth = useMemo(() => {
    switch (message.type) {
      case "project": return "max-w-[250px] sm:max-w-[280px]";
      case "music": return "max-w-[300px] sm:max-w-[320px]";
      case "location": return "max-w-[200px] sm:max-w-[240px]";
      default: return "max-w-[85%]";
    }
  }, [message.type]);

  // Build motion animation props
  const motionProps = useMemo(() => ({
    initial: { opacity: 0, y: 8, scale: 0.98 },
    animate: { 
      opacity: isVisible ? 1 : 0, 
      y: isVisible ? 0 : 8, 
      scale: isVisible ? 1 : 0.98 
    },
    transition: { duration: 0.2, ease: "easeOut" }
  }), [isVisible]);

  // Render message content based on type
  const renderContent = useCallback(() => {
    switch (message.type) {
      case "location":
        return message.location && <LocationMessage locationCity={message.location.city} />;
        
      case "music":
        return <MusicMessage 
          content={message.content} 
          bubbleClass={bubbleClass} 
          bubbleMaxWidth={bubbleMaxWidth} 
        />;
        
      case "photos":
        return message.photos && (
          <PhotosMessage 
            content={message.content} 
            photos={message.photos} 
            bubbleClass={bubbleClass} 
            bubbleMaxWidth={bubbleMaxWidth} 
          />
        );
        
      case "resume":
        return message.resumeLink && (
          <ResumeMessage 
            content={message.content} 
            resumeLink={message.resumeLink} 
            resumeLinkText={message.resumeLinkText} 
            bubbleClass={bubbleClass} 
            bubbleMaxWidth={bubbleMaxWidth}
            isUser={isUser}
          />
        );
        
      case "blog":
        return (
          <BlogMessage 
            content={message.content} 
            blogs={message.blogs} 
            bubbleClass={bubbleClass} 
            bubbleMaxWidth={bubbleMaxWidth} 
          />
        );
        
      case "project":
        return message.project && (
          <ProjectMessage 
            content={message.content} 
            project={message.project} 
            bubbleClass={bubbleClass} 
            bubbleMaxWidth={bubbleMaxWidth} 
          />
        );
        
     
      default:
        return (
          <TextMessage 
            content={message.content || ""} 
            bubbleClass={bubbleClass} 
            bubbleMaxWidth={bubbleMaxWidth} 
          />
        );
    }
  }, [message, bubbleClass, bubbleMaxWidth, isUser]);

  return (
    <motion.div
      className={`flex items-end gap-2 my-0.5 ${isUser ? "flex-row-reverse" : ""}`}
      {...motionProps}
      role="listitem"
      aria-label={`${isUser ? 'Your' : 'Received'} message`}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-0.5 border border-white/10 shadow-sm">
          <Image
            src="/char.png"
            alt="Assistant avatar"
            width={30}
            height={30}
            className="w-full h-full object-cover"
            priority
            quality={100}
          />
        </div>
      )}

      <div className={`flex-1 flex ${isUser ? "justify-end" : "justify-start"}`}>
        {renderContent()}
      </div>

      {isUser && (
        <div className="w-6 h-6 flex-shrink-0 mb-0.5" aria-hidden="true"></div>
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