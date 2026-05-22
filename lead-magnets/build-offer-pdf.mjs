/**
 * PDF generator dla ofert klienckich — standalone, NIE wymaga dev servera.
 *
 * Czyta dane z api/_data/offers/<slug>.js, renderuje static HTML z inline'owanymi
 * stylami (sage / lime / Inter), drukuje przez Puppeteer do PDF.
 *
 * Usage:
 *   node lead-magnets/build-offer-pdf.mjs informax
 *
 * Output: offers-pdf/<slug>-<YYYY-MM-DD>.pdf (gitignored)
 *
 * Plik PDF zostaje LOKALNIE — żaden skrypt nie wysyła go nigdzie automatycznie.
 */

import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const slug = process.argv[2];
if (!slug) {
    console.error('Usage: node lead-magnets/build-offer-pdf.mjs <slug>');
    process.exit(1);
}

// HTML escape — wszystkie data wartości puszczamy przez to żeby nie wstrzyknąć
// znaczników (na wszelki wypadek — to dane wewnętrzne, ale hygiene).
function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderStats(stats) {
    return stats.map((s) => `
        <div class="stat">
            <div class="stat-bar"></div>
            <div class="stat-value">${esc(s.value)}</div>
            <div class="stat-label">${esc(s.label)}</div>
        </div>
    `).join('');
}

function renderProblems(problems) {
    return problems.map((p) => `
        <div class="problem ${p.selected ? 'is-selected' : ''}">
            <div class="problem-header">
                <span class="problem-label">${esc(p.label)}</span>
                ${p.selected ? '<span class="badge-pilot">PILOTAŻ</span>' : ''}
            </div>
            <h3>${esc(p.title)}</h3>
            <p class="problem-metric">${esc(p.metric)}</p>
            <p class="problem-body">${esc(p.body)}</p>
            <blockquote>${esc(p.quote)}</blockquote>
        </div>
    `).join('');
}

function renderReasons(reasons) {
    return reasons.map((r) => `<li><span class="check">✓</span> ${esc(r)}</li>`).join('');
}

function renderDeliverables(items) {
    return items.map((d) => `<li><span class="bullet">●</span> ${esc(d)}</li>`).join('');
}

function renderTimeline(timeline) {
    return timeline.map((t) => `
        <div class="timeline-row">
            <div class="timeline-period">${esc(t.period)}</div>
            <div class="timeline-content">
                <div class="timeline-label">${esc(t.label)}</div>
                <div class="timeline-desc">${esc(t.desc)}</div>
            </div>
        </div>
    `).join('');
}

function renderPricingRows(rows) {
    return rows.map((r) => `
        <tr>
            <td>
                <div class="row-label">${esc(r.label)}</div>
                <div class="row-note">${esc(r.note || '')}</div>
            </td>
            <td class="row-price">${esc(r.price)}</td>
        </tr>
    `).join('');
}

function renderNextSteps(steps) {
    return steps.map((s, i) => `
        <li>
            <span class="step-num">0${i + 1}</span>
            <span class="step-text">${esc(s)}</span>
        </li>
    `).join('');
}

