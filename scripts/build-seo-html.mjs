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

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { routes } from './seo-routes.mjs';
import { readBlogIndex, readBlogPosts } from './lib/blog-source.mjs';
import { SITE_NAV } from '../src/data/siteNav.js';
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
    [/(<meta name="robots" content=")[^"]*(")/, `$1${route.noindex ? 'noindex, nofollow' : 'index, follow'}$2`],
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
  const extras = [`  <link rel="canonical" href="${escapeAttr(url)}" />`];

  // Service dla podstron usług. Organizacja i założyciel są w index.html
  // (@graph, @id .../#organization), tu tylko się do nich odwołujemy.
  if (route.serviceSchema) {
    const serviceLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: route.serviceSchema.name,
      description: route.serviceSchema.description,
      url,
      serviceType: route.serviceSchema.name,
      provider: { '@id': `${SITE_ORIGIN}/#organization` },
      areaServed: { '@type': 'Country', name: 'Polska' },
      availableLanguage: 'pl',
    }).replace(/</g, '\\u003c');
    extras.push(`  <script type="application/ld+json">${serviceLd}</script>`);
  }

  // BlogPosting dla wpisów: autor, daty i obrazek w danych strukturalnych. Modele z wyszukiwaniem
  // i Google premiują treść datowaną i podpisaną. Wpisy pisze Jakub, więc autor to encja
  // .../#jakub-bednarz z index.html; inny autor dostaje własny obiekt Person.
  if (route.articleSchema) {
    const a = route.articleSchema;
    const author =
      a.authorName === 'Jakub Bednarz'
        ? { '@id': `${SITE_ORIGIN}/#jakub-bednarz` }
        : { '@type': 'Person', name: a.authorName };
    const articleLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: a.headline,
      description: a.description,
      image: image,
      datePublished: a.datePublished,
      dateModified: a.dateModified,
      author,
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      mainEntityOfPage: url,
      articleSection: a.section,
      inLanguage: 'pl-PL',
    }).replace(/</g, '\\u003c');
    extras.push(`  <script type="application/ld+json">${articleLd}</script>`);
  }

  // FAQPage tylko dla tras, których dane niosą pole `faq` (automatyzacja,
  // szkolenia).
  if (route.faq?.length) {
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }).replace(/</g, '\\u003c');
    extras.push(`  <script type="application/ld+json">${jsonLd}</script>`);
  }

  return html.replace(/<\/head>/, `${extras.join('\n')}\n  </head>`);
}

/* ---------- modulepreload chunków trasy ---------- */

/**
 * Strony poza główną są leniwe (React.lazy), więc bez podpowiedzi przeglądarka
 * pobiera chunk strony dopiero po wykonaniu index.js: dwa żądania jedno po drugim.
 * Na stronie usługi to była większość luki FCP -> LCP (PSI 15.10). Dlatego HTML
 * każdej podstrony dostaje <link rel="modulepreload"> do chunków jej modułu,
 * policzonych z manifestu Vite (bez tych, które shell już ładuje).
 */
const ROUTE_PAGE_MODULES = [
  [/^\/uslugi\/[^/]+$/, 'src/pages/ServicePage.jsx'],
  [/^\/blog$/, 'src/pages/BlogListPage.jsx'],
  [/^\/blog\/[^/]+$/, 'src/pages/BlogPostPage.jsx'],
  [/^\/kalkulator$/, 'src/pages/KalkulatorStratPage.jsx'],
  [/^\/audyt-ai$/, 'src/pages/AudytAiPage.jsx'],
  [/^\/prompty$/, 'src/pages/PromptyPage.jsx'],
  [/^\/narzedzia\/szkic$/, 'src/pages/SzkicPage.jsx'],
  [/^\/polityka-prywatnosci$/, 'src/pages/PrivacyPolicyPage.jsx'],
];

const MANIFEST_PATH = join(DIST, '.vite', 'manifest.json');
const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));

