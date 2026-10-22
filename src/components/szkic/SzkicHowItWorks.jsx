import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { SZKIC_HOW } from '../../data/szkic';
import { SzkicVideo } from './SzkicVideo';

const STEP_MS = 6500;

// Twarda spacja po jednoliterowych słowach (a, i, o, u, w, z), żeby nie wisiały na końcu linii.
const nb = (text) => text.replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2 ').replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2 ');

/**
 * „Jak to działa” na /narzedzia/szkic: lista kroków po lewej, film albo zrzut kroku po prawej.
 * Krok przełącza się sam po czasie kroku (długość jego filmu, domyślnie STEP_MS); najechanie albo fokus zatrzymuje licznik, klik wybiera krok.
 * Przy „ogranicz ruch” bez automatu. Na telefonie kroki jeden pod drugim, każdy ze swoim obrazem.
 */
export function SzkicHowItWorks() {
    const reduce = useReducedMotion();
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return undefined;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
        io.observe(node);
        return () => io.disconnect();
    }, []);

    const running = !reduce && !paused && inView;

    return (
        <section id="jak-dziala" ref={ref} className="px-4 py-16 md:py-24 scroll-mt-24">
            <div className="max-w-[1320px] mx-auto">
                <h2 className="text-4xl md:text-5xl tracking-tight text-black text-balance">Jak to działa</h2>

                {/* Desktop: lista + obraz */}
                <div
                    className="hidden lg:grid grid-cols-12 gap-12 mt-14 items-start"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => setPaused(true)}
                    onBlur={() => setPaused(false)}
                >
                    <ol className="col-span-5" role="tablist" aria-orientation="vertical">
                        {SZKIC_HOW.map((step, i) => {
                            const on = i === active;
                            return (
                                <li key={step.title} className="border-t border-black/10 last:border-b">
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={on}
                                        aria-controls="szkic-krok-obraz"
                                        onClick={() => setActive(i)}
                                        className="w-full text-left py-6 group cursor-pointer"
                                    >
                                        <span className="flex items-baseline gap-4">
                                            <span className={`font-mono text-sm ${on ? 'text-black' : 'text-black/35'}`}>0{i + 1}</span>
                                            <span className={`text-2xl tracking-tight transition-colors ${on ? 'text-black' : 'text-black/40 group-hover:text-black/70'}`}>
                                                {nb(step.title)}
                                            </span>
                                        </span>
                                        <AnimatePresence initial={false}>
                                            {on && (
                                                <motion.p
                                                    key="text"
                                                    initial={reduce ? false : { height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden pl-[calc(1.75rem+1rem)] text-lg text-muted-dark leading-relaxed text-pretty max-w-[46ch]"
                                                >
                                                    <span className="block pt-3">{nb(step.text)}</span>
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                    {/* Pasek postępu aktywnego kroku; koniec animacji przełącza na następny. */}
                                    <div className="h-px -mt-px bg-transparent overflow-hidden" aria-hidden="true">
                                        {on && !reduce && (
                                            <div
                                                key={`${active}-${inView}`}
                                                className="h-px bg-black origin-left"
                                                style={{
                                                    animation: `szkic-step-progress ${step.duration ?? STEP_MS}ms linear forwards`,
                                                    animationPlayState: running ? 'running' : 'paused',
                                                }}
                                                onAnimationEnd={() => setActive((a) => (a + 1) % SZKIC_HOW.length)}
                                            />
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ol>

                    <div id="szkic-krok-obraz" role="tabpanel" className="col-span-7">
                        <MediaFrame>
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={active}
                                    initial={reduce ? false : { opacity: 0, scale: 0.985 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={reduce ? undefined : { opacity: 0 }}
                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <StepVisual step={SZKIC_HOW[active]} />
                                </motion.div>
                            </AnimatePresence>
                        </MediaFrame>
                    </div>
                </div>

                {/* Telefon i tablet: kroki pod sobą */}
                <ol className="lg:hidden mt-10 space-y-12">
                    {SZKIC_HOW.map((step, i) => (
                        <li key={step.title}>
                            <MediaFrame>
                                <StepVisual step={step} />
                            </MediaFrame>
                            <p className="mt-6 flex items-baseline gap-3">
                                <span className="font-mono text-sm text-black/50">0{i + 1}</span>
                                <span className="text-2xl tracking-tight text-black">{nb(step.title)}</span>
                            </p>
                            <p className="mt-3 text-lg text-muted-dark leading-relaxed text-pretty">{nb(step.text)}</p>
                        </li>
                    ))}
                </ol>
            </div>
            <style>{'@keyframes szkic-step-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }'}</style>
        </section>
    );
}

/** Ramka na film albo zrzut: kadry mają już tapetę Maca i okno, więc bez udawanego paska okna. */
function MediaFrame({ children }) {
    return (
        <div className="relative aspect-video rounded-2xl bg-[#c9d3e6] ring-1 ring-black/5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] overflow-hidden">
            {children}
        </div>
    );
}

function StepVisual({ step }) {
    const cls = 'absolute inset-0 w-full h-full object-cover';
    if (step.video) return <SzkicVideo src={step.video} poster={step.poster} label={step.alt} className={cls} />;
    return <img src={step.image} alt={step.alt} loading="lazy" decoding="async" className={cls} />;
}
