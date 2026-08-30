/**
 * Post-build: nadaje każdej indeksowalnej trasie własny <head> i <body>
 * oraz generuje sitemapę.
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
 * Treść fallbacku pochodzi z `seo-routes.mjs` i jest tą samą treścią, którą
 * renderuje React - tyle że dostępną bez JS. Do tego każda strona dostaje
 * stopkę z mapą serwisu: bez niej crawler bez JS widział 17 z 23 URL-i
 * sitemapy jako strony bez linków przychodzących (orphan pages).
 *
 * React i tak podmienia #root po starcie, więc dla użytkownika nic się nie zmienia.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes } from './seo-routes.mjs';
import { MAX_TITLE_LENGTH, SITE_ORIGIN, absoluteUrl } from '../src/lib/seo.js';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

/** Poniżej tego progu audyty uznają stronę za thin content. Ostrzegamy, nie blokujemy buildu. */
const MIN_FALLBACK_WORDS = 250;

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

/* ---------- render fallbacku ---------- */

const LINK_STYLE = 'color: #000000; text-decoration: underline;';
const TEXT_STYLE = 'font-size: 1rem; line-height: 1.6; color: #000000; margin: 0 0 1rem 0;';

/**
 * Mapa serwisu w stopce fallbacku. Lista jest tu, a nie liczona z `routes`,
 * bo to decyzja nawigacyjna: chcemy każdą usługę i każdą stronę-hub, ale nie
 * 12 wpisów bloga w stopce każdego URL-a (do wpisów prowadzi hub /blog).
 */
const SITE_NAV = [
  ['/', 'Strona główna'],
  ['/uslugi/automatyzacja', 'Audyt i automatyzacja procesów'],
  ['/uslugi/aplikacja', 'Dedykowana aplikacja'],
  ['/uslugi/agenty', 'Agenci AI'],
  ['/uslugi/szkolenia', 'Szkolenia AI'],
  ['/uslugi/kreacje', 'Kreacje reklamowe AI'],
  ['/blog', 'Blog'],
  ['/audyt-ai', 'Mikro-audyt AI'],
  ['/kalkulator', 'Kalkulator strat czasowych'],
  ['/prompty', 'Baza promptów i person AI'],
  ['/polityka-prywatnosci', 'Polityka prywatności'],
];

function renderSection(section) {
  const parts = [`<h3 style="font-size: 1.125rem; font-weight: 600; margin: 2rem 0 0.75rem 0; letter-spacing: -0.01em;">${escapeHtml(section.heading)}</h3>`];

  if (section.text) {
    parts.push(`<p style="${TEXT_STYLE}">${escapeHtml(section.text)}</p>`);
  }
  if (section.items?.length) {
    const items = section.items
      .map((item) => `<li style="margin: 0 0 0.5rem 0;">${escapeHtml(item)}</li>`)
      .join('\n            ');
    parts.push(
      `<ul style="${TEXT_STYLE} padding-left: 1.25rem;">\n            ${items}\n          </ul>`,
    );
  }

  return parts.join('\n          ');
}

