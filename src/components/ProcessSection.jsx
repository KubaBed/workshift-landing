import React from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench, GraduationCap, ArrowRight } from 'lucide-react';
import GradientText from './GradientText';

const processSteps = [
    {
        num: "01",
        time: "Tydzień 1",
        icon: <Search className="w-6 h-6" />,
        title: "Analiza i Strategia",
        tagline: "Najpierw słuchamy, potem projektujemy",
        desc: "Analizujemy Twoje procesy od środka. Razem identyfikujemy \"wąskie gardła\" i miejsca największych strat czasu. Na koniec dostajesz konkretny raport z rekomendacjami i docelowy plan automatyzacji - bez żargonu, bez slajdów do szuflady.",
        detail: "Audyt procesów · Mapowanie workflow · Ocena ROI"
    },
    {
        num: "02",
        time: "Tygodnie 2–4",
        icon: <Wrench className="w-6 h-6" />,
        title: "Budowa i Wdrożenie",
        tagline: "Robimy robotę. Bez chaosu.",
        desc: "Projektujemy i uruchamiamy dedykowane rozwiązania: workflow automatyzacji, agentów AI lub systemy obsługi dokumentów. Wpinamy je w Wasz istniejący sposób pracy, bez przestojów i bez zmuszania zespołu do nauki \"od zera\".",
        detail: "Automatyzacje · Agenci AI · Integracje API"
    },
    {
        num: "03",
        time: "Na zawsze",
        icon: <GraduationCap className="w-6 h-6" />,
        title: "Szkolenia i Wsparcie",
        tagline: "Zostawiamy wiedzę, nie zależność",
        desc: "Szkolimy Twój zespół tak, żeby naprawdę potrafiło korzystać z nowych narzędzi - i w razie potrzeby modyfikować je samodzielnie. Jesteśmy dostępni, kiedy coś przestaje działać lub chcesz pójść o krok dalej.",
        detail: "Szkolenia praktyczne · Dokumentacja · Support SLA"
    }
];

export function ProcessSection() {
    return (
        <section id="proces" className="py-20 md:py-32 bg-white text-slate-900 border-t border-slate-100 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">
                {/* Minimalistyczny Header */}
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 mb-4"
                        >
                            <span className="h-px w-6 bg-[#ee703d]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ee703d]">Jak pracujemy</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight text-slate-900 font-bold text-balance"
                        >
                            Przebudowa bez burzenia.{' '}
                            <span className="text-slate-500 font-medium">Nasz proces.</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg text-slate-500 max-w-md leading-relaxed md:pb-2"
                    >
                        Zamiast rocznej transformacji cyfrowej, wprowadzamy precyzyjne zmiany w 3 etapach. Twoja organizacja cały czas działa.
                    </motion.p>
                </div>

                {/* Czysty Grid Krokow (Cult UI / Tailark style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-[28px] left-[16.66%] right-[16.66%] h-px bg-slate-200 -z-10" />

                    {processSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="flex flex-col relative bg-white"
                        >
                            {/* Header karty */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 relative z-10">
                                    {/* Maly akcent nr kroku w rogu */}
                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-md bg-[#ee703d] text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                                        {step.num}
                                    </span>
                                    {React.cloneElement(step.icon, { className: 'w-6 h-6 stroke-[1.5]' })}
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                                    {step.time}
                                </span>
                            </div>

                            {/* Treść */}
                            <div>
                                <h3 className="text-xl font-bold font-display text-slate-900 tracking-tight mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-[13px] font-semibold text-[#ee703d] mb-4">
                                    {step.tagline}
                                </p>
                                <p className="text-[15px] text-slate-500 leading-relaxed mb-6">
                                    {step.desc}
                                </p>
                                
                                {/* Tagi Shadcn Style */}
                                <div className="flex flex-wrap gap-2">
                                    {step.detail.split(' · ').map((tag, i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-500 text-[11px] font-medium tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Modern CTA Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 md:mt-24 p-8 md:p-10 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                >
                    {/* Subtle grid pattern over black */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="absolute -left-32 -top-32 w-64 h-64 bg-[#ee703d] rounded-full blur-[100px] opacity-20 pointer-events-none" />

                    <div className="relative z-10 text-center md:text-left">
                        <h4 className="text-xl md:text-2xl font-bold font-display text-white mb-2 tracking-tight">Gotowy na pierwszy krok?</h4>
                        <p className="text-slate-400 text-[15px] max-w-md">Rozmowa konsultacyjna zajmie 30 minut. Przyjrzymy się Twoim procesom bez budowania zobowiązań.</p>
                    </div>
                    <a
                        href="#darmowa-konsultacja"
                        className="relative z-10 inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 px-6 py-3.5 rounded-xl font-semibold text-[14px] transition-colors shrink-0"
                    >
                        Sprawdź wolne terminy
                        <ArrowRight size={16} className="text-[#ee703d]" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
