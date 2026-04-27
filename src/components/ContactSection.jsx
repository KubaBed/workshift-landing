import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Send, CheckCircle, Clock, Shield } from 'lucide-react';
import { track, EVENTS } from '../lib/analytics';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [error, setError] = useState(null);
    const sectionRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            const payload = {
                name: e.target['contact-name'].value,
                email: e.target['contact-email'].value,
                company: e.target['contact-company'].value || '',
                message: e.target['contact-message'].value,
            };

            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok || (window.location.hostname === "localhost")) {
                // Jesli to localhost, zakladamy, ze PHP nie dziala (zazwyczaj wymaga oddzielnego serwera z PHP, a Vite dziala pod Node)
                // W przypadku sukcesu lub trybu dev:
                setSubmitted(true);
                track(EVENTS.CONTACT_FORM_SUBMIT, {
                    hasCompany: !!payload.company,
                    messageLength: payload.message.length,
                });
            } else {
                const data = await response.json();
                setError(data.error || "Wystąpił nieoczekiwany błąd. Spróbuj później.");
            }
        } catch (err) {
            // Ze względu na problemy CORS/fetch przy braku PHP lokalnie pozwalamy na debug mode:
            if (window.location.hostname === "localhost") {
                console.log("Mockowanie powidzenia formularza na Localhost (Brak silnika PHP)");
                setSubmitted(true);
                track(EVENTS.CONTACT_FORM_SUBMIT, { hasCompany: false, mock: true });
            } else {
                setError("Problem techniczny podczas łączenia z serwerem poczty.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".contact-animate-left",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        once: true
                    }
                }
            );

            gsap.fromTo(
                ".contact-animate-right",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        once: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const trustSignals = [
        { icon: Clock, text: 'Odpowiadamy w ciągu 24h' },
        { icon: Shield, text: 'Dane przetwarzane zgodnie z RODO' },
        { icon: CheckCircle, text: 'Bez zobowiązań' },
    ];

    return (
        <section ref={sectionRef} id="kontakt" className="py-24 md:py-32 bg-black relative overflow-hidden">

            {/* Decorative glow */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lime rounded-full blur-[200px] opacity-[0.06] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left - Copy + trust signals */}
                    <div>
                        <h2 className="contact-animate-left opacity-0 text-4xl md:text-5xl lg:text-6xl font-display tracking-tight text-white mb-6 text-balance">
                            Porozmawiajmy o{' '}
                            <span className="text-lime">Twoich procesach.</span>
                        </h2>

                        <p className="contact-animate-left opacity-0 text-lg text-white/50 leading-relaxed mb-10 max-w-md">
                            Opisz krótko swój problem. W ciągu 24h odzywamy się ze wstępnym planem automatyzacji - za darmo, bez zobowiązań.
                        </p>

                        <div className="contact-animate-left opacity-0 flex flex-col gap-4">
                            {trustSignals.map((signal, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <signal.icon size={18} className="text-lime shrink-0" />
                                    <span className="text-sm font-medium text-white/60">{signal.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right - Form */}
                    <div className="contact-animate-right opacity-0">
                        {submitted ? (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[10px] p-10 md:p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-lime/20 flex items-center justify-center">
                                    <CheckCircle size={32} className="text-lime" />
                                </div>
                                <h3 className="text-2xl font-display text-white mb-3">Dziękujemy!</h3>
                                <p className="text-white/50">Odezwiemy się w ciągu 24 godzin z propozycją terminu i wstępnym planem.</p>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[10px] p-8 md:p-10 space-y-5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-2">
                                            Imię <span className="text-lime">*</span>
                                        </label>
                                        <Input
                                            id="contact-name"
                                            type="text"
                                            required
                                            placeholder="Jan"
                                            className="w-full h-12 px-4 rounded-[10px] bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-lime/40 focus-visible:border-lime/40 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-2">
                                            Email <span className="text-lime">*</span>
                                        </label>
                                        <Input
                                            id="contact-email"
                                            type="email"
                                            required
                                            placeholder="jan@firma.pl"
                                            className="w-full h-12 px-4 rounded-[10px] bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-lime/40 focus-visible:border-lime/40 text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="contact-company" className="block text-sm font-medium text-slate-300 mb-2">
                                        Firma <span className="text-slate-500 text-xs">(opcjonalnie)</span>
                                    </label>
                                    <Input
                                        id="contact-company"
                                        type="text"
                                        placeholder="Nazwa Twojej firmy"
                                        className="w-full h-12 px-4 rounded-[10px] bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-lime/40 focus-visible:border-lime/40 text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-2">
                                        Wiadomość <span className="text-lime">*</span>
                                    </label>
                                    <Textarea
                                        id="contact-message"
                                        required
                                        rows={4}
                                        placeholder="Opisz krótko, jakie procesy chciałbyś zautomatyzować..."
                                        className="w-full px-4 py-3 rounded-[10px] bg-white/10 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-lime/40 focus-visible:border-lime/40 text-sm resize-none"
                                    />
                                </div>

                                    <div className="flex items-start gap-3 px-1">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="privacy-checkbox"
                                                name="privacy-checkbox"
                                                type="checkbox"
                                                required
                                                checked={privacyAccepted}
                                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                                className="h-4 w-4 rounded border-white/10 bg-white/10 text-lime focus:ring-lime/40 focus:ring-offset-black"
                                            />
                                        </div>
                                        <label htmlFor="privacy-checkbox" className="text-xs text-white/50 leading-tight">
                                            Zgadzam się na przetwarzanie moich danych osobowych zgodnie z <Link to="/polityka-prywatnosci" className="text-white hover:text-lime underline transition-colors">Polityką Prywatności</Link>. <span className="text-lime">*</span>
                                        </label>
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="accent"
                                        size="lg"
                                        disabled={isSubmitting || !privacyAccepted}
                                        className="w-full text-base gap-2"
                                    >
                                        <Send size={16} />
                                        {isSubmitting ? "Wysyłanie..." : "Wyślij - odpowiemy w 24h"}
                                    </Button>

                                    {error && (
                                        <p className="text-sm text-red-500 font-medium text-center">
                                            {error}
                                        </p>
                                    )}
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
