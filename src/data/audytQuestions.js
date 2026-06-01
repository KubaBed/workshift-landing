/**
 * Mikro-audyt AI - dane pytań, scoring i rekomendacje.
 *
 * Źródło prawdy (KB): wiki/projects/workshift-czerwiec-mikro-audyt-pytania.md (locked v1)
 *
 * Architektura:
 *  - Ekran 0: kontekst (branża + wielkość) - bez punktów, tylko personalizacja.
 *  - 12 pytań w 4 sekcjach × 3, każde 4 opcje za 0/1/2/3 pkt → max 36.
 *  - 3 progi (strojone stałe THRESHOLDS): zielony / żółty / czerwony.
 *  - Wynik personalizowany 2-warstwowo: top-3 rekomendacje per najwyżej
 *    punktowane pytania + fallback per branża.
 */

// ── Progi (TUNABLE - koryguj po 20-30 realnych wynikach) ───────────────────
export const MAX_SCORE = 36;
export const THRESHOLDS = {
    greenMax: 12, // 0-12  → zielony
    yellowMax: 24, // 13-24 → żółty; 25-36 → czerwony
};

// ── Kontekst (ekran 0) ─────────────────────────────────────────────────────
export const BRANZE = [
    { id: 'ecommerce', label: 'E-commerce / sklep online', emoji: '🛒' },
    { id: 'ksiegowosc', label: 'Prawo / Księgowość', emoji: '⚖️' },
    { id: 'agencja', label: 'Agencja marketingowa / kreatywna', emoji: '🎨' },
    { id: 'produkcja', label: 'Produkcja / logistyka', emoji: '🏭' },
    { id: 'uslugi', label: 'Usługi B2B / konsulting', emoji: '💼' },
    { id: 'inne', label: 'Inna branża', emoji: '🔧' },
];

export const WIELKOSC = [
    { id: 'micro', label: '1-5 osób' },
    { id: 'small', label: '6-15 osób' },
    { id: 'mid', label: '16-50 osób' },
    { id: 'large', label: '51-150 osób' },
    { id: 'xl', label: '150+ osób' },
];

