/**
 * PDF generator dla ofert klienckich — standalone, NIE wymaga dev servera.
 *
 * Czyta dane z api/_data/offers/<slug>.js, renderuje static HTML z inline'owanymi
 * stylami (sage / lime / Inter), drukuje przez Puppeteer do PDF.
 *
 * Usage:
 *   node lead-magnets/build-offer-pdf.mjs informax
 *
 * Output: offers/out/<slug>-<YYYY-MM-DD>.pdf (katalog offers/ jest gitignored)
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
    return nbsp(String(s))
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Niełamliwe spacje tam, gdzie złamanie wiersza rozbija sens: tysiące w kwotach
// („14 400"), liczba + jednostka („500 PLN", „7 dni"), numer modułu („modułu 1"),
// oraz niełamliwy dywiz w złożeniach typu „e-commerce". Dotyczy wszystkich ofert.
function nbsp(s) {
    return s
        .replace(/(\d) (\d{3})\b/g, '$1\u00a0$2')
        .replace(/(\d) (PLN|zł|dni|tyg\.?|lekcj\w*|film\w*)/g, '$1\u00a0$2')
        .replace(/\b(modu\u0142\w*|Modu\u0142) (\d)\b/g, '$1\u00a0$2')
        .replace(/\be-(commerce|mail|book|learning)\b/g, 'e\u2011$1');
}

// „2026-09-14" -> „14 września 2026". Gdy nie da się sparsować, zwraca oryginał.
function fmtDatePL(iso) {
    const d = new Date(String(iso) + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
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

function renderProblems(problems, badge = 'PILOTAŻ') {
    return problems.map((p) => `
        <div class="problem ${p.selected ? 'is-selected' : ''}">
            <div class="problem-header">
                <span class="problem-label">${esc(p.label)}</span>
                ${p.selected ? `<span class="badge-pilot">${esc(badge)}</span>` : ''}
            </div>
            <h3>${esc(p.title)}</h3>
            <p class="problem-metric">${esc(p.metric)}</p>
            <p class="problem-body">${esc(p.body)}</p>
            ${p.quote ? `<blockquote>${esc(p.quote)}</blockquote>` : ''}
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

// Karta fazy (etap / retainer). Cena opcjonalna: faza bez `price` renderuje sie bez bloku ceny.
function renderPhase(phase) {
    if (!phase) return '';
    const long = (Array.isArray(phase.deliverables) && phase.deliverables.length > 10) || (Array.isArray(phase.blocks) && phase.blocks.length > 1);
    return `
            <div class="phase${long ? ' long' : ''}">
                <div class="phase-top">
                <div class="phase-header">
                    <span class="phase-badge">${esc(phase.label)}</span>
                    <span class="phase-duration">${esc(phase.duration || '')}</span>
                </div>
                <h3>${esc(phase.title)}</h3>
                ${phase.price ? `
                <div class="phase-price-block">
                    <div class="phase-price-label">Cena</div>
                    <div class="phase-price">${esc(phase.price)}</div>
                    ${phase.priceNote ? `<div class="phase-price-note">${esc(phase.priceNote)}</div>` : ''}
                </div>` : ''}
                ${Array.isArray(phase.blocks) && phase.blocks.length ? '' : `<div class="phase-deliverables-label">${esc(phase.deliverablesLabel || 'Co dostajesz')}</div>`}
                </div>
                ${Array.isArray(phase.blocks) && phase.blocks.length
                    ? phase.blocks.map(renderPhaseBlock).join('')
                    : `<ul class="phase-deliverables">${renderDeliverables(phase.deliverables || [])}</ul>`}
                ${phase.callout ? `<div class="phase-callout">${esc(phase.callout)}</div>` : ''}
            </div>`;
}

// Blok w karcie fazy: `features` (siatka numer + tytul + opis z hairline'ami), `list` (1-2 kolumny), `text`.
function renderPhaseBlock(block) {
    let body = '';
    if (block.type === 'features' && Array.isArray(block.items)) {
        body = `<div class="features">${block.items.map((f, i) => `
            <div class="feature">
                <div class="feature-num">${String(i + 1).padStart(2, '0')}</div>
                <div class="feature-title">${esc(f.title)}</div>
                <div class="feature-desc">${esc(f.desc)}</div>
            </div>`).join('')}</div>`;
    } else if (block.type === 'list' && Array.isArray(block.items)) {
        body = `<ul class="phase-deliverables${block.columns === 2 ? ' cols-2' : ''}">${renderDeliverables(block.items)}</ul>`;
    } else if (block.type === 'text' && block.body) {
        body = `<p class="section-intro">${esc(block.body)}</p>`;
    }
    return `
            <div class="phase-block">
                ${block.label ? `<div class="phase-deliverables-label">${esc(block.label)}</div>` : ''}
                ${block.title ? `<h4 class="block-title">${esc(block.title)}</h4>` : ''}
                ${body}
            </div>`;
}

// Sekcje dodatkowe sterowane danymi: `sections: [{ type: 'table' | 'groups' | 'list', ... }]`.
function renderExtraSection(section) {
    let body = '';
    if (section.type === 'table' && Array.isArray(section.rows)) {
        const head = Array.isArray(section.columns) && section.columns.length
            ? `<thead><tr>${section.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>`
            : '';
        body = `<table class="data-table">${head}<tbody>${section.rows.map((row) => `<tr>${row.map((cell, ci) => `<td class="${ci === 0 ? 'cell-main' : 'cell-muted'}">${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    } else if (section.type === 'groups' && Array.isArray(section.groups)) {
        body = `<div class="groups">${section.groups.map((g) => `
            <div class="group">
                <div class="phase-deliverables-label">${esc(g.title)}</div>
                <ul class="phase-deliverables">${renderDeliverables(g.items || [])}</ul>
            </div>`).join('')}</div>`;
    } else if (section.type === 'list' && Array.isArray(section.items)) {
        body = `<ul class="phase-deliverables">${renderDeliverables(section.items)}</ul>`;
    } else if (section.type === 'tiles' && Array.isArray(section.groups)) {
        body = section.groups.map((g) => `
            <div class="tile-group">
                <div class="tile-group-head"><h3>${esc(g.title)}</h3>${g.note ? `<span class="label-mono">${esc(g.note)}</span>` : ''}</div>
                <div class="tiles">${g.tiles.map((t) => `
                    <div class="tile${t.badge ? ' featured' : ''}">
                        <div class="tile-top"><span class="phase-badge">${esc(t.code)}</span>${t.badge ? `<span class="tile-badge">${esc(t.badge)}</span>` : ''}</div>
                        <div class="tile-title">${esc(t.title)}</div>
                        <div class="tile-desc">${esc(t.desc)}</div>
                        <div class="tile-foot">
                            <div class="tile-price">${esc(t.price)}</div>
                            ${t.duration ? `<div class="tile-duration">${esc(t.duration)}</div>` : ''}
                            ${t.note ? `<div class="tile-note">${esc(t.note)}</div>` : ''}
                        </div>
                    </div>`).join('')}</div>
            </div>`).join('');
    }
    return `
        <section class="extra ${section.type === 'tiles' ? 'long' : 'keep'}">
            <div class="section-head">
            ${section.label ? `<span class="label-mono">${esc(section.label)}</span>` : ''}
            ${section.title ? `<h2>${esc(section.title)}</h2>` : ''}
            ${section.intro ? `<p class="section-intro">${esc(section.intro)}</p>` : ''}
            </div>
            ${body}
            ${section.footnote ? `<p class="pricing-footnote">${esc(section.footnote)}</p>` : ''}
        </section>`;
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
    // Etykiety sekcji - domyślne z pierwszej oferty, nadpisywalne per klient przez offer.labels.
    const L = {
        problems: 'Dwa procesy do automatyzacji',
        problemsSubtitle: 'Co rozwiązujemy',
        problemsBadge: 'PILOTAŻ',
        scopeLabel: 'Co budujemy',
        scopeTitle: 'Pilotaż + asysta wdrożeniowa',
        timelineTitle: 'Od startu do działającego asystenta - ok. 5 miesięcy',
        pricingTitle: 'Pilotaż pierwszego procesu',
        nextStepsTitle: 'Następne 4 kroki',
        ...(offer.labels || {}),
    };
    return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>${esc(offer.meta.title)} - ${esc(clientShort)}</title>
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
        font-size: 10pt;
        line-height: 1.42;
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

    /* ─── Justowanie akapitów ciągłych (nie list, nie tabel) ─── */
    .callout, .phase-callout, .pricing-footnote, .problem-body {
        text-align: justify;
        hyphens: auto;
        -webkit-hyphens: auto;
    }

    /* ─── Section ─── */
    section {
        padding: 0 0 7mm;
        break-inside: auto;
    }
    section.keep { break-inside: avoid; }
    section.long, .phase.long { break-inside: auto; }
    .section-head { break-inside: avoid; break-after: avoid; }
    .phase:not(.long) { break-inside: avoid; }
    .phase-top, .stat, .problem, .timeline-row, .group, .pricing-table, .phase-callout, .callout,
    .phase-deliverables li, .terms li, .data-table tr, .next-steps li { break-inside: avoid; }
    .problems.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .problems.cols-3 .problem { padding: 5mm; }
    .problems.cols-3 h3 { font-size: 12pt; }

    .label-mono {
        font-family: var(--font-mono);
        font-size: 8pt;
        text-transform: uppercase;
        letter-spacing: 0.22em;
        color: var(--color-muted);
        background: rgba(0,0,0,0.05);
        padding: 3pt 8pt;
        border-radius: 99px;
        display: block;
        width: fit-content;
        margin-bottom: 4mm;
    }

    h1, h2, h3, h4 { font-weight: 400; letter-spacing: -0.02em; margin: 0; }
    h1 { font-size: 28pt; line-height: 1.05; margin-bottom: 4mm; }
    h2 { font-size: 18pt; line-height: 1.1; margin-bottom: 4mm; }
    h3 { font-size: 13pt; line-height: 1.2; margin-bottom: 2.5mm; }

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
        font-size: 16pt;
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
        font-size: 8.5pt;
        margin: 0 0 3mm;
    }
    .problem-body {
        font-size: 9pt;
        color: var(--color-muted);
        line-height: 1.5;
        margin: 0 0 4mm;
    }
    blockquote {
        border-left: 2px solid var(--color-lime);
        padding-left: 4mm;
        font-style: italic;
        color: var(--color-muted);
        font-size: 9pt;
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
        padding: 1.2mm 0;
        font-size: 10.5pt;
        line-height: 1.45;
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
        font-size: 10pt;
        max-width: 160mm;
    }

    /* ─── Phase (pilot / asysta) ─── */
    .phase {
        border: 1px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.6);
        border-radius: 4mm;
        padding: 5mm 6mm;
        margin-bottom: 4mm;
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
        font-size: 20pt;
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
        padding: 0.8mm 0;
        font-size: 9.5pt;
        line-height: 1.5;
    }
    .bullet {
        color: var(--color-lime);
        font-size: 8pt;
        margin-top: 1.5mm;
        flex-shrink: 0;
    }
    .phase-callout {
        margin-top: 3mm;
        border-left: 3px solid var(--color-lime);
        padding-left: 4mm;
        font-style: italic;
        color: var(--color-muted);
        font-size: 9pt;
    }

    /* ─── Timeline ─── */
    .timeline {
        position: relative;
    }
    .timeline-row {
        display: grid;
        grid-template-columns: 30mm 1fr;
        gap: 6mm;
        padding: 2mm 0;
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
        padding: 2.8mm 5mm;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        vertical-align: top;
    }
    .pricing-table tr:last-child td { border-bottom: none; }
    .row-label {
        font-size: 10pt;
        margin-bottom: 1mm;
    }
    .row-note {
        font-size: 9pt;
        color: var(--color-muted);
    }
    .row-price {
        font-size: 14pt;
        text-align: right;
        white-space: nowrap;
        letter-spacing: -0.02em;
    }
    .total-row {
        background: rgba(156, 224, 105, 0.3);
        border-top: 2px solid var(--color-lime);
    }
    .total-row td { padding-top: 4mm; padding-bottom: 4mm; }
    .total-label { font-size: 12pt; font-weight: 600; }
    .total-value { font-size: 18pt; }
    .pricing-footnote {
        font-size: 9pt;
        color: var(--color-muted);
        margin-top: 3mm;
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

    /* ─── Bloki w karcie fazy ─── */
    .phase-block { margin-top: 5mm; break-inside: avoid; }
    .phase-block:first-of-type { margin-top: 0; }
    .block-title { font-size: 13pt; margin-bottom: 3mm; }
    .features {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        border-top: 1px solid rgba(0,0,0,0.12);
        border-left: 1px solid rgba(0,0,0,0.12);
    }
    .feature {
        border-right: 1px solid rgba(0,0,0,0.12);
        border-bottom: 1px solid rgba(0,0,0,0.12);
        padding: 4mm 4mm 4.5mm;
        break-inside: avoid;
    }
    .feature-num {
        font-family: var(--font-mono);
        font-size: 8pt;
        letter-spacing: 0.2em;
        color: var(--color-muted);
        margin-bottom: 2.5mm;
    }
    .feature-title { font-size: 10.5pt; font-weight: 500; line-height: 1.25; margin-bottom: 1.5mm; }
    .feature-desc { font-size: 8.5pt; color: var(--color-muted); line-height: 1.4; }
    .phase-deliverables.cols-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 6mm;
    }
    .phase-deliverables.cols-2 li { font-size: 9pt; padding: 0.8mm 0; }
    .phase.long .phase-block { break-inside: avoid; }

    /* ─── Sekcje dodatkowe (tabele, grupy) ─── */
    .section-intro {
        font-size: 11pt;
        color: var(--color-muted);
        margin: 0 0 6mm;
        max-width: 160mm;
    }
    .data-table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.6);
        font-size: 9.5pt;
        line-height: 1.45;
    }
    .data-table th {
        font-family: var(--font-mono);
        font-size: 7.5pt;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--color-muted);
        font-weight: 400;
        text-align: left;
        padding: 2.8mm 4mm;
        border-bottom: 1px solid rgba(0,0,0,0.12);
        vertical-align: bottom;
    }
    .data-table td {
        padding: 2.8mm 4mm;
        border-bottom: 1px solid rgba(0,0,0,0.08);
        vertical-align: top;
    }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table .cell-muted { color: var(--color-muted); }
    .groups {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6mm 8mm;
    }
    .group { break-inside: avoid; }
    .tile-group { margin-bottom: 6mm; break-inside: avoid; }
    .tile-group-head { display: flex; align-items: baseline; gap: 4mm; margin-bottom: 3mm; }
    .tile-group-head h3 { font-size: 14pt; margin: 0; }
    .tiles { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; }
    .tile {
        border: 1px solid rgba(0,0,0,0.1);
        background: rgba(255,255,255,0.5);
        border-radius: 3mm;
        padding: 4mm;
        display: flex;
        flex-direction: column;
        break-inside: avoid;
    }
    .tile.featured { border-color: var(--color-lime); background: rgba(255,255,255,0.75); }
    .tile-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3mm; }
    .tile-badge { font-family: var(--font-mono); font-size: 6.5pt; text-transform: uppercase; letter-spacing: 0.16em; color: var(--color-muted); }
    .tile-title { font-size: 10.5pt; font-weight: 500; line-height: 1.25; margin-bottom: 2mm; }
    .tile-desc { font-size: 8.5pt; color: var(--color-muted); line-height: 1.4; flex: 1; margin-bottom: 3mm; }
    .tile-foot { border-top: 1px solid rgba(0,0,0,0.1); padding-top: 2.5mm; }
    .tile-price { font-size: 13pt; line-height: 1.1; margin-bottom: 1mm; }
    .tile-duration { font-family: var(--font-mono); font-size: 7pt; text-transform: uppercase; letter-spacing: 0.14em; color: var(--color-muted); }
    .tile-note { font-size: 7.5pt; color: var(--color-muted); line-height: 1.35; margin-top: 1mm; }
    section.phases, section.extra.long { break-inside: auto; }
    .terms {
        list-style: none;
        padding: 0;
        margin: 5mm 0 0;
    }
    .terms li {
        display: flex;
        gap: 3mm;
        padding: 0.8mm 0;
        font-size: 9pt;
        line-height: 1.45;
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
        padding: 1.5mm 0;
        font-size: 10.5pt;
    }
    .step-num {
        font-size: 18pt;
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
        padding-top: 5mm;
        margin-top: 5mm;
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
        margin-top: 5mm;
        font-size: 9pt;
        color: var(--color-muted-light);
    }

    /* ─── Print specifics ─── */
    @media print {
        h2, h3 { break-after: avoid; }
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

        ${Array.isArray(offer.tldr) && offer.tldr.length ? `
        <!-- TL;DR -->
        <section>
            <span class="label-mono">W skrócie</span>
            <ul class="phase-deliverables">${renderDeliverables(offer.tldr)}</ul>
        </section>
        ` : ''}

        <!-- CONTEXT -->
        <section class="keep">
            <div class="section-head"><span class="label-mono">Kontekst</span><h2>${esc(offer.context.headline)}</h2></div>
            <div class="stats">${renderStats(offer.context.stats)}</div>
        </section>

        <!-- PROBLEMS -->
        ${offer.problems?.length ? `
        <section class="keep">
            <div class="section-head"><span class="label-mono">${esc(L.problems)}</span><h2>${esc(L.problemsSubtitle)}</h2></div>
            <div class="problems${offer.problems.length === 3 ? ' cols-3' : ''}">${renderProblems(offer.problems, L.problemsBadge)}</div>
        </section>` : ''}

        <!-- APPROACH -->
        <section class="approach keep">
            <div class="section-head"><span class="label-mono">Nasze podejście</span><h2>${esc(offer.approach.headline)}</h2></div>
            <ul>${renderReasons(offer.approach.reasons)}</ul>
            <div class="callout">${esc(offer.approach.callout)}</div>
        </section>

        ${Array.isArray(offer.sections) ? offer.sections.filter((x) => x.position === 'beforePhases').map(renderExtraSection).join('') : ''}

        <!-- FAZY (phases[] albo pilot + asysta) -->
        ${(Array.isArray(offer.phases) && offer.phases.length ? offer.phases : [offer.pilot, offer.asysta]).filter(Boolean).map((phase, i) => `
        <section class="phase-sec ${(Array.isArray(phase.deliverables) && phase.deliverables.length > 10) || (Array.isArray(phase.blocks) && phase.blocks.length > 1) ? 'long' : 'keep'}">
            ${i === 0 ? `<div class="section-head"><span class="label-mono">${esc(L.scopeLabel)}</span><h2>${esc(L.scopeTitle)}</h2></div>` : ''}
            ${renderPhase(phase)}
        </section>`).join('')}

        ${offer.needs && Array.isArray(offer.needs.items) && offer.needs.items.length ? `
        <!-- NEEDS -->
        <section>
            <div class="section-head"><span class="label-mono">${esc(offer.needs.label || 'Po Państwa stronie')}</span><h2>${esc(offer.needs.title || 'Czego potrzebujemy od Państwa')}</h2></div>
            <ul class="phase-deliverables">${renderDeliverables(offer.needs.items)}</ul>
            ${offer.needs.note ? `<p class="pricing-footnote">${esc(offer.needs.note)}</p>` : ''}
        </section>
        ` : ''}

        ${Array.isArray(offer.sections) ? offer.sections.filter((x) => x.position !== 'beforePhases').map(renderExtraSection).join('') : ''}

        ${Array.isArray(offer.timeline) && offer.timeline.length ? `
        <!-- TIMELINE -->
        <section>
            <div class="section-head"><span class="label-mono">${esc(L.timelineLabel || 'Harmonogram')}</span><h2>${esc(L.timelineTitle)}</h2></div>
            <div class="timeline">${renderTimeline(offer.timeline)}</div>
        </section>` : ''}

        <!-- PRICING -->
        <section>
            <div class="section-head"><span class="label-mono">Podsumowanie finansowe</span><h2>${esc(L.pricingTitle)}</h2></div>
            <table class="pricing-table">
                ${renderPricingRows(offer.pricing.rows)}
                <tr class="total-row">
                    <td class="total-label">${esc(offer.pricing.totalLabel)}</td>
                    <td class="row-price total-value">${esc(offer.pricing.total)}</td>
                </tr>
            </table>
            ${Array.isArray(offer.pricing.terms) && offer.pricing.terms.length ? `<ul class="terms">${renderDeliverables(offer.pricing.terms)}</ul>` : ''}
            ${offer.pricing.footnote ? `<p class="pricing-footnote">${esc(offer.pricing.footnote)}</p>` : ''}
        </section>

        ${offer.saldeo ? `
        <!-- SALDEO -->
        <section>
            <div class="section-head"><span class="label-mono">${esc(offer.saldeo.label)}</span><h2>${esc(offer.saldeo.title)}</h2></div>
            <p class="saldeo-subtitle">${esc(offer.saldeo.subtitle)}</p>
            <div class="saldeo-grid">
                <div>
                    <div class="phase-deliverables-label">${esc(offer.saldeo.deliverablesLabel || 'Co zbudujemy')}</div>
                    <ul class="phase-deliverables">${renderDeliverables(offer.saldeo.deliverables)}</ul>
                </div>
                <div>
                    <div class="phase-deliverables-label">${esc(offer.saldeo.valueLabel || 'Szacowana wartość')}</div>
                    <p style="font-size:14pt;line-height:1.3;margin:0 0 5mm;">${esc(offer.saldeo.value)}</p>
                    <div class="callout">${esc(offer.saldeo.note)}</div>
                </div>
            </div>
        </section>
        ` : ''}

        <!-- NEXT STEPS -->
        <section class="keep">
            <div class="section-head"><span class="label-mono">Co dalej</span><h2>${esc(L.nextStepsTitle)}</h2></div>
            <ol class="next-steps">${renderNextSteps(offer.nextSteps)}</ol>

            <div class="contact-block">
                <div>
                    <div class="phase-deliverables-label">Kontakt</div>
                    <div class="contact-name">Jakub Bednarz · Workshift</div>
                    <div class="contact-email">jakub@workshift.pl</div>
                </div>
                <div class="accept-cta">Akceptuję ofertę → jakub@workshift.pl</div>
            </div>

            <p class="doc-footer">Oferta ważna do ${esc(fmtDatePL(offer.meta.validUntil))}. Strona prywatna, nieindeksowana. Dokument do druku wewnętrznego - nie do dystrybucji publicznej.</p>
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

    const outDir = path.join(ROOT, 'offers', 'out');
    await fs.mkdir(outDir, { recursive: true });
    const today = new Date().toISOString().slice(0, 10);
    const outPath = path.join(outDir, `${slug}-${today}.pdf`);
    const htmlPath = path.join(outDir, `${slug}-${today}.html`);

    // Zapisz też HTML — przydatne do debugowania i jako standalone artifact.
    await fs.writeFile(htmlPath, html, 'utf-8');
    console.log(`▶ HTML: ${htmlPath}`);

    console.log(`▶ Startuję Puppeteer...`);
    // Systemowy Chrome (channel) zamiast pobieranego przez Puppeteera - ten sam
    // wzorzec co offers/source/tiguar/build-oferta.mjs; bundlowany Chrome bywa niezainstalowany.
    const browser = await puppeteer.launch({
        headless: 'new',
        channel: process.env.PUPPETEER_EXECUTABLE_PATH ? undefined : 'chrome',
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
            margin: { top: '11mm', bottom: '12mm', left: '10mm', right: '10mm' },
            displayHeaderFooter: true,
            headerTemplate: `<div style="font-size:8px;color:#888;width:100%;text-align:right;padding-right:10mm;font-family:Inter,sans-serif">Workshift → ${esc(offer.client.name.replace(' Sp. z o.o.', ''))} · ${esc(offer.meta.dateSent || today)}</div>`,
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
