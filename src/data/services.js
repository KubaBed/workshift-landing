// Service data extracted from InteractiveServicesBento for routing support.
// Preview components are NOT included here - they live in the bento component
// and are mapped by ID via SERVICE_PREVIEWS.

export const SERVICES = [
    {
        id: 'automatyzacja',
        title: 'Audyt i automatyzacja procesów',
        tagline: 'Najpierw pokażemy gdzie tracisz czas. Potem zbudujemy pipeline, który odda go Twojemu zespołowi.',
        colSpan: 'lg:col-span-6',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',

        categoryTag: 'Nasza flagowa usługa',
        expandedTitle: 'Od diagnozy procesu - do działającego workflow.',
        expandedDescription: 'Zaczynamy od 30-minutowej darmowej diagnozy i mapy Twoich procesów. Wskazujemy 2-3 miejsca, gdzie automatyzacja da najszybszy, policzalny zwrot. Potem budujemy pipeline: n8n, Make i dedykowane skrypty, które wpinają się w to, jak już pracujesz. Bez zmiany przyzwyczajeń, bez wdrażania nowego "systemu" - dane płyną same.',
        heroMetric: { value: '10h+', label: 'oszczędności na pracowniku tygodniowo - średnia z naszych wdrożeń', subtext: 'Przy zespole 5-osobowym to 200h+ miesięcznie.' },
        metaTitle: 'Audyt i automatyzacja procesów biznesowych | Workshift',
        metaDescription: 'Darmowy audyt procesów + wdrożenie automatyzacji z n8n, Make i AI. Oszczędność 10h+ tygodniowo na pracownika.',

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Co automatyzujemy',
                items: [
                    'Obieg faktur - od maila do księgowości',
                    'Synchronizacja CRM ↔ mail ↔ kalendarz',
                    'Generowanie raportów z danych rozproszonych w narzędziach',
                    'Powiadomienia i eskalacje (np. niezapłacona faktura → alert dla CFO)',
                ],
            },
            {
                type: 'process',
                colSpan: 'lg:col-span-4',
                label: '3 kroki do pierwszego workflow',
                steps: [
                    { num: '01', title: 'Diagnoza', desc: 'Darmowa rozmowa + audyt procesów (30 min online).' },
                    { num: '02', title: 'Mapujemy i budujemy', desc: 'Workflow + testy na Twoich danych (1-2 tygodnie).' },
                    { num: '03', title: 'Odpalamy', desc: 'Workflow działa, dostajesz dashboard z wynikami.' },
                ]
            },
            {
                type: 'stack',
                colSpan: 'lg:col-span-4',
                label: 'Narzędzia, których używamy',
                subtitle: 'Integrujemy się z 200+ narzędziami.',
                tools: ['n8n', 'Make', 'Zapier', 'Google Workspace', 'Slack', 'API']
            },
            {
                type: 'insights',
                colSpan: 'lg:col-span-8',
                label: 'Co najczęściej znajdujemy w audycie',
                cards: [
                    { icon: '🕐', title: 'Ręczne przepisywanie danych', desc: 'Pracownicy kopiują te same dane między 3-4 narzędziami. 5-8h/tydzień na osobę.' },
                    { icon: '📧', title: 'Chaos w skrzynkach', desc: 'Zlecenia, faktury, pytania klientów - wszystko w jednym inboxie, bez filtrów.' },
                    { icon: '📊', title: 'Raporty robione ręcznie', desc: 'Comiesięczne zestawienia składane z 5 źródeł w arkuszu. 2 dni pracy.' }
                ]
            },
            {
                type: 'case',
                colSpan: 'lg:col-span-8',
                label: 'Przykład wdrożenia',
                title: 'Firma produkcyjna, 30 osób',
                content: 'Dział księgowości przepisywał dane z 80+ faktur tygodniowo ręcznie z maili do systemu. Wdrożyliśmy pipeline: mail przychodzący → OCR (AI odczytuje fakturę) → automatyczna kategoryzacja → zapis w systemie FK. Czas operacji spadł z 2 dni roboczych do 15 minut.',
                beforeAfter: { before: '16h / tydz.', after: '0.5h / tydz.' }
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zacznij od darmowej diagnozy',
                subline: '30 minut Twojego czasu. Zero zobowiązań. Konkretne rekomendacje od razu.',
                ctaLabel: 'Umów diagnozę',
            },
        ],
    },
    {
        id: 'aplikacja',
        title: 'Dedykowana aplikacja',
        tagline: 'Gotowe narzędzia nie ogarniają Twojego procesu? Budujemy aplikację skrojoną pod Twoją firmę.',
        colSpan: 'lg:col-span-6',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',

        categoryTag: 'Rozwiązanie szyte na miarę',
        expandedTitle: 'Twój proces jest unikalny - oprogramowanie też powinno być.',
        expandedDescription: 'Są procesy, których żaden SaaS nie obsłuży dobrze. Zamiast naginać firmę do narzędzia, budujemy aplikację skrojoną pod Twój workflow. Panel dla zespołu, integracje z Twoimi systemami, moduł AI do zadań, na które nie masz czasu. Wdrożenie w 4-8 tygodni - używamy AI-wspomaganego developmentu, więc koszt i czas są kilkukrotnie niższe niż w klasycznym software house.',
        heroMetric: { value: '4-8 tyg.', label: 'od briefu do działającej aplikacji w produkcji', subtext: 'Tam, gdzie tradycyjny software house liczy miesiące.' },
        metaTitle: 'Dedykowana aplikacja AI na zamówienie | Workshift',
        metaDescription: 'Budujemy aplikacje skrojone pod Twój workflow w 4-8 tygodni. Next.js, React, Supabase, AI SDK.',

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Co budujemy',
                items: [
                    'Wewnętrzny panel operacyjny (CRM / ERP / workflow)',
                    'Aplikacja kliencka (portal, konfigurator, self-service)',
                    'Dashboardy z danymi z Twoich narzędzi w czasie rzeczywistym',
                    'Moduły AI wpięte w proces (klasyfikacja, OCR, asystent)',
                ],
            },
            {
                type: 'process',
                colSpan: 'lg:col-span-4',
                label: 'Jak pracujemy',
                steps: [
                    { num: '01', title: 'Discovery', desc: 'Warsztat + mapa procesu, makieta głównych ekranów (3-5 dni).' },
                    { num: '02', title: 'MVP', desc: 'Pierwsza działająca wersja w 2-3 tygodnie - na Twoich danych.' },
                    { num: '03', title: 'Iteracje', desc: 'Kolejne moduły co tydzień, feedback na bieżąco od zespołu.' },
                ]
            },
            {
                type: 'stack',
                colSpan: 'lg:col-span-4',
                label: 'Stack technologiczny',
                subtitle: 'Nowoczesny, utrzymywany przez lata.',
                tools: ['Next.js', 'React', 'Supabase', 'Postgres', 'Vercel', 'AI SDK']
            },
            {
                type: 'usp',
                colSpan: 'lg:col-span-8',
                label: 'Dlaczego nie kupić gotowego SaaS-u?',
                points: [
                    { title: 'Masz unikalny proces', desc: 'SaaS narzuca swój model pracy. My budujemy pod to, jak faktycznie działa Twoja firma.' },
                    { title: 'Zero abonamentów per user', desc: 'Jedno wdrożenie, Twój kod. Żadnych niespodzianek przy skalowaniu zespołu.' },
                    { title: 'AI w rdzeniu aplikacji', desc: 'Nie dokręcamy AI do starego UI - od początku projektujemy proces wokół modeli.' },
                ]
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Masz pomysł na aplikację?',
                subline: 'Pokażemy wstępną architekturę i szacunek kosztu w 1 rozmowie.',
                ctaLabel: 'Porozmawiajmy',
            },
        ],
    },
    {
        id: 'szkolenia',
        title: 'Szkolenia AI',
        tagline: 'Zbuduj zespół operacyjny odporny na przyszłość. Praktyczny warsztat, odwracający opór przed AI w chęć do pracy.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',

        categoryTag: 'Rozwój zespołu',
        expandedTitle: 'Twój zespół nie boi się AI. Po prostu nikt im nie pokazał, jak korzystać.',
        expandedDescription: 'Nie robimy wykładów. Robimy warsztaty, na których Twój zespół pracuje na SWOICH danych, w SWOICH narzędziach. Po jednym dniu - wiedzą jak promptować, jak zautomatyzować powtarzalną robotę, i jak AI wbudować w swój dzień pracy. Bez teoretyzowania.',
        heroMetric: { value: '2-3x', label: 'wzrost produktywności pracownika w wybranych procesach, które automatyzujemy - raportowany przez naszych klientów' },
        metaTitle: 'Szkolenia AI dla firm - praktyczne warsztaty | Workshift',
        metaDescription: 'Warsztaty AI na Twoich danych i narzędziach. ChatGPT, Claude, automatyzacje. 2-3x wzrost produktywności zespołu.',

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Formaty',
                items: [
                    'Warsztat onsite (1 dzień, u Ciebie w biurze)',
                    'Warsztat online (2x po 3h, rozłożone na tydzień)',
                    'Konsultacja 1:1 dla kadry zarządzającej',
                    'Materiały follow-up + 30 dni wsparcia po szkoleniu'
                ],
            },
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Tematy',
                items: [
                    'ChatGPT / Claude w codziennej pracy',
                    'Prompt engineering dla Twojej branży',
                    'AI w mailu, raportach, analizie danych',
                    'Budowanie prostych automatyzacji (bez kodu)'
                ],
            },
            {
                type: 'personas',
                colSpan: 'lg:col-span-4',
                label: 'Dla kogo to jest',
                roles: [
                    { title: 'Zespoły operacyjne', desc: 'Przetwarzają codziennie duże zbiory danych' },
                    { title: 'Kadra zarządzająca', desc: 'Chce zrozumieć szeroko co AI może zmienić' },
                    { title: 'Działy marketingu/sprzed.', desc: 'Do skalowania swojego outreachu z asystentem' }
                ]
            },
            {
                type: 'usp',
                colSpan: 'lg:col-span-8',
                label: 'Dlaczego nasze szkolenia działają',
                points: [
                    { title: 'Na Twoich danych', desc: 'Nie uczymy na abstrakcyjnych przykładach. Bierzemy TWOJE maile, TWOJE arkusze, TWOJE procesy.' },
                    { title: 'Efekt od razu', desc: 'Po warsztacie każdy bierze do ręki 2-3 własne prompty, które od jutra oszczędzają mu konkretny czas.' },
                    { title: 'Nie zostawiamy samych', desc: '30 dni wsparcia po ukończeniu szkolenia. Pytania, problemy, fine-tuning - jesteśmy dostępni.' },
                ]
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Umów szkolenie dla zespołu',
                subline: 'Dostosowujemy program do Twojej branży i poziomu zaawansowania.',
                ctaLabel: 'Zapytaj o termin',
            },
        ],
    },
    {
        id: 'agenty',
        title: 'Agenci AI',
        tagline: 'Rozwiąż problem wypalenia personelu i obsługuj klientów o 3 w nocy, bez błędów i spóźnień.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[520px] lg:min-h-[420px]',

        categoryTag: 'Automatyzacja komunikacji',
        expandedTitle: 'Agent, który rozwiązuje - nie przekierowuje.',
        expandedDescription: 'Budujemy boty, które działają na Twoich danych, respektują Twoje procedury i rozwiązują prawdziwe problemy klientów. Nie chodzi o chatbota, który mówi "przekierowuję do konsultanta". Chodzi o agenta, który odpowiada, wystawia, wysyła - i dopiero gdy nie wie, eskaluje do człowieka.',
        heroMetric: { value: '40%', label: 'zapytań rozwiązanych autonomicznie - bez udziału człowieka' },
        metaTitle: 'Agenci AI - chatboty i voiceboty dla firm | Workshift',
        metaDescription: 'Budujemy agentów AI, którzy obsługują klientów 24/7. Chatboty, voiceboty, email boty. 40% zapytań bez człowieka.',

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Rodzaje agentów',
                items: [
                    'Chatbot na stronę / Messenger / WhatsApp',
                    'Voicebot do obsługi linii telefonicznej',
                    'Email bot - kategoryzacja, odpowiedzi, forwarding',
                    'Wewnętrzny asystent wiedzy firmowej'
                ],
            },
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Jak to działa',
                items: [
                    'Trenujemy agenta na Twoich FAQ i procedurach',
                    'Korzysta z bazy wiedzy (RAG) - zero halucynacji',
                    'Monitoring w czasie rzeczywistym w dashboardzie',
                    'Agent uczy się z feedbacku ewaluując rozmowy'
                ],
            },
            {
                type: 'integrations',
                colSpan: 'lg:col-span-4',
                label: 'Integracje gotowe pod klucz',
                badges: ['Strona WWW', 'Messenger', 'WhatsApp', 'Slack', 'Email', 'Telefon (Voice)']
            },
            {
                type: 'case',
                colSpan: 'lg:col-span-8',
                label: 'Przykład wdrożenia',
                title: 'E-commerce, BOK z 200+ zapytaniami dziennie',
                content: 'Zespół BOK tonął w powtarzalnych pytaniach: "gdzie moja paczka?", "jak zwrócić?", "jaki rozmiar wybrać?". Agent od Workshift obsługuje ~40% zapytań od ręki na pierwszej linii. Reszta trafia do ludzi z pełnym kontekstem rozmowy. Pracownicy przestali odchodzić z wypalenia z powodu monotonii.',
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zbuduj swojego agenta',
                subline: 'Od prototypu do działającego bota - 2-4 tygodnie.',
                ctaLabel: 'Porozmawiajmy',
            },
        ],
    },
    {
        id: 'kreacje',
        title: 'Kreacje reklamowe AI',
        tagline: 'Zastąp drogą agencję pipeline\'m. Dni ucinamy do godzin, budżety zmniejszamy o połowę.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',

        categoryTag: 'Content i Visual',
        expandedTitle: 'Skaluj produkcję kreacji, bez działu grafików.',
        expandedDescription: 'Zastępujemy drogie sesje zdjęciowe i tygodnie czekania na grafika dedykowanymi pipeline\'ami generatywnymi. Tworzysz brief, a my dostarczamy setki wariantów spójnych z Twoim brandbookiem - packshoty, reklamy social, wideo. W dni, nie w miesiące.',
        heroMetric: { value: 'Dni', label: 'zamiast miesięcy produkcji kreacji reklamowych', subtext: 'Średnio 10x szybciej niż tradycyjny proces agencji.' },
        metaTitle: 'Kreacje reklamowe AI - packshoty, wideo, social | Workshift',
        metaDescription: 'AI pipeline do produkcji kreacji reklamowych. Packshoty, reklamy social, wideo. 10x szybciej niż agencja.',

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-6',
                label: 'Co tworzymy za Ciebie',
                items: [
                    'Packshoty i trójwymiarowe wizualizacje produktów',
                    'Personalizowane warianty reklam na skalę dużego A/B',
                    'Utrzymana spójność z brandbookiem (modele LoRA)',
                    'Materiały wideo i generatywne animacje'
                ],
            },
            {
                type: 'stack',
                colSpan: 'lg:col-span-6',
                label: 'Stack technologiczny',
                subtitle: 'Dobieramy narzędzia pod brief.',
                tools: ['ComfyUI', 'Midjourney', 'Runway', 'DALL-E', 'LoRA', 'Kling']
            },
            {
                type: 'comparison',
                colSpan: 'lg:col-span-8',
                label: 'Jak zmieniamy proces dostarczania (Before/After)',
                before: { title: 'Tradycyjnie', desc: 'Briefing → Studio zdjęciowe → Obróbka w Lightroom → Wersjonowanie dla social (4-6 tygodni, duże koszty).', highlight: 'Miesiące' },
                after: { title: 'Z Workshift AI', desc: 'Brief z wymaganiami → Własny AI pipeline → Setki wariantów brandowych renderowane od razu (3-5 dni pracy).', highlight: 'Dni' }
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zobacz demo kreacji AI',
                subline: 'Pokażemy na żywo, jak generujemy content na bazie Twojego brandbooka.',
                ctaLabel: 'Umów demo',
            },
        ],
    },
];

export function getServiceById(id) {
    return SERVICES.find(s => s.id === id) || null;
}

export function getServiceSlugs() {
    return SERVICES.map(s => s.id);
}
