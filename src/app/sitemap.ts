import { MetadataRoute } from 'next';
import { DOMAIN } from './metadata';
import { getAllMarkdownBlogs } from '@/lib/blogService.server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getAllMarkdownBlogs();

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${DOMAIN}${blog.link}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: DOMAIN,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${DOMAIN}/craft`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  return [...staticRoutes, ...blogRoutes];
}
