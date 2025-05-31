"use server"; 

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Blog } from './types';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/content/blogs');
const SUPPORTED_EXTENSIONS = ['.mdx', '.md'] as const;

const fileExists = (filePath: string): boolean => fs.existsSync(filePath);

const readFileContents = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read file: ${filePath}. ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const parseMarkdownFile = (fileName: string): Blog | null => {
  const slugFromFile = fileName.replace(/\.(mdx|md)$/, '');
  const fullPath = path.join(POSTS_DIRECTORY, fileName);
  
  try {
    const fileContents = readFileContents(fullPath);
    const { data } = matter(fileContents);
    const slug = data.slug || slugFromFile;

    if (!data.title || !data.description) {
      console.warn(`Missing required fields in ${fileName}`);
      return null;
    }

    return {
      title: data.title as string,
      description: data.description as string,
      link: `/blogs/${slug}`,
    };
  } catch (error) {
    console.error(`Error parsing ${fileName}:`, error);
    return null;
  }
};

const getMarkdownFiles = (): string[] => {
  if (!fileExists(POSTS_DIRECTORY)) {
    console.warn(`Posts directory not found: ${POSTS_DIRECTORY}`);
    return [];
  }

  return fs.readdirSync(POSTS_DIRECTORY)
    .filter(fileName => SUPPORTED_EXTENSIONS.some(ext => fileName.endsWith(ext)));
};

export async function getAllMarkdownBlogs(): Promise<Blog[]> {
  try {
    const fileNames = getMarkdownFiles();
    
    const blogs = fileNames
      .map(parseMarkdownFile)
      .filter((blog): blog is Blog => blog !== null);

    return blogs;
  } catch (error) {
    console.error("Failed to read blog posts:", error);
    return [];
  }
}

const findBlogFile = (slug: string): string | null => {
  for (const ext of SUPPORTED_EXTENSIONS) {
    const fullPath = path.join(POSTS_DIRECTORY, `${slug}${ext}`);
    if (fileExists(fullPath)) {
      return fullPath;
    }
  }
  return null;
};

export async function getBlogBySlug(
  slug: string
): Promise<{ content: string; frontmatter: Record<string, unknown> } | null> {
  try {
    const filePath = findBlogFile(slug);
    
    if (!filePath) {
      console.warn(`Blog post not found for slug: ${slug}`);
      return null;
    }

    const fileContents = readFileContents(filePath);
    const { data, content } = matter(fileContents);
    
    return {
      content,
      frontmatter: data as Record<string, unknown>,
    };
  } catch (error) {
    console.error(`Error reading blog post for slug ${slug}:`, error);
    return null;
  }
}