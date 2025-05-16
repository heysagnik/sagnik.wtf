// Define PageProps type locally since Next.js does not export it
// Replace {} defaults with unknown to satisfy ESLint
type PageProps<Params = unknown, SearchParams = unknown> = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

import { getBlogBySlug } from '@/lib/blogService.server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

type BlogParams = { slug: string[] };
type BlogSearchParams = { from?: string };

export async function generateMetadata({
  params: paramsPromise,
}: PageProps<BlogParams, BlogSearchParams>): Promise<Metadata> {
  const params = await paramsPromise;
  const { slug } = params;
  if (!slug) {
    return { title: 'Blog Post Not Found' };
  }

  const actualSlug = Array.isArray(slug) ? slug.join('/') : '';
  const post = await getBlogBySlug(actualSlug);
  if (!post) {
    return { title: 'Blog Post Not Found' };
  }

  return {
    title:
      typeof post.frontmatter.title === 'string'
        ? post.frontmatter.title
        : '',
    description:
      typeof post.frontmatter.description === 'string'
        ? post.frontmatter.description
        : '',
  };
}

export default async function BlogPostPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: PageProps<BlogParams, BlogSearchParams>) {
  const params = await paramsPromise;
  const searchParams = await searchParamsPromise;
  const { slug } = params;
  if (!slug) notFound();

  const actualSlug = Array.isArray(slug) ? slug.join('/') : '';
  const post = await getBlogBySlug(actualSlug);
  if (!post) notFound();

  const dateValue = post.frontmatter.date;
  const date =
    dateValue &&
    (typeof dateValue === 'string' ||
      typeof dateValue === 'number' ||
      dateValue instanceof Date)
      ? new Date(dateValue).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : '';

  const fromHome = searchParams.from === 'home';

  return (
    <BlogPostContent
      post={{
        title:
          typeof post.frontmatter.title === 'string'
            ? post.frontmatter.title
            : '',
        content: post.content,
      }}
      date={date}
      fromHome={fromHome}
    />
  );
}