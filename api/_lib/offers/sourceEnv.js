// Dotychczasowe źródło ofert: env Vercela (OFFER_DATA_<SLUG> + OFFER_PASSWORD_<SLUG>),
// a lokalnie plik api/_data/offers/<slug>.js. Logika przeniesiona z get.js i track-view.js
// bez zmian zachowania, żeby istniejące oferty działały jak przed Supabase.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { getOfferFromEnv, getOfferPassword } from '../offerAuth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', '..', '_data', 'offers');
const VIEWS_FILE = path.join(DATA_DIR, '_views.json');

// Env wygrywa z plikiem: na produkcji pliku nie ma (gitignored), lokalnie env zwykle pusty.
async function loadContent(slug) {
    const fromEnv = getOfferFromEnv(slug);
    if (fromEnv) return fromEnv;
    try {
        const mod = await import(pathToFileURL(path.join(DATA_DIR, `${slug}.js`)).href);
        return mod.default || mod[slug] || null;
    } catch {
        return null;
    }
}

async function readViews() {
    try {
        return JSON.parse(await fs.readFile(VIEWS_FILE, 'utf-8'));
    } catch {
        return {};
    }
}

export function createEnvSource() {
    return {
        // { content, password } albo null. Hasło może być null (oferta bez hasła = brak dostępu).
        async find(slug) {
            const content = await loadContent(slug);
            if (!content) return null;
            return { content, password: getOfferPassword(slug) };
        },

        // Licznik w pliku JSON. Na Vercelu FS jest read-only, więc zapis się nie uda
        // i zwracamy stan "zero otwarć", tak jak dawny /api/offers/views.
        async recordView(slug) {
            const views = await readViews();
            const now = new Date().toISOString();
            const entry = views[slug] || { count: 0, first: now, last: now };
            entry.count += 1;
            entry.last = now;
            views[slug] = entry;
            try {
                await fs.mkdir(DATA_DIR, { recursive: true });
                await fs.writeFile(VIEWS_FILE, JSON.stringify(views, null, 2), 'utf-8');
                return entry;
            } catch {
                return { count: 0, first: null, last: null };
            }
        },
    };
}
