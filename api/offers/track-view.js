// POST /api/offers/track-view
// Body: { slug }
// Cookie required: offer_token_<slug>
// Response: 200 { count, first, last } - licznik do banera na stronie oferty.
//
// Oferty z Supabase: wpis `view` w offers.offer_event (log otwarć, docelowo widoczny w CRM).
// Oferty z env: licznik w pliku api/_data/offers/_views.json, który działa tylko lokalnie
// (na Vercelu FS jest read-only, wtedy { count: 0 }).
// Zastępuje też dawny GET /api/offers/views (limit 12 funkcji na planie Hobby).

import { getOfferAccess, parseBody, readSlug, sendError, setPrivateHeaders, visitorFrom } from '../_lib/offers/index.js';

export default async function handler(req, res) {
    setPrivateHeaders(res);

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const slug = readSlug(parseBody(req)?.slug);
    if (!slug) return res.status(400).json({ error: 'Bad request' });

    try {
        const result = await getOfferAccess().recordView({
            slug,
            cookieHeader: req.headers?.cookie,
            visitor: visitorFrom(req),
        });
        if (result.error) return sendError(res, result.error);
        return res.status(200).json(result);
    } catch (err) {
        // Licznik nie może psuć strony oferty.
        console.warn('track-view: failed', err.message);
        return res.status(204).end();
    }
}
