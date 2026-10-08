/**
 * PDF generator dla ofert klienckich - standalone, NIE wymaga dev servera.
 *
 * Czyta dane z api/_data/offers/<slug>.js, renderuje samowystarczalny HTML (fonty, logo, motywy
 * i zdjęcie osadzone jako base64), drukuje przez Puppeteer do PDF.
 *
 * Usage:
 *   node lead-magnets/build-offer-pdf.mjs informax
 *   node lead-magnets/build-offer-pdf.mjs _archive/mg-projekt
 *
 * Output: offers/out/<slug>-<YYYY-MM-DD>.pdf (katalog offers/ jest gitignored). Gdy oferta ma
 * meta.version, obok powstaje kopia do wysyłki: Workshift-oferta-<Klient>-v<wersja>.pdf.
 *
 * Struktura dokumentu (od 08.10.2026): okładka, "W skrócie" ze spisem treści, rozdziały od nowej
 * strony, załącznik (sekcje z position: 'appendix'), tylna okładka z kontaktem. Tło sage na
 * wszystkich stronach. Bez strony akceptacji: oferta służy do prezentacji, podpisuje się umowę.
 *
 * Plik PDF zostaje LOKALNIE - żaden skrypt nie wysyła go nigdzie automatycznie.
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

// HTML escape - wszystkie data wartości puszczamy przez to, żeby nie wstrzyknąć znaczników.
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
// skróty przed liczbą („ok. 50"), jednoliterowe spójniki na końcu wiersza („i", „w", „z")
// oraz niełamliwy dywiz w złożeniach typu „e-commerce". Dotyczy wszystkich ofert.
function nbsp(s) {
    const orphan = /(^|[\s(„])([aiouwzAIOUWZ]) /g;
    return s
        .replace(/(\d) (\d{3})\b/g, '$1 $2')
        .replace(/(\d) (PLN|zł|dni|tyg\.?|godz\w*|lekcj\w*|film\w*|osób|parków|faktur)/g, '$1 $2')
        .replace(/\b(moduł\w*|Moduł) (\d)\b/g, '$1 $2')
        .replace(/\b(ok\.|np\.|do|od) (\d)/g, '$1 $2')
        .replace(orphan, '$1$2 ')
        .replace(orphan, '$1$2 ')
        .replace(/\be-(commerce|mail|book|learning)\b/g, 'e‑$1');
}

// Wartość do CSS `content: "..."` w marginesach strony.
function cssStr(s) {
    return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

// „2026-09-14" -> „14 września 2026". Gdy nie da się sparsować, zwraca oryginał.
function fmtDatePL(iso) {
    if (!iso) return '';
    const d = new Date(String(iso) + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
}

// „Zakład Łódź Sp. z o.o." -> „Zaklad-Lodz" (nazwa pliku do wysyłki, bez polskich znaków).
function fileSafe(s) {
    return String(s)
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/ Sp\. z o\.o\.?/i, '')
        .trim().replace(/\s+/g, '-').replace(/[^A-Za-z0-9-]/g, '');
}

const same = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

function renderStats(stats) {
    return stats.map((s) => `
        <div class="stat">
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
                ${p.selected ? `<span class="badge">${esc(badge)}</span>` : ''}
            </div>
            <h3>${esc(p.title)}</h3>
            <p class="problem-metric">${esc(p.metric)}</p>
            <p class="problem-body">${esc(p.body)}</p>
            ${p.quote ? `<blockquote>${esc(p.quote)}</blockquote>` : ''}
        </div>
    `).join('');
}

// Znaczniki jako SVG: znaki „✓" i „→" nie są w podzbiorach Inter/Plex, więc Chrome dokładał
// do PDF fonty systemowe (w tym Type 3).
const ICON_CHECK = '<svg viewBox="0 0 12 12" width="8" height="8" aria-hidden="true"><path d="M2.4 6.3l2.4 2.4 4.8-5.2" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_ARROW = '<svg viewBox="0 0 12 12" width="9" height="9" aria-hidden="true"><path d="M1.5 6h8.5M6.8 2.8L10 6l-3.2 3.2" fill="none" stroke="#000" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function renderReasons(reasons) {
    return reasons.map((r) => `<li><span class="check">${ICON_CHECK}</span><span>${esc(r)}</span></li>`).join('');
}

function renderDeliverables(items) {
    return items.map((d) => `<li><span class="bullet"></span><span>${esc(d)}</span></li>`).join('');
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
                ${r.note ? `<div class="row-note">${esc(r.note)}</div>` : ''}
            </td>
            <td class="row-price">${esc(r.price)}</td>
        </tr>
    `).join('');
}

// Karta fazy (etap / moduł / opieka). Cena opcjonalna: faza bez `price` renderuje się bez bloku ceny.
function renderPhase(phase) {
    if (!phase) return '';
    const hasBlocks = Array.isArray(phase.blocks) && phase.blocks.length;
    return `
            <div class="phase">
                <div class="phase-top">
                    <div class="phase-header">
                        <span class="badge">${esc(phase.label)}</span>
                        <span class="phase-duration">${esc(phase.duration || '')}</span>
                    </div>
                    <div class="phase-title-row">
                        <h3>${esc(phase.title)}</h3>
                        ${phase.price ? `
                        <div class="phase-price-block">
                            <div class="phase-price">${esc(phase.price)}</div>
                            ${phase.priceNote ? `<div class="phase-price-note">${esc(phase.priceNote)}</div>` : ''}
                        </div>` : ''}
                    </div>
                    ${hasBlocks ? '' : `<div class="mono-label">${esc(phase.deliverablesLabel || 'Co dostajesz')}</div>`}
                </div>
                ${hasBlocks
                    ? phase.blocks.map(renderPhaseBlock).join('')
                    : `<ul class="list">${renderDeliverables(phase.deliverables || [])}</ul>`}
                ${phase.callout ? `<div class="callout">${esc(phase.callout)}</div>` : ''}
            </div>`;
}

// Blok w karcie fazy: `features` (siatka numer + tytuł + opis z hairline'ami), `list` (1-2 kolumny), `text`.
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
        body = `<ul class="list${block.columns === 2 ? ' cols-2' : ''}">${renderDeliverables(block.items)}</ul>`;
    } else if (block.type === 'text' && block.body) {
        body = `<p class="intro">${esc(block.body)}</p>`;
    }
    return `
            <div class="phase-block">
                ${block.label ? `<div class="mono-label">${esc(block.label)}</div>` : ''}
                ${block.title ? `<h4 class="block-title">${esc(block.title)}</h4>` : ''}
                ${body}
            </div>`;
}

// Nagłówek sekcji: etykieta mono (pomijana, gdy powtarza nazwę rozdziału), tytuł, wstęp.
function sectionHead({ label, title, intro }, chapterName) {
    const showLabel = label && !same(label, chapterName);
    return `
            <div class="section-head">
                ${showLabel ? `<div class="mono-label">${esc(label)}</div>` : ''}
                ${title ? `<h2>${esc(title)}</h2>` : ''}
                ${intro ? `<p class="intro">${esc(intro)}</p>` : ''}
            </div>`;
}

// Sekcje dodatkowe sterowane danymi: `sections: [{ type: 'table' | 'groups' | 'list' | 'tiles', ... }]`.
function renderExtraSection(section, chapterName) {
    let body = '';
    if (section.type === 'table' && Array.isArray(section.rows)) {
        const head = Array.isArray(section.columns) && section.columns.length
            ? `<thead><tr>${section.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>`
            : '';
        body = `<table class="data-table">${head}<tbody>${section.rows.map((row) => `<tr>${row.map((cell, ci) => `<td class="${ci === 0 ? 'cell-main' : 'cell-muted'}">${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    } else if (section.type === 'groups' && Array.isArray(section.groups)) {
        body = `<div class="groups">${section.groups.map((g) => `
            <div class="group">
                <div class="mono-label">${esc(g.title)}</div>
                <ul class="list">${renderDeliverables(g.items || [])}</ul>
            </div>`).join('')}</div>`;
    } else if (section.type === 'list' && Array.isArray(section.items)) {
        body = `<ul class="list${section.columns === 2 ? ' cols-2' : ''}">${renderDeliverables(section.items)}</ul>`;
    } else if (section.type === 'tiles' && Array.isArray(section.groups)) {
        body = section.groups.map((g) => `
            <div class="tile-group">
                <div class="tile-group-head"><h3>${esc(g.title)}</h3>${g.note ? `<span class="mono-label">${esc(g.note)}</span>` : ''}</div>
                <div class="tiles">${g.tiles.map((t) => `
                    <div class="tile${t.badge ? ' featured' : ''}">
                        <div class="tile-top"><span class="badge">${esc(t.code)}</span>${t.badge ? `<span class="tile-badge">${esc(t.badge)}</span>` : ''}</div>
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
    // Krótka lista trzyma się jednej strony, żeby nagłówek nie został sam na dole.
    const keep = (section.type === 'list' && (section.items || []).length <= 8)
        || (section.type === 'table' && (section.rows || []).length <= 6);
    return `
        <section class="block${keep ? ' keep' : ''}">
            ${sectionHead(section, chapterName)}
            ${body}
            ${section.footnote ? `<p class="footnote">${esc(section.footnote)}</p>` : ''}
        </section>`;
}

function renderNextSteps(steps) {
    return steps.map((s, i) => `
        <li>
            <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
            <span class="step-text">${esc(s)}</span>
        </li>
    `).join('');
}

function renderHTML(offer, assets) {
    const clientShort = offer.client.name.replace(' Sp. z o.o.', '');
    const meta = offer.meta || {};
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
    const [authorName, authorCompany] = String(meta.author || 'Jakub Bednarz · Workshift').split(' · ');
    const contact = {
        name: authorName || 'Jakub Bednarz',
        company: authorCompany || 'Workshift',
        email: 'jakub@workshift.pl',
        web: 'workshift.pl',
        ...(offer.contact || {}),
    };
    const footerLeft = `${clientShort} · Oferta${meta.version ? ` v${meta.version}` : ' Workshift'}`;

    // ─── Rozdziały ───
    const sections = Array.isArray(offer.sections) ? offer.sections : [];
    const byPos = (pos) => sections.filter((s) => (s.position || 'main') === pos);
    const chapters = [];
    const addChapter = (name, toc, html) => {
        if (html.trim()) chapters.push({ name, toc: toc.filter(Boolean), html });
    };

    // Podejście otwiera rozdział z mapą modułów, jeśli oferta ją ma; inaczej zamyka rozdział 01.
    const modulesList = byPos('beforePhases');
    const approachHtml = (chapterName) => offer.approach ? `
        <section class="block approach">
            ${sectionHead({ label: 'Podejście', title: offer.approach.headline }, chapterName)}
            <ul>${renderReasons(offer.approach.reasons || [])}</ul>
            ${offer.approach.callout ? `<div class="callout">${esc(offer.approach.callout)}</div>` : ''}
        </section>` : '';

    // 01 Sytuacja (i podejście)
    {
        const withApproach = !modulesList.length;
        const name = L.chapterSituation || (withApproach ? 'Sytuacja i podejście' : 'Sytuacja');
        let html = '';
        if (offer.context) {
            html += `
        <section class="block">
            ${sectionHead({ label: 'Kontekst', title: offer.context.headline }, name)}
            <div class="stats">${renderStats(offer.context.stats || [])}</div>
        </section>`;
        }
        if (offer.problems?.length) {
            html += `
        <section class="block">
            ${sectionHead({ label: L.problems, title: L.problemsSubtitle }, name)}
            <div class="problems${offer.problems.length === 3 ? ' cols-3' : ''}">${renderProblems(offer.problems, L.problemsBadge)}</div>
        </section>`;
        }
        if (withApproach) html += approachHtml(name);
        addChapter(name, [offer.context && 'Kontekst', offer.problems?.length && L.problems, withApproach && offer.approach && 'Podejście'], html);
    }

    // 02 Podejście i moduły do wyboru (sekcje przed fazami)
    if (modulesList.length) {
        const name = L.chapterModules || 'Podejście i moduły';
        addChapter(name, [offer.approach && 'Podejście', ...modulesList.map((s) => s.title || s.label)],
            approachHtml(name) + modulesList.map((s) => renderExtraSection(s, name)).join(''));
    }

    // 03 Zakres / na start: fazy i to, czego potrzebujemy od klienta
    {
        const name = L.scopeLabel;
        const phases = (Array.isArray(offer.phases) && offer.phases.length ? offer.phases : [offer.pilot, offer.asysta]).filter(Boolean);
        let html = '';
        if (phases.length) {
            html += `
        <section class="block phases">
            ${sectionHead({ label: L.scopeLabel, title: L.scopeTitle }, name)}
            ${phases.map(renderPhase).join('')}
        </section>`;
        }
        const hasNeeds = offer.needs && Array.isArray(offer.needs.items) && offer.needs.items.length;
        if (hasNeeds) {
            html += `
        <section class="block">
            ${sectionHead({ label: offer.needs.label || 'Po Państwa stronie', title: offer.needs.title || 'Czego potrzebujemy od Państwa' }, name)}
            <ul class="list">${renderDeliverables(offer.needs.items)}</ul>
            ${offer.needs.note ? `<p class="footnote">${esc(offer.needs.note)}</p>` : ''}
        </section>`;
        }
        const afterPhases = byPos('afterPhases');
        html += afterPhases.map((s) => renderExtraSection(s, name)).join('');
        addChapter(name, [...phases.map((p) => p.title), hasNeeds && (offer.needs.label || 'Po Państwa stronie'), ...afterPhases.map((s) => s.label || s.title)], html);
    }

    // 04 Jak pracujemy (sekcje bez position)
    {
        const list = byPos('main');
        const name = L.chapterWork || 'Jak pracujemy';
        addChapter(name, list.map((s) => s.label || s.title), list.map((s) => renderExtraSection(s, name)).join(''));
    }

    // 05 Przebieg, ceny i następne kroki
    {
        const hasTimeline = Array.isArray(offer.timeline) && offer.timeline.length;
        const name = L.chapterPricing || (hasTimeline ? 'Przebieg i ceny' : 'Ceny i warunki');
        let html = '';
        if (hasTimeline) {
            html += `
        <section class="block">
            ${sectionHead({ label: L.timelineLabel || 'Harmonogram', title: L.timelineTitle }, name)}
            <div class="timeline">${renderTimeline(offer.timeline)}</div>
        </section>`;
        }
        if (offer.pricing) {
            html += `
        <section class="block">
            ${sectionHead({ label: 'Podsumowanie finansowe', title: L.pricingTitle }, name)}
            <table class="pricing-table">
                ${renderPricingRows(offer.pricing.rows || [])}
                <tr class="total-row">
                    <td class="total-label">${esc(offer.pricing.totalLabel)}</td>
                    <td class="row-price total-value">${esc(offer.pricing.total)}</td>
                </tr>
            </table>
            ${Array.isArray(offer.pricing.terms) && offer.pricing.terms.length ? `<ul class="list terms">${renderDeliverables(offer.pricing.terms)}</ul>` : ''}
            ${offer.pricing.footnote ? `<p class="footnote">${esc(offer.pricing.footnote)}</p>` : ''}
        </section>`;
        }
        const after = byPos('afterPricing');
        html += after.map((s) => renderExtraSection(s, name)).join('');
        if (offer.saldeo) {
            html += `
        <section class="block">
            ${sectionHead({ label: offer.saldeo.label, title: offer.saldeo.title }, name)}
            <p class="intro">${esc(offer.saldeo.subtitle)}</p>
            <div class="saldeo-grid">
                <div>
                    <div class="mono-label">${esc(offer.saldeo.deliverablesLabel || 'Co zbudujemy')}</div>
                    <ul class="list">${renderDeliverables(offer.saldeo.deliverables || [])}</ul>
                </div>
                <div>
                    <div class="mono-label">${esc(offer.saldeo.valueLabel || 'Szacowana wartość')}</div>
                    <p class="saldeo-value">${esc(offer.saldeo.value)}</p>
                    <div class="callout">${esc(offer.saldeo.note)}</div>
                </div>
            </div>
        </section>`;
        }
        addChapter(name, [
            hasTimeline && (L.timelineLabel || 'Harmonogram'),
            offer.pricing && L.pricingTitle,
            ...after.map((s) => s.label || s.title),
            offer.saldeo && offer.saldeo.label,
        ], html);
    }

    const hasNextSteps = Array.isArray(offer.nextSteps) && offer.nextSteps.length;
    const appendixList = byPos('appendix');
    const appendixName = L.chapterAppendix || 'Załącznik';
    const appendixHtml = appendixList.map((s) => renderExtraSection(s, appendixName)).join('');

    const chapterHtml = chapters.map((c, i) => `
    <section class="chapter">
        <div class="chapter-kicker"><span class="chapter-num">${String(i + 1).padStart(2, '0')}</span><span>${esc(c.name)}</span></div>
        ${c.html}
    </section>`).join('');

    const tocItems = [
        ...chapters.map((c, i) => ({ num: String(i + 1).padStart(2, '0'), name: c.name, sub: c.toc })),
        ...(appendixHtml.trim() ? [{ num: 'A', name: appendixName, sub: appendixList.map((s) => s.label || s.title) }] : []),
        ...(hasNextSteps ? [{ num: ICON_ARROW, raw: true, name: L.nextStepsTitle, sub: ['Kontakt'] }] : []),
    ];

    const summary = offer.summary || {};
    const hasSummaryPage = (Array.isArray(offer.tldr) && offer.tldr.length) || summary.decision || offer.pricing;

    return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>${esc(`Oferta Workshift · ${clientShort}${meta.version ? ` · v${meta.version}` : ''}`)}</title>
<meta name="author" content="${esc(contact.name)} · ${esc(contact.company)}">
<style>
${assets.fontFaces}

    /* ─── Workshift design tokens (kopia z src/index.css) ─── */
    :root {
        --sage: #E6E8DD;
        --white: #FFFFFF;
        --lime: #9CE069;
        --black: #000000;
        --muted: #595959;
        --hairline: rgba(0,0,0,0.12);
        --hairline-soft: rgba(0,0,0,0.07);
        --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
    }

    /* ─── Strona: A4, sage na całej stronie (także na marginesach), stopka w marginesie ─── */
    @page {
        size: A4;
        margin: 20mm 20mm 22mm;
        background: #E6E8DD;
        @bottom-left {
            content: ${cssStr(footerLeft)};
            font-family: 'IBM Plex Mono', monospace; font-size: 7pt; letter-spacing: 0.08em; color: #595959;
            vertical-align: top; padding-top: 6mm;
        }
        @bottom-right {
            content: "Strona " counter(page) " z " counter(pages);
            font-family: 'IBM Plex Mono', monospace; font-size: 7pt; letter-spacing: 0.08em; color: #595959;
            vertical-align: top; padding-top: 6mm;
        }
    }
    @page full {
        margin: 0;
        @bottom-left { content: none; }
        @bottom-right { content: none; }
    }

    * { box-sizing: border-box; }
    html, body {
        margin: 0;
        background: var(--sage);
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    body {
        font-family: var(--font-sans);
        font-size: 10pt;
        line-height: 1.45;
        color: var(--black);
        orphans: 3;
        widows: 3;
        font-variant-numeric: tabular-nums;
    }
    p { margin: 0; }
    h1, h2, h3, h4 { font-weight: 400; letter-spacing: -0.02em; margin: 0; break-after: avoid; }
    h2 { font-size: 18pt; line-height: 1.12; margin-bottom: 3.5mm; max-width: 150mm; }
    h3 { font-size: 12.5pt; line-height: 1.2; margin-bottom: 2mm; }

    .mono-label, .chapter-kicker, .problem-label, .phase-duration, .feature-num, .tile-duration, .tile-badge,
    .timeline-period, .data-table th, .cover-mono, .meta-label, .toc-num, .badge, .step-num {
        font-family: var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.16em;
    }
    .mono-label { font-size: 7.5pt; color: var(--muted); margin-bottom: 2.5mm; display: block; }
    .badge {
        font-size: 7pt; font-weight: 500;
        background: var(--lime); color: var(--black);
        padding: 1.6pt 6pt; border-radius: 99px;
        display: inline-block; white-space: nowrap;
    }

    /* ─── Okładka i tylna okładka: pełne strony bez marginesu i stopki ─── */
    .cover, .back {
        page: full;
        width: 210mm; height: 297mm;
        position: relative; overflow: hidden;
        background: var(--sage);
        break-after: page;
    }
    .cover-top {
        position: absolute; top: 18mm; left: 20mm; right: 20mm;
        display: flex; justify-content: space-between; align-items: center;
    }
    .cover-logo { height: 9mm; width: auto; display: block; }
    .cover-mono { font-size: 7.5pt; color: var(--muted); }
    .cover-main { position: absolute; top: 62mm; left: 20mm; right: 20mm; }
    .cover-eyebrow { margin-bottom: 7mm; }
    .cover-title { font-size: 36pt; line-height: 1.06; letter-spacing: -0.03em; max-width: 160mm; margin-bottom: 8mm; }
    .accent-bar { width: 26mm; height: 2.6mm; background: var(--lime); margin-bottom: 8mm; }
    .cover-sub { font-size: 12.5pt; line-height: 1.45; color: var(--muted); max-width: 140mm; }
    .cover-meta {
        position: absolute; left: 20mm; bottom: 20mm; width: 80mm;
        display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 6mm;
        border-top: 1px solid var(--hairline); padding-top: 5mm;
    }
    .meta-label { display: block; font-size: 6.5pt; color: var(--muted); margin-bottom: 1.2mm; }
    .meta-value { font-size: 9.5pt; line-height: 1.35; }
    .meta-value small { display: block; color: var(--muted); font-size: 8.5pt; }
    .cover-motif { position: absolute; width: 150mm; right: -42mm; bottom: -16mm; }

    .back-motif { position: absolute; height: 300mm; right: -96mm; top: -12mm; }
    .back-inner { position: absolute; left: 20mm; top: 62mm; width: 128mm; }
    .back-inner.with-steps { top: 36mm; }
    .back-inner .next-steps { margin-bottom: 14mm; }
    .back-contact-label { margin-bottom: 5mm; }
    .back-title { font-size: 26pt; line-height: 1.1; letter-spacing: -0.03em; margin: 3mm 0 8mm; max-width: 110mm; }
    .back-person { display: grid; grid-template-columns: 42mm 1fr; gap: 8mm; align-items: end; }
    .back-photo { width: 42mm; height: 56mm; object-fit: cover; object-position: center 15%; display: block; }
    .back-name { font-size: 16pt; letter-spacing: -0.02em; margin-bottom: 1mm; }
    .back-role { font-size: 9.5pt; color: var(--muted); margin-bottom: 6mm; }
    .back-contacts { display: grid; gap: 3mm; }
    .back-logo { position: absolute; left: 20mm; bottom: 20mm; height: 8mm; width: auto; }

    /* ─── Rozdziały ─── */
    .summary, .chapter { break-before: page; }
    .chapter-kicker {
        display: flex; align-items: center; gap: 3mm;
        font-size: 7.5pt; color: var(--black);
        border-bottom: 1px solid var(--hairline);
        padding-bottom: 3mm; margin-bottom: 9mm;
        break-after: avoid;
    }
    .chapter-num { background: var(--lime); padding: 1.2pt 5pt; border-radius: 99px; font-weight: 500; }
    .block { margin-bottom: 9mm; }
    .block:last-child { margin-bottom: 0; }
    .block.keep { break-inside: avoid; }
    .section-head { break-inside: avoid; break-after: avoid; }
    .intro { font-size: 10.5pt; line-height: 1.45; color: var(--muted); margin: 0 0 5mm; max-width: 150mm; }
    .footnote { font-size: 8.5pt; color: var(--muted); margin-top: 4mm; max-width: 160mm; break-inside: avoid; }

    /* ─── W skrócie ─── */
    .tldr { list-style: none; padding: 0; margin: 0 0 7mm; }
    .tldr li { display: flex; gap: 4mm; font-size: 10.5pt; line-height: 1.5; padding: 1.2mm 0; max-width: 160mm; }
    .tldr .bullet { margin-top: 2mm; }
    .decision {
        background: var(--white);
        display: grid; grid-template-columns: 1fr 1fr;
        border-radius: 3mm; overflow: hidden;
        margin-bottom: 8mm; break-inside: avoid;
    }
    .decision > div { padding: 5mm 6mm; }
    .decision > div + div { border-left: 1px solid var(--hairline-soft); }
    .decision.single { grid-template-columns: 1fr; }
    .decision-text { font-size: 12pt; line-height: 1.35; }
    .decision-price { font-size: 22pt; letter-spacing: -0.02em; line-height: 1.05; margin-bottom: 1.5mm; }
    .decision-note { font-size: 8.5pt; color: var(--muted); }
    .decision-foot { grid-column: 1 / -1; border-top: 1px solid var(--hairline-soft); padding: 3.5mm 6mm !important; border-left: 0 !important; font-size: 8.5pt; color: var(--muted); }
    .toc { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--hairline); }
    .toc li { display: grid; grid-template-columns: 12mm 1fr; gap: 3mm; padding: 2.2mm 0; border-bottom: 1px solid var(--hairline); break-inside: avoid; }
    .toc-num { font-size: 8pt; padding-top: 1mm; }
    .toc-name { font-size: 11pt; }
    .toc-sub { font-size: 8.5pt; color: var(--muted); margin-top: 0.8mm; }
    /* Gdy "W skrócie" nie mieści się na stronie, build dokłada .tight (patrz fitSummary). */
    .summary.tight .toc-sub { display: none; }
    .summary.tight .tldr li { font-size: 9.5pt; padding: 0.8mm 0; }
    .summary.tight .decision > div { padding: 4mm 5mm; }

    /* ─── Statystyki ─── */
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5mm; }
    .stat { border-top: 1px solid var(--black); padding-top: 3mm; break-inside: avoid; }
    .stat-value { font-size: 17pt; line-height: 1.1; margin-bottom: 1.8mm; letter-spacing: -0.02em; }
    .stat-label { font-size: 8.5pt; color: var(--muted); line-height: 1.4; }

    /* ─── Problemy ─── */
    .problems { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
    .problems.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
    .problem { background: var(--white); border-radius: 3mm; padding: 5mm; border: 1.5px solid transparent; break-inside: avoid; }
    .problem.is-selected { border-color: var(--lime); }
    .problem-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 2mm; margin-bottom: 3mm; }
    .problem-label { font-size: 7pt; color: var(--muted); }
    .problem h3 { font-size: 11.5pt; }
    .problem-metric { font-family: var(--font-mono); font-size: 7.5pt; line-height: 1.45; margin: 0 0 3mm; }
    .problem-body { font-size: 8.8pt; color: var(--muted); line-height: 1.5; }
    blockquote { border-left: 2px solid var(--lime); padding-left: 4mm; font-style: italic; color: var(--muted); font-size: 9pt; margin: 3mm 0 0; }

    /* ─── Podejście ─── */
    .approach ul { list-style: none; padding: 0; margin: 0 0 4mm; max-width: 155mm; }
    .approach li { display: flex; gap: 4mm; padding: 1.1mm 0; font-size: 10pt; line-height: 1.5; break-inside: avoid; }
    .check {
        display: inline-flex; align-items: center; justify-content: center;
        width: 5.5mm; height: 5.5mm; flex-shrink: 0; margin-top: 0.4mm;
        background: var(--lime); border-radius: 99px; font-size: 8pt; font-weight: 700;
    }
    .callout {
        border-left: 2px solid var(--lime); padding: 0.5mm 0 0.5mm 5mm;
        font-style: italic; color: var(--muted); font-size: 9.5pt; line-height: 1.5;
        max-width: 155mm; margin-top: 5mm; break-inside: avoid;
    }

    /* ─── Listy ─── */
    .list { list-style: none; padding: 0; margin: 0; }
    .list li { display: flex; gap: 3mm; padding: 1mm 0; font-size: 9.5pt; line-height: 1.5; break-inside: avoid; }
    .bullet { width: 1.6mm; height: 1.6mm; background: var(--lime); flex-shrink: 0; margin-top: 1.9mm; }
    .list.cols-2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 7mm; }
    .terms { margin-top: 5mm; }
    .terms li { font-size: 9pt; }

    /* ─── Karty faz ─── */
    .phase {
        background: var(--white); border-radius: 3mm;
        padding: 6mm; margin-bottom: 5mm;
        -webkit-box-decoration-break: clone; box-decoration-break: clone;
    }
    .phase:last-child { margin-bottom: 0; }
    .phase-top { break-inside: avoid; break-after: avoid; }
    .phase-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4mm; }
    .phase-duration { font-size: 7pt; color: var(--muted); }
    .phase-title-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8mm; margin-bottom: 5mm; }
    .phase-title-row h3 { font-size: 15pt; margin: 0; }
    .phase-price-block { text-align: right; flex-shrink: 0; max-width: 72mm; }
    .phase-price { font-size: 19pt; letter-spacing: -0.02em; line-height: 1; margin-bottom: 1.5mm; white-space: nowrap; }
    .phase-price-note { font-size: 8pt; color: var(--muted); line-height: 1.35; }
    .phase-block { margin-top: 5mm; }
    .phase-top + .phase-block { margin-top: 0; }
    .phase-block:has(.list) { break-inside: avoid; }
    .block-title { font-size: 12pt; margin-bottom: 3mm; }
    .features { display: grid; grid-template-columns: 1fr 1fr 1fr; border-top: 1px solid var(--hairline); }
    .feature { padding: 3.5mm 4mm 4mm 0; border-bottom: 1px solid var(--hairline); break-inside: avoid; }
    .feature + .feature { }
    .feature:not(:nth-child(3n+1)) { padding-left: 4mm; border-left: 1px solid var(--hairline); }
    .feature-num { font-size: 7pt; color: var(--muted); margin-bottom: 2mm; }
    .feature-title { font-size: 10pt; font-weight: 500; line-height: 1.25; margin-bottom: 1.5mm; }
    .feature-desc { font-size: 8.5pt; color: var(--muted); line-height: 1.45; }

    /* ─── Kafelki modułów ─── */
    .tile-group { margin-bottom: 6mm; break-inside: avoid; }
    .tile-group:last-of-type { margin-bottom: 0; }
    .tile-group-head { display: flex; align-items: baseline; gap: 4mm; margin-bottom: 3mm; }
    .tile-group-head h3 { font-size: 13pt; margin: 0; }
    .tile-group-head .mono-label { margin: 0; }
    .tiles { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; }
    .tile {
        background: var(--white); border-radius: 3mm; padding: 4mm;
        border: 1.5px solid transparent;
        display: flex; flex-direction: column; min-width: 0; break-inside: avoid;
    }
    .tile.featured { border-color: var(--lime); }
    .tile-top { display: flex; justify-content: space-between; align-items: center; gap: 2mm; margin-bottom: 3mm; }
    .tile-badge { font-size: 6pt; color: var(--muted); text-align: right; }
    .tile-title { font-size: 10.5pt; font-weight: 500; line-height: 1.25; margin-bottom: 2mm; }
    .tile-desc { font-size: 8.3pt; color: var(--muted); line-height: 1.4; flex: 1; margin-bottom: 3mm; }
    .tile-foot { border-top: 1px solid var(--hairline); padding-top: 2.8mm; }
    .tile-price { font-size: 13pt; line-height: 1.1; margin-bottom: 1.2mm; letter-spacing: -0.01em; }
    .tile-duration { font-size: 6.5pt; color: var(--muted); }
    .tile-note { font-size: 7.5pt; color: var(--muted); line-height: 1.4; margin-top: 1.5mm; }

    /* ─── Grupy, tabele ─── */
    .groups { display: grid; grid-template-columns: 1fr 1fr; gap: 7mm 9mm; }
    .group { break-inside: avoid; }
    .data-table { width: 100%; border-collapse: collapse; background: var(--white); font-size: 9pt; line-height: 1.45; }
    .data-table th {
        font-size: 6.5pt; color: var(--muted); font-weight: 400; text-align: left;
        padding: 3mm 4mm; border-bottom: 1px solid var(--hairline); vertical-align: bottom;
    }
    .data-table td { padding: 2.8mm 4mm; border-bottom: 1px solid var(--hairline-soft); vertical-align: top; }
    .data-table tr { break-inside: avoid; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table .cell-main { width: 34%; }
    .data-table .cell-muted { color: var(--muted); }
    .appendix .data-table { font-size: 8.3pt; line-height: 1.4; }
    .appendix .data-table td { padding: 2mm 3.5mm; }

    /* ─── Harmonogram ─── */
    .timeline { border-top: 1px solid var(--hairline); }
    .timeline-row {
        display: grid; grid-template-columns: 34mm 1fr; gap: 5mm;
        padding: 3mm 0; border-bottom: 1px solid var(--hairline); break-inside: avoid;
    }
    .timeline-period { font-size: 7.5pt; color: var(--muted); padding-top: 1mm; }
    .timeline-label { font-size: 11pt; margin-bottom: 0.8mm; }
    .timeline-desc { font-size: 9pt; color: var(--muted); line-height: 1.5; }

    /* ─── Ceny ─── */
    .pricing-table { width: 100%; border-collapse: collapse; background: var(--white); break-inside: avoid; }
    .pricing-table td { padding: 3.2mm 5mm; border-bottom: 1px solid var(--hairline-soft); vertical-align: top; }
    .row-label { font-size: 10pt; margin-bottom: 0.8mm; }
    .row-note { font-size: 8.5pt; color: var(--muted); }
    .row-price { font-size: 13pt; text-align: right; white-space: nowrap; letter-spacing: -0.01em; }
    .total-row td { background: var(--lime); border-bottom: none; padding-top: 4mm; padding-bottom: 4mm; vertical-align: middle; }
    .total-label { font-size: 11pt; font-weight: 500; }
    .total-value { font-size: 18pt; }
    .saldeo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
    .saldeo-value { font-size: 14pt; line-height: 1.3; margin: 0 0 5mm; }

    /* ─── Następne kroki ─── */
    .next-steps { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--hairline); break-inside: avoid; }
    .next-steps li {
        display: grid; grid-template-columns: 14mm 1fr; gap: 3mm; align-items: baseline;
        padding: 3mm 0; border-bottom: 1px solid var(--hairline); font-size: 10.5pt; line-height: 1.5;
        break-inside: avoid;
    }
    .step-num { font-size: 7.5pt; font-weight: 500; }
