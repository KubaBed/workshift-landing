// POST /api/offers/track-view
// Body: { slug }
// Cookie required: offer_token_<slug>
//
// Loguje otwarcie oferty do pliku JSON w api/_data/offers/_views.json
// (gitignored). Status banner używa GET /api/offers/views?slug=... żeby
// pokazać liczbę otwarć.
//
// Uwaga: ten storage to MVP file-based — dla produkcji powinno przejść
// na Vercel KV lub Postgres. Ale do testu lokalnego wystarczy.

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

async function readViews() {
    try {
        const raw = await fs.readFile(VIEWS_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

async function writeViews(views) {
    await fs.mkdir(path.dirname(VIEWS_FILE), { recursive: true });
    await fs.writeFile(VIEWS_FILE, JSON.stringify(views, null, 2), 'utf-8');
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store, private');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = null; }
    }
    const slug = body?.slug?.toLowerCase?.() || '';
    if (!slug || !/^[a-z0-9_-]{1,64}$/.test(slug)) {
        return res.status(400).json({ error: 'Bad request' });
    }

    const cookies = parseCookies(req.headers?.cookie);
    const payload = verifyOfferToken(cookies[cookieName(slug)], slug);
    if (!payload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const views = await readViews();
        const now = new Date().toISOString();
        if (!views[slug]) {
            views[slug] = { count: 0, first: now, last: now };
        }
        views[slug].count += 1;
        views[slug].last = now;
        await writeViews(views);
        return res.status(200).json({ ok: true, ...views[slug] });
    } catch (err) {
        console.error('track-view: write failed', err.message);
        return res.status(500).json({ error: 'Write failed' });
    }
}
