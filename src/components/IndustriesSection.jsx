import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const industries = [
    {
        title: "Kancelarie Prawne",
        desc: "Błyskawiczne analizy umów, przeszukiwanie orzecznictwa (\"RAG\") i automatyzacja korespondencji bez narażania danych klientów.",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>'
    },
    {
        title: "E-commerce",
        desc: "Inteligentna obsługa klienta, generowanie opisów produktów z bazy PIM i optymalizacja stanów magazynowych na autopilocie.",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>'
    },
    {
        title: "HR i Rekrutacja",
        desc: "Automatyczny screening CV, planowanie rozmów, onboarding na autopilocie i dedykowane proste systemy ATS.",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
    },
    {
        title: "Finanse i Księgowość",
        desc: "Zautomatyzowane odczytywanie faktur (OCR AI), kategoryzacja przelewów i minimalizacja błędu ludzkiego w przepisywaniu tabel.",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
    }
];

export function IndustriesSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="py-24 bg-slate-50 relative">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-display tracking-tight text-navy"
                    >
                        Rozwiązania dopasowane do Twojej branży.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Interactive List */}
                    <div className="flex flex-col gap-4">
                        {industries.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={`text-left p-6 rounded-3xl transition-all duration-300 border ${activeIndex === idx
                                        ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
                                        : 'bg-transparent border-transparent hover:bg-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className={`text-2xl font-bold font-display tracking-tight transition-colors ${activeIndex === idx ? 'text-navy' : 'text-slate-500'}`}>
                                        {item.title}
                                    </h3>
                                    {activeIndex === idx && (
                                        <motion.div layoutId="activeIndicator" className="w-3 h-3 rounded-full bg-chartreuse" />
                                    )}
                                </div>
                            </button>
                        ))}

                        {/* Disclaimer */}
                        <div className="mt-8 p-6 rounded-3xl bg-navy text-white text-sm leading-relaxed">
                            <span className="text-chartreuse font-bold uppercase tracking-wider block mb-2">Twojej branży nie ma na liście?</span>
                            <p className="text-slate-300">
                                Procesy biznesowe bywają podobne w wielu sektorach. Chętnie posłuchamy, co pożera czas w Twojej firmie i sprawdzimy, jak możemy pomóc odzyskać te godziny.
                            </p>
                        </div>
                    </div>

                    {/* Dynamic Content Display */}
                    <div className="relative h-[400px] rounded-[3rem] bg-navy overflow-hidden shadow-2xl p-12 flex flex-col justify-center">

                        {/* Ambient Background Glow based on active item */}
                        <div className="absolute inset-0 bg-chartreuse/5 blur-3xl rounded-full scale-150 animate-pulse" style={{ animationDuration: '4s' }} />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                                className="relative z-10"
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10 backdrop-blur-md text-chartreuse"
                                    dangerouslySetInnerHTML={{ __html: industries[activeIndex].icon }}
                                />

                                <h4 className="text-3xl font-display font-bold text-white mb-6">
                                    {industries[activeIndex].title}
                                </h4>

                                <p className="text-xl text-slate-300 leading-relaxed font-medium">
                                    {industries[activeIndex].desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                    </div>

                </div>
            </div>
        </section>
    );
}
