import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const processSteps = [
    {
        num: "01",
        time: "Tydzień 1",
        title: "Discovery & Assessment",
        desc: "Analizujemy Twoje procesy i znajdujemy \"wąskie gardła\". Wskazujemy miejsca, w których automatyzacja przyniesie najszybszy, policzalny zwrot z inwestycji."
    },
    {
        num: "02",
        time: "Tygodnie 2-4",
        title: "Build & Deploy",
        desc: "Tworzymy i uruchamiamy dedykowane systemy. Wpinamy je w Wasz obecny sposób pracy, nie wywołując przestojów organizacyjnych i chaosu w zespole."
    },
    {
        num: "03",
        time: "Zawsze",
        title: "Train & Support",
        desc: "Szkolimy Twój zespół z obsługi nowych narzędzi i zapewniamy stałe wsparcie techniczne, by wszystko działało niezwykle płynnie i bezobsługowo."
    }
];

export function ProcessSection() {
    const { scrollYProgress } = useScroll();
    const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

    return (
        <section id="proces" className="py-32 bg-white text-navy relative overflow-hidden">

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(28,30,33,1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,30,33,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">

                    {/* Header Area (Sticky) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6 text-balance"
                        >
                            Przebudowa bez burzenia.<br />
                            <span className="text-terra relative inline-block">Nasz proces.
                                <svg className="absolute -bottom-2 left-0 w-full h-3 -z-10 text-terra/20" viewBox="0 0 300 12" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
                                    <path d="M2.5 9.5C80 -2.50001 224.5 -1 297.5 9.5" />
                                </svg>
                            </span>
                        </motion.h2>
                        <p className="text-xl text-slate-500 max-w-sm leading-relaxed mb-8">
                            Zamiast rocznej transformacji cyfrowej, wprowadzamy precyzyjne operacje w 3 prostych krokach. Obniżamy koszty, nie przerywając Twojej pracy.
                        </p>
                    </div>

                    {/* Staggered Vertical Cards (Good-Fella style) */}
                    <div className="lg:col-span-7 flex flex-col gap-8 md:gap-12 relative">

                        {/* Vertical connector line */}
                        <div className="absolute top-0 bottom-0 left-8 md:left-[3.5rem] w-px bg-slate-200 -z-10" />

                        {processSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: 0.1, type: "spring", stiffness: 100 }}
                                className={`relative flex flex-col md:flex-row gap-6 md:gap-10 p-8 md:p-12 rounded-[2.5rem] bg-alabaster border border-slate-200 shadow-sm transition-shadow hover:shadow-xl hover:border-slate-300 ${idx === 1 ? 'md:-ml-12' : (idx === 2 ? 'md:ml-12' : '')
                                    }`}
                            >

                                {/* Node Number */}
                                <div className="shrink-0">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center -mt-12 md:-mt-16 md:-ml-16 bg-gradient-to-br from-white to-slate-50">
                                        <span className="text-xs font-bold uppercase tracking-widest text-terra mb-1">Krok</span>
                                        <span className="font-mono text-2xl font-bold text-navy">{step.num}</span>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terra/10 text-terra text-xs font-bold uppercase tracking-wider mb-4 border border-terra/20">
                                        {step.time}
                                    </div>
                                    <h3 className="text-3xl font-bold font-display text-navy mb-4 tracking-tight">{step.title}</h3>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        {step.desc}
                                    </p>
                                </div>

                            </motion.div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
}
