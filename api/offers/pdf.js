// GET /api/offers/pdf?slug=<slug>
// Cookie required: offer_token_<slug>
// Response:
//   302 -> signed URL do PDF w prywatnym buckecie Supabase `offer-pdfs`, ważny 5 minut
//   401 - brak/nieważne cookie, 404 - oferta bez PDF albo spoza Supabase, 410 - wygasła
// Każde pobranie trafia do logu otwarć (offers.offer_event, kind 'pdf').

import { getOfferAccess, readSlug, sendError, setPrivateHeaders, visitorFrom } from '../_lib/offers/index.js';

export default async function handler(req, res) {
    setPrivateHeaders(res);

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const slug = readSlug(req.query?.slug);
    if (!slug) return res.status(400).json({ error: 'Bad request' });

    try {
        const result = await getOfferAccess().pdfUrl({
            slug,
            cookieHeader: req.headers?.cookie,
            visitor: visitorFrom(req),
        });
        if (result.error) return sendError(res, result.error);
        res.statusCode = 302;
        res.setHeader('Location', result.url);
        return res.end();
    } catch (err) {
        console.error('offer-pdf: failed', err.message);
        return res.status(500).json({ error: 'Server error' });
    }
}
