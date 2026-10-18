import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Logo } from '@/components/ui/Logo';
import { GradientDivider } from '@/components/ui/GradientDivider';
import { Highlighter } from '@/components/ui/Highlighter';
import { AnimatedProcessIcon } from '@/components/ui/AnimatedProcessIcon';
import { LineFigure } from '@/components/ui/LineFigure';
import { LazyLineFigure } from '@/components/ui/LazyLineFigure';
import { IntegrationsMarquee } from '@/components/ui/IntegrationsMarquee';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ServiceArticle } from '@/components/ui/ServiceArticle';
import { ServiceFaq } from '@/components/ui/ServiceFaq';
import { GlareCard } from '@/components/ui/GlareCard';
import { Terminal, AnimatedSpan, TypingAnimation } from '@/components/ui/Terminal';
import { CircularGallery } from '@/components/ui/CircularGallery';
import { ThreeDMarquee } from '@/components/ui/ThreeDMarquee';
import { getServiceById } from '@/data/services';

/**
 * Przykładowe dane i przykłady dla płótna. Dane statyczne: services.js (to samo źródło co
 * /showcase), lokalne pliki z public/ i teksty wpisane tutaj. Żaden przykład nie woła API
 * ani nie zapisuje niczego poza stanem w pamięci.
 */

const AUTOMATION = getServiceById('automatyzacja');
const SECTIONS = AUTOMATION?.seoSections ?? [];
const FAQ = AUTOMATION?.faq?.slice(0, 3) ?? [];
const TOOLS = AUTOMATION?.innerCards?.find((card) => card.type === 'toolsMarquee')?.tools ?? [];
const sectionWith = (key) => SECTIONS.find((section) => section[key]);

const RELATED = [
  { href: '/audyt-ai', label: 'Mikro-audyt AI (4 minuty)' },
  { href: '/kalkulator', label: 'Kalkulator strat czasowych' },
];

const ACCORDION_ITEMS = [
  { value: 'start', q: 'Jak wygląda pierwszy krok?', a: 'Krótka rozmowa o procesie, który zajmuje zespołowi najwięcej czasu.' },
  { value: 'narzedzia', q: 'Czy trzeba zmieniać narzędzia?', a: 'Zwykle nie. Łączymy te, z których firma już korzysta.' },
  { value: 'zespol', q: 'Kto obsługuje automatyzację po wdrożeniu?', a: 'Zespół dostaje instrukcję i krótkie szkolenie z obsługi.' },
];

const LONG_TEXT = [
  'Dzień dobry, piszę w sprawie automatyzacji obiegu faktur w naszym biurze.',
  'Co miesiąc przepisujemy ręcznie około stu dokumentów do systemu księgowego i chcemy sprawdzić, czy da się to skrócić.',
  'Proszę o informację, jak wygląda pierwsza rozmowa.',
].join('\n\n');

const TERMINAL_STEPS = [
  'Analiza procesów klienta.',
  'Integracje: Google, Slack, CRM.',
  'Schemat bazy danych.',
  'Konfiguracja autentykacji.',
  'Generowanie modułu AI.',
  'Podpięcie n8n workflow.',
  'Panel administratora gotowy.',
];

const GALLERY_ITEMS = ['Faktury', 'CRM', 'Raporty', 'Maile', 'Umowy', 'Magazyn', 'Kalendarz', 'Arkusze'];

// Lokalne obrazy z public/ zamiast domyślnych z Unsplash (zero zapytań na zewnątrz).
const LOCAL_IMAGES = [
  '/industry_ads_new.png',
  '/industry_ecommerce_new.png',
  '/industry_healthcare_new.png',
  '/industry_hr_new.png',
  '/industry_law_new.png',
  '/industry_manufacturing_new.png',
  '/industry_property_new.png',
  '/industry_ads_new.png',
];

const REVEAL_TEXT = 'Automatyzacja AI łączy klasyczne przepływy danych z rozumieniem treści - dzięki temu obejmuje też zadania, które dotąd wymagały człowieka.';
const REVEAL_CLASS = 'text-xl md:text-2xl text-black leading-[1.55] tracking-tight';

