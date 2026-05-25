import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Eye, Calendar } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

function SectionWrap({ children, className = '' }) {
  return (
    <section className={`relative py-14 md:py-20 px-6 ${className}`}>
      <div className="max-w-[1100px] mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="inline-block font-mono text-[11px] uppercase tracking-[0.22em] text-muted-dark bg-black/5 px-3 py-1 rounded-full mb-6">
      {children}
    </span>
  );
}

function LimeDivider() {
  return <div className="w-12 h-px bg-lime mb-6" />;
}

// Mały status pasek u góry oferty - pokazuje liczbę otwarć i datę ważności.
// Subtelny, tylko po odblokowaniu. Wykorzystuje dane z /api/offers/views.
export function StatusBanner({ views, validUntil }) {
  if (!views && !validUntil) return null;
  const count = views?.count ?? 0;
  let lastLabel = '';
  if (views?.last) {
    try {
      const d = new Date(views.last);
      lastLabel = d.toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
    } catch { /* ignore */ }
  }
  return (
    <div className="sticky top-0 z-30 bg-sage/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1100px] mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-dark">
        <div className="flex items-center gap-4">
          {count > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye size={12} className="text-lime" />
              {count} {count === 1 ? 'otwarcie' : 'otwarć'}
              {lastLabel && <span className="text-muted-light normal-case tracking-normal ml-1">· ostatnio {lastLabel}</span>}
            </span>
          )}
        </div>
        {validUntil && (
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            Ważna do {validUntil}
          </span>
        )}
      </div>
    </div>
  );
}