function renderHTML(offer) {
    const clientShort = offer.client.name.replace(' Sp. z o.o.', '');
    return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>${esc(offer.meta.title)} — ${esc(clientShort)}</title>
<style>
    /* ─── Workshift design tokens ─── */
    :root {
        --color-bg: #FFFFFF;
        --color-sage: #E6E8DD;
        --color-lime: #9CE069;
        --color-black: #000000;
        --color-muted: #595959;
        --color-muted-light: #AAAAAA;
        --color-border: rgba(0,0,0,0.15);
        --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
    }

    @page {
        size: A4 portrait;
        margin: 12mm 10mm;
    }

    * { box-sizing: border-box; }

    body {
        font-family: var(--font-sans);
        font-size: 11pt;
        line-height: 1.5;
        color: var(--color-black);
        background: var(--color-bg);
        margin: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    .container {
        max-width: 190mm;
        margin: 0 auto;
    }

    /* ─── Section ─── */
    section {
        padding: 0 0 20mm;
        break-inside: avoid;
    }

    .label-mono {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        background: rgba(0,0,0,0.05);
        padding: 3pt 8pt;
        border-radius: 99px;
        display: inline-block;
        margin-bottom: 6mm;
    }

    h1, h2, h3, h4 { font-weight: 400; letter-spacing: -0.02em; margin: 0; }
    h1 { font-size: 32pt; line-height: 1.05; margin-bottom: 4mm; }
    h2 { font-size: 22pt; line-height: 1.1; margin-bottom: 6mm; }
    h3 { font-size: 14pt; line-height: 1.2; margin-bottom: 3mm; }

    /* ─── Hero ─── */
    .hero {
        padding-top: 4mm;
        padding-bottom: 14mm;
        border-bottom: none;
    }
    .hero-eyebrow {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        margin-bottom: 4mm;
    }
    .hero-subtitle {
        font-size: 13pt;
        color: var(--color-muted);
        max-width: 130mm;
        margin: 4mm 0 6mm;
    }
    .lime-divider {
        width: 14mm;
        height: 1px;
        background: var(--color-lime);
        margin: 3mm 0;
    }
    .hero-meta {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--color-muted);
    }

    /* ─── Stats grid ─── */
    .stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6mm;
    }
    .stat {
        border-top: 1px solid var(--color-border);
        padding-top: 3mm;
    }
    .stat-bar {
        width: 8mm;
        height: 1px;
        background: var(--color-lime);
        margin-bottom: 2mm;
    }
    .stat-value {
        font-size: 18pt;
        line-height: 1.1;
        margin-bottom: 2mm;
        letter-spacing: -0.02em;
    }
    .stat-label {
        font-size: 9pt;
        color: var(--color-muted);
        line-height: 1.35;
    }

    /* ─── Problems ─── */
    .problems {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5mm;
    }
    .problem {
        border: 1px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.6);
        border-radius: 4mm;
        padding: 6mm;
    }
    .problem.is-selected {
        border-color: var(--color-lime);
    }
    .problem-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 3mm;
    }
    .problem-label {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
    }
    .badge-pilot {
        font-family: var(--font-mono);
        font-size: 7pt;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        background: var(--color-lime);
        color: var(--color-black);
        padding: 2pt 6pt;
        border-radius: 99px;
    }
    .problem-metric {
        font-family: var(--font-mono);
        font-size: 10pt;
        margin: 0 0 3mm;
    }
    .problem-body {
        font-size: 10pt;
        color: var(--color-muted);
        line-height: 1.5;
        margin: 0 0 4mm;
    }
    blockquote {
        border-left: 2px solid var(--color-lime);
        padding-left: 4mm;
        font-style: italic;
        color: var(--color-muted);
        font-size: 10pt;
        margin: 0;
    }

    /* ─── Approach ─── */
    .approach ul {
        list-style: none;
        padding: 0;
        margin: 0 0 6mm;
        max-width: 160mm;
    }
    .approach li {
        display: flex;
        gap: 4mm;
        padding: 2mm 0;
        font-size: 12pt;
        line-height: 1.5;
    }
    .check {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 6mm;
        height: 6mm;
        background: var(--color-lime);
        border-radius: 99px;
        color: var(--color-black);
        font-weight: 700;
        font-size: 9pt;
        flex-shrink: 0;
        margin-top: 1mm;
    }
    .callout {
        border-left: 3px solid var(--color-lime);
        padding-left: 5mm;
        font-style: italic;
        color: var(--color-muted);
        font-size: 11pt;
        max-width: 160mm;
    }

    /* ─── Phase (pilot / asysta) ─── */
    .phase {
        border: 1px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.6);
        border-radius: 4mm;
        padding: 8mm;
        margin-bottom: 5mm;
        break-inside: avoid;
    }
    .phase-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5mm;
    }
    .phase-badge {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        background: var(--color-lime);
        color: var(--color-black);
        padding: 2pt 8pt;
        border-radius: 99px;
    }
    .phase-duration {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--color-muted);
    }
    .phase-price-block {
        margin-bottom: 5mm;
    }
    .phase-price-label {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--color-muted);
        margin-bottom: 1mm;
    }
    .phase-price {
        font-size: 22pt;
        letter-spacing: -0.02em;
        line-height: 1;
        margin-bottom: 1mm;
    }
    .phase-price-note {
        font-size: 9pt;
        color: var(--color-muted);
    }
    .phase-deliverables-label {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--color-muted);
        margin-bottom: 2mm;
    }
    .phase-deliverables {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .phase-deliverables li {
        display: flex;
        gap: 3mm;
        padding: 1.5mm 0;
        font-size: 10pt;
        line-height: 1.5;
    }
    .bullet {
        color: var(--color-lime);
        font-size: 8pt;
        margin-top: 1.5mm;
        flex-shrink: 0;
    }
    .phase-callout {
        margin-top: 5mm;
        border-left: 3px solid var(--color-lime);
        padding-left: 4mm;
        font-style: italic;
        color: var(--color-muted);
        font-size: 10pt;
    }

    /* ─── Timeline ─── */
    .timeline {
        position: relative;
    }
    .timeline-row {
        display: grid;
        grid-template-columns: 30mm 1fr;
        gap: 6mm;
        padding: 3mm 0;
        border-left: 1px solid var(--color-border);
        padding-left: 6mm;
        position: relative;
    }
    .timeline-row::before {
        content: '';
        position: absolute;
        left: -1.5mm;
        top: 5mm;
        width: 3mm;
        height: 3mm;
        background: var(--color-lime);
        border-radius: 50%;
        border: 2px solid var(--color-bg);
    }
    .timeline-period {
        font-family: var(--font-mono);
        font-size: 9pt;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--color-muted);
    }
    .timeline-label {
        font-size: 12pt;
        margin-bottom: 1mm;
    }
    .timeline-desc {
        font-size: 10pt;
        color: var(--color-muted);
        line-height: 1.5;
    }

    /* ─── Pricing table ─── */
    .pricing-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.6);
        border-radius: 4mm;
        overflow: hidden;
    }
    .pricing-table td {
        padding: 5mm 6mm;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        vertical-align: top;
    }
    .pricing-table tr:last-child td { border-bottom: none; }
    .row-label {
        font-size: 11pt;
        margin-bottom: 1mm;
    }
    .row-note {
        font-size: 9pt;
        color: var(--color-muted);
    }
    .row-price {
        font-size: 16pt;
        text-align: right;
        white-space: nowrap;
        letter-spacing: -0.02em;
    }
    .total-row {
        background: rgba(156, 224, 105, 0.3);
        border-top: 2px solid var(--color-lime);
    }
    .total-row td { padding-top: 6mm; padding-bottom: 6mm; }
    .total-label { font-size: 12pt; font-weight: 600; }
    .total-value { font-size: 20pt; }
    .pricing-footnote {
        font-size: 9pt;
        color: var(--color-muted);
        margin-top: 4mm;
    }

    /* ─── Saldeo ─── */
    .saldeo-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8mm;
    }
    .saldeo-subtitle {
        font-size: 12pt;
        color: var(--color-muted);
        margin: 0 0 6mm;
    }

    /* ─── Next steps ─── */
    .next-steps {
        list-style: none;
        padding: 0;
        margin: 0 0 10mm;
    }
    .next-steps li {
        display: flex;
        gap: 5mm;
        padding: 3mm 0;
        font-size: 12pt;
    }
    .step-num {
        font-size: 22pt;
        color: var(--color-lime);
        line-height: 1;
        flex-shrink: 0;
        width: 16mm;
        letter-spacing: -0.02em;
    }
    .step-text {
        padding-top: 4mm;
        line-height: 1.5;
    }
    .contact-block {
        border-top: 1px solid var(--color-border);
        padding-top: 6mm;
        margin-top: 8mm;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }
    .contact-name {
        font-size: 14pt;
        margin-bottom: 1mm;
    }
    .contact-email {
        font-size: 10pt;
        color: var(--color-muted);
    }
    .accept-cta {
        font-size: 11pt;
        background: var(--color-black);
        color: var(--color-sage);
        padding: 4mm 6mm;
        border-radius: 2mm;
    }
    .doc-footer {
        margin-top: 8mm;
        font-size: 9pt;
        color: var(--color-muted-light);
    }

    /* ─── Print specifics ─── */
    @media print {
        section { break-inside: avoid; }
        h2, h3 { break-after: avoid; }
        .phase, .problem { break-inside: avoid; }
        .pricing-table { break-inside: avoid; }
        .timeline-row { break-inside: avoid; }
    }
