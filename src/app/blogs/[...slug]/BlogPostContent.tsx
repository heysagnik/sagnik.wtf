"use client";

import React, { useEffect, Suspense, lazy, Children } from 'react';
import { motion } from 'framer-motion';
import NextLink from 'next/link';
import { CornerUpLeft} from 'lucide-react'; // Added LinkIcon
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Components } from 'react-markdown';

// Lazy-load markdown components
const ReactMarkdown = lazy(() => import('react-markdown'));

interface BlogPostContentProps {
  post: { title: string; content: string };
  date: string;
  fromHome: boolean;
}

// Minimal skeleton loader for markdown content
function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-neutral-800 rounded-sm w-full max-w-[80%]" /> {/* Title line */}
      <div className="h-4 bg-neutral-800 rounded-sm w-full max-w-[40%] mb-8" /> {/* Date line */}
      
      <div className="h-5 bg-neutral-800 rounded-sm w-full" /> {/* Paragraph lines */}
      <div className="h-5 bg-neutral-800 rounded-sm w-full max-w-[95%]" />
      <div className="h-5 bg-neutral-800 rounded-sm w-full max-w-[90%] mb-5" />

      <div className="h-6 bg-neutral-800 rounded-sm w-full max-w-[60%] mt-10 mb-3" /> {/* H2 line */}
      <div className="h-5 bg-neutral-800 rounded-sm w-full" />
      <div className="h-5 bg-neutral-800 rounded-sm w-full max-w-[95%]" />

      <div className="h-32 bg-neutral-800 rounded-lg w-full mt-6" /> {/* Code block */}
    </div>
  );
}

// Function to generate a slug from text
const generateSlug = (text: string) => {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, ''); // Remove all non-word chars
};

const customMarkdownComponents: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="text-2xl md:text-3xl font-semibold text-neutral-100 mb-5 mt-8" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => {
    let textContent = '';
    if (children) {
      Children.forEach(children, child => {
        if (typeof child === 'string') {
          textContent += child;
        } else if (
          React.isValidElement(child) &&
          child.props &&
          typeof (child.props as { children?: unknown }).children === 'string'
        ) {
          textContent += (child.props as { children?: string }).children;
        }
      });
    }
    const slug = generateSlug(textContent || `section-${Math.random().toString(36).substring(7)}`);
    return (
      <h2 id={slug} className="group relative text-xl md:text-2xl font-semibold text-neutral-100 mb-3 mt-8 md:mt-10" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => (
    <h3 className="text-lg md:text-xl font-semibold text-neutral-100 mb-2 mt-6" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-base md:text-lg font-semibold text-neutral-100 mb-2 mt-5" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }) => (
    <p className="leading-relaxed mb-5 text-neutral-300" {...props}>
      {children}
    </p>
  ),
  a: ({ href, children, ...props }) => (
    <NextLink href={href || '#'} className="text-neutral-300 underline hover:text-sky-500 transition-colors duration-150" {...props}>
      {children}
    </NextLink>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-5 my-5 space-y-1 text-neutral-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-5 my-5 space-y-1 text-neutral-300" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="my-1 marker:text-neutral-500" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-2 border-neutral-700 pl-4 my-6 text-neutral-400 italic" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ node, className, children, ...props }) => {
    const isInline = !props.hasOwnProperty('data-meta') && !(node?.position?.start.line !== node?.position?.end.line);
    if (isInline) {
      return (
        <code className="text-neutral-300 bg-neutral-800 px-1 py-0.5 rounded-sm font-mono text-sm" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={`${className || ''} font-mono text-sm`} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children, ...props }) => (
    <pre className="bg-neutral-900 border border-neutral-800 rounded-lg py-3 px-4 my-6 text-sm leading-relaxed overflow-x-auto" {...props}>
      {children}
    </pre>
  ),
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="rounded-md my-8 max-w-full h-auto" {...props} />
  ),
  hr: ({ ...props }) => <hr className="border-neutral-800 my-10" {...props} />,
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full border-collapse border border-neutral-700 text-neutral-300 text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="border-b border-neutral-700 bg-neutral-800/50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => <tr className="border-b border-neutral-800 even:bg-neutral-800/30" {...props}>{children}</tr>,
  th: ({ children, ...props }) => (
    <th className="px-3 py-2 text-left font-semibold text-neutral-200 border border-neutral-700" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-3 py-2 align-top border border-neutral-700" {...props}>
      {children}
    </td>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-neutral-200" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => <em className="italic text-neutral-200" {...props}>{children}</em>,
};


export default function BlogPostContent({
  post,
  date,
  fromHome,
}: BlogPostContentProps) {
  useEffect(() => {
    if (fromHome) {
      const timer = setTimeout(() => {
        document.body.classList.remove('page-transitioning');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [fromHome]);
  
  return (
    <div className="bg-neutral-950 w-full h-screen overflow-y-auto antialiased text-neutral-300 font-sans flex flex-col items-center">
      <motion.div
        className="w-full px-4 py-10 md:py-16" // Adjusted padding
        initial={fromHome ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }} // Adjusted animation
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }} // Adjusted animation
      >
        <div className="max-w-lg w-full mx-auto"> {/* Changed max-width */}
          <div className="mb-10 md:mb-12"> {/* Adjusted margin */}
            <NextLink
              href="/?from=blog"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors duration-150" // Smaller text
            >
              <CornerUpLeft size={14} /> {/* Slightly smaller icon */}
              <span className='italic'>Back</span>
            </NextLink>
          </div>

          <motion.article
            initial={fromHome ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }} // Adjusted animation
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }} // Adjusted animation
            className="pb-16 md:pb-24"  // Adjusted padding
          >
            <header className="mb-8 md:mb-10"> {/* Adjusted margin */}
              {/* Page Title - Minimal Styling */}
              <h1 className="text-2xl md:text-3xl font-semibold text-neutral-100 mb-4">
                {post.title}
              </h1>
              {date && (
                <p className="text-neutral-500 text-xs"> {/* Smaller date text */}
                  {date}
                </p>
              )}
            </header>

            <Suspense fallback={<Skeleton />}>
              <div className="text-sm md:text-base"> {/* Adjusted base font size for content */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                  components={customMarkdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </Suspense>
          </motion.article>
        </div>
      </motion.div>
    </div>
  );
}