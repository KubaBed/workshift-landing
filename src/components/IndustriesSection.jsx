import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ShoppingCart, Users, Calculator, CheckCircle2, Zap } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const industries = [
    {
        id: 'law',
        title: "Kancelarie Prawne",
        icon: <Scale className="w-5 h-5" />,
        tagline: 'Mniej "ctrl+f", więcej czasu na merytorykę',
        desc: "Błyskawiczne analizy dziesiątek umów naraz, błędoodporne przeszukiwanie orzecznictwa (\"RAG\") i półautomatyczne draftowanie opinii. Wszystko w izolowanym środowisku, bez ryzyka wycieku danych klientów.",
        metric: { value: '45+', label: 'godzin zaoszczędzonych', subtext: 'miesięcznie na researchu przez przeciętnego asystenta' },
        useCases: [
            'Analiza ryzyk w pakietach umów NDA/B2B (red-flagging)',
            'Własna, poufna wyszukiwarka w historii spraw i pism',
            'Szybkie streszczenia akt wielotomowych spraw'
        ],
        theme: { text: 'text-[#ee703d]', bg: 'bg-[#ee703d]/10', border: 'border-[#ee703d]/20' },
        gradient: 'from-[#ee703d] to-[#f5a273]',
        accent: '#ee703d',
        image: '/industry_law.png',
    },
    {
        id: 'ecommerce',
        title: "E-commerce",
        icon: <ShoppingCart className="w-5 h-5" />,
        tagline: 'Obsługa klienta, która (naprawdę) sprzedaje',
        desc: "Skończ z generycznymi chatbotami. Nasi agenci znają Twój regulamin, politykę zwrotów i status przesyłek. Jeśli klient pyta o rozmiar – bot doradzi, jeśli chce zwrócić – przeprowadzi przez proces. Do tego AI pilnuje stanów magazynowych na autopilocie.",
        metric: { value: '38%', label: 'zapytań rozwiązanych', subtext: 'bez udziału człowieka na "pierwszej linii"' },
        useCases: [
            'Generowane opisy produktów SEO w setkach wariantów',
            'Obsługa BOK 24/7 połączona z systemem ERP/WMS',
            'Dynamiczne rekomendacje koszykowe na bazie NLP'
        ],
        theme: { text: 'text-[#cc7cab]', bg: 'bg-[#cc7cab]/10', border: 'border-[#cc7cab]/20' },
        gradient: 'from-[#f5a273] to-[#cc7cab]',
        accent: '#cc7cab',
        image: '/industry_ecommerce.png',
    },
    {
        id: 'hr',
        title: "HR i Rekrutacja",
        icon: <Users className="w-5 h-5" />,
        tagline: 'Zatrudniaj trafniej, trać mniej czasu na screening',
        desc: "Zdejmujemy z rekruterów to, co najbardziej żmudne. AI błyskawicznie analizuje setki CV pod kątem precyzyjnych kryteriów, umawia spotkania i symuluje ścieżki onboardingowe dla nowych pracowników.",
        metric: { value: '60%', label: 'krótszy Time-To-Hire', subtext: 'dzięki automatycznemu parsowaniu i ocenie aplikacji' },
        useCases: [
            'Ekstrakcja kompetencji z nieustrukturyzowanych CV',
            'Zautomatyzowany mail-loop rekrutacyjny i feedback',
            'Bot asystujący ("Buddy") wdrażający nowych pracowników'
        ],
        theme: { text: 'text-[#d5a4e7]', bg: 'bg-[#d5a4e7]/10', border: 'border-[#d5a4e7]/20' },
        gradient: 'from-[#cc7cab] to-[#d5a4e7]',
        accent: '#d5a4e7',
        image: '/industry_hr.png',
    },
    {
        id: 'finance',
        title: "Finanse i Księgowość",
        icon: <Calculator className="w-5 h-5" />,
        tagline: 'Zabijamy ręczne przepisywanie (i błędy w Excelu)',
        desc: "Automatyzacja to w księgowości absolutna podstawa. Nasze modele z 99% skutecznością czytają skany faktur (nawet krzywe i zagniecione), kategoryzują koszty pod konkretne konta w Twoim systemie i monitorują płatności bez Twojej ingerencji.",
        metric: { value: '0', label: 'ręcznego przepisywania', subtext: 'z PDF-ów do arkuszy i systemów ERP' },
        useCases: [
            'Zaawansowany OCR fakturowy połączony z workflow akceptacji',
            'Generowanie raportów finansowych z rozproszonych źródeł',
            'Automatyczne rozliczanie delegacji i wydatków firmowych'
        ],
        theme: { text: 'text-[#8530d1]', bg: 'bg-[#8530d1]/10', border: 'border-[#8530d1]/20' },
        gradient: 'from-[#d5a4e7] to-[#8530d1]',
        accent: '#8530d1',
        image: '/industry_finance.png',
    }
];

