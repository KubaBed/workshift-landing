/**
 * Treść strony /narzedzia/szkic. Czytają ją dwie warstwy:
 *   - SzkicPage.jsx (to, co widzi człowiek),
 *   - scripts/seo-routes.mjs (statyczny fallback dla crawlerów bez JS).
 * Zmiana tekstu tutaj zmienia obie naraz.
 *
 * Źródło faktów: ~/Projekty/szkic/README.md i SPEC.md (wersja 0.2).
 */

// DMG (Developer ID, notaryzacja Apple) to zasób najnowszego wydania na GitHubie, zawsze pod nazwą Szkic.dmg,
// więc nowe wydanie nie wymaga zmiany strony.
export const SZKIC_REPO_URL = 'https://github.com/KubaBed/szkic';
export const SZKIC_DOWNLOAD_URL = `${SZKIC_REPO_URL}/releases/latest/download/Szkic.dmg`;
export const SZKIC_LICENSE_URL = `${SZKIC_REPO_URL}/blob/main/LICENSE`;

export const SZKIC_REQUIREMENTS = 'macOS 26 lub nowszy, Mac z procesorem Apple';

export const SZKIC_HERO = {
    eyebrow: 'Darmowa aplikacja na Maca',
    title: 'Pokaż agentowi problem, zamiast go opisywać',
    lead: 'Nagrywasz ekran i mówisz, co jest nie tak. Szkic składa z tego paczkę dla Claude Code albo innego agenta.',
};

export const SZKIC_STEPS = [
    {
        keys: [['⌃', '⌥', 'S']],
        title: 'Włącz nagrywanie',
        text: 'Naciśnij ⌃⌥S (Control, Option i S) i mów, co widzisz. Korzystaj z aplikacji jak zwykle, a Szkic zapisze, w co klikasz.',
    },
    {
        keys: [['⇧'], ['mysz']],
        join: '+',
        title: 'Zaznacz, o co chodzi',
        text: 'Przytrzymaj ⇧ i rysuj myszą po ekranie. Szkic rozpozna kółko, strzałkę, kreskę i punkt. Po naciśnięciu ⌃⌥D zaznaczasz element jednym kliknięciem.',
    },
    {
        keys: [['⌃', '⌥', 'S'], ['⌘', 'V']],
        join: 'potem',
        title: 'Wklej agentowi',
        text: 'Drugie ⌃⌥S kończy nagranie. Po kilku sekundach w schowku czekają klatki z zaznaczeniami i zapis Twoich słów przy każdej z nich.',
    },
];

export const SZKIC_PRIVACY = {
    title: 'Nagrania zostają na Twoim Macu',
    text: 'Szkic działa bez konta i nie wysyła statystyk. Z internetem łączy się tylko wtedy, gdy wybierzesz silnik w chmurze albo pobierzesz Parakeet Ultra.',
    enginesTitle: 'Silnik transkrypcji wybierasz w Ustawieniach',
};

export const SZKIC_ENGINES = [
    {
        name: 'Apple',
        where: 'Na Macu, darmowy',
        text: 'Wbudowany w macOS, działa od razu. Polską mowę zapisuje bez interpunkcji.',
    },
    {
        name: 'Parakeet Ultra',
        where: 'Na Macu, darmowy',
        text: 'Model lokalny, ok. 630\u00A0MB, pobierany dopiero na Twoje żądanie. Działa w całości na Macu, także bez internetu, i zapisuje polski z interpunkcją.',
    },
    {
        name: 'Własne API',
        where: 'W chmurze',
        text: 'Model obsługujący głos podłączasz swoim kluczem API. Polecane: Groq, ElevenLabs i OpenAI; możesz też podać własny serwer. Szkic wysyła tam tylko dźwięk, a klucz trzyma w pęku kluczy macOS.',
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
        a: 'Nagrywanie ekranu i mikrofon są potrzebne do nagrania. Dostępność daje cofanie kresek skrótem ⌘Z, nazwy klikniętych elementów i wklejanie paczki skrótem ⌃⌥V. Bez niej nagrywanie działa, tylko bez tych dodatków.',
    },
    {
        q: 'Czy mogę zmienić skróty?',
        a: 'Tak, w Ustawieniach, które otworzysz z menu Szkicu. Skrót musi mieć ⌃ albo ⌘ i jeszcze jeden klawisz z ⌃⌥⇧⌘. Samo ⌥⇧ pisze polskie litery, np. „Ś”.',
    },
    {
        q: 'Gdzie są moje nagrania?',
        a: 'W folderze ~/Szkic na Twoim dysku. Każde nagranie to osobny folder z filmem, dźwiękiem, klatkami i opisem. Przeglądasz i usuwasz je w Panelu nagrań. Otworzysz go kliknięciem ikony Szkicu w Docku albo z menu pod ikoną w pasku menu (⌘O).',
    },
];

