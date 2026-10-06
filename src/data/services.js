// Service data extracted from InteractiveServicesBento for routing support.
// Preview components are NOT included here - they live in the bento component
// and are mapped by ID via SERVICE_PREVIEWS.

export const SERVICES = [
    {
        id: 'automatyzacja',
        title: 'Automatyzacja AI i audyt procesów',
        tagline: 'Najpierw pokażemy, gdzie tracisz czas. Potem zbudujemy workflow, który odda te godziny Twojemu zespołowi.',
        colSpan: 'lg:col-span-6',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',

        categoryTag: 'Nasza flagowa usługa',
        expandedTitle: 'Od diagnozy procesu do działającego workflow.',
        expandedDescription: 'Zaczynamy od bezpłatnej 30-minutowej rozmowy diagnostycznej i mapy Twoich procesów. Wskazujemy 2-3 miejsca, gdzie automatyzacja AI da najszybszy, policzalny zwrot. Potem budujemy workflow, który wpina się w to, jak już pracujesz: dane z maili, faktur i formularzy same trafiają tam, gdzie mają być. Twój zespół pracuje w tych samych programach co dziś.',
        heroMetric: { value: '10h+', label: 'oszczędności na pracowniku tygodniowo - średnia z naszych wdrożeń', subtext: 'Przy zespole 5-osobowym to 200h+ miesięcznie.' },
        metaTitle: 'Automatyzacja AI dla firm - audyt i wdrożenie | Workshift',
        metaDescription: 'Automatyzacja AI w praktyce: bezpłatna rozmowa diagnostyczna, wdrożenie w 1-2 tygodnie i 10h+ oszczędności tygodniowo na pracownika. Zobacz, od czego zacząć.',

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-6',
                label: 'Co automatyzujemy',
                items: [
                    'Obieg faktur - od maila do księgowości',
                    'Synchronizacja CRM ↔ mail ↔ kalendarz',
                    'Generowanie raportów z danych rozproszonych w narzędziach',
                    'Powiadomienia i eskalacje (np. niezapłacona faktura → alert dla właściciela lub księgowej)',
                ],
            },
            {
                type: 'process',
                colSpan: 'lg:col-span-6',
                label: '3 kroki do pierwszego workflow',
                steps: [
                    { num: '01', title: 'Diagnoza', desc: 'Bezpłatna 30-minutowa rozmowa diagnostyczna online i przegląd procesów.' },
                    { num: '02', title: 'Mapujemy i budujemy', desc: 'Budujemy workflow i testujemy go na Twoich danych (1-2 tygodnie).' },
                    { num: '03', title: 'Uruchamiamy', desc: 'Workflow działa, a wyniki widzisz w dashboardzie.' },
                ]
            },
            {
                type: 'toolsMarquee',
                colSpan: 'lg:col-span-12',
                label: 'Wpinamy się w Twoje narzędzia',
                intro: 'Automatyzacja podpina się pod narzędzia, w których Twoja firma już pracuje: pocztę, arkusze, CRM i program do faktur. Zespół zostaje przy swoich programach, a dane przechodzą między nimi automatycznie.',
                glue: {
                    label: 'Spinamy je przez',
                    tools: [
                        { name: 'n8n', slug: 'n8n' },
                        { name: 'Make', slug: 'make' },
                        { name: 'Zapier', slug: 'zapier' },
                    ],
                },
                badge: 'i 200+ innych narzędzi z API lub webhookami',
                tools: [
                    { name: 'Gmail', slug: 'gmail' },
                    { name: 'Fakturownia', mono: 'Fa' },
                    { name: 'Slack', slug: 'slack' },
                    { name: 'Allegro', slug: 'allegro' },
                    { name: 'Google Sheets', slug: 'googlesheets' },
                    { name: 'Comarch Optima', mono: 'CO' },
                    { name: 'HubSpot', slug: 'hubspot' },
                    { name: 'Baselinker', mono: 'BL' },
                    { name: 'Outlook', mono: 'Ou' },
                    { name: 'wFirma', mono: 'wF' },
                    { name: 'Notion', slug: 'notion' },
                    { name: 'InPost', mono: 'IP' },
                    { name: 'Google Calendar', slug: 'googlecalendar' },
                    { name: 'Subiekt GT', mono: 'SG' },
                    { name: 'Airtable', slug: 'airtable' },
                    { name: 'inFakt', mono: 'iF' },
                    { name: 'Teams', mono: 'Ts' },
                    { name: 'WooCommerce', slug: 'woocommerce' },
                    { name: 'Pipedrive', mono: 'Pd' },
                    { name: 'Trello', slug: 'trello' },
                    { name: 'Livespace', mono: 'Ls' },
                    { name: 'Asana', slug: 'asana' },
                    { name: 'Google Drive', slug: 'googledrive' },
                    { name: 'ClickUp', slug: 'clickup' },
                    { name: 'Mailchimp', slug: 'mailchimp' },
                    { name: 'Stripe', slug: 'stripe' },
                ],
            },
            {
                type: 'insights',
                colSpan: 'lg:col-span-8',
                label: 'Gdzie firmy najczęściej tracą czas',
                cards: [
                    { icon: 'clock', title: 'Ręczne przepisywanie danych', desc: 'Pracownicy kopiują te same dane między 3-4 narzędziami. 5-8h/tydzień na osobę.' },
                    { icon: 'inbox', title: 'Chaos w skrzynkach', desc: 'Zlecenia, faktury i pytania klientów trafiają do jednej skrzynki bez filtrów.' },
                    { icon: 'report', title: 'Raporty robione ręcznie', desc: 'Comiesięczne zestawienia składane z 5 źródeł w arkuszu. 2 dni pracy.' }
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
                headline: 'Zacznij od bezpłatnej rozmowy diagnostycznej',
                subline: 'Rozmowa trwa 30 minut i jest bezpłatna. Na koniec wiesz, od których 2-3 procesów zacząć.',
                ctaLabel: 'Umów rozmowę',
            },
        ],

        // Treść artykułowa pod bento (Sprint 1 SEO, fraza: automatyzacja ai).
        // Konsumenci: ServiceArticle/ServiceFaq na ServicePage ORAZ statyczny
        // fallback w scripts/seo-routes.mjs - crawler bez JS musi widzieć to samo.
        // Pola eyebrow/reveal/highlights/icon/stats są czysto wizualne -
        // flattener SEO (scripts/seo-routes.mjs) czyta tylko heading,
        // paragraphs i items{title,desc}.
        seoSections: [
            {
                heading: 'Czym jest automatyzacja AI?',
                eyebrow: 'Automatyzacja AI',
                reveal: true,
                highlights: ['rozumienie treści', 'czytanie, ocenianie i przepisywanie informacji'],
                paragraphs: [
                    'Automatyzacja AI to połączenie klasycznej automatyzacji procesów z modelami sztucznej inteligencji. Zwykła automatyzacja przenosi dane między narzędziami według sztywnych reguł. AI dodaje do tego rozumienie treści: odczytuje fakturę z załącznika, klasyfikuje maila od klienta, wyciąga ustalenia z notatki ze spotkania. Dzięki temu automatyzacja procesów AI obejmuje także zadania, które dotąd wymagały człowieka, czyli czytanie, ocenianie i przepisywanie informacji.',
                    'W polskim MŚP oznacza to, że powtarzalne czynności biurowe wykonuje system, a zespół zajmuje się pracą, która wymaga decyzji. Średnia z naszych wdrożeń to ponad 10 godzin odzyskanych tygodniowo na pracownika.',
                ],
            },
            {
                heading: 'Które procesy automatyzujemy najczęściej',
                eyebrow: 'Co automatyzujemy',
                items: [
                    {
                        icon: 'invoice',
                        title: 'Obieg faktur',
                        desc: 'Faktura przychodzi mailem, ktoś ją pobiera, przepisuje dane do systemu księgowego i odkłada plik do folderu. Przy 80 fakturach tygodniowo to dwa dni pracy. Po wdrożeniu system sam odczytuje załącznik, kategoryzuje koszt i zapisuje dane, a człowiek zatwierdza tylko wyjątki.',
                    },
                    {
                        icon: 'sync',
                        title: 'Synchronizacja CRM, maila i kalendarza',
                        desc: 'Notatka po spotkaniu, status szansy sprzedażowej i follow-up żyją w trzech miejscach naraz. Automatyzacja spina je w jeden przepływ: po spotkaniu CRM dostaje podsumowanie, a handlowiec przypomnienie o follow-upie.',
                    },
                    {
                        icon: 'report',
                        title: 'Raporty z rozproszonych danych',
                        desc: 'Comiesięczne zestawienie składane z pięciu źródeł w arkuszu potrafi zająć dwa dni. Zautomatyzowany raport składa się w nocy i rano czeka w skrzynce, co miesiąc w tym samym formacie.',
                    },
                    {
                        icon: 'alert',
                        title: 'Powiadomienia i eskalacje',
                        desc: 'System pilnuje niezapłaconych faktur, zleceń bez odpowiedzi i kończących się umów, a przed terminem powiadamia właściwą osobę.',
                    },
                ],
            },
            {
                heading: 'Sztuczna inteligencja w firmie: od czego zaczynamy',
                eyebrow: 'Jak pracujemy',
                paragraphs: [
                    'Zaczynamy od mapy procesów. W bezpłatnej 30-minutowej rozmowie diagnostycznej wskazujemy 2-3 miejsca, w których sztuczna inteligencja w firmie zwróci się najszybciej - policzalnie, w godzinach i złotówkach. Potem budujemy pierwszy workflow i testujemy go na Twoich danych przez 1-2 tygodnie. Dopiero gdy widzisz wynik na własnym procesie, decydujesz o kolejnych krokach.',
                    'Jeśli chcesz sprawdzić potencjał przed rozmową, zrób bezpłatny mikro-audyt AI (12 pytań, 4 minuty) albo policz koszt powtarzalnych zadań w kalkulatorze strat czasowych.',
                ],
            },
            {
                heading: 'Przykład wdrożenia: 80 faktur tygodniowo bez przepisywania',
                eyebrow: 'Case study',
                stats: {
                    beforeLabel: 'Przed wdrożeniem',
                    afterLabel: 'Po wdrożeniu',
                    before: { amount: 16, unit: 'h / tydz.' },
                    after: { amount: 0.5, decimals: 1, unit: 'h / tydz.' },
                    afterRatio: 0.04,
                    note: 'Obsługa 80+ faktur tygodniowo: z 2 dni roboczych do 15 minut.',
                },
                paragraphs: [
                    'Firma produkcyjna, 30 osób. Dział księgowości przepisywał dane z ponad 80 faktur tygodniowo ręcznie - z maili do systemu finansowo-księgowego. Wąskie gardło rosło z każdym nowym dostawcą.',
                    'Wdrożyliśmy workflow: mail przychodzący, automatyczny odczyt faktury przez AI, kategoryzacja kosztu i zapis w systemie. Czas operacji spadł z 2 dni roboczych do 15 minut, a księgowość zamiast przepisywać dane, kontroluje wyjątki. Ten sam wzorzec stosujemy w handlu, usługach i logistyce, zmieniając tylko typ dokumentu.',
                ],
            },
        ],
        faqHeading: 'Pytania o automatyzację AI',
        faq: [
            {
                q: 'Czym różni się automatyzacja AI od zwykłej automatyzacji?',
                a: 'Zwykła automatyzacja działa według sztywnych reguł: jeśli A, to B. Automatyzacja AI rozumie treść: odczyta fakturę z PDF-a, sklasyfikuje maila albo streści dokument. Dzięki temu automatyzować można też procesy oparte na czytaniu i ocenie informacji, nie tylko na przenoszeniu danych między narzędziami.',
            },
            {
                q: 'Które procesy w firmie da się zautomatyzować?',
                a: 'Najlepiej automatyzują się procesy powtarzalne i oparte na danych: obieg faktur i dokumentów, przepisywanie danych między narzędziami, raportowanie, obsługa powtarzalnych zapytań, pilnowanie terminów. Jeśli zadanie da się opisać krok po kroku, jest dobrym kandydatem do automatyzacji.',
            },
            {
                q: 'Jak szybko widać efekty automatyzacji AI?',
                a: 'Pierwszy działający workflow budujemy i testujemy w 1-2 tygodnie od diagnozy. Efekt widzisz od razu na własnych danych - średnia z naszych wdrożeń to ponad 10 godzin odzyskanych tygodniowo na pracownika, czyli ponad 200 godzin miesięcznie przy zespole 5-osobowym.',
            },
            {
                q: 'Czy automatyzacja AI jest bezpieczna dla danych firmy?',
                a: 'Tak, jeśli jest dobrze zaprojektowana. Rozwiązania budujemy na zamkniętych instancjach, a dostęp do danych dostają tylko osoby i systemy, które go potrzebują. Dane dokumentowe i finansowe nie służą do trenowania globalnych modeli. Zgodność z RODO sprawdzamy już na etapie projektowania.',
            },
            {
                q: 'Ile kosztuje automatyzacja procesów AI?',
                a: 'Koszt zależy od liczby i złożoności procesów, dlatego zaczynamy od bezpłatnej rozmowy diagnostycznej, po której dostajesz konkretną wycenę. Utrzymanie kilku działających automatyzacji w firmie 20-osobowej to zwykle 200-600 PLN miesięcznie za subskrypcje narzędzi.',
            },
            {
                q: 'Od czego zacząć automatyzację w swojej firmie?',
                a: 'Od zmierzenia, gdzie uciekają godziny. Zrób bezpłatny mikro-audyt AI (4 minuty) albo policz koszt powtarzalnych zadań w kalkulatorze strat czasowych. Potem umów bezpłatną 30-minutową rozmowę diagnostyczną, po której dostaniesz mapę 2-3 procesów, od których warto zacząć.',
            },
        ],
    },
    {
        id: 'aplikacja',
        title: 'Dedykowana aplikacja',
        tagline: 'Budujemy aplikację pod proces, którego gotowe narzędzia nie obsługują.',
        colSpan: 'lg:col-span-6',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',

        categoryTag: 'Rozwiązanie szyte na miarę',
        expandedTitle: 'Aplikacja zbudowana pod Twój proces.',
        expandedDescription: 'Są procesy, których żaden SaaS nie obsłuży dobrze. Zamiast naginać firmę do narzędzia, budujemy aplikację skrojoną pod Twój workflow. Panel dla zespołu, integracje z Twoimi systemami, moduł AI do zadań, na które nie masz czasu. Wdrożenie trwa 4-8 tygodni. Kod piszemy z pomocą narzędzi AI, więc koszt i czas są kilkukrotnie niższe niż w klasycznym software house.',
        heroMetric: { value: '4-8 tyg.', label: 'od briefu do działającej aplikacji w produkcji', subtext: 'Pierwsza wersja na Twoich danych po 2-3 tygodniach.' },
        metaTitle: 'Dedykowana aplikacja AI na zamówienie | Workshift',
        metaDescription: 'Budujemy aplikacje webowe pod Twój proces: panel dla zespołu, portal dla klientów, moduły AI. Od briefu do wersji produkcyjnej w 4-8 tygodni.',

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
                    { num: '01', title: 'Analiza', desc: 'Warsztat, mapa procesu i makieta głównych ekranów (3-5 dni).' },
                    { num: '02', title: 'MVP', desc: 'Pierwsza działająca wersja na Twoich danych w 2-3 tygodnie.' },
                    { num: '03', title: 'Iteracje', desc: 'Kolejne moduły co tydzień, feedback na bieżąco od zespołu.' },
                ]
            },
            {
                type: 'stack',
                colSpan: 'lg:col-span-4',
                label: 'Stack technologiczny',
                subtitle: 'Technologie, które zna większość zespołów programistycznych.',
                tools: ['Next.js', 'React', 'Supabase', 'Postgres', 'Vercel', 'AI SDK']
            },
            {
                type: 'usp',
                colSpan: 'lg:col-span-8',
                label: 'Dlaczego nie kupić gotowego SaaS-u?',
                points: [
                    { title: 'Masz unikalny proces', desc: 'SaaS narzuca swój model pracy. Budujemy pod to, jak działa Twoja firma.' },
                    { title: 'Bez opłat za użytkownika', desc: 'Płacisz za wdrożenie, a kod należy do Ciebie. Opłata nie rośnie z liczbą użytkowników.' },
                    { title: 'AI w rdzeniu aplikacji', desc: 'Proces projektujemy od początku z myślą o modelach AI.' },
                ]
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Masz pomysł na aplikację?',
                subline: 'Pokażemy wstępną architekturę i szacunek kosztu podczas jednej rozmowy.',
                ctaLabel: 'Porozmawiajmy',
            },
        ],
    },
    {
        id: 'szkolenia',
        title: 'Szkolenia AI',
        tagline: 'Praktyczne szkolenia AI dla firm: warsztat na danych i narzędziach Twojego zespołu.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',

        categoryTag: 'Rozwój zespołu',
        expandedTitle: 'Pokazujemy Twojemu zespołowi, jak używać AI w codziennej pracy.',
        expandedDescription: 'Prowadzimy warsztaty, na których Twój zespół pracuje na własnych danych i w swoich narzędziach. Po warsztacie uczestnicy wiedzą, jak pisać prompty, jak zautomatyzować powtarzalne zadania i jak włączyć AI do codziennej pracy.',
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
                    'Materiały po szkoleniu i 30 dni wsparcia'
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
                    { title: 'Kadra zarządzająca', desc: 'Chce zrozumieć, co AI może zmienić w firmie' },
                    { title: 'Marketing i sprzedaż', desc: 'Przygotowują więcej spersonalizowanych wiadomości z pomocą asystenta AI' }
                ]
            },
            {
                type: 'usp',
                colSpan: 'lg:col-span-8',
                label: 'Dlaczego nasze szkolenia działają',
                points: [
                    { title: 'Na Twoich danych', desc: 'Ćwiczymy na mailach, arkuszach i procesach Twojego zespołu.' },
                    { title: 'Efekt od razu', desc: 'Każdy uczestnik wychodzi z 2-3 promptami do swoich zadań, gotowymi do użycia następnego dnia.' },
                    { title: '30 dni wsparcia', desc: 'Przez 30 dni po szkoleniu odpowiadamy na pytania zespołu i pomagamy poprawiać prompty.' },
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
        tagline: 'Agent AI odpowiada klientom także o 3 w nocy, a trudniejsze sprawy przekazuje Twojemu zespołowi.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[520px] lg:min-h-[420px]',

        categoryTag: 'Automatyzacja komunikacji',
        expandedTitle: 'Agent AI jako pierwsza linia obsługi klienta.',
        expandedDescription: 'Budujemy agentów, którzy działają na Twoich danych i trzymają się Twoich procedur. Agent odpowiada, wystawia i wysyła, a do człowieka eskaluje wtedy, gdy nie zna odpowiedzi.',
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
                    'Agent odpowiada na podstawie Twoich FAQ i procedur',
                    'Odpowiada na podstawie bazy wiedzy firmy (RAG) i wskazuje źródło',
                    'Monitoring w czasie rzeczywistym w dashboardzie',
                    'Oceniamy rozmowy agenta i na tej podstawie poprawiamy jego odpowiedzi'
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
                content: 'Zespół BOK tonął w powtarzalnych pytaniach: "gdzie moja paczka?", "jak zwrócić?", "jaki rozmiar wybrać?". Nasz agent obsługuje ~40% zapytań od ręki na pierwszej linii. Reszta trafia do ludzi z pełnym kontekstem rozmowy. Pracownicy przestali odchodzić z wypalenia z powodu monotonii.',
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
        expandedTitle: 'Więcej wariantów kreacji bez rozbudowy działu graficznego.',
        expandedDescription: 'Zastępujemy drogie sesje zdjęciowe i tygodnie czekania na grafika dedykowanymi pipeline\'ami generatywnymi. Ty przygotowujesz brief, a my dostarczamy setki wariantów zgodnych z Twoim brandbookiem: packshoty, reklamy do social mediów i wideo. Pierwsze materiały dostajesz po 3-5 dniach pracy.',
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
                    'Warianty reklam do testów A/B na dużą skalę',
                    'Spójność z brandbookiem dzięki modelom LoRA',
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
                label: 'Jak zmieniamy proces produkcji',
                before: { title: 'Tradycyjnie', desc: 'Briefing → Studio zdjęciowe → Obróbka w Lightroom → Wersjonowanie dla social (4-6 tygodni, duże koszty).', highlight: 'Tygodnie' },
                after: { title: 'Z Workshift AI', desc: 'Brief z wymaganiami → nasz pipeline AI → setki wariantów zgodnych z brandbookiem (3-5 dni pracy).', highlight: 'Dni' }
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zobacz demo kreacji AI',
                subline: 'Pokażemy na żywo, jak generujemy kreacje na podstawie Twojego brandbooka.',
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
