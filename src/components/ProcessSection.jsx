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
        tagline: "Dostarczamy. Bez przestojów.",
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
        <section id="proces" className="py-20 md:py-32 bg-white text-black border-t border-black/5 relative overflow-hidden">
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
                            <span className="font-mono text-xs uppercase tracking-wider text-black">Jak pracujemy</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight text-black text-balance"
                        >
                            Przebudowa bez burzenia.{' '}
                            <span className="text-muted-dark">Nasz proces.</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-lg text-muted-dark max-w-md leading-relaxed md:pb-2"
                    >
                        Żadnej "rocznej transformacji cyfrowej". 3 etapy, 4 tygodnie — i Twoja firma cały czas normalnie pracuje.
                    </motion.p>
                </div>

                {/* Czysty Grid Krokow (Cult UI / Tailark style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    <div className="hidden md:block absolute top-[28px] left-[16.66%] right-[16.66%] h-px bg-black/10 -z-10" />

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
                                <div className="w-14 h-14 rounded-[10px] bg-white border border-black/10 shadow-sm flex items-center justify-center text-black relative z-10">
                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-md bg-lime text-black flex items-center justify-center text-[10px] font-bold shadow-sm">
                                        {step.num}
                                    </span>
                                    {React.cloneElement(step.icon, { className: 'w-6 h-6 stroke-[1.5]' })}
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-sage text-[11px] font-mono font-medium text-muted-dark">
                                    {step.time}
                                </span>
                            </div>

                            {/* Treść */}
                            <div>
                                <h3 className="text-xl font-display text-black tracking-tight mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-[13px] font-semibold text-lime mb-4">
                                    {step.tagline}
                                </p>
                                <p className="text-[15px] text-muted-dark leading-relaxed mb-6">
                                    {step.desc}
                                </p>
                                
                                {/* Tagi Shadcn Style */}
                                <div className="flex flex-wrap gap-2">
                                    {step.detail.split(' · ').map((tag, i) => (
                                        <span key={i} className="px-2.5 py-1 rounded-md bg-white border border-black/10 text-muted-dark text-[11px] font-mono tracking-wide">
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
                    className="mt-20 md:mt-24 p-8 md:p-10 rounded-[10px] bg-black border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                >
                    {/* Subtle grid pattern over black */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="absolute -left-32 -top-32 w-64 h-64 bg-lime rounded-full blur-[100px] opacity-20 pointer-events-none" />

                    <div className="relative z-10 text-center md:text-left">
                        <h4 className="text-xl md:text-2xl font-display text-white mb-2 tracking-tight">30 minut, które mogą zmienić kwartał.</h4>
                        <p className="text-white/50 text-[15px] max-w-md">Rozmowa konsultacyjna zajmie 30 minut. Przyjrzymy się Twoim procesom bez budowania zobowiązań.</p>
                    </div>
                    <a
                        href="#darmowa-konsultacja"
                        className="relative z-10 inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-3.5 rounded-full font-semibold text-[14px] transition-colors shrink-0"
                    >
                        Zarezerwuj darmowy audyt
                        <ArrowRight size={16} className="text-lime" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
