/**
 * Tabela tras indeksowalnych + ich meta i treść statycznego fallbacku.
 *
 * Konsument: `build-seo-html.mjs` (statyczny <head> i <body> per trasa,
 * sitemap.xml, robots.txt). Treść meta stron statycznych pochodzi
 * z `src/lib/seo.js`, żeby build i runtime SPA nie mogły się rozjechać.
 *
 * Pola `fallback*` opisują to, co crawler bez JS widzi w <body> zanim React
 * podmieni zawartość #root.
 *
 * DWA PROBLEMY, KTÓRE TA WARSTWA MA ROZWIĄZAĆ
 * -------------------------------------------
 * 1. Thin content. Fallback z samym leadem to ok. 90 wyrazów na URL - audyt
 *    słusznie uznaje to za pustą stronę, bo crawler nie wykonuje JS i nie
 *    zobaczy tego, co React dorysuje. Dlatego `fallbackSections` składamy
 *    z PRAWDZIWEJ treści strony: `innerCards` usługi, pytania mikro-audytu,
 *    kategorie bazy promptów, tekst polityki prywatności. Nie piszemy tu
 *    drugiej wersji strony - importujemy tę, którą renderuje aplikacja.
 *
 * 2. Orphan pages. Sitemapa wystawia 23 URL-e, a fallback linkował do pięciu,
 *    więc dla crawlera 17 stron nie miało ani jednego linku przychodzącego.
 *    `fallbackLinks` daje każdej trasie sensowne linki tematyczne (usługa ->
 *    siostrzane usługi, wpis -> blog i pokrewne wpisy), a `/blog` wystawia
 *    pełną listę wpisów. Do tego `build-seo-html.mjs` dokłada stopkę z mapą
 *    strony na każdym URL-u.
 *
 * Celowo NIE ma tu: /oferta/* (prywatne oferty klientów), /thank-you,
 * /showcase (noindex), /uslugi (redirect na sekcję strony głównej).
 */

import { createRequire } from 'node:module';
import { blogPosts } from '../src/data/blogPosts.js';
import { SERVICES } from '../src/data/services.js';
import { BRANZE, KOSZTY, REKOMENDACJE, RECOVERY_RATE, ZESPOLY } from '../src/data/kalkulator.js';
import { SECTIONS as AUDYT_SECTIONS, TOTAL_QUESTIONS } from '../src/data/audytQuestions.js';
import { DEFAULT_META, STATIC_ROUTE_META, clampDescription, postMeta } from '../src/lib/seo.js';
import { extractPrivacyPolicy } from './privacy-policy-text.mjs';

const require = createRequire(import.meta.url);
const promptsIndex = require('../public/prompty-data/index.json');
const personasData = require('../public/prompty-data/personas.json');

/** Częstotliwość i priorytet to cecha sitemapy, nie treści - dlatego mieszkają tutaj. */
const CRAWL_HINTS = {
  '/': { priority: '1.0', changefreq: 'weekly' },
  '/blog': { priority: '0.8', changefreq: 'weekly' },
  '/audyt-ai': { priority: '0.9', changefreq: 'monthly' },
  '/kalkulator': { priority: '0.9', changefreq: 'monthly' },
  '/prompty': { priority: '0.8', changefreq: 'monthly' },
  '/polityka-prywatnosci': { priority: '0.3', changefreq: 'yearly' },
};

/* ---------- pomocnicze ---------- */

/**
 * Markdown wpisu -> czysty tekst do fallbacku.
 *
 * Renderer bloga (`BlogPostPage.renderContent`) obsługuje własny dialekt:
 * `[image:src|alt]`, `[youtube:ID]`, `**bold**`, `### nagłówki`, `> cytat`,
 * listy `- ` i linki `[tekst](url)`. Tu wystarczy zdjąć składnię i zostawić
 * zdania - crawler ma dostać treść, nie formatowanie.
 */
