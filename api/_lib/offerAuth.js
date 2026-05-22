// Offer page authentication — stateless JWT-like cookie based on HMAC.
// Re-use'uje wzorzec z _lib/doi.js (signToken/verifyToken).
//
// Flow:
//   1. POST /api/offers/verify { slug, password }
//      → check stała czasowa: password vs process.env.OFFER_PASSWORD_<SLUG_UPPER>
//      → set httpOnly cookie offer_token_<slug> = HMAC({slug, exp})
//   2. GET /api/offers/[slug]
//      → verify cookie. If valid → return offer data. If not → 401.
//
// Nigdy nie zwracamy danych klienta jeśli cookie niepoprawny — to znaczy że
// nawet ktoś z DevToolsami w produkcji nie zobaczy treści oferty bez hasła.

import crypto from 'node:crypto';
import { signToken, verifyToken } from './doi.js';

const COOKIE_PREFIX = 'offer_token_';
const COOKIE_MAX_AGE_DAYS = 7;

export function cookieName(slug) {
    return `${COOKIE_PREFIX}${slug.toLowerCase().replace(/[^a-z0-9_-]/g, '')}`;
}

export function envPasswordKey(slug) {
    return `OFFER_PASSWORD_${slug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`;
}

export function envDataKey(slug) {
    return `OFFER_DATA_${slug.toUpperCase().replace(/[^A-Z0-9_]/g, '_')}`;
}

export function getOfferPassword(slug) {
    return process.env[envPasswordKey(slug)] || null;
}

// Decoduje treść oferty z env var (base64-encoded JSON). Używane w produkcji
// gdy plik na file system nie jest dostępny (gitignored). Wraca null jeśli env
// var nie ustawiony albo zawartość nie parsuje się jako JSON.
export function getOfferFromEnv(slug) {
    const raw = process.env[envDataKey(slug)];
    if (!raw) return null;
    try {
        const json = Buffer.from(raw, 'base64').toString('utf-8');
        const parsed = JSON.parse(json);
        if (!parsed || typeof parsed !== 'object') return null;
        return parsed;
    } catch (err) {
        console.error(`getOfferFromEnv: failed to decode ${envDataKey(slug)}:`, err.message);
        return null;
    }
}

export function getJwtSecret() {
    const secret = process.env.OFFER_JWT_SECRET;
    if (!secret) {
        throw new Error('OFFER_JWT_SECRET missing in env');
    }
    return secret;
}

// Stała czasowa porównanie haseł — chroni przed timing attacks.
// Even though passwords are short, this is hygiene.
export function passwordsMatch(provided, expected) {
    if (typeof provided !== 'string' || typeof expected !== 'string') return false;
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    // Pad shorter buffer to avoid timingSafeEqual length mismatch
    const max = Math.max(a.length, b.length);
    const padA = Buffer.alloc(max);
    const padB = Buffer.alloc(max);
    a.copy(padA);
    b.copy(padB);
    return crypto.timingSafeEqual(padA, padB) && a.length === b.length;
}

export function mintOfferToken(slug) {
    const secret = getJwtSecret();
    const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
    return signToken({ slug, exp }, secret);
}

export function verifyOfferToken(token, expectedSlug) {
    if (!token) return null;
    try {
        const secret = getJwtSecret();
        const payload = verifyToken(token, secret);
        if (!payload || payload.slug !== expectedSlug) return null;
        return payload;
    } catch {
        return null;
    }
}

export function buildCookieHeader(slug, token, isProduction) {
    const name = cookieName(slug);
    const parts = [
        `${name}=${token}`,
        'Path=/',
        `Max-Age=${COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}`,
        'HttpOnly',
        'SameSite=Lax',
    ];
    if (isProduction) parts.push('Secure');
    return parts.join('; ');
}

export function buildClearCookieHeader(slug, isProduction) {
    const name = cookieName(slug);
    const parts = [
        `${name}=`,
        'Path=/',
        'Max-Age=0',
        'HttpOnly',
        'SameSite=Lax',
    ];
    if (isProduction) parts.push('Secure');
    return parts.join('; ');
}

export function parseCookies(cookieHeader) {
    if (!cookieHeader || typeof cookieHeader !== 'string') return {};
    const result = {};
    cookieHeader.split(';').forEach((part) => {
        const idx = part.indexOf('=');
        if (idx === -1) return;
        const k = part.slice(0, idx).trim();
        const v = part.slice(idx + 1).trim();
        if (k) result[k] = decodeURIComponent(v);
    });
    return result;
}

// Strip sensitive metadata przed wysłaniem do frontendu.
// Frontend nie potrzebuje slug routing przeszłej oferty, ani client.role wewnętrznego.
// Dane podstawowe + sekcje treściowe — tak. RODO-safe.
export function sanitizeOfferForClient(offer) {
    if (!offer) return null;
    return {
        slug: offer.slug,
        client: {
            name: offer.client?.name || '',
            contact: offer.client?.contact || '',
        },
        meta: offer.meta || {},
        context: offer.context || null,
        problems: offer.problems || [],
        approach: offer.approach || null,
        pilot: offer.pilot || null,
        asysta: offer.asysta || null,
        timeline: offer.timeline || [],
        pricing: offer.pricing || null,
        saldeo: offer.saldeo || null,
        nextSteps: offer.nextSteps || [],
        video: offer.video || null,
    };
}
