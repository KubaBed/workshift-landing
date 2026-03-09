import React from 'react';
import { motion } from 'framer-motion';
import { StripeDataViz } from './StripeDataViz';
import { GradientStripsBg } from './GradientStripsBg';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-white" style={{ minHeight: '100dvh' }}>

            {/* Layer 1: Gradient Strips Background — subtle animated bars */}
            <div className="absolute inset-0 z-0">
                <GradientStripsBg
                    barCount={45}
                    shape="rounded-hill"
                    colorFrom="#e0e7ff"
                    colorTo="#818cf8"
                    opacity={0.22}
                    blur={1}
                    animate={true}
                    feather={true}
                    noise={true}
                />
            </div>

            {/* Layer 2: Three.js data-viz starburst at bottom */}
            <div className="absolute inset-0 z-[1]">
                <StripeDataViz />
            </div>

            {/* Layer 3: Text Content — on top of everything */}
            <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center" style={{ minHeight: '100dvh' }}>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 80 }}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter leading-[1.08] text-navy font-bold mb-8 text-balance mx-auto"
                >
                    Wdrażamy AI, które{' '}
                    <br className="hidden md:block" />
                    po prostu działa.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25, type: "spring", stiffness: 80 }}
                    className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-[52ch] mx-auto mb-10 text-balance"
                >
                    Odzyskaj czas na budowanie firmy. Resztę zautomatyzujemy.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 80 }}
                >
                    <HeroCTAButton />
                </motion.div>
            </div>

        </section>
    );
}

/**
 * Icon Slide-In CTA Button
 */
function HeroCTAButton() {
    return (
        <motion.a
            href="#kontakt"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold text-base transition-all duration-300 cursor-pointer"
            style={{
                padding: '16px 36px',
                backgroundColor: '#635BFF',
                color: '#ffffff',
                boxShadow: '0 4px 24px rgba(99, 91, 255, 0.3)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            {/* Background sweep on hover */}
            <span
                className="absolute inset-0 rounded-full transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: '#4f46e5' }}
            />

            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2">
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                    Odbierz darmowy plan
                </span>
                <span className="relative overflow-hidden w-5 h-5 flex items-center justify-center">
                    <svg
                        className="w-4 h-4 transition-all duration-300 translate-x-[-20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </span>
            </span>
        </motion.a>
    );
}
