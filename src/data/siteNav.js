/**
 * Linki do podstron: kolumny w stopce (src/components/FooterAndMisc.jsx) i mapa strony
 * w statycznym fallbacku (scripts/build-seo-html.mjs). Jedna lista, żeby każda indeksowana
 * podstrona miała link <a href> w HTML, a nazwy nie rozjeżdżały się między miejscami.
 */
export const SERVICE_LINKS = [
  ['/uslugi/automatyzacja', 'Audyt i automatyzacja procesów'],
  ['/uslugi/aplikacja', 'Dedykowana aplikacja'],
  ['/uslugi/agenty', 'Agenci AI'],
  ['/uslugi/szkolenia', 'Szkolenia AI'],
  ['/uslugi/kreacje', 'Kreacje reklamowe AI'],
];

export const TOOL_LINKS = [
  ['/audyt-ai', 'Mikro-audyt AI'],
  ['/kalkulator', 'Kalkulator strat czasowych'],
  ['/prompty', 'Baza promptów i person AI'],
  ['/narzedzia/szkic', 'Szkic - aplikacja na Maca'],
];

export const SITE_NAV = [
  ['/', 'Strona główna'],
  ...SERVICE_LINKS,
  ['/blog', 'Blog'],
  ...TOOL_LINKS,
  ['/polityka-prywatnosci', 'Polityka prywatności'],
];
