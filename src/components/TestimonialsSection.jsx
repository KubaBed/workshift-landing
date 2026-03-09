import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonials = [
    {
        quote: "Workshift wdrożył w naszym dziale prawnym asystenta AI wyszukującego orzecznictwo. Czas pisania standardowej opinii spadł z 14 godzin do kilku minut. To nie jest ewolucja, to zmiana gry.",
        name: "Jan Kowalski",
        title: "Partner Zarządzający",
        avatar: "https://picsum.photos/seed/jan/100/100"
    },
    {
        quote: "Byłem sceptyczny wobec AI. Myślałem, że to zabawka dla wielkich graczy. Pół godziny z ekspertami Workshift i wdrożyli skrypt do automatycznej kategoryzacji przelewów. Oszczędzamy 2 dni robocze.",
        name: "Michał Nowak",
        title: "Dyrektor Finansowy",
        avatar: "https://picsum.photos/seed/michal/100/100"
    },
    {
        quote: "Nasz BOK tonął w rutynowych mailach i telefonach. Agent głosowy (Voicebot) od Workshift samodzielnie rozwiązuje około 40% zapytań od ręki na pierwszej linii. Pracownicy przestali odchodzić.",
        name: "Anna Wiśniewska",
        title: "Head of Customer Success",
        avatar: "https://picsum.photos/seed/anna/100/100"
    }
];

export function TestimonialsSection() {
    const { scrollYProgress } = useScroll();
    const xTransform = useTransform(scrollYProgress, [0.3, 1], ["5%", "-15%"]);

    return (
        <section id="case-studies" className="py-32 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <div className="mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-display tracking-tight text-navy"
                    >
                        Zamiast teorii. Co już <span className="text-transparent bg-clip-text bg-gradient-to-r from-chartreuse to-[#b1cc00]">zautomatyzowaliśmy.</span>
                    </motion.h2>
                </div>

            </div>

            {/* Horizontal Carousel of Testimonials */}
            <div className="relative w-full">
                <motion.div
                    style={{ x: xTransform }}
                    className="flex gap-6 md:gap-8 px-6 md:px-12 w-[max-content]"
                >
                    {testimonials.map((test, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1, type: "spring", stiffness: 100 }}
                            className="w-[340px] md:w-[450px] shrink-0 rounded-[2.5rem] bg-slate-50 border border-slate-200 p-8 md:p-10 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]"
                        >

                            <div className="mb-8 relative">
                                <svg className="absolute -top-4 -left-4 w-12 h-12 text-slate-200" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium relative z-10 pt-4">
                                    "{test.quote}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-auto">
                                <img
                                    src={test.avatar}
                                    alt={test.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div>
                                    <h4 className="font-bold text-navy font-display">{test.name}</h4>
                                    <p className="text-sm text-slate-500">{test.title}</p>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </motion.div>
            </div>

        </section>
    );
}
