import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Floating } from './animations/Floating';
import tymoteuszImg from '../assets/tymoteusz-madry-highres.jpg';
import zuzannaImg from '../assets/zuzanna-wozniak-highres.jpg';
import bogdanImg from '../assets/bogdan-dzudzewicz-highres.jpg';

const testimonials = [
    {
        id: 'tymoteusz',
        quote: "Workshift wdrożył u nas narzędzie do automatycznych notatek i podsumowań po spotkaniach online oraz dedykowany czat AI dla zespołu, zasilony bazą wiedzy z konsultacji. Czas przygotowania opinii prawnej po spotkaniu z klientem skrócił się z godzin do minut.",
        name: "Tymoteusz Mądry",
        title: "Partner",
        company: "Mądry Maśliński Law & Consulting",
        avatar: tymoteuszImg,
        accentColor: '#9CE069',
        tags: ["AI w kancelarii", "Automatyzacja notatek", "Custom Chat"],
    },
    {
        id: 'zuzanna',
        quote: "Workshift stworzył dla nas interaktywne narzędzie do budowania ścieżek kariery. Dzięki niemu w dużo bardziej przejrzysty sposób prezentujemy klientom przygotowane matryce kompetencji. Dodatkowo pracownicy mogą dokonać własnej samooceny i zobaczyć, jakich kompetencji im brakuje, żeby awansować.",
        name: "Zuzanna Woźniak",
        title: "CEO",
        company: "BusinessQuest",
        avatar: zuzannaImg,
        accentColor: '#8530d1',
        tags: ["HR Tech", "Ścieżki kariery", "Matryce kompetencji"],
    },
    {
        id: 'bogdan',
        quote: "Workshift wdrożył u nas narzędzie usprawniające procesy zwrotu opakowań oraz wytrenował model AI do analizowania i tworzenia kreacji reklamowych pod Metę i Google. Automatyzacja powtarzalnych zadań pozwoliła nam skupić się na skalowaniu biznesu.",
        name: "Bogdan Dzudzewicz",
        title: "CEO",
        company: "Vytal Poland",
        avatar: bogdanImg,
        accentColor: '#22c55e',
        tags: ["Kreacje reklamowe AI", "Automatyzacja procesów", "Meta & Google Ads"],
    },
];

