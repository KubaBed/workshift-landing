/**
 * Dane kalkulatora strat czasowych - branże, wielkości zespołu, stawki
 * i rekomendacje per branża.
 *
 * Wyciągnięte z `src/pages/KalkulatorStratPage.jsx`, bo ta sama treść jest
 * potrzebna w dwóch miejscach: w interaktywnym kalkulatorze (React) oraz
 * w statycznym fallbacku, który generuje `scripts/build-seo-html.mjs`
 * dla crawlerów bez JS. Ten sam wzorzec co `src/data/services.js`.
 */

export const BRANZE = [
    { id: 'kancelaria', label: 'Kancelaria prawna', emoji: '⚖️' },
    { id: 'ecommerce', label: 'E-commerce / sklep online', emoji: '🛒' },
    { id: 'produkcja', label: 'Firma produkcyjna / dystrybucyjna', emoji: '🏭' },
    { id: 'agencja', label: 'Agencja marketingowa / kreatywna', emoji: '🎨' },
    { id: 'uslugi', label: 'Usługi B2B / konsulting', emoji: '💼' },
    { id: 'inne', label: 'Inna branża', emoji: '🔧' },
];

export const ZESPOLY = [
    { id: 1, label: '1-5 osób', value: 3 },
    { id: 2, label: '6-15 osób', value: 10 },
    { id: 3, label: '16-50 osób', value: 30 },
    { id: 4, label: '51-150 osób', value: 90 },
    { id: 5, label: '150+ osób', value: 200 },
];

export const KOSZTY = [
    { label: '50 PLN/h', value: 50, hint: 'asystenci, młodsi specjaliści' },
    { label: '100 PLN/h', value: 100, hint: 'specjaliści, mid-level' },
    { label: '150 PLN/h', value: 150, hint: 'seniorzy, kierownicy' },
    { label: '200 PLN/h', value: 200, hint: 'eksperci, partnerzy' },
    { label: '300 PLN/h', value: 300, hint: 'C-level, top talent' },
];

// Personalizowane rekomendacje per branża (mapowane na usługi Workshift).
export const REKOMENDACJE = {
    kancelaria: [
        'Automatyczne notatki ze spotkań (oszczędza ~40 min/spotkanie)',
        'Anonimizacja dokumentów RODO (sekundy zamiast minut)',
        'Monitoring legislacji + alerty (ręcznie 2-4h/tyg → 0)',
    ],
    ecommerce: [
        'Agent BOK na "gdzie moja paczka" (40% zapytań solved bez człowieka)',
        'Automatyczne kreacje reklamowe (200 wariantów w 2 dni)',
        'Synchronizacja zamówień ↔ księgowość ↔ magazyn',
    ],
    produkcja: [
        'OCR faktur przychodzących + auto-kategoryzacja (16h/tyg → 0.5h)',
        'Raporty miesięczne automatycznie z 5 systemów (2 dni → 15 min)',
        'Synchronizacja CRM ↔ kalendarz ↔ mail',
    ],
    agencja: [
        'Pipeline kreacji AI z brandbookiem (LoRA) - setki wariantów reklam',
        'Automatyczne briefy i propozycje na bazie historii klienta',
        'Generatywne wideo i animacje produktowe',
    ],
    uslugi: [
        'Onboarding klienta - automatyczne maile, dokumenty, kalendarze',
        'Raportowanie projektów na podstawie danych z narzędzi',
        'Wewnętrzny asystent wiedzy firmowej (RAG)',
    ],
    inne: [
        'Audyt procesów wskaże 2-3 najszybsze automatyzacje (ROI w 3-6 mies)',
        'Integracja narzędzi w jeden workflow - bez zmiany SaaSów',
        'Szkolenie zespołu - od jutra korzystają z AI w codziennej pracy',
    ],
};

/**
 * Ile straconych godzin realnie wraca po automatyzacji.
 * Konserwatywnie: w praktyce wdrożenia zwracają 40-60%, liczymy dolną granicę.
 */
export const RECOVERY_RATE = 0.4;

/** Godziny tracone miesięcznie = (godziny/tydz. * 4.33 + dni raportów * 8h) * osoby. */
export const WEEKS_PER_MONTH = 4.33;
export const HOURS_PER_REPORT_DAY = 8;
