// Składanie modułu dostępu z env procesu + wspólne kawałki HTTP dla api/offers/*.
// Bez SUPABASE_URL / SUPABASE_SECRET_KEY działa wyłącznie dotychczasowe źródło env/plik,
// więc lokalny dev i stare oferty nie wymagają kluczy Supabase.

import { createOfferAccess, isValidSlug } from './access.js';
import { createEnvSource } from './sourceEnv.js';
import { createSupabaseSource } from './sourceSupabase.js';

let cached = null;

export function getOfferAccess() {
    if (cached) return cached;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    cached = createOfferAccess({
        db: url && key ? createSupabaseSource({ url, key }) : null,
        legacy: createEnvSource(),
        secret: process.env.OFFER_JWT_SECRET,
    });
    return cached;
}

export { isValidSlug };

export function isProduction() {
    return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
}

// IP i kraj z nagłówków Vercela; lokalnie adres gniazda.
export function visitorFrom(req) {
    const h = req.headers || {};
    const forwarded = String(h['x-forwarded-for'] || '').split(',')[0].trim();
    return {
        ip: forwarded || h['x-real-ip'] || req.socket?.remoteAddress || null,
        country: h['x-vercel-ip-country'] || null,
        userAgent: h['user-agent'] || null,
    };
}

export function readSlug(value) {
    return typeof value === 'string' ? value.toLowerCase() : '';
}

export function parseBody(req) {
    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch { body = null; }
    }
    return body && typeof body === 'object' ? body : null;
}

export function setPrivateHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Cache-Control', 'no-store, private');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
}

// Kody błędów modułu -> HTTP. Treść błędów ogólna, bez szczegółów wewnętrznych.
const STATUS = {
    invalid: [401, 'Nieprawidłowe hasło'],
    unauthorized: [401, 'Unauthorized'],
    locked: [429, 'Too many attempts'],
    expired: [410, 'Offer expired'],
    not_found: [404, 'Offer not found'],
};

export function sendError(res, code) {
    const [status, message] = STATUS[code] || [500, 'Server error'];
    return res.status(status).json({ error: message, code });
}