function IndustryImagePanel({ activeData }) {
    return (
        <div className="relative w-full h-full min-h-[460px] overflow-hidden">
            {/* gradient corner accent */}
            <div
                className={`absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${activeData.gradient}`}
            />
            <motion.div
                key={`img-${activeData.id}`}
                initial={{ opacity: 0, scale: 1.04, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -12 }}
                transition={{ duration: 0.5, type: 'spring', damping: 25, stiffness: 120 }}
                className="absolute inset-0 flex items-end justify-end p-6 md:p-10"
            >
                <img
                    src={activeData.image}
                    alt={`${activeData.title} AI Platform`}
                    className="w-full max-w-[480px] rounded-2xl shadow-2xl object-cover border border-white/60"
                    style={{ maxHeight: '420px', objectPosition: 'top' }}
                />
            </motion.div>
        </div>
    );
}

export function IndustriesSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeData = industries[activeIndex];

    return (
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4 relative z-10">

                {/* Header */}
                <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold font-display tracking-tight text-[#0A2540] mb-6"
                    >
                        Rozwiązania dopasowane do Twojej branży
                    </motion.h2>
                    <p className="text-lg text-slate-500 font-medium">
                        Zautomatyzujemy to co powtarzalne, żebyś mógł skupić się na tym co ważne.
                    </p>
                </div>

                {/* Tabs (Pills) */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
                    {industries.map((item, idx) => {
                        const isActive = activeIndex === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                className={cn(
                                    "relative px-5 py-3 rounded-full flex items-center gap-2 font-semibold text-sm transition-all duration-300",
                                    isActive 
                                    ? "bg-[#0A2540] text-white shadow-lg shadow-slate-300/50" 
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTabPill" 
                                        className="absolute inset-0 bg-[#0A2540] rounded-full -z-10" 
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className={cn("relative z-10", isActive ? "text-white" : "text-slate-400")}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10">{item.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area (Bento-like Container) */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        
                        {/* Left Content Column */}
                        <div className="p-8 md:p-14 lg:p-20 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`content-${activeData.id}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                    className="flex flex-col h-full"
                                >
                                    <h3 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-[#0A2540] mb-4">
                                        {activeData.tagline}
                                    </h3>
                                    <p className="text-slate-500 text-lg leading-relaxed mb-8">
                                        {activeData.desc}
                                    </p>

                                    {/* Metric Highlight Box */}
                                    <div className={cn("rounded-2xl p-6 border flex items-center gap-6 mb-8", activeData.theme.bg, activeData.theme.border)}>
                                        <div className="flex-shrink-0">
                                            <span className={cn("block text-4xl font-black tracking-tighter", activeData.theme.text)}>
                                                {activeData.metric.value}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-700 text-sm uppercase tracking-wider mb-0.5">
                                                {activeData.metric.label}
                                            </span>
                                            <span className="block text-slate-500 text-sm">
                                                {activeData.metric.subtext}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Use Cases List */}
                                    <div className="mt-auto">
                                        <p className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            Gdzie to działa najlepiej?
                                        </p>
                                        <ul className="space-y-3">
                                            {activeData.useCases.map((useCase, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 className={cn("w-5 h-5 shrink-0 mt-0.5", activeData.theme.text)} />
                                                    <span className="text-slate-600 font-medium">{useCase}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right Visual Column */}
                        <div className="bg-slate-50/50 border-l border-slate-100 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <IndustryImagePanel activeData={activeData} key={`visual-${activeData.id}`} />
                            </AnimatePresence>
                        </div>

                    </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="mt-8 text-center">
                     <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                        Twojej branży nie ma na liście? <span className="font-bold text-[#0A2540] ml-1">Zbudujemy dedykowany proces.</span>
                     </p>
                </div>

            </div>
        </section>
    );
}
