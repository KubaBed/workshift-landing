import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import newsletterBg from '../assets/newsletter-bg.png';

gsap.registerPlugin(ScrollTrigger);

const articles = [
    {
        title: "Google TurboQuant: Algorytm, który zmieści potężne AI w Twoim telefonie",
        tag: "Wiedza",
        time: "4 min czytania",
        slug: "google-turboquant-kompresja-ai"
    },
    {
        title: "Zatrudnię Juniora za 2000$ miesięcznie! (Z małym twistem)",
        tag: "Wiedza",
        time: "5 min czytania",
        slug: "zatrudnie-juniora-ai"
    }
];

export function NewsletterSection() {
    const sectionRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!privacyAccepted) return;
        
        setIsSubmitting(true);
        setStatus(null);
        
        try {
            // Zmieniono na skrypt backendowy by chronić API KEY przed leakiem w przeglądarce
            const payload = {
                name: name,
                email: email,
                listId: 4 // Zmieniono na listę #4 zgodnie z prośbą
            };

            const response = await fetch('/subscribe_newsletter.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok || window.location.hostname === "localhost") {
                setStatus('success');
                setTimeout(() => setIsModalOpen(false), 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            if (window.location.hostname === "localhost") {
                 console.log("Mockowanie powidzenia newslettera na Localhost (Brak silnika PHP)");
                 setStatus('success');
                 setTimeout(() => setIsModalOpen(false), 2000);
            } else {
                 setStatus('error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Exit Intent Popup
    useEffect(() => {
        const handleMouseOut = (e) => {
            // Trigger only on desktop and if mouse leaves top of the viewport
            if (window.innerWidth >= 1024 && e.clientY <= 0) {
                const hasSeen = sessionStorage.getItem('exitIntentShown');
                if (!hasSeen && !isModalOpen) {
                    setIsModalOpen(true);
                    sessionStorage.setItem('exitIntentShown', 'true');
                }
            }
        };

        document.addEventListener('mouseout', handleMouseOut);
        return () => document.removeEventListener('mouseout', handleMouseOut);
    }, [isModalOpen]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".newsletter-animate",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        once: true
                    }
                }
            );
            
            gsap.fromTo(
                ".article-animate",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        once: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-sage relative border-t border-black/5">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="max-w-xl">
                        <h2 className="newsletter-animate opacity-0 text-4xl md:text-5xl font-display tracking-tight text-black mb-6">
                            Nie chcesz kupować od razu? Pozwól nam udowodnić, że wiemy o czym mówimy.
                        </h2>
                        <p className="newsletter-animate opacity-0 text-lg text-muted-dark mb-10 leading-relaxed">
                            Dołącz do czytelników naszego newslettera "AI Praktycznie". Co dwa tygodnie dzielimy się jednym procesem, który zautomatyzowaliśmy, podając użyte narzędzia i wygenerowane oszczędności. Zero teoretyzowania.
                        </p>

                        <div className="newsletter-animate opacity-0 pt-2">
                            <Button onClick={() => setIsModalOpen(true)} size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-black/10 hover:shadow-xl transition-all">
                                Zapisz się do newslettera
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        {articles.map((article, idx) => (
                            <Link
                                to={`/blog/${article.slug}`}
                                key={idx}
                                className="article-animate opacity-0 group block p-8 rounded-[10px] bg-white border border-black/10 shadow-sm hover:shadow-xl hover:border-black/15 transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-16">
                                    <span className="font-mono text-xs uppercase tracking-wider text-black bg-lime px-3 py-1 rounded-full">{article.tag}</span>
                                    <svg className="w-5 h-5 text-muted-light group-hover:text-black transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                                </div>
                                <h3 className="text-xl font-display text-black mb-4 leading-snug group-hover:text-lime transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm font-mono text-muted-dark">{article.time}</p>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>

            {/* Brevo Newsletter Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-4xl bg-white rounded-[10px] shadow-2xl z-[101] overflow-y-auto flex flex-col md:flex-row max-h-[90vh]"
                        >
                            {/* Left Side: Image & Value Prop */}
                            <div className="w-full md:w-1/2 relative bg-black p-6 md:p-10 flex flex-col justify-between overflow-hidden text-white min-h-[200px] md:min-h-[500px]">
                                {/* Uploaded Background Image */}
                                <div className="absolute inset-0 z-0 bg-cover bg-[center_top]" style={{ backgroundImage: `url(${newsletterBg})` }}></div>
                                {/* Gradient overlay to keep text readable and possibly mask baked text */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 z-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                                <div className="absolute inset-0 z-0 bg-black/20"></div>

                                <div className="relative z-10 flex-1 flex flex-col justify-end items-center text-center pb-4">
                                    <h3 className="text-5xl md:text-6xl font-display tracking-tight drop-shadow-xl text-white">Let's connect</h3>
                                </div>
                                
                                <div className="relative z-10 pt-6 pb-2 border-t border-white/20 flex justify-center text-center lg:px-4">
                                    <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-sm drop-shadow-md">
                                        Co dwa tygodnie: jeden zautomatyzowany proces z konkretnymi narzędziami, porady wdrożeniowe, promocje na narzędzia AI, darmowe alternatywy i sposoby jak samemu wdrażać automatyzacje. Bez żadnego spamu.
                                    </p>
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div className="w-full md:w-1/2 bg-white p-6 md:p-10 flex flex-col justify-center relative">
                                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-sage transition-colors text-muted-light hover:text-black">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                                
                                <h4 className="text-2xl font-display text-black mb-2">Zapisz się</h4>
                                <p className="text-muted-dark mb-8">Wypełnij poniższe dane, aby dołączyć.</p>

                                <form onSubmit={handleSubscribe} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-black ml-1">Imię</label>
                                        <Input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Twoje imię"
                                            className="h-12 bg-sage border-black/10 focus-visible:ring-lime"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-black ml-1">Adres e-mail</label>
                                        <Input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Twój adres e-mail"
                                            className="h-12 bg-sage border-black/10 focus-visible:ring-lime"
                                        />
                                    </div>
                                    
                                    <div className="flex items-start gap-3 mt-6">
                                        <input
                                            type="checkbox"
                                            id="privacy"
                                            required
                                            checked={privacyAccepted}
                                            onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                            className="mt-1 w-4 h-4 rounded border-black/20 text-black focus:ring-lime"
                                        />
                                        <label htmlFor="privacy" className="text-xs text-muted-dark leading-relaxed">
                                            Akceptuję <Link to="/polityka-prywatnosci" className="underline hover:text-black">Politykę Prywatności</Link> i wyrażam zgodę na otrzymywanie materiałów promocyjnych.
                                        </label>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        size="lg" 
                                        disabled={isSubmitting || !privacyAccepted}
                                        className="w-full h-12 text-base mt-4 shadow-md transition-all duration-500 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden relative"
                                        style={{ backgroundColor: status === 'success' ? '#A3E635' : undefined, color: status === 'success' ? 'black' : undefined }}
                                    >
                                        <AnimatePresence mode="wait">
                                            {status === 'success' ? (
                                                <motion.div 
                                                    key="success"
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    <motion.svg 
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 10 }}
                                                        className="w-5 h-5 text-black" 
                                                        viewBox="0 0 24 24" 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        strokeWidth="3"
                                                    >
                                                        <motion.path 
                                                            initial={{ pathLength: 0 }}
                                                            animate={{ pathLength: 1 }}
                                                            transition={{ delay: 0.3, duration: 0.4 }}
                                                            d="M20 6L9 17L4 12" 
                                                        />
                                                    </motion.svg>
                                                    <span>Zapisano pomyślnie!</span>
                                                </motion.div>
                                            ) : (
                                                <motion.span 
                                                    key="idle"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    {isSubmitting ? 'Zapisywanie...' : 'Dołącz do newslettera'}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Button>

                                    {status === 'error' && (
                                        <p className="text-sm text-red-500 text-center font-medium mt-2">
                                            Wystąpił błąd. Spróbuj ponownie lub sprawdź klucz API.
                                        </p>
                                    )}
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
