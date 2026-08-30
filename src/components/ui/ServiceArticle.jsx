import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, useInView, animate, useReducedMotion } from 'framer-motion';
import { ScrollReveal } from './ScrollReveal';
import { AnimatedProcessIcon } from './AnimatedProcessIcon';
import { FadeUp } from '../animations/FadeUp';

/**
 * Sekcja artykułowa strony usługi (`service.seoSections`).
 *
 * Treść siedzi w src/data/services.js, bo to samo źródło konsumuje statyczny
 * fallback w scripts/seo-routes.mjs - crawler bez JS i użytkownik z JS mają
 * widzieć tę samą treść. Tu wyłącznie prezentacja. Pola czysto wizualne
 * (eyebrow, reveal, highlights, icon, stats) flattener ignoruje.
 *
 * Język wizualny = bento (ExtendedInnerCard): karty bg-sage rounded-[10px]
 * border-black/5, eyebrow mono uppercase z kropką lime, jeden akcent lime
 * na widok.
 */

export function Eyebrow({ children }) {
    return (
        <p className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-dark mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-lime" aria-hidden="true" />
            {children}
        </p>
    );
}

/** Karta procesu: ikona budzi się raz przy wejściu w viewport i na hover. */
function ProcessCard({ item, index }) {
    const [hovered, setHovered] = useState(false);
    const [woke, setWoke] = useState(false);
    const wakeTimer = useRef(null);
    const reducedMotion = useReducedMotion();

    // Jednorazowe "przebudzenie" ikony przy wejściu karty w viewport -
    // callback zdarzenia framer-motion, nie efekt (bez kaskadowych renderów).
    const handleViewportEnter = () => {
        if (reducedMotion) return;
        setWoke(true);
        wakeTimer.current = setTimeout(() => setWoke(false), 900);
    };
    useEffect(() => () => clearTimeout(wakeTimer.current), []);

    return (
        <FadeUp delay={index * 0.07} duration={0.6}>
            <Motion.div
                onViewportEnter={handleViewportEnter}
                viewport={{ once: true, margin: '-80px' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="group h-full rounded-[10px] border border-black/5 bg-sage p-6 md:p-7 transition-[border-color,transform,box-shadow] duration-300 hover:border-black/15 hover:-translate-y-0.5 hover:shadow-sm"
            >
                <div className="w-11 h-11 rounded-[10px] bg-white border border-black/5 flex items-center justify-center mb-5 text-black transition-colors duration-300 group-hover:bg-lime/30 group-hover:border-lime/40">
                    <AnimatedProcessIcon name={item.icon} active={!reducedMotion && (hovered || woke)} />
                </div>
                <h3 className="text-lg text-black font-medium leading-snug mb-2">{item.title}</h3>
                <p className="text-[15px] text-muted-dark leading-relaxed">{item.desc}</p>
            </Motion.div>
        </FadeUp>
    );
}

/** Licznik: 0 -> value przy pierwszym wejściu w viewport. */
function CountUp({ value, decimals = 0, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const reducedMotion = useReducedMotion();
    const [display, setDisplay] = useState(reducedMotion ? value : 0);

    useEffect(() => {
        if (!inView || reducedMotion) return undefined;
        const controls = animate(0, value, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setDisplay(v),
        });
        return () => controls.stop();
    }, [inView, value, reducedMotion]);

    return (
        <span ref={ref} className={className}>
            {Number(display).toFixed(decimals).replace('.', ',')}
        </span>
    );
}

/** Panel przed/po dla case study - liczby w mono + paski (wzór wykresu budżetu Harvest). */
function StatsPanel({ stats }) {
    const ref = useRef(null);
    const inViewNow = useInView(ref, { once: true, margin: '-60px' });
    const reducedMotion = useReducedMotion();
    // Reduced motion: paski od razu w stanie końcowym, bez czekania na viewport.
    const inView = inViewNow || reducedMotion;

    const rows = [
        { label: stats.beforeLabel, value: stats.before, bar: 1, barClass: 'bg-black/20', valueClass: 'text-muted-dark' },
        { label: stats.afterLabel, value: stats.after, bar: stats.afterRatio, barClass: 'bg-lime', valueClass: 'text-black' },
    ];

    return (
        <div ref={ref} className="mt-8 rounded-[10px] border border-black/5 bg-sage p-6 md:p-8">
            <div className="space-y-6">
                {rows.map((row) => (
                    <div key={row.label}>
                        <div className="flex items-baseline justify-between mb-2">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-muted-dark">{row.label}</span>
                            <span className={`font-mono text-2xl md:text-3xl tracking-tight ${row.valueClass}`}>
                                <CountUp value={row.value.amount} decimals={row.value.decimals ?? 0} />
                                <span className="text-sm text-muted-dark ml-1">{row.value.unit}</span>
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-white border border-black/5 overflow-hidden">
                            <Motion.div
                                className={`h-full rounded-full ${row.barClass}`}
                                initial={{ width: 0 }}
                                animate={inView ? { width: `${row.bar * 100}%` } : { width: 0 }}
                                transition={reducedMotion ? { duration: 0 } : { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {stats.note && (
                <p className="mt-5 text-[12px] font-mono text-muted-dark">{stats.note}</p>
            )}
        </div>
    );
}

function SectionBody({ section }) {
    const [lead, ...rest] = section.paragraphs ?? [];

    return (
        <>
            {lead && (section.reveal ? (
                <ScrollReveal
                    text={lead}
                    highlights={section.highlights ?? []}
                    className="text-xl md:text-2xl text-black leading-[1.55] tracking-tight mb-6"
                />
            ) : (
                <p className="text-lg text-muted-dark leading-relaxed mb-4">{lead}</p>
            ))}
            {rest.map((text) => (
                <p key={text.slice(0, 40)} className="text-lg text-muted-dark leading-relaxed mb-4 last:mb-0">
                    {text}
                </p>
            ))}
            {section.items && (
                <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    {section.items.map((item, i) => (
                        <ProcessCard key={item.title} item={item} index={i} />
                    ))}
                </div>
            )}
            {section.stats && <StatsPanel stats={section.stats} />}
        </>
    );
}

export function ServiceArticle({ sections, related }) {
    if (!sections?.length) return null;

    return (
        <article className="max-w-3xl mx-auto mt-14 md:mt-20">
            {sections.map((section) => (
                <section key={section.heading} className="mb-16 md:mb-24">
                    <FadeUp duration={0.6}>
                        {section.eyebrow && <Eyebrow>{section.eyebrow}</Eyebrow>}
                        <h2 className="text-2xl md:text-[32px] font-display tracking-tight text-black mb-6 text-balance">
                            {section.heading}
                        </h2>
                    </FadeUp>
                    <SectionBody section={section} />
                </section>
            ))}

            {related?.length > 0 && (
                <FadeUp duration={0.6}>
                    <p className="text-lg text-muted-dark leading-relaxed border-t border-black/10 pt-8">
                        Sprawdź też:{' '}
                        {related.map((link, idx) => (
                            <React.Fragment key={link.href}>
                                {idx > 0 && ' · '}
                                <Link to={link.href} className="text-black underline underline-offset-4 hover:text-lime transition-colors">
                                    {link.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </p>
                </FadeUp>
            )}
        </article>
    );
}
