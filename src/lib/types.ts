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

export type MessageType = {
  id: string;
  sender: "user" | "assistant";
  content: string;
  type?: "text" | "blog" | "location" | "project"  | "cta" | "music";
  link?: string;
  linkText?: string;
  blogs?: Blog[];
  project?: Project;
  projects?: Project[];
  location?: Location;
  timestamp?: Date | number;
}
