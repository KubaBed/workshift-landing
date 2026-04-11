import React from 'react';
import { motion } from 'framer-motion';
import GradientText from './GradientText';
import jakubPhoto from '../Jakub-Bednarz.png';

export function AboutUsSection() {
    return (
        <section id="o-nas" className="py-20 lg:py-32 bg-sage relative overflow-hidden">

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
                            className="absolute -top-10 -left-10 w-full h-full bg-lime/20 rounded-[10px] -rotate-6"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                            className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[10px] overflow-hidden shadow-2xl shadow-black/10 border-4 border-white"
                        >
                            {/* Founder Image Placeholder */}
                                <img
                                        src={jakubPhoto}
                                        alt="Workshift Founder"
                                        loading="lazy"
                                        className="w-full h-full object-cover relative z-10 grayscale hover:grayscale-0 transition-all duration-500 scale-110"
                                />

                                {/* Overlay Solid Badge */}
                                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-[10px] bg-white flex items-center justify-between border border-black/10 shadow-xl z-20">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-black/10">
                                           <img src={jakubPhoto} alt="Avatar" className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-black text-sm">@jakubbednarz</p>
                                            <p className="text-[11px] text-muted-dark font-medium mt-0.5">Prezes Zarządu</p>
                                        </div>
                                    </div>
                                    <a href="https://www.linkedin.com/in/jakubbednarz/" target="_blank" rel="noopener noreferrer" className="h-9 px-4 rounded-full bg-black text-white text-xs font-semibold hover:bg-black/90 transition-colors flex items-center gap-2">
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                        LinkedIn
                                    </a>
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
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight text-black mb-8 text-balance">
                                Wiemy, o co toczy się gra, bo sami <GradientText colors={['#9CE069', '#7bc44a']} animationSpeed={6} yoyo={true}>w nią gramy.</GradientText>
                            </h2>

                            <div className="space-y-6 text-lg md:text-xl text-muted-dark leading-relaxed">
                                <p>
                                    Cześć, tu Jakub. W Workshift nie bawimy się w "korporacyjną nowomowę". Od lat buduję i skaluję organizacje, więc doskonale rozumiem, że każda minuta Twojego zespołu ma swoją cenę, a w raporcie P&L na koniec dnia liczy się konkretny wynik. 
                                </p>
                                <p>
                                    Widziałem zbyt wiele firm przepalających budżety na drogie narzędzia, których nikt nie potrafi obsłużyć. Wiem też, jak frustrujące jest tracenie utalentowanych ludzi, gdy ich potencjał marnuje się na mechaniczne, powtarzalne kopiowanie danych.
                                </p>
                                <p className="text-black font-medium">
                                    Dlatego stworzyłem Workshift. Nie wdrażamy technologii "na pokaz". Projektujemy rozwiązania, które odciążają Twój zespół od zaraz, dając Wam przestrzeń na to, co faktycznie buduje przewagę rynkową. Żadnych kompromisów. Tylko mierzalne ROI.
                                </p>
                            </div>

                            {/* Signature or neat visual element */}
                            <div className="mt-12 flex items-center gap-6">
                                <div className="h-[2px] w-16 bg-lime" />
                                <span className="font-display text-2xl text-black italic opacity-30">Workshift</span>
                            </div>

                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
