import fs from 'fs';
import { resolve } from 'path';

const routes = [
  '/',
  '/about',
  '/contact',
  '/courses',
  '/tools',
  '/community',
  '/live-classes',
  '/faq',
  '/blog',
  '/career-guide',
  '/testimonials',
  '/resources',
  '/events',
  '/partnerships',
  '/privacy',
  '/terms'
];

const baseUrl = 'https://speakceo.ai';

export function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(route => `
    <url>
      <loc>${baseUrl}${route}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${route === '/' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('')}
</urlset>`;

  fs.writeFileSync(resolve(process.cwd(), 'public/sitemap.xml'), sitemap);
} 