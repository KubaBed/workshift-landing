// Oferty w Supabase (projekt workshift-crm, schemat `offers`, bucket `offer-pdfs`).
// Klucz secret (rola service_role) żyje tylko w funkcjach Vercela: SUPABASE_SECRET_KEY,
// nigdy z prefiksem VITE_, więc nie trafia do bundla przeglądarki.
// Schemat i uprawnienia: supabase/offers/0001_offers.sql.

import { createClient } from '@supabase/supabase-js';

const BUCKET = 'offer-pdfs';
const TIMEOUT_MS = 2500;
const OFFER_COLUMNS = 'id, slug, content, status, password_hash, token_hash, access_epoch, expires_at, pdf_path';

// Każde zapytanie z limitem czasu: przy awarii bazy strona ma spaść na env, a nie wisieć.
function fetchWithTimeout(input, init = {}) {
    const signal = init.signal ?? AbortSignal.timeout(TIMEOUT_MS);
    return fetch(input, { ...init, signal });
}

function unwrap({ data, error }, what) {
    if (error) throw new Error(`supabase ${what}: ${error.message}`);
    return data;
}

export function createSupabaseSource({ url, key }) {
    const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        db: { schema: 'offers' },
        global: { fetch: fetchWithTimeout },
    });

    return {
        // Wiersz `offers.offer` albo null. Rzuca przy błędzie połączenia (wołający robi fallback).
        async findBySlug(slug) {
            return unwrap(
                await client.from('offer').select(OFFER_COLUMNS).eq('slug', slug).maybeSingle(),
                'findBySlug',
            );
        },

        async authGate(slug, ipHash) {
            return unwrap(await client.rpc('auth_gate', { p_slug: slug, p_ip_hash: ipHash }), 'authGate');
        },

        async recordFailure(slug, ipHash) {
            unwrap(await client.rpc('record_failure', { p_slug: slug, p_ip_hash: ipHash }), 'recordFailure');
        },

        async recordEvent(offerId, kind, visitor) {
            unwrap(
                await client.from('offer_event').insert({
                    offer_id: offerId,
                    kind,
                    ip_hash: visitor?.ipHash || null,
                    country: visitor?.country || null,
                    user_agent: visitor?.userAgent ? String(visitor.userAgent).slice(0, 200) : null,
                }),
                'recordEvent',
            );
        },

        async viewStats(offerId) {
            const rows = unwrap(await client.rpc('view_stats', { p_offer_id: offerId }), 'viewStats');
            const row = Array.isArray(rows) ? rows[0] : rows;
            return { count: Number(row?.count || 0), first: row?.first || null, last: row?.last || null };
        },

        async signPdf(pdfPath, filename, expiresIn) {
            const data = unwrap(
                await client.storage.from(BUCKET).createSignedUrl(pdfPath, expiresIn, { download: filename }),
                'signPdf',
            );
            return data.signedUrl;
        },
    };
}