</style>
</head>
<body>

    <!-- OKŁADKA -->
    <section class="cover">
        <div class="cover-top">
            <img class="cover-logo" src="${assets.logo}" alt="Workshift">
            <span class="cover-mono">${[meta.confidential === false ? '' : 'Poufne', meta.version ? `Wersja ${esc(meta.version)}` : ''].filter(Boolean).join(' · ')}</span>
        </div>
        <div class="cover-main">
            <div class="cover-mono cover-eyebrow">Oferta · ${esc(clientShort)}</div>
            <h1 class="cover-title">${esc(meta.title)}</h1>
            <div class="accent-bar"></div>
            ${meta.subtitle ? `<p class="cover-sub">${esc(meta.subtitle)}</p>` : ''}
        </div>
        <div class="cover-meta">
            ${offer.client.contact ? `<div><span class="meta-label">Przygotowane dla</span><div class="meta-value">${esc(offer.client.contact)}${offer.client.role ? `<small>${esc(offer.client.role)}</small>` : ''}</div></div>` : ''}
            <div><span class="meta-label">Przygotował</span><div class="meta-value">${esc(contact.name)}<small>${esc(contact.company)}</small></div></div>
            ${meta.dateSent ? `<div><span class="meta-label">Data</span><div class="meta-value">${esc(fmtDatePL(meta.dateSent))}</div></div>` : ''}
            ${meta.validUntil ? `<div><span class="meta-label">Ważna do</span><div class="meta-value">${esc(fmtDatePL(meta.validUntil))}</div></div>` : ''}
        </div>
        <img class="cover-motif" src="${assets.motifCover}" alt="" aria-hidden="true">
    </section>

    ${hasSummaryPage ? `
    <!-- W SKRÓCIE -->
    <section class="summary">
        <div class="chapter-kicker"><span>W skrócie</span></div>
        ${Array.isArray(offer.tldr) && offer.tldr.length ? `<ul class="tldr">${renderDeliverables(offer.tldr)}</ul>` : ''}
        ${offer.pricing ? `
        <div class="decision${summary.decision ? '' : ' single'}">
            ${summary.decision ? `
            <div>
                <span class="mono-label">${esc(summary.decisionLabel || 'Pierwsza decyzja')}</span>
                <div class="decision-text">${esc(summary.decision)}</div>
            </div>` : ''}
            <div>
                <span class="mono-label">${esc(offer.pricing.totalLabel)}</span>
                <div class="decision-price">${esc(offer.pricing.total)}</div>
                ${summary.totalNote ? `<div class="decision-note">${esc(summary.totalNote)}</div>` : ''}
            </div>
            ${meta.validUntil ? `<div class="decision-foot">Oferta ważna do ${esc(fmtDatePL(meta.validUntil))}.${summary.footNote ? ` ${esc(summary.footNote)}` : ''}</div>` : ''}
        </div>` : ''}
        <div class="mono-label">Spis treści</div>
        <ol class="toc">${tocItems.map((t) => `
            <li>
                <span class="toc-num">${t.raw ? t.num : esc(t.num)}</span>
                <div><div class="toc-name">${esc(t.name)}</div>${t.sub.length ? `<div class="toc-sub">${t.sub.map(esc).join(' · ')}</div>` : ''}</div>
            </li>`).join('')}
        </ol>
    </section>` : ''}

    ${chapterHtml}

    ${appendixHtml.trim() ? `
    <!-- ZAŁĄCZNIK -->
    <section class="chapter appendix">
        <div class="chapter-kicker"><span class="chapter-num">A</span><span>${esc(appendixName)}</span></div>
        ${appendixHtml}
    </section>` : ''}

    <!-- TYLNA OKŁADKA -->
    <section class="back">
        <img class="back-motif" src="${assets.motifBack}" alt="" aria-hidden="true">
        <div class="back-inner${hasNextSteps ? ' with-steps' : ''}">
            ${hasNextSteps ? `
            <div class="cover-mono">Co dalej</div>
            <h2 class="back-title">${esc(L.nextStepsTitle)}</h2>
            <ol class="next-steps">${renderNextSteps(offer.nextSteps)}</ol>
            <div class="cover-mono back-contact-label">Kontakt</div>` : `
            <div class="cover-mono">Kontakt</div>
            <h2 class="back-title">${esc(contact.headline || 'Pytania do oferty? Najszybciej przez telefon albo mail.')}</h2>`}
            <div class="back-person">
                <img class="back-photo" src="${assets.photo}" alt="${esc(contact.name)}">
                <div>
                    <div class="back-name">${esc(contact.name)}</div>
                    <div class="back-role">${esc(contact.role || contact.company)}</div>
                    <div class="back-contacts">
                        <div><span class="meta-label">E-mail</span><div class="meta-value">${esc(contact.email)}</div></div>
                        ${contact.phone ? `<div><span class="meta-label">Telefon</span><div class="meta-value">${esc(contact.phone)}</div></div>` : ''}
                        <div><span class="meta-label">Strona</span><div class="meta-value">${esc(contact.web)}</div></div>
                    </div>
                </div>
            </div>
        </div>
        <img class="back-logo" src="${assets.logo}" alt="Workshift">
    </section>

