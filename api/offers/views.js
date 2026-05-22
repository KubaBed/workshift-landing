// GET /api/offers/views?slug=<slug>
// Cookie required: offer_token_<slug>
// Response: { count, first, last } albo 401 / 404

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    cookieName,
    parseCookies,
    verifyOfferToken,
} from '../_lib/offerAuth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VIEWS_FILE = path.join(__dirname, '..', '_data', 'offers', '_views.json');

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, private');
    res.setHeader('X-Content-Type-Options', 'nosniff');

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
    const payload = verifyOfferToken(cookies[cookieName(slug)], slug);
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const raw = await fs.readFile(VIEWS_FILE, 'utf-8');
        const data = JSON.parse(raw);
        const slugData = data[slug];
        if (!slugData) return res.status(200).json({ count: 0, first: null, last: null });
        return res.status(200).json(slugData);
    } catch {
        return res.status(200).json({ count: 0, first: null, last: null });
    }
}
