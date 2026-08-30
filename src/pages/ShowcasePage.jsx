import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/ui/Logo';
import { GradientDivider } from '@/components/ui/GradientDivider';
import { Highlighter } from '@/components/ui/Highlighter';
import { ServiceArticle } from '@/components/ui/ServiceArticle';
import { ServiceFaq } from '@/components/ui/ServiceFaq';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedProcessIcon } from '@/components/ui/AnimatedProcessIcon';
import { getServiceById } from '@/data/services';

/**
 * /showcase - katalog komponentów Workshift.
 *
 * Po co: nowy komponent buduje się TUTAJ, zanim trafi na stronę. Bez tego każdy
 * komponent powstaje od razu w kontekście gotowej sekcji, co zabija eksplorację
 * wariantów (grawitacja prototypu). Patrz vault: wiki/playbooks/design-with-ai-de-slop.md
 *
 * Strona działa też na produkcji (workshift.pl/showcase), żeby dało się wysłać link
 * współpracownikowi. Trzy warstwy odcięcia od wyszukiwarek:
 *   1. nagłówek X-Robots-Tag w vercel.json (działa bez wykonania JS - to ta istotna)
 *   2. meta robots wstrzykiwany poniżej (wzorzec z OfferPage.jsx)
 *   3. Disallow w public/robots.txt, brak wpisu w sitemap.xml
 * Nie ma linku do tej trasy z żadnej strony - dostęp tylko przez wpisanie adresu.
 *
 * Uzupełniaj przy KAŻDYM nowym komponencie w src/components/ui/.
 */

function Section({ id, title, note, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-black/10 py-12">
      <header className="mb-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-black/50">{id}</h2>
        <h3 className="mt-1 text-2xl font-normal">{title}</h3>
        {note && <p className="mt-2 max-w-2xl text-sm text-black/60">{note}</p>}
      </header>
      {children}
    </section>
  );
}

function ShowcaseIconTile({ name }) {
  const [active, setActive] = useState(false);
  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="flex flex-col items-center gap-2 rounded-[10px] border border-black/5 bg-sage p-5 transition-colors hover:border-black/15"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-black/5 bg-white text-black">
        <AnimatedProcessIcon name={name} active={active} />
      </div>
      <span className="font-mono text-xs text-black/50">{name}</span>
    </div>
  );
}

function Swatch({ name, value, token }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-20 w-full rounded-lg border border-black/10"
        style={{ background: value }}
      />
      <div className="font-mono text-xs leading-relaxed">
        <div>{name}</div>
        <div className="text-black/50">{value}</div>
        <div className="text-black/40">{token}</div>
      </div>
    </div>
  );
}

// Sekcje strony głównej podglądane przez istniejący mechanizm ?preview=<key> w App.jsx
const SECTION_KEYS = [
  'hero', 'quote', 'services', 'process', 'industries', 'metrics',
  'about', 'testimonials', 'faq', 'newsletter', 'contact', 'cta', 'footer',
];

const BUTTON_VARIANTS = [
  'accent', 'accent-outline', 'default', 'outline', 'secondary', 'ghost', 'link', 'destructive',
];
const BUTTON_SIZES = ['xs', 'sm', 'default', 'lg'];

