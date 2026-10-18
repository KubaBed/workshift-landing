/**
 * Lista grup i wariantów płótna (/canvas). Czyste dane: bez JSX i bez importów komponentów,
 * żeby test pokrycia (variants.test.js) działał w samym Node.
 *
 * Każde porównanie zmienia jeden prop albo jedną cechę. Reszta stoi w miejscu: ten sam
 * tekst, te same dane, to samo tło slotu (`surface` porównania), chyba że sam wariant
 * definiuje tło (ton jasny i ciemny: `surface` wariantu), co opisuje `note`.
 *
 * `omitted`: czego świadomie nie pokazujemy i dlaczego (trafia też do raportu).
 */

/** Pliki z src/components/ui/, które płótno obejmuje (ten sam zestaw co /showcase plus reszta katalogu). */
export const UI_FILES = [
  'AnimatedProcessIcon.jsx',
  'Button.jsx',
  'CircularGallery.jsx',
  'GlareCard.jsx',
  'GradientDivider.jsx',
  'Highlighter.jsx',
  'IntegrationsMarquee.jsx',
  'LazyLineFigure.jsx',
  'LineFigure.jsx',
  'Logo.jsx',
  'ScrollReveal.jsx',
  'ServiceArticle.jsx',
  'ServiceFaq.jsx',
  'Terminal.jsx',
  'ThreeDMarquee.jsx',
  'accordion.jsx',
  'input.jsx',
  'textarea.jsx',
];

const v = (id, label = id) => ({ id, label });
// Wariant z własnym tłem slotu (ton jasny i ciemny). Opis w `note` porównania.
const onBlack = (variant) => ({ ...variant, surface: 'black' });

