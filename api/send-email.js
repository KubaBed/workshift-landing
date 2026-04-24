import { Resend } from 'resend';

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
        RESEND_CONTACT_TO = 'kontakt@workshift.pl',
    } = process.env;

    if (!RESEND_API_KEY) {
        console.error('send-email: RESEND_API_KEY not configured');
        return res.status(500).json({ error: 'Serwer pocztowy niedostępny.' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const name = String(body.name ?? '').trim().slice(0, 100);
    const email = String(body.email ?? '').trim();
    const company = String(body.company ?? '').trim().slice(0, 200);
    const message = String(body.message ?? '').trim().slice(0, 5000);

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Brakuje wymaganych pól (imię, email, wiadomość).' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Nieprawidłowy adres e-mail.' });
    }
    if (name.length < 2 || message.length < 10) {
        return res.status(400).json({ error: 'Imię (min. 2 znaki) i wiadomość (min. 10 znaków) są wymagane.' });
    }

    const resend = new Resend(RESEND_API_KEY);
    const companyDisplay = company || 'brak';

    try {
        const { error } = await resend.emails.send(
            {
                from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                to: [RESEND_CONTACT_TO],
                replyTo: email,
                subject: `Nowe zapytanie ze strony: ${name}${company ? ` (Firma: ${company})` : ''}`,
                html: `<h3>Nowa wiadomość z formularza kontaktowego Workshift</h3>
                       <p><strong>Imię:</strong> ${escapeHtml(name)}</p>
                       <p><strong>Email klienta:</strong> ${escapeHtml(email)}</p>
                       <p><strong>Firma:</strong> ${escapeHtml(companyDisplay)}</p>
                       <hr />
                       <p><strong>Wiadomość:</strong></p>
                       <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
            },
            { idempotencyKey: `contact-form/${email}/${Date.now().toString().slice(0, -5)}` },
        );

        if (error) {
            console.error('Resend error (contact):', error);
            return res.status(500).json({ error: 'Wystąpił błąd przy wysyłaniu. Spróbuj ponownie lub napisz na kontakt@workshift.pl.' });
        }

        return res.status(200).json({ success: true, message: 'Otrzymaliśmy zapytanie. Dziękujemy!' });
    } catch (err) {
        console.error('send-email fatal:', err);
        return res.status(500).json({ error: 'Wystąpił błąd przy wysyłaniu. Spróbuj ponownie lub napisz na kontakt@workshift.pl.' });
    }
}
