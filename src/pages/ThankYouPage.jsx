import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, BookOpen, Home } from 'lucide-react';

export default function ThankYouPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="min-h-screen bg-sage flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/5 blur-[120px] rounded-full" />
            </div>

            {/* Grid Lines */}
            <div className="fixed inset-0 pointer-events-none z-0 hidden lg:flex justify-center px-5">
                <div className="w-full max-w-[1320px] flex relative">
                    <div className="absolute top-0 bottom-0 left-0 w-px bg-black/5" />
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/3 -translate-x-px" />
                    <div className="absolute top-0 bottom-0 right-0 w-px bg-black/5" />
                </div>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 flex justify-center"
                >
                    <Logo variant="light" size={60} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-6 shadow-sm">
                        Potwierdzono pomyślnie
                    </span>
                    <h1 className="text-4xl md:text-6xl font-display tracking-tight text-black mb-6 leading-tight">
                        Witaj w gronie <br /><span className="text-muted-dark">subskrybentów Workshift.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-dark mb-12 leading-relaxed max-w-xl mx-auto">
                        Twoja subskrypcja została aktywowana. Co dwa tygodnie otrzymasz od nas konkretne case study, narzędzia AI i gotowe procesy do wdrożenia. No-nonsense, just results.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/blog" className="w-full sm:w-auto">
                        <Button variant="default" size="lg" className="w-full h-14 px-8 flex items-center gap-2 group shadow-lg shadow-black/5">
                            <BookOpen size={18} />
                            Przejdź do bloga
                        </Button>
                    </Link>
                    <Link to="/" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full h-14 px-8 flex items-center gap-2 border-black/10 hover:border-black transition-colors">
                            <Home size={18} />
                            Strona główna
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-24"
                >
                    <Link to="/blog" className="text-sm font-mono text-muted-dark hover:text-black transition-colors flex items-center justify-center gap-2 group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Wróć do przeglądania artykułów
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