// ── Pytania (4 sekcje × 3) ─────────────────────────────────────────────────
// Każda opcja: { label, p } gdzie p = punkty (0-3). Kolejność = rosnący ból.
export const SECTIONS = [
    {
        id: 'operacje',
        title: 'Operacje',
        emoji: '⚙️',
        questions: [
            {
                id: 'q1',
                text: 'Ile godzin tygodniowo Twój zespół traci łącznie na przepisywaniu danych między systemami (Excel, ERP, CRM, mail, fakturowanie)?',
                options: [
                    { label: '0-2h - mamy to zautomatyzowane', p: 0 },
                    { label: '3-8h - trochę, ale akceptowalnie', p: 1 },
                    { label: '9-20h - to istotny problem', p: 2 },
                    { label: '20+h - to praca pełnego etatu', p: 3 },
                ],
            },
            {
                id: 'q2',
                text: 'Jak często firma popełnia błędy w fakturach, zamówieniach lub umowach z powodu ręcznego wprowadzania danych?',
                options: [
                    { label: 'Praktycznie nigdy', p: 0 },
                    { label: 'Kilka razy w roku', p: 1 },
                    { label: 'Co najmniej raz w miesiącu', p: 2 },
                    { label: 'Co najmniej raz w tygodniu', p: 3 },
                ],
            },
            {
                id: 'q3',
                text: 'Czy istnieje proces, o którym wiesz, że „robi się ręcznie, bo zawsze tak było" - mimo że jest powtarzalny i nudny?',
                options: [
                    { label: 'Nie kojarzę takiego', p: 0 },
                    { label: 'Może jeden', p: 1 },
                    { label: '2-3 takie procesy', p: 2 },
                    { label: 'Wiele takich procesów', p: 3 },
                ],
            },
        ],
    },
    {
        id: 'sprzedaz',
        title: 'Sprzedaż',
        emoji: '📈',
        questions: [
            {
                id: 'q4',
                text: 'Jak długo średnio czekasz na pierwszą odpowiedź do klienta od momentu, gdy zostawił zapytanie (formularz, mail, telefon)?',
                options: [
                    { label: 'Poniżej 15 minut', p: 0 },
                    { label: '15 min - 2h', p: 1 },
                    { label: '2h - 24h', p: 2 },
                    { label: 'Powyżej 24h', p: 3 },
                ],
            },
            {
                id: 'q5',
                text: 'Jak wygląda kwalifikacja leadów (sprawdzenie firmy, ocena dopasowania) przed wpisaniem do CRM?',
                options: [
                    { label: 'Zautomatyzowana - enrichment + scoring', p: 0 },
                    { label: 'Robi to asystent/sekretariat, szybko', p: 1 },
                    { label: 'Robi to handlowiec, traci na to czas', p: 2 },
                    { label: 'Nie kwalifikujemy - lecimy na każdy lead', p: 3 },
                ],
            },
            {
                id: 'q6',
                text: 'Ile follow-upów / przypomnień handlowych Twój zespół wysyła ręcznie w tygodniu?',
                options: [
                    { label: 'Wszystkie są zautomatyzowane', p: 0 },
                    { label: 'Kilka tygodniowo', p: 1 },
                    { label: 'Kilkanaście tygodniowo', p: 2 },
                    { label: 'Kilkadziesiąt+ - to pół etatu', p: 3 },
                ],
            },
        ],
    },
    {
        id: 'support',
        title: 'Obsługa klienta',
        emoji: '💬',
        questions: [
            {
                id: 'q7',
                text: 'Jaki procent zapytań od klientów to powtarzające się pytania (status zamówienia, faktura, jak coś zrobić, gdzie zwroty)?',
                options: [
                    { label: 'Poniżej 10%', p: 0 },
                    { label: '10-30%', p: 1 },
                    { label: '30-60%', p: 2 },
                    { label: 'Powyżej 60% - większość to to samo', p: 3 },
                ],
            },
            {
                id: 'q8',
                text: 'Ile godzin dziennie Twój zespół łącznie spędza na obsłudze powtarzalnych zapytań mailowych?',
                options: [
                    { label: 'Poniżej 1h dziennie', p: 0 },
                    { label: '1-3h', p: 1 },
                    { label: '3-8h (cały etat)', p: 2 },
                    { label: '8h+ (więcej niż pełny etat)', p: 3 },
                ],
            },
            {
                id: 'q9',
                text: 'Ile średnio wiadomości „tam i z powrotem" zajmuje zamknięcie typowego zapytania klienta?',
                options: [
                    { label: '1 - odpowiadamy kompletnie od razu', p: 0 },
                    { label: '2-3 wiadomości', p: 1 },
                    { label: '4-5 wiadomości', p: 2 },
                    { label: '6+ albo różnie, potrafi się ciągnąć', p: 3 },
                ],
            },
        ],
    },
    {
        id: 'raporty',
        title: 'Raportowanie',
        emoji: '📊',
        questions: [
            {
                id: 'q10',
                text: 'Ile dni roboczych w miesiącu zespół łącznie poświęca na przygotowanie raportów (sprzedażowych, finansowych, operacyjnych)?',
                options: [
                    { label: 'Poniżej 1 dnia łącznie', p: 0 },
                    { label: '1-3 dni', p: 1 },
                    { label: '4-7 dni', p: 2 },
                    { label: '8+ dni', p: 3 },
                ],
            },
            {
                id: 'q11',
                text: 'Skąd zbieracie dane do raportu zarządczego?',
                options: [
                    { label: 'Jeden dashboard, wszystko live', p: 0 },
                    { label: '2-3 systemy, sklejam ręcznie raz w miesiącu', p: 1 },
                    { label: '4-6 systemów + Excel', p: 2 },
                    { label: 'Z wielu źródeł, za każdym razem inaczej', p: 3 },
                ],
            },
            {
                id: 'q12',
                text: 'Gdy szef pyta „jaka jest sprzedaż za ostatnie 30 dni?" - ile trwa, zanim dostanie odpowiedź z danymi?',
                options: [
                    { label: 'Sekundy - widzi sam w systemie', p: 0 },
                    { label: 'Kilka minut', p: 1 },
                    { label: 'Godziny', p: 2 },
                    { label: 'Następny dzień lub dłużej', p: 3 },
                ],
            },
        ],
    },
];