</body>
</html>`;
}

const LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const LATIN_EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';
// Inter w PDF ze statycznych instancji (lead-magnets/fonts, wycięte z public/fonts przez
// `fonttools varLib.instancer ... wght=400|500`). Font zmienny Chrome osadza jako Type 3,
// który część przeglądarek PDF renderuje słabiej; statyczny trafia do PDF jako TrueType.
const FONT_FACES = [
    ['Inter', '400', 'lead-magnets/fonts/inter-400-latin.woff2', LATIN],
    ['Inter', '400', 'lead-magnets/fonts/inter-400-latin-ext.woff2', LATIN_EXT],
    ['Inter', '500 700', 'lead-magnets/fonts/inter-500-latin.woff2', LATIN],
    ['Inter', '500 700', 'lead-magnets/fonts/inter-500-latin-ext.woff2', LATIN_EXT],
    ['IBM Plex Mono', '400', 'public/fonts/plex-mono-400-latin.woff2', LATIN],
    ['IBM Plex Mono', '400', 'public/fonts/plex-mono-400-latin-ext.woff2', LATIN_EXT],
    ['IBM Plex Mono', '500', 'public/fonts/plex-mono-500-latin.woff2', LATIN],
    ['IBM Plex Mono', '500', 'public/fonts/plex-mono-500-latin-ext.woff2', LATIN_EXT],
];

async function dataUri(rel, mime) {
    const buf = await fs.readFile(path.join(ROOT, rel));
    return `data:${mime};base64,${buf.toString('base64')}`;
}

// Fonty, logo, motywy i zdjęcie jako data URI: HTML w offers/out działa sam, bez serwera i bez
// fontów zainstalowanych w systemie.
async function loadAssets(offer) {
    const fontFaces = (await Promise.all(FONT_FACES.map(async ([family, weight, file, range]) => `
    @font-face {
        font-family: '${family}'; font-style: normal; font-weight: ${weight}; font-display: block;
        src: url('${await dataUri(file, 'font/woff2')}') format('woff2');
        unicode-range: ${range};
    }`))).join('');
    const motif = (n) => `public/brand/motifs/ws-motif-${n}-light.svg`;
    return {
        fontFaces,
        logo: await dataUri('public/brand/logo/ws-logo-light.svg', 'image/svg+xml'),
        motifCover: await dataUri(motif(offer.meta?.coverMotif || '01-warstwy'), 'image/svg+xml'),
        motifBack: await dataUri(motif('04-kolumna'), 'image/svg+xml'),
        photo: await dataUri('public/Jakub-Bednarz.webp', 'image/webp'),
    };
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
    const offer = mod.default || mod[path.basename(slug)];
    if (!offer) {
        console.error(`Plik ${dataFile} musi mieć export default z obiektem oferty.`);
        process.exit(1);
    }

    const html = renderHTML(offer, await loadAssets(offer));

    const today = new Date().toISOString().slice(0, 10);
    const outPath = path.join(ROOT, 'offers', 'out', `${slug}-${today}.pdf`);
    const htmlPath = path.join(ROOT, 'offers', 'out', `${slug}-${today}.html`);
    await fs.mkdir(path.dirname(outPath), { recursive: true });

    // Zapisz też HTML - przydatne do debugowania i jako standalone artifact.
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
        // Szerokość pola treści strony (210 - 2 x 20 mm), żeby kontrola przepełnienia liczyła jak w druku.
        await page.setViewport({ width: Math.round((170 / 25.4) * 96), height: 1200 });
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('print');
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(async () => {
            const img = document.querySelector('.back-photo');
            if (!img) return;
            await img.decode();
            const w = 520;
            const canvas = Object.assign(document.createElement('canvas'), { width: w, height: Math.round(w * img.naturalHeight / img.naturalWidth) });
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = canvas.toDataURL('image/jpeg', 0.85);
            await img.decode();
        });

        // "W skrócie" ma być jedną stroną: wysokość pola treści A4 to 297 - 20 - 22 mm.
        const tightened = await page.evaluate(() => {
            const el = document.querySelector('.summary');
            const max = (255 / 25.4) * 96;
            if (!el || el.scrollHeight <= max) return false;
            el.classList.add('tight');
            return el.scrollHeight > max ? 'nadal za długa' : true;
        });
        if (tightened) console.log(`▶ Strona "W skrócie" zagęszczona${tightened === true ? '' : ` (${tightened})`}`);

        const overflow = await page.evaluate(() => {
            const limit = document.documentElement.clientWidth + 1;
            return [...document.querySelectorAll('.summary *, .chapter *')]
                .filter((el) => el.getBoundingClientRect().right > limit)
                .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
                .slice(0, 10);
        });
        if (overflow.length) console.warn(`⚠ Elementy szersze niż pole treści: ${overflow.join(', ')}`);

        console.log(`▶ Drukuję PDF...`);
        await page.pdf({
            path: outPath,
            printBackground: true,
            preferCSSPageSize: true,
            outline: true,
            tagged: true,
        });

        const stat = await fs.stat(outPath);
        console.log(`✓ PDF zapisany: ${outPath} (${(stat.size / 1024).toFixed(1)} kB)`);

        if (offer.meta?.version) {
            const sendPath = path.join(ROOT, 'offers', 'out', `Workshift-oferta-${fileSafe(offer.client.name)}-v${offer.meta.version}.pdf`);
            await fs.copyFile(outPath, sendPath);
            console.log(`✓ Kopia do wysyłki: ${sendPath}`);
        }
    } finally {
        await browser.close();
    }
}

build().catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
});
