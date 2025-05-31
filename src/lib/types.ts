export interface Blog {
  title: string;
  description: string;
  link?: string;
}

export interface Project {
  title: string;
  image?: string;
  description?: string;
  demoUrl?: string;
  githubUrl?: string;
  technologies?: string[];
}

export interface Location {
  city: string;
}

export interface Photo {
  src: string;
  alt?: string;
  caption?: string;
  poster?: string;
}

interface BaseMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp?: string | number;
  reactions?: string[];
}

export interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
}

export interface BlogMessage extends BaseMessage {
  type: "blog";
  content?: string;
  blogs: Blog[];
}

export interface ProjectMessage extends BaseMessage {
  type: "project";
  content?: string;
  project: Project;
}

export interface LocationMessage extends BaseMessage {
  type: "location";
  content?: string;
  location: Location;
}

export interface MusicMessage extends BaseMessage {
  type: "music";
  content?: string;
}

export interface CTAMessage extends BaseMessage {
  type: "cta";
  content: string;
  link: string;
  linkText?: string;
}

export interface PhotosMessage extends BaseMessage {
  type: "photos";
  content?: string;
  photos: Photo[];
}

export interface ResumeMessage extends BaseMessage {
  type: "resume";
  content?: string;
  resumeLink: string;
  resumeLinkText?: string;
}

export type MessageType = 
  | TextMessage
  | BlogMessage
  | ProjectMessage
  | LocationMessage
  | MusicMessage
  | CTAMessage
  | PhotosMessage
  | ResumeMessage;

export type MessageVariant = MessageType['type'];

export type Sender = BaseMessage['sender'];

export const MESSAGE_TYPES = {
  TEXT: 'text',
  BLOG: 'blog',
  PROJECT: 'project',
  LOCATION: 'location',
  MUSIC: 'music',
  CTA: 'cta',
  PHOTOS: 'photos',
  RESUME: 'resume'
} as const;

export const SENDERS = {
  USER: 'user',
  ASSISTANT: 'assistant'
} as const;