/**
 * Tabela tras indeksowalnych + ich meta.
 *
 * Konsumenci: `build-seo-html.mjs` (statyczny <head> per trasa oraz sitemap.xml).
 * Treść meta stron statycznych pochodzi z `src/lib/seo.js`, żeby build i runtime
 * SPA nie mogły się rozjechać.
 *
 * Celowo NIE ma tu: /oferta/* (prywatne oferty klientów), /thank-you,
 * /showcase (noindex), /uslugi (redirect na sekcję strony głównej).
 */

import { blogPosts } from '../src/data/blogPosts.js';
import { SERVICES } from '../src/data/services.js';
import { DEFAULT_META, STATIC_ROUTE_META, clampDescription, postMeta } from '../src/lib/seo.js';

/** Częstotliwość i priorytet są cechą sitemapy, nie treści - dlatego mieszkają tutaj. */
const CRAWL_HINTS = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/blog': { priority: '0.8', changefreq: 'weekly' },
  '/audyt-ai': { priority: '0.9', changefreq: 'monthly' },
  '/kalkulator': { priority: '0.9', changefreq: 'monthly' },
  '/prompty': { priority: '0.8', changefreq: 'monthly' },
  '/polityka-prywatnosci': { priority: '0.3', changefreq: 'yearly' },
};

export const routes = [
  ...Object.entries(STATIC_ROUTE_META).map(([path, meta]) => ({
    path,
    ...meta,
    ...CRAWL_HINTS[path],
  })),

  ...SERVICES.map((service) => ({
    path: `/uslugi/${service.id}`,
    title: service.metaTitle || `${service.title} | Workshift`,
    description: clampDescription(service.metaDescription || service.tagline),
    image: DEFAULT_META.image,
    type: 'website',
    priority: '0.8',
    changefreq: 'monthly',
  })),

  ...blogPosts.map((post) => ({
    ...postMeta(post),
    lastmod: post.date,
    priority: '0.7',
    changefreq: 'monthly',
  })),
];