function AccordionSample({ multiple = false, defaultValue, disabledValue }) {
  return (
    <Accordion multiple={multiple} defaultValue={defaultValue}>
      {ACCORDION_ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value} disabled={item.value === disabledValue}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** Kafelek jak na /showcase: ikona budzi się na hover i na focus klawiatury. */
function IconTile({ name }) {
  const [active, setActive] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Ikona ${name}`}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-black/5 bg-white text-black outline-none transition-colors hover:border-black/15 focus-visible:ring-2 focus-visible:ring-black/40"
    >
      <AnimatedProcessIcon name={name} active={active} />
    </button>
  );
}

function StaticIconTile({ active }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-black/5 bg-white text-black">
      <AnimatedProcessIcon name="sync" active={active} />
    </span>
  );
}

/** Highlighter rysuje raz przy montażu. "Przerysuj" montuje go od nowa (np. po zoomie 100%). */
function HighlighterSample({ action = 'highlight', isView = false }) {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-lg">
        Zdanie z <Highlighter key={run} action={action} isView={isView}>wyróżnioną frazą</Highlighter> w środku.
      </p>
      <Button variant="outline" size="xs" onClick={() => setRun((n) => n + 1)}>Przerysuj</Button>
    </div>
  );
}

function GlareCardSample({ isExpanded }) {
  const [clicks, setClicks] = useState(0);
  return (
    <GlareCard isExpanded={isExpanded} onClick={() => setClicks((n) => n + 1)} className="p-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dark">Usługa</p>
      <p className="mt-2 text-xl">Automatyzacja procesów</p>
      <p className="mt-2 text-sm text-muted-dark">Kliknięcia: {clicks}</p>
    </GlareCard>
  );
}

function TerminalSample({ variant }) {
  const [run, setRun] = useState(0);
  return (
    <div className="flex w-full flex-col items-start gap-3">
      {variant === 'bento' ? (
        <Terminal key={run}>
          <TypingAnimation duration={40}>&gt; npx create-workshift-app@latest</TypingAnimation>
          {TERMINAL_STEPS.map((step, i) => (
            <AnimatedSpan key={step} delay={1600 + i * 300} className="text-emerald-600">
              ✔ {step}
            </AnimatedSpan>
          ))}
          <TypingAnimation delay={4200} duration={30} className="text-black/55">
            Gotowe. Aplikacja wdrożona.
          </TypingAnimation>
        </Terminal>
      ) : (
        <Terminal key={run}>
          <TypingAnimation duration={40} loop={variant === 'loop'}>&gt; npm run build</TypingAnimation>
        </Terminal>
      )}
      <Button variant="outline" size="xs" onClick={() => setRun((n) => n + 1)}>Odtwórz ponownie</Button>
    </div>
  );
}

function GalleryTile({ label }) {
  return (
    <div className="w-24 rounded-[10px] border border-black/10 bg-white px-3 py-2 text-center font-mono text-xs">
      {label}
    </div>
  );
}

function Figure({ children }) {
  return <div className="w-full max-w-[320px]">{children}</div>;
}

// Klucze: id grupy i id porównania z variants.js. Każda funkcja dostaje id wariantu.
const RENDERERS = {
  'button': {
    'variant': (id) => <Button variant={id}>Dalej</Button>,
    'size': (id) => <Button size={id}>Dalej</Button>,
    'icon-size': (id) => <Button size={id} aria-label="Dalej"><ArrowRight /></Button>,
    'icon-position': (id) => (
      <Button>
        {id === 'inline-start' && <ArrowRight data-icon="inline-start" />}
        Dalej
        {id === 'inline-end' && <ArrowRight data-icon="inline-end" />}
      </Button>
    ),
    'state': (id) => <Button disabled={id === 'disabled'} aria-invalid={id === 'invalid' || undefined}>Dalej</Button>,
  },
  'input': {
    'state': (id) => (
      <Input
        placeholder="Imię i nazwisko"
        defaultValue={id === 'filled' || id === 'readonly' ? 'Anna Kowalska' : undefined}
        readOnly={id === 'readonly'}
        disabled={id === 'disabled'}
        aria-invalid={id === 'invalid' || undefined}
      />
    ),
    'type': (id) => <Input type={id} placeholder={id === 'email' ? 'adres@firma.pl' : 'Imię i nazwisko'} />,
  },
  'textarea': {
    'state': (id) => (
      <Textarea placeholder="Wiadomość" disabled={id === 'disabled'} aria-invalid={id === 'invalid' || undefined} />
    ),
    'content': (id) => (
      <Textarea placeholder="Wiadomość" defaultValue={id === 'long' ? LONG_TEXT : 'Dzień dobry, proszę o kontakt.'} />
    ),
  },
  'accordion': {
    'mode': (id) => <AccordionSample multiple={id === 'multiple'} />,
    'state': (id) => (
      <AccordionSample
        defaultValue={id === 'open' ? [ACCORDION_ITEMS[0].value] : undefined}
        disabledValue={id === 'disabled' ? ACCORDION_ITEMS[1].value : undefined}
      />
    ),
  },
  'logo': {
    'variant': (id) => <Logo variant={id} />,
    'wordmark': (id) => <Logo showWordmark={id === 'on'} />,
    'size': (id) => <Logo size={Number(id)} />,
  },
  'gradient-divider': {
    'default': () => <GradientDivider />,
  },
  'highlighter': {
    'action': (id) => <HighlighterSample action={id} />,
    'start': (id) => <HighlighterSample isView={id === 'in-view'} />,
  },
  'animated-process-icon': {
    'name': (id) => <IconTile name={id} />,
    'active': (id) => <StaticIconTile active={id === 'active'} />,
  },
  'glare-card': {
    'expanded': (id) => <GlareCardSample isExpanded={id === 'expanded'} />,
  },
  'terminal': {
    'composition': (id) => <TerminalSample variant={id} />,
    'loop': (id) => <TerminalSample variant={id} />,
  },
  'circular-gallery': {
    'reversed': (id) => (
      <div className="h-[260px] w-full overflow-hidden">
        <CircularGallery
          items={GALLERY_ITEMS}
          renderItem={(label) => <GalleryTile label={label} />}
          radius={320}
          offset={-100}
          elementSize={96}
          gap={12}
          duration={30}
          reversed={id === 'reversed'}
        />
      </div>
    ),
  },
  'three-d-marquee': {
    'columns': (id) => (
      <div className="h-[320px] w-full">
        <ThreeDMarquee images={LOCAL_IMAGES} columns={Number(id)} />
      </div>
    ),
  },
  'line-figure': {
    'figure': (id) => <Figure><LineFigure figure={id} tone="sage" label={`Figura ${id}`} /></Figure>,
    'tone': (id) => <Figure><LineFigure figure="relay" tone={id} label="Figura relay" /></Figure>,
    'play': (id) => <Figure><LineFigure figure="settle" play={id === 'on'} label="Figura settle" /></Figure>,
    'intensity': (id) => <Figure><LineFigure figure="hub" intensity={Number(id)} label="Figura hub" /></Figure>,
  },
  'lazy-line-figure': {
    'default': () => <Figure><LazyLineFigure figure="format" play label="Figura format" /></Figure>,
  },
  'integrations-marquee': {
    'badge': (id) => (
      <IntegrationsMarquee tools={TOOLS} badge={id === 'badge' ? 'i 200+ innych narzędzi z API lub webhookami' : undefined} />
    ),
  },
  'scroll-reveal': {
    'highlights': (id) => (
      <ScrollReveal text={REVEAL_TEXT} highlights={id === 'phrase' ? ['rozumieniem treści'] : []} className={REVEAL_CLASS} />
    ),
  },
  'service-article': {
    // id wariantu to nazwa pola sekcji w services.js (reveal, items, figure, stats).
    'content': (id) => {
      const section = sectionWith(id);
      return section ? <ServiceArticle sections={[section]} /> : <MissingData what={`sekcja z polem ${id}`} />;
    },
    'related': (id) => (
      <ServiceArticle sections={SECTIONS.slice(0, 1)} related={id === 'links' ? RELATED : undefined} />
    ),
  },
  'service-faq': {
    'heading': (id) => (
      id === 'custom'
        ? <ServiceFaq faq={FAQ} heading="Najczęstsze pytania" eyebrow="Pytania" />
        : <ServiceFaq faq={FAQ} />
    ),
  },
};

function MissingData({ what }) {
  return <p className="font-mono text-xs text-destructive">Brak danych: {what}</p>;
}

/** Jeden przykład: komponent z danymi dla wariantu `variantId` porównania `comparisonId`. */
export function GroupSample({ groupId, comparisonId, variantId }) {
  const render = RENDERERS[groupId]?.[comparisonId];
  if (!render) return <MissingData what={`przykład ${groupId}/${comparisonId}`} />;
  return render(variantId);
}
