export interface Blog {
  title: string
  description: string
  link?: string
}

export interface Project {
  title: string
  image: string
  description?: string
  link?: string
  url?: string
  tags?: string[]
  technologies?: string[]
  githubUrl?: string
  demoUrl?: string
}

export interface Location {
  name: string
  mapImage?: string
  city?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface PhotoItemType {
  src: string;
  alt?: string;
  caption?: string;
}

export type MessageType =
  | {
      id: string;
      content: string;
      type: "text";
      sender: "user" | "assistant";
      timestamp?: string | number;
      blogs?: never;
      project?: never;
      location?: never;
      link?: never;
      linkText?: never;
      photos?: never;
      resumeLink?: never;
      resumeLinkText?: never;
    }
  | {
      id: string;
      content?: string;
      type: "blog";
      blogs: Blog[];
      sender: "user" | "assistant";
      timestamp?: string | number;
      project?: never;
      location?: never;
      link?: never;
      linkText?: never;
      photos?: never;
      resumeLink?: never;
      resumeLinkText?: never;
    }
  | {
      id: string;
      content?: string;
      type: "project";
      project: Project;
      sender: "user" | "assistant";
      timestamp?: string | number;
      blogs?: never;
      location?: never;
      link?: never;
      linkText?: never;
      photos?: never;
      resumeLink?: never;
      resumeLinkText?: never;
    }
  | {
      id: string;
      content?: string;
      type: "location";
      location: { city: string; mapLink?: string };
      sender: "user" | "assistant";
      timestamp?: string | number;
      blogs?: never;
      project?: never;
      link?: never;
      linkText?: never;
      photos?: never;
      resumeLink?: never;
      resumeLinkText?: never;
    }
  | {
      id: string;
      content?: string;
      type: "music";
      sender: "user" | "assistant";
      timestamp?: string | number;
      blogs?: never;
      project?: never;
      location?: never;
      link?: never;
      linkText?: never;
      photos?: never;
      resumeLink?: never;
      resumeLinkText?: never;
    }
  | {
      id: string;
      content: string;
      type: "cta";
      link: string;
      linkText?: string;
      sender: "user" | "assistant";
      timestamp?: string | number;
      blogs?: never;
      project?: never;
      location?: never;
      photos?: never;
      resumeLink?: never;
      resumeLinkText?: never;
    }
  | { // New type for photos
      id: string;
      content?: string; // Optional introductory text
      type: "photos";
      photos: PhotoItemType[];
      sender: "user" | "assistant";
      timestamp?: string | number;
      blogs?: never;
      project?: never;
      location?: never;
      link?: never;
      linkText?: never;
      resumeLink?: never;
      resumeLinkText?: never;
    }
  | { // New type for resume
      id: string;
      content?: string; // Optional introductory text
      type: "resume";
      resumeLink: string; // URL to the resume file (e.g., PDF)
      resumeLinkText?: string; // Text for the link/button (e.g., "View My Resume")
      sender: "user" | "assistant";
      timestamp?: string | number;
      blogs?: never;
      project?: never;
      location?: never;
      link?: never;
      linkText?: never;
      photos?: never;
    };
