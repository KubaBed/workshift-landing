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
        expandedDescription: 'Zaczynamy od 30-minutowej darmowej diagnozy i mapy Twoich procesów. Wskazujemy 2-3 miejsca, gdzie automatyzacja AI da najszybszy, policzalny zwrot. Potem budujemy workflow, który wpina się w to, jak już pracujesz: dane z maili, faktur i formularzy same trafiają tam, gdzie mają być. Bez zmiany przyzwyczajeń, bez wdrażania nowego "systemu" - dane płyną same.',
        heroMetric: { value: '10h+', label: 'oszczędności na pracowniku tygodniowo - średnia z naszych wdrożeń', subtext: 'Przy zespole 5-osobowym to 200h+ miesięcznie.' },
        metaTitle: 'Automatyzacja AI dla firm - audyt i wdrożenie | Workshift',
        metaDescription: 'Automatyzacja AI w praktyce: darmowy audyt procesów, wdrożenie w 1-2 tygodnie i 10h+ oszczędności tygodniowo na pracownika. Zobacz, od czego zacząć.',

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-6',
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
                colSpan: 'lg:col-span-6',
                label: '3 kroki do pierwszego workflow',
                steps: [
                    { num: '01', title: 'Diagnoza', desc: 'Darmowa rozmowa + audyt procesów (30 min online).' },
                    { num: '02', title: 'Mapujemy i budujemy', desc: 'Workflow + testy na Twoich danych (1-2 tygodnie).' },
                    { num: '03', title: 'Odpalamy', desc: 'Workflow działa, dostajesz dashboard z wynikami.' },
                ]
            },
            {
                type: 'toolsMarquee',
                colSpan: 'lg:col-span-12',
                label: 'Wpinamy się w Twoje narzędzia',
                intro: 'Nie wdrażamy nowego systemu. Automatyzacja podpina się pod narzędzia, w których Twoja firma już pracuje: pocztę, arkusze, CRM i program do faktur. Ty pracujesz jak dotąd - dane zaczynają płynąć same.',
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
                label: 'Co najczęściej znajdujemy w audycie',
                cards: [
                    { icon: 'clock', title: 'Ręczne przepisywanie danych', desc: 'Pracownicy kopiują te same dane między 3-4 narzędziami. 5-8h/tydzień na osobę.' },
                    { icon: 'inbox', title: 'Chaos w skrzynkach', desc: 'Zlecenia, faktury, pytania klientów - wszystko w jednym inboxie, bez filtrów.' },
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
                headline: 'Zacznij od darmowej diagnozy',
                subline: '30 minut Twojego czasu. Zero zobowiązań. Konkretne rekomendacje od razu.',
                ctaLabel: 'Umów diagnozę',
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
                    'Automatyzacja AI to połączenie klasycznej automatyzacji procesów z modelami sztucznej inteligencji. Zwykła automatyzacja przenosi dane między narzędziami według sztywnych reguł. AI dodaje do tego rozumienie treści: odczytuje fakturę z załącznika, klasyfikuje maila od klienta, wyciąga ustalenia z notatki ze spotkania. Dzięki temu automatyzacja procesów AI obejmuje także zadania, które dotąd wymagały człowieka - czytanie, ocenianie i przepisywanie informacji.',
                    'W praktyce polskiego MŚP oznacza to jedno: powtarzalne czynności biurowe dzieją się same, a zespół zajmuje się pracą, która wymaga decyzji. Średnia z naszych wdrożeń to ponad 10 godzin odzyskanych tygodniowo na pracownika.',
                ],
            },
            {
                heading: 'Które procesy automatyzujemy najczęściej',
                eyebrow: 'Co automatyzujemy',
                items: [
                    {
                        icon: 'invoice',
                        title: 'Obieg faktur',
                        desc: 'Faktura przychodzi mailem, ktoś ją pobiera, przepisuje dane do systemu księgowego i odkłada plik do folderu. Przy 80 fakturach tygodniowo to dwa dni pracy. Po wdrożeniu system sam odczytuje załącznik, kategoryzuje koszt i zapisuje dane - człowiek tylko zatwierdza wyjątki.',
                    },
                    {
                        icon: 'sync',
                        title: 'Synchronizacja CRM, maila i kalendarza',
                        desc: 'Notatka po spotkaniu, status szansy sprzedażowej i follow-up żyją w trzech miejscach naraz. Automatyzacja spina je w jeden przepływ: po spotkaniu CRM dostaje podsumowanie, a handlowiec przypomnienie - bez ręcznego klikania.',
                    },
                    {
                        icon: 'report',
                        title: 'Raporty z rozproszonych danych',
                        desc: 'Comiesięczne zestawienie składane z pięciu źródeł w arkuszu potrafi zająć dwa dni. Zautomatyzowany raport buduje się sam w nocy i rano czeka w skrzynce - zawsze w tym samym formacie, zawsze na czas.',
                    },
                    {
                        icon: 'alert',
                        title: 'Powiadomienia i eskalacje',
                        desc: 'Niezapłacona faktura, zlecenie bez odpowiedzi, kończący się termin umowy - system pilnuje tego za Ciebie i eskaluje do właściwej osoby, zanim problem urośnie.',
                    },
                ],
            },
            {
                heading: 'Sztuczna inteligencja w firmie - od czego zaczynamy',
                eyebrow: 'Jak pracujemy',
                paragraphs: [
                    'Nie zaczynamy od technologii, tylko od mapy procesów. W 30-minutowej darmowej diagnozie wskazujemy 2-3 miejsca, w których sztuczna inteligencja w firmie zwróci się najszybciej - policzalnie, w godzinach i złotówkach. Potem budujemy pierwszy workflow i testujemy go na Twoich danych przez 1-2 tygodnie. Dopiero gdy widzisz wynik na własnym procesie, decydujesz o kolejnych krokach.',
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
                    'Wdrożyliśmy workflow: mail przychodzący, automatyczny odczyt faktury przez AI, kategoryzacja kosztu i zapis w systemie. Czas operacji spadł z 2 dni roboczych do 15 minut, a księgowość zamiast przepisywać dane, kontroluje wyjątki. Ten sam wzorzec przenosimy do handlu, usług i logistyki - zmienia się dokument, mechanika zostaje.',
                ],
            },
        ],
        faq: [
            {
                q: 'Czym różni się automatyzacja AI od zwykłej automatyzacji?',
                a: 'Zwykła automatyzacja działa według sztywnych reguł: jeśli A, to B. Automatyzacja AI rozumie treść - odczyta fakturę z PDF-a, sklasyfikuje maila, streści dokument. Dzięki temu automatyzować można też procesy oparte na czytaniu i ocenie informacji, nie tylko na przenoszeniu danych między narzędziami.',
            },
            {
                q: 'Które procesy w firmie da się zautomatyzować?',
                a: 'Najlepiej automatyzują się procesy powtarzalne i oparte na danych: obieg faktur i dokumentów, przepisywanie danych między narzędziami, raportowanie, obsługa powtarzalnych zapytań, pilnowanie terminów. Jeśli zadanie da się opisać krok po kroku, prawie na pewno da się je zautomatyzować.',
            },
            {
                q: 'Jak szybko widać efekty automatyzacji AI?',
                a: 'Pierwszy działający workflow budujemy i testujemy w 1-2 tygodnie od diagnozy. Efekt widzisz od razu na własnych danych - średnia z naszych wdrożeń to ponad 10 godzin odzyskanych tygodniowo na pracownika, czyli ponad 200 godzin miesięcznie przy zespole 5-osobowym.',
            },
            {
                q: 'Czy automatyzacja AI jest bezpieczna dla danych firmy?',
                a: 'Tak, jeśli jest dobrze zaprojektowana. Rozwiązania budujemy w oparciu o zamknięte instancje i rygorystyczne polityki dostępu, a dane dokumentowe i finansowe nie służą do trenowania globalnych modeli. Zgodność z RODO sprawdzamy na etapie projektowania, nie po wdrożeniu.',
            },
            {
                q: 'Ile kosztuje automatyzacja procesów AI?',
                a: 'Koszt zależy od liczby i złożoności procesów, dlatego zaczynamy od darmowej diagnozy, po której dostajesz konkretną wycenę. Samo utrzymanie działających automatyzacji to najczęściej 200-600 PLN miesięcznie za subskrypcje narzędzi - przy kilku procesach w firmie 20-osobowej.',
            },
            {
                q: 'Od czego zacząć automatyzację w swojej firmie?',
                a: 'Od zmierzenia, gdzie uciekają godziny. Zrób bezpłatny mikro-audyt AI (4 minuty) albo policz koszt powtarzalnych zadań w kalkulatorze strat czasowych. Potem umów 30-minutową darmową diagnozę - dostaniesz mapę 2-3 procesów, od których warto zacząć.',
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