function renderLinks(links, heading) {
  if (!links.length) return '';
  const items = links
    .map(
      ({ href, label, note }) =>
        `<li style="margin: 0 0 0.5rem 0;"><a href="${escapeAttr(href)}" style="${LINK_STYLE}">${escapeHtml(label)}</a>${
          note ? ` - ${escapeHtml(note)}` : ''
        }</li>`,
    )
    .join('\n            ');

  return `<nav aria-label="${escapeAttr(heading)}">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin: 2rem 0 0.75rem 0; letter-spacing: -0.01em;">${escapeHtml(heading)}</h3>
          <ul style="${TEXT_STYLE} padding-left: 1.25rem;">
            ${items}
          </ul>
        </nav>`;
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

  const sections = (route.fallbackSections ?? []).map(renderSection).join('\n          ');
  const related = renderLinks(route.fallbackLinks ?? [], route.fallbackLinksHeading ?? 'Zobacz też');
  const siteNav = renderLinks(
    SITE_NAV.filter(([href]) => href !== route.path).map(([href, label]) => ({ href, label })),
    'Mapa strony',
  );

  // Nagłówek i CTA zostają wyśrodkowane (tak wygląda shell), ale kilkaset wyrazów
  // treści wyrównanej do środka jest nieczytelne - stąd text-align na sekcjach.
  const main = `<main data-seo-main style="max-width: 720px; margin: 0 auto;">
          <h1 style="${headingStyle}">${heading}</h1>
          <h2 style="font-size: 1.25rem; font-weight: 400; color: #595959; margin: 0 0 2rem 0; letter-spacing: -0.02em;">${lead}</h2>
          ${body ? `<p style="font-size: 1.0625rem; line-height: 1.6; color: #000000; margin: 0 0 2.5rem 0;">${body}</p>` : ''}
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="/audyt-ai" style="background-color: #9CE069; color: #000000; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; font-size: 1rem; border: 1px solid #9CE069; text-decoration: none;">Bezpłatny audyt AI</a>
            <a href="/uslugi/automatyzacja" style="background-color: #FFFFFF; color: #000000; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; font-size: 1rem; border: 1px solid rgba(0, 0, 0, 0.1); text-decoration: none;">Nasze Usługi</a>
          </div>
          <div style="text-align: left; margin-top: 3rem;">
          ${sections}
          ${related}
          ${siteNav}
          </div>
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

/* ---------- kontrola jakości ---------- */

/** Liczy wyrazy tak, jak robi to crawler: tekst <body> bez tagów i skryptów. */
function countWords(html) {
  const text = html
    .slice(html.indexOf('<body'))
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Tytuł powyżej 60 znaków audyt raportuje jako błąd, a Google i tak go utnie.
 * Rzucamy wyjątkiem, bo to jest w pełni pod kontrolą danych: wystarczy dopisać
 * `seoTitle` do wpisu albo skrócić `metaTitle` usługi.
 */
function assertTitleLength(route) {
  if (route.title.length <= MAX_TITLE_LENGTH) return;
  throw new Error(
    `Tytuł trasy ${route.path} ma ${route.title.length} znaków (limit ${MAX_TITLE_LENGTH}): ` +
      `"${route.title}". Skróć go - dla wpisu bloga dopisz pole "seoTitle" w src/data/blogPosts.js, ` +
      'dla usługi popraw "metaTitle" w src/data/services.js, dla strony statycznej "title" w src/lib/seo.js.',
  );
}

/* ---------- sitemapa ---------- */

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

/* ---------- wejście ---------- */

const shell = await readFile(join(DIST, 'index.html'), 'utf8');

const thin = [];
/** Ile linków przychodzących ma każda trasa w statycznym HTML - kontrola orphan pages. */
const inbound = new Map(routes.map((route) => [route.path, 0]));

for (const route of routes) {
  assertTitleLength(route);

  const html = patchBody(patchHead(shell, route), route);
  const target = route.path === '/' ? join(DIST, 'index.html') : join(DIST, route.path, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, 'utf8');

  const words = countWords(html);
  if (words < MIN_FALLBACK_WORDS) thin.push(`${route.path} (${words})`);

  for (const href of new Set([...html.matchAll(/<a\s[^>]*href="(\/[^"#]*)"/g)].map((m) => m[1]))) {
    const path = href.replace(/\/$/, '') || '/';
    if (path !== route.path && inbound.has(path)) inbound.set(path, inbound.get(path) + 1);
  }
}

await writeFile(join(DIST, 'sitemap.xml'), buildSitemap(), 'utf8');
await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /showcase\nDisallow: /oferta/\nDisallow: /thank-you\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
  'utf8',
);

const orphans = [...inbound].filter(([, count]) => count === 0).map(([path]) => path);
if (orphans.length) {
  console.warn(`SEO OSTRZEŻENIE: trasy bez linku przychodzącego w statycznym HTML: ${orphans.join(', ')}`);
}
if (thin.length) {
  console.warn(`SEO OSTRZEŻENIE: fallback poniżej ${MIN_FALLBACK_WORDS} wyrazów: ${thin.join(', ')}`);
}

console.log(
  `SEO: ${routes.length} tras z własnym <head> i <body>, sitemap.xml + robots.txt zaktualizowane`,
);
