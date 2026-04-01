import React from 'react';
import { motion } from 'framer-motion';
import GradientText from './GradientText';
import jakubPhoto from '../Jakub-Bednarz.png';

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
                            className="absolute -top-10 -left-10 w-full h-full bg-accent/20 rounded-[3rem] -rotate-6"
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
                                    src={jakubPhoto}
                                    alt="Jakub Bednarz - Founder"
                                    className="w-full h-full object-cover transition-all duration-700"
                                />

                                {/* Overlay Glass Badge */}
                                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl glass-panel flex items-center justify-between border border-white/20">
                                    <div className="flex flex-col">
                                        <p className="font-bold text-navy font-display text-lg">Jakub Bednarz</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Founder & AI Strategist</p>
                                    </div>
                                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                                    <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
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
                                Wiemy, o co toczy się gra, bo sami <GradientText colors={['#ee703d', '#cc7cab', '#8530d1']} animationSpeed={6} yoyo={true}>w nią gramy.</GradientText>
                            </h2>

                            <div className="space-y-6 text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                                <p>
                                    Cześć, tu Jakub. W Workshift nie bawimy się w "korporacyjną nowomowę". Od lat buduję i skaluję organizacje, więc doskonale rozumiem, że każda minuta Twojego zespołu ma swoją cenę, a w raporcie P&L na koniec dnia liczy się konkretny wynik. 
                                </p>
                                <p>
                                    Widziałem zbyt wiele firm przepalających budżety na drogie narzędzia, których nikt nie potrafi obsłużyć. Wiem też, jak frustrujące jest tracenie utalentowanych ludzi, gdy ich potencjał marnuje się na mechaniczne, powtarzalne kopiowanie danych.
                                </p>
                                <p className="text-navy font-bold">
                                    Dlatego stworzyłem Workshift. Nie wdrażamy technologii "na pokaz". Projektujemy inteligentne ekosystemy, które odciążają Twój zespół od zaraz, dając Wam przestrzeń na to, co faktycznie buduje przewagę rynkową. Żadnych kompromisów. Tylko mierzalne ROI.
                                </p>
                            </div>

                            {/* Signature or neat visual element */}
                            <div className="mt-12 flex items-center gap-6">
                                <div className="h-[2px] w-16 bg-accent" />
                                <span className="font-display text-2xl font-bold text-navy italic opacity-50 font-jakarta">Workshift</span>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
