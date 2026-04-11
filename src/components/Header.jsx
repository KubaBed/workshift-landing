import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Menu, X, Phone } from 'lucide-react';
import { Logo } from './ui/Logo';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Track scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle scroll lock when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [isMenuOpen]);

    const navLinks = [
        { name: 'Usługi', href: '#uslugi' },
        { name: 'Proces', href: '#proces' },
        { name: 'Klienci', href: '#case-studies' },
        { name: 'O nas', href: '#o-nas' },
        { name: 'Kontakt', href: '#kontakt' },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4' : 'py-6'}`}
            >
                <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">
                    <div className={`flex items-center justify-between rounded-full px-6 py-3 transition-colors duration-300 ${isScrolled || isMenuOpen ? 'bg-sage/80 backdrop-blur-xl border border-black/5' : 'bg-transparent'}`}>
                        <div className="flex items-center gap-2 group cursor-pointer transition-transform duration-300 z-50 relative">
                            <Logo variant="light" size={40} />
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-muted-dark hover:text-black transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-lime after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        {/* Full CTA on sm+ */}
                        <a href="#darmowa-konsultacja">
                            <Button variant="accent" size="sm" className="hidden sm:flex z-50 relative">
                                Darmowa konsultacja
                            </Button>
                        </a>
                        {/* Compact icon CTA on mobile */}
                        <a
                            href="#darmowa-konsultacja"
                            className="sm:hidden z-50 relative w-9 h-9 rounded-full bg-lime text-black flex items-center justify-center shadow-sm transition-transform active:scale-95"
                            aria-label="Kontakt"
                        >
                            <Phone size={16} />
                        </a>

                        <button
                            className="md:hidden p-2 text-black z-50 relative transition-transform active:scale-95"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle mobile menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-sage/95 backdrop-blur-xl flex flex-col pt-32 px-6 pb-8 md:hidden overflow-y-auto"
                    >
                        <nav className="flex flex-col gap-8 flex-grow">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.05 * i }}
                                    className="text-3xl font-display text-black border-b border-black/10 pb-4"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="mt-8"
                        >
                            <Button variant="accent" size="lg" className="w-full text-lg" onClick={() => setIsMenuOpen(false)}>
                                Darmowa konsultacja
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
