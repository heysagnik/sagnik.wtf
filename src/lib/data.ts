import type { MessageType } from "./types"

export function generateInitialMessages(): MessageType[] {
  return [
    {
      id: "1",
      content: "I'm Sagnik, I'm love building products",
      type: "text",
      sender: "assistant",
    },
    {
      id: "2",
      content:
        "I an open source enthusiast and I've been called a TypeScript wizard at least a few times. I'm interested in things like language specifications and compiler internals.",
      type: "text",
      sender: "assistant",
    },
    {
      id: "3",
      content: "I try to write a blog post every now and then. Everything is on",
      type: "blog",
      blogs: [
        {
          title: "Open Source",
          description: "Thoughts & feelings on Open Source",
          link: "https://sagnik-wtf.vercel.app/open-source",
        },
        {
          title: "Avoiding homework with code (and getting caught)",
          description: "The eventful tale of me getting fed up with my homework",
          link: "https://sagnik-wtf.vercel.app/avoiding-homework-with-code",
        },
        {
          title: "The 0kb Next.js blog",
          description: "How I shipped a Next.js app with a 0kb bundle",
          link: "https://sagnik-wtf.vercel.app/0kb-nextjs-blog",
        }
      ],
      sender: "assistant",
    },
    {
      id: "4",
      content:
        "I listen to a lot of music, and I really love my Drum & Bass. If you come back to this page later, you might see what I'm listening to on Spotify, in realtime. In the meantime, you can check out",
      type: "text",
      
      sender: "assistant",
    },
    {
      id: "4.1",
      content: "",
      type: "music",
      sender: "assistant",
    },
    {
      id: "5",
      content: "Right now I am in Haldia 📍",
      type: "text",
      sender: "assistant",
    },
    {
      id: "5.1",
      content: "",
      type: "location",
      location: {
        name: "Haldia",
        city: "Haldia,West Bengal",
       
      },
      sender: "assistant",
    },
    {
      id: "6",
      content: "Here are some of the projects I've worked on recently",
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
        demoUrl: "https://sagnik-wtf.vercel.app"
      },
      sender: "assistant",
      content: ""
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
        demoUrl: ""
      },
      sender: "assistant",
      content: ""
    },

    
    {
      id: "7",
      content: "Want to reach me? I'd love to chat, whether you want to pitch an idea, or just say hi",
      type: "text",
      sender: "assistant",
    },
  ]
}