</style>
</head>
<body>
    <div class="container">

        <!-- HERO -->
        <section class="hero">
            <div class="hero-eyebrow">Workshift → ${esc(clientShort)}</div>
            <h1>${esc(offer.meta.title)}</h1>
            <p class="hero-subtitle">${esc(offer.meta.subtitle)}</p>
            <div class="lime-divider"></div>
            <div class="hero-meta">${esc(offer.meta.dateSent)} · ${esc(offer.meta.author)}</div>
        </section>

        <!-- CONTEXT -->
        <section>
            <span class="label-mono">Kontekst</span>
            <h2>${esc(offer.context.headline)}</h2>
            <div class="stats">${renderStats(offer.context.stats)}</div>
        </section>

        <!-- PROBLEMS -->
        <section>
            <span class="label-mono">Dwa procesy do automatyzacji</span>
            <h2>Co rozwiązujemy</h2>
            <div class="problems">${renderProblems(offer.problems)}</div>
        </section>

        <!-- APPROACH -->
        <section class="approach">
            <span class="label-mono">Nasze podejście</span>
            <h2>${esc(offer.approach.headline)}</h2>
            <ul>${renderReasons(offer.approach.reasons)}</ul>
            <div class="callout">${esc(offer.approach.callout)}</div>
        </section>

        <!-- PILOT + ASYSTA -->
        <section>
            <span class="label-mono">Co budujemy</span>
            <h2>Pilotaż + asysta wdrożeniowa</h2>

            <div class="phase">
                <div class="phase-header">
                    <span class="phase-badge">${esc(offer.pilot.label)}</span>
                    <span class="phase-duration">${esc(offer.pilot.duration)}</span>
                </div>
                <h3>${esc(offer.pilot.title)}</h3>
                <div class="phase-price-block">
                    <div class="phase-price-label">Cena</div>
                    <div class="phase-price">${esc(offer.pilot.price)}</div>
                    <div class="phase-price-note">${esc(offer.pilot.priceNote)}</div>
                </div>
                <div class="phase-deliverables-label">Co dostajesz</div>
                <ul class="phase-deliverables">${renderDeliverables(offer.pilot.deliverables)}</ul>
            </div>

            <div class="phase">
                <div class="phase-header">
                    <span class="phase-badge">${esc(offer.asysta.label)}</span>
                    <span class="phase-duration">${esc(offer.asysta.duration)}</span>
                </div>
                <h3>${esc(offer.asysta.title)}</h3>
                <div class="phase-price-block">
                    <div class="phase-price-label">Cena</div>
                    <div class="phase-price">${esc(offer.asysta.price)}</div>
                    <div class="phase-price-note">${esc(offer.asysta.priceNote)}</div>
                </div>
                <div class="phase-deliverables-label">Co dostajesz</div>
                <ul class="phase-deliverables">${renderDeliverables(offer.asysta.deliverables)}</ul>
                ${offer.asysta.callout ? `<div class="phase-callout">${esc(offer.asysta.callout)}</div>` : ''}
            </div>
        </section>

        <!-- TIMELINE -->
        <section>
            <span class="label-mono">Harmonogram</span>
            <h2>Od startu do działającego asystenta — ok. 5 miesięcy</h2>
            <div class="timeline">${renderTimeline(offer.timeline)}</div>
        </section>

        <!-- PRICING -->
        <section>
            <span class="label-mono">Podsumowanie finansowe</span>
            <h2>Pilotaż pierwszego procesu</h2>
            <table class="pricing-table">
                ${renderPricingRows(offer.pricing.rows)}
                <tr class="total-row">
                    <td class="total-label">${esc(offer.pricing.totalLabel)}</td>
                    <td class="row-price total-value">${esc(offer.pricing.total)}</td>
                </tr>
            </table>
            <p class="pricing-footnote">${esc(offer.pricing.footnote)}</p>
        </section>

        ${offer.saldeo ? `
        <!-- SALDEO -->
        <section>
            <span class="label-mono">${esc(offer.saldeo.label)}</span>
            <h2>${esc(offer.saldeo.title)}</h2>
            <p class="saldeo-subtitle">${esc(offer.saldeo.subtitle)}</p>
            <div class="saldeo-grid">
                <div>
                    <div class="phase-deliverables-label">Co zbudujemy</div>
                    <ul class="phase-deliverables">${renderDeliverables(offer.saldeo.deliverables)}</ul>
                </div>
                <div>
                    <div class="phase-deliverables-label">Szacowana wartość</div>
                    <p style="font-size:14pt;line-height:1.3;margin:0 0 5mm;">${esc(offer.saldeo.value)}</p>
                    <div class="callout">${esc(offer.saldeo.note)}</div>
                </div>
            </div>
        </section>
        ` : ''}

        <!-- NEXT STEPS -->
        <section>
            <span class="label-mono">Co dalej</span>
            <h2>Następne 4 kroki</h2>
            <ol class="next-steps">${renderNextSteps(offer.nextSteps)}</ol>

            <div class="contact-block">
                <div>
                    <div class="phase-deliverables-label">Kontakt</div>
                    <div class="contact-name">Jakub Bednarz · Workshift</div>
                    <div class="contact-email">jakub@workshift.pl</div>
                </div>
                <div class="accept-cta">Akceptuję ofertę → jakub@workshift.pl</div>
            </div>

            <p class="doc-footer">Oferta ważna do ${esc(offer.meta.validUntil)}. Strona prywatna, nieindeksowana. Dokument do druku wewnętrznego — nie do dystrybucji publicznej.</p>
        </section>

    </div>
