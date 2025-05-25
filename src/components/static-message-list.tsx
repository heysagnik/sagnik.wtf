import { memo } from 'react';
import Image from 'next/image';
import Header from './header';
import type { MessageType } from '@/lib/types';

import { BlogMessage } from "./messages/blog-message"
import { ProjectMessage } from "./messages/project-message"
import { MusicMessage } from "./music-widget"
import { LocationMessage } from "./map-widget"
import { PhotosMessage } from "./messages/photos-message"
import { ResumeMessage } from "./messages/resume-message"
import { TextMessage } from "./messages/text-message"

interface StaticMessageListProps {
  className?: string;
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

// Hardcoded messages from data.ts
const HARDCODED_MESSAGES: MessageType[] = [
 {
      id: "1",
      content: "yo, sagnik here.",
      type: "text",
      sender: "assistant",
    },
    {
      id:"1.1",
      content: "",
      photos: [
        {
          src: "/me.jpg",
          alt: "Sagnik's photo",
          caption: "Giving a small talk"
          
        },
        // {
        //   src: "/me3.jpg",
        //   alt: "Sagnik's second photo",
        //   caption: "Mirror selfie vibes",
        // },
      ],
      type: "photos",
      sender: "assistant",

    },
    {
      id: "1.2",
      content: "i make cool stuff & products.",
      type: "text",
      sender: "assistant",
    },
    {
      id: "2",
      content: "big on open source.",
      type: "text",
      sender: "assistant",
    },
    {
      id: "2.1",
      content: "ppl say i'm good at crafting interfaces",
      type: "text",
      sender: "assistant",
    },
    {
      id: "2.2",
      content: "also kinda obsessed w/ hardware & embedded systems tbh.",
      type: "text",
      sender: "assistant",
    },
  {
    id: "3",
    content: "i drop some thoughts on my blog sometimes. check it:",
    type: "blog",
    blogs: [
      {
        title: "Open Source",
        description: "Thoughts & feelings on Open Source",
        link: "/blogs/open-source",
      },
      {
        title: "Avoiding homework with code",
        description: "The eventful tale of me getting fed up with my homework",
        link: "/blogs/avoiding-homework-with-code",
      },
      {
        title: "The 0kb Next.js blog",
        description: "How I shipped a Next.js app with a 0kb bundle",
        link: "/blogs/0kb-nextjs-blog",
      }
    ],
    sender: "assistant",
  },
  {
      id: "4",
      content: "music's my vibe. heavy into 90's bollywood.",
      type: "text",
      sender: "assistant",
    },
    {
      id: "4.1",
      content: "u might catch my spotify live if u check back later.",
      type: "text",
      sender: "assistant",
    },
    {
      id: "4.2",
      content: "for now, here's a taste:",
      type: "text",
      sender: "assistant",
    },
    {
      id: "4.3",
      content: "",
      type: "music",
      sender: "assistant",
        },
          {
        id: "5",
        content: "based in india rn.",
        type: "text",
        sender: "assistant",
          },
          {
        id: "5.1",
        content: "",
        type: "location",
        location: {
          city: "Haldia, WB, India",
        },
        sender: "assistant",
          },
          {
        id: "6",
        content: "some projects i've been cookin up:",
        type: "text",
        sender: "assistant",
          },
          {
        id: "6.1",
        type: "photos",
        photos: [
          {
            src: '/diy-analytics.png',
            alt: "Analytics"
          }
          ],
          sender: "assistant",
          content: ""
        },
        {
          id: "6.2",
          type: "text",
          content: "**diy-analytics**\n\nno cap this analytics service hits different. self-host in 3 clicks & own your data fr.\n\nTechnologies: Next.js, Tailwind, MongoDB",
          sender: "assistant"
        },
        {
          id: "6.3",
          type: "text",
          content: "check it out on github:\n\n https://github.com/heysagnik/diy-analytics",
          sender: "assistant"
        },
        {
          id: "6.4",
          type: "photos",
          photos: [
          {
            src: "/chikki.mp4",
            poster: "/chikki2.png",
            alt: "Chikki - A writing assistant"
          }
        ],
        sender: "assistant",
        content: ""
          },
          {
        id: "6.5",
        type: "text",
        content: "**chikki**\n\nwriting assistant chrome extension that's actually fire. doesn't replace ur voice - just makes it cleaner. like having a friend proofread but way faster ngl.\n\nTechnologies: Chrome Extensions API, TypeScript, AI",
        sender: "assistant"
          },
          {
        id: "6.6",
        type: "text",
        content: "join the waitlist : https://chikkiai.vercel.app/ \n\ncheck it out on github https://github.com/heysagnik/chikki",
        sender: "assistant"
          },
          {
        id: "6.7",
        type: "text",
        content: "rest projects you can find here:\n\nhttps://read.cv/heysagnik",
        sender: "assistant"
      },
    {
      id: "7",
      content: "hmu if u wanna connect.",
      type: "text",
      sender: "assistant",
    },
    {
      id: "7.1",
      content: "down to chat about new ideas or just whatever, fr.",
      type: "text",
      sender: "assistant",
    },
];

const StaticMessageList = memo<StaticMessageListProps>(({ className = '' }) => {
  const renderMessageContent = (message: MessageType) => {
    const isUser = message.sender === "user"
    const bubbleClass = isUser ? BUBBLE_STYLES.sent : BUBBLE_STYLES.received
    const maxWidth = MAX_WIDTHS[message.type as keyof typeof MAX_WIDTHS] || MAX_WIDTHS.default
    const commonProps = { bubbleClass, bubbleMaxWidth: maxWidth }
    
    switch (message.type) {
      case "text":
        return (
          <TextMessage 
            content={message.content || ""} 
            {...commonProps}
          />
        )
        
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
  }

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col ${className}`}>
      {/* Top spacing area - matches MessageList */}
      <div className="h-16 sm:h-20 md:h-24 flex-shrink-0"></div>
      
      {/* Header section - matches MessageList */}
      <div className="mb-8 relative">
        <Header />
      </div>
      <div className="h-8 sm:h-12 md:h-16 lg:h-20 xl:h-24 flex-shrink-0"></div>
      
      {/* Messages container - matches MessageList spacing */}
      <div className="space-y-3 sm:space-y-4 md:space-y-5 mt-auto">
        {HARDCODED_MESSAGES.map((message, index) => {
          const isUser = message.sender === "user"
          
          return (
            <div key={message.id || `msg-${index}`} className="w-full">
              <div
                className={`flex items-end gap-2 my-1 ${isUser ? "flex-row-reverse" : ""}`}
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
                  {renderMessageContent(message)}
                </div>

                {isUser && (
                  <div className="w-6 h-6 flex-shrink-0 mb-1" aria-hidden="true" />
                )}
              </div>
            </div>
          )
        })}
        
        {/* Bottom spacing - matches MessageList */}
        <div className="h-6 sm:h-8 md:h-10 flex-shrink-0"></div>
      </div>
    </div>
  );
});

StaticMessageList.displayName = 'StaticMessageList';
export default StaticMessageList;