import type { Blog } from './types';

export const FALLBACK_BLOGS: Blog[] = [
  {
    title: "Open Source",
    description: "Thoughts & feelings on Open Source",
    link: "/blogs/open-source",
  },
  {
    title: "Art of Procrastination",
    description: "How I procrastinate and still get things done",
    link: "/blogs/art-of-procrastination",
  },
  {
    title: "My viral app ~ ScreenREC",
    description: "How I shipped a web app that went viral",
    link: "/blogs/my-viral-app-screenrec",
  }
];

export function getFallbackBlogs(): Blog[] {
  return FALLBACK_BLOGS;
}