/** Plik chunku modułu i wszystkie jego statyczne importy (bez dynamicznych). */
function chunkFiles(key, seen = new Set()) {
  const entry = manifest[key];
  if (!entry || seen.has(key)) return [];
  seen.add(key);
  return [entry.file, ...(entry.imports ?? []).flatMap((dep) => chunkFiles(dep, seen))];
}

function patchPreloads(html, route) {
  const match = ROUTE_PAGE_MODULES.find(([pattern]) => pattern.test(route.path));
  if (!match) return html;
  if (!manifest[match[1]]) throw new Error(`build-seo-html: brak ${match[1]} w manifeście Vite`);
  // Treść wpisu bloga jest w HTML (prerender + window.__WS_POST__), więc jej chunku nie preloadujemy.
  const files = chunkFiles(match[1]);
  const links = [...new Set(files)]
    .filter((file) => !html.includes(`/${file}"`))
    .map((file) => `    <link rel="modulepreload" crossorigin href="/${file}">`);
  return links.length ? html.replace(/<\/head>/, `${links.join('\n')}\n  </head>`) : html;
}

/* ---------- render fallbacku ---------- */

const LINK_STYLE = 'color: #000000; text-decoration: underline;';
const TEXT_STYLE = 'font-size: 1rem; line-height: 1.6; color: #000000; margin: 0 0 1rem 0;';

/**
 * Mapa serwisu w stopce fallbacku. Lista jest tu, a nie liczona z `routes`,
 * bo to decyzja nawigacyjna: chcemy każdą usługę i każdą stronę-hub, ale nie
 * 12 wpisów bloga w stopce każdego URL-a (do wpisów prowadzi hub /blog).
 */


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
      `"${route.title}". Skróć go - dla wpisu bloga dopisz pole "seoTitle" we frontmatterze content/blog/<slug>.md, ` +
      'dla usługi popraw "metaTitle" w src/data/services.js, dla strony statycznej "title" w src/lib/seo.js.',
  );
}

/* ---------- sitemapa ---------- */

