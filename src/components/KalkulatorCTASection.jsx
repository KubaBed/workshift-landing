import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Clock, TrendingDown, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { track, EVENTS } from '../lib/analytics';

const STATS = [
    { icon: Clock, value: '60s', label: 'tyle zajmuje wypełnienie' },
    { icon: TrendingDown, value: '32%', label: 'średnia strata czasu w polskim MŚP' },
    { icon: Sparkles, value: '3', label: 'rekomendacje pod Twoją branżę' },
];

export function KalkulatorCTASection() {
    const handleClick = () => {
        track(EVENTS.CALCULATOR_CTA_CLICK, { cta: 'section_homepage' });
    };

    return (
        <section className="relative py-20 md:py-28 px-4 overflow-hidden">
            {/* Background blur orbs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-lime/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-black/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-[1320px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="bg-white border border-black/10 rounded-3xl shadow-sm overflow-hidden"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Left: copy + CTA */}
                        <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-6">
                                <Calculator size={12} />
                                Bezpłatne narzędzie
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display tracking-tight text-black leading-[1.05] mb-5">
                                Sprawdź ile <span className="text-muted-dark">tracisz</span> <br className="hidden md:block" />
                                zanim umówisz diagnozę.
                            </h2>

                            <p className="text-base md:text-lg text-muted-dark leading-relaxed max-w-xl mb-8">
                                Pięć pytań o Twoją firmę → konkretne liczby + 3 rekomendacje pod Twoją branżę. Bez maila, bez logowania, bez dzwonienia. Wynik dostaniesz od razu.
                            </p>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <Link to="/kalkulator" onClick={handleClick}>
                                    <Button
                                        variant="accent"
                                        size="lg"
                                        className="h-14 px-7 text-base flex items-center gap-2 shadow-lg shadow-lime/20"
                                    >
                                        <Calculator size={18} />
                                        Otwórz kalkulator
                                        <ArrowRight size={16} />
                                    </Button>
                                </Link>
                                <span className="text-xs font-mono uppercase tracking-wider text-muted-dark">
                                    60 sekund · zero zobowiązań
                                </span>
                            </div>
                        </div>

                        {/* Right: stats */}
                        <div className="lg:col-span-5 bg-sage/40 border-t lg:border-t-0 lg:border-l border-black/10 p-8 md:p-10 lg:p-12 flex flex-col justify-center gap-6">
                            {STATS.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                                        <stat.icon size={20} className="text-black" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-3xl md:text-4xl font-display text-black leading-none">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-muted-dark mt-1">
                                            {stat.label}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
