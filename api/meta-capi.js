/**
 * Meta Conversions API (CAPI) relay — server-side mirror eventów pixela.
 *
 * Po co: pixel kliencki gubi eventy w in-app browserze Meta (m.facebook/instagram),
 * przy adblockach i na iOS (ITP). Ten endpoint wysyła TEN SAM event server-side,
 * z `event_id` zgodnym z pixelem → Meta deduplikuje (liczy raz). Efekt: pełniejszy
 * i wiarygodniejszy sygnał do optymalizacji ORAZ licznik startów widoczny w Events
 * Managerze niezależnie od planu Vercel (custom eventy Vercel są za paywallem Pro).
 *
 * RODO: wołany z klienta TYLKO gdy jest zgoda marketingowa (patrz src/lib/metaCapi.js);
 * dla Lead — tylko gdy klient przekaże marketingConsent=true. Serwer dokłada wyłącznie
 * IP + User-Agent z nagłówków tej samej wizyty oraz przekazane fbp/fbc. Email (Lead)
 * hashujemy SHA-256 przed wysyłką — Meta nigdy nie dostaje surowego adresu.
 *
 * Env:
 *   META_PIXEL_ID        — ID pixela/datasetu (np. 1350172243839037)
 *   META_CAPI_TOKEN      — token Conversions API (Events Manager → Settings → CAPI);
 *                          fallback: META_SYSTEM_USER_TOKEN
 *   META_TEST_EVENT_CODE — opcjonalny kod „Test Events" do walidacji w Events Managerze
 */

import crypto from 'node:crypto';

const GRAPH = 'https://graph.facebook.com/v21.0';
const ALLOWED_EVENTS = new Set(['InitiateCheckout', 'Lead', 'CompleteRegistration']);

const sha256 = (v) =>
    crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');

const clientIp = (req) =>
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    undefined;

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metoda nieobsługiwana' });

    const {
        META_PIXEL_ID,
        META_CAPI_TOKEN,
        META_SYSTEM_USER_TOKEN,
        META_TEST_EVENT_CODE,
    } = process.env;
    const token = META_CAPI_TOKEN || META_SYSTEM_USER_TOKEN;

    // Brak konfiguracji → cichy no-op (200), żeby fire-and-forget z klienta nie sypał błędami.
    if (!META_PIXEL_ID || !token) {
        console.error('meta-capi: brak META_PIXEL_ID lub tokenu — pomijam.');
        return res.status(200).json({ ok: false, skipped: 'not_configured' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const eventName = String(body.event_name ?? '').trim();
    if (!ALLOWED_EVENTS.has(eventName)) {
        return res.status(400).json({ error: 'Nieobsługiwany event_name' });
    }

    const eventId = String(body.event_id ?? '').slice(0, 100) || undefined;
    const eventSourceUrl = String(body.event_source_url ?? '').slice(0, 500) || undefined;
    const contentName = String(body.content_name ?? 'mikro-audyt-ai').slice(0, 80);

    const userData = {
        client_ip_address: clientIp(req),
        client_user_agent: req.headers['user-agent'],
    };
    if (body.fbp) userData.fbp = String(body.fbp).slice(0, 200);
    if (body.fbc) userData.fbc = String(body.fbc).slice(0, 200);
    // Email tylko dla Lead — zhashowany, nigdy w plaintext.
    if (body.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())) {
        userData.em = [sha256(body.email)];
    }

    const event = {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_source_url: eventSourceUrl,
        event_id: eventId,
        user_data: userData,
        custom_data: { content_name: contentName },
    };

    const payload = { data: [event] };
    if (META_TEST_EVENT_CODE) payload.test_event_code = META_TEST_EVENT_CODE;

    try {
        const r = await fetch(
            `${GRAPH}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }
        );
        const json = await r.json().catch(() => ({}));
        if (!r.ok) {
            console.error('meta-capi: Graph error', r.status, JSON.stringify(json).slice(0, 500));
            return res.status(200).json({ ok: false, error: 'graph_error' });
        }
        return res.status(200).json({ ok: true, events_received: json.events_received ?? null });
    } catch (err) {
        console.error('meta-capi: fetch failed', err?.message);
        return res.status(200).json({ ok: false, error: 'fetch_failed' });
    }
}