export const SZKIC_FINAL = {
    title: 'Nagraj pierwszy szkic',
    text: 'Przy pierwszym uruchomieniu samouczek przeprowadzi Cię przez uprawnienia i nagranie próbne.',
    workshift: 'Szkic powstał w Workshift. Na co dzień wdrażamy AI w firmach.',
};

// Układ „Jak to działa” (kroki z wizualizacją) i kafelki zamiast czarnej sekcji, na /narzedzia/szkic i /showcase.
// Teksty po audycie (docs/internal/szkic/copy-audyt-kroki-bento.md), zaakceptowane przez Kubę 22.10.
// Kroki 1 i 2: fragmenty filmu z hero (0-9,8 s i 12-18 s), krok 3: zrzut Panelu nagrań. `duration` = czas kroku w ms.
export const SZKIC_HOW = [
    {
        title: 'Nagraj i pokaż',
        text: 'Naciśnij ⌃⌥S (Control, Option i S) i powiedz, co widzisz. Z wciśniętym Shiftem zakreśl problem myszą. Po ⌃⌥D zaznaczysz przycisk albo pole jednym kliknięciem.',
        video: '/szkic/krok-1',
        poster: '/szkic/krok-1.webp',
        duration: 9800,
        alt: 'Nagranie: klik w „Zapisz zmiany”, błąd 500 zakreślony kółkiem i punkt na pustym polu telefonu',
    },
    {
        title: 'Wklej agentowi',
        text: 'Drugie ⌃⌥S kończy nagranie. Po kilku sekundach w schowku czeka paczka: klatki z zaznaczeniami i zapis Twoich słów. Wklejasz ją do czatu z agentem zwykłym ⌘V.',
        video: '/szkic/krok-2',
        poster: '/szkic/krok-2.webp',
        duration: 6000,
        alt: 'Nagranie: paczka Szkicu wklejona do czatu, agent czyta klatki i szuka przyczyny',
    },
    {
        title: 'Wróć do nagrań',
        text: 'W Panelu nagrań przejrzysz klatki, momenty z opisem i pełną transkrypcję każdego nagrania. Przycisk Kopiuj znów kładzie paczkę w schowku, więc do starego błędu wracasz z agentem bez nagrywania od nowa.',
        image: '/szkic/krok-3.webp',
        alt: 'Panel nagrań: lista nagrań, podgląd klatek, momenty z opisem, pełna transkrypcja i przycisk Kopiuj',
    },
];

export const SZKIC_BENTO = {
    title: 'Działa na Twoim Macu, bez konta',
    lead: 'Szkic nie ma własnego serwera i nie wysyła statystyk. Z internetem łączy się tylko wtedy, gdy pobierasz Parakeet Ultra albo korzystasz z własnego API do transkrypcji.',
    local: {
        title: 'Nagrania zostają na dysku',
        text: 'Film i klatki wychodzą poza Maca dopiero wtedy, gdy sam wkleisz paczkę agentowi.',
        note: 'Wklejoną paczkę przetwarza już dostawca agenta, np. Anthropic przy Claude Code.',
    },
    transcription: {
        title: 'Transkrypcja po polsku',
        text: 'Silnik wybierasz w Ustawieniach. Przy własnym API do chmury trafia tylko dźwięk.',
        engines: [
            { name: 'Apple', tag: 'na Macu, bez interpunkcji' },
            { name: 'Parakeet Ultra', tag: 'na Macu, bez internetu, z interpunkcją' },
            { name: 'Własne API', tag: 'Groq, ElevenLabs, OpenAI' },
        ],
    },
    frames: {
        title: 'Klatki wybiera sam',
        text: 'Szkic wybiera do 12 klatek z chwil, w których klikasz, rysujesz albo mówisz „tutaj” lub „zobacz”. Agent dostaje te kadry zamiast całego filmu.',
    },
    agents: {
        title: 'Paczka dla każdego agenta',
        text: 'Paczka to arkusz klatek, opis tego, co mówisz i klikasz, oraz plik JSON z dokładnymi czasami. Odczyta ją każdy agent, który otwiera obrazy i pliki, np. Claude Code, Codex albo Cursor.',
    },
    shortcuts: {
        title: 'Trzy skróty',
        text: '⌃⌥S zaczyna i kończy nagranie, ⌃⌥D włącza tryb zaznaczania, a ⌃⌥V wkleja ostatnią paczkę do aktywnego okna.',
    },
};
