// POST /api/offers/verify
// Body: { slug, password } albo { slug, token } (token z linku /oferta/<slug>?k=...)
// Response:
//   200 + Set-Cookie: offer_token_<slug>=<hmac> - dostęp OK
//   401 - złe hasło/token albo nieznany slug (nie odróżniamy, żeby nie zdradzać istnienia oferty)
//   410 - oferta wygasła
//   429 - za dużo błędnych haseł (rate limit w Supabase)
//   400 - zły request
// Reguły (źródła, hashe, rate limit, cookie) w api/_lib/offers/access.js.

import {
    getOfferAccess,
    isValidSlug,
    isProduction,
    parseBody,
    readSlug,
    sendError,
    setPrivateHeaders,
    visitorFrom,
} from '../_lib/offers/index.js';
import { buildCookieHeader } from '../_lib/offerAuth.js';

export default async function handler(req, res) {
    setPrivateHeaders(res);

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = parseBody(req);
    const slug = readSlug(body?.slug);
    const password = typeof body?.password === 'string' ? body.password : '';
    const token = typeof body?.token === 'string' ? body.token : '';

    if (!isValidSlug(slug) || (!password && !token) || password.length > 256 || token.length > 128) {
        return res.status(400).json({ error: 'Bad request' });
    }

    try {
        const result = await getOfferAccess().unlock({
            slug,
            password: password || undefined,
            token: password ? undefined : token,
            visitor: visitorFrom(req),
        });
        if (result.error) return sendError(res, result.error);
        res.setHeader('Set-Cookie', buildCookieHeader(slug, result.cookie.value, isProduction(), result.cookie.maxAge));
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error('verify-offer: failed', err.message);
        return res.status(500).json({ error: 'Server misconfiguration' });
    }
}
