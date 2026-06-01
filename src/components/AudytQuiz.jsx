import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MessageCircle, Mail, CheckCircle, Loader2, RotateCcw } from 'lucide-react';
import { track, EVENTS } from '../lib/analytics';
import { trackPixel } from '../lib/consent';
import {
    BRANZE,
    WIELKOSC,
    QUESTIONS,
    TOTAL_QUESTIONS,
    MAX_SCORE,
    computeScore,
    getTier,
    getTopRecommendations,
    TIERS,
} from '../data/audytQuestions';

const PHONE_HUMAN = '+48 796 186 067';
const PHONE_TEL = 'tel:+48796186067';
const WHATSAPP_URL =
    'https://wa.me/48796186067?text=' +
    encodeURIComponent('Cześć Kuba, zrobiłem mikro-audyt AI i chcę porozmawiać o wyniku.');

const CONTEXT_STEPS = 2; // 0 = branża, 1 = wielkość
const RESULT_STEP = CONTEXT_STEPS + TOTAL_QUESTIONS; // 14

// Wspólna „karta" kroku - tytuł + opcjonalny podtytuł + opcje.
function OptionTile({ selected, onClick, disabled, children }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all disabled:cursor-default ${
                selected
                    ? 'border-lime bg-lime/15 shadow-sm'
                    : 'border-black/10 bg-white/60 hover:border-black/30 hover:bg-white'
            }`}
        >
            {children}
        </button>
    );
}

export function AudytQuiz() {
    const [step, setStep] = useState(0);
    const [branza, setBranza] = useState(null);
    const [wielkosc, setWielkosc] = useState(null);
    const [answers, setAnswers] = useState({}); // qId -> optionIndex
    const [transitioning, setTransitioning] = useState(false);
    const startedRef = useRef(false);
    const timerRef = useRef(null);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const advance = (to) => {
        setTransitioning(true);
        timerRef.current = setTimeout(() => {
            setStep(to);
            setTransitioning(false);
        }, 200);
    };

    const trackStart = () => {
        if (!startedRef.current) {
            startedRef.current = true;
            track(EVENTS.AUDIT_START, { source: 'quiz' });
        }
    };

    const pickBranza = (id) => {
        if (transitioning) return;
        trackStart();
        setBranza(id);
        advance(1);
    };

    const pickWielkosc = (id) => {
        if (transitioning) return;
        setWielkosc(id);
        advance(2);
    };

    const pickAnswer = (q, optionIndex) => {
        if (transitioning) return;
        setAnswers((a) => ({ ...a, [q.id]: optionIndex }));
        track(EVENTS.AUDIT_QUESTION_ANSWERED, {
            qId: q.id,
            section: q.sectionId,
            points: q.options[optionIndex].p,
        });
        advance(step + 1);
    };

    const goBack = () => {
        if (transitioning || step === 0) return;
        setStep((s) => Math.max(0, s - 1));
    };

    // Track ukończenia raz, przy wejściu na ekran wyniku.
    const score = computeScore(answers);
    const tier = getTier(score);
    useEffect(() => {
        if (step === RESULT_STEP) {
            track(EVENTS.AUDIT_COMPLETE, { score, tier, branza: branza || 'n/a' });
            trackPixel('CompleteRegistration', { content_name: 'mikro-audyt-ai', status: tier });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    // ── Progress ────────────────────────────────────────────────────────────
    const isQuestion = step >= CONTEXT_STEPS && step < RESULT_STEP;
    const questionNumber = isQuestion ? step - CONTEXT_STEPS + 1 : 0;
    const progressPct = Math.min(100, Math.round((step / RESULT_STEP) * 100));

    return (
        <div className="relative z-10 max-w-2xl mx-auto">
            {/* Progress bar (ukryty na ekranie wyniku) */}
            {step < RESULT_STEP && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={goBack}
                            disabled={step === 0}
                            className="inline-flex items-center gap-1.5 text-sm text-muted-dark hover:text-black transition-colors disabled:opacity-0"
                        >
                            <ArrowLeft size={14} />
                            Wstecz
                        </button>
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-dark">
                            {isQuestion ? `Pytanie ${questionNumber} / ${TOTAL_QUESTIONS}` : 'Kontekst'}
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-lime rounded-full"
                            initial={false}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* ── Ekran 0: branża ── */}
                    {step === 0 && (
                        <div>
                            <h3 className="text-2xl md:text-3xl font-display tracking-tight text-black mb-2">
                                Jaka jest Twoja branża?
                            </h3>
                            <p className="text-muted-dark mb-6">Dobierzemy rekomendacje pod Twój kontekst.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {BRANZE.map((b) => (
                                    <OptionTile
                                        key={b.id}
                                        selected={branza === b.id}
                                        disabled={transitioning}
                                        onClick={() => pickBranza(b.id)}
                                    >
                                        <span className="text-2xl">{b.emoji}</span>
                                        <span className="text-sm md:text-base font-medium text-black">{b.label}</span>
                                    </OptionTile>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Ekran 1: wielkość ── */}
                    {step === 1 && (
                        <div>
                            <h3 className="text-2xl md:text-3xl font-display tracking-tight text-black mb-2">
                                Ile osób liczy Twój zespół?
                            </h3>
                            <p className="text-muted-dark mb-6">Cała firma - łącznie z Tobą.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {WIELKOSC.map((w) => (
                                    <OptionTile
                                        key={w.id}
                                        selected={wielkosc === w.id}
                                        disabled={transitioning}
                                        onClick={() => pickWielkosc(w.id)}
                                    >
                                        <span className="text-sm md:text-base font-medium text-black">{w.label}</span>
                                    </OptionTile>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Pytania 1-12 ── */}
                    {isQuestion && (() => {
                        const q = QUESTIONS[step - CONTEXT_STEPS];
                        return (
                            <div>
                                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-4">
                                    {q.sectionEmoji} {q.sectionTitle}
                                </span>
                                <h3 className="text-xl md:text-2xl font-display tracking-tight text-black mb-6 text-balance">
                                    {q.text}
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {q.options.map((opt, i) => (
                                        <OptionTile
                                            key={i}
                                            selected={answers[q.id] === i}
                                            disabled={transitioning}
                                            onClick={() => pickAnswer(q, i)}
                                        >
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full border border-black/20 flex items-center justify-center text-xs font-mono text-muted-dark">
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                            <span className="text-sm md:text-base text-black">{opt.label}</span>
                                        </OptionTile>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}

                    {/* ── Wynik ── */}
                    {step === RESULT_STEP && (
                        <ResultScreen
                            score={score}
                            tier={tier}
                            branza={branza}
                            wielkosc={wielkosc}
                            answers={answers}
                            onRestart={() => {
                                setAnswers({});
                                setBranza(null);
                                setWielkosc(null);
                                startedRef.current = false;
                                setStep(0);
                            }}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ── Ekran wyniku ────────────────────────────────────────────────────────────
function ResultScreen({ score, tier, branza, wielkosc, answers, onRestart }) {
    const tierData = TIERS[tier];
    const recs = getTopRecommendations(answers, branza);
    const [email, setEmail] = useState('');
    const [state, setState] = useState('idle'); // idle | loading | done | error
    const [errorMsg, setErrorMsg] = useState('');

    const ringColor =
        tier === 'red' ? 'text-red-500' : tier === 'yellow' ? 'text-amber-500' : 'text-lime';

    async function submit(mode) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setState('error');
            setErrorMsg('Podaj poprawny adres e-mail.');
            return;
        }
        setState('loading');
        setErrorMsg('');
        const evt =
            tier === 'red' ? EVENTS.AUDIT_CTA_HOT : tier === 'yellow' ? EVENTS.AUDIT_CTA_WARM : EVENTS.AUDIT_CTA_COLD;
        track(evt, { channel: 'email', mode, score });
        try {
            const r = await fetch('/api/audyt-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), branza, wielkosc, score, tier, mode, recommendations: recs }),
            });
            if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'send failed');
            setState('done');
            trackPixel('Lead', { content_name: 'audyt-' + mode });
        } catch {
            setState('error');
            setErrorMsg('Nie udało się wysłać. Spróbuj ponownie lub zadzwoń: ' + PHONE_HUMAN + '.');
        }
    }

    const emailForm = (label, mode) => (
        <div>
            {state === 'done' ? (
                <div className="flex items-center gap-2 text-black bg-lime/20 border border-lime rounded-xl px-4 py-3">
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">Wysłane! Sprawdź skrzynkę (i folder spam, gdyby co).</span>
                </div>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit(mode);
                    }}
                    className="flex flex-col sm:flex-row gap-2"
                >
                    <div className="relative flex-1">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="twoj@email.pl"
                            className="w-full pl-9 pr-3 py-3 rounded-xl border border-black/15 bg-white text-black placeholder:text-muted-dark/60 focus:border-lime focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={state === 'loading'}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/85 transition-colors disabled:opacity-60"
                    >
                        {state === 'loading' ? <Loader2 size={16} className="animate-spin" /> : label}
                    </button>
                </form>
            )}
            {state === 'error' && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
        </div>
    );

    const callButtons = (size = 'lg') => (
        <div className="flex flex-col sm:flex-row gap-3">
            <a
                href={PHONE_TEL}
                onClick={() => { track(EVENTS.AUDIT_CTA_HOT, { channel: 'tel', source: 'result', score }); trackPixel('Contact', { content_name: 'audyt-tel' }); }}
                className={`inline-flex items-center justify-center gap-2 ${
                    size === 'lg' ? 'px-6 py-3.5' : 'px-5 py-3 text-sm'
                } bg-black text-white rounded-full font-medium hover:bg-black/85 transition-colors`}
            >
                <Phone size={size === 'lg' ? 18 : 16} />
                {PHONE_HUMAN}
            </a>
            <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { track(EVENTS.AUDIT_CTA_HOT, { channel: 'whatsapp', source: 'result', score }); trackPixel('Contact', { content_name: 'audyt-whatsapp' }); }}
                className={`inline-flex items-center justify-center gap-2 ${
                    size === 'lg' ? 'px-6 py-3.5' : 'px-5 py-3 text-sm'
                } bg-lime text-black rounded-full font-medium hover:opacity-90 transition-opacity`}
            >
                <MessageCircle size={size === 'lg' ? 18 : 16} />
                WhatsApp
            </a>
        </div>
    );

    return (
        <div className="rounded-2xl bg-white/70 backdrop-blur border border-black/10 p-6 md:p-10">
            {/* Wynik liczbowy */}
            <div className="text-center mb-8">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dark">
                    Twój wynik
                </span>
                <div className={`mt-2 text-6xl md:text-7xl font-display tracking-tight ${ringColor}`}>
                    {score}
                    <span className="text-2xl md:text-3xl text-muted-dark">/{MAX_SCORE}</span>
                </div>
                <p className="mt-3 text-lg font-display text-black">
                    {tierData.emoji} {tierData.headline}
                </p>
            </div>

            {/* Interpretacja */}
            <p className="text-muted-dark leading-relaxed mb-8 text-center max-w-xl mx-auto">
                {tierData.body}
            </p>

            {/* Rekomendacje - zawsze widoczne, bez gatingu */}
            <div className="mb-8">
                <h4 className="text-sm font-mono uppercase tracking-wider text-black mb-4">
                    3 rekomendacje dla Ciebie
                </h4>
                <ul className="space-y-3">
                    {recs.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-sage/60 border border-black/5">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-lime text-black text-xs font-bold flex items-center justify-center mt-0.5">
                                {i + 1}
                            </span>
                            <span className="text-sm text-black leading-relaxed">{r}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA per próg */}
            <div className="border-t border-black/10 pt-8">
                {tier === 'red' && (
                    <div>
                        <h4 className="text-lg font-display text-black mb-1">Pogadajmy konkretnie.</h4>
                        <p className="text-sm text-muted-dark mb-4">
                            Przy tym wyniku audyt zwraca się zwykle w pierwszym wdrożeniu. Oddzwonię w ciągu 2h roboczych.
                        </p>
                        {callButtons('lg')}
                        <p className="text-xs text-muted-dark mt-4 mb-2">Albo wyślij sobie wynik na mail:</p>
                        {emailForm('Wyślij wynik', 'result-red')}
                    </div>
                )}

                {tier === 'yellow' && (
                    <div>
                        <h4 className="text-lg font-display text-black mb-1">Chcesz to rozpisane?</h4>
                        <p className="text-sm text-muted-dark mb-4">
                            Wyślę Ci imienny raport: te 3 rekomendacje rozpisane na konkretny plan dla branży{' '}
                            <strong>{BRANZE.find((b) => b.id === branza)?.label || 'Twojej firmy'}</strong> - kolejność, narzędzia, ROI.
                        </p>
                        {emailForm('Wyślij raport', 'report-yellow')}
                        <p className="text-xs text-muted-dark mt-5 mb-2">Wolisz od razu porozmawiać?</p>
                        {callButtons('sm')}
                    </div>
                )}

                {tier === 'green' && (
                    <div>
                        <h4 className="text-lg font-display text-black mb-1">Trzymaj rękę na pulsie.</h4>
                        <p className="text-sm text-muted-dark mb-4">
                            Masz to nieźle poukładane. Wyślę Ci wynik na mail - a jeśli chcesz, raz w tygodniu 1 praktyczny use-case AI z newslettera „AI Praktycznie".
                        </p>
                        {emailForm('Wyślij wynik', 'result-green')}
                    </div>
                )}
            </div>

            {/* Restart */}
            <div className="text-center mt-8">
                <button
                    onClick={onRestart}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-dark hover:text-black transition-colors"
                >
                    <RotateCcw size={12} />
                    Zrób audyt jeszcze raz
                </button>
            </div>
        </div>
    );
}
