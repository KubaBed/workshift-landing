import React from 'react';
import { motion } from 'framer-motion';

export function AboutUsSection() {
    return (
        <section id="o-nas" className="py-32 bg-slate-50 relative overflow-hidden">

            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    {/* Image Side (Asymmetric overlap) */}
                    <div className="lg:col-span-5 relative">

                        {/* Decorative background shape */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="absolute -top-10 -left-10 w-full h-full bg-chartreuse/20 rounded-[3rem] -rotate-6"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl shadow-navy/10 border-4 border-white"
                        >
                            {/* Founder Image Placeholder */}
                            <img
                                src="https://picsum.photos/seed/kuba/800/1000"
                                alt="Founder"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />

                            {/* Overlay Glass Badge */}
                            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-navy font-display">[Twoje Imię i Nazwisko]</p>
                                    <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mt-1">Founder, Workshift</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                                    <svg className="w-5 h-5 text-chartreuse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Text Side */}
                    <div className="lg:col-span-7 lg:pl-12">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-navy mb-8 text-balance">
                                Wiemy, o co toczy się gra, bo <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-slate-400">sami w nią gramy.</span>
                            </h2>

                            <div className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed">
                                <p>
                                    Cześć. Nie jesteśmy korporacyjnymi teoretykami. Od lat prowadzę własne spółki technologiczne i doskonale rozumiem, że na koniec dnia w raporcie P&L (Zyski i Straty) musi się zgadzać matematyka.
                                </p>
                                <p>
                                    Wiem, jak irytujące jest płacenie za narzędzia, których nikt w firmie nie używa. Wiem też, ile kosztuje tracenie utalentowanych ludzi przez wypalenie nudnymi, mechanicznymi zadaniami.
                                </p>
                                <p className="font-medium text-navy">
                                    Dlatego stworzyłem Workshift. Aby pokazać Ci automatyzacje, które odciążą Twój zespół już jutro, a nie za rok. Żadnych wdrożeń "na pokaz". Tylko ROI.
                                </p>
                            </div>

                            {/* Signature or neat visual element */}
                            <div className="mt-12 flex items-center gap-6">
                                <div className="h-[2px] w-16 bg-chartreuse" />
                                <span className="font-display text-2xl font-bold text-navy italic opacity-50">Workshift</span>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