function plainText(markdown, maxChars = 2200) {
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

/** Emoji z etykiet danych to dekoracja UI - w treści dla crawlera tylko szumi. */
const stripEmoji = (value) =>
  String(value ?? '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

const sentence = (value) => {
  const text = stripEmoji(value);
  return /[.!?]$/.test(text) ? text : `${text}.`;
};

/* ---------- usługi: innerCards -> sekcje tekstowe ---------- */

/**
 * `innerCards` to warstwa prezentacji strony usługi - dziewięć typów kart,
 * każdy z własnym kształtem. Spłaszczamy je do {heading, text, items}, bo
 * crawler potrzebuje zdań, nie layoutu. Nieznany typ pomijamy zamiast rzucać
 * wyjątkiem: nowy typ karty ma dołożyć treść do fallbacku przy okazji, a nie
 * wywalić build strony.
 */
function serviceSections(service) {
  const sections = [];

  if (service.heroMetric) {
    const { value, label, subtext } = service.heroMetric;
    sections.push({
      heading: 'Efekt w liczbach',
      text: [`${value} ${stripEmoji(label)}`, subtext].filter(Boolean).map(sentence).join(' '),
    });
  }

  for (const card of service.innerCards ?? []) {
    switch (card.type) {
      case 'features':
        sections.push({ heading: card.label, items: card.items.map(stripEmoji) });
        break;
      case 'process':
        sections.push({
          heading: card.label,
          items: card.steps.map((s) => `${s.num}. ${stripEmoji(s.title)} - ${sentence(s.desc)}`),
        });
        break;
      case 'stack':
        sections.push({
          heading: card.label,
          text: [card.subtitle && sentence(card.subtitle), `Stack: ${card.tools.join(', ')}.`]
            .filter(Boolean)
            .join(' '),
        });
        break;
      case 'insights':
        sections.push({
          heading: card.label,
          items: card.cards.map((c) => `${stripEmoji(c.title)} - ${sentence(c.desc)}`),
        });
        break;
      case 'usp':
        sections.push({
          heading: card.label,
          items: card.points.map((p) => `${stripEmoji(p.title)} - ${sentence(p.desc)}`),
        });
        break;
      case 'personas':
        sections.push({
          heading: card.label,
          items: card.roles.map((r) => `${stripEmoji(r.title)} - ${sentence(r.desc)}`),
        });
        break;
      case 'integrations':
        sections.push({ heading: card.label, text: `${card.badges.join(', ')}.` });
        break;
      case 'comparison':
        sections.push({
          heading: card.label,
          items: [card.before, card.after].map(
            (side) => `${stripEmoji(side.title)} (${stripEmoji(side.highlight)}) - ${sentence(side.desc)}`,
          ),
        });
        break;
      case 'case':
        sections.push({
          heading: card.label,
          text: [
            `${stripEmoji(card.title)}.`,
            sentence(card.content),
            card.beforeAfter &&
              `Przed wdrożeniem: ${card.beforeAfter.before}. Po wdrożeniu: ${card.beforeAfter.after}.`,
          ]
            .filter(Boolean)
            .join(' '),
        });
        break;
      case 'cta':
        sections.push({ heading: stripEmoji(card.headline), text: sentence(card.subline) });
        break;
      default:
        break;
    }
  }

  return sections;
}

/* ---------- linki wewnętrzne ---------- */

const serviceLink = (service) => ({
  href: `/uslugi/${service.id}`,
  label: service.title,
  note: service.tagline,
});

/**
 * `full` wystawia cały excerpt zamiast przyciętego. Używane na hubie /blog,
 * gdzie lista wpisów jest jednocześnie treścią strony i nawigacją - dwa razy
 * ta sama lista (raz jako tekst, raz jako linki) to duplikat na jednym URL-u.
 */
const postLink = (post, { full = false } = {}) => ({
  href: `/blog/${post.slug}`,
  label: post.title,
  note: `${post.category}, ${post.date}. ${full ? post.excerpt : clampDescription(post.excerpt, 140)}`,
});

/** Wpisy z tej samej kategorii najpierw, potem najnowsze - byle nie sam siebie. */
function relatedPosts(post, limit = 4) {
  const others = blogPosts.filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  return [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))].slice(0, limit);
}

