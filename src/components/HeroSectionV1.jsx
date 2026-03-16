import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StripeDataViz } from './StripeDataViz';
import { Highlighter } from './ui/Highlighter';
import { ArrowDown } from 'lucide-react';

/**
 * Hero Variant 1 — StripeDataViz on the right, Text on the left.
 * Clean white hero with interactive 3D lines and logo.
 */
export function HeroSectionV1() {
    return (
        <section className="relative overflow-hidden bg-white" style={{ minHeight: '100dvh' }}>
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4 flex flex-col lg:flex-row items-center" style={{ minHeight: '100dvh' }}>
                
                {/* LEFT COLUMN: Text Content */}
                <div className="flex-1 w-full lg:w-1/2 pt-32 pb-20 lg:py-0 relative z-20 flex flex-col justify-center">
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-accent font-bold tracking-[0.15em] text-xs uppercase mb-8 flex items-center gap-4"
                    >
                        <span className="w-8 h-[2px] bg-accent" />
                        AI CONSULTING DLA MŚP
                    </motion.p>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 80 }}
                        className="text-5xl md:text-7xl lg:text-[6rem] tracking-tighter leading-[1.05] text-navy font-medium mb-12"
                    >
                        Wdrażamy AI, które <br />
                        po prostu <Highlighter action="underline" color="#ee703d" isView={true} strokeWidth={4} padding={2} animationDuration={1000}>
                            działa.
                        </Highlighter>
                    </motion.h1>

                    {/* Divider */}
                    <div className="w-full h-[1px] bg-slate-100 mb-10" />

                    {/* Bottom 2-col section under the heading */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-24 items-start">
                        {/* Subheading & Stats */}
                        <div className="flex flex-col gap-10">
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-slate-500 leading-relaxed text-lg max-w-sm"
                            >
                                Konkretne wyniki, bez rewolucji. Odzyskaj czas na budowanie firmy — resztę zautomatyzujemy. Pomożemy przebić się przez szum.
                            </motion.p>
                            
                            {/* Stats List (Text only) */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.4 }}
                                className="flex flex-col gap-3 text-sm font-semibold text-slate-400"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    <span>30% mniej czasu spędzonego na powtarzalnych zadaniach</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                                    <span>0 dni przestoju w firmowych operacjach</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col justify-start items-start gap-4 md:pt-2"
                        >
                            <HeroCTAButtonV1 />
                            <a
                                href="#uslugi"
                                className="text-sm font-medium text-slate-500 hover:text-navy transition-colors flex items-center gap-1.5 group px-1"
                            >
                                Zobacz usługi
                                <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                            </a>
                        </motion.div>
                    </div>

                </div>

                {/* RIGHT COLUMN: 3D Visualization */}
                <div className="w-full lg:w-1/2 h-[50dvh] lg:h-full relative z-0 flex items-center justify-center opacity-80 md:opacity-100 mix-blend-multiply">
                     <StripeDataViz />
                </div>
            </div>
            
            {/* Background huge 'A' letter styling from mockup if needed, but we're relying on StripeDataViz */}
        </section>
    );
}

function HeroCTAButtonV1() {
    return (
        <motion.a
            href="#kontakt"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm font-semibold text-base transition-all duration-300 cursor-pointer"
            style={{
                padding: '16px 36px',
                backgroundColor: '#0A2540', // Navy button from mockup
                color: '#ffffff',
                boxShadow: '0 4px 20px rgba(10, 37, 64, 0.2)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <span
                className="absolute inset-0 rounded-sm transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: '#133a63' }}
            />
            <span className="relative z-10 flex items-center gap-2">
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    Odbierz darmowy plan
                </span>
                <span className="relative overflow-hidden w-5 h-5 flex items-center justify-center">
                    <svg
                        className="w-4 h-4 transition-all duration-300 translate-x-0 opacity-100 group-hover:translate-x-1"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </span>
            </span>
        </motion.a>
    );
}
