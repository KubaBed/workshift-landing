/**
 * PDF generator dla lead magnetów Workshift.
 *
 * Renderuje branded HTML (sage bg / lime accent / Inter) przez Puppeteer
 * i zapisuje do public/lead-magnets/. Dostępne jako static asset:
 *   workshift.pl/lead-magnets/<slug>.pdf
 *
 * Usage:
 *   npm run build:checklista
 *   # lub bezpośrednio:
 *   node lead-magnets/build-pdf.mjs kancelaria
 *
 * Dodawanie nowych branż: dorzuć obiekt do CHECKLISTY z tą samą strukturą.
 */

import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── DANE CHECKLIST ──────────────────────────────────────────────────────────

const CHECKLISTY = {
    kancelaria: {
        slug: 'checklista-12-procesow-w-kancelarii',
        title: '12 procesów do zautomatyzowania w polskiej kancelarii',
        subtitle:
            'Praktyczna checklista dla partnerów i prawników, którzy chcą odzyskać czas — bez ryzyka RODO.',
        intro:
            'Listę 50 narzędzi AI dla prawnika znajdziesz w 100 newsletterach. Ta checklista jest inna. Pracujemy z polskimi kancelariami od 2024. Każdy z 12 procesów poniżej faktycznie wdrożyliśmy w polskiej kancelarii (małej lub średniej), jest RODO-zgodny, ma policzalną oszczędność i wymaga konkretnego narzędzia — nie "AI ogólnie".',
        savingsHook:
            'Łączna oszczędność z wdrożenia wszystkich 12: ~12-18h tygodniowo na 5-osobową kancelarię.',
        howToRead: [
            { icon: '🕐', label: 'Jak teraz', desc: 'Status quo + ile to czasu' },
            { icon: '🤖', label: 'Jak z AI', desc: 'Konkretny tool + workflow' },
            { icon: '⚖️', label: 'RODO', desc: 'Ograniczenia, on-prem? Anonimizacja?' },
            { icon: '💰', label: 'Oszczędność', desc: 'Godziny tygodniowo / na osobę' },
            { icon: '🛠', label: 'Stack', desc: 'Konkretne narzędzia + integracje' },
        ],
        procesy: [
            {
                n: 1,
                title: 'Notatki ze spotkań klienckich',
                jakTeraz:
                    'Prawnik notuje ręcznie podczas spotkania (rozprasza klienta), potem 30-45 min spisuje notatkę dla teczki sprawy. Zwykle 4-8 spotkań/tydzień/prawnik.',
                jakAi:
                    'Spotkanie nagrywane (online lub onsite). Whisper / Speechmatics transkrypcja → Claude lub GPT-4o ekstrakcja w strukturze (decyzje, deadliny, akcje, ryzyka prawne). Notatka w 30 sekund po spotkaniu, prawnik akceptuje/poprawia.',
                rodo:
                    'OK pod warunkiem zgody klienta na nagrywanie (klauzula informacyjna w umowie). Self-hosted Whisper (na laptopie partnera) eliminuje wysyłkę do US. Claude/GPT API z DPA zawartym przez kancelarię.',
                oszczednosc: '3-5h tygodniowo na prawnika. Dla 5-osobowej kancelarii: 15-25h/tydz.',
                stack:
                    'Otter.ai / Fireflies (online) lub Whisper local (onsite) + Claude API + automatyczny zapis do iManage / SharePoint / Notion.',
            },
            {
                n: 2,
                title: 'Anonimizacja dokumentów',
                jakTeraz:
                    'Junior lub paralegal ręcznie zaciemnia imiona, PESEL, adresy w dokumentach przed wysłaniem trzeciej stronie. 15-30 min/dokument. 5-10 dokumentów/tydzień.',
                jakAi:
                    'Custom skrypt z NER (Named Entity Recognition) wytrenowanym na polskim → rozpoznaje osoby, organizacje, miejsca, numery → automatyczne maskowanie z opcją review przed exportem. PDF in → anonimizowany PDF out.',
                rodo:
                    'Self-hosted ABSOLUTNIE wymagane (wysyłka oryginałów do API trzeciej strony = naruszenie). spaCy + polski model NER + Tesseract OCR — wszystko na infrastrukturze kancelarii.',
                oszczednosc:
                    '2-4h tygodniowo na kancelarię. Plus zerowe ryzyko ludzkiego błędu (przeoczenie pojedynczego nazwiska w 80-stronicowym dokumencie).',
                stack:
                    'Python + spaCy (pl model) + presidio (Microsoft) + Tesseract / pdfplumber. Działa na laptopie, nie wymaga chmury.',
            },
            {
                n: 3,
                title: 'Ekstrakcja terminów i klauzul z umów',
                jakTeraz:
                    'Prawnik czyta nową umowę (8-30 stron) i ręcznie wypisuje: strony, daty, kwoty, kary umowne, terminy wypowiedzenia, klauzule jurysdykcji, RODO. 30-90 min/umowa. 10-20 umów/tydzień.',
                jakAi:
                    'Umowa PDF → OCR (jeśli skan) → Claude/GPT z structured output schema (JSON Schema z polami) → automatyczna tabela w Excel/Notion + alerty kalendarzowe na deadliny.',
                rodo:
                    'Z DPA OK dla większości firm. Dla umów z klientami zawierającymi dane wrażliwe — preferuj Azure OpenAI EU lub Anthropic z EU residency. Można zrobić local-first: Llama 3.1 70B na własnej infrastrukturze.',
                oszczednosc:
                    '5-8h tygodniowo na prawnika zajmującego się umowami. Dla 5-osobowej kancelarii skupionej na M&A/handlowych: 20-35h/tydz.',
                stack:
                    'Claude Sonnet 4 z structured output + n8n (workflow) + Airtable/Notion (DB) + Google Calendar API (deadliny).',
            },
            {
                n: 4,
                title: 'Monitoring legislacji + alerty',
                jakTeraz:
                    'Senior partner czyta Dziennik Ustaw, Monitor Polski, biuletyn KIRP, newsletter Rzeczpospolitej. Filtruje co istotne dla klientów. Notatka do klienta. 2-4h tygodniowo.',
                jakAi:
                    'Web scraper (RSS lub bezpośredni scraping ISAP) → AI klasyfikator per branża klientów ("ten akt dotyczy: handel, RODO, podatki") → automatyczne podsumowanie 3-5 zdaniami → mail/Slack do partnera tylko gdy hit dla aktywnego klienta.',
                rodo:
                    'Legislacja jest publiczna, więc OK. Tylko mapowanie "który klient z mojej bazy = która branża" wymaga internalnej DB — ale to nie wychodzi poza kancelarię.',
                oszczednosc:
                    '2-3h tygodniowo na partnera. Plus efekt jakościowy: nigdy nie przegapiasz aktu prawnego ważnego dla klienta = mniej "przepraszam, że nie zauważyliśmy".',
                stack: 'Python scraper + Claude/GPT-4o + Slack API + Notion (per-klient tagi).',
            },
            {
                n: 5,
                title: 'Draftowanie typowych pism',
                jakTeraz:
                    'Prawnik kopiuje stary template (z innego klienta), edytuje pod nowy stan faktyczny, sprawdza precedensy, formatuje. 1-3h/pismo. Zwykle 5-15 pism/tydzień.',
                jakAi:
                    'Wewnętrzna baza precedensów kancelarii (Twoje wcześniejsze pisma) → RAG → Claude generuje pierwszy draft pod konkretny stan faktyczny + cytuje konkretne wcześniejsze sprawy z bazy. Prawnik dopina merytorykę, polishuje.',
                rodo:
                    'Stara baza pism = zwykle dane klientów. Konieczna anonimizacja przed wektoryzacją (patrz #2) lub on-prem RAG (np. Llama + ChromaDB lokalnie).',
                oszczednosc:
                    '30-50% czasu na pismo. Przy 10 pismach × 2h = 20h tygodniowo zaoszczędzone 8-12h.',
                stack:
                    'ChromaDB / Pinecone (vector DB) + Claude Sonnet 4 (generation) + custom UI (lub Continue.dev w VSCode dla prawników z technicznym backgroundem).',
            },
            {
                n: 6,
                title: 'Custom chat na bazie wiedzy kancelarii',
                jakTeraz:
                    'Junior pyta seniora "jakie były klauzule w sprawie X 3 lata temu", "jakie mamy template do leasingu samochodowego", "jakie precedensy mamy w sprawach RODO". Senior musi pamiętać lub szukać. 1-3h tygodniowo na szukanie.',
                jakAi:
                    'Slack bot lub web app — junior pisze pytanie po polsku, RAG na bazie wszystkich pism + opinii + memorandów + maili z poprzednich spraw. Bot odpowiada z cytatami źródłowymi (link do oryginału w iManage).',
                rodo:
                    'Dane historyczne w RAG = wszystkie dane klientów. Decyzja architektoniczna: anonimizacja przed indeksowaniem (patrz #2), lub on-prem (Llama + ChromaDB), lub Azure OpenAI EU z izolowaną infrastrukturą per klient.',
                oszczednosc:
                    '1-2h tygodniowo na juniora, ale prawdziwa wartość = senior nie jest przerywany. Compound effect na produktywność senior = nieliczalna.',
                stack: 'Slack API + Claude / Llama lokalnie + ChromaDB + iManage/SharePoint connector.',
            },
            {
                n: 7,
                title: 'Klasyfikacja i routing maili przychodzących',
                jakTeraz:
                    'Recepcja / asystent przegląda info@ albo office@ skrzynkę. Sortuje: "do partnera X", "do paralegal", "spam", "klient pyta o status sprawy", "nowa potencjalna sprawa". 1-2h dziennie.',
                jakAi:
                    'Mail przychodzi → AI klasyfikuje (kategoria + sugerowany odbiorca + sugerowana priorytet) → tagi w Gmail/Outlook + draftuje odpowiedź dla "łatwych" maili (status sprawy, terminy, pytania ogólne) — asystent tylko approval one-click.',
                rodo:
                    'Treść maili = często dane wrażliwe. Ten case wymaga lub on-prem (Llama) lub bardzo precyzyjnego DPA z dostawcą + EU residency. Dla małej kancelarii: można zacząć od heurystyk (regex na keywords) + AI tylko dla 20% niesklasyfikowanych.',
                oszczednosc: '5-7h tygodniowo na asystenta / recepcję.',
                stack: 'Gmail API / Microsoft Graph + Claude (klasyfikacja) + n8n (workflow) + Slack notification.',
            },
            {
                n: 8,
                title: 'KYC i sprawdzenie klienta',
                jakTeraz:
                    'Asystent sprawdza KRS, REGON, listy sankcyjne (UE, USA, ONZ), beneficial owner, ewentualnie media monitoring. 30-60 min/nowy klient. 5-15 nowych klientów/mies.',
                jakAi:
                    'Workflow: NIP/PESEL/REGON → automatyczne pobranie z KRS API + REGON BIR + sprawdzenie list sankcyjnych (Open Sanctions API) + scraping wiadomości (Google News API) → AI sumuje i wskazuje red flags → asystent dostaje raport + decyduje.',
                rodo:
                    'OK — dane są publiczne. Ważne: trzymać raport w teczce klienta dla audytu compliance.',
                oszczednosc:
                    '3-5h tygodniowo na kancelarię. Plus: zerowe przeoczenia (np. klient nagle na liście sankcyjnej rok po onboardingu).',
                stack:
                    'Python + KRS API + REGON + Open Sanctions + Google News API + Claude (red flag analysis) + raport PDF.',
            },
            {
                n: 9,
                title: 'Rejestr umów i terminy',
                jakTeraz:
                    'Excel z wszystkimi umowami klienckimi. Asystent / paralegal pamięta o terminach wypowiedzenia, renewalach, datach kar umownych. Excel "puchnie", terminy się gubią. 2-3h tygodniowo na utrzymanie.',
                jakAi:
                    'Połączenie #3 (ekstrakcja z umów) + automatyczny rejestr w bazie + alerty 30/14/7 dni przed terminem do partnera odpowiedzialnego. Excel zostaje, ale AI sam wpina nowe rekordy + utrzymuje aktualność.',
                rodo: 'OK — wewnętrzny rejestr.',
                oszczednosc:
                    '2-3h tygodniowo na asystenta + zero przegapionych terminów = uniknięte koszty/ryzyka.',
                stack:
                    'Airtable / Notion DB + automatyczne wpisywanie z #3 + Slack/email alerts (n8n) + Google Calendar sync.',
            },
            {
                n: 10,
                title: 'Klauzule abuzywne — analiza wzorców umów',
                jakTeraz:
                    'Klient (B2C, ubezpieczyciel, deweloper) prosi o przegląd swoich wzorców umów pod kątem klauzul abuzywnych z rejestru UOKiK. Prawnik czyta, porównuje z rejestrem (kilka tysięcy klauzul), wskazuje ryzykowne. 4-8h/wzór.',
                jakAi:
                    'Wzór umowy → ekstrakcja klauzul → semantyczne porównanie z embeddingsami rejestru UOKiK → ranking podobieństwa → AI generuje "to jest klauzula podobna do X.Y.Z z rejestru, sugerujemy zmianę na ...". Prawnik weryfikuje top 20 wskazanych.',
                rodo:
                    'Wzór klienta = jego własność intelektualna. DPA z dostawcą lub on-prem. Rejestr UOKiK jest publiczny.',
                oszczednosc:
                    '2-4h na wzór umowy. Skala: dla kancelarii z 10 review wzorców rocznie = 30-50h rocznie.',
                stack:
                    'UOKiK rejestr scraper → embedding (text-embedding-3-large) → ChromaDB / Pinecone → Claude (semantic comparison + generation).',
            },
            {
                n: 11,
                title: 'Korespondencja masowa (faktury, noty, monity)',
                jakTeraz:
                    'Asystent / paralegal przygotowuje masowe wysyłki: noty obciążeniowe do dłużników klientów, monity, prośby o uzupełnienie dokumentów. 30-60 min na 50 dokumentów. Co 1-2 tygodnie.',
                jakAi:
                    'Mail merge na sterydach: AI podstawia personalizację + dostosowuje ton (firma vs osoba prywatna, pierwszy monit vs trzeci) + sprawdza czy adres prawidłowy + automatycznie generuje PDF + mail z trackingiem doręczenia.',
                rodo: 'OK — to dane Twoich klientów + ich kontrahentów. Standardowa zgoda biznesowa.',
                oszczednosc: '1-2h tygodniowo na asystenta.',
                stack:
                    'n8n + Google Docs API (templates) + Claude (personalization) + DocuSign / e-podpis (jeśli wymagany).',
            },
            {
                n: 12,
                title: 'Przygotowanie do rozprawy',
                jakTeraz:
                    'Prawnik na 1-2 dni przed rozprawą czyta całą teczkę (pisma stron, postanowienia, dowody), robi notatki do wystąpienia, przygotowuje pytania do świadków. 4-8h/sprawa.',
                jakAi:
                    'AI sumuje całą teczkę → kluczowe daty, kluczowe argumenty drugiej strony, sprzeczności w zeznaniach świadków, brakujące dowody. Prawnik dostaje 3-stronicowy executive summary + sugerowane pytania → buduje wystąpienie.',
                rodo:
                    'Teczka klienta. Wymagane self-hosted lub Azure OpenAI EU z DPA. Najbardziej wrażliwy z 12 use case-ów.',
                oszczednosc:
                    '2-3h na sprawę. Skala: prawnik z 5 sprawami/tydzień = 10-15h tyg.',
                stack:
                    'Llama 3.1 70B on-prem (preferowane) lub Azure OpenAI EU + Claude API z DPA. PDF parser (pdfplumber) + structured output. Custom UI w przeglądarce.',
            },
        ],
    },
};

