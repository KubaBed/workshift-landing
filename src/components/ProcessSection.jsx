import React from 'react';
import { motion } from 'framer-motion';
import { Search, Wrench, GraduationCap, ArrowRight } from 'lucide-react';

const processSteps = [
    {
        num: "01",
        time: "Tydzień 1",
        icon: <Search className="w-6 h-6" />,
        title: "Analiza i Strategia",
        tagline: "Najpierw słuchamy, potem projektujemy",
        desc: "Analizujemy Twoje procesy od środka. Razem identyfikujemy \"wąskie gardła\" i miejsca największych strat czasu. Na koniec dostajesz konkretny raport z rekomendacjami i docelowy plan automatyzacji — bez żargonu, bez slajdów do szuflady.",
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
        desc: "Szkolimy Twój zespół tak, żeby naprawdę potrafiło korzystać z nowych narzędzi — i w razie potrzeby modyfikować je samodzielnie. Jesteśmy dostępni, kiedy coś przestaje działać lub chcesz pójść o krok dalej.",
        detail: "Szkolenia praktyczne · Dokumentacja · Support SLA"
    }
];

export function ProcessSection() {
    return (
        <section id="proces" className="py-32 bg-white text-navy relative overflow-hidden">

            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(rgba(28,30,33,1) 1px, transparent 1px), linear-gradient(90deg, rgba(28,30,33,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4 relative z-10">

                {/* Header */}
                <div className="mb-16 md:mb-20 max-w-2xl">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] text-[#ee703d] mb-4"
                    >
                        Jak pracujemy
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight mb-6 text-balance leading-[1.05]"
                    >
                        Przebudowa bez burzenia.{' '}
                        <span className="text-[#ee703d] relative inline-block">
                            Nasz proces.
                            <svg className="absolute -bottom-2 left-0 w-full h-3 -z-10 text-[#ee703d]/20" viewBox="0 0 300 12" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round">
                                <path d="M2.5 9.5C80 -2.50001 224.5 -1 297.5 9.5" />
                            </svg>
                        </span>
                    </motion.h2>
                    <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                        Zamiast rocznej transformacji cyfrowej, wprowadzamy precyzyjne zmiany w 3 etapach. Każdy ma konkretny wynik i termin. Twoja organizacja cały czas działa.
                    </p>
                </div>

                {/* Horizontal Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-5 relative">

                    {/* Desktop connecting line through the step numbers */}
                    <div className="hidden md:block absolute top-[2.95rem] left-[calc(33.33%/2)] right-[calc(33.33%/2)] h-px bg-gradient-to-r from-slate-200 via-[#ee703d]/30 to-slate-200 -z-0" />

                    {processSteps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.55, delay: idx * 0.12, type: "spring", stiffness: 90 }}
                            className="relative flex flex-col rounded-[2rem] border border-slate-200 bg-[#FAFAFA] hover:bg-white hover:border-slate-300 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] transition-all duration-500 group overflow-hidden"
                        >
                            {/* Hover accent glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ee703d]/0 to-[#f5a273]/0 group-hover:from-[#ee703d]/[0.03] group-hover:to-[#f5a273]/[0.05] transition-all duration-700 pointer-events-none rounded-[2rem]" />

                            {/* Top strip with step number and time badge */}
                            <div className="flex items-center justify-between px-8 pt-8 pb-0 relative z-10">
                                <div className="relative z-10 w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center group-hover:border-[#ee703d]/30 group-hover:shadow-[0_0_0_4px_rgba(238,112,61,0.06)] transition-all duration-300">
                                    <span className="font-mono text-xl font-bold text-[#0A2540]">{step.num}</span>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 shadow-sm">
                                    {step.time}
                                </span>
                            </div>

                            {/* Icon */}
                            <div className="px-8 pt-8 pb-0 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-[#ee703d]/10 border border-[#ee703d]/20 flex items-center justify-center text-[#ee703d] mb-5 group-hover:scale-110 group-hover:bg-[#ee703d]/15 transition-all duration-300">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold font-display text-[#0A2540] mb-1 tracking-tight">{step.title}</h3>
                                <p className="text-sm font-semibold text-[#ee703d] mb-5">{step.tagline}</p>
                            </div>

                            {/* Divider */}
                            <div className="mx-8 h-px bg-slate-100 mb-6" />

                            {/* Body */}
                            <div className="px-8 pb-8 flex-1 flex flex-col relative z-10">
                                <p className="text-[15px] text-slate-600 leading-relaxed font-medium flex-1 mb-6">
                                    {step.desc}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {step.detail.split(' · ').map((tag, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full text-[11px] font-bold bg-white border border-slate-200 text-slate-500 uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer CTA strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-[1.5rem] bg-[#0A2540] border border-white/5"
                >
                    <div>
                        <p className="font-bold text-white text-lg mb-1">Brzmi jak plan? Zacznijmy od rozmowy.</p>
                        <p className="text-slate-400 text-sm font-medium">Bezpłatna konsultacja. Konkretna rozmowa o Twoich procesach.</p>
                    </div>
                    <a
                        href="#kontakt"
                        className="inline-flex items-center gap-2 bg-[#ee703d] hover:bg-[#d96030] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg hover:shadow-[0_8px_20px_-5px_rgba(238,112,61,0.5)] transition-all duration-300 shrink-0 hover:-translate-y-0.5"
                    >
                        Umów bezpłatną konsultację
                        <ArrowRight size={16} />
                    </a>
                </motion.div>

            </div>
        </section>
    );
}
