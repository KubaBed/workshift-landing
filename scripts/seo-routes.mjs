/**
 * Tabela tras indeksowalnych + ich meta i treść statycznego fallbacku.
 *
 * Konsument: `build-seo-html.mjs` (statyczny <head> i <body> per trasa,
 * sitemap.xml, robots.txt). Treść meta stron statycznych pochodzi
 * z `src/lib/seo.js`, żeby build i runtime SPA nie mogły się rozjechać.
 *
 * Pola `fallback*` opisują to, co crawler bez JS widzi w <body> zanim React
 * podmieni zawartość #root. Bez nich każdy URL miał ten sam blurb strony
 * głównej - stąd `thin-content` i `duplicate-content` w audycie.
 *
 * Celowo NIE ma tu: /oferta/* (prywatne oferty klientów), /thank-you,
 * /showcase (noindex), /uslugi (redirect na sekcję strony głównej).
 */

import { blogPosts } from '../src/data/blogPosts.js';
import { SERVICES } from '../src/data/services.js';
import { DEFAULT_META, STATIC_ROUTE_META, clampDescription, postMeta } from '../src/lib/seo.js';

/** Częstotliwość i priorytet to cecha sitemapy, nie treści - dlatego mieszkają tutaj. */
const CRAWL_HINTS = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/blog': { priority: '0.8', changefreq: 'weekly' },
  '/audyt-ai': { priority: '0.9', changefreq: 'monthly' },
  '/kalkulator': { priority: '0.9', changefreq: 'monthly' },
  '/prompty': { priority: '0.8', changefreq: 'monthly' },
  '/polityka-prywatnosci': { priority: '0.3', changefreq: 'yearly' },
};

/** Nagłówek i lead stron statycznych. Reszta leci z meta description. */
const STATIC_FALLBACK = {
  '/': {
    heading: 'Workshift',
    lead: 'Wdrażamy AI, które po prostu działa',
    body:
      'Workshift to boutique AI consulting dla polskich MŚP. Pomagamy firmom wdrażać pragmatyczne innowacje AI, ' +
      'oszczędzać czas (+32% odzyskanego czasu operacyjnego), optymalizować procesy oraz budować dedykowanych ' +
      'agentów AI pracujących 24/7. Bez buzzwordów, bez przestojów, z mierzalnymi rezultatami. '
      + 'Pracujemy w czterech obszarach: audyt i automatyzacja procesów, dedykowane aplikacje, agenci AI '
      + 'oraz szkolenia dla zespołów. Zaczynamy od bezpłatnej diagnozy procesu i mapy miejsc, w których '
      + 'automatyzacja zwróci się najszybciej.',
  },
  '/blog': {
    heading: 'Blog',
    lead: 'AI w praktyce dla polskich firm',
    body:
      'Wnioski z realnych wdrożeń, testy narzędzi i rozbiór tego, co w AI faktycznie zmienia pracę małych ' +
      'i średnich firm. Piszemy o tym, co sprawdziliśmy u siebie albo u klientów - nie o zapowiedziach. '
      + 'Tematy wracające najczęściej: automatyzacja powtarzalnych procesów, agenci AI w obsłudze klienta '
      + 'i dokumentów, polskie modele językowe, narzędzia do pracy z wiedzą firmową oraz to, co zmiany '
      + 'w AI oznaczają dla ludzi w zespole.',
  },
  '/audyt-ai': {
    heading: 'Mikro-audyt AI',
    lead: 'Sprawdź w 4 minuty, ile czasu traci Twoja firma',
    body:
      'Dwanaście pytań o to, jak dziś wygląda praca w Twojej firmie: obsługa dokumentów, raportowanie, ' +
      'komunikacja z klientem, powtarzalne zadania zespołu. Na końcu dostajesz wynik i trzy rekomendacje ' +
      'dopasowane do branży - konkretne procesy, od których warto zacząć, a nie ogólną listę narzędzi. ' +
      'Audyt jest bezpłatny i nie wymaga przygotowania danych ani rozmowy handlowej.',
  },
  '/kalkulator': {
    heading: 'Kalkulator strat czasowych',
    lead: 'Zobacz w 60 sekund, ile kosztują Cię powtarzalne zadania',
    body:
      'Podajesz wielkość zespołu, liczbę godzin tygodniowo traconych na zadania powtarzalne, liczbę dni ' +
      'poświęcanych na raportowanie i średni koszt godziny pracy. Kalkulator przelicza to na koszt ' +
      'miesięczny i roczny, a następnie pokazuje, ile z tych godzin realnie da się odzyskać. ' +
      'Szacunek odzysku jest konserwatywny: zakładamy 40 procent, choć automatyzacja zwykle zwraca więcej.',
  },
  '/prompty': {
    heading: 'Baza promptów i person AI',
    lead: '200 polskich promptów i 12 gotowych person do ChatGPT, Claude i Gemini',
    body:
      'Przeszukiwalna baza promptów po polsku, podzielona na kategorie branżowe i funkcyjne: sprzedaż, ' +
      'marketing, obsługa klienta, finanse, HR, praca z dokumentami. Persony to gotowe system prompty, ' +
      'które wklejasz raz do gema Gemini albo Custom GPT i masz wyspecjalizowanego asystenta zamiast ' +
      'ogólnego czatu. Korzystanie jest bezpłatne, prompty źródłowe są na licencji CC0.',
  },
  '/polityka-prywatnosci': {
    heading: 'Polityka prywatności',
    lead: 'Jak Workshift przetwarza dane osobowe',
    body:
      'Dokument opisuje, kto jest administratorem danych, jakie dane zbieramy przez formularze kontaktowe ' +
      'i zapis do newslettera, na jakiej podstawie prawnej je przetwarzamy oraz jak długo je przechowujemy. ' +
      'Znajdziesz tu także informacje o odbiorcach danych, wykorzystywanych plikach cookie i narzędziach ' +
      'analitycznych oraz o Twoich uprawnieniach z RODO: dostępie, sprostowaniu, usunięciu, ograniczeniu ' +
      'przetwarzania, przenoszeniu danych i sprzeciwie.',
  },
};

