// Dostęp do stron ofert /oferta/<slug>. Handlery w api/offers/* tylko tłumaczą HTTP na te
// cztery wywołania; cała reguła (źródła, hasło, token z linku, cookie, wygasanie, rate limit,
// log otwarć, PDF) siedzi tutaj.
//
// Źródła, w tej kolejności:
//   1. Supabase (`db`): wiersz w offers.offer. Wygrywa, gdy istnieje i nie jest szkicem.
//   2. Dotychczasowe env/plik (`legacy`): OFFER_DATA_<SLUG> + OFFER_PASSWORD_<SLUG>.
// Błąd albo timeout bazy = przejście do env, więc stare oferty działają także przy awarii Supabase.
//
// Cookie: offer_token_<slug> = HMAC(OFFER_JWT_SECRET) z {slug, exp, ep}. `ep` to access_epoch
// oferty z bazy; jego podbicie unieważnia wszystkie wydane cookie. Brak `ep` liczy się jako 0,
// więc cookie wydane dla oferty z env przeżyją jej przeniesienie do bazy.

import { sanitizeOfferForClient, cookieName, parseCookies, COOKIE_MAX_AGE_SECONDS, passwordsMatch } from '../offerAuth.js';
import { signToken, verifyToken } from '../doi.js';
import { verifyPassword, tokenMatches, ipHash } from './secrets.js';

const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const PDF_LINK_SECONDS = 300;
const FAILURE_DELAY_MS = () => 250 + Math.random() * 150;

export function isValidSlug(slug) {
    return typeof slug === 'string' && SLUG_RE.test(slug);
}

/**
 * @param {object} deps
 * @param {object|null} deps.db      adapter Supabase (sourceSupabase.js) albo null, gdy brak kluczy
 * @param {object} deps.legacy       adapter env/plik (sourceEnv.js)
 * @param {string} deps.secret       OFFER_JWT_SECRET
 * @param {() => number} [deps.now]  ms od epoki; w testach podmieniany
 * @param {(ms: number) => Promise<void>} [deps.sleep]
 * @param {(msg: string) => void} [deps.log]
 */
