import { MetadataRoute } from 'next';
import { DOMAIN } from './metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      // AI Search Bots & Web Crawlers (Perplexity, SearchGPT, Claude, Gemini, Apple Intelligence)
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'ClaudeBot',
          'Claude-Web',
          'PerplexityBot',
          'Bytespider',
          'CCBot',
          'Applebot-Extended',
          'Diffbot',
          'Omgilibot',
        ],
        allow: '/',
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
    host: DOMAIN,
  };
}
