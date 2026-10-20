/**
 * Treść strony /narzedzia/szkic. Czytają ją dwie warstwy:
 *   - SzkicPage.jsx (to, co widzi człowiek),
 *   - scripts/seo-routes.mjs (statyczny fallback dla crawlerów bez JS).
 * Zmiana tekstu tutaj zmienia obie naraz.
 *
 * Źródło faktów: ~/Projekty/szkic/README.md i SPEC.md (wersja 0.2).
 */

// Zaślepki do czasu notaryzacji Apple i upublicznienia repo. Przed wdrożeniem na produkcję
// podmień oba adresy na prawdziwe (DMG z Developer ID, repo na GitHubie).
export const SZKIC_DOWNLOAD_URL = '/downloads/Szkic.dmg';
export const SZKIC_REPO_URL = 'https://github.com/KubaBed/szkic';
export const SZKIC_LICENSE_URL = `${SZKIC_REPO_URL}/blob/main/LICENSE`;

export const SZKIC_REQUIREMENTS = 'macOS 26 lub nowszy, Mac z procesorem Apple';

export const SZKIC_HERO = {
    eyebrow: 'Darmowa aplikacja na Maca',
    title: 'Pokaż agentowi problem, zamiast go opisywać',
    lead: 'Nagrywasz ekran i mówisz, co jest nie tak. Szkic składa z tego paczkę dla Claude Code albo innego agenta.',
};

export const SZKIC_STEPS = [
    {
        keys: [['⌥', '⇧', 'S']],
        title: 'Włącz nagrywanie',
        text: 'Naciśnij ⌥⇧S i mów, co widzisz. Korzystaj z aplikacji jak zwykle, a Szkic zapisze, w co klikasz.',
    },
    {
        keys: [['⇧'], ['mysz']],
        join: '+',
        title: 'Zaznacz, o co chodzi',
        text: 'Przytrzymaj ⇧ i rysuj myszą po ekranie. Szkic rozpozna kółko, strzałkę, kreskę i punkt. Po naciśnięciu ⌥⇧D zaznaczasz element jednym kliknięciem.',
    },
    {
        keys: [['⌥', '⇧', 'S'], ['⌘', 'V']],
        join: 'potem',
        title: 'Wklej agentowi',
        text: 'Drugie ⌥⇧S kończy nagranie. Po kilku sekundach w schowku czekają klatki z zaznaczeniami i zapis Twoich słów przy każdej z nich.',
    },
];

export const SZKIC_PRIVACY = {
    title: 'Nagrania zostają na Twoim Macu',
    text: 'Szkic działa bez konta i nie wysyła statystyk. Z internetem łączy się tylko wtedy, gdy wybierzesz silnik w chmurze albo pobierasz model lokalny.',
    enginesTitle: 'Silnik transkrypcji wybierasz w Ustawieniach',
};

export const SZKIC_ENGINES = [
    {
        name: 'Apple',
        where: 'Na Macu',
        text: 'Wbudowany w macOS, działa od razu. Polską mowę zapisuje bez interpunkcji.',
    },
    {
        name: 'Model lokalny',
        where: 'Na Macu',
        text: 'NVIDIA Parakeet, ok. 600\u00A0MB, pobierany dopiero na Twoje żądanie. Działa w całości na Macu i zapisuje polski z interpunkcją.',
    },
    {
        name: 'Własny klucz API',
        where: 'W chmurze',
        text: 'Groq, ElevenLabs, OpenAI albo własny serwer. Szkic wysyła tam tylko dźwięk, a klucz trzyma w pęku kluczy macOS.',
    },
];

// Same nazwy: po co każde uprawnienie, wyjaśnia FAQ.
export const SZKIC_PERMISSIONS = ['Nagrywanie ekranu', 'Mikrofon', 'Dostępność'];

export const SZKIC_LICENSE = {
    lead: 'Kod Szkicu jest publiczny, na licencji PolyForm Shield 1.0.0.',
    allowed: [
        'używać Szkicu przy pracy dla klientów',
        'zmieniać kod na własne potrzeby',
        'przekazywać kopię dalej razem z plikiem LICENSE',
    ],
    forbidden: [
        'sprzedawać Szkicu ani jego przerobionej wersji',
        'udostępniać produktu, który zastępuje Szkic',
    ],
    contact: 'jakub@workshift.pl',
};

export const SZKIC_FAQ = [
    {
        q: 'Ile kosztuje Szkic?',
        a: 'Nic. Używasz go za darmo, także w firmie.',
    },
    {
        q: 'Z jakimi agentami działa?',
        a: 'Paczka trafia do schowka jako obraz i tekst, a Ty wklejasz ją do Claude Code. Do Claude Code jest też gotowy skill: uczy agenta czytać paczkę i w razie potrzeby wyciągać z nagrania dodatkowe klatki.',
    },
    {
        q: 'Po co Szkicowi trzy uprawnienia?',
        a: 'Nagrywanie ekranu i mikrofon są potrzebne do nagrania. Dostępność daje cofanie kresek skrótem ⌘Z, nazwy klikniętych elementów i wklejanie paczki skrótem ⌥⇧V. Bez niej nagrywanie działa, tylko bez tych dodatków.',
    },
    {
        q: 'Gdzie są moje nagrania?',
        a: 'W folderze ~/Szkic na Twoim dysku. Każde nagranie to osobny folder z filmem, dźwiękiem, klatkami i opisem. Przeglądasz i usuwasz je w oknie Nagrania (⌘O w menu Szkicu).',
    },
];

export const SZKIC_FINAL = {
    title: 'Nagraj pierwszy szkic',
    text: 'Przy pierwszym uruchomieniu samouczek przeprowadzi Cię przez uprawnienia i nagranie próbne.',
    workshift: 'Szkic powstał w Workshift. Na co dzień wdrażamy AI w firmach.',
};
