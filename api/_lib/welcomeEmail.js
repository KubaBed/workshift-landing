/**
 * Welcome email template po DOI confirmation.
 *
 * Layout: table-based (Outlook compat), inline styles only, system fonts,
 * absolute URLs dla obrazków. Max-width 600px = standard email.
 *
 * Brand:
 *   sage  #E6E8DD  (background)
 *   lime  #9CE069  (accent)
 *   black #111111  (primary text)
 *   muted #6b7280  (secondary text)
 */

const SITE_URL = 'https://www.workshift.pl';

const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/**
 * Konwertuje relative URL do absolute (`/images/x.png` → `https://...`).
 * Jeśli URL już absolute (https://, http://) — zostawia bez zmian.
 */
const absoluteUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//.test(url)) return url;
    return `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const formatDate = (iso) => {
    try {
        return new Date(iso).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
        return iso;
    }
};

/**
 * Buduje pojedyńczy "article card" w tabeli.
 * Każdy post = osobny <table>, żeby Outlook nie skleił ich razem.
 */
function articleCard(post) {
    const url = `${SITE_URL}/blog/${post.slug}`;
    const img = absoluteUrl(post.image);
    return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px;background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:10px;overflow:hidden;">
    <tr>
        <td style="padding:14px 14px 0;">
            <a href="${url}" style="text-decoration:none;color:inherit;display:block;">
                <img src="${img}" alt="${escapeHtml(post.title)}" width="572" style="display:block;width:100%;max-width:100%;height:auto;border:0;border-radius:6px;background:#f4f4f0;" />
            </a>
        </td>
    </tr>
    <tr>
        <td style="padding:14px 22px 22px;">
            <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">
                ${escapeHtml(post.category)} · ${formatDate(post.date)}
            </p>
            <h3 style="margin:0 0 10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:19px;line-height:1.3;font-weight:600;color:#111111;">
                <a href="${url}" style="color:#111111;text-decoration:none;">${escapeHtml(post.title)}</a>
            </h3>
            <p style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.55;color:#4b5563;">
                ${escapeHtml(post.excerpt)}
            </p>
            <a href="${url}" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:600;color:#111111;text-decoration:none;border-bottom:2px solid #9CE069;padding-bottom:1px;">
                Czytaj artykuł →
            </a>
        </td>
    </tr>
</table>`;
}

/**
 * Główny builder. Posts = array z 3 najnowszymi z blogPosts.js.
 */
