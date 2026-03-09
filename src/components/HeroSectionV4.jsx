import React from 'react';
import { motion } from 'framer-motion';

export function HeroSectionV4() {
    return (
        <section className="relative overflow-hidden bg-white" style={{ minHeight: '100dvh' }}>

            {/* Background Image Container */}
            <div className="absolute inset-x-0 top-0 z-0 overflow-hidden" style={{ height: '110dvh' }}>
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url(/images/v4-landscape-new.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: 'calc(100% + 50px)', // Scale down relative to container to hide watermark safely
                    }}
                />

                {/* Very subtle light overlay for text contrast */}
                <div className="absolute inset-0 bg-white/10 pointer-events-none" />

                {/* Gradient mask to gracefully fade into the white background of the next section */}
                <div
                    className="absolute inset-x-0 bottom-0 pointer-events-none"
                    style={{
                        height: '50%',
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,1) 100%)'
                    }}
                />
            </div>

            {/* Text Content */}
            <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-32 lg:pt-48" style={{ minHeight: '100dvh' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, type: "spring", stiffness: 80 }}
                    className="text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter leading-[1.08] text-navy font-bold mb-8 text-balance mx-auto"
                >
                    Po drugiej stronie czeka firma, którą chcesz zbudować.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 80 }}
                    className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-[54ch] mx-auto mb-10 text-balance font-medium"
                >
                    Wdrażamy AI tam, gdzie ma to sens. Jesteśmy partnerem, który przeprowadzi Cię przez zmianę. Bez technologicznego żargonu ucinamy powtarzalne procesy, abyś mógł skupić się na zarabianiu.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45, type: "spring", stiffness: 80 }}
                >
                    <a
                        href="#kontakt"
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold text-base transition-all duration-300 cursor-pointer"
                        style={{
                            padding: '16px 36px',
                            backgroundColor: '#1653D4',
                            color: '#ffffff',
                            boxShadow: '0 4px 24px rgba(22, 83, 212, 0.3)',
                        }}
                    >
                        <span className="absolute inset-0 rounded-full transition-transform duration-500 ease-out origin-left scale-x-0 group-hover:scale-x-100" style={{ backgroundColor: '#0e3fb0' }} />
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
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
