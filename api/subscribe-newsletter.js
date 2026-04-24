import { Resend } from 'resend';
import { signToken } from './_lib/doi.js';

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Metoda nieobsługiwana' });
    }

    const {
        RESEND_API_KEY,
        RESEND_FROM_EMAIL = 'kontakt@workshift.pl',
        RESEND_FROM_NAME = 'Workshift',
        RESEND_DOI_SECRET,
        RESEND_AUDIENCE_MAIN,
        RESEND_CONFIRM_URL = 'https://workshift.pl/api/confirm-newsletter',
    } = process.env;

    if (!RESEND_API_KEY || !RESEND_DOI_SECRET || !RESEND_AUDIENCE_MAIN) {
        console.error('subscribe-newsletter: missing required env vars');
        return res.status(500).json({ error: 'Serwer niedostępny.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const email = String(body.email ?? '').trim();
    const name = String(body.name ?? '').trim().slice(0, 100);

    if (!email || !name) {
        return res.status(400).json({ error: 'Brakuje wymaganych danych.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Niepoprawny adres e-mail.' });
    }
    if (name.length < 2) {
        return res.status(400).json({ error: 'Podaj swoje imię.' });
    }

    // listId kept for backwards-compat with the existing frontend payload.
    // Every listId maps to the main audience for now — extend when you add more.
    const audienceId = RESEND_AUDIENCE_MAIN;

    const token = signToken(
        { email, name, audience_id: audienceId, exp: Math.floor(Date.now() / 1000) + 86400 },
        RESEND_DOI_SECRET,
    );
    const confirmUrl = `${RESEND_CONFIRM_URL}?t=${encodeURIComponent(token)}`;
    const nameHtml = escapeHtml(name);

    const html = `<!DOCTYPE html>
<html lang="pl"><body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f4f4f0;padding:32px;color:#111;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;padding:40px;border:1px solid rgba(0,0,0,0.08);">
    <h1 style="font-size:24px;margin:0 0 16px;">Potwierdź zapis do newslettera</h1>
    <p style="font-size:16px;line-height:1.5;margin:0 0 24px;">
      Cześć ${nameHtml}, dziękujemy za chęć dołączenia do "AI Praktycznie".
      Kliknij poniższy przycisk, aby potwierdzić swój adres e-mail — bez tego nie wyślemy Ci ani jednej wiadomości.
    </p>
    <p style="margin:0 0 32px;">
      <a href="${confirmUrl}" style="display:inline-block;background:#111;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
        Potwierdzam zapis
      </a>
    </p>
    <p style="font-size:13px;color:#666;line-height:1.5;margin:0 0 8px;">
      Link wygasa za 24 godziny. Jeśli to nie Ty zapisałeś/aś się do newslettera — zignoruj tę wiadomość.
    </p>
    <p style="font-size:13px;color:#666;line-height:1.5;margin:0;">
      Gdyby przycisk nie działał, wklej ten link w przeglądarkę:<br>
      <span style="word-break:break-all;">${confirmUrl}</span>
    </p>
  </div>
  <p style="text-align:center;font-size:12px;color:#999;margin-top:24px;">Workshift · workshift.pl</p>
</body></html>`;

    const resend = new Resend(RESEND_API_KEY);

    try {
        const { error } = await resend.emails.send(
            {
                from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                to: [email],
                subject: 'Potwierdź zapis do newslettera Workshift',
                html,
            },
            { idempotencyKey: `newsletter-doi/${email}` },
        );

        if (error) {
            console.error('Resend error (subscribe):', error);
            return res.status(500).json({ error: 'Nie udało się wysłać potwierdzenia. Spróbuj ponownie.' });
        }

        return res.status(200).json({
            success: true,
            message: 'Wysłaliśmy link potwierdzający na Twój adres e-mail.',
        });
    } catch (err) {
        console.error('subscribe-newsletter fatal:', err);
        return res.status(500).json({ error: 'Nie udało się wysłać potwierdzenia. Spróbuj ponownie.' });
    }
}
