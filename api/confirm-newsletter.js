import { Resend } from 'resend';
import { verifyToken } from './_lib/doi.js';
import { buildWelcomeEmail, buildWelcomeText } from './_lib/welcomeEmail.js';
import { blogPosts } from '../src/data/blogPosts.js';

const errorPage = (title, body, status = 400) => ({
    status,
    html: `<!doctype html><html lang="pl"><head><meta charset="utf-8">
<title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#f4f4f0;margin:0;padding:48px 16px;color:#111;}
.card{max-width:520px;margin:0 auto;background:#fff;border:1px solid rgba(0,0,0,0.08);border-radius:10px;padding:40px;}
h1{font-size:24px;margin:0 0 12px;}p{font-size:15px;line-height:1.55;color:#444;margin:0 0 12px;}a{color:#111;}</style>
</head><body><div class="card"><h1>${title}</h1><p>${body}</p>
<p><a href="https://workshift.pl/">← Wróć na stronę</a></p></div></body></html>`,
});

export default async function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');

    const {
        RESEND_API_KEY,
        RESEND_DOI_SECRET,
        RESEND_DOI_REDIRECT_URL = 'https://workshift.pl/thank-you',
    } = process.env;

    if (!RESEND_API_KEY || !RESEND_DOI_SECRET) {
        console.error('confirm-newsletter: missing required env vars');
        const page = errorPage('Błąd konfiguracji', 'Serwer nie jest poprawnie skonfigurowany. Napisz na kontakt@workshift.pl.', 500);
        return res.status(page.status).send(page.html);
    }

    const token = typeof req.query?.t === 'string' ? req.query.t : '';
    const payload = verifyToken(token, RESEND_DOI_SECRET);

    if (!payload) {
        const page = errorPage(
            'Link nieważny lub wygasł',
            'Nie udało się zweryfikować linku potwierdzającego (upłynęły 24 godziny albo link jest uszkodzony). Zapisz się ponownie na <a href="https://workshift.pl/#newsletter">workshift.pl</a>.',
        );
        return res.status(page.status).send(page.html);
    }

    const { email, name = '', audience_id: audienceId } = payload;
    if (!email || !audienceId) {
        const page = errorPage('Link uszkodzony', 'Treść linku jest nieczytelna. Zapisz się jeszcze raz.');
        return res.status(page.status).send(page.html);
    }

    const [firstName = '', lastName = ''] = String(name).split(' ');
    const resend = new Resend(RESEND_API_KEY);
    const {
        RESEND_FROM_EMAIL = 'kontakt@workshift.pl',
        RESEND_NEWSLETTER_FROM_NAME = 'Jakub Bednarz',
    } = process.env;

    try {
        const { error } = await resend.contacts.create({
            email,
            firstName,
            lastName,
            unsubscribed: false,
            audienceId,
        });

        // Resend returns a 422-ish error when the contact already exists —
        // treat double-clicks as idempotent success.
        const alreadyExists = error && (error.statusCode === 422 || /exists/i.test(error.message || ''));
        if (error && !alreadyExists) {
            console.error('Resend error (confirm):', error);
            const page = errorPage('Chwilowy problem', 'Nie mogliśmy zakończyć zapisu. Odśwież tę stronę za minutę lub napisz na kontakt@workshift.pl.', 500);
            return res.status(page.status).send(page.html);
        }

        // Welcome email — wysyłamy tylko gdy user był nowy (alreadyExists = false).
        // Idempotency-Key chroni przed duplikatem gdy user kliknie DOI link 2x.
        // Nie failujemy całego flow gdy wysyłka padnie — user już jest w audience.
        if (!alreadyExists) {
            try {
                const latestPosts = blogPosts.slice(0, 3);
                const html = buildWelcomeEmail({ firstName, posts: latestPosts });
                const text = buildWelcomeText({ firstName, posts: latestPosts });

                await resend.emails.send(
                    {
                        from: `${RESEND_NEWSLETTER_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                        to: [email],
                        replyTo: 'kontakt@workshift.pl',
                        subject: 'Dzięki za zapis. Trzy artykuły na dobry start',
                        html,
                        text,
                    },
                    { idempotencyKey: `welcome/${email}` },
                );
            } catch (welcomeErr) {
                // Loguj jako warning — non-fatal. User dostał zapis, mail welcome
                // można re-trigger ręcznie z Resend dashboard jeśli się nie udał.
                console.warn('confirm-newsletter: welcome email failed', { email, err: welcomeErr?.message });
            }
        }

        res.setHeader('Location', RESEND_DOI_REDIRECT_URL);
        return res.status(302).end();
    } catch (err) {
        console.error('confirm-newsletter fatal:', err);
        const page = errorPage('Chwilowy problem', 'Nie mogliśmy zakończyć zapisu. Odśwież tę stronę za minutę.', 500);
        return res.status(page.status).send(page.html);
    }
}
