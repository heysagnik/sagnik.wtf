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
          src: "/hello.jpg",
          alt: "Sagnik's photo",
          
        },
        {
          src: "/char.png",
          alt: "Sagnik's second photo",
         
        },
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
      content: "ppl say i'm a typescript wiz.",
      type: "text",
      sender: "assistant",
    },
    {
      id: "2.2",
      content: "also kinda obsessed w/ language specs & compiler internals tbh.",
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
      content: "music's my vibe. heavy into drum & bass.",
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
      id: "4.3", // Was 4.1
      content: "",
      type: "music",
      sender: "assistant",
    },
    {
      id: "5",
      content: "based in haldia rn.",
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
          src: "/hello.mp4", // Using project image as photo
          alt: "Portfolio Website preview"
        }
      ],
      sender: "assistant",
      content: ""
    },
    {
      id: "6.2",
      type: "text",
      content: "Portfolio Website\n\nA personal portfolio built with Next.js and Tailwind CSS\n\nTechnologies: Next.js, Tailwind, TypeScript",
      sender: "assistant"
    },
    {
      id: "6.3",
      type: "text",
      content: "this is the site you're on rn, lol.",
      sender: "assistant"
    },
    {
      id: "6.4",
      type: "photos",
      photos: [
        {
          src: "/hello.jpg", // Using project image as photo
          alt: "Chat Application preview"
        }
      ],
      sender: "assistant",
      content: ""
    },
    {
      id: "6.5",
      type: "text",
      content: "Chat Application\n\nA real-time chat application built with React and Firebase\n\nTechnologies: React, Firebase, TypeScript",
      sender: "assistant"
    },
    {
      id: "6.6",
      type: "text",
      content: "check it out on github https://github.com/heysagnik", // Using GitHub as fallback since no demo URL
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

