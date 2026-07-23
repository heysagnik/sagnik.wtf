// Define PageProps type locally since Next.js does not export it
// Replace {} defaults with unknown to satisfy ESLint
type PageProps<Params = unknown, SearchParams = unknown> = {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
};

import { getBlogBySlug } from '@/lib/blogService.server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import BlogPostContent from './BlogPostContent';
import { DOMAIN } from '@/app/metadata';

type BlogParams = { slug: string[] };
type BlogSearchParams = { from?: string };

export async function generateMetadata({
  params: paramsPromise,
}: PageProps<BlogParams, BlogSearchParams>): Promise<Metadata> {
  const params = await paramsPromise;
  const { slug } = params;
  if (!slug) {
    return { title: 'Blog Post Not Found | Sagnik Sahoo' };
  }

  const actualSlug = Array.isArray(slug) ? slug.join('/') : '';
  const post = await getBlogBySlug(actualSlug);
  if (!post) {
    return { title: 'Blog Post Not Found | Sagnik Sahoo' };
  }

  const title = typeof post.frontmatter.title === 'string' ? post.frontmatter.title : 'Blog Post';
  const description = typeof post.frontmatter.description === 'string' ? post.frontmatter.description : '';
  const url = `${DOMAIN}/blogs/${actualSlug}`;
  const authorName = typeof post.frontmatter.author === 'string' ? post.frontmatter.author : 'Sagnik Sahoo';
  const tags = Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags : [];
  const publishDate = typeof post.frontmatter.date === 'string' ? post.frontmatter.date : undefined;
  const coverImage = typeof post.frontmatter.coverImage === 'string' ? `${DOMAIN}${post.frontmatter.coverImage}` : `${DOMAIN}/og.png`;

  return {
    title: `${title} | Sagnik Sahoo`,
    description,
    authors: [{ name: authorName, url: DOMAIN }],
    keywords: tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      url,
      title: `${title} | Sagnik Sahoo`,
      description,
      publishedTime: publishDate,
      authors: [authorName],
      tags,
      images: [
        {
          url: coverImage,
          alt: title,
        },
      ],
      siteName: 'Sagnik Sahoo Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Sagnik Sahoo`,
      description,
      creator: '@heysagnik',
      images: [coverImage],
    },
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
  const postUrl = `${DOMAIN}/blogs/${actualSlug}`;
  const title = typeof post.frontmatter.title === 'string' ? post.frontmatter.title : '';
  const description = typeof post.frontmatter.description === 'string' ? post.frontmatter.description : '';
  const coverImage = typeof post.frontmatter.coverImage === 'string' ? `${DOMAIN}${post.frontmatter.coverImage}` : `${DOMAIN}/og.png`;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    headline: title,
    description: description,
    image: [coverImage],
    datePublished: typeof post.frontmatter.date === 'string' ? post.frontmatter.date : undefined,
    author: {
      '@type': 'Person',
      name: 'Sagnik Sahoo',
      url: DOMAIN,
    },
    publisher: {
      '@type': 'Person',
      name: 'Sagnik Sahoo',
      url: DOMAIN,
    },
    keywords: Array.isArray(post.frontmatter.tags) ? post.frontmatter.tags.join(', ') : undefined,
  };

  return (
    <>
      <Script
        id={`blog-schema-${actualSlug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <BlogPostContent
        post={{
          title,
          content: post.content,
        }}
        date={date}
        fromHome={fromHome}
      />
    </>
  );
}