export default function ShowcasePage() {
  const [dark, setDark] = useState(false);

  // noindex tylko dla tej trasy. index.html ma już <meta name="robots" content="index, follow">,
  // więc NIE dokładamy drugiego tagu (dwa sprzeczne meta robots to proszenie się o kłopoty) -
  // nadpisujemy istniejący i przywracamy wartość w cleanupie, bo w SPA <head> przeżywa nawigację.
  useEffect(() => {
    const existing = document.querySelector('meta[name="robots"]');
    const meta = existing || document.createElement('meta');
    const prevContent = existing ? existing.getAttribute('content') : null;
    const prevTitle = document.title;

    meta.setAttribute('name', 'robots');
    meta.setAttribute('content', 'noindex,nofollow,noarchive');
    if (!existing) document.head.appendChild(meta);
    document.title = 'Showcase komponentów | Workshift (nieindeksowane)';

    return () => {
      if (existing) {
        meta.setAttribute('content', prevContent);
      } else {
        try { document.head.removeChild(meta); } catch { /* ok */ }
      }
      document.title = prevTitle;
    };
  }, []);

  return (
    <div className={dark ? 'min-h-screen bg-black text-white' : 'min-h-screen bg-sage text-black'}>
      <div className="mx-auto w-full max-w-[1320px] px-5 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4 pb-8">
          <div>
            <h1 className="text-3xl font-normal">Showcase komponentów</h1>
            <p className="mt-1 text-sm text-black/60">
              Buduj tu komponent, zanim wejdzie na stronę. Strona jest nieindeksowana
              i nigdzie nie podlinkowana.
            </p>
          </div>
          <Button variant="accent-outline" onClick={() => setDark((d) => !d)}>
            Tło: {dark ? 'czarne' : 'sage'}
          </Button>
        </header>

        <nav className="flex flex-wrap gap-x-4 gap-y-1 border-y border-black/10 py-3 font-mono text-xs uppercase tracking-wider">
          {['tokens', 'typografia', 'buttons', 'forms', 'brand', 'sekcje'].map((id) => (
            <a key={id} href={`#${id}`} className="hover:underline">{id}</a>
          ))}
        </nav>

        <Section
          id="tokens"
          title="Kolory"
          note="Źródło prawdy: src/index.css. Czerń jest tłem SEKCJI, nie motywem strony."
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            <Swatch name="sage" value="#E6E8DD" token="--color-sage / bg-sage" />
            <Swatch name="lime" value="#9CE069" token="--color-lime / bg-lime" />
            <Swatch name="black" value="#000000" token="--color-dark" />
            <Swatch name="muted dark" value="#595959" token="--color-muted-dark" />
            <Swatch name="muted light" value="#AAAAAA" token="--color-muted-light" />
          </div>
        </Section>

        <Section
          id="typografia"
          title="Typografia"
          note="Inter + IBM Plex Mono, self-hosted z public/fonts. Nagłówki mają font-weight 400 - bold (700) jest zarezerwowany dla wordmarku."
        >
          <div className="space-y-4">
            <p className="text-5xl font-normal leading-tight">H1 / 48 / 400 - Automatyzacja bez etatu</p>
            <p className="text-3xl font-normal">H2 / 30 / 400 - Co robimy</p>
            <p className="text-xl font-normal">H3 / 20 / 400 - Jak przebiega wdrożenie</p>
            <p className="max-w-2xl text-base">
              Body / 16 - tekst akapitowy w Inter. Polska typografia: tylko dywiz, nigdy pauza.
            </p>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-black/60">
              Mono / 14 / tracking 0.2em - kicker
            </p>
          </div>
        </Section>

        <Section id="buttons" title="Button" note="src/components/ui/Button.jsx - warianty x rozmiary.">
          <div className="space-y-6">
            <div>
              <p className="mb-3 font-mono text-xs uppercase text-black/50">warianty (size: default)</p>
              <div className="flex flex-wrap gap-3">
                {BUTTON_VARIANTS.map((v) => (
                  <Button key={v} variant={v}>{v}</Button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs uppercase text-black/50">rozmiary (variant: accent)</p>
              <div className="flex flex-wrap items-center gap-3">
                {BUTTON_SIZES.map((s) => (
                  <Button key={s} variant="accent" size={s}>{s}</Button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs uppercase text-black/50">stany</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="accent" disabled>disabled</Button>
                <Button variant="accent-outline" disabled>disabled outline</Button>
              </div>
            </div>
          </div>
        </Section>

        <Section id="forms" title="Pola formularza" note="Input i Textarea (base-ui).">
          <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
            <Input placeholder="Imię" />
            <Input type="email" placeholder="E-mail" />
            <Input placeholder="Zablokowane" disabled />
            <Input placeholder="Błąd" aria-invalid />
            <Textarea placeholder="Wiadomość" className="sm:col-span-2" rows={4} />
          </div>
        </Section>

        <Section id="brand" title="Elementy marki" note="Logo, divider, highlighter.">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-8">
              <Logo variant="light" />
              <Logo variant="light" showWordmark={false} />
              <div className="rounded-lg bg-black p-4">
                <Logo variant="dark" />
              </div>
            </div>
            <GradientDivider />
            <p className="max-w-xl text-lg">
              Zdanie z <Highlighter isView>podkreśloną frazą</Highlighter> - highlighter
              wchodzi w akcję po wejściu w viewport.
            </p>
          </div>
        </Section>

        <Section
          id="animated-icons"
          title="AnimatedProcessIcon"
          note="src/components/ui/AnimatedProcessIcon.jsx - ikony procesów animowane framer-motion (wzór heroicons-animated). Najedź, żeby uruchomić animację."
        >
          <div className="flex flex-wrap gap-4">
            {['invoice', 'sync', 'report', 'alert'].map((name) => (
              <ShowcaseIconTile key={name} name={name} />
            ))}
          </div>
        </Section>

        <Section
          id="scroll-reveal"
          title="ScrollReveal"
          note="src/components/ui/ScrollReveal.jsx - scroll-scrubbed word reveal (wzór skiper-ui #70). Słowa wyostrzają się w rytmie scrolla, frazy z highlights dostają tło lime. Opacity startuje z 0.15, nie 0 (SEO)."
        >
          <div className="max-w-2xl rounded-lg border border-black/10 bg-white p-8">
            <ScrollReveal
              text="Automatyzacja AI łączy klasyczne przepływy danych z rozumieniem treści - dzięki temu obejmuje też zadania, które dotąd wymagały człowieka."
              highlights={['rozumieniem treści']}
              className="text-xl md:text-2xl text-black leading-[1.55] tracking-tight"
            />
          </div>
        </Section>

        <Section
          id="service-article"
          title="ServiceArticle + ServiceFaq"
          note="src/components/ui/ServiceArticle.jsx i ServiceFaq.jsx - sekcja artykułowa i FAQ strony usługi (Sprint 1 SEO + redesign). Dane z services.js (seoSections/faq); pola eyebrow/reveal/icon/stats są czysto wizualne. Żywy render: /uslugi/automatyzacja."
        >
          <div className="rounded-lg border border-black/10 bg-white px-6 py-2">
            <ServiceArticle
              sections={getServiceById('automatyzacja')?.seoSections?.slice(0, 2)}
              related={[
                { href: '/audyt-ai', label: 'Mikro-audyt AI (4 minuty)' },
                { href: '/kalkulator', label: 'Kalkulator strat czasowych' },
              ]}
            />
            <ServiceFaq faq={getServiceById('automatyzacja')?.faq?.slice(0, 2)} />
            <div className="h-8" />
          </div>
        </Section>

        <Section
          id="sekcje"
          title="Sekcje strony głównej"
          note="Podgląd pojedynczej sekcji przez istniejący mechanizm ?preview= w App.jsx."
        >
          <div className="flex flex-wrap gap-2">
            {SECTION_KEYS.map((key) => (
              <a
                key={key}
                href={`/?preview=${key}`}
                className="rounded-lg border border-black/20 px-3 py-1.5 font-mono text-xs hover:bg-lime"
              >
                {key}
              </a>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
