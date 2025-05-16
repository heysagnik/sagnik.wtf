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
      id: "1.1",
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
      type: "project",
      project: {
        title: "Portfolio Website",
        description: "A personal portfolio built with Next.js and Tailwind CSS",
        image: "/hello.mp4",
        technologies: ["Next.js", "Tailwind", "TypeScript"],
        githubUrl: "https://github.com/heysagnik",
        demoUrl: "https://sagnik-wtf.vercel.app",
      },
      sender: "assistant",
      content: "",
    },
    {
      id: "6.2",
      type: "project",
      project: {
        title: "Chat Application",
        description: "A real-time chat application built with React and Firebase",
        image: "/hello.jpg",
        technologies: ["React", "Firebase", "TypeScript"],
        githubUrl: "",
        demoUrl: "",
      },
      sender: "assistant",
      content: "",
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