/* ---------- treść stron statycznych ---------- */

const promptCategories = promptsIndex.meta?.categories ?? [];
const personas = personasData.personas ?? [];

const audytSections = AUDYT_SECTIONS.map((section) => ({
  heading: `${stripEmoji(section.title)} - o co pytamy`,
  items: section.questions.map((q) => stripEmoji(q.text)),
}));

const privacySections = (await extractPrivacyPolicy()).map((section) => ({
  heading: section.heading,
  text: section.blocks
    .filter((b) => b.type === 'p')
    .map((b) => b.text)
    .join(' '),
  items: section.blocks.filter((b) => b.type === 'li').map((b) => b.text),
}));

/**
 * Nagłówek, lead i treść stron statycznych.
 *
 * `body` to akapit wprowadzający, `sections` to treść, którą aplikacja i tak
 * pokazuje - tyle że dopiero po uruchomieniu JS-a.
 */
const STATIC_FALLBACK = {
  '/': {
    heading: 'Workshift',
    lead: 'Wdrażamy AI, które po prostu działa',
    body:
      'Workshift to boutique AI consulting dla polskich MŚP. Pomagamy firmom wdrażać pragmatyczne innowacje AI, ' +
      'oszczędzać czas (+32% odzyskanego czasu operacyjnego), optymalizować procesy oraz budować dedykowanych ' +
      'agentów AI pracujących 24/7. Bez buzzwordów, bez przestojów, z mierzalnymi rezultatami. ' +
      'Pracujemy w czterech obszarach: audyt i automatyzacja procesów, dedykowane aplikacje, agenci AI ' +
      'oraz szkolenia dla zespołów. Zaczynamy od bezpłatnej diagnozy procesu i mapy miejsc, w których ' +
      'automatyzacja zwróci się najszybciej.',
    sections: [
      {
        heading: 'Co robimy',
        items: SERVICES.map((s) => `${s.title} - ${sentence(s.tagline)}`),
      },
      {
        heading: 'Jak wygląda współpraca',
        items: [
          'Diagnoza - 30 minut online, mapa procesów i wskazanie 2-3 miejsc z najszybszym zwrotem.',
          'Wdrożenie - budujemy workflow, agenta albo aplikację na Twoich danych, zwykle w 1-8 tygodni.',
          'Przekazanie - dostajesz działający proces, dashboard z wynikami i zespół, który umie z tego korzystać.',
        ],
      },
      {
        heading: 'Zanim się spotkamy',
        items: [
          'Mikro-audyt AI - 12 pytań, 4 minuty, wynik i trzy rekomendacje dopasowane do branży.',
          'Kalkulator strat czasowych - policz w 60 sekund, ile kosztują Cię powtarzalne zadania.',
          'Baza promptów i person AI - gotowe prompty po polsku do ChatGPT, Claude i Gemini, za darmo.',
        ],
      },
    ],
    links: [
      ...SERVICES.map(serviceLink),
      ...blogPosts.slice(0, 4).map(postLink),
    ],
  },

  '/blog': {
    heading: 'Blog',
    lead: 'AI w praktyce dla polskich firm',
    body:
      'Wnioski z realnych wdrożeń, testy narzędzi i rozbiór tego, co w AI faktycznie zmienia pracę małych ' +
      'i średnich firm. Piszemy o tym, co sprawdziliśmy u siebie albo u klientów - nie o zapowiedziach. ' +
      'Tematy wracające najczęściej: automatyzacja powtarzalnych procesów, agenci AI w obsłudze klienta ' +
      'i dokumentów, polskie modele językowe, narzędzia do pracy z wiedzą firmową oraz to, co zmiany ' +
      'w AI oznaczają dla ludzi w zespole.',
    // Hub bloga jest jedynym miejscem, z którego crawler bez JS dociera do wpisów.
    linksHeading: 'Wszystkie wpisy',
    links: blogPosts.map((post) => postLink(post, { full: true })),
  },

  '/audyt-ai': {
    heading: 'Mikro-audyt AI',
    lead: 'Sprawdź w 4 minuty, ile czasu traci Twoja firma',
    body:
      `${TOTAL_QUESTIONS} pytań o to, jak dziś wygląda praca w Twojej firmie: obsługa dokumentów, raportowanie, ` +
      'komunikacja z klientem, powtarzalne zadania zespołu. Na końcu dostajesz wynik i trzy rekomendacje ' +
      'dopasowane do branży - konkretne procesy, od których warto zacząć, a nie ogólną listę narzędzi. ' +
      'Audyt jest bezpłatny i nie wymaga przygotowania danych ani rozmowy handlowej.',
    sections: [
      {
        heading: 'Dla kogo',
        text:
          'Audyt jest dopasowany do branży i wielkości firmy. Obsługiwane branże: ' +
          `${BRANZE.map((b) => stripEmoji(b.label)).join(', ')}. Wielkości zespołu: ` +
          `${ZESPOLY.map((z) => z.label).join(', ')}.`,
      },
      ...audytSections,
      {
        heading: 'Co dostajesz na końcu',
        items: [
          'Wynik punktowy z podziałem na cztery obszary: operacje, sprzedaż, obsługa klienta i praca z wiedzą.',
          'Trzy rekomendacje wybrane pod najwyżej punktowane odpowiedzi, a nie pod ogólny profil firmy.',
          'Wskazanie procesów, od których zaczynamy wdrożenie, gdybyśmy mieli je robić razem.',
        ],
      },
    ],
  },

  '/kalkulator': {
    heading: 'Kalkulator strat czasowych',
    lead: 'Zobacz w 60 sekund, ile kosztują Cię powtarzalne zadania',
    body:
      'Podajesz branżę, wielkość zespołu, liczbę godzin tygodniowo traconych na zadania powtarzalne, liczbę dni ' +
      'poświęcanych na raportowanie i średni koszt godziny pracy. Kalkulator przelicza to na koszt ' +
      'miesięczny i roczny, a następnie pokazuje, ile z tych godzin realnie da się odzyskać.',
    sections: [
      {
        heading: 'Jak liczymy',
        items: [
          'Godziny tracone miesięcznie = (godziny tygodniowo x 4,33 + dni raportowania x 8h) x liczba osób w zespole.',
          'Koszt = godziny tracone x stawka godzinowa. Rocznie: koszt miesięczny x 12.',
          `Odzysk liczymy konserwatywnie: ${Math.round(RECOVERY_RATE * 100)} procent straconych godzin, ` +
            'choć automatyzacja zwykle zwraca 40-60 procent.',
        ],
      },
      {
        heading: 'Wielkość zespołu i stawki',
        text:
          `Do wyboru są przedziały zespołu: ${ZESPOLY.map((z) => z.label).join(', ')}. ` +
          `Stawki godzinowe: ${KOSZTY.map((k) => `${k.label} (${k.hint})`).join(', ')}.`,
      },
      {
        heading: 'Rekomendacje per branża',
        items: BRANZE.map((b) => {
          const key = stripEmoji(b.label);
          const tips = REKOMENDACJE[b.id] ?? REKOMENDACJE.inne;
          return `${key} - ${tips.map(sentence).join(' ')}`;
        }),
      },
    ],
  },

  '/prompty': {
    heading: 'Baza promptów i person AI',
    lead: '200 polskich promptów i 12 gotowych person do ChatGPT, Claude i Gemini',
    body:
      'Przeszukiwalna baza promptów po polsku, podzielona na kategorie branżowe i funkcyjne: sprzedaż, ' +
      'marketing, obsługa klienta, finanse, HR, praca z dokumentami. Persony to gotowe system prompty, ' +
      'które wklejasz raz do gema Gemini albo Custom GPT i masz wyspecjalizowanego asystenta zamiast ' +
      'ogólnego czatu. Korzystanie jest bezpłatne, prompty źródłowe są na licencji CC0.',
    sections: [
      {
        heading: 'Kategorie promptów',
        items: promptCategories.map(
          (c) => `${c.label} - ${c.count} promptów${c.industry ? ' (kategoria branżowa)' : ''}.`,
        ),
      },
      {
        heading: `Persony AI (${personas.length})`,
        items: personas.map((p) => `${stripEmoji(p.name)} - ${sentence(p.forWhat)}`),
      },
      {
        heading: 'Skąd pochodzą prompty',
        text:
          `Baza łączy prompty własne Workshift z otwartym zbiorem ${promptsIndex.meta?.source ?? 'prompts.chat'} ` +
          `na licencji ${promptsIndex.meta?.license ?? 'CC0-1.0'}, przetłumaczonym i pogrupowanym pod polskie firmy. ` +
          'Każdy prompt kopiujesz jednym kliknięciem i wklejasz do dowolnego modelu.',
      },
    ],
  },

  '/polityka-prywatnosci': {
    heading: 'Polityka prywatności',
    lead: 'Jak Workshift przetwarza dane osobowe',
    body:
      'Dokument opisuje, kto jest administratorem danych, jakie dane zbieramy przez formularze kontaktowe ' +
      'i zapis do newslettera, na jakiej podstawie prawnej je przetwarzamy oraz jak długo je przechowujemy. ' +
      'Znajdziesz tu także informacje o odbiorcach danych, wykorzystywanych plikach cookie i narzędziach ' +
      'analitycznych oraz o Twoich uprawnieniach z RODO.',
    // Pełny tekst polityki, czytany wprost z PrivacyPolicyPage.jsx.
    sections: privacySections,
  },
};

