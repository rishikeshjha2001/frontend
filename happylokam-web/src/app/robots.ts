import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/manager/', '/api/', '/hl-secure-access/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'PerplexityBot', 'ClaudeBot', 'Applebot', 'Amazonbot', 'Bytespider', 'CCBot'],
        allow: '/',
        disallow: ['/admin/', '/manager/', '/api/', '/hl-secure-access/'],
      }
    ],
    sitemap: 'https://happylokam.com/sitemap.xml',
    host: 'https://happylokam.com',
  };
}
