import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GradientText from './GradientText';
import { Floating } from './animations/Floating';

const bars = [
    {
        num: '01/',
        label: 'Zadania, które Twoi ludzie',
        highlight: 'WCIĄŻ ROBIĄ RĘCZNIE',
        suffix: '/OBCIĄŻENIE',
        value: '+83%',
        pct: 83,
    },
    {
        num: '02/',
        label: 'Twoja konkurencja',
        highlight: 'WDRAŻA AI WŁAŚNIE TERAZ',
        suffix: '/WZROST',
        value: '+55%',
        pct: 55,
    },
    {
        num: '03/',
        label: 'Procesy, które',
        highlight: 'DO ZAUTOMATYZOWANIA DZIŚ',
        suffix: '/MOŻLIWOŚCI',
        value: '+66%',
        pct: 66,
    },
    {
        num: '04/',
        label: 'Godziny',
        highlight: 'MARNOWANE NA KOPIUJ-WKLEJ',
        suffix: '/CZAS',
        value: '+32%',
        pct: 32,
    },
];

export function DataMetricsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="py-28 md:py-36 bg-sage text-black relative overflow-hidden" ref={ref}>

            {/* Subtle grid lines */}
            <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4 relative z-10">

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="mb-16 md:mb-24 max-w-4xl"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-display tracking-tight leading-[1.1] text-black text-balance">
                        Zwłoka kosztuje. Im dłużej czekasz,<br className="hidden md:block" />
                        tym trudniej będzie Ci <GradientText colors={['#9CE069', '#7bc44a']} animationSpeed={6} yoyo={true}>dogonić resztę.</GradientText>
                    </h2>
                </motion.div>

                {/* Bar chart rows */}
                <div className="flex flex-col divide-y divide-black/10">
                    {bars.map((bar, idx) => (
                        <div key={idx} className="relative py-5 md:py-6 flex items-center gap-4 group">

                            {/* Left label column */}
                            <div className="w-[125px] md:w-[28%] shrink-0 flex items-center gap-2 md:gap-3">
                                <span className="font-mono text-[9px] md:text-xs text-muted-light tracking-widest shrink-0">{bar.num}</span>
                                <span className="text-[11px] md:text-xs font-semibold text-muted-dark uppercase tracking-widest leading-tight hidden sm:block">{bar.label} <strong className="text-black">{bar.highlight}</strong></span>
                                <span className="text-[10px] font-semibold text-black uppercase tracking-widest leading-tight sm:hidden">{bar.highlight}</span>
                            </div>

                            {/* Growing bar track */}
                            <div className="flex-1 relative h-1.5 bg-black/10 rounded-full">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-black origin-left rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                                    transition={{
                                        duration: 1.2,
                                        delay: 0.2 + idx * 0.15,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    style={{ width: `${bar.pct}%` }}
                                />

                                {/* Bubble value indicator */}
                                <motion.div
                                    className="absolute top-1/2 -translate-y-1/2"
                                    style={{ left: `${bar.pct}%` }}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: 0.2 + idx * 0.15 + 1.0,
                                        type: 'spring',
                                        stiffness: 200,
                                    }}
                                >
                                    <Floating duration={3 + idx} amplitude={5} rotation={2}>
                                        <div className="-translate-x-1/2 bg-black text-white text-xs md:text-sm font-semibold font-mono px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md whitespace-nowrap border border-black/20">
                                            {bar.value}
                                        </div>
                                    </Floating>
                                </motion.div>
                            </div>

                            {/* Right label */}
                            <div className="w-[75px] md:w-[12%] shrink-0 text-right overflow-hidden">
                                <span className="font-mono text-[9px] md:text-xs text-muted-light tracking-widest truncate block">{bar.suffix}</span>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <motion.p
                    className="mt-10 text-sm text-muted-dark max-w-lg"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1.5, duration: 0.6 }}
                >
                    Dane szacowane na podstawie raportów McKinsey, Asana "Anatomy of Work" i wewnętrznych wdrożeń Workshift. Wartości dotyczą firm 10–200 pracowników.
                </motion.p>

            </div>
        </section>
    );
}