// Embed do Loom / YouTube - bezpieczna ramka iframe z lazy loading.
// Jeśli video.id pusty, sekcja się nie renderuje (placeholder logic ready).
function VideoEmbed({ video }) {
  if (!video || !video.id) return null;
  let src = '';
  if (video.provider === 'loom') {
    src = `https://www.loom.com/embed/${encodeURIComponent(video.id)}?hide_owner=true&hideEmbedTopBar=true`;
  } else if (video.provider === 'youtube') {
    src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?rel=0&modestbranding=1`;
  } else {
    return null;
  }
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-black/10 bg-black/5 mb-10 max-w-3xl">
      <iframe
        src={src}
        title={video.title || 'Wprowadzenie do oferty'}
        loading="lazy"
        allow="fullscreen; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export function HeroSection({ meta, client, video }) {
  return (
    <SectionWrap className="pt-24 md:pt-32 pb-12">
      <motion.div {...fadeUp}>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-dark mb-6">
          Workshift → {client.name.replace(' Sp. z o.o.', '')}
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-black leading-[1.05] mb-6">
          {meta.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-dark max-w-2xl leading-relaxed mb-10">
          {meta.subtitle}
        </p>
        <VideoEmbed video={video} />
        <LimeDivider />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-dark">
          {meta.dateSent} · {meta.author}
        </p>
      </motion.div>
    </SectionWrap>
  );
}

// TL;DR - "above-the-fold" przegląd dla decydenta-skanera. 3-4 punkty,
// renderowane jako pierwsza sekcja po Hero. Każdy z hyphen prefix
// (zgodnie z Workshift typography rule: hyphen, nie em-dash).
export function TldrSection({ tldr }) {
  if (!Array.isArray(tldr) || tldr.length === 0) return null;
  return (
    <SectionWrap className="pt-4 md:pt-6">
      <motion.div {...fadeUp}>
        <SectionLabel>W skrócie</SectionLabel>
        <ul className="flex flex-col gap-4 max-w-3xl">
          {tldr.map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="font-display text-2xl text-lime leading-none mt-1 shrink-0 select-none" aria-hidden="true">-</span>
              <span className="text-lg md:text-xl text-black leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </SectionWrap>
  );
}

export function ContextSection({ context }) {
  return (
    <SectionWrap>
      <motion.div {...fadeUp}>
        <SectionLabel>Kontekst</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 leading-tight">
          {context.headline}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {context.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="border-t border-black/15 pt-4"
            >
              <div className="w-8 h-px bg-lime mb-3" />
              <p className="text-2xl md:text-3xl font-display tracking-tight text-black mb-2 leading-tight">
                {stat.value}
              </p>
              <p className="text-sm text-muted-dark leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrap>
  );
}

export function ProblemsSection({ problems }) {
  return (
    <SectionWrap>
      <motion.div {...fadeUp}>
        <SectionLabel>Dwa procesy do automatyzacji</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 leading-tight">
          Co rozwiązujemy
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {problems.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl p-8 border ${p.selected ? 'border-lime bg-white/60' : 'border-black/10 bg-white/30'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-dark">{p.label}</p>
                {p.selected && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] bg-lime text-black px-2 py-1 rounded-full">
                    Pilotaż
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-display tracking-tight text-black mb-4 leading-tight">
                {p.title}
              </h3>
              <p className="text-sm font-mono text-black mb-4">{p.metric}</p>
              <p className="text-base text-muted-dark leading-relaxed mb-5">{p.body}</p>
              <blockquote className="border-l-2 border-lime pl-4 text-sm italic text-muted-dark">
                {p.quote}
              </blockquote>
            </div>
          ))}
        </div>
      </motion.div>
    </SectionWrap>
  );
}

export function ApproachSection({ approach }) {
  return (
    <SectionWrap>
      <motion.div {...fadeUp}>
        <SectionLabel>Nasze podejście</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 leading-tight max-w-3xl">
          {approach.headline}
        </h2>
        <ul className="flex flex-col gap-4 mb-10 max-w-3xl">
          {approach.reasons.map((reason, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="mt-1 w-6 h-6 rounded-full bg-lime flex items-center justify-center shrink-0">
                <Check size={14} className="text-black" strokeWidth={2.5} />
              </span>
              <span className="text-lg text-black leading-relaxed">{reason}</span>
            </li>
          ))}
        </ul>
        <div className="border-l-3 border-lime pl-6 py-3 max-w-3xl">
          <p className="text-base italic text-muted-dark leading-relaxed">{approach.callout}</p>
        </div>
      </motion.div>
    </SectionWrap>
  );
}

function PhaseCard({ phase }) {
  return (
    <motion.div
      {...fadeUp}
      className="rounded-2xl p-8 md:p-10 border border-black/10 bg-white/60"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black bg-lime px-3 py-1 rounded-full">
          {phase.label}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-dark">
          {phase.duration}
        </span>
      </div>

      <h3 className="text-2xl md:text-4xl font-display tracking-tight text-black mb-8 leading-tight">
        {phase.title}
      </h3>

      <div className="grid md:grid-cols-[1fr_auto] gap-8 mb-8 items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-dark mb-2">Cena</p>
          <p className="text-3xl md:text-4xl font-display tracking-tight text-black leading-none">
            {phase.price}
          </p>
          <p className="text-sm text-muted-dark mt-2">{phase.priceNote}</p>
        </div>
      </div>

      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-dark mb-4">Co dostajecie</p>
      <ul className="flex flex-col gap-3">
        {phase.deliverables.map((d, i) => (
          <li key={i} className="flex gap-3 items-start">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
            <span className="text-base text-black leading-relaxed">{d}</span>
          </li>
        ))}
      </ul>

      {phase.callout && (
        <div className="mt-8 border-l-3 border-lime pl-6 py-3">
          <p className="text-base italic text-muted-dark leading-relaxed">{phase.callout}</p>
        </div>
      )}
    </motion.div>
  );
}

export function PilotSection({ pilot, asysta }) {
  return (
    <SectionWrap>
      <SectionLabel>Co budujemy</SectionLabel>
      <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 leading-tight">
        Pilotaż + asysta wdrożeniowa
      </h2>
      <div className="grid gap-6">
        <PhaseCard phase={pilot} />
        <PhaseCard phase={asysta} />
      </div>
    </SectionWrap>
  );
}

export function TimelineSection({ timeline }) {
  return (
    <SectionWrap>
      <motion.div {...fadeUp}>
        <SectionLabel>Harmonogram</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 leading-tight max-w-3xl">
          Od startu do działającego asystenta - ok. 4 tygodnie
        </h2>
        <div className="relative">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-black/15 md:left-1/2 md:-translate-x-px" aria-hidden />
          <ol className="flex flex-col gap-8">
            {timeline.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? 'md:text-right' : ''}`}
              >
                <div className={`md:contents`}>
                  <div className={i % 2 === 0 ? 'md:order-1' : 'md:order-2 md:pl-12'}>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dark mb-1">{item.period}</p>
                    <p className="text-xl font-display tracking-tight text-black mb-2 leading-tight">{item.label}</p>
                    <p className="text-base text-muted-dark leading-relaxed">{item.desc}</p>
                  </div>
                  <div className={`hidden md:block ${i % 2 === 0 ? 'md:order-2' : 'md:order-1'}`} />
                </div>
                <span className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-lime border-2 border-sage md:left-1/2 md:-translate-x-1/2" />
              </motion.li>
            ))}
          </ol>
        </div>
      </motion.div>
    </SectionWrap>
  );
}

