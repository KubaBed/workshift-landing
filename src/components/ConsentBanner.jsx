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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[10000] pointer-events-none"
                    role="dialog"
                    aria-label="Ustawienia cookies"
                >
                    <div className="max-w-[820px] mx-auto pointer-events-auto bg-white border border-black/10 rounded-[14px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25),0_8px_20px_-10px_rgba(0,0,0,0.15)] overflow-hidden">

                        {/* Header bar — kategoria visual */}
                        <div className="px-5 md:px-7 pt-5 md:pt-6 flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-dark">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                                Cookies & dane
                            </span>
                            <button
                                onClick={rejectAll}
                                aria-label="Zamknij i odrzuć wszystko"
                                className="p-1.5 rounded-md text-muted-dark hover:text-black hover:bg-black/5 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-5 md:px-7 py-4">
                            <h2 className="text-xl md:text-2xl font-display tracking-tight text-black mb-3 leading-tight">
                                Cookies i takie tam
                            </h2>
                            <p className="text-sm md:text-[15px] text-muted-dark leading-relaxed mb-4 max-w-[640px]">
                                Używamy cookies, żeby zobaczyć jak ludzie korzystają z tej strony — gdzie klikają, co działa, co jest do poprawki. Bez tego latamy ślepo.
                            </p>
                            <p className="text-sm md:text-[15px] text-muted-dark leading-relaxed mb-2 max-w-[640px]">
                                Dwie rzeczy, których <span className="font-medium text-black">NIE</span> robimy:
                            </p>
                            <ul className="text-sm md:text-[15px] text-muted-dark leading-relaxed mb-5 max-w-[640px] space-y-1">
                                <li>— nie sprzedajemy Twoich danych</li>
                                <li>— nie targetujemy Cię reklamami w internecie</li>
                            </ul>
                            <p className="text-xs md:text-sm text-muted-dark/80">
                                Cała polityka jest{' '}
                                <Link to="/polityka-prywatnosci" className="text-black underline underline-offset-2 decoration-lime hover:decoration-2">
                                    tutaj
                                </Link>
                                {' '}— jeśli lubisz długie czytanki.
                            </p>

                            {/* Granular settings (collapsible) */}
                            <AnimatePresence initial={false}>
                                {expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-5 pt-5 border-t border-black/5 space-y-3">
                                            <ConsentToggle
                                                label="Niezbędne"
                                                desc="Zapamiętanie Twojej decyzji o cookies. Bez nich banner pokazałby się znowu po odświeżeniu."
                                                checked={true}
                                                disabled
                                            />
                                            <ConsentToggle
                                                label="Statystyki anonimowe"
                                                desc="Vercel Analytics + Google Analytics. Liczymy odwiedziny i konwersje, bez identyfikacji osoby."
                                                checked={analytics}
                                                onChange={setAnalytics}
                                            />
                                            <ConsentToggle
                                                label="Nagrania sesji (Microsoft Clarity)"
                                                desc="Heatmapy + odtwarzanie kliknięć. Pomaga znaleźć miejsca, gdzie userzy się gubią. Anonimowe — bez maskowania pól tekstowych."
                                                checked={recordings}
                                                onChange={setRecordings}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="px-5 md:px-7 py-4 bg-sage/40 border-t border-black/5">
                            {expanded ? (
                                <div className="flex flex-col-reverse sm:flex-row gap-3 items-stretch sm:items-center sm:justify-between">
                                    <button
                                        onClick={() => setExpanded(false)}
                                        className="text-sm text-muted-dark hover:text-black transition-colors text-center sm:text-left"
                                    >
                                        ← Wróć
                                    </button>
                                    <Button
                                        onClick={saveCustom}
                                        variant="accent"
                                        className="h-11 px-6 text-sm"
                                    >
                                        Zapisz wybór
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={acceptAll}
                                        variant="accent"
                                        className="h-11 px-6 text-sm flex-1 sm:flex-initial"
                                    >
                                        <Check size={15} className="mr-1.5" />
                                        Zgoda
                                    </Button>
                                    <Button
                                        onClick={rejectAll}
                                        variant="outline"
                                        className="h-11 px-6 text-sm flex-1 sm:flex-initial border-black/15 hover:border-black/30"
                                    >
                                        Tylko niezbędne
                                    </Button>
                                    <button
                                        onClick={() => setExpanded(true)}
                                        className="h-11 px-3 text-sm text-muted-dark hover:text-black transition-colors flex items-center justify-center gap-1 ml-auto"
                                    >
                                        Wybierz co
                                        <ChevronDown size={14} />
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
