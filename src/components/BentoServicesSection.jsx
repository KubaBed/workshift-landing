import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const services = [
    {
        id: 's1',
        colSpan: 'md:col-span-7',
        delay: 0,
        front: {
            title: "Strategia & Audyt (Quick Wins)",
            desc: "Zaczynamy od tego, co u Ciebie generuje największe straty czasu. Od razu.",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="m18 20-6-10-6 10"/></svg>',
            bg: "bg-navy text-white",
            titleColor: "text-white"
        },
        back: {
            content: "W 30 minut mapujemy Twój proces (np. obieg faktur, obsługę zapytań klienta). Pokazujemy wprost: 'Tu tracisz 10 godzin tygodniowo. Możemy to zautomatyzować w 3 dni za X zł. Twój zwrot (ROI) wyniesie Y'. Żadnych wielomiesięcznych i ryzykownych analiz.",
            bg: "bg-slate-800 text-slate-300"
        }
    },
    {
        id: 's2',
        colSpan: 'md:col-span-5',
        delay: 0.1,
        offset: true,
        front: {
            title: "Agenci i Automatyzacje AI",
            desc: "Zastępujemy kopiuj-wklej inteligentnymi przepływami danych.",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>',
            bg: "bg-white border border-slate-200 text-slate-600",
            titleColor: "text-navy"
        },
        back: {
            content: "Tworzymy 'niewidzialnych pracowników' korzystając z Make.com czy Zapier. Ktoś pisze maila z zapytaniem? AI samo analizuje treść, kategoryzuje priorytet, wrzuca zadanie do Asany i przygotowuje dla Ciebie szkic odpowiedzi. Ty tylko klikasz 'Wyślij'.",
            bg: "bg-slate-100 text-slate-700"
        }
    },
    {
        id: 's3',
        colSpan: 'md:col-span-5',
        delay: 0.2,
        offset: true,
        front: {
            title: "Sprzedażowe Bazy Danych / CRM",
            desc: "Uporządkowana wiedza, która sama popycha sprzedaż.",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
            bg: "bg-white border border-slate-200 text-slate-600",
            titleColor: "text-navy"
        },
        back: {
            content: "Jeżeli opierasz biznes na rozrzuconych arkuszach Excela, zintegrujemy je w jeden czysty ekosystem (np. Airtable/Coda). Dodamy AI, które samo wyłapie, że do klienta należy się odezwać, bo minęły 3 miesiące od ostatniego zakupu.",
            bg: "bg-slate-100 text-slate-700"
        }
    },
    {
        id: 's4',
        colSpan: 'md:col-span-7',
        delay: 0.3,
        front: {
            title: "Voiceboty & Obsługa Klienta",
            desc: "Zdejmij słuchawkę z uszu Twoich pracowników.",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
            bg: "bg-terra text-white",
            titleColor: "text-white"
        },
        back: {
            content: "Wdrażamy asystentów głosowych, którzy 24/7 odbierają telefony od klientów, rezerwują wizyty w kalendarzu, odpowiadają na FAQ i brzmią całkowicie naturalnie. Zespół Customer Success zajmuje się już tylko najtrudniejszymi przypadkami (eskalacje).",
            bg: "bg-[#b17d65] text-white"
        }
    }
];

export function BentoServicesSection() {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 60]);

    const [flippedCards, setFlippedCards] = useState({});

    const toggleFlip = (id) => {
        setFlippedCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <section id="uslugi" className="relative py-32 bg-alabaster overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <div className="mb-20 max-w-2xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold font-display tracking-tight text-navy mb-6 text-balance"
                    >
                        Gdzie Twoja firma ma wąskie gardło? <br /><span className="text-terra">Odwróć kartę i sprawdź konkrety.</span>
                    </motion.h2>
                </div>

                {/* Asymmetrical Bento Grid with 3D context */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 hover:[perspective:1000px] perspective-[1000px]">

                    {services.map((svc) => (
                        <motion.div
                            key={svc.id}
                            style={{ y: svc.offset ? y1 : 0 }}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: svc.delay, type: "spring", stiffness: 100 }}
                            className={`${svc.colSpan} h-[380px] lg:h-[420px] relative group cursor-pointer perspective-[1000px]`}
                            onClick={() => toggleFlip(svc.id)}
                        >

                            {/* Inner 3D Container performing the flip */}
                            <motion.div
                                animate={{ rotateY: flippedCards[svc.id] ? 180 : 0 }}
                                transition={{ duration: 0.6, type: "spring", stiffness: 150, damping: 20 }}
                                className="w-full h-full relative preserve-3d"
                                style={{ transformStyle: "preserve-3d" }}
                            >

                                {/* FRONT FACE */}
                                <div
                                    className={`absolute inset-0 backface-hidden rounded-[2.5rem] p-10 lg:p-14 shadow-xl flex flex-col justify-between overflow-hidden ${svc.front.bg} group-hover:shadow-2xl transition-shadow`}
                                    style={{ backfaceVisibility: "hidden" }}
                                >
                                    {/* Abstract Glow (visible only on dark cards) */}
                                    {svc.front.bg.includes('navy') && (
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-terra/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                                    )}

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-10 border border-slate-500/20 backdrop-blur-md">
                                            <div className="w-8 h-8 opacity-80" dangerouslySetInnerHTML={{ __html: svc.front.icon }} />
                                        </div>
                                        <h3 className={`text-3xl lg:text-4xl font-display font-bold mb-4 tracking-tight text-balance ${svc.front.titleColor}`}>{svc.front.title}</h3>
                                        <p className="text-lg opacity-80 max-w-[40ch] leading-relaxed font-medium">
                                            {svc.front.desc}
                                        </p>
                                    </div>

                                    {/* Plus Icon Trigger Indicator */}
                                    <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-current opacity-30 flex items-center justify-center group-hover:scale-110 group-hover:opacity-100 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    </div>
                                </div>

                                {/* BACK FACE (Flipped) */}
                                <div
                                    className={`absolute inset-0 backface-hidden rounded-[2.5rem] p-10 lg:p-14 shadow-xl flex flex-col justify-center items-center text-center ${svc.back.bg}`}
                                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                >
                                    <p className="text-xl md:text-2xl leading-relaxed text-balance font-medium">
                                        {svc.back.content}
                                    </p>
                                    {/* Close Icon Trigger Indicator */}
                                    <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full border border-current opacity-30 flex items-center justify-center hover:scale-110 hover:opacity-100 transition-all">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </div>
                                </div>

                            </motion.div>

                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}
