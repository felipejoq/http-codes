export const prerender = true;

import type { APIRoute } from 'astro';
import { httpCodes } from '../data/http-codes';

export const GET: APIRoute = async () => {
  const baseUrl = 'https://http.uncodigo.com';
  const today = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    '',
    '/codes',
    '/docs',
  ];
  
  const codePages = httpCodes.map(code => `/codes/${code.code}`);
  
  const allUrls = [...staticPages, ...codePages];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url === '' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${url === '' ? '1.0' : url.startsWith('/codes/') ? '0.8' : '0.9'}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