</body>
</html>`;
}

async function build() {
    const dataFile = path.join(ROOT, 'api', '_data', 'offers', `${slug}.js`);
    try {
        await fs.access(dataFile);
    } catch {
        console.error(`Nie znaleziono danych oferty: ${dataFile}`);
        process.exit(1);
    }

    console.log(`▶ Wczytuję ${dataFile}`);
    const url = pathToFileURL(dataFile).href;
    const mod = await import(url);
    const offer = mod.default || mod[slug];
    if (!offer) {
        console.error(`Plik ${dataFile} musi mieć export default z obiektem oferty.`);
        process.exit(1);
    }

    const html = renderHTML(offer);

    const outDir = path.join(ROOT, 'offers-pdf');
    await fs.mkdir(outDir, { recursive: true });
    const today = new Date().toISOString().slice(0, 10);
    const outPath = path.join(outDir, `${slug}-${today}.pdf`);
    const htmlPath = path.join(outDir, `${slug}-${today}.html`);

    // Zapisz też HTML — przydatne do debugowania i jako standalone artifact.
    await fs.writeFile(htmlPath, html, 'utf-8');
    console.log(`▶ HTML: ${htmlPath}`);

    console.log(`▶ Startuję Puppeteer...`);
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.emulateMediaType('print');

        console.log(`▶ Drukuję PDF...`);
        await page.pdf({
            path: outPath,
            format: 'A4',
            printBackground: true,
            margin: { top: '12mm', bottom: '14mm', left: '10mm', right: '10mm' },
            displayHeaderFooter: true,
            headerTemplate: `<div style="font-size:8px;color:#888;width:100%;text-align:right;padding-right:10mm;font-family:Inter,sans-serif">Workshift → ${esc(offer.client.name.replace(' Sp. z o.o.', ''))} · ${today}</div>`,
            footerTemplate: `<div style="font-size:8px;color:#888;width:100%;text-align:center;font-family:Inter,sans-serif">Strona <span class="pageNumber"></span> z <span class="totalPages"></span> · Oferta prywatna, dokument wewnętrzny</div>`,
        });

        const stat = await fs.stat(outPath);
        console.log(`✓ PDF zapisany: ${outPath} (${(stat.size / 1024).toFixed(1)} kB)`);
    } finally {
        await browser.close();
    }
}

build().catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
});
