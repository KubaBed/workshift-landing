import { Resend } from 'resend';
import crypto from 'node:crypto';

/**
 * Meta CAPI Lead — server-side, wysokiej jakości match (mamy email → SHA-256).
 * Odpala się TYLKO gdy klient przekaże marketingConsent=true (RODO). Fire-and-forget
 * z perspektywy UX: błąd logujemy, ale nie psujemy wysyłki maila. `eventId` wspólny
 * z pixelem klienta → Meta deduplikuje. Bez konfiguracji (env) → cichy no-op.
 */
async function fireLeadCapi({ email, mode, tracking, eventId, req }) {
    const {
        META_PIXEL_ID,
        META_CAPI_TOKEN,
        META_SYSTEM_USER_TOKEN,
        META_TEST_EVENT_CODE,
    } = process.env;
    const token = META_CAPI_TOKEN || META_SYSTEM_USER_TOKEN;
    if (!META_PIXEL_ID || !token) return;

    const sha256 = (v) => crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || undefined;
    const fbclid = tracking?.fbclid ? String(tracking.fbclid).slice(0, 200) : undefined;

    const userData = { em: [sha256(email)] };
    if (ip) userData.client_ip_address = ip;
    if (req.headers['user-agent']) userData.client_user_agent = req.headers['user-agent'];
    if (fbclid) userData.fbc = `fb.1.${Date.now()}.${fbclid}`;

    const payload = {
        data: [{
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            event_source_url: req.headers.referer || 'https://workshift.pl/audyt-ai',
            event_id: eventId || undefined,
            user_data: userData,
            custom_data: { content_name: 'audyt-' + mode },
        }],
    };
    if (META_TEST_EVENT_CODE) payload.test_event_code = META_TEST_EVENT_CODE;

    try {
        const r = await fetch(
            `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
        );
        if (!r.ok) {
            const j = await r.json().catch(() => ({}));
            console.error('audyt-submit CAPI Lead error:', r.status, JSON.stringify(j).slice(0, 400));
        }
    } catch (err) {
        console.error('audyt-submit CAPI Lead fetch failed:', err?.message);
    }
}

/**
 * Mikro-audyt AI - odbiór wyniku quizu z /audyt-ai.
 *
 * Wysyła DWA maile:
 *  1. Do leada - jego wynik + interpretacja + 3 rekomendacje (transakcyjny:
 *     user sam poprosił o wynik, więc to nie marketing → bez DOI).
 *  2. Do Kuby (RESEND_CONTACT_TO) - notyfikacja z progiem (🔴/🟡/🟢), żeby
 *     wiedział, jak szybko oddzwonić. Czerwony = priorytet.
 *
 * NIE dopisuje do newslettera (audience) - to robi osobny flow DOI
 * (/api/subscribe-newsletter), żeby zachować zgodę RODO.
 */

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const TIER_LABEL = {
    green: '🟢 Działasz sprawnie',
    yellow: '🟡 Widać potencjał',
    red: '🔴 Pilna potrzeba',
};

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metoda nieobsługiwana' });
    }

    const {
        RESEND_API_KEY,
        RESEND_FROM_EMAIL = 'kontakt@workshift.pl',
        RESEND_FROM_NAME = 'Workshift',
        RESEND_CONTACT_TO = 'kontakt@workshift.pl',
    } = process.env;

    if (!RESEND_API_KEY) {
        console.error('audyt-submit: RESEND_API_KEY not configured');
        return res.status(500).json({ error: 'Serwer pocztowy niedostępny.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = String(body.email ?? '').trim();
    const branza = String(body.branza ?? '').trim().slice(0, 60);
    const wielkosc = String(body.wielkosc ?? '').trim().slice(0, 60);
    const score = Number.isFinite(+body.score) ? Math.max(0, Math.min(36, +body.score)) : null;
    const tier = ['green', 'yellow', 'red'].includes(body.tier) ? body.tier : null;
    const mode = String(body.mode ?? 'result').slice(0, 20);
    const recommendations = Array.isArray(body.recommendations)
        ? body.recommendations.slice(0, 5).map((r) => String(r).slice(0, 240))
        : [];

    // Zgoda RODO - ślad audytowy. Znacznik czasu stawia serwer (wiarygodniejszy
    // niż czas z klienta). Front bramkuje wysyłkę checkboxem; walidujemy też tutaj.
    const consentGiven = body.consent === true;
    const consentText = String(body.consentText ?? '').trim().slice(0, 300);
    const consentPolicyUrl = String(body.consentPolicyUrl ?? '').trim().slice(0, 200);
    const consentAt = new Date().toISOString();

    // Atrybucja: fbclid + utm_* z reklamy (żeby wiedzieć który kreatyw/hook dał leada).
    const tracking = (body.tracking && typeof body.tracking === 'object') ? body.tracking : {};
    const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
    const trackingHtml = trackingKeys
        .filter((k) => tracking[k])
        .map((k) => `<p><strong>${k}:</strong> ${escapeHtml(String(tracking[k]).slice(0, 200))}</p>`)
        .join('') || '<p>(brak parametrów - ruch bezpośredni / organiczny)</p>';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Nieprawidłowy adres e-mail.' });
    }
    if (score == null || !tier) {
        return res.status(400).json({ error: 'Brak danych wyniku audytu.' });
    }
    if (!consentGiven) {
        return res.status(400).json({ error: 'Brak zgody na przetwarzanie danych osobowych.' });
    }

    const resend = new Resend(RESEND_API_KEY);
    const recsHtml = recommendations.length
        ? `<ul>${recommendations.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`
        : '<p>(brak - Twój wynik nie wskazał krytycznych obszarów)</p>';

    const notifyRecipients = RESEND_CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean);

    try {
        // 1) Mail do leada (transakcyjny - jego własny wynik).
        const leadEmail = resend.emails.send(
            {
                from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                to: [email],
                replyTo: RESEND_FROM_EMAIL,
                subject: `Twój wynik mikro-audytu AI: ${score}/36 - ${TIER_LABEL[tier]}`,
                html: `
                    <h2>Twój wynik mikro-audytu AI</h2>
                    <p style="font-size:28px;font-weight:bold;margin:8px 0">${score} / 36 &nbsp; ${TIER_LABEL[tier]}</p>
                    <p>Dziękuję za wypełnienie audytu. Poniżej 3 rekomendacje dopasowane do Twoich odpowiedzi:</p>
                    ${recsHtml}
                    <hr />
                    <p>Jeśli chcesz rozpisać to na konkretny plan wdrożenia z wyceną i ROI - odpisz na tego maila albo zadzwoń: <strong>+48 796 186 067</strong>.</p>
                    <p>Pozdrawiam,<br/>Jakub Bednarz - Workshift</p>
                `,
            },
            { idempotencyKey: `audyt-lead/${email}/${Date.now().toString().slice(0, -5)}` },
        );

        // 2) Notyfikacja do Kuby - z progiem dla priorytetyzacji.
        const notifyEmail = resend.emails.send(
            {
                from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                to: notifyRecipients,
                replyTo: email,
                subject: `[Audyt AI] ${TIER_LABEL[tier]} - ${score}/36 - ${branza || 'brak branży'}`,
                html: `
                    <h3>Nowy lead z mikro-audytu AI</h3>
                    <p><strong>Próg:</strong> ${TIER_LABEL[tier]}</p>
                    <p><strong>Wynik:</strong> ${score}/36</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Branża:</strong> ${escapeHtml(branza || 'brak')}</p>
                    <p><strong>Wielkość:</strong> ${escapeHtml(wielkosc || 'brak')}</p>
                    <p><strong>Tryb CTA:</strong> ${escapeHtml(mode)}</p>
                    <hr />
                    <p><strong>Zgoda RODO:</strong> ✅ zaakceptowana</p>
                    <p><strong>Data zgody (serwer):</strong> ${escapeHtml(consentAt)}</p>
                    ${consentText ? `<p><strong>Treść zgody:</strong> ${escapeHtml(consentText)}</p>` : ''}
                    ${consentPolicyUrl ? `<p><strong>Polityka:</strong> ${escapeHtml(consentPolicyUrl)}</p>` : ''}
                    <hr />
                    <p><strong>Atrybucja (skąd lead):</strong></p>
                    ${trackingHtml}
                    <hr />
                    <p><strong>Rekomendacje pokazane:</strong></p>
                    ${recsHtml}
                `,
            },
            { idempotencyKey: `audyt-notify/${email}/${Date.now().toString().slice(0, -5)}` },
        );

        const [leadRes, notifyRes] = await Promise.all([leadEmail, notifyEmail]);

        if (leadRes.error || notifyRes.error) {
            console.error('audyt-submit Resend error:', leadRes.error || notifyRes.error);
            return res.status(500).json({ error: 'Nie udało się wysłać. Spróbuj ponownie lub zadzwoń: +48 796 186 067.' });
        }

        // Meta CAPI Lead — server-side, tylko za zgodą marketingową (RODO). Awaitujemy,
        // żeby funkcja serverless nie zakończyła się przed dolotem żądania do Grapha;
        // helper sam łapie błędy, więc nie zablokuje odpowiedzi sukcesu.
        if (body.marketingConsent === true) {
            await fireLeadCapi({ email, mode, tracking, eventId: body.leadEventId, req });
        }

        console.log('audyt-submit ok', { tier, score, branza, consentAt, leadId: leadRes.data?.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('audyt-submit fatal:', err);
        return res.status(500).json({ error: 'Nie udało się wysłać. Spróbuj ponownie lub zadzwoń: +48 796 186 067.' });
    }
}
