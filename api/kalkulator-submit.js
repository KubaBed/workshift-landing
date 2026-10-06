import { Resend } from 'resend';
import crypto from 'node:crypto';
import {
    BRANZE,
    ZESPOLY,
    KOSZTY,
    REKOMENDACJE,
    RECOVERY_RATE,
    computeKalkulator,
    kalkulatorAssumptions,
} from '../src/data/kalkulator.js';

/**
 * Kalkulator strat czasowych - wysyłka wyniku z /kalkulator na e-mail.
 *
 * Wzorowane na api/audyt-submit.js. Wysyła DWA maile:
 *  1. Do użytkownika - jego wynik, założenia wyliczenia nazwane wprost
 *     i 3 procesy dla branży (transakcyjny: sam poprosił o wynik → bez DOI).
 *  2. Do Kuby (RESEND_NOTIFY_TO, fallback RESEND_CONTACT_TO) - notyfikacja.
 *
 * Wynik liczymy ponownie po stronie serwera tym samym wzorem co front
 * (computeKalkulator z src/data/kalkulator.js), więc w mailu nie da się
 * podstawić dowolnych liczb. Wynik z frontu trafia tylko do notyfikacji,
 * gdy się różni (diagnostyka).
 *
 * NIE dopisuje do newslettera.
 */

/**
 * Meta CAPI Lead - jak w audyt-submit: TYLKO gdy klient przekaże
 * marketingConsent=true (RODO). Błąd logujemy, nie psujemy wysyłki maila.
 * `eventId` wspólny z pixelem klienta → Meta deduplikuje. Bez env → no-op.
 */
async function fireLeadCapi({ email, tracking, eventId, req }) {
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
            event_source_url: req.headers.referer || 'https://workshift.pl/kalkulator',
            event_id: eventId || undefined,
            user_data: userData,
            custom_data: { content_name: 'kalkulator' },
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
            console.error('kalkulator-submit CAPI Lead error:', r.status, JSON.stringify(j).slice(0, 400));
        }
    } catch (err) {
        console.error('kalkulator-submit CAPI Lead fetch failed:', err?.message);
    }
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const formatPLN = (n) => new Intl.NumberFormat('pl-PL').format(n) + ' PLN';
const CONSULT_URL = 'https://www.workshift.pl/#kontakt';
const SEND_ERROR = 'Nie udało się wysłać wyniku. Spróbuj ponownie albo napisz na kontakt@workshift.pl.';

