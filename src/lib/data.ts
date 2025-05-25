import type { MessageType, Blog } from "./types";
import { getFallbackBlogs } from "./blogService"; // Uses the client-safe service

export function generateInitialMessages(markdownBlogs?: Blog[]): MessageType[] {
  let blogsToDisplay: Blog[];

  if (markdownBlogs && markdownBlogs.length > 0) {
    blogsToDisplay = markdownBlogs;
  } else {
    console.warn("No markdown blogs provided or found. Using fallback blogs for initial messages.");
    blogsToDisplay = getFallbackBlogs();
  }

  return [
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
      blogs: blogsToDisplay,
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
}