// Spłaszczona lista pytań w kolejności prezentacji (z metadanymi sekcji).
export const QUESTIONS = SECTIONS.flatMap((s, si) =>
    s.questions.map((q, qi) => ({
        ...q,
        sectionId: s.id,
        sectionTitle: s.title,
        sectionEmoji: s.emoji,
        sectionIndex: si,
        globalIndex: si * 3 + qi,
    }))
);

export const TOTAL_QUESTIONS = QUESTIONS.length; // 12

// ── Rekomendacje per pytanie (gdy pytanie ma wysoki score 2-3) ─────────────
export const RECOMMENDATIONS_BY_QUESTION = {
    q1: 'Integracja systemów w jeden workflow (n8n / Make) - koniec ręcznego przepisywania.',
    q2: 'OCR + walidacja danych - błędy w fakturach i zamówieniach spadają do zera.',
    q3: 'Audyt procesów wskaże 1-3 „ciche" automatyzacje z najszybszym zwrotem.',
    q4: 'Auto-responder + routing leadów - pierwsza odpowiedź w sekundy, nie godziny.',
    q5: 'Enrichment + scoring leadów - handlowiec dostaje gotową, ocenioną listę.',
    q6: 'Automatyczne sekwencje follow-up - przypomnienia wychodzą same, nic nie ginie.',
    q7: 'Chatbot / baza wiedzy na powtarzalne pytania - odpowiada bez angażowania zespołu.',
    q8: 'Agent AI na skrzynkę - rutynowe maile obsługiwane automatycznie 24/7.',
    q9: 'Uproszczenie ścieżki obsługi - kompletna odpowiedź za pierwszym razem.',
    q10: 'Automatyczne raporty (Sheets / BI) - generują się same, bez sklejania ręcznie.',
    q11: 'Integracja danych w jedno źródło - koniec silosów i ręcznego zbierania.',
    q12: 'Live dashboard + zapytania w języku naturalnym (RAG) - odpowiedź od ręki.',
};

// Fallback per branża (gdy mniej niż 3 pytania trafione wysoko).
export const REKOMENDACJE_BRANZA = {
    ecommerce: [
        'Agent BOK na „gdzie moja paczka" - część zapytań rozwiązana bez człowieka.',
        'Synchronizacja zamówienia ↔ księgowość ↔ magazyn.',
        'Automatyczne kreacje reklamowe i opisy produktów.',
    ],
    ksiegowosc: [
        'Analiza i ekstrakcja danych z dokumentów (faktury, umowy, pisma) - koniec ręcznego przepisywania i przeszukiwania.',
        'Monitoring terminów i zmian w przepisach - automatyczne alerty (deklaracje, terminy procesowe, nowe orzecznictwo).',
        'Automatyczne notatki ze spotkań i powtarzalna komunikacja z klientami.',
    ],
    agencja: [
        'Pipeline kreacji AI z brandbookiem - setki wariantów reklam.',
        'Automatyczne raporty kampanii dla klientów.',
        'Briefy i propozycje generowane na bazie historii klienta.',
    ],
    produkcja: [
        'Automatyczne raporty z wielu systemów (2 dni → 15 min).',
        'OCR dokumentów magazynowych i zamówień.',
        'Synchronizacja CRM ↔ kalendarz ↔ mail.',
    ],
    uslugi: [
        'Onboarding klienta - maile, dokumenty, kalendarze automatycznie.',
        'Wewnętrzny asystent wiedzy firmowej (RAG).',
        'Automatyczne raportowanie projektów z narzędzi.',
    ],
    inne: [
        'Audyt procesów wskaże 2-3 najszybsze automatyzacje (ROI w 3-6 mies).',
        'Integracja narzędzi w jeden workflow - bez zmiany SaaS-ów.',
        'Szkolenie zespołu - korzystają z AI w codziennej pracy od jutra.',
    ],
};