export const routes = [
  ...Object.entries(STATIC_ROUTE_META).map(([path, meta]) => ({
    path,
    ...meta,
    ...CRAWL_HINTS[path],
    fallbackHeading: STATIC_FALLBACK[path]?.heading ?? stripBrand(meta.title),
    fallbackLead: STATIC_FALLBACK[path]?.lead ?? meta.description,
    fallbackBody: STATIC_FALLBACK[path]?.body ?? '',
    fallbackSections: STATIC_FALLBACK[path]?.sections ?? [],
    fallbackLinks: STATIC_FALLBACK[path]?.links ?? [],
    fallbackLinksHeading: STATIC_FALLBACK[path]?.linksHeading,
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
    fallbackSections: serviceSections(service),
    fallbackLinks: [
      ...SERVICES.filter((s) => s.id !== service.id).map(serviceLink),
      { href: '/audyt-ai', label: 'Mikro-audyt AI', note: 'Sprawdź w 4 minuty, gdzie tracisz czas.' },
    ],
  })),

  ...blogPosts.map((post) => ({
    ...postMeta(post),
    lastmod: post.date,
    priority: '0.7',
    changefreq: 'monthly',
    fallbackHeading: post.title,
    fallbackLead: post.excerpt,
    fallbackBody: plainText(post.content),
    fallbackSections: [
      {
        heading: 'O wpisie',
        text: `Kategoria: ${post.category}. Data publikacji: ${post.date}. Autor: ${post.author?.name ?? 'Workshift'}.`,
      },
    ],
    fallbackLinks: [
      { href: '/blog', label: 'Wszystkie wpisy na blogu', note: 'AI w praktyce dla polskich firm.' },
      ...relatedPosts(post).map(postLink),
    ],
  })),
];
