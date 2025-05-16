"use server"; 
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Blog } from './types';


const postsDirectory = path.join(process.cwd(), 'src/content/blogs');

export async function getAllMarkdownBlogs(): Promise<Blog[]> { // Changed to async and Promise<Blog[]>
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Posts directory not found: ${postsDirectory}. Returning empty array.`);
      return [];
    }
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md')) // Include .md as well if needed
      .map(fileName => {
        const slugFromFile = fileName.replace(/\.(mdx|md)$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        const slug = data.slug || slugFromFile;

        return {
          title: data.title as string,
          description: data.description as string,
          link: `/blogs/${slug}`,
        } as Blog;
      });
    // Filter out posts that might be missing title or description after parsing
    return allPostsData.filter(post => post && post.title && post.description);
  } catch (error) {
    console.error("Could not read blog posts from markdown:", error);
    return []; // Return empty on error; fallback logic should be handled by the caller if needed.
  }
}

export async function getBlogBySlug(
  slug: string
): Promise<{ content: string; frontmatter: Record<string, unknown> } | null> { // Changed to async and Promise
  try {
    let fullPath = path.join(postsDirectory, `${slug}.mdx`); // Try .mdx first
    let fileExists = fs.existsSync(fullPath);

    if (!fileExists) {
      fullPath = path.join(postsDirectory, `${slug}.md`); // Fallback to .md
      fileExists = fs.existsSync(fullPath);
    }

    if (!fileExists) {
      console.warn(`Blog post not found for slug: ${slug} (tried .mdx and .md)`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      content,
      frontmatter: data as Record<string, unknown>,
    };
  } catch (error) {
    console.error(`Error reading blog post by slug ${slug}:`, error);
    return null;
  }
}