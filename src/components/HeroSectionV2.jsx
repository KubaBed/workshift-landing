import React from 'react';
import { motion } from 'framer-motion';
import { GradientStripsBg } from './GradientStripsBg';

/**
 * Hero Variant 2 — GradientStripsBg with warm multi-color gradient.
 * Colors: #1653D4 (deep blue), #cc7cab (dusty rose), #ee703d (warm orange)
 * Creates a vibrant, warm-toned animated background.
 */
export function HeroSectionV2() {
    return (
        <section className="relative overflow-hidden bg-white" style={{ minHeight: '100dvh' }}>

            {/* Layer 1: Blue → Rose gradient strips */}
            <div className="absolute inset-0 z-0">
                <GradientStripsBg
                    barCount={50}
                    shape="hill"
                    colorFrom="#1653D4"
                    colorTo="#cc7cab"
                    opacity={0.35}
                    blur={2}
                    animate={true}
                    feather={true}
                    noise={true}
                />
            </div>

            {/* Layer 2: Rose → Orange gradient strips (offset for depth) */}
            <div className="absolute inset-0 z-[1]">
                <GradientStripsBg
                    barCount={30}
                    shape="valley"
                    colorFrom="#cc7cab"
                    colorTo="#ee703d"
                    opacity={0.25}
                    blur={3}
                    animate={true}
                    feather={true}
                    noise={false}
                />
            </div>

            {/* Text Content */}
            <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center" style={{ minHeight: '100dvh' }}>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 80 }}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter leading-[1.08] text-navy font-medium mb-8 text-balance mx-auto"
                >
                    Wdrażamy AI, które{' '}
                    <br className="hidden md:block" />
                    po prostu działa.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25, type: "spring", stiffness: 80 }}
                    className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-[54ch] mx-auto mb-10 text-balance"
                >
                    Pomagamy firmom wdrażać AI tam, gdzie naprawdę ma to znaczenie - z konkretnymi wynikami, bez rewolucjii. Bez zbędnego szumu. Odzyskaj czas na budowanie firmy. Resztę zautomatyzujemy.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 80 }}
                >
                    <HeroCTAButtonV2 />
                </motion.div>
            </div>

        </section>
    );
}

function HeroCTAButtonV2() {
    return (
        <motion.a
            href="#kontakt"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold text-base transition-all duration-300 cursor-pointer"
            style={{
                padding: '16px 36px',
                backgroundColor: '#1653D4',
                color: '#ffffff',
                boxShadow: '0 4px 24px rgba(22, 83, 212, 0.35)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            <span
                className="absolute inset-0 rounded-full transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: '#0e3fb0' }}
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