// ─── HTML TEMPLATE ───────────────────────────────────────────────────────────

function renderHtml(data) {
    const procesyHtml = data.procesy
        .map(
            (p) => `
        <article class="proces">
          <header class="proces-h">
            <span class="proces-num">#${p.n}</span>
            <h3>${escapeHtml(p.title)}</h3>
          </header>
          <div class="proces-body">
            <div class="row">
              <div class="ico">🕐</div>
              <div class="content"><strong>Jak teraz:</strong> ${escapeHtml(p.jakTeraz)}</div>
            </div>
            <div class="row">
              <div class="ico">🤖</div>
              <div class="content"><strong>Jak z AI:</strong> ${escapeHtml(p.jakAi)}</div>
            </div>
            <div class="row">
              <div class="ico">⚖️</div>
              <div class="content"><strong>RODO:</strong> ${escapeHtml(p.rodo)}</div>
            </div>
            <div class="row savings">
              <div class="ico">💰</div>
              <div class="content"><strong>Oszczędność:</strong> ${escapeHtml(p.oszczednosc)}</div>
            </div>
            <div class="row">
              <div class="ico">🛠</div>
              <div class="content"><strong>Stack:</strong> ${escapeHtml(p.stack)}</div>
            </div>
          </div>
        </article>`
        )
        .join('');

    return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(data.title)}</title>
