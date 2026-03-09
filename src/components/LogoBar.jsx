import React from 'react';
import { motion } from 'framer-motion';

const LOGOS = [
    { name: 'TechCorp', width: 'w-24' },
    { name: 'DataFlow', width: 'w-20' },
    { name: 'CloudBase', width: 'w-28' },
    { name: 'AutoSys', width: 'w-22' },
    { name: 'SmartOps', width: 'w-24' },
    { name: 'AIWorks', width: 'w-20' },
];

export function LogoBar() {
    return (
        <section className="py-10 md:py-14 bg-white border-b border-slate-100 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 text-center mb-8"
                >
                    Zaufali nam
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex items-center justify-center gap-8 md:gap-14 flex-wrap"
                >
                    {LOGOS.map((logo, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-center h-8 md:h-10 opacity-30 hover:opacity-60 transition-opacity duration-300 grayscale"
                        >
                            {/* Placeholder logo — replace with real SVGs/images */}
                            <span className="text-sm md:text-base font-display font-bold tracking-tight text-slate-900 whitespace-nowrap">
                                {logo.name}
                            </span>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