export function createOfferAccess({ db, legacy, secret, now = () => Date.now(), sleep, log = console.warn }) {
    if (!secret) throw new Error('OFFER_JWT_SECRET missing in env');
    const wait = sleep || ((ms) => new Promise((r) => setTimeout(r, ms)));
    const nowSec = () => Math.floor(now() / 1000);

    async function resolve(slug) {
        if (db) {
            try {
                const row = await db.findBySlug(slug);
                if (row && row.status === 'active') return { kind: 'db', row };
                if (row && row.status === 'revoked') return null;
                // 'draft' albo brak wiersza: szkic da się wgrać przed wysyłką, a stara oferta z env działa dalej.
            } catch (err) {
                log(`offers: supabase unavailable, falling back to env (${err.message})`);
            }
        }
        const found = await legacy.find(slug);
        return found ? { kind: 'env', ...found } : null;
    }

    const isExpired = (offer) =>
        offer.kind === 'db' && offer.row.expires_at && Date.parse(offer.row.expires_at) <= now();

    function readCookie(slug, cookieHeader) {
        const token = parseCookies(cookieHeader)[cookieName(slug)];
        if (!token) return null;
        const payload = verifyToken(token, secret);
        return payload && payload.slug === slug ? payload : null;
    }

    // Cookie ważne i nadal pasuje do oferty (epoka, wygaśnięcie). Zwraca ofertę albo kod błędu.
    async function authorize(slug, cookieHeader) {
        if (!isValidSlug(slug)) return { error: 'not_found' };
        const payload = readCookie(slug, cookieHeader);
        if (!payload) return { error: 'unauthorized' };
        const offer = await resolve(slug);
        if (!offer) return { error: 'not_found' };
        if (offer.kind === 'db') {
            if (isExpired(offer)) return { error: 'expired' };
            if ((payload.ep ?? 0) !== offer.row.access_epoch) return { error: 'unauthorized' };
        }
        return { offer };
    }

    function visitorInfo(visitor = {}) {
        return { ipHash: ipHash(visitor.ip, secret), country: visitor.country || null, userAgent: visitor.userAgent || null };
    }

    async function safeDb(what, fn) {
        try {
            return await fn();
        } catch (err) {
            log(`offers: ${what} failed (${err.message})`);
            return undefined;
        }
    }

    function issueCookie(slug, offer) {
        let maxAge = COOKIE_MAX_AGE_SECONDS;
        const payload = { slug, exp: nowSec() + maxAge };
        if (offer.kind === 'db') {
            payload.ep = offer.row.access_epoch;
            if (offer.row.expires_at) {
                const untilExpiry = Math.floor(Date.parse(offer.row.expires_at) / 1000) - nowSec();
                maxAge = Math.max(1, Math.min(maxAge, untilExpiry));
                payload.exp = nowSec() + maxAge;
            }
        }
        return { value: signToken(payload, secret), maxAge };
    }

    function contentFor(offer, slug) {
        if (offer.kind === 'env') return sanitizeOfferForClient({ ...offer.content, slug });
        const { row } = offer;
        return {
            ...sanitizeOfferForClient({ ...row.content, slug }),
            hasPdf: Boolean(row.pdf_path),
            expiresAt: row.expires_at || null,
        };
    }

    return {
        /**
         * Hasło albo token z linku -> cookie.
         * @returns {Promise<{ok: true, cookie: {value: string, maxAge: number}} | {error: 'invalid'|'locked'|'expired'}>}
         */
        async unlock({ slug, password, token, visitor }) {
            if (!isValidSlug(slug) || (!password && !token)) return { error: 'invalid' };
            const who = visitorInfo(visitor);
            const offer = await resolve(slug);

            if (offer && isExpired(offer)) return { error: 'expired' };

            // Rate limit tylko dla hasła; token z linku ma 256 bitów i nie da się go zgadnąć.
            if (password && db) {
                const gate = await safeDb('authGate', () => db.authGate(slug, who.ipHash));
                if (gate === 'locked') return { error: 'locked' };
            }

            let ok = false;
            let kind = 'unlock_password';
            if (offer?.kind === 'db') {
                if (token) {
                    kind = 'unlock_token';
                    ok = tokenMatches(token, offer.row.token_hash);
                } else {
                    ok = offer.row.password_hash ? await verifyPassword(password, offer.row.password_hash) : false;
                }
            } else if (offer?.kind === 'env' && password && offer.password) {
                ok = passwordsMatch(password, offer.password);
            } else {
                // Nieznany slug: ta sama praca co przy złym haśle, żeby czas odpowiedzi nie zdradzał istnienia oferty.
                passwordsMatch(String(password || token), '__no_offer__');
            }

            if (!ok) {
                if (password && db) await safeDb('recordFailure', () => db.recordFailure(slug, who.ipHash));
                await wait(FAILURE_DELAY_MS());
                return { error: 'invalid' };
            }

            if (offer.kind === 'db') await safeDb('recordEvent', () => db.recordEvent(offer.row.id, kind, who));
            return { ok: true, cookie: issueCookie(slug, offer) };
        },

        /** @returns {Promise<{offer: object} | {error: 'unauthorized'|'not_found'|'expired'}>} */
        async read({ slug, cookieHeader }) {
            const { offer, error } = await authorize(slug, cookieHeader);
            if (error) return { error };
            return { offer: contentFor(offer, slug) };
        },

        /** Zapis otwarcia + licznik do banera. @returns {Promise<{count, first, last} | {error}>} */
        async recordView({ slug, cookieHeader, visitor }) {
            const { offer, error } = await authorize(slug, cookieHeader);
            if (error) return { error };
            if (offer.kind === 'env') return legacy.recordView(slug);
            await safeDb('recordEvent', () => db.recordEvent(offer.row.id, 'view', visitorInfo(visitor)));
            return (await safeDb('viewStats', () => db.viewStats(offer.row.id))) || { count: 0, first: null, last: null };
        },

        /** Krótko żyjący link do PDF w prywatnym buckecie. @returns {Promise<{url: string} | {error}>} */
        async pdfUrl({ slug, cookieHeader, visitor }) {
            const { offer, error } = await authorize(slug, cookieHeader);
            if (error) return { error };
            if (offer.kind !== 'db' || !offer.row.pdf_path) return { error: 'not_found' };
            await safeDb('recordEvent', () => db.recordEvent(offer.row.id, 'pdf', visitorInfo(visitor)));
            const url = await db.signPdf(offer.row.pdf_path, `Workshift-oferta-${slug}.pdf`, PDF_LINK_SECONDS);
            return { url };
        },
    };
}
