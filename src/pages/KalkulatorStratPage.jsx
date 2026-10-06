import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, ArrowRight, Calculator, CheckCircle, Loader2, Mail, Sparkles } from 'lucide-react';
import { track, EVENTS } from '../lib/analytics';
import { trackPixel, hasConsent } from '../lib/consent';
import {
    BRANZE,
    ZESPOLY,
    KOSZTY,
    REKOMENDACJE,
    RECOVERY_RATE,
    computeKalkulator,
    kalkulatorAssumptions,
} from '../data/kalkulator';

const STEPS = ['branza', 'zespol', 'godziny', 'raporty', 'koszt', 'wynik'];

// Zgoda RODO na wysyłkę wyniku - ten sam wzorzec co w AudytQuiz.jsx: treść
// zgody idzie też w payloadzie do /api/kalkulator-submit (ślad audytowy).
// CONSENT_TEXT musi odpowiadać tekstowi labelki w formularzu.
const CONSENT_POLICY_URL = '/polityka-prywatnosci';
const CONSENT_TEXT =
    'Zgadzam się na przetwarzanie moich danych osobowych w celu wysłania wyniku na e-mail, zgodnie z polityką prywatności.';

// Atrybucja (fbclid + utm_*) do maila notyfikacji - jak w AudytQuiz.jsx.
function getTrackingParams() {
    if (typeof window === 'undefined') return {};
    const p = new URLSearchParams(window.location.search);
    const out = {};
    for (const k of ['fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
        const v = p.get(k);
        if (v) out[k] = v.slice(0, 200);
    }
    return out;
}

export default function KalkulatorStratPage() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        branza: null,
        zespol: null,
        godzinyTyg: 8,
        dniRaportow: 4,
        kosztH: 100,
    });
    const [email, setEmail] = useState('');

    // Meta tej trasy ustawia <RouteMeta /> w App.jsx (źródło: STATIC_ROUTE_META).
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Obliczenia - wzór w src/data/kalkulator.js (ten sam liczy mail z wynikiem).
    // Dni raportów dotyczą całego zespołu, więc nie są mnożone przez liczbę osób.
    const {
        osoby: wielkoscZespolu,
        godzinyMies,
        kosztMies,
        kosztRok,
        odzyskMies,
        odzyskKwoteMies,
        odzyskKwoteRok,
    } = computeKalkulator(data);

    const goNext = () => {
        track(EVENTS.CALCULATOR_STEP, { step: STEPS[step], next: STEPS[step + 1] });
        setStep(s => Math.min(s + 1, STEPS.length - 1));
    };
    const goPrev = () => setStep(s => Math.max(s - 1, 0));

    // Track wynik raz przy wejściu do step 5 (wynik).
    useEffect(() => {
        if (step === 5) {
            track(EVENTS.CALCULATOR_COMPLETE, {
                branza: data.branza,
                zespol: wielkoscZespolu,
                godzinyTyg: data.godzinyTyg,
                kosztH: data.kosztH,
                stratyMiesPLN: kosztMies,
                stratyRokPLN: kosztRok,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [step]);

    const formatPLN = (n) => new Intl.NumberFormat('pl-PL').format(n) + ' PLN';

    const canProceed = () => {
        if (step === 0) return data.branza !== null;
        if (step === 1) return data.zespol !== null;
        if (step === 2) return data.godzinyTyg > 0;
        if (step === 3) return data.dniRaportow >= 0;
        if (step === 4) return data.kosztH > 0;
        return true;
    };

    return (
        <main className="min-h-screen bg-sage flex flex-col items-center justify-start px-4 py-16 md:py-24 relative overflow-hidden">
            {/* Background blur orbs */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lime/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-black/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-3xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8 flex items-center justify-between"
                >
                    <Link to="/" className="flex items-center gap-2 text-muted-dark hover:text-black transition-colors">
                        <ArrowLeft size={16} />
                        <span className="text-sm font-mono uppercase tracking-wider">Workshift</span>
                    </Link>
                    {step < 5 && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-dark uppercase tracking-wider">
                                Krok {step + 1} / 5
                            </span>
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-lime' : 'bg-black/10'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Tytuł sekcji */}
                {step < 5 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10 text-center"
                    >
                        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-4">
                            <Calculator size={12} />
                            Bezpłatny kalkulator
                        </span>
                        <h1 className="text-3xl md:text-5xl font-display tracking-tight text-black leading-tight">
                            Ile traci Twoja firma <br />
                            <span className="text-muted-dark">na powtarzalnych zadaniach?</span>
                        </h1>
                        <p className="mt-4 text-base md:text-lg text-muted-dark max-w-xl mx-auto">
                            Odpowiedz na 5 pytań. W 60 sekund zobaczysz szacunek kosztu powtarzalnej pracy i 3 procesy, od których warto zacząć.
                        </p>
                    </motion.div>
                )}

                {/* Karty kroków */}
                <div>
                    {step === 0 && (
                        <StepCard key="branza" title="Jaka jest Twoja branża?" subtitle="Dobierzemy rekomendacje pod Twój kontekst.">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {BRANZE.map(b => (
                                    <button
                                        key={b.id}
                                        onClick={() => setData({ ...data, branza: b.id })}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                                            data.branza === b.id
                                                ? 'border-lime bg-lime/10 shadow-sm'
                                                : 'border-black/10 bg-white/40 hover:border-black/30'
                                        }`}
                                    >
                                        <span className="text-2xl">{b.emoji}</span>
                                        <span className="text-sm md:text-base font-medium text-black">{b.label}</span>
                                    </button>
                                ))}
                            </div>
                        </StepCard>
                    )}

                    {step === 1 && (
                        <StepCard key="zespol" title="Ile osób jest w Twoim zespole?" subtitle="Cała firma - łącznie z Tobą.">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {ZESPOLY.map(z => (
                                    <button
                                        key={z.id}
                                        onClick={() => setData({ ...data, zespol: z.id })}
                                        className={`p-4 rounded-xl border transition-all text-left ${
                                            data.zespol === z.id
                                                ? 'border-lime bg-lime/10 shadow-sm'
                                                : 'border-black/10 bg-white/40 hover:border-black/30'
                                        }`}
                                    >
                                        <span className="text-base md:text-lg font-medium text-black">{z.label}</span>
                                    </button>
                                ))}
                            </div>
                        </StepCard>
                    )}

                    {step === 2 && (
                        <StepCard
                            key="godziny"
                            title="Ile godzin tygodniowo (na osobę) zespół spędza na powtarzalnych zadaniach?"
                            subtitle="Przepisywanie danych, kopiowanie między systemami, ręczne raporty, kategoryzacja maili. Średnio."
                        >
                            <SliderInput
                                value={data.godzinyTyg}
                                onChange={v => setData({ ...data, godzinyTyg: v })}
                                min={1}
                                max={30}
                                step={1}
                                unit="h / tydzień / osobę"
                                hint="Średnia w polskich MŚP: 8-15h/tydz/osobę"
                            />
                        </StepCard>
                    )}

                    {step === 3 && (
                        <StepCard
                            key="raporty"
                            title="Ile dni miesięcznie zespół spędza na raportach i analizach?"
                            subtitle="Comiesięczne zestawienia, prezentacje, dashboardy. Łącznie cały zespół."
                        >
                            <SliderInput
                                value={data.dniRaportow}
                                onChange={v => setData({ ...data, dniRaportow: v })}
                                min={0}
                                max={20}
                                step={1}
                                unit="dni / miesiąc (cały zespół)"
                                hint="Średnia w MŚP: 3-8 dni/mies na raporty"
                            />
                        </StepCard>
                    )}

                    {step === 4 && (
                        <StepCard
                            key="koszt"
                            title="Jaki jest średni koszt godziny pracy w Twojej firmie?"
                            subtitle="Pełny koszt pracodawcy za godzinę: wynagrodzenie brutto i składki. Wystarczy przybliżenie."
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {KOSZTY.map(k => (
                                    <button
                                        key={k.value}
                                        onClick={() => setData({ ...data, kosztH: k.value })}
                                        className={`p-4 rounded-xl border transition-all text-left ${
                                            data.kosztH === k.value
                                                ? 'border-lime bg-lime/10 shadow-sm'
                                                : 'border-black/10 bg-white/40 hover:border-black/30'
                                        }`}
                                    >
                                        <div className="text-base md:text-lg font-medium text-black">{k.label}</div>
                                        <div className="text-xs text-muted-dark mt-1">{k.hint}</div>
                                    </button>
                                ))}
                            </div>
                        </StepCard>
                    )}

                    {step === 5 && (
                        <ResultCard
                            key="wynik"
                            data={data}
                            godzinyMies={godzinyMies}
                            kosztMies={kosztMies}
                            kosztRok={kosztRok}
                            odzyskMies={odzyskMies}
                            odzyskKwoteMies={odzyskKwoteMies}
                            odzyskKwoteRok={odzyskKwoteRok}
                            formatPLN={formatPLN}
                            email={email}
                            setEmail={setEmail}
                        />
                    )}
                </div>

                {/* Nawigacja */}
                {step < 5 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-8 flex items-center justify-between"
                    >
                        {step > 0 ? (
                            <button
                                onClick={goPrev}
                                className="flex items-center gap-2 text-sm font-mono text-muted-dark hover:text-black transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Wstecz
                            </button>
                        ) : (
                            <div />
                        )}
                        <Button
                            variant="accent"
                            size="lg"
                            disabled={!canProceed()}
                            onClick={goNext}
                            className="h-12 px-6 flex items-center gap-2"
                        >
                            {step === 4 ? 'Pokaż wynik' : 'Dalej'}
                            <ArrowRight size={16} />
                        </Button>
                    </motion.div>
                )}
            </div>
        </main>
    );
}

function StepCard({ title, subtitle, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/60 backdrop-blur rounded-2xl p-6 md:p-10 border border-black/5 shadow-sm"
        >
            <h2 className="text-xl md:text-2xl font-display text-black mb-2 leading-tight">{title}</h2>
            {subtitle && <p className="text-sm md:text-base text-muted-dark mb-6">{subtitle}</p>}
            {children}
        </motion.div>
    );
}

function SliderInput({ value, onChange, min, max, step, unit, hint }) {
    return (
        <div>
            <div className="flex items-baseline justify-between mb-4">
                <div className="text-5xl md:text-6xl font-display text-black">{value}</div>
                <div className="text-sm font-mono text-muted-dark uppercase tracking-wider">{unit}</div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="w-full h-2 bg-black/10 rounded-full appearance-none cursor-pointer accent-lime"
                style={{
                    background: `linear-gradient(to right, var(--color-lime, #c5ff00) 0%, var(--color-lime, #c5ff00) ${((value - min) / (max - min)) * 100}%, rgba(0,0,0,0.1) ${((value - min) / (max - min)) * 100}%, rgba(0,0,0,0.1) 100%)`,
                }}
            />
            <div className="flex items-center justify-between mt-2 text-xs font-mono text-muted-dark">
                <span>{min}</span>
                <span>{max}</span>
            </div>
            {hint && <p className="text-xs text-muted-dark mt-4 italic">💡 {hint}</p>}
        </div>
    );
}

function ResultCard({
    data, godzinyMies, kosztMies, kosztRok,
    odzyskMies, odzyskKwoteMies, odzyskKwoteRok,
    formatPLN, email, setEmail,
}) {
    const rekomendacje = REKOMENDACJE[data.branza] || REKOMENDACJE.inne;
    const assumptions = kalkulatorAssumptions(data.zespol);
    const recoveryPct = Math.round(RECOVERY_RATE * 100);
    const [sendState, setSendState] = useState('idle'); // idle | loading | done | error
    const [errorMsg, setErrorMsg] = useState('');
    const [privacyAccepted, setPrivacyAccepted] = useState(false);

    const handleContactClick = () => {
        track(EVENTS.CALCULATOR_CTA_CLICK, { cta: 'contact_form', branza: data.branza, kosztRok });
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setSendState('error');
            setErrorMsg('Podaj poprawny adres e-mail.');
            return;
        }
        if (!privacyAccepted) {
            setSendState('error');
            setErrorMsg('Zaznacz zgodę na przetwarzanie danych osobowych, aby wysłać wynik.');
            return;
        }
        setSendState('loading');
        setErrorMsg('');
        track(EVENTS.CALCULATOR_CTA_CLICK, { cta: 'email_submit', branza: data.branza, kosztRok });
        // Wspólny event_id dla pixela (klient) i CAPI (serwer) → Meta deduplikuje Lead.
        const leadEventId =
            typeof crypto !== 'undefined' && crypto.randomUUID
                ? crypto.randomUUID()
                : 'lead-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        try {
            const r = await fetch('/api/kalkulator-submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    branza: data.branza,
                    zespol: data.zespol,
                    godzinyTyg: data.godzinyTyg,
                    dniRaportow: data.dniRaportow,
                    kosztH: data.kosztH,
                    // Wynik policzony na froncie - serwer liczy go ponownie tym samym wzorem.
                    wynik: { godzinyMies: Math.round(godzinyMies), kosztMies, kosztRok, odzyskMies, odzyskKwoteMies, odzyskKwoteRok },
                    tracking: getTrackingParams(),
                    consent: true, consentText: CONSENT_TEXT, consentPolicyUrl: CONSENT_POLICY_URL,
                    // CAPI: serwer odpali Lead server-side TYLKO gdy jest zgoda marketingowa.
                    leadEventId, marketingConsent: hasConsent('marketing'),
                }),
            });
            if (!r.ok) throw new Error('send failed');
            setSendState('done');
            trackPixel('Lead', { content_name: 'kalkulator' }, { eventId: leadEventId });
        } catch {
            setSendState('error');
            setErrorMsg('Nie udało się wysłać wyniku. Spróbuj ponownie albo napisz na kontakt@workshift.pl.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            {/* Hero wyniku */}
            <div className="text-center mb-2">
                <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-4">
                    <Sparkles size={12} />
                    Twój wynik
                </span>
                <h1 className="text-3xl md:text-5xl font-display text-black leading-tight">
                    Szacunek: ok. <br />
                    <span className="text-lime-dark" style={{ color: '#7a9900' }}>{Math.round(godzinyMies)}h miesięcznie</span>
                </h1>
                <p className="mt-3 text-base md:text-lg text-muted-dark">
                    na powtarzalnych zadaniach. To ok. <strong className="text-black">{formatPLN(kosztMies)}</strong> miesięcznie (<strong className="text-black">{formatPLN(kosztRok)}</strong> rocznie) kosztu pracy przy podanej stawce.
                </p>
            </div>

            {/* Dwie kolumny: straty / odzysk */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur rounded-2xl p-6 border border-black/5">
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-dark mb-2">Aktualny koszt</div>
                    <div className="text-2xl md:text-3xl font-display text-black mb-1">{formatPLN(kosztMies)}</div>
                    <div className="text-sm text-muted-dark">miesięcznie</div>
                    <div className="mt-3 pt-3 border-t border-black/5">
                        <div className="text-xl font-display text-black">{formatPLN(kosztRok)}</div>
                        <div className="text-sm text-muted-dark">rocznie</div>
                    </div>
                </div>

                <div className="bg-lime/10 backdrop-blur rounded-2xl p-6 border border-lime/30">
                    <div className="text-xs font-mono uppercase tracking-wider text-black/70 mb-2">Do odzyskania przy założeniu {recoveryPct}%</div>
                    <div className="text-2xl md:text-3xl font-display text-black mb-1">{formatPLN(odzyskKwoteMies)}</div>
                    <div className="text-sm text-black/70">miesięcznie ({odzyskMies}h)</div>
                    <div className="mt-3 pt-3 border-t border-lime/30">
                        <div className="text-xl font-display text-black">{formatPLN(odzyskKwoteRok)}</div>
                        <div className="text-sm text-black/70">rocznie</div>
                    </div>
                </div>
            </div>

            {/* Założenia wyliczenia - nazwane wprost (te same idą w mailu z wynikiem) */}
            <div className="text-sm text-muted-dark">
                <p className="font-mono text-xs uppercase tracking-wider text-black/70 mb-2">Jak liczymy</p>
                <ul className="space-y-1 list-disc pl-5">
                    {assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                    ))}
                </ul>
                <p className="mt-2">{recoveryPct}% to założenie kalkulatora. Realny wynik policzymy na Twoich procesach.</p>
            </div>

            {/* Rekomendacje */}
            <div className="bg-white/60 backdrop-blur rounded-2xl p-6 md:p-8 border border-black/5">
                <h2 className="text-xl md:text-2xl font-display text-black mb-1">3 procesy do sprawdzenia w Twojej branży</h2>
                <p className="text-sm text-muted-dark mb-6">Dobrane na podstawie branży i typowych wzorców.</p>
                <ul className="space-y-3">
                    {rekomendacje.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-lime shrink-0 mt-0.5" />
                            <span className="text-base text-black">{rec}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CTA primary */}
            <div className="bg-black rounded-2xl p-6 md:p-10 text-white text-center">
                <h2 className="text-2xl md:text-3xl font-display mb-3">Sprawdźmy, które z tych godzin da się odzyskać w Twojej firmie</h2>
                <p className="text-base md:text-lg text-white/70 mb-6 max-w-xl mx-auto">
                    Napisz kilka zdań o swoich procesach, a zaproponujemy termin bezpłatnej 30-minutowej rozmowy diagnostycznej online. Przechodzimy w niej przez Twoje procesy i wskazujemy 2-3 miejsca, od których warto zacząć.
                </p>
                <a
                    href="/#kontakt"
                    onClick={handleContactClick}
                >
                    <Button
                        variant="accent"
                        size="lg"
                        className="h-14 px-8 text-base flex items-center gap-2 mx-auto shadow-lg shadow-lime/20"
                    >
                        Napisz do nas
                        <ArrowRight size={18} />
                    </Button>
                </a>
                <p className="text-xs text-white/40 mt-4 font-mono uppercase tracking-wider">
                    Odpowiadamy w ciągu 24 godzin
                </p>
            </div>

            {/* Wynik na e-mail (opcjonalny) - wysyłka przez /api/kalkulator-submit */}
            <div className="bg-white/40 backdrop-blur rounded-2xl p-6 border border-black/5">
                {sendState !== 'done' ? (
                    <>
                        <div className="flex items-start gap-3 mb-4">
                            <Mail size={20} className="text-lime mt-1 shrink-0" />
                            <div>
                                <h3 className="font-display text-lg text-black">Chcesz wynik na e-mail?</h3>
                                <p className="text-sm text-muted-dark">Wyślemy Ci wynik z założeniami wyliczenia i 3 procesy do sprawdzenia w Twojej branży.</p>
                            </div>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    placeholder="twoj@email.pl"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="flex-1 h-11 px-4 rounded-lg bg-white border border-black/10 text-black placeholder:text-black/30 focus-visible:outline-none focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/30 text-sm"
                                />
                                <Button
                                    type="submit"
                                    variant="default"
                                    size="lg"
                                    className="h-11 px-5"
                                    disabled={sendState === 'loading' || !privacyAccepted}
                                >
                                    {sendState === 'loading' ? <Loader2 size={16} className="animate-spin" /> : 'Wyślij'}
                                </Button>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className="flex items-center h-5">
                                    <input
                                        id="privacy-kalkulator"
                                        name="privacy-kalkulator"
                                        type="checkbox"
                                        required
                                        checked={privacyAccepted}
                                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                        className="h-4 w-4 rounded border-black/20 accent-lime focus:ring-lime/40"
                                    />
                                </div>
                                <label htmlFor="privacy-kalkulator" className="text-xs text-muted-dark leading-tight">
                                    Zgadzam się na przetwarzanie moich danych osobowych w celu wysłania wyniku na e-mail, zgodnie z <Link to={CONSENT_POLICY_URL} className="text-black hover:text-lime underline transition-colors">polityką prywatności</Link>. <span className="text-lime">*</span>
                                </label>
                            </div>
                        </form>
                        {sendState === 'error' && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-lime" />
                        <span className="text-sm text-black">Wysłane. Wynik i rekomendacje dotrą za chwilę. Jeśli wiadomości nie ma, sprawdź folder spam.</span>
                    </div>
                )}
            </div>

            {/* Link do usługi - jak realnie odzyskujemy policzone godziny */}
            <p className="text-center text-base text-muted-dark">
                Ciekawi Cię, jak te godziny wracają w praktyce?{' '}
                <Link to="/uslugi/automatyzacja" className="text-black underline underline-offset-4 hover:text-lime transition-colors">
                    Zobacz, jak działa automatyzacja AI
                </Link>
                .
            </p>

            {/* Reset */}
            <div className="text-center pt-4">
                <Link
                    to="/"
                    className="text-sm font-mono text-muted-dark hover:text-black transition-colors uppercase tracking-wider"
                >
                    ← Wróć na stronę główną
                </Link>
            </div>
        </motion.div>
    );
}