function buildSitemap() {
  const urls = routes
    .filter((route) => !route.noindex)
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

/* ---------- prerender ---------- */

/**
 * HTML aplikacji z buildu SSR (src/entry-server.jsx -> dist-ssr). Zastępuje statyczny fallback
 * w #root: przeglądarka maluje prawdziwą stronę przed JS, a boty bez JS czytają tę samą treść
 * co ludzie. src/main.jsx widzi data-prerendered i hydratuje zamiast renderować od zera.
 * Trasa, której render się nie uda, zostaje przy fallbacku (ostrzeżenie w logu buildu).
 * PRERENDER=0 wyłącza całość (awaryjnie, bez zmiany kodu).
 */
const SSR_ENTRY = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist-ssr', 'entry-server.js');
const prerenderEnabled = process.env.PRERENDER !== '0';
const { render } = prerenderEnabled ? await import(SSR_ENTRY) : { render: null };

/** Podmienia zawartość <div id="root"> (szuka pasującego </div>, liczy zagnieżdżenia). */
function replaceRoot(html, inner) {
  const open = '<div id="root">';
  const start = html.indexOf(open);
  if (start === -1) throw new Error('build-seo-html: brak <div id="root"> w index.html');
  const tagRe = /<\/?div\b[^>]*>/g;
  tagRe.lastIndex = start + open.length;
  let depth = 1;
  let match;
  while ((match = tagRe.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) {
      return `${html.slice(0, start)}<div id="root" data-prerendered>${inner}</div>${html.slice(tagRe.lastIndex)}`;
    }
  }
  throw new Error('build-seo-html: niedomknięty <div id="root">');
}

/** Treść wpisu dla pierwszego renderu w przeglądarce (getPostContentSync w src/data/blog.js). */
function postContentScript(route) {
  const slug = /^\/blog\/([^/]+)$/.exec(route.path)?.[1];
  if (!slug) return '';
  const post = blogPostsWithContent.find((p) => p.slug === slug);
  if (!post) return '';
  const json = JSON.stringify({ slug, content: post.content }).replace(/</g, '\\u003c');
  return `<script>window.__WS_POST__=${json}</script>`;
}

const blogPostsWithContent = readBlogPosts();
const prerenderFailed = [];

/**
 * Trasy przy fallbacku: narzędzia, których treść ładuje się dopiero w przeglądarce (kalkulator,
 * baza promptów z JSON-a). W HTML aplikacji mają ok. 120-140 słów, a fallback ma opis narzędzia.
 */
const KEEP_FALLBACK = new Set(['/kalkulator', '/prompty']);

async function prerender(html, route) {
  if (!render || KEEP_FALLBACK.has(route.path)) return html;
  try {
    const appHtml = await render(route.path);
    return replaceRoot(html, appHtml).replace('</body>', `${postContentScript(route)}</body>`);
  } catch (error) {
    prerenderFailed.push(`${route.path} (${String(error?.message ?? error).split('\n')[0]})`);
    return html;
  }
}

/* ---------- wejście ---------- */

const shell = await readFile(join(DIST, 'index.html'), 'utf8');

// Powłoka SPA bez prerenderu, z noindex. spa.html: trasy spoza listy, które istnieją tylko w kliencie
// (rewrites w vercel.json: oferty, /thank-you, /showcase, /uslugi). 404.html: Vercel podaje go ze statusem
// 404 dla pozostałych adresów, a NotFoundPage rysuje się w kliencie. Nie /index.html: ten po prerenderze
// zawiera stronę główną i React próbowałby ją hydratować pod innym adresem.
const spaShell = shell.replace(/(<meta name="robots" content=")[^"]*(")/, '$1noindex, nofollow$2');
await writeFile(join(DIST, 'spa.html'), spaShell, 'utf8');
await writeFile(join(DIST, '404.html'), spaShell, 'utf8');

const thin = [];
/** Ile linków przychodzących ma każda trasa w statycznym HTML - kontrola orphan pages. */
const inbound = new Map(routes.map((route) => [route.path, 0]));

for (const route of routes) {
  assertTitleLength(route);

  const html = await prerender(patchPreloads(patchBody(patchHead(shell, route), route), route), route);
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

// Manifest był potrzebny tylko tutaj; nie publikujemy go razem ze stroną.
await rm(join(DIST, '.vite'), { recursive: true, force: true });

await writeFile(join(DIST, 'sitemap.xml'), buildSitemap(), 'utf8');

// Indeks wpisów jako publiczny JSON: czyta go funkcja api/confirm-newsletter.js (3 najnowsze
// wpisy w mailu powitalnym), bo funkcje Vercela nie widzą katalogu content/.
await writeFile(
  join(DIST, 'blog-index.json'),
  JSON.stringify(
    readBlogIndex().map(({ slug, title, category, date, updated, excerpt, image }) => ({
      slug, title, category, date, updated, excerpt, image, url: `${SITE_ORIGIN}/blog/${slug}`,
    })),
  ),
  'utf8',
);
await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /showcase\nDisallow: /thank-you\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`,
  'utf8',
);

if (prerenderFailed.length) {
  console.warn(`PRERENDER OSTRZEŻENIE: trasy zostały przy fallbacku: ${prerenderFailed.join('; ')}`);
}

const orphans = [...inbound].filter(([, count]) => count === 0).map(([path]) => path);
if (orphans.length) {
  console.warn(`SEO OSTRZEŻENIE: trasy bez linku przychodzącego w statycznym HTML: ${orphans.join(', ')}`);
}
if (thin.length) {
  console.warn(`SEO OSTRZEŻENIE: fallback poniżej ${MIN_FALLBACK_WORDS} wyrazów: ${thin.join(', ')}`);
}

console.log(
  `SEO: ${routes.length} tras z własnym <head> i <body> (prerender: ${render ? routes.length - prerenderFailed.length - KEEP_FALLBACK.size : 0}), sitemap.xml + robots.txt zaktualizowane`,
);
