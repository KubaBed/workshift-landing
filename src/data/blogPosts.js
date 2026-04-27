export const blogPosts = [
  {
    slug: 'pomelli-od-dzis-w-eu',
    title: 'Pomelli od Google: koniec z szukaniem logo_final_final_v2.png',
    category: 'Wiedza',
    date: '2026-04-24',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: '/images/blog/pomelli-od-dzis-w-eu.png',
    excerpt:
      'Pomelli od Google jest już dostępne w UE. Pobiera branding z Twojej strony WWW i automatycznie tworzy kreacje reklamowe i grafiki social media.',
    content: `
Chcesz wrzucić na szybko post z jakąś ładną, spójną grafiką. Odpalasz Canvę czy program graficzny i się zaczyna. Na dysku szukasz kodów kolorów Twojej marki, przekopujesz foldery żeby znaleźć logo bez tła (obiecując sobie przy okazji, że w końcu uporządkujesz pliki i zmienisz tę nieszczęsną nazwę z logo_final_final_v2_final.png).

Pilnowanie spójności wizualnej to często organizacyjny koszmar, zwłaszcza gdy nie masz pod ręką grafika.

Też tak czasem mam, dlatego z czystym sercem mogę polecić proste narzędzie od Google:

**Pomelli** ([labs.google.com/pomelli](https://labs.google.com/pomelli)) – od wczoraj dostępne w UE (wcześniej trzeba było korzystać z VPN, żeby uzyskać dostęp).

### W skrócie - Pomelli:

*   na podstawie adresu Waszej firmowej WWW pobiera branding (czcionki, paletę kolorów, styl komunikacji)
*   automatycznie tworzy kreacje reklamowe, wzory grafik do social mediów, czy co tam sobie wymarzymy.

Tylko tyle i aż tyle.

### Dlaczego to działa

Przyznam, że to jest dokładnie ten rodzaj AI, który lubię najbardziej - do bólu pragmatyczny, rozwiązujący konkretny problem, no i darmowy :).

Zero zabawy w ręczne ustawianie brand booka. Zero pisania doktoratów z promptowania. Czy to wypluje od razu dzieło sztuki? Nie. Wiadomo, że do większej kampanii i tak będziesz potrzebować doświadczonego oka artysty-grafika. AI rzadko robi od razu wszystko idealnie.

Ale jako mocny punkt wyjścia, który sprawdzi się w codziennej komunikacji? Sprawdza się genialnie. Technologia schodzi tu na dalszy plan, a my po prostu odzyskujemy czas.
    `,
  },
  {
    slug: 'brave-ai-community-meetup-poznan',
    title: 'II Meetup BRAVE AI Poznań: Build fast. Validate faster',
    category: 'Wydarzenia',
    date: '2026-04-13',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: '/images/blog/meetup-brave-ai-poznan.jpg',
    excerpt:
      'Zapraszam na 2. meetup BRAVE AI Community w Poznaniu! Porozmawiamy o tym, jak szybko i tanio walidować pomysły biznesowe z AI.',
    content: `
Rośnie nam w Poznaniu świetne community AI, którego mocno tu brakowało. Bardzo się cieszę, że do niego dołączyłem!

### Build fast. Validate faster.

Chcecie dowiedzieć się, jak z pomocą AI szybko sprawdzić, czy Wasz pomysł, nowa usługa albo usprawnienie w firmie faktycznie są warte "milion dolarów" - a przy okazji na tych testach nie zbankrutować?

Porozmawiajmy o tym już **14 kwietnia** na #2 meetupie BRAVE AI Community. Temat to: *Build fast. Validate faster.*

### Kogo zobaczycie na scenie?

Na scenie mocny skład praktyków:
*   Artur Skwarek
*   Michał Niekrasz
*   Piotr Synowiec

Ja też dorzucę coś od siebie i podzielę się krótką, życiową historią: **"Jak stracić przyjaciół i zaoszczędzić 35 000 PLN, budując aplikacje z Claude i Lovable"**.

Jeśli macie ochotę posłuchać wystąpień, ale przede wszystkim zbić piątkę, wymienić się doświadczeniami i poznać super ludzi – gorąco zapraszam.

---

📅 **14 kwietnia**
📍 Collegium Da Vinci, Poznań

**Rejestracja:** [Luma - Build fast. Validate faster.](https://luma.com/build-fast-validate-faster)
    `,
  },
  {
    slug: 'google-turboquant-kompresja-ai',
    title: 'Google TurboQuant: Algorytm, który zmieści potężne AI w Twoim telefonie',
    category: 'Wiedza',
    date: '2026-04-10',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    excerpt:
      'Google zaprezentowało algorytm bezstratnej kompresji KV cache. Co to oznacza dla prywatności i szybkości AI na smartfonach?',
    content: `
Był kiedyś taki serial - Dolina Krzemowa, ktoś pamięta? Opowiadał o startupie Pied Piper który próbował stworzyć algorytm bezstratnej kompresji, który miał wywrócić świat technologii do góry nogami. To była oczywiście fikcja.

Ale Google niedawno zaprezentowało coś, co jednoznacznie kojarzy się z takim właśnie rozwiązaniem. I do tego udostępnili to wszystkim za darmo!  

### Problem: Wąskie gardło pamięci

Kiedy piszesz z AI, model zapisuje całą waszą rozmowę w tymczasowej pamięci (tzw. KV cache). Przy długiej rozmowie, ta "ściągawka" dla jednego użytkownika potrafi zżerać 40 GB pamięci. Czyli połowę serwerowej karty graficznej za 30 000$. Tylko po to, żeby model pamiętał, że godzinę temu prosiłeś go o tabelkę w Excelu.

Gdy pamięć w chmurze się zapycha – system nie przyjmuje nowych zapytań. To obecnie największe "wąskie gardło" AI.

### Rozwiązanie: TurboQuant

I tu całe na biało wchodzi Google z algorytmem **TurboQuant**.
Udało im się skompresować tę pamięć tymczasową 6-krotnie. Zjechali z wagą danych do zaledwie 3 bitów na wartość. 

**Haczyk? Brak.** Zrobili to z zerowym spadkiem dokładności. Żadnej utraty jakości. Zero loss.

### Co to oznacza dla nas?

Dla gigantów technologicznych to oznacza jedno: na tym samym drogim sprzęcie mogą obsłużyć 6 razy więcej rozmów.

Ale dla nas, zwykłych śmiertelników, to oznacza coś o wiele ciekawszego. Potężne, inteligentne modele AI staną się tak lekkie, że za chwilę odpalisz je w pełni lokalnie, za darmo i bezpiecznie na podstawowym komputerze za parę tysięcy złotych. Albo bezpośrednio na swoim smartfonie. Szybciej, taniej i z o wiele dłuższą pamięcią kontekstu.

Google mogło to schować do szuflady i wykorzystywać tylko dla siebie, ale udostępnili to wszystkim. Więc za moment Twój telefon będzie w stanie spakować i bezbłędnie przeanalizować całą historię Twojej firmy z ostatnich 5 lat.
    `,
  },
  {
    slug: 'vibe-coding-demokratyzacja-software',
    title: 'Vibe-coding: Dlaczego "good enough" dowiezione dzisiaj jest lepsze niż perfekcja',
    category: 'Wiedza',
    date: '2026-04-05',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    excerpt:
      'Czy AI w rękach laików to budowa domu narzędziami z Lidla? O demokratyzacji tworzenia oprogramowania i sile MVP.',
    content: `
Przeczytałem dzisiaj wpis na LinkedIn o tym, że "vibe-koderzy" używający AI do pisania aplikacji to amatorzy, którzy z narzędziami z Lidla porywają się na budowę domu. Autor twierdzi, że AI w rękach laików nadaje się tylko do napisania prostego skryptu, a nie robienia realnych projektów.

Nie do końca się z tym zgadzam, mam trochę inną, też budowlaną analogię.

### YouTube w świecie kodu

Narzędzia takie jak Claude Code czy Cursor to odpowiednik dzisiejszego YouTube’a w świecie wykońzeniówki. Kiedyś, jeśli nie nauczył Cię tego rodzic albo szkoła, do każdego remontu musiałeś wołać specjalistę. Nieważne, czy to kładzenie gładzi, czy zwykłe malowanie. Nie miałeś alternatywy, więc płaciłeś te kilka/kilkanaście tysięcy, albo odkładałeś remont w nieskończoność.

Dzisiaj? Odpalasz tutorial na YouTube, dowiadujesz się, jak oczyścić, zagruntować i pomalować ścianę. Kupujesz wałek i robisz to sam.

*   Czy będzie to jakość mistrza z 20-letnim stażem? Prawdopodobnie nie.
*   Czy będzie to jakość "good enough", w której da się mieszkać? **Zdecydowanie tak.**

### Demokratyzacja budowania

MŚP często nie potrzebuje "startupu za miliard" ani perfekcyjnego kodu. Potrzebuje po prostu taniego sprawdzenia hipotezy, MVP albo prostej automatyzacji.

Co więcej, kiedy taka firma przy kolejnym, "większym remoncie" zaprosi do współpracy profesjonalistę, jej właściciel nie jest już całkowitym laikiem. Dzięki samodzielnej pracy z AI zdobył doświadczenie, lepsze rozumienie procesów i staje się partnerem do dyskusji. 

AI właśnie demokratyzuje budowanie oprogramowania. A "good enough" dowiezione dzisiaj, jest zawsze lepsze niż perfekcyjny projekt, na który firmy po prostu nie stać.
    `,
  },
  {
    slug: 'zatrudnie-juniora-ai',
    title: 'Zatrudnię Juniora za 2000$ miesięcznie! (Z małym twistem)',
    category: 'Wiedza',
    date: '2026-03-01',
    author: { name: 'Jakub Bednarz', avatar: '/Jakub-Bednarz.png' },
    image: '/images/blog/zatrudnie-juniora-ai.png',
    excerpt:
      'Ten junior pracuje 24/7, nie bierze L4 i nie zapomina o zadaniach. Poznaj junior.so i nową rzeczywistość agentów AI.',
    content: `
Zatrudnię Juniora za 2000$ miesięcznie! 
Takiego, co pracuje 24/7, nie bierze L4 i nie zapomina o żadnym zadaniu.

Brzmi nieźle? Jest tylko mały twist – ten junior to (oczywiście) AI.

Niedawno premierę miał serwis **junior.so**. Niby nic specjalnego, kolejny startup oparty o AI. Ale tym razem jest jakoś dziwnie - usługa pozwala nam zatrudnić niemal prawdziwego pracownika. Z własnym firmowym mailem, kontem na Slacku i ludzkim awatarem. Takiego, który przychodzi na calle na Zoomie, robi notatki, wychodzi z inicjatywą i realizuje zadania.

Ale spokojnie, nie ma się co martwić, że AI zabierze nam pracę. Parę dni temu powstała platforma **rentahuman.ai**. W tym serwisie to Agenci AI mogą wynająć żywego człowieka na godziny. Do odklikania zadań, z którymi kod jednak sam sobie nie radzi.

Więc rewolucja na rynku pracy raczej nie będzie wyglądać jak kadr z Terminatora.

Może zamiast tego na firmowym Slacku po prostu pojawi się skrypt, który jak czegoś nie ogarnie, to wynajmie nas na godziny jako swojego podwykonawcę. I jeszcze bezczelnie dopyta o deadline.
    `,
  },
];

export const blogCategories = [...new Set(blogPosts.map((post) => post.category))];

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug) || null;
}

export function getRelatedPosts(currentSlug, count = 2) {
  return blogPosts.filter((p) => p.slug !== currentSlug).slice(0, count);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
