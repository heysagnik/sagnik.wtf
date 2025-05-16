import type { Blog } from './types';

export const FALLBACK_BLOGS: Blog[] = [
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
];

export function getFallbackBlogs(): Blog[] {
  return FALLBACK_BLOGS;
}
