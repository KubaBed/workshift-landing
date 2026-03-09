import React from 'react';
import { motion } from 'framer-motion';

export function HeroSectionV3() {
    return (
        <section className="relative overflow-hidden bg-white min-h-[100dvh] flex flex-col lg:flex-row pt-24 pb-8 lg:p-4 gap-8 lg:gap-16">

            {/* Left: Large Image Container */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, type: "spring", stiffness: 50 }}
                className="w-full lg:w-1/2 h-[50vh] lg:h-[calc(100dvh-2rem)] relative rounded-3xl overflow-hidden shadow-2xl mx-4 lg:mx-0 order-2 lg:order-1 flex-shrink-0"
            >
                {/* Wrapper to scale/shift image to hide 50px bottom watermark cleanly */}
                <div className="absolute inset-0 w-full h-[calc(100%+60px)]">
                    <img
                        src="/images/v3-portal-new.jpg"
                        alt="AI Transformation Scene"
                        className="w-full h-full object-cover object-[center_30%] origin-center hover:scale-105 transition-transform duration-[20s] ease-out"
                    />
                </div>
                {/* Subtle glow/shadow over inside edge */}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/10 rounded-3xl" />
            </motion.div>

            {/* Right: Text Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-start px-6 lg:pr-16 order-1 lg:order-2">
                <div className="max-w-xl w-full flex flex-col items-start pt-10 lg:pt-0">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
                        className="text-5xl md:text-6xl lg:text-[4.5rem] tracking-tighter leading-[1.02] text-navy font-bold mb-6 text-balance"
                    >
                        Po drugiej stronie czeka firma, którą chcesz zbudować.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35, type: "spring", stiffness: 80 }}
                        className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-[48ch] mb-10 text-balance"
                    >
                        Wdrażamy AI tam gdzie ma to sens. Jesteśmy partnerem, który przeprowadzi Cię przez zmianę. Bez technologicznego żargonu ucinamy powtarzalne procesy, abyś mógł skupić się na zarabianiu.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5, type: "spring", stiffness: 80 }}
                        className="flex flex-wrap items-center justify-start gap-4"
                    >
                        <a
                            href="#kontakt"
                            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold text-base transition-all duration-300 cursor-pointer"
                            style={{
                                padding: '16px 36px',
                                backgroundColor: '#1653D4',
                                color: '#ffffff',
                                boxShadow: '0 4px 24px rgba(22, 83, 212, 0.35)',
                            }}
                        >
                            <span className="absolute inset-0 rounded-full transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100" style={{ backgroundColor: '#0e3fb0' }} />
                            <span className="relative z-10 flex items-center gap-2">
                                <span className="transition-transform duration-300 xl:group-hover:-translate-x-1">
                                    Rozpocznij współpracę
                                </span>
                                <span className="relative hidden w-0 overflow-hidden xl:flex items-center justify-center transition-all duration-300 opacity-0 group-hover:w-5 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0">
                                    <svg
                                        className="w-4 h-4 ml-2"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                        strokeLinecap="round" strokeLinejoin="round"
                                    >
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </span>
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
