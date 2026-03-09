import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Send, CheckCircle, Clock, Shield } from 'lucide-react';

export function ContactSection() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        // TODO: integrate with backend / email service
    };

    const trustSignals = [
        { icon: Clock, text: 'Odpowiadamy w ciągu 24h' },
        { icon: Shield, text: 'Twoje dane są bezpieczne' },
        { icon: CheckCircle, text: 'Bez zobowiązań' },
    ];

    return (
        <section id="kontakt" className="py-24 md:py-32 bg-navy relative overflow-hidden">

            {/* Decorative glow */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent rounded-full blur-[200px] opacity-[0.06] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left — Copy + trust signals */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white mb-6 text-balance"
                        >
                            Porozmawiajmy o{' '}
                            <span className="text-chartreuse">Twoich procesach.</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-400 leading-relaxed mb-10 max-w-md"
                        >
                            Wyślij krótką wiadomość, a my odezwiemy się z darmowym planem automatyzacji dopasowanym do Twojej firmy.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col gap-4"
                        >
                            {trustSignals.map((signal, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <signal.icon size={18} className="text-chartreuse shrink-0" />
                                    <span className="text-sm font-medium text-slate-300">{signal.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
                    >
                        {submitted ? (
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 md:p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-chartreuse/20 flex items-center justify-center">
                                    <CheckCircle size={32} className="text-chartreuse" />
                                </div>
                                <h3 className="text-2xl font-bold font-display text-white mb-3">Dziękujemy!</h3>
                                <p className="text-slate-400">Odezwiemy się w ciągu 24 godzin z propozycją terminu i wstępnym planem.</p>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 space-y-5"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-sm font-medium text-slate-300 mb-2">
                                            Imię <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            placeholder="Jan"
                                            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-chartreuse/40 focus:border-chartreuse/40 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-medium text-slate-300 mb-2">
                                            Email <span className="text-accent">*</span>
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            placeholder="jan@firma.pl"
                                            className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-chartreuse/40 focus:border-chartreuse/40 transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="contact-company" className="block text-sm font-medium text-slate-300 mb-2">
                                        Firma <span className="text-slate-500 text-xs">(opcjonalnie)</span>
                                    </label>
                                    <input
                                        id="contact-company"
                                        type="text"
                                        placeholder="Nazwa Twojej firmy"
                                        className="w-full h-12 px-4 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-chartreuse/40 focus:border-chartreuse/40 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium text-slate-300 mb-2">
                                        Wiadomość <span className="text-accent">*</span>
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        required
                                        rows={4}
                                        placeholder="Opisz krótko, jakie procesy chciałbyś zautomatyzować..."
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-chartreuse/40 focus:border-chartreuse/40 transition-all text-sm resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="accent"
                                    size="lg"
                                    className="w-full text-base gap-2"
                                >
                                    <Send size={16} />
                                    Wyślij zapytanie
                                </Button>

                                <p className="text-xs text-slate-500 text-center">
                                    Wysyłając formularz zgadzasz się z naszą Polityką Prywatności.
                                </p>
                            </form>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
