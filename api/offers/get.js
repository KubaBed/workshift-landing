// GET /api/offers/get?slug=<slug>
// Cookie required: offer_token_<slug>
// Response:
//   200 { offer: <sanitized data> }     — cookie valid
//   401                                  — no cookie / expired / mismatched slug
//   404                                  — slug unknown
//
// Dane oferty NIGDY nie są w bundle frontend'u. Tylko backend ma do nich
// dostęp, i tylko z ważnym cookie zwraca treść. Nawet DevTools w przeglądarce
// nie odkryje danych bez znajomości hasła.

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
    cookieName,
    parseCookies,
    verifyOfferToken,
    sanitizeOfferForClient,
} from '../_lib/offerAuth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lazy load offer data file. Nieobsłużone slugi → null.
async function loadOffer(slug) {
    if (!/^[a-z0-9_-]+$/.test(slug)) return null;
    // Najpierw szukamy pliku per-slug (private, gitignored). Fallback: null.
    const candidate = path.join(__dirname, '..', '_data', 'offers', `${slug}.js`);
    try {
        const url = pathToFileURL(candidate).href;
        const mod = await import(url);
        return mod.default || mod[slug] || null;
    } catch {
        return null;
    }
}

export default async function handler(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store, private');

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const slug = typeof req.query?.slug === 'string'
        ? req.query.slug.toLowerCase()
        : '';

    if (!slug || !/^[a-z0-9_-]{1,64}$/.test(slug)) {
        return res.status(400).json({ error: 'Bad request' });
    }

    const cookies = parseCookies(req.headers?.cookie);
    const token = cookies[cookieName(slug)];

    let payload;
    try {
        payload = verifyOfferToken(token, slug);
    } catch (err) {
        console.error('get-offer: verify failed', err.message);
        return res.status(500).json({ error: 'Server misconfiguration' });
    }

    if (!payload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const offer = await loadOffer(slug);
    if (!offer) {
        return res.status(404).json({ error: 'Offer not found' });
    }

    return res.status(200).json({ offer: sanitizeOfferForClient(offer) });
}