export function PricingSection({ pricing }) {
  return (
    <SectionWrap>
      <motion.div {...fadeUp}>
        <SectionLabel>Podsumowanie finansowe</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 leading-tight">
          Pilotaż pierwszego procesu
        </h2>
        <div className="rounded-2xl border border-black/10 bg-white/60 overflow-hidden">
          {pricing.rows.map((row, i) => (
            <div
              key={i}
              className={`grid md:grid-cols-[1fr_auto] gap-2 md:gap-12 px-6 md:px-10 py-6 ${i !== pricing.rows.length - 1 ? 'border-b border-black/10' : ''}`}
            >
              <div>
                <p className="text-base md:text-lg text-black font-medium mb-1">{row.label}</p>
                <p className="text-sm text-muted-dark">{row.note}</p>
              </div>
              <p className="text-2xl md:text-3xl font-display tracking-tight text-black md:text-right whitespace-nowrap">
                {row.price}
              </p>
            </div>
          ))}
          <div className="grid md:grid-cols-[1fr_auto] gap-2 md:gap-12 px-6 md:px-10 py-8 bg-lime/30 border-t-2 border-lime">
            <p className="text-base md:text-lg text-black font-semibold">{pricing.totalLabel}</p>
            <p className="text-3xl md:text-4xl font-display tracking-tight text-black md:text-right whitespace-nowrap">
              {pricing.total}
            </p>
          </div>
        </div>
        <p className="mt-6 text-sm text-muted-dark">{pricing.footnote}</p>
      </motion.div>
    </SectionWrap>
  );
}

export function SaldeoSection({ saldeo }) {
  return (
    <SectionWrap>
      <motion.div {...fadeUp}>
        <SectionLabel>{saldeo.label}</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-4 leading-tight">
          {saldeo.title}
        </h2>
        <p className="text-lg text-muted-dark mb-10">{saldeo.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-dark mb-4">Co zbudujemy</p>
            <ul className="flex flex-col gap-3">
              {saldeo.deliverables.map((d, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
                  <span className="text-base text-black leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-dark mb-4">Szacowana wartość</p>
            <p className="text-2xl md:text-3xl font-display tracking-tight text-black leading-tight mb-6">
              {saldeo.value}
            </p>
            <div className="border-l-3 border-lime pl-5 py-2">
              <p className="text-base italic text-muted-dark leading-relaxed">{saldeo.note}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionWrap>
  );
}

export function NextStepsSection({ steps, validUntil, contact, client }) {
  const subject = encodeURIComponent(`Akceptacja oferty pilotażu - ${client?.name?.replace(' Sp. z o.o.', '') || ''}`);
  return (
    <SectionWrap className="pb-32">
      <motion.div {...fadeUp}>
        <SectionLabel>Co dalej</SectionLabel>
        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-12 leading-tight">
          Następne 4 kroki
        </h2>
        <ol className="flex flex-col gap-6 mb-16">
          {steps.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex gap-6 items-start"
            >
              <span className="font-display text-3xl md:text-4xl text-lime tracking-tight leading-none shrink-0 w-14">
                0{i + 1}
              </span>
              <span className="text-lg md:text-xl text-black leading-relaxed pt-1">{step}</span>
            </motion.li>
          ))}
        </ol>

        <div className="border-t border-black/15 pt-10 grid md:grid-cols-[1fr_auto] gap-6 items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-dark mb-2">Kontakt</p>
            <p className="text-xl md:text-2xl font-display tracking-tight text-black mb-1">{contact.name}</p>
            <a href={`mailto:${contact.email}`} className="text-base text-muted-dark hover:text-black transition">
              {contact.email}
            </a>
          </div>
          <a
            href={`mailto:${contact.email}?subject=${subject}`}
            className="inline-flex items-center justify-center gap-2 h-14 px-6 bg-black text-sage rounded-md font-medium hover:bg-lime hover:text-black transition group"
          >
            Akceptuję ofertę
            <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </a>
        </div>

        <p className="mt-10 text-sm text-muted-light">
          Oferta ważna do {validUntil}. Strona prywatna, nieindeksowana.
        </p>
      </motion.div>
    </SectionWrap>
  );
}
