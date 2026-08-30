/**
 * Post-build: nadaje każdej indeksowalnej trasie własny <head> i generuje sitemapę.
 *
 * DLACZEGO to istnieje
 * --------------------
 * Aplikacja jest SPA. `vercel.json` przepisuje /(.*) na /index.html, więc każdy
 * URL zwraca ten sam shell: identyczny <title>, identyczna meta description,
 * og:url wskazujący stronę główną. Google to wybacza (renderuje JS), ale
 * scrapery Facebooka, LinkedIna, Slacka i LLM-ów nie wykonują JS w ogóle -
 * dla nich każdy wpis bloga to strona główna.
 *
 * Skrypt zapisuje prawdziwy plik pod dist/<trasa>/index.html z poprawionym
 * <head>. Vercel sprawdza filesystem PRZED regułami `rewrites`, więc taki plik
 * wygrywa z fallbackiem, a React startuje z niego normalnie - <body> zostaje
 * nietknięty, więc to nie jest prerendering treści, tylko samego <head>.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes } from './seo-routes.mjs';
import { SITE_ORIGIN, absoluteUrl } from '../src/lib/seo.js';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Podmienia zawartość taga, jeśli istnieje. Brak dopasowania = zwraca null, żeby dało się wykryć drift. */
function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) return null;
  return html.replace(pattern, replacement);
}

function patchHead(shell, route) {
  const url = absoluteUrl(route.path);
  const image = absoluteUrl(route.image);
  const title = escapeAttr(route.title);
  const description = escapeAttr(route.description);

  const edits = [
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`],
    [/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`],
    [/(<meta property="og:type" content=")[^"]*(")/, `$1${escapeAttr(route.type)}$2`],
    [/(<meta property="og:url" content=")[^"]*(")/, `$1${escapeAttr(url)}$2`],
    [/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`],
    [/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`],
    [/(<meta property="og:image" content=")[^"]*(")/, `$1${escapeAttr(image)}$2`],
    [/(<meta property="twitter:url" content=")[^"]*(")/, `$1${escapeAttr(url)}$2`],
    [/(<meta property="twitter:title" content=")[^"]*(")/, `$1${title}$2`],
    [/(<meta property="twitter:description" content=")[^"]*(")/, `$1${description}$2`],
    [/(<meta property="twitter:image" content=")[^"]*(")/, `$1${escapeAttr(image)}$2`],
  ];

  let html = shell;
  for (const [pattern, replacement] of edits) {
    const next = replaceTag(html, pattern, replacement);
    if (next === null) {
      throw new Error(
        `index.html nie zawiera taga pasującego do ${pattern}. ` +
          `Ktoś zmienił <head> - zaktualizuj scripts/build-seo-html.mjs.`,
      );
    }
    html = next;
  }

  // Canonical nie istnieje w index.html, więc go dopisujemy zamiast podmieniać.
  return html.replace(
    /<\/head>/,
    `  <link rel="canonical" href="${escapeAttr(url)}" />\n  </head>`,
  );
}

function buildSitemap() {
  const urls = routes
    .map((route) => {
      const parts = [
        `    <loc>${absoluteUrl(route.path)}</loc>`,
        route.lastmod ? `    <lastmod>${route.lastmod}</lastmod>` : null,
        `    <changefreq>${route.changefreq}</changefreq>`,
        `    <priority>${route.priority}</priority>`,
      ].filter(Boolean);
      return `  <url>\n${parts.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const shell = await readFile(join(DIST, 'index.html'), 'utf8');

for (const route of routes) {
  const html = patchHead(shell, route);
  const target = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, 'utf8');
}

await writeFile(join(DIST, 'sitemap.xml'), buildSitemap(), 'utf8');
await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /showcase\nDisallow: /oferta/\nDisallow: /thank-you\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
  'utf8',
);

console.log(`SEO: ${routes.length} tras z własnym <head>, sitemap.xml + robots.txt zaktualizowane`);
