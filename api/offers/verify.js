// POST /api/offers/verify
// Body: { slug: string, password: string }
// Response:
//   200 + Set-Cookie: offer_token_<slug>=<jwt> — auth OK
//   401 — bad password / unknown slug
//   400 — bad request
//
// Stała czasowa porównanie haseł + zero leakage info (nie odróżniamy
// "nieznany slug" od "złe hasło", oba zwracają 401).

import {
    getOfferPassword,
    passwordsMatch,
    mintOfferToken,
    buildCookieHeader,
} from '../_lib/offerAuth.js';

export default async function handler(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let body = req.body;
    // Vite middleware sometimes daje raw string — parsujemy
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = null; }
    }
    if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Bad request' });
    }

    const slug = typeof body.slug === 'string' ? body.slug.toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!slug || !password || slug.length > 64 || password.length > 256) {
        return res.status(400).json({ error: 'Bad request' });
    }

    // Slug whitelist — tylko alfanumeryczne + myślniki.
    if (!/^[a-z0-9_-]+$/.test(slug)) {
        return res.status(400).json({ error: 'Bad request' });
    }

    const expectedPassword = getOfferPassword(slug);
    // Zawsze wykonaj porównanie żeby timing był stały (zero info leakage
    // o tym czy slug istnieje).
    const dummyPassword = '__no_password_set__';
    const ok = expectedPassword
        ? passwordsMatch(password, expectedPassword)
        : (passwordsMatch(password, dummyPassword) && false);

    if (!ok) {
        // Mała opóźnienie żeby utrudnić brute force (poor man's rate limit).
        await new Promise((r) => setTimeout(r, 250 + Math.random() * 150));
        return res.status(401).json({ error: 'Nieprawidłowe hasło' });
    }

    try {
        const token = mintOfferToken(slug);
        const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
        res.setHeader('Set-Cookie', buildCookieHeader(slug, token, isProduction));
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('verify-offer: mint failed', err.message);
        return res.status(500).json({ error: 'Server misconfiguration' });
    }
}