// Liczba całkowita w zakresie suwaka; poza zakresem → null (odrzucamy request).
function intInRange(v, min, max) {
    const n = Number(v);
    if (!Number.isInteger(n) || n < min || n > max) return null;
    return n;
}

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metoda nieobsługiwana' });
    }

    const {
        RESEND_API_KEY,
        RESEND_FROM_EMAIL = 'kontakt@workshift.pl',
        RESEND_FROM_NAME = 'Workshift',
        RESEND_NOTIFY_TO,
        RESEND_CONTACT_TO,
    } = process.env;
    const notifyTo = RESEND_NOTIFY_TO || RESEND_CONTACT_TO || 'kontakt@workshift.pl';

    if (!RESEND_API_KEY) {
        console.error('kalkulator-submit: RESEND_API_KEY not configured');
        return res.status(500).json({ error: SEND_ERROR });
    }

    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    } catch {
        return res.status(400).json({ error: 'Nieprawidłowe dane.' });
    }

    const email = String(body.email ?? '').trim();
    const branza = BRANZE.find((b) => b.id === body.branza) || null;
    const zespol = ZESPOLY.find((z) => z.id === Number(body.zespol)) || null;
    const godzinyTyg = intInRange(body.godzinyTyg, 1, 30);
    const dniRaportow = intInRange(body.dniRaportow, 0, 20);
    const koszt = KOSZTY.find((k) => k.value === Number(body.kosztH)) || null;

    // Zgoda RODO - ślad audytowy (jak w audyt-submit). Znacznik czasu stawia serwer.
    const consentGiven = body.consent === true;
    const consentText = String(body.consentText ?? '').trim().slice(0, 300);
    const consentPolicyUrl = String(body.consentPolicyUrl ?? '').trim().slice(0, 200);
    const consentAt = new Date().toISOString();

    const tracking = (body.tracking && typeof body.tracking === 'object') ? body.tracking : {};
    const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];
    const trackingHtml = trackingKeys
        .filter((k) => tracking[k])
        .map((k) => `<p><strong>${k}:</strong> ${escapeHtml(String(tracking[k]).slice(0, 200))}</p>`)
        .join('') || '<p>(brak parametrów - ruch bezpośredni / organiczny)</p>';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        return res.status(400).json({ error: 'Nieprawidłowy adres e-mail.' });
    }
    if (!branza || !zespol || godzinyTyg == null || dniRaportow == null || !koszt) {
        return res.status(400).json({ error: 'Brak danych wyniku kalkulatora.' });
    }
    if (!consentGiven) {
        return res.status(400).json({ error: 'Brak zgody na przetwarzanie danych osobowych.' });
    }

    const wynik = computeKalkulator({ zespol: zespol.id, godzinyTyg, dniRaportow, kosztH: koszt.value });
    const godziny = Math.round(wynik.godzinyMies);
    const recoveryPct = Math.round(RECOVERY_RATE * 100);
    const assumptions = kalkulatorAssumptions(zespol.id);
    const rekomendacje = REKOMENDACJE[branza.id] || REKOMENDACJE.inne;

    // Wynik z frontu - tylko do diagnostyki, gdy różni się od serwerowego.
    const front = (body.wynik && typeof body.wynik === 'object') ? body.wynik : {};
    const mismatch = ['kosztMies', 'kosztRok', 'odzyskMies', 'odzyskKwoteMies', 'odzyskKwoteRok']
        .filter((k) => front[k] != null && Number(front[k]) !== wynik[k])
        .concat(front.godzinyMies != null && Number(front.godzinyMies) !== godziny ? ['godzinyMies'] : []);

    const listHtml = (items) => `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
    const answersHtml = listHtml([
        `Branża: ${branza.label}`,
        `Wielkość zespołu: ${zespol.label}`,
        `Godziny tygodniowo na osobę na powtarzalnych zadaniach: ${godzinyTyg} h`,
        `Dni w miesiącu na raporty (cały zespół): ${dniRaportow}`,
        `Koszt godziny pracy: ${koszt.label}`,
    ]);

    const resend = new Resend(RESEND_API_KEY);
    const notifyRecipients = notifyTo.split(',').map((s) => s.trim()).filter(Boolean);
    const keySuffix = `${email}/${Date.now().toString().slice(0, -5)}`;

    try {
        // 1) Mail do użytkownika (transakcyjny - jego własny wynik).
        const userEmail = resend.emails.send(
            {
                from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                to: [email],
                replyTo: RESEND_FROM_EMAIL,
                subject: `Twój wynik z kalkulatora: ok. ${godziny} h miesięcznie na powtarzalnych zadaniach`,
                html: `
                    <h2>Twój wynik z kalkulatora Workshift</h2>
                    <p style="font-size:28px;font-weight:bold;margin:8px 0">ok. ${godziny} h miesięcznie</p>
                    <p>Tyle czasu, według Twoich odpowiedzi, zespół spędza na powtarzalnych zadaniach. To ok. <strong>${formatPLN(wynik.kosztMies)} miesięcznie</strong> (<strong>${formatPLN(wynik.kosztRok)} rocznie</strong>) kosztu pracy przy stawce ${escapeHtml(koszt.label)}.</p>
                    <p>Przy założeniu, że da się odzyskać ${recoveryPct}% tych godzin: ok. <strong>${wynik.odzyskMies} h</strong> i <strong>${formatPLN(wynik.odzyskKwoteMies)} miesięcznie</strong> (${formatPLN(wynik.odzyskKwoteRok)} rocznie).</p>
                    <h3>Twoje odpowiedzi</h3>
                    ${answersHtml}
                    <h3>Założenia wyliczenia</h3>
                    ${listHtml(assumptions)}
                    <p>To szacunek oparty na powyższych założeniach. Realny wynik policzymy na Twoich procesach.</p>
                    <h3>3 procesy do sprawdzenia w Twojej branży</h3>
                    ${listHtml(rekomendacje)}
                    <hr />
                    <p>Jeśli chcesz sprawdzić, które z tych godzin da się odzyskać w Twojej firmie, odpisz na tę wiadomość albo napisz przez formularz: <a href="${CONSULT_URL}">${CONSULT_URL}</a>. Zaproponujemy termin bezpłatnej 30-minutowej rozmowy diagnostycznej.</p>
                    <p>Pozdrawiam,<br/>Jakub Bednarz, Workshift</p>
                `,
            },
            { idempotencyKey: `kalkulator-lead/${keySuffix}` },
        );

        // 2) Notyfikacja do Kuby.
        const notifyEmail = resend.emails.send(
            {
                from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                to: notifyRecipients,
                replyTo: email,
                subject: `[Kalkulator] ${godziny} h/mies., ${formatPLN(wynik.kosztRok)}/rok - ${branza.label}`,
                html: `
                    <h3>Nowy lead z kalkulatora strat czasowych</h3>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    ${answersHtml}
                    <p><strong>Wynik:</strong> ${godziny} h/mies., ${formatPLN(wynik.kosztMies)}/mies., ${formatPLN(wynik.kosztRok)}/rok</p>
                    <p><strong>Odzysk (${recoveryPct}%):</strong> ${wynik.odzyskMies} h, ${formatPLN(wynik.odzyskKwoteMies)}/mies., ${formatPLN(wynik.odzyskKwoteRok)}/rok</p>
                    ${mismatch.length ? `<p><strong>Uwaga:</strong> wynik z przeglądarki różni się od serwerowego (${escapeHtml(mismatch.join(', '))}). W mailu do leada poszedł serwerowy.</p>` : ''}
                    <hr />
                    <p><strong>Zgoda RODO:</strong> zaakceptowana</p>
                    <p><strong>Data zgody (serwer):</strong> ${escapeHtml(consentAt)}</p>
                    ${consentText ? `<p><strong>Treść zgody:</strong> ${escapeHtml(consentText)}</p>` : ''}
                    ${consentPolicyUrl ? `<p><strong>Polityka:</strong> ${escapeHtml(consentPolicyUrl)}</p>` : ''}
                    <hr />
                    <p><strong>Atrybucja (skąd lead):</strong></p>
                    ${trackingHtml}
                `,
            },
            { idempotencyKey: `kalkulator-notify/${keySuffix}` },
        );

        const [userRes, notifyRes] = await Promise.all([userEmail, notifyEmail]);

        if (userRes.error || notifyRes.error) {
            console.error('kalkulator-submit Resend error:', userRes.error || notifyRes.error);
            return res.status(500).json({ error: SEND_ERROR });
        }

        if (body.marketingConsent === true) {
            await fireLeadCapi({ email, tracking, eventId: body.leadEventId, req });
        }

        console.log('kalkulator-submit ok', { branza: branza.id, zespol: zespol.id, godziny, consentAt, mismatch, leadId: userRes.data?.id });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('kalkulator-submit fatal:', err);
        return res.status(500).json({ error: SEND_ERROR });
    }
}
