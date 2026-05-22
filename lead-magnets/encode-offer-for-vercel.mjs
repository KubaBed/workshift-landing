/**
 * Encoder dla oferty → base64 JSON do wklejenia w Vercel env var.
 *
 * Czyta plik api/_data/offers/<slug>.js, serializuje JSON, base64-encoduje,
 * wypisuje na stdout. Skopiuj output i wklej do Vercel jako:
 *   Variable name: OFFER_DATA_<SLUG_UPPER>
 *   Value: <wkleisz output>
 *
 * Usage:
 *   node lead-magnets/encode-offer-for-vercel.mjs informax
 *   # lub
 *   npm run offer:encode -- informax
 *
 * Bezpieczeństwo: ten skrypt CZYTA dane oferty z dysku i wypisuje na stdout.
 * Jeśli używasz w pipe do narzędzia (np. `... | pbcopy`), uważaj na shell
 * history. Najlepiej: uruchom, ręcznie skopiuj output, zamknij terminal.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const slug = process.argv[2];
if (!slug || !/^[a-z0-9_-]+$/.test(slug)) {
    console.error('Usage: node lead-magnets/encode-offer-for-vercel.mjs <slug>');
    console.error('Example: node lead-magnets/encode-offer-for-vercel.mjs informax');
    process.exit(1);
}

const dataFile = path.join(ROOT, 'api', '_data', 'offers', `${slug}.js`);

try {
    await fs.access(dataFile);
} catch {
    console.error(`Nie znaleziono ${dataFile}`);
    process.exit(1);
}

const url = pathToFileURL(dataFile).href;
const mod = await import(url);
const offer = mod.default || mod[slug];
if (!offer) {
    console.error(`Plik ${dataFile} musi mieć export default z obiektem oferty.`);
    process.exit(1);
}

const json = JSON.stringify(offer);
const base64 = Buffer.from(json, 'utf-8').toString('base64');

const envVarName = `OFFER_DATA_${slug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`;
const sizeKB = (base64.length / 1024).toFixed(2);

// Diagnostyka na STDERR (nie zaśmieca stdout, łatwiej pipe'ować).
console.error(`# Encoded ${slug} → ${envVarName}`);
console.error(`# Original JSON: ${(json.length / 1024).toFixed(2)} KB`);
console.error(`# Base64: ${sizeKB} KB (Vercel env var limit: 64 KB)`);
if (base64.length > 64 * 1024) {
    console.error(`# ⚠️  WARNING: przekroczyłeś limit Vercel env var (64 KB)!`);
}
console.error(`#`);
console.error(`# Vercel → Project → Settings → Environment Variables → Add New:`);
console.error(`#   Key:   ${envVarName}`);
console.error(`#   Value: <skopiuj poniższą linijkę bez # i pustych znaków>`);
console.error(`#   Scope: Production, Preview, Development (wybierz wszystkie)`);
console.error(``);

// Sam base64 na stdout — można pipe'ować do `pbcopy` na macOS.
process.stdout.write(base64);
process.stdout.write('\n');