export const CANVAS_GROUPS = [
  {
    id: 'button',
    title: 'Button',
    files: ['Button.jsx'],
    column: 0,
    comparisons: [
      {
        id: 'variant',
        label: 'Styl: variant (size="default", tekst "Dalej")',
        slotMin: 136,
        variants: ['default', 'accent', 'accent-outline', 'outline', 'secondary', 'ghost', 'link', 'destructive'].map((id) => v(id, `variant="${id}"`)),
      },
      {
        id: 'size',
        label: 'Rozmiar: size (variant="default", tekst "Dalej")',
        slotMin: 136,
        variants: ['xs', 'sm', 'default', 'lg'].map((id) => v(id, `size="${id}"`)),
      },
      {
        id: 'icon-size',
        label: 'Rozmiar przycisku z samą ikoną (variant="default", ikona strzałki)',
        slotMin: 136,
        variants: ['icon-xs', 'icon-sm', 'icon', 'icon-lg'].map((id) => v(id, `size="${id}"`)),
      },
      {
        id: 'icon-position',
        label: 'Ikona obok tekstu: data-icon (variant="default", size="default")',
        slotMin: 136,
        variants: [v('none', 'bez ikony'), v('inline-start', 'data-icon="inline-start"'), v('inline-end', 'data-icon="inline-end"')],
      },
      {
        id: 'state',
        label: 'Stan (variant="default", size="default")',
        slotMin: 136,
        variants: [v('enabled', 'aktywny'), v('disabled', 'disabled'), v('invalid', 'aria-invalid')],
        note: 'Hover, focus i wciśnięcie sprawdzaj kursorem i klawiaturą, bez dokładanych klas.',
      },
    ],
    omitted: [
      'render jako link (prop render z Base UI, styl [a]:hover): strona nigdzie go nie używa.',
      'Style dark: (dark:*) i grupa przycisków (data-slot=button-group): strona nie ma ciemnego motywu ani ButtonGroup.',
    ],
  },
  {
    id: 'input',
    title: 'Input',
    files: ['input.jsx'],
    column: 0,
    comparisons: [
      {
        id: 'state',
        label: 'Stan (type="text", placeholder "Imię i nazwisko")',
        slotMin: 240,
        variants: [v('default', 'pusty'), v('filled', 'z wartością'), v('readonly', 'readOnly'), v('disabled', 'disabled'), v('invalid', 'aria-invalid')],
      },
      {
        id: 'type',
        label: 'Typ: type (stan domyślny)',
        slotMin: 240,
        variants: ['text', 'email', 'file'].map((id) => v(id, `type="${id}"`)),
        note: 'type="file" tylko wybiera plik lokalnie. Nic nie jest wysyłane.',
      },
    ],
    omitted: ['Pozostałe typy HTML (number, date, password...): komponent nie ma dla nich osobnych stylów.'],
  },
  {
    id: 'textarea',
    title: 'Textarea',
    files: ['textarea.jsx'],
    column: 0,
    comparisons: [
      {
        id: 'state',
        label: 'Stan (placeholder "Wiadomość")',
        slotMin: 240,
        variants: [v('default', 'pusty'), v('disabled', 'disabled'), v('invalid', 'aria-invalid')],
      },
      {
        id: 'content',
        label: 'Wysokość dopasowana do treści: field-sizing (stan domyślny)',
        slotMin: 240,
        variants: [v('short', 'jedno zdanie'), v('long', 'kilka akapitów')],
      },
    ],
    omitted: [],
  },
  {
    id: 'accordion',
    title: 'Accordion',
    files: ['accordion.jsx'],
    column: 0,
    comparisons: [
      {
        id: 'mode',
        label: 'Tryb: multiple (trzy te same pytania, wszystkie zamknięte)',
        slotMin: 320,
        stretch: true,
        variants: [v('single', 'multiple={false}'), v('multiple', 'multiple')],
      },
      {
        id: 'state',
        label: 'Stan początkowy (multiple={false})',
        slotMin: 320,
        stretch: true,
        variants: [v('closed', 'wszystkie zamknięte'), v('open', 'defaultValue: pierwsze'), v('disabled', 'drugie disabled')],
      },
    ],
    omitted: [
      'orientation="horizontal": zmienia tylko klawisze nawigacji, style komponentu są pionowe.',
      'hiddenUntilFound i loopFocus: brak różnicy wizualnej.',
    ],
  },
  {
    id: 'logo',
    title: 'Logo',
    files: ['Logo.jsx'],
    column: 0,
    comparisons: [
      {
        id: 'variant',
        label: 'Wariant: variant (size 36, z napisem)',
        slotMin: 240,
        variants: [v('light', 'variant="light"'), onBlack(v('dark', 'variant="dark"'))],
        note: 'Tło slotu zmienia się razem z wariantem: "dark" to biały napis do czarnej sekcji.',
      },
      {
        id: 'wordmark',
        label: 'Napis: showWordmark (variant="light", size 36)',
        slotMin: 240,
        variants: [v('on', 'showWordmark'), v('off', 'showWordmark={false}')],
      },
      {
        id: 'size',
        label: 'Rozmiar: size (variant="light", z napisem)',
        slotMin: 240,
        variants: ['24', '36', '48'].map((id) => v(id, `size={${id}}`)),
      },
    ],
    omitted: [],
  },
  {
    id: 'gradient-divider',
    title: 'GradientDivider',
    files: ['GradientDivider.jsx'],
    column: 0,
    comparisons: [
      {
        id: 'default',
        label: 'Jedyny wariant (komponent nie ma propów poza className)',
        slotMin: 320,
        stretch: true,
        variants: [v('default', 'domyślny')],
      },
    ],
    omitted: [],
  },
  {
    id: 'highlighter',
    title: 'Highlighter',
    files: ['Highlighter.jsx'],
    column: 1,
    comparisons: [
      {
        id: 'action',
        label: 'Kształt: action (to samo zdanie, isView={false})',
        slotMin: 260,
        variants: ['highlight', 'underline', 'box', 'circle', 'strike-through', 'crossed-off', 'bracket'].map((id) => v(id, `action="${id}"`)),
        note: 'rough-notation mierzy pozycję w pikselach ekranu, więc rysunek pasuje tylko przy zoomie 100%. Ustaw 100% (reset widoku) i kliknij "Przerysuj".',
      },
      {
        id: 'start',
        label: 'Start rysowania: isView (action="highlight")',
        slotMin: 260,
        variants: [v('immediate', 'isView={false}'), v('in-view', 'isView')],
      },
    ],
    omitted: ['color, strokeWidth, padding, iterations, animationDuration, multiline: parametry rysunku, nie warianty.'],
  },
  {
    id: 'animated-process-icon',
    title: 'AnimatedProcessIcon',
    files: ['AnimatedProcessIcon.jsx'],
    column: 1,
    comparisons: [
      {
        id: 'name',
        label: 'Ikona: name (kafelek budzi ikonę na hover i na focus)',
        slotMin: 96,
        variants: ['invoice', 'sync', 'report', 'alert', 'clock', 'inbox'].map((id) => v(id, `name="${id}"`)),
      },
      {
        id: 'active',
        label: 'Stan: active (name="sync")',
        slotMin: 96,
        variants: [v('idle', 'active={false}'), v('active', 'active')],
      },
    ],
    omitted: [],
  },
  {
    id: 'glare-card',
    title: 'GlareCard',
    files: ['GlareCard.jsx'],
    column: 1,
    comparisons: [
      {
        id: 'expanded',
        label: 'Rozwinięcie: isExpanded (ta sama treść, licznik kliknięć)',
        slotMin: 280,
        stretch: true,
        variants: [v('collapsed', 'isExpanded={false}'), v('expanded', 'isExpanded')],
        note: 'Karta to div z onClick: klikalna myszą, bez obsługi klawiatury (tak jest w komponencie).',
      },
    ],
    omitted: [],
  },
  {
    id: 'terminal',
    title: 'Terminal, AnimatedSpan, TypingAnimation',
    files: ['Terminal.jsx'],
    column: 1,
    comparisons: [
      {
        id: 'composition',
        label: 'Kompozycja z bento usług: pisanie, linie z opóźnieniem, końcowy komunikat',
        slotMin: 420,
        variants: [v('bento', 'sekwencja z bento')],
      },
      {
        id: 'loop',
        label: 'Pętla: TypingAnimation loop (ta sama komenda)',
        slotMin: 420,
        variants: [v('once', 'loop={false}'), v('loop', 'loop')],
      },
    ],
    omitted: ['TypingAnimation startOnView={false}: wynik wygląda tak samo, różni się tylko moment startu.'],
  },
  {
    id: 'circular-gallery',
    title: 'CircularGallery',
    files: ['CircularGallery.jsx'],
    column: 1,
    comparisons: [
      {
        id: 'reversed',
        label: 'Kierunek: reversed (te same kafelki, radius 320, duration 30)',
        slotMin: 420,
        stretch: true,
        variants: [v('forward', 'reversed={false}'), v('reversed', 'reversed')],
      },
    ],
    omitted: ['radius, offset, gap, elementSize, duration: geometria i tempo, nie warianty.'],
  },
  {
    id: 'three-d-marquee',
    title: 'ThreeDMarquee',
    files: ['ThreeDMarquee.jsx'],
    column: 1,
    comparisons: [
      {
        id: 'columns',
        label: 'Kolumny: columns (te same lokalne obrazy)',
        slotMin: 420,
        stretch: true,
        variants: [v('2', 'columns={2}'), v('4', 'columns={4}')],
        note: 'Domyślne obrazy komponentu leżą na Unsplash. Płótno podaje lokalne pliki z public/, żeby nie wysyłać zapytań na zewnątrz.',
      },
    ],
    omitted: ['Domyślne obrazy (defaultCreativeImages z Unsplash): zewnętrzne zapytania, zastąpione lokalnymi.'],
  },
  {
    id: 'line-figure',
    title: 'LineFigure',
    files: ['LineFigure.jsx'],
    column: 2,
    comparisons: [
      {
        id: 'figure',
        label: 'Figura: figure (tone="sage", intensity domyślne, play={false})',
        slotMin: 260,
        stretch: true,
        variants: ['relay', 'hub', 'settle', 'format'].map((id) => v(id, `figure="${id}"`)),
      },
      {
        id: 'tone',
        label: 'Ton: tone (figure="relay")',
        slotMin: 260,
        stretch: true,
        variants: [v('sage', 'tone="sage"'), onBlack(v('dark', 'tone="dark"'))],
        note: 'Tło slotu zmienia się razem z tonem: płyty figury mają kolor tła sekcji.',
      },
      {
        id: 'play',
        label: 'Autoodtwarzanie: play (figure="settle")',
        slotMin: 260,
        stretch: true,
        variants: [v('off', 'play={false}'), v('on', 'play')],
      },
      {
        id: 'intensity',
        label: 'Intensywność: intensity (figure="hub")',
        slotMin: 260,
        stretch: true,
        variants: ['0.2', '0.5', '1'].map((id) => v(id, `intensity={${id}}`)),
      },
    ],
    omitted: [],
  },
  {
    id: 'lazy-line-figure',
    title: 'LazyLineFigure',
    files: ['LazyLineFigure.jsx'],
    column: 2,
    comparisons: [
      {
        id: 'default',
        label: 'Ładowanie przy zbliżeniu do ekranu (figure="format", play)',
        slotMin: 260,
        stretch: true,
        variants: [v('format', 'figure="format" play')],
        note: 'Propsy idą 1:1 do LineFigure, więc warianty figury są w grupie LineFigure.',
      },
    ],
    omitted: [],
  },
  {
    id: 'integrations-marquee',
    title: 'IntegrationsMarquee',
    files: ['IntegrationsMarquee.jsx'],
    column: 2,
    comparisons: [
      {
        id: 'badge',
        label: 'Podpis: badge (narzędzia z karty toolsMarquee, tło białe)',
        slotMin: 520,
        stretch: true,
        surface: 'white',
        variants: [v('none', 'bez badge'), v('badge', 'badge')],
      },
    ],
    omitted: ['Statyczna siatka dla prefers-reduced-motion: wybiera ją ustawienie systemu, płótno nie podmienia matchMedia. Sprawdź emulacją w DevTools.'],
  },
  {
    id: 'scroll-reveal',
    title: 'ScrollReveal',
    files: ['ScrollReveal.jsx'],
    column: 2,
    comparisons: [
      {
        id: 'highlights',
        label: 'Wyróżnienia: highlights (ten sam akapit, tło białe)',
        slotMin: 520,
        stretch: true,
        surface: 'white',
        variants: [v('none', 'highlights={[]}'), v('phrase', 'highlights={["rozumieniem treści"]}')],
        note: 'Odsłanianie liczy się z przewijania strony, a płótno strony nie przewija. Widać stan z pozycji startowej i wyróżnienia.',
      },
    ],
    omitted: ['Animacja odsłaniania przy przewijaniu: wymaga przewijanej strony, żywy przykład na /uslugi/automatyzacja.'],
  },
  {
    id: 'service-article',
    title: 'ServiceArticle',
    files: ['ServiceArticle.jsx'],
    column: 3,
    comparisons: [
      {
        id: 'content',
        label: 'Rodzaj sekcji (jedna sekcja z services.js, tło białe)',
        slotMin: 560,
        stretch: true,
        surface: 'white',
        variants: [v('reveal', 'akapit z reveal'), v('items', 'karty procesów (items)'), v('figure', 'figura (figure)'), v('stats', 'panel liczb (stats)')],
      },
      {
        id: 'related',
        label: 'Linki "Sprawdź też": related (pierwsza sekcja, tło białe)',
        slotMin: 560,
        stretch: true,
        surface: 'white',
        variants: [v('none', 'bez related'), v('links', 'related: 2 linki')],
        note: 'Kliknięcie linku nie opuszcza płótna. Cmd albo Ctrl + klik otwiera go w nowej karcie.',
      },
    ],
    omitted: [],
  },
  {
    id: 'service-faq',
    title: 'ServiceFaq',
    files: ['ServiceFaq.jsx'],
    column: 3,
    comparisons: [
      {
        id: 'heading',
        label: 'Nagłówek: heading i eyebrow (te same 3 pytania z services.js, tło białe)',
        slotMin: 560,
        stretch: true,
        surface: 'white',
        variants: [v('default', 'domyślne'), v('custom', 'heading i eyebrow własne')],
      },
    ],
    omitted: [],
  },
];

export const GROUP_IDS = CANVAS_GROUPS.map((group) => group.id);

/** id elementu DOM grupy: kotwica #<id> przesuwa kamerę do tej grupy. */
export const groupDomId = (id) => `canvas-${id}`;
