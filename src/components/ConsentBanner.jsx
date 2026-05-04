import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X } from 'lucide-react';
import { Button } from './ui/Button';
import { getConsent, setConsent } from '../lib/consent';

/**
 * Cookie consent banner — Workshift voice (przystępny, nie prawniczy).
 *
 * UX decisions:
 * - Bottom-fixed slide-up, nie modal blokujący stronę. User może czytać
 *   zanim zdecyduje.
 * - 2 główne przyciski równe wagi (RODO: reject as easy as accept).
 * - "Wybierz co" expand pokazuje granular checkboxy bez kolejnego ekranu.
 * - Nie pokazuje się jeśli user już zdecydował (sprawdza localStorage
 *   przez getConsent()).
 * - Reopen przez window event 'workshift:consent-open' — link w Footer.
 */
export function ConsentBanner() {
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [analytics, setAnalytics] = useState(true);
    const [recordings, setRecordings] = useState(true);

    useEffect(() => {
        // Show banner gdy brak decyzji w localStorage.
        if (!getConsent()) {
            // Mała zwłoka — daj stronie się załadować zanim wystrzeli banner.
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
    }, []);

    useEffect(() => {
        // Reopen z dowolnego miejsca przez Footer link itp.
        const open = () => {
            const c = getConsent();
            if (c) {
                setAnalytics(c.analytics);
                setRecordings(c.recordings);
            }
            setVisible(true);
        };
        window.addEventListener('workshift:consent-open', open);
        return () => window.removeEventListener('workshift:consent-open', open);
    }, []);

    const acceptAll = () => {
        setConsent({ analytics: true, recordings: true });
        setVisible(false);
    };
    const rejectAll = () => {
        setConsent({ analytics: false, recordings: false });
        setVisible(false);
    };
    const saveCustom = () => {
        setConsent({ analytics, recordings });
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 60, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="
                        fixed z-[10000] pointer-events-none
                        bottom-3 left-3 right-3
                        md:left-5 md:right-auto md:bottom-5 md:max-w-[420px]
                    "
                    role="dialog"
                    aria-label="Ustawienia cookies"
                >
                    <div className="pointer-events-auto bg-white border border-black/10 rounded-[12px] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.22),0_6px_14px_-8px_rgba(0,0,0,0.12)] overflow-hidden">

                        {/* Header bar — kategoria visual */}
                        <div className="px-4 pt-3.5 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-dark">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                                Cookies
                            </span>
                            <button
                                onClick={rejectAll}
                                aria-label="Zamknij i odrzuć wszystko"
                                className="p-1 rounded-md text-muted-dark hover:text-black hover:bg-black/5 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-4 pt-2 pb-3">
                            <h2 className="text-base font-display tracking-tight text-black mb-1.5 leading-tight">
                                Krótko o cookies
                            </h2>
                            <p className="text-[13px] text-muted-dark leading-snug mb-2">
                                Zliczamy anonimowe statystyki, żeby wiedzieć co na stronie działa. <span className="text-black">Nie sprzedajemy</span> Twoich danych ani <span className="text-black">nie targetujemy</span> reklam.
                            </p>
                            <p className="text-[12px] text-muted-dark/80 leading-snug">
                                Więcej w{' '}
                                <Link to="/polityka-prywatnosci" className="text-black underline underline-offset-2 decoration-lime hover:decoration-2">
                                    polityce prywatności
                                </Link>.
                            </p>

                            {/* Granular settings (collapsible) */}
                            <AnimatePresence initial={false}>
                                {expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.22 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 pt-3 border-t border-black/5 space-y-2.5">
                                            <ConsentToggle
                                                label="Niezbędne"
                                                desc="Zapamiętanie Twojej decyzji."
                                                checked={true}
                                                disabled
                                            />
                                            <ConsentToggle
                                                label="Statystyki"
                                                desc="Vercel + Google Analytics + PostHog — anonimowe wizyty, lejki konwersji i testy A/B."
                                                checked={analytics}
                                                onChange={setAnalytics}
                                            />
                                            <ConsentToggle
                                                label="Nagrania sesji"
                                                desc="Clarity + PostHog — heatmapy, nagrania i debug UX."
                                                checked={recordings}
                                                onChange={setRecordings}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="px-4 py-3 bg-sage/40 border-t border-black/5">
                            {expanded ? (
                                <div className="flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => setExpanded(false)}
                                        className="text-xs text-muted-dark hover:text-black transition-colors"
                                    >
                                        ← Wróć
                                    </button>
                                    <Button
                                        onClick={saveCustom}
                                        variant="accent"
                                        className="h-9 px-4 text-xs"
                                    >
                                        Zapisz wybór
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={acceptAll}
                                        variant="accent"
                                        className="h-9 px-4 text-xs flex-1"
                                    >
                                        <Check size={13} className="mr-1" />
                                        Zgoda
                                    </Button>
                                    <Button
                                        onClick={rejectAll}
                                        variant="outline"
                                        className="h-9 px-4 text-xs flex-1 border-black/15 hover:border-black/30"
                                    >
                                        Tylko niezbędne
                                    </Button>
                                    <button
                                        onClick={() => setExpanded(true)}
                                        className="h-9 px-2 text-xs text-muted-dark hover:text-black transition-colors flex items-center gap-0.5 shrink-0"
                                        aria-label="Wybierz co"
                                    >
                                        <ChevronDown size={13} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ConsentToggle({ label, desc, checked, onChange, disabled = false }) {
    return (
        <label className={`flex items-start gap-3 ${disabled ? 'opacity-60' : 'cursor-pointer group'}`}>
            <span className="relative inline-flex items-center mt-0.5 shrink-0">
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onChange?.(e.target.checked)}
                    className="sr-only peer"
                />
                <span className="w-9 h-5 rounded-full bg-black/15 peer-checked:bg-lime transition-colors" />
                <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
            </span>
            <span className="flex-1">
                <span className="block text-sm font-medium text-black leading-tight">{label}</span>
                <span className="block text-xs text-muted-dark mt-0.5 leading-snug">{desc}</span>
            </span>
        </label>
    );
}