/* ─── Single Accordion Panel ──────────────────────────────── */
function Panel({ testimonial, isActive, onClick }) {

    return (
        <motion.button
            layout
            onClick={onClick}
            aria-expanded={isActive}
            aria-label={`Opinia: ${testimonial.name}`}
            className={`
                relative overflow-hidden cursor-pointer w-full h-full
                rounded-[10px] border border-black/10 bg-white outline-none
                transition-shadow duration-500
                ${isActive
                    ? 'shadow-lg'
                    : 'shadow-sm hover:shadow-md'
                }
            `}
            style={{
                height: '520px',
            }}
            transition={{ layout: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }}
        >
            {/* ═══ EXPANDED STATE: split layout ═══ */}
            {isActive && (
                <>
                    {/* Left: solid white bg */}
                    <div
                        className="absolute inset-0 bg-white"
                    />

                    {/* Right: photo column */}
                    {testimonial.avatar && (
                        <div
                            className="absolute top-0 right-0 h-full overflow-hidden"
                            style={{ width: '42%' }}
                        >
                            <img
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                className="w-full h-full object-cover object-top"
                                style={{ filter: 'brightness(0.92)' }}
                            />
                            {/* Fade photo into content area */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(to right, ${testimonial.accentColor}18 0%, transparent 30%, transparent 100%)`,
                                }}
                            />
                        </div>
                    )}

                    {/* Content overlay */}
                    <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-10 text-left" style={{ maxWidth: '60%' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="expanded-content"
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* Quote icon */}
                                <svg className="w-7 h-7 mb-4" style={{ color: `${testimonial.accentColor}50` }} fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>

                                <p className="text-muted-dark text-base md:text-[17px] leading-[1.7] mb-6">
                                    {testimonial.quote}
                                </p>

                                {/* Tags */}
                                {testimonial.tags && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {testimonial.tags.map((tag, i) => (
                                            <span
                                                key={i}
                                                className="text-xs font-medium px-3 py-1.5 rounded-full border"
                                                style={{
                                                    backgroundColor: `${testimonial.accentColor}08`,
                                                    borderColor: `${testimonial.accentColor}20`,
                                                    color: testimonial.accentColor,
                                                }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${testimonial.accentColor}15` }}>
                                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: `${testimonial.accentColor}30` }}>
                                        <img src={testimonial.avatar} alt="" className="w-full h-full object-cover object-top" loading="lazy" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold font-display text-black text-[15px]">{testimonial.name}</h4>
                                        <p className="text-sm text-muted-dark">{testimonial.title}, {testimonial.company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </>
            )}

            {/* ═══ COLLAPSED STATE: photo fills panel ═══ */}
            {!isActive && (
                <>
                    {testimonial.avatar ? (
                        <img
                            src={testimonial.avatar}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                            style={{ filter: 'brightness(0.85)' }}
                            loading="lazy"
                        />
                    ) : (
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(160deg, ${testimonial.accentColor}15, ${testimonial.accentColor}08)`,
                            }}
                        />
                    )}

                    {/* Bottom gradient for name visibility */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to top, rgba(10,37,64,0.7) 0%, rgba(10,37,64,0.15) 40%, transparent 65%)',
                        }}
                    />

                    {/* Expand hint */}
                    <div className="absolute top-5 right-4 z-10">
                        <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <svg className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </div>
                    </div>

                    {/* Author info at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 p-5 text-left">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                                <img src={testimonial.avatar} alt="" className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-semibold font-display text-white text-sm truncate">{testimonial.name}</h4>
                                <p className="text-xs text-white/60 truncate">{testimonial.company}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </motion.button>
    );
}

/* ─── Mobile Card (for narrow screens) ─────────────────────── */
function MobileCard({ testimonial }) {
    const [isOpen, setIsOpen] = useState(false);
    const isPlaceholder = testimonial.placeholder;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[10px] overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full relative overflow-hidden rounded-[10px] cursor-pointer outline-none border border-black/10 bg-white
                    transition-shadow duration-300
                    ${isOpen ? 'shadow-md' : 'shadow-sm hover:shadow-md'}
                `}
            >
                {/* Photo / gradient bg */}
                <div className="relative h-64 w-full">
                    {testimonial.avatar ? (
                        <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover object-top"
                            style={{ filter: 'brightness(0.7)' }}
                        />
                    ) : (
                        <div
                            className="w-full h-full"
                            style={{
                                background: `linear-gradient(160deg, ${testimonial.accentColor}15, ${testimonial.accentColor}05)`,
                            }}
                        />
                    )}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to top, ${testimonial.accentColor}cc 0%, transparent 60%)`,
                        }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                        <h4 className="font-semibold font-display text-white text-lg">{testimonial.name}</h4>
                        <p className="text-sm text-white/70">{testimonial.title}, {testimonial.company}</p>
                    </div>
                    {/* Expand indicator */}
                    <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <motion.svg
                                animate={{ rotate: isOpen ? 45 : 0 }}
                                className="w-4 h-4 text-white/80"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </motion.svg>
                        </div>
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-white border border-black/5 border-t-0 rounded-b-[10px]">
                            <svg className="w-6 h-6 mb-3" style={{ color: `${testimonial.accentColor}40` }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <p className={`text-muted-dark leading-relaxed mb-4 ${isPlaceholder ? 'italic text-muted-light' : ''}`}>
                                {testimonial.quote}
                            </p>
                            {testimonial.tags && (
                                <div className="flex flex-wrap gap-2">
                                    {testimonial.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="text-xs font-medium px-3 py-1 rounded-full border"
                                            style={{
                                                backgroundColor: `${testimonial.accentColor}08`,
                                                borderColor: `${testimonial.accentColor}20`,
                                                color: testimonial.accentColor,
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}


/* ─── Main Section ─────────────────────────────────────────── */
export function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section id="case-studies" className="py-24 md:py-32 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-mono text-xs uppercase tracking-wider text-lime mb-4"
                    >
                        Referencje
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-3xl md:text-5xl font-display tracking-tight text-black"
                    >
                        Zamiast teorii. Co już{' '}
                        <span className="text-muted-dark font-light italic pr-2">
                            zautomatyzowaliśmy.
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-lg text-muted-dark max-w-xl"
                    >
                        Realne wyniki. Realni ludzie. Zero marketingowego bełkotu.
                    </motion.p>
                </div>

                {/* Desktop: Expanding Panels Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="hidden md:flex gap-4 w-full"
                >
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            layout
                            className="flex"
                            style={{ flex: activeIndex === index ? 5 : 1 }}
                            transition={{ layout: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } }}
                        >
                            <Floating 
                                duration={10 + index * 2}
                                amplitude={6}
                                rotation={0.5}
                                className="flex w-full h-full"
                            >
                                <Panel
                                    testimonial={testimonial}
                                    isActive={activeIndex === index}
                                    onClick={() => setActiveIndex(index)}
                                />
                            </Floating>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile: Stacked cards with accordion */}
                <div className="md:hidden flex flex-col gap-4">
                    {testimonials.map((testimonial, index) => (
                        <Floating key={testimonial.id} duration={8 + index} amplitude={8} rotation={1}>
                            <MobileCard testimonial={testimonial} />
                        </Floating>
                    ))}
                </div>

            </div>
        </section>
    );
}
