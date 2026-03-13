import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StripeDataViz } from './StripeDataViz';
import { Highlighter } from './ui/Highlighter';
import { ArrowRight, Zap } from 'lucide-react';

/**
 * Hero Variant 1 — StripeDataViz (Three.js starburst) as background only.
 * Clean white hero with interactive 3D lines behind the text.
 */
export function HeroSectionV1() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        setIsMobile(mq.matches);
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return (
        <section className="relative overflow-hidden bg-white" style={{ minHeight: '100dvh' }}>

            {/* Three.js viz on desktop, gradient fallback on mobile */}
            <div className="absolute inset-0 z-0">
                {isMobile ? (
                    <div className="w-full h-full" style={{
                        background: 'radial-gradient(ellipse at 30% 50%, rgba(238,112,61,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(204,124,171,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(213,164,231,0.05) 0%, transparent 50%), white'
                    }} />
                ) : (
                    <StripeDataViz />
                )}
            </div>

            {/* Text Content */}
            <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center pointer-events-none" style={{ minHeight: '100dvh' }}>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 80 }}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter leading-[1.08] text-navy font-medium mb-8 text-balance mx-auto pointer-events-auto"
                >
                    Wdrażamy AI, które{' '}
                    <br className="hidden md:block" />
                    po prostu <Highlighter action="highlight" color="#ee703d" isView={true} padding={8} animationDuration={1000}>działa</Highlighter>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25, type: "spring", stiffness: 80 }}
                    className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-[54ch] mx-auto mb-10 text-balance pointer-events-auto"
                >
                    Pomagamy firmom wdrażać AI tam, gdzie naprawdę ma to znaczenie - z konkretnymi wynikami, bez rewolucjii. Bez zbędnego szumu. Odzyskaj czas na budowanie firmy. Resztę zautomatyzujemy.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 80 }}
                    className="pointer-events-auto flex flex-col items-center gap-4"
                >
                    <HeroCTAButtonV1 />

                    {/* Secondary CTA */}
                    <a
                        href="#uslugi"
                        className="text-sm font-medium text-slate-500 hover:text-navy transition-colors flex items-center gap-1.5 group"
                    >
                        Zobacz, jak to działa
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </motion.div>

                {/* Social proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="pointer-events-auto mt-12 flex items-center gap-3 text-sm text-slate-400 font-medium"
                >
                    <Zap size={14} className="text-accent" />
                    <span>50+ zautomatyzowanych procesów</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>0 dni przestoju</span>
                </motion.div>
            </div>

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
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                boxShadow: '0 4px 24px rgba(238, 112, 61, 0.3)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <span
                className="absolute inset-0 rounded-sm transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: '#d4622f' }}
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