/**
 * Markdown wpisu -> czysty tekst do fallbacku.
 *
 * Renderer bloga (`BlogPostPage.renderContent`) obsługuje własny dialekt:
 * `[image:src|alt]`, `[youtube:ID]`, `**bold**`, `### nagłówki`, `> cytat`,
 * listy `- ` i linki `[tekst](url)`. Tu wystarczy zdjąć składnię i zostawić
 * zdania - crawler ma dostać treść, nie formatowanie.
 */
function plainText(markdown, maxChars = 900) {
  const text = String(markdown ?? '')
    .replace(/\[(?:image|youtube):[^\]]*\]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[`*_>#|]/g, '')
    .replace(/^\s*-\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  return lastStop > maxChars * 0.5 ? cut.slice(0, lastStop + 1) : `${cut.trimEnd()}...`;
}

const stripBrand = (title) => title.replace(/\s*\|\s*Workshift\s*$/, '');

export const routes = [
  ...Object.entries(STATIC_ROUTE_META).map(([path, meta]) => ({
    path,
    ...meta,
    ...CRAWL_HINTS[path],
    fallbackHeading: STATIC_FALLBACK[path]?.heading ?? stripBrand(meta.title),
    fallbackLead: STATIC_FALLBACK[path]?.lead ?? meta.description,
    fallbackBody: STATIC_FALLBACK[path]?.body ?? '',
  })),

  ...SERVICES.map((service) => ({
    path: `/uslugi/${service.id}`,
    title: service.metaTitle || `${service.title} | Workshift`,
    description: clampDescription(service.metaDescription || service.tagline),
    image: DEFAULT_META.image,
    type: 'website',
    priority: '0.8',
    changefreq: 'monthly',
    fallbackHeading: service.title,
    fallbackLead: service.tagline,
    fallbackBody: plainText([service.expandedTitle, service.expandedDescription].filter(Boolean).join(' ')),
  })),

  ...blogPosts.map((post) => ({
    ...postMeta(post),
    lastmod: post.date,
    priority: '0.7',
    changefreq: 'monthly',
    fallbackHeading: post.title,
    fallbackLead: post.excerpt,
    fallbackBody: plainText(post.content),
  })),
];
