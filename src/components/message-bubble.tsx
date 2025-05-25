import { memo, useMemo } from "react"
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

interface MessageBubbleProps {
  message: MessageType
}

const BUBBLE_STYLES = {
  sent: "bg-[#007AFF] text-white rounded-[18px] rounded-br-[6px]",
  received: "bg-[#E9E9EB] dark:bg-[#2C2C2E] text-black dark:text-white rounded-[18px] rounded-bl-[6px]"
} as const

const MAX_WIDTHS = {
  project: "max-w-[280px]",
  music: "max-w-[320px]", 
  location: "max-w-[240px]",
  default: "max-w-[85%]"
} as const

const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.2, ease: "easeOut" }
} as const

const MessageBubble = memo<MessageBubbleProps>(({ message }) => {
  const isUser = message.sender === "user"
  
  const bubbleClass = useMemo(() => 
    isUser ? BUBBLE_STYLES.sent : BUBBLE_STYLES.received,
    [isUser]
  )
  
  const maxWidth = useMemo(() => 
    MAX_WIDTHS[message.type as keyof typeof MAX_WIDTHS] || MAX_WIDTHS.default,
    [message.type]
  )

  const renderMessageContent = useMemo(() => {
    const commonProps = { bubbleClass, bubbleMaxWidth: maxWidth }
    
    switch (message.type) {
      case "location":
        return message.location && (
          <LocationMessage locationCity={message.location.city} />
        )
        
      case "music":
        return (
          <MusicMessage 
            content={message.content} 
            {...commonProps}
          />
        )
        
      case "photos":
        return message.photos && (
          <PhotosMessage 
            content={message.content} 
            photos={message.photos} 
            {...commonProps}
          />
        )
        
      case "resume":
        return message.resumeLink && (
          <ResumeMessage 
            content={message.content} 
            resumeLink={message.resumeLink} 
            resumeLinkText={message.resumeLinkText} 
            isUser={isUser}
            {...commonProps}
          />
        )
        
      case "blog":
        return (
          <BlogMessage 
            content={message.content} 
            blogs={message.blogs} 
            {...commonProps}
          />
        )
        
      case "project":
        return message.project && (
          <ProjectMessage 
            content={message.content} 
            project={message.project} 
            {...commonProps}
          />
        )
        
      default:
        return (
          <TextMessage 
            content={message.content || ""} 
            {...commonProps}
          />
        )
    }
  }, [message, bubbleClass, maxWidth, isUser])

  return (
    <motion.div
      className={`flex items-end gap-2 my-1 ${isUser ? "flex-row-reverse" : ""}`}
      {...ANIMATION_CONFIG}
      role="listitem"
      aria-label={`${isUser ? 'Your' : 'Received'} message`}
    >
      {!isUser && (
        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1 border border-white/10 shadow-sm">
          <Image
            src="/char.png"
            alt="Assistant avatar"
            width={24}
            height={24}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      <div className={`flex-1 flex ${isUser ? "justify-end" : "justify-start"}`}>
        {renderMessageContent}
      </div>

      {isUser && (
        <div className="w-6 h-6 flex-shrink-0 mb-1" aria-hidden="true" />
      )}
    </motion.div>
  )
})

MessageBubble.displayName = 'MessageBubble'
export default MessageBubble