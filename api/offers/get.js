// GET /api/offers/get?slug=<slug>
// Cookie required: offer_token_<slug>
// Response:
//   200 { offer: <sanitized data> } - cookie ważne
//   401 - brak cookie / wygasłe / inny slug / unieważnione (access_epoch)
//   404 - nieznany slug
//   410 - oferta wygasła
//
// Dane oferty NIGDY nie są w bundlu frontendu. Źródło (Supabase, potem env/plik)
// i reguły dostępu: api/_lib/offers/access.js.

import { getOfferAccess, readSlug, sendError, setPrivateHeaders } from '../_lib/offers/index.js';

export default async function handler(req, res) {
    setPrivateHeaders(res);

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const slug = readSlug(req.query?.slug);
    if (!slug) return res.status(400).json({ error: 'Bad request' });

    try {
        const result = await getOfferAccess().read({ slug, cookieHeader: req.headers?.cookie });
        if (result.error) return sendError(res, result.error);
        return res.status(200).json({ offer: result.offer });
    } catch (err) {
        console.error('get-offer: failed', err.message);
        return res.status(500).json({ error: 'Server misconfiguration' });
    }
}
