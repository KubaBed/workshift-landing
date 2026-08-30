/**
 * Jedno źródło prawdy dla meta tagów strony.
 *
 * Podział odpowiedzialności jest tu istotny, bo dotyczy dwóch różnych publiczności:
 *
 *   1. `scripts/build-seo-html.mjs` wstrzykuje te wartości do STATYCZNEGO HTML
 *      przy buildzie. To jedyna warstwa, którą widzą scrapery Facebooka,
 *      LinkedIna, Slacka i LLM-ów - żaden z nich nie wykonuje JavaScriptu.
 *
 *   2. `applyMeta()` aktualizuje <head> przy nawigacji wewnątrz SPA, żeby tytuł
 *      karty przeglądarki i historia zgadzały się z treścią. Google to widzi
 *      (renderuje JS), ale FB już nie - dlatego punkt 1 nie jest opcjonalny.
 *
 * Zmiana domeny: przestaw SITE_ORIGIN. Serwowana jest obecnie wersja z `www`
 * (apex robi 307 na www), więc canonical celuje w www, żeby nie wskazywać
 * adresu, który przekierowuje. Jeśli w Vercelu domeną główną zostanie apex,
 * wystarczy zmienić tę jedną stałą.
 */

export const SITE_ORIGIN = 'https://www.workshift.pl';

export const DEFAULT_META = {
  title: 'Workshift | Automatyzacja Procesów Biznesowych AI',
  description:
    'Wdrażamy agentów i automatyzacje AI dla firm w Poznaniu i całej Polsce. Od audytu procesu po działające wdrożenie.',
  image: '/brand-assets/logo-light.png',
  type: 'website',
};

/** Ścieżka względna -> pełny URL. Scrapery wymagają absolutnych w og:*. */
export const absoluteUrl = (path = '/') =>
  /^https?:\/\//.test(path) ? path : `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;

/**
 * Przycina opis do limitu meta description, ucinając na granicy słowa.
 * 155 znaków to bezpieczny sufit - Google obcina snippet ok. 160.
 */
export function clampDescription(text, max = 155) {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 3);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:-]$/, '')}...`;
}

/**
 * Meta stron statycznych (bez danych dynamicznych). Czytane przez:
 *   - `scripts/seo-routes.mjs` przy budowaniu statycznego <head> i sitemapy,
 *   - `<RouteMeta />` w App.jsx przy nawigacji wewnątrz SPA.
 *
 * Strony oparte o dane (wpis bloga, usługa) ustawiają meta same, bo znają
 * swój rekord dopiero po rozwiązaniu parametru trasy.
 */
export const STATIC_ROUTE_META = {
  '/': { ...DEFAULT_META },
  '/blog': {
    title: 'Blog | Workshift',
    description:
      'AI w praktyce dla polskich firm: wdrożenia, narzędzia i wnioski z realnych projektów. Bez hype, z konkretami.',
    image: DEFAULT_META.image,
    type: 'website',
  },
  '/audyt-ai': {
    title: 'Mikro-audyt AI - sprawdź ile traci Twoja firma | Workshift',
    description:
      '12 pytań, 4 minuty. Konkretny wynik i 3 rekomendacje dopasowane do Twojej branży. Bezpłatny mikro-audyt AI dla MŚP.',
    image: DEFAULT_META.image,
    type: 'website',
  },
  '/kalkulator': {
    title: 'Kalkulator strat czasowych - ile traci Twoja firma | Workshift',
    description:
      'Bezpłatny kalkulator: zobacz w 60 sekund ile czasu i pieniędzy traci Twoja firma na powtarzalnych zadaniach.',
    image: DEFAULT_META.image,
    type: 'website',
  },
  '/prompty': {
    title: 'Baza promptów i person AI po polsku | Workshift',
    description:
      '200 polskich promptów AI i 12 gotowych person do ChatGPT, Claude i Gemini. Przeszukuj, kopiuj, wdrażaj. Za darmo.',
    image: DEFAULT_META.image,
    type: 'website',
  },
  '/polityka-prywatnosci': {
    title: 'Polityka prywatności | Workshift',
    description:
      'Jak Workshift przetwarza dane osobowe: zakres, podstawy prawne, okresy przechowywania i Twoje uprawnienia z RODO.',
    image: DEFAULT_META.image,
    type: 'website',
  },
};

/** Meta wpisu bloga. Używane identycznie przez build i przez SPA. */
export function postMeta(post) {
  return {
    title: `${post.title} | Workshift`,
    description: clampDescription(post.excerpt),
    image: post.image || DEFAULT_META.image,
    type: 'article',
    path: `/blog/${post.slug}`,
  };
}

/* ---------- warstwa klienta (nawigacja wewnątrz SPA) ---------- */

function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setMetaTag(attr, name, content) {
  upsert(`meta[${attr}="${name}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute(attr, name);
    return el;
  }).setAttribute('content', content);
}

/** Ustawia canonical + og:url na bieżącą trasę. Wołane globalnie z App.jsx. */
export function setCanonical(path) {
  const url = absoluteUrl(path);
  upsert('link[rel="canonical"]', () => {
    const el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    return el;
  }).setAttribute('href', url);
  setMetaTag('property', 'og:url', url);
  setMetaTag('property', 'twitter:url', url);
}

/**
 * Nadpisuje komplet meta. Wywołanie bez argumentu przywraca wartości domyślne,
 * więc nadaje się na cleanup w useEffect - inaczej meta poprzedniej strony
 * zostaje po opuszczeniu trasy.
 */
export function applyMeta(meta = {}) {
  const { title, description, image, type, path } = { ...DEFAULT_META, ...meta };
  const imageUrl = absoluteUrl(image);

  document.title = title;
  setMetaTag('name', 'description', description);
  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:image', imageUrl);
  setMetaTag('property', 'og:type', type);
  setMetaTag('property', 'twitter:title', title);
  setMetaTag('property', 'twitter:description', description);
  setMetaTag('property', 'twitter:image', imageUrl);
  setCanonical(path ?? window.location.pathname);
}
