// Hasła, tokeny z linku i skrót IP dla ofert trzymanych w Supabase.
// Baza widzi tylko skróty: hasło jako scrypt, token jako sha256, IP jako HMAC.
// Bez zależności poza node:crypto, więc te same funkcje woła skrypt Kuby (scripts/offers/offer-db.mjs).

import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt);
const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };

export async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const hash = await scrypt(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p });
    return ['scrypt', SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('base64url'), hash.toString('base64url')].join('$');
}

// Fałsz dla każdego błędnego formatu; porównanie stałoczasowe.
export async function verifyPassword(password, stored) {
    if (typeof password !== 'string' || typeof stored !== 'string') return false;
    const parts = stored.split('$');
    if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
    const [, N, r, p, saltB64, hashB64] = parts;
    const expected = Buffer.from(hashB64, 'base64url');
    if (expected.length === 0) return false;
    try {
        const actual = await scrypt(password, Buffer.from(saltB64, 'base64url'), expected.length, {
            N: Number(N), r: Number(r), p: Number(p),
        });
        return crypto.timingSafeEqual(actual, expected);
    } catch {
        return false;
    }
}

// Token do linku ?k=: 32 losowe bajty, ok. 43 znaki base64url.
export function newToken() {
    return crypto.randomBytes(32).toString('base64url');
}

export function hashToken(token) {
    return crypto.createHash('sha256').update(String(token)).digest('hex');
}

export function tokenMatches(token, storedHash) {
    if (typeof token !== 'string' || !token || typeof storedHash !== 'string') return false;
    const a = Buffer.from(hashToken(token), 'hex');
    const b = Buffer.from(storedHash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// IP nie trafia do bazy wprost (RODO): tylko HMAC z sekretem serwera.
export function ipHash(ip, secret) {
    return crypto.createHmac('sha256', secret).update(`ip:${ip || 'unknown'}`).digest('hex').slice(0, 32);
}