export function buildWelcomeEmail({ firstName, posts }) {
    const greeting = firstName ? `Cześć ${escapeHtml(firstName)},` : 'Cześć,';
    const articlesHtml = posts.map(articleCard).join('\n');

    return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Witamy w Workshift</title>
</head>
<body style="margin:0;padding:0;background:#E6E8DD;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111111;">

<!-- Preheader (visible in inbox preview, not in email body) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#E6E8DD;">
    Cieszę się, że jesteś. Co dwa tygodnie - jedno narzędzie, jedna porada, krótki przegląd newsów.
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#E6E8DD;">
    <tr>
        <td align="center" style="padding:32px 16px;">

            <!-- Container 640px - lekko szerszy niż klasyczne 600px,
                 nadal bezpieczny dla wszystkich email clients (Litmus benchmark
                 do 680px). Daje więcej miejsca dla hero z większą sylwetką. -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width:640px;width:100%;">

                <!-- Header: logo wordmark -->
                <tr>
                    <td style="padding:0 0 28px;text-align:left;">
                        <a href="${SITE_URL}" style="text-decoration:none;color:#111111;">
                            <span style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:18px;font-weight:700;letter-spacing:-0.01em;color:#111111;">
                                Workshift<span style="color:#9CE069;">.</span>
                            </span>
                        </a>
                    </td>
                </tr>

                <!-- Personal welcome card — hero z dużym headingiem i sylwetką po prawej.
                     3D effect: heading rozciąga się do prawej krawędzi LEFT TD, photo
                     wchodzi w jego obszar przez negative margin-left (modern clients
                     pokazują overlap, Outlook desktop fallback bez overlap = nadal OK).
                     Transparent PNG = tekst widoczny przez "luki" wokół sylwetki. -->
                <tr>
                    <td style="background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:12px;padding:0;overflow:hidden;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                            <tr>
                                <!-- LEFT: tekst (55% = ~352px content) -->
                                <td valign="top" width="55%" style="padding:32px 0 32px 30px;">
                                    <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;font-weight:600;">
                                        Jakub Bednarz · Workshift
                                    </p>
                                    <h1 style="margin:0 0 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:44px;line-height:0.96;font-weight:800;letter-spacing:-0.025em;color:#111111;">
                                        Dzięki<br/>za&nbsp;zaufanie!
                                    </h1>
                                    <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:#1f2937;">
                                        ${greeting}
                                    </p>
                                    <p style="margin:0 0 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:#1f2937;">
                                        Cieszę się, że jesteś! <strong>"AI Praktycznie"</strong> to mój pomysł na to, jak rozmawiać o AI bez bełkotu - pokazując narzędzia i przykłady, które realnie odzyskują Twój czas w firmie.
                                    </p>
                                    <p style="margin:0 0 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.6;color:#1f2937;">
                                        Co dwa tygodnie będziesz dostawać jeden mail: krótki przegląd newsów, jedno praktyczne narzędzie + jedną poradę. Wszystko po to, żebyś mógł od razu przetestować tę wiedzę u siebie w praktyce.
                                    </p>
                                    <!-- Deliverability ask: subtle callout, lime border-left dla hierarchii bez krzykliwego boxa -->
                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#F4F4F0;border-left:3px solid #9CE069;border-radius:4px;">
                                        <tr>
                                            <td style="padding:14px 16px;">
                                                <p style="margin:0 0 4px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.5;color:#111111;font-weight:700;">
                                                    Ważna prośba na start
                                                </p>
                                                <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.55;color:#1f2937;">
                                                    Aby moje maile nie znikały w gąszczu spamu lub zakładce "Oferty", dodaj ten adres do swoich kontaktów lub przenieś tę wiadomość do folderu Głównego.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- P.S. — naturalny most do sekcji artykułów poniżej.
                                         Italic + muted color = postscript voice, nie konkuruje z callout-em -->
                                    <p style="margin:18px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;line-height:1.55;color:#6b7280;font-style:italic;">
                                        P.S. Poniżej trzy ostatnie wpisy z bloga - żeby było od czego zacząć.
                                    </p>
                                </td>
                                <!-- RIGHT: photo (45% = ~288px), valign bottom żeby
                                     sylwetka "stała" na dnie card-a. Photo 340px szerokie
                                     przesuwa się -60px w lewo (negative margin) -> wchodzi
                                     w obszar tekstu, daje 3D overlap effect. -->
                                <td valign="bottom" width="45%" align="right" style="padding:0;font-size:0;line-height:0;">
                                    <!--[if mso]>
                                    <img src="${SITE_URL}/jakub-bednarz-hero.png" alt="" width="280" style="display:block;width:280px;border:0;" />
                                    <![endif]-->
                                    <!--[if !mso]><!-->
                                    <img src="${SITE_URL}/jakub-bednarz-hero.png" alt="" width="340" style="display:block;width:340px;max-width:none;height:auto;border:0;margin-left:-60px;margin-bottom:-1px;" />
                                    <!--<![endif]-->
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <div style="height:32px;line-height:32px;">&nbsp;</div>

                <!-- Articles section — bez orphan label-a. Most do artykułów jest
                     w copy hero ("Poniżej trzy ostatnie wpisy..."). -->
                <tr>
                    <td style="padding:0;">
                        ${articlesHtml}
                    </td>
                </tr>

                <!-- CTA -->
                <tr>
                    <td style="padding:14px 0 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#111111;border-radius:12px;">
                            <tr>
                                <td style="padding:28px;text-align:center;">
                                    <h2 style="margin:0 0 8px;font-size:20px;line-height:1.3;font-weight:700;color:#ffffff;">
                                        Sprawdź, co możesz zautomatyzować u siebie
                                    </h2>
                                    <p style="margin:0 0 18px;font-size:14px;line-height:1.55;color:rgba(255,255,255,0.65);">
                                        30 minut bezpłatnej konsultacji - pokażemy 2-3 konkretne procesy, które AI może przejąć w Twojej firmie.
                                    </p>
                                    <a href="${SITE_URL}/#kontakt" style="display:inline-block;background:#9CE069;color:#111111;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;">
                                        Umów rozmowę
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td style="padding:32px 0 0;text-align:center;">
                        <p style="margin:0 0 6px;font-size:12px;color:#6b7280;line-height:1.5;">
                            Workshift &middot; Stawna 10/5, 61&#8209;759 Poznań
                        </p>
                        <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
                            <a href="${SITE_URL}" style="color:#6b7280;text-decoration:underline;">workshift.pl</a>
                            &nbsp;·&nbsp;
                            <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#6b7280;text-decoration:underline;">Wypisz się</a>
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>`;
}

/**
 * Plain-text fallback dla klientów bez HTML i lepszych anti-spam scores.
 */
export function buildWelcomeText({ firstName, posts }) {
    const greeting = firstName ? `Cześć ${firstName},` : 'Cześć,';
    const lines = [
        greeting,
        '',
        'Cieszę się, że jesteś! "AI Praktycznie" to mój pomysł na to, jak rozmawiać o AI bez bełkotu - pokazując narzędzia i przykłady, które realnie odzyskują Twój czas w firmie.',
        '',
        'Co dwa tygodnie będziesz dostawać jeden mail: krótki przegląd newsów, jedno praktyczne narzędzie + jedną poradę. Wszystko po to, żebyś mógł od razu przetestować tę wiedzę u siebie w praktyce.',
        '',
        '⚠️ WAŻNA PROŚBA NA START',
        'Aby moje maile nie znikały w gąszczu spamu lub zakładce "Oferty", dodaj ten adres do swoich kontaktów lub przenieś tę wiadomość do folderu Głównego.',
        '',
        'P.S. Poniżej trzy ostatnie wpisy z bloga - żeby było od czego zacząć.',
        '',
    ];
    posts.forEach((p, i) => {
        lines.push(`${i + 1}. ${p.title}`);
        lines.push(`   ${p.excerpt}`);
        lines.push(`   ${SITE_URL}/blog/${p.slug}`);
        lines.push('');
    });
    lines.push('Chcesz pogadać o automatyzacji w Twojej firmie?');
    lines.push(`${SITE_URL}/#kontakt`);
    lines.push('');
    lines.push('Jakub Bednarz · Workshift');
    lines.push('workshift.pl');
    lines.push('');
    lines.push('Wypisz się: {{{RESEND_UNSUBSCRIBE_URL}}}');
    return lines.join('\n');
}
