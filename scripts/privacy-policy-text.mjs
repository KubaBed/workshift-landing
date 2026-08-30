/**
 * Wyciąga treść polityki prywatności z `src/pages/PrivacyPolicyPage.jsx`.
 *
 * DLACZEGO tak, a nie przez skopiowanie tekstu do `src/data/`
 * ----------------------------------------------------------
 * Fallback dla crawlerów bez JS potrzebuje tej samej treści, którą React
 * renderuje użytkownikowi. Dla usług i wpisów bloga dane leżą już w
 * `src/data/*`, więc wystarczy je zaimportować. Polityka prywatności to
 * jednak dokument prawny wpisany wprost w JSX - przepisanie go do drugiego
 * pliku znaczy, że od pierwszej poprawki istnieją dwie wersje umowy z
 * użytkownikiem i nie wiadomo, która obowiązuje.
 *
 * Dlatego czytamy jedyne źródło. `<article>` w tym pliku jest statyczny:
 * zero propsów, zero interpolacji, zero warunków - to płaski HTML zapisany
 * w składni JSX. Gdyby ktoś to zmienił, `extractPrivacyPolicy()` rzuca
 * wyjątkiem i build pada, zamiast po cichu wypuścić pustą stronę.
 */

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'pages',
  'PrivacyPolicyPage.jsx',
);

/** Minimum, poniżej którego zakładamy, że parser się rozjechał, a nie że polityka schudła. */
const MIN_BLOCKS = 30;

const decode = (value) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();

/** Zdejmuje tagi z wnętrza bloku, zostawiając sam tekst (linki -> ich treść). */
const textOf = (html) => decode(html.replace(/<[^>]+>/g, ' '));

/**
 * @returns {{heading: string, level: 3|4, blocks: Array<{type: 'p'|'li', text: string}>}[]}
 */
export async function extractPrivacyPolicy() {
  const source = await readFile(SOURCE, 'utf8');

  const article = source.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  if (!article) {
    throw new Error(
      'PrivacyPolicyPage.jsx nie zawiera <article>. Treść polityki się przeniosła - ' +
        'zaktualizuj scripts/privacy-policy-text.mjs.',
    );
  }

  // Wyrażenia JSX (`{/* komentarz */}`, `{zmienna}`) nie są tekstem dla czytelnika.
  const body = article[1].replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ').replace(/\{[^{}]*\}/g, ' ');

  const sections = [];
  let blocks = 0;

  const tokens = body.matchAll(/<(h3|h4|p|li)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g);
  for (const [, tag, inner] of tokens) {
    const text = textOf(inner);
    if (!text) continue;

    if (tag === 'h3' || tag === 'h4') {
      sections.push({ heading: text, level: tag === 'h3' ? 3 : 4, blocks: [] });
      continue;
    }
    if (!sections.length) continue; // tekst przed pierwszym nagłówkiem = nagłówek strony

    sections[sections.length - 1].blocks.push({ type: tag, text });
    blocks += 1;
  }

  if (blocks < MIN_BLOCKS) {
    throw new Error(
      `Z PrivacyPolicyPage.jsx wyciągnięto tylko ${blocks} akapitów (minimum ${MIN_BLOCKS}). ` +
        'Struktura <article> się zmieniła - zaktualizuj scripts/privacy-policy-text.mjs.',
    );
  }

  return sections;
}
