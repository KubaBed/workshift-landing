import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import GradientText from './GradientText';

const bars = [
    {
        num: '01/',
        label: 'Zadania operacyjne',
        highlight: 'WYKONUJESZ RĘCZNIE',
        suffix: '/OBCIĄŻENIE',
        value: '+83%',
        pct: 83,
    },
    {
        num: '02/',
        label: 'Konkurencja',
        highlight: 'UCIEKA CORAZ SZYBCIEJ',
        suffix: '/WZROST',
        value: '+55%',
        pct: 55,
    },
    {
        num: '03/',
        label: 'Przegapione',
        highlight: 'SZANSE NA AUTOMATYZACJĘ',
        suffix: '/MOŻLIWOŚCI',
        value: '+66%',
        pct: 66,
    },
    {
        num: '04/',
        label: 'Czas tracony na',
        highlight: 'POWTARZALNE ZADANIA',
        suffix: '/CZAS',
        value: '+32%',
        pct: 32,
    },
];

export function DataMetricsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <section className="py-28 md:py-36 bg-[#f0f0ec] text-[#111] relative overflow-hidden" ref={ref}>

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
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold font-display tracking-tight leading-[1.1] text-[#0A2540] text-balance">
                        Zwłoka kosztuje. Im dłużej czekasz,<br className="hidden md:block" />
                        tym trudniej będzie Ci <GradientText colors={['#ee703d', '#cc7cab', '#8530d1']} animationSpeed={6} yoyo={true}>dogonić resztę.</GradientText>
                    </h2>
                </motion.div>

                {/* Bar chart rows */}
                <div className="flex flex-col divide-y divide-black/10">
                    {bars.map((bar, idx) => (
                        <div key={idx} className="relative py-5 md:py-6 flex items-center gap-4 group">

                            {/* Left label column */}
                            <div className="w-[30%] md:w-[28%] shrink-0 flex items-center gap-2 md:gap-3">
                                <span className="font-mono text-[10px] md:text-xs font-bold text-slate-400 tracking-widest shrink-0">{bar.num}</span>
                                <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight hidden sm:block">{bar.label} <strong className="text-[#111]">{bar.highlight}</strong></span>
                                <span className="text-[11px] font-bold text-[#111] uppercase tracking-widest leading-tight sm:hidden">{bar.highlight}</span>
                            </div>

                            {/* Growing bar track */}
                            <div className="flex-1 relative h-[2px] bg-black/10">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-[#111] origin-left"
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
                                    <div className="-translate-x-1/2 bg-[#111] text-white text-xs md:text-sm font-black px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md whitespace-nowrap">
                                        {bar.value}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right label */}
                            <div className="w-[10%] md:w-[12%] shrink-0 text-right">
                                <span className="font-mono text-[10px] md:text-xs font-bold text-slate-400 tracking-widest">{bar.suffix}</span>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <motion.p
                    className="mt-10 text-sm text-slate-500 font-medium max-w-lg"
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