<style>
  /* Print + screen base */
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #0a0a0a;
    background: #e8e9d8; /* sage */
    font-size: 10.5pt;
    line-height: 1.55;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .container { padding: 0; }

  /* Cover */
  .cover {
    page-break-after: always;
    padding: 60mm 0 0;
    background: #e8e9d8;
  }
  .cover .badge {
    display: inline-block;
    background: #c5ff00;
    color: #0a0a0a;
    font-size: 9pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    padding: 5px 11px;
    border-radius: 999px;
    margin-bottom: 18mm;
  }
  .cover h1 {
    font-size: 32pt;
    line-height: 1.05;
    margin: 0 0 10mm 0;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .cover h1 .accent { color: #6f8b00; }
  .cover .subtitle {
    font-size: 13pt;
    color: #4a4a4a;
    line-height: 1.45;
    max-width: 140mm;
    margin: 0 0 20mm;
  }
  .cover .savings-hook {
    border-left: 3px solid #c5ff00;
    padding: 4mm 6mm;
    background: #fff;
    border-radius: 0 6px 6px 0;
    font-size: 11pt;
    margin: 0 0 25mm;
    max-width: 150mm;
  }
  .cover .footer-mark {
    position: absolute;
    bottom: 18mm;
    left: 16mm;
    right: 16mm;
    display: flex;
    justify-content: space-between;
    font-size: 9pt;
    color: #4a4a4a;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .cover .footer-mark strong { color: #0a0a0a; }

  /* Page 2: how to read */
  .howread {
    page-break-after: always;
  }
  .howread h2, .procesy h2 {
    font-size: 18pt;
    margin: 0 0 6mm;
    letter-spacing: -0.01em;
  }
  .howread .lead {
    font-size: 11pt;
    color: #2a2a2a;
    line-height: 1.6;
    margin: 0 0 10mm;
  }
  .howread .legend {
    background: #fff;
    border-radius: 6px;
    padding: 6mm 7mm;
    margin: 0 0 8mm;
  }
  .howread .legend-row {
    display: flex;
    align-items: flex-start;
    gap: 4mm;
    padding: 2.5mm 0;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  .howread .legend-row:last-child { border-bottom: 0; }
  .howread .legend-ico {
    font-size: 14pt;
    width: 8mm;
    flex-shrink: 0;
  }
  .howread .legend-label {
    font-weight: 600;
    width: 38mm;
    flex-shrink: 0;
  }
  .howread .legend-desc { color: #4a4a4a; }

  /* Procesy */
  .procesy { padding: 0; }
  .proces {
    background: #fff;
    border-radius: 6px;
    padding: 7mm 8mm;
    margin: 0 0 5mm;
    page-break-inside: avoid;
    border: 1px solid rgba(0,0,0,0.06);
  }
  .proces-h {
    display: flex;
    align-items: baseline;
    gap: 4mm;
    margin: 0 0 4mm;
    padding: 0 0 3mm;
    border-bottom: 1px solid rgba(0,0,0,0.08);
  }
  .proces-num {
    font-size: 18pt;
    font-weight: 700;
    color: #c5ff00;
    background: #0a0a0a;
    padding: 1mm 3mm;
    border-radius: 4px;
    line-height: 1;
  }
  .proces-h h3 {
    font-size: 13pt;
    margin: 0;
    flex: 1;
    letter-spacing: -0.01em;
  }
  .proces-body { display: flex; flex-direction: column; gap: 2.2mm; }
  .row { display: flex; align-items: flex-start; gap: 3mm; }
  .row .ico { font-size: 11pt; width: 6mm; flex-shrink: 0; padding-top: 0.5mm; }
  .row .content { flex: 1; font-size: 10pt; line-height: 1.5; }
  .row .content strong { color: #0a0a0a; }
  .row.savings .content { color: #2a2a2a; }
  .row.savings { background: rgba(197,255,0,0.18); padding: 2mm 3mm; border-radius: 4px; margin: 1mm -3mm; }

  /* Footer page */
  .closing {
    page-break-before: always;
    background: #0a0a0a;
    color: #fff;
    padding: 25mm 0;
    margin: 0 -16mm -18mm;
    padding-left: 16mm;
    padding-right: 16mm;
  }
  .closing h2 {
    font-size: 22pt;
    margin: 0 0 6mm;
    letter-spacing: -0.01em;
  }
  .closing p { font-size: 11pt; line-height: 1.6; color: rgba(255,255,255,0.78); margin: 0 0 5mm; }
  .closing .cta-block {
    background: #c5ff00;
    color: #0a0a0a;
    padding: 8mm 8mm;
    border-radius: 6px;
    margin: 8mm 0 0;
  }
  .closing .cta-block h3 { font-size: 14pt; margin: 0 0 3mm; }
  .closing .cta-block p { color: #1a1a1a; margin: 0 0 5mm; }
  .closing .cta-url { font-weight: 700; font-size: 12pt; }
  .closing .next {
    margin: 10mm 0 0;
    padding: 6mm 0 0;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .closing .next h4 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(255,255,255,0.55); margin: 0 0 4mm; }
  .closing .next ul { margin: 0; padding: 0 0 0 18px; }
  .closing .next li { font-size: 10pt; color: rgba(255,255,255,0.78); margin: 0 0 2mm; }
  .closing .next a { color: #c5ff00; text-decoration: none; }
  .closing .small { font-size: 8.5pt; color: rgba(255,255,255,0.4); margin-top: 8mm; }

  /* Page-running header (logo + URL) */
  .runhead {
    position: fixed;
    top: -12mm;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #4a4a4a;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
  .runhead .brand { font-weight: 700; color: #0a0a0a; }
  .runhead .brand .dot { display: inline-block; width: 6px; height: 6px; background: #c5ff00; border-radius: 50%; margin-right: 4px; vertical-align: middle; }
</style>
</head>
<body>
  <div class="container">

    <!-- COVER -->
    <section class="cover">
      <span class="badge">Bezpłatny lead magnet · Workshift</span>
      <h1>${escapeHtml(data.title.split(' w polskiej kancelarii')[0])}<br/><span class="accent">w polskiej kancelarii.</span></h1>
      <p class="subtitle">${escapeHtml(data.subtitle)}</p>
      <div class="savings-hook"><strong>${escapeHtml(data.savingsHook)}</strong></div>
      <div class="footer-mark">
        <span><strong>workshift.pl</strong></span>
        <span>kontakt@workshift.pl</span>
      </div>
    </section>

    <!-- HOW TO READ -->
    <section class="howread">
      <div class="runhead">
        <span class="brand"><span class="dot"></span>Workshift</span>
        <span>workshift.pl/diagnoza</span>
      </div>
      <h2>Jak czytać tę listę</h2>
      <p class="lead">${escapeHtml(data.intro)}</p>
      <div class="legend">
        ${data.howToRead
            .map(
                (h) => `
          <div class="legend-row">
            <div class="legend-ico">${h.icon}</div>
            <div class="legend-label">${escapeHtml(h.label)}</div>
            <div class="legend-desc">${escapeHtml(h.desc)}</div>
          </div>`
            )
            .join('')}
      </div>
      <p class="lead"><strong>Zacznij od procesów z największą oszczędnością.</strong> Zwykle to <strong>#1 (notatki ze spotkań)</strong> i <strong>#3 (ekstrakcja terminów)</strong>.</p>
    </section>

    <!-- PROCESY -->
    <section class="procesy">
      <div class="runhead">
        <span class="brand"><span class="dot"></span>Workshift</span>
        <span>12 procesów do automatyzacji w polskiej kancelarii</span>
      </div>
      <h2>Lista 12 procesów</h2>
      ${procesyHtml}
    </section>

    <!-- CLOSING -->
    <section class="closing">
      <h2>Co teraz?</h2>
      <p><strong>Krok 1:</strong> Zaznacz w ostatniej kolumnie listy 1-3 procesy, które najbardziej "boli" w Twojej kancelarii. Nie 12 — wybierz najwyższy ROI.</p>
      <p><strong>Krok 2:</strong> Daj nam 30 minut. Pokażemy: architekturę dla 1-3 wybranych procesów, stack RODO-zgodny dla Twojej kancelarii, estymację czasu i kosztu, co już mamy gotowe z innej kancelarii.</p>

      <div class="cta-block">
        <h3>Bezpłatna 30-min diagnoza</h3>
        <p>30 minut Twojego czasu. Zero zobowiązań. Konkretne rekomendacje od ręki.</p>
        <div class="cta-url">→ workshift.pl/diagnoza</div>
      </div>

      <div class="next">
        <h4>Co znajdziesz dalej na workshift.pl</h4>
        <ul>
          <li><a>Kalkulator strat czasowych</a> — w 60 sekund zobaczysz ile Twoja kancelaria traci miesięcznie</li>
          <li><a>Newsletter „AI Praktycznie"</a> — co dwa tygodnie jeden konkretny proces z liczbami</li>
          <li><a>Blog</a> — case studies + tutoriale</li>
          <li><a>kontakt@workshift.pl</a> · <a>LinkedIn Jakub Bednarz</a></li>
        </ul>
      </div>

      <p class="small">© 2026 Workshift. Możesz udostępnić tę checklistę. Nie modyfikuj treści ani brandingu.</p>
    </section>

  </div>
</body>
</html>`;
}

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── BUILD ───────────────────────────────────────────────────────────────────

async function buildPdf(slug) {
    const data = CHECKLISTY[slug];
    if (!data) {
        console.error(`✗ Brak checklisty dla slugu: "${slug}". Dostępne: ${Object.keys(CHECKLISTY).join(', ')}`);
        process.exit(1);
    }

    const outDir = path.join(ROOT, 'public', 'lead-magnets');
    await fs.mkdir(outDir, { recursive: true });

    const html = renderHtml(data);
    // Save HTML preview obok PDF — ułatwia iterowanie stylów bez relaunchowania puppeteer
    await fs.writeFile(path.join(outDir, `${data.slug}.html`), html, 'utf8');

    const browser = await puppeteer.launch({ headless: 'new' });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('print');
        const pdfPath = path.join(outDir, `${data.slug}.pdf`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            margin: { top: '18mm', bottom: '18mm', left: '16mm', right: '16mm' },
            printBackground: true,
            preferCSSPageSize: true,
        });
        const stat = await fs.stat(pdfPath);
        console.log(`✓ ${data.slug}.pdf (${(stat.size / 1024).toFixed(1)} KB) → ${pdfPath}`);
        console.log(`  Public URL po deploy: workshift.pl/lead-magnets/${data.slug}.pdf`);
    } finally {
        await browser.close();
    }
}

// CLI
const slug = process.argv[2] || 'kancelaria';
buildPdf(slug).catch((err) => {
    console.error('✗ Build failed:', err);
    process.exit(1);
});
