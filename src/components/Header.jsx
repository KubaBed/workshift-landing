import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { Logo } from './ui/Logo';
import { Magnetic } from './animations/Magnetic';
import { MENU_TOOL_LINKS } from '../data/siteNav';

const NAV_LINK_CLASS = "text-sm font-medium whitespace-nowrap hover:text-black transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-lime after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition-transform after:duration-300";

/**
 * „Narzędzia" w menu desktop: otwiera się po najechaniu, kliknięciem i z klawiatury
 * (Enter/spacja na przycisku, Escape zamyka). Linki są w HTML także zamknięte, żeby
 * prerender i Google widziały je na każdej podstronie.
 */
function ToolsMenu({ label, links }) {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const wrapRef = useRef(null);
    const buttonRef = useRef(null);
    const closeTimer = useRef(null);
    const isActive = links.some(([href]) => location.pathname === href);

    useEffect(() => {
        if (!open) return undefined;
        const onPointer = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };
        document.addEventListener('pointerdown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('pointerdown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    useEffect(() => () => clearTimeout(closeTimer.current), []);

    const openNow = () => { clearTimeout(closeTimer.current); setOpen(true); };
    // Krótka zwłoka, żeby menu nie znikało przy przejściu kursora z przycisku na panel.
    const closeSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpen(false), 150); };

    return (
        <div
            ref={wrapRef}
            className="relative"
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            onBlur={(e) => { if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false); }}
        >
            <Magnetic strength={0.2}>
                <button
                    ref={buttonRef}
                    type="button"
                    aria-expanded={open}
                    aria-controls="menu-narzedzia"
                    onClick={() => setOpen((v) => !v)}
                    className={`${NAV_LINK_CLASS} flex items-center gap-1 ${isActive || open ? 'text-black' : 'text-muted-dark'}`}
                >
                    {label}
                    <ChevronDown
                        size={14}
                        aria-hidden="true"
                        className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    />
                </button>
            </Magnetic>

            <div
                id="menu-narzedzia"
                className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-[opacity,transform] duration-200 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none invisible'}`}
            >
                <ul className="min-w-[200px] rounded-2xl border border-black/10 bg-sage p-2 shadow-lg shadow-black/10">
                    {links.map(([href, name]) => {
                        const current = location.pathname === href;
                        return (
                            <li key={href}>
                                <Link
                                    to={href}
                                    aria-current={current ? 'page' : undefined}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 focus-visible:bg-black/5 ${current ? 'text-black' : 'text-muted-dark hover:text-black'}`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${current ? 'bg-lime' : 'bg-black/15'}`} aria-hidden="true" />
                                    {name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

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

    const location = useLocation();
    const isHome = location.pathname === '/';
    // Landing kampanii płatnej: logo + telefon, zero nawigacji - każdy link
    // w menu to wyciek uwagi za którą płacimy w Meta Ads. Przywróć pełny
    // header po kampanii czerwiec 2026, jeśli /audyt-ai zostanie jako evergreen.
    const isCampaignLanding = location.pathname === '/audyt-ai';

    const navLinks = [
        { name: 'Usługi', href: '/#uslugi' },
        { name: 'Proces', href: '/#proces' },
        { name: 'Klienci', href: '/#case-studies' },
        { name: 'O nas', href: '/#o-nas' },
        { name: 'Blog', href: '/blog' },
        // Kalkulator wrócił do menu po kampanii z czerwca 2026, jako podpozycja „Narzędzi".
        { name: 'Narzędzia', children: MENU_TOOL_LINKS },
        { name: 'Kontakt', href: '/#kontakt' },
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
                        <Link to="/" className="flex items-center gap-2 group cursor-pointer transition-transform duration-300 z-50 relative">
                            <Logo variant="light" size={40} />
                        </Link>

                        {/* Od lg: przy 7 pozycjach pasek na 768-1023 px nie mieścił się obok logo i CTA. */}
                        <nav className="hidden lg:flex items-center gap-7">
                            {!isCampaignLanding && navLinks.map((link) => {
                                if (link.children) {
                                    return <ToolsMenu key={link.name} label={link.name} links={link.children} />;
                                }
                                const baseClass = NAV_LINK_CLASS;
                                const linkClass = link.highlight
                                    ? `${baseClass} text-black font-semibold flex items-center gap-1.5 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-lime before:animate-pulse`
                                    : `${baseClass} text-muted-dark`;
                                // Hash links → use <a> on homepage, <Link> on other pages
                                if (link.href.startsWith('/#')) {
                                    return isHome ? (
                                        <Magnetic key={link.name} strength={0.2}>
                                            <a href={link.href.slice(1)} className={linkClass}>
                                                {link.name}
                                            </a>
                                        </Magnetic>
                                    ) : (
                                        <Magnetic key={link.name} strength={0.2}>
                                            <Link to={link.href} className={linkClass}>
                                                {link.name}
                                            </Link>
                                        </Magnetic>
                                    );
                                }
                                return (
                                    <Magnetic key={link.name} strength={0.2}>
                                        <Link to={link.href} className={linkClass}>
                                            {link.name}
                                        </Link>
                                    </Magnetic>
                                );
                            })}
                        </nav>

                        {isCampaignLanding ? (
                            /* Landing kampanii: jedyna akcja poza quizem to telefon */
                            <a href="tel:+48796186067" className="z-50 relative">
                                <Button variant="accent" size="sm" className="hidden sm:flex">
                                    <Phone size={14} className="mr-1.5" />
                                    +48 796 186 067
                                </Button>
                                <span
                                    className="sm:hidden w-9 h-9 rounded-full bg-lime text-black flex items-center justify-center shadow-sm transition-transform active:scale-95"
                                    aria-label="Zadzwoń"
                                >
                                    <Phone size={16} />
                                </span>
                            </a>
                        ) : (
                            <>
                                {/* Full CTA on sm+ */}
                                <Link to={isHome ? '#kontakt' : '/#kontakt'}>
                                    <Button variant="accent" size="sm" className="hidden sm:flex z-50 relative">
                                        Umów rozmowę
                                    </Button>
                                </Link>
                                {/* Compact icon CTA on mobile */}
                                <Link
                                    to={isHome ? '#kontakt' : '/#kontakt'}
                                    className="sm:hidden z-50 relative w-9 h-9 rounded-full bg-lime text-black flex items-center justify-center shadow-sm transition-transform active:scale-95"
                                    aria-label="Umów rozmowę"
                                >
                                    <Phone size={16} />
                                </Link>

                                <button
                                    className="lg:hidden p-2 text-black z-50 relative transition-transform active:scale-95"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    aria-label="Toggle mobile menu"
                                >
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </>
                        )}
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
                        className="fixed inset-0 z-40 bg-sage/95 backdrop-blur-xl flex flex-col pt-32 px-6 pb-8 lg:hidden overflow-y-auto"
                    >
                        <nav className="flex flex-col gap-8 flex-grow">
                            {navLinks.map((link, i) => {
                                const mobileClass = "text-3xl font-display text-black border-b border-black/10 pb-4";
                                const motionProps = {
                                    key: link.name,
                                    onClick: () => setIsMenuOpen(false),
                                    initial: { opacity: 0, x: -20 },
                                    animate: { opacity: 1, x: 0 },
                                    transition: { duration: 0.3, delay: 0.05 * i },
                                    className: mobileClass,
                                };
                                if (link.children) {
                                    // Na telefonie bez rozwijania: nagłówek i podpozycje od razu widoczne.
                                    return (
                                        <motion.div {...motionProps} onClick={undefined}>
                                            <span className="block">{link.name}</span>
                                            <ul className="mt-4 flex flex-col gap-3 pl-4 border-l-2 border-lime">
                                                {link.children.map(([href, name]) => (
                                                    <li key={href}>
                                                        <Link
                                                            to={href}
                                                            className="block text-xl font-display text-black/70 hover:text-black"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    );
                                }
                                if (link.href.startsWith('/#') && isHome) {
                                    return <motion.a {...motionProps} href={link.href.slice(1)}>{link.name}</motion.a>;
                                }
                                return (
                                    <motion.div {...motionProps}>
                                        <Link to={link.href} className="block" onClick={() => setIsMenuOpen(false)}>
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="mt-8"
                        >
                            <Link to={isHome ? '#kontakt' : '/#kontakt'} onClick={() => setIsMenuOpen(false)}>
                                <Button variant="accent" size="lg" className="w-full text-lg">
                                    Umów rozmowę
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
