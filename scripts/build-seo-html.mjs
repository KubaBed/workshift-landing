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
 * <head> ORAZ z treścią statycznego fallbacku w <body>. Vercel sprawdza
 * filesystem PRZED regułami `rewrites`, więc taki plik wygrywa z fallbackiem
 * SPA (widać to w .vercel/output/config.json: `{"handle":"filesystem"}` stoi
 * przed regułą przepisującą na /index.html).
 *
 * Fallback w <body> istniał już wcześniej, ale był ten sam na każdym URL-u -
 * blurb strony głównej. Dla crawlera bez JS każdy wpis bloga miał więc
 * identyczną, 55-wyrazową treść. React i tak podmienia #root po starcie, więc
 * dla użytkownika nic się nie zmienia.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes } from './seo-routes.mjs';
import { SITE_ORIGIN, absoluteUrl } from '../src/lib/seo.js';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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

/**
 * Podmienia treść statycznego fallbacku w <body> na właściwą dla trasy.
 * Uchwytem jest atrybut `data-seo-main` w index.html - celowo atrybut, a nie
 * pozycja w pliku, żeby zmiana layoutu fallbacku nie psuła generatora po cichu.
 */
function patchBody(html, route) {
  const isHome = route.path === '/';
  const heading = escapeHtml(route.fallbackHeading);
  const lead = escapeHtml(route.fallbackLead);
  const body = escapeHtml(route.fallbackBody);

  // Logotyp jest jedynym miejscem na wagę 700+ (BRAND.md); nagłówki treści to 400.
  const headingStyle = isHome
    ? 'font-size: 3rem; font-weight: 800; margin: 0 0 1rem 0; letter-spacing: -0.04em; line-height: 1.1;'
    : 'font-size: 2rem; font-weight: 400; margin: 0 0 1rem 0; letter-spacing: -0.03em; line-height: 1.2;';

  const linkStyle = 'color: #000000; text-decoration: underline;';
  const navLinks = [
    ['/', 'Strona główna'],
    ['/uslugi/automatyzacja', 'Usługi'],
    ['/blog', 'Blog'],
    ['/kalkulator', 'Kalkulator strat'],
    ['/prompty', 'Baza promptów'],
  ]
    .filter(([href]) => href !== route.path)
    .map(([href, label]) => `<a href="${href}" style="${linkStyle}">${label}</a>`)
    .join(' · ');

  const main = `<main data-seo-main style="max-width: 640px; margin: 0 auto;">
          <h1 style="${headingStyle}">${heading}</h1>
          <h2 style="font-size: 1.25rem; font-weight: 400; color: #595959; margin: 0 0 2rem 0; letter-spacing: -0.02em;">${lead}</h2>
          ${body ? `<p style="font-size: 1.0625rem; line-height: 1.6; color: #000000; margin: 0 0 2.5rem 0;">${body}</p>` : ''}
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/audyt-ai" style="background-color: #9CE069; color: #000000; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; font-size: 1rem; border: 1px solid #9CE069; text-decoration: none;">Bezpłatny audyt AI</a>
            <a href="/uslugi/automatyzacja" style="background-color: #FFFFFF; color: #000000; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; font-size: 1rem; border: 1px solid rgba(0, 0, 0, 0.1); text-decoration: none;">Nasze Usługi</a>
          </div>
          <nav style="margin-top: 2rem; font-size: 0.9375rem; color: #595959; line-height: 1.8;">${navLinks}</nav>
        </main>`;

  const pattern = /<main data-seo-main[\s\S]*?<\/main>/;
  if (!pattern.test(html)) {
    throw new Error(
      'index.html nie zawiera <main data-seo-main>. Uchwyt fallbacku zniknął - ' +
        'zaktualizuj scripts/build-seo-html.mjs albo przywróć atrybut.',
    );
  }
  return html.replace(pattern, main);
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
  const html = patchBody(patchHead(shell, route), route);
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

console.log(
  `SEO: ${routes.length} tras z własnym <head> i <body>, sitemap.xml + robots.txt zaktualizowane`,
);
