// Template wzorzec danych oferty per klient.
// Dla nowego klienta: skopiuj do `api/_data/offers/<slug>.js` (gitignored)
// i dopisz hasło do .env.local jako OFFER_PASSWORD_<SLUG_UPPER>.
//
// Wszystkie pola opcjonalne - pomiń sekcję, której nie chcesz pokazywać.
// Domyślny ton: "Pan" / "Państwo" (formalny, bezpieczny dla księgowo-prawnych
// i mature klientów). "Ty" tylko gdy klient sam ustalił przejście. Bez
// zwrotów "klient" w trzeciej osobie (sztuczne, self-referential).

export default {
    slug: 'example-client',

    client: {
        name: 'Example Sp. z o.o.',
        contact: 'Imię Nazwisko',
        role: 'Rola, np. CEO',
    },

    meta: {
        title: 'Tytuł oferty',
        subtitle: 'Podtytuł / kontekst skąd ta oferta',
        dateSent: '2026-MM-DD',
        validUntil: '2026-MM-DD',
        author: 'Jakub Bednarz · Workshift',
        // PDF: wersja na okładce, w stopce i w nazwie kopii do wysyłki
        // (offers/out/Workshift-oferta-<Klient>-v<wersja>.pdf).
        version: '1.0',
        // PDF: motyw okładki z public/brand/motifs (domyślnie '01-warstwy').
        coverMotif: '01-warstwy',
        // PDF: false ukrywa „Poufne" na okładce.
        confidential: true,
    },

    // PDF, strona „W skrócie": pierwsza decyzja obok rekomendowanego startu (pricing.total).
    summary: {
        decision: 'Etap 0: ... 3 tygodnie, X XXX PLN netto.',
        totalNote: 'co obejmuje kwota startu',
    },

    // PDF, tylna okładka. Telefon tylko w pliku klienta (gitignored), nigdy w kodzie.
    contact: {
        phone: '',
    },

    // Opcjonalne: video embed w hero (Loom, YouTube). Jeśli null → ukryte.
    video: {
        provider: 'loom', // 'loom' | 'youtube'
        id: 'XXXXXXXX',
        title: 'Krótkie wprowadzenie do oferty',
    },

    context: {
        headline: 'Co ustaliliśmy na spotkaniu',
        stats: [
            { value: '~200', label: 'klientów' },
            // 4 kafelki działają najlepiej
        ],
    },

    problems: [
        {
            id: 'proces-a',
            label: 'Proces A',
            title: 'Tytuł problemu',
            metric: 'Skala problemu w liczbach',
            body: 'Krótki opis bólu, 2-3 zdania.',
            quote: 'Pull-quote który podsumowuje koszt status quo.',
            selected: true, // jeden problem oznacz jako pilot
        },
    ],

    approach: {
        headline: 'Krótkie zdanie z rekomendacją.',
        reasons: ['Powód 1', 'Powód 2', 'Powód 3'],
        callout: 'Callout w italics - dodatkowe wyjaśnienie podejścia.',
    },

    pilot: {
        label: 'Pilotaż · 3-4 tygodnie',
        title: 'Co budujemy',
        price: 'X XXX PLN',
        priceNote: 'netto, warunki fakturowania',
        duration: '3-4 tygodnie',
        deliverables: ['Element 1', 'Element 2'],
    },

    asysta: {
        label: 'Po pilotażu · 3 miesiące',
        title: 'Asysta wdrożeniowa',
        price: 'X XXX PLN / miesiąc',
        priceNote: 'netto, fakturowane miesięcznie z dołu',
        duration: '3 miesiące',
        deliverables: ['Element 1', 'Element 2'],
        callout: 'Co dzieje się po 3 miesiącach - decyzja razem.',
    },

    timeline: [
        { period: 'Tydz. 1', label: 'Faza', desc: 'Opis fazy' },
    ],

    pricing: {
        rows: [
            { label: 'Pozycja 1', price: 'X XXX PLN', note: 'detal' },
        ],
        total: 'X XXX PLN netto',
        totalLabel: 'Razem',
        footnote: 'Stopka cenowa.',
    },

    saldeo: {
        // Opcjonalna sekcja "drugi krok". Jeśli null → ukryta.
        label: 'Drugi krok',
        title: 'Co dalej',
        subtitle: 'Wyceniamy osobno',
        deliverables: ['Element 1'],
        value: 'Szacowana wartość',
        note: 'Zastrzeżenie / kontekst wyceny',
    },

    // Sekcje dodatkowe: type 'table' | 'groups' | 'list' | 'tiles'. Miejsce w dokumencie:
    //   position: 'beforePhases' - rozdział z podejściem i mapą modułów (przed fazami)
    //   position: 'afterPhases'  - rozdział z fazami, po „Po Państwa stronie" (np. „Poza zakresem")
    //   (brak position)          - rozdział „Jak pracujemy"
    //   position: 'afterPricing' - zaraz po cenach (np. koszty stałe po stronie klienta)
    //   position: 'appendix'     - załącznik na końcu PDF (np. odpowiedzi na punkty RFP)
    // Strona www renderuje 'beforePhases' przed fazami, resztę po nich, w kolejności z danych.
    sections: [],

    // W PDF lądują na tylnej okładce, obok kontaktu.
    nextSteps: [
        'Krok 1',
        'Krok 2',
    ],
};