// ── Logika scoringu ────────────────────────────────────────────────────────

/** Suma punktów z mapy odpowiedzi { qId: optionIndex }. */
export function computeScore(answers) {
    return QUESTIONS.reduce((sum, q) => {
        const idx = answers[q.id];
        if (idx == null) return sum;
        return sum + (q.options[idx]?.p ?? 0);
    }, 0);
}

/** Próg na podstawie wyniku: 'green' | 'yellow' | 'red'. */
export function getTier(score) {
    if (score <= THRESHOLDS.greenMax) return 'green';
    if (score <= THRESHOLDS.yellowMax) return 'yellow';
    return 'red';
}

/** Copy + kolor + układ CTA per próg. */
export const TIERS = {
    green: {
        key: 'green',
        emoji: '🟢',
        label: 'Działasz sprawnie',
        headline: 'Twoja firma działa sprawnie',
        body: 'Masz uporządkowane procesy i większość rutyny już zautomatyzowaną. AI da Ci raczej punktowe usprawnienia niż wielkie skoki - i to dobra pozycja.',
        cta: 'newsletter',
    },
    yellow: {
        key: 'yellow',
        emoji: '🟡',
        label: 'Widać potencjał',
        headline: 'Widać 2-3 obszary z wyraźnym potencjałem',
        body: 'Są u Ciebie konkretne miejsca, gdzie AI dałoby szybki zwrot. Mogę przygotować imienny raport z rekomendacjami pod Twoją branżę - co zacząć, w jakiej kolejności, jaki ROI.',
        cta: 'report',
    },
    red: {
        key: 'red',
        emoji: '🔴',
        label: 'Pilna potrzeba',
        headline: 'Twoja firma traci kilkadziesiąt godzin tygodniowo',
        body: 'Przy Twoim poziomie nieefektywności audyt zwraca się zwykle w pierwszym wdrożeniu. To nie pytanie „czy" automatyzować, tylko „gdzie zacząć".',
        cta: 'call',
    },
};

/**
 * Top-3 rekomendacje: bierze pytania z najwyższym score (≥2 pkt),
 * mapuje przez RECOMMENDATIONS_BY_QUESTION, dopełnia rekomendacjami branży.
 */
export function getTopRecommendations(answers, branzaId, limit = 3) {
    const scored = QUESTIONS.map((q) => ({
        id: q.id,
        p: q.options[answers[q.id]]?.p ?? 0,
    }))
        .filter((x) => x.p >= 2)
        .sort((a, b) => b.p - a.p);

    const recs = [];
    const seen = new Set();
    for (const s of scored) {
        const r = RECOMMENDATIONS_BY_QUESTION[s.id];
        if (r && !seen.has(r)) {
            recs.push(r);
            seen.add(r);
        }
        if (recs.length >= limit) break;
    }

    // Dopełnij rekomendacjami branżowymi jeśli za mało trafień.
    if (recs.length < limit) {
        const fallback = REKOMENDACJE_BRANZA[branzaId] || REKOMENDACJE_BRANZA.inne;
        for (const r of fallback) {
            if (!seen.has(r)) {
                recs.push(r);
                seen.add(r);
            }
            if (recs.length >= limit) break;
        }
    }

    return recs.slice(0, limit);
}
