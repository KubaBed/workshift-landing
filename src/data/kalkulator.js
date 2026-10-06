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
    { label: '100 PLN/h', value: 100, hint: 'specjaliści' },
    { label: '150 PLN/h', value: 150, hint: 'seniorzy, kierownicy' },
    { label: '200 PLN/h', value: 200, hint: 'eksperci, partnerzy' },
    { label: '300 PLN/h', value: 300, hint: 'zarząd, najlepiej opłacani eksperci' },
];

// Personalizowane rekomendacje per branża (mapowane na usługi Workshift).
export const REKOMENDACJE = {
    kancelaria: [
        'Automatyczne notatki ze spotkań (oszczędza ~40 min/spotkanie)',
        'Anonimizacja dokumentów RODO (sekundy zamiast minut)',
        'Monitoring legislacji + alerty (ręcznie 2-4h/tyg → 0)',
    ],
    ecommerce: [
        'Agent BOK na "gdzie moja paczka" (40% zapytań rozwiązanych bez człowieka)',
        'Automatyczne kreacje reklamowe (200 wariantów w 2 dni)',
        'Synchronizacja zamówień ↔ księgowość ↔ magazyn',
    ],
    produkcja: [
        'OCR faktur przychodzących + auto-kategoryzacja (16h/tyg → 0.5h)',
        'Raporty miesięczne automatycznie z 5 systemów (2 dni → 15 min)',
        'Synchronizacja CRM ↔ kalendarz ↔ mail',
    ],
    agencja: [
        'Kreacje reklamowe AI według brandbooka (setki wariantów reklam)',
        'Automatyczne briefy i propozycje na bazie historii klienta',
        'Generatywne wideo i animacje produktowe',
    ],
    uslugi: [
        'Onboarding klienta - automatyczne maile, dokumenty, kalendarze',
        'Raportowanie projektów na podstawie danych z narzędzi',
        'Wewnętrzny asystent, który odpowiada na pytania o wiedzę firmową',
    ],
    inne: [
        'Rozmowa diagnostyczna wskaże 2-3 najszybsze automatyzacje (ROI w 3-6 mies)',
        'Integracja narzędzi, których już używasz, w jeden workflow',
        'Szkolenie zespołu z AI na przykładach z jego codziennej pracy',
    ],
};

/**
 * Ile straconych godzin realnie wraca po automatyzacji.
 * Konserwatywnie: w praktyce wdrożenia zwracają 40-60%, liczymy dolną granicę.
 */
export const RECOVERY_RATE = 0.4;

/**
 * Godziny tracone miesięcznie = godziny/tydz. na osobę * 4.33 * osoby + dni raportów * 8h.
 * Dni raportów to pytanie o CAŁY zespół (krok 4 kalkulatora), więc nie mnożymy ich
 * przez liczbę osób (błąd do 06.10.2026: mnożyliśmy, wynik był zawyżony).
 */
export const WEEKS_PER_MONTH = 4.33;
export const HOURS_PER_REPORT_DAY = 8;

/**
 * Wynik kalkulatora - jedno źródło wzoru dla strony (/kalkulator) i maila
 * z wynikiem (api/kalkulator-submit.js).
 */
export function computeKalkulator({ zespol, godzinyTyg, dniRaportow, kosztH }) {
    const osoby = ZESPOLY.find((z) => z.id === zespol)?.value || 0;
    const godzinyMies = godzinyTyg * WEEKS_PER_MONTH * osoby + dniRaportow * HOURS_PER_REPORT_DAY;
    const kosztMies = Math.round(godzinyMies * kosztH);
    const kosztRok = kosztMies * 12;
    const odzyskMies = Math.round(godzinyMies * RECOVERY_RATE);
    const odzyskKwoteMies = Math.round(odzyskMies * kosztH);
    const odzyskKwoteRok = odzyskKwoteMies * 12;
    return { osoby, godzinyMies, kosztMies, kosztRok, odzyskMies, odzyskKwoteMies, odzyskKwoteRok };
}

/** Założenia wyliczenia nazwane wprost - pokazywane pod wynikiem i w mailu. */
export function kalkulatorAssumptions(zespol) {
    const z = ZESPOLY.find((x) => x.id === zespol);
    const weeks = String(WEEKS_PER_MONTH).replace('.', ',');
    return [
        `Godziny miesięcznie = godziny tygodniowo na osobę x ${weeks} x liczba osób + dni raportów całego zespołu x ${HOURS_PER_REPORT_DAY} h.`,
        `Miesiąc liczymy jako ${weeks} tygodnia, a jeden dzień pracy nad raportami jako ${HOURS_PER_REPORT_DAY} h.`,
        z
            ? `Liczba osób to środek wybranego przedziału (${z.label}: ${z.value}).`
            : 'Liczba osób to środek wybranego przedziału wielkości zespołu.',
        `Do odzyskania przyjmujemy ${Math.round(RECOVERY_RATE * 100)}% tych godzin.`,
    ];
}
