import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Highlighter } from './ui/Highlighter';
import { ArrowRight, Zap } from 'lucide-react';

export function HeroSectionV5() {
    const containerRef = useRef(null);

    // Track scroll through the exact height of this component
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // --------------------------------------------------------
    // MAPPINGS FOR SVG SCROLLYTELLING ANIMATION (BACKGROUND PARALLAX)
    // --------------------------------------------------------

    // Overall SVG movement across the screen (Left to Right)
    // Starts off-center left, moves slowly right as user scrolls.
    const svgX = useTransform(scrollYProgress, [0, 1], ["-20vw", "20vw"]);

    // Overall SVG Scale & Opacity to avoid distracting from text
    // Keeps it massive and subtle.
    const svgScale = useTransform(scrollYProgress, [0, 1], [2, 2.5]);
    const svgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Internal SVG block movements

    // 1. Monolith to Blueprint (Separating Y axis)
    // Starts solid, separate between 0.2 and 0.5 scroll
    const topBlockY = useTransform(scrollYProgress, [0.1, 0.4], [0, -28]);
    const bottomBlockY = useTransform(scrollYProgress, [0.1, 0.4], [0, 28]);

    // 2. Blueprint to Shift (Sliding X axis and revealing color)
    // Occurs between 0.5 and 0.8 scroll
    const midBlockX = useTransform(scrollYProgress, [0.5, 0.8], [0, 24]);

    // Middle block gradient fades in, outer blocks fade slightly to emphasize the shift
    const outerOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0.35, 0.15]);
    const solidMidOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0.35, 0]);
    const gradOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

    // Text fade-in on mount
    const textOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

    return (
        // The container needs enough vertical scrolling room. 
        <section ref={containerRef} className="relative bg-white w-full border-b border-slate-100" style={{ height: '250vh' }}>

            {/* STICKY CONTAINER: Locks the hero view to the screen while scrolling */}
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">

                {/* 
                    BACKGROUND ANIMATION LAYER
                    Massive SVG logo animating left to right, splitting and shifting.
                */}
                <motion.div
                    className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
                    style={{ x: svgX, scale: svgScale, opacity: svgOpacity }}
                >
                    <svg width="240" height="240" viewBox="0 0 92 92" fill="none" className="overflow-visible">
                        {/* Top Layer */}
                        <motion.rect
                            x="26" y="41" width="40" height="10" rx="3" fill="#0A2540"
                            style={{ y: topBlockY, opacity: outerOpacity }}
                        />

                        {/* Middle Layer (Solid Base) */}
                        <motion.rect
                            x="26" y="41" width="40" height="10" rx="3" fill="#0A2540"
                            style={{ x: midBlockX, opacity: solidMidOpacity }}
                        />

                        {/* Middle Layer (Gradient Overlay, fades in as it shifts) */}
                        <motion.rect
                            x="26" y="41" width="40" height="10" rx="3" fill="url(#hero-bg-grad)"
                            style={{ x: midBlockX, opacity: gradOpacity }}
                        />

                        {/* Bottom Layer */}
                        <motion.rect
                            x="26" y="41" width="40" height="10" rx="3" fill="#0A2540"
                            style={{ y: bottomBlockY, opacity: outerOpacity }}
                        />

                        <defs>
                            <linearGradient id="hero-bg-grad" x1="26" y1="46" x2="66" y2="46" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#ee703d" />
                                <stop offset="50%" stopColor="#cc7cab" />
                                <stop offset="100%" stopColor="#8530d1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>

                {/* 
                    FOREGROUND TEXT LAYER
                    Centered, permanently visible text.
                */}
                <motion.div
                    className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter leading-[1.08] text-navy font-medium mb-8 text-balance mx-auto">
                        Wdrażamy AI, które{' '}
                        <br className="hidden md:block" />
                        układa procesy i po prostu <Highlighter action="highlight" color="#ee703d" isView={true} padding={8} animationDuration={1000}>działa</Highlighter>.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-[54ch] mx-auto mb-10 text-balance backdrop-blur-[2px] bg-white/30 p-2 rounded-xl">
                        Pomagamy firmom wdrażać AI tam, gdzie naprawdę ma to znaczenie - z konkretnymi wynikami, bez rewolucjii. Bez zbędnego szumu. Odzyskaj czas na budowanie firmy. Resztę zautomatyzujemy.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <HeroCTAButton />

                        <a
                            href="#uslugi"
                            className="text-sm font-medium text-slate-500 hover:text-navy transition-colors flex items-center gap-1.5 group"
                        >
                            Zobacz, jak to działa
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>

                    <div className="mt-12 flex items-center gap-3 text-sm text-slate-400 font-medium bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-slate-100">
                        <Zap size={14} className="text-accent" />
                        <span>50+ zautomatyzowanych procesów</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>0 dni przestoju</span>
                    </div>
                </motion.div>

                {/* Scroll hint icon at the bottom */}
                <motion.div
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0]) }}
                >
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold">Scrolluj</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-[1px] h-12 bg-gradient-to-b from-slate-400 to-transparent"
                    />
                </motion.div>

            </div>
        </section>
    );
}

function HeroCTAButton() {
    return (
        <motion.a
            href="#kontakt"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm font-semibold text-sm sm:text-base transition-all duration-300 cursor-pointer w-full sm:w-auto"
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
            <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    Odbierz darmowy plan
                </span>
                <span className="relative overflow-hidden w-5 h-5 flex items-center justify-center shrink-0">
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
