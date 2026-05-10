import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, ArrowRight, Calculator, CheckCircle, Calendar, Mail, Sparkles } from 'lucide-react';
import { track, EVENTS } from '../lib/analytics';

const STEPS = ['branza', 'zespol', 'godziny', 'raporty', 'koszt', 'wynik'];

const BRANZE = [
    { id: 'kancelaria', label: 'Kancelaria prawna', emoji: '⚖️' },
    { id: 'ecommerce', label: 'E-commerce / sklep online', emoji: '🛒' },
    { id: 'produkcja', label: 'Firma produkcyjna / dystrybucyjna', emoji: '🏭' },
    { id: 'agencja', label: 'Agencja marketingowa / kreatywna', emoji: '🎨' },
    { id: 'uslugi', label: 'Usługi B2B / konsulting', emoji: '💼' },
    { id: 'inne', label: 'Inna branża', emoji: '🔧' },
];

const ZESPOLY = [
    { id: 1, label: '1-5 osób', value: 3 },
    { id: 2, label: '6-15 osób', value: 10 },
    { id: 3, label: '16-50 osób', value: 30 },
    { id: 4, label: '51-150 osób', value: 90 },
    { id: 5, label: '150+ osób', value: 200 },
];

const KOSZTY = [
    { label: '50 PLN/h', value: 50, hint: 'asystenci, młodsi specjaliści' },
    { label: '100 PLN/h', value: 100, hint: 'specjaliści, mid-level' },
    { label: '150 PLN/h', value: 150, hint: 'seniorzy, kierownicy' },
    { label: '200 PLN/h', value: 200, hint: 'eksperci, partnerzy' },
    { label: '300 PLN/h', value: 300, hint: 'C-level, top talent' },
];

// Personalizowane rekomendacje per branża (mapowane na usługi Workshift).
const REKOMENDACJE = {
    kancelaria: [
        'Automatyczne notatki ze spotkań (oszczędza ~40 min/spotkanie)',
        'Anonimizacja dokumentów RODO (sekundy zamiast minut)',
        'Monitoring legislacji + alerty (ręcznie 2-4h/tyg → 0)',
    ],
    ecommerce: [
        'Agent BOK na "gdzie moja paczka" (40% zapytań solved bez człowieka)',
        'Automatyczne kreacje reklamowe (200 wariantów w 2 dni)',
        'Synchronizacja zamówień ↔ księgowość ↔ magazyn',
    ],
    produkcja: [
        'OCR faktur przychodzących + auto-kategoryzacja (16h/tyg → 0.5h)',
        'Raporty miesięczne automatycznie z 5 systemów (2 dni → 15 min)',
        'Synchronizacja CRM ↔ kalendarz ↔ mail',
    ],
    agencja: [
        'Pipeline kreacji AI z brandbookiem (LoRA) — setki wariantów reklam',
        'Automatyczne briefy i propozycje na bazie historii klienta',
        'Generatywne wideo i animacje produktowe',
    ],
    uslugi: [
        'Onboarding klienta — automatyczne maile, dokumenty, kalendarze',
        'Raportowanie projektów na podstawie danych z narzędzi',
        'Wewnętrzny asystent wiedzy firmowej (RAG)',
    ],
    inne: [
        'Audyt procesów wskaże 2-3 najszybsze automatyzacje (ROI w 3-6 mies)',
        'Integracja narzędzi w jeden workflow — bez zmiany SaaSów',
        'Szkolenie zespołu — od jutra korzystają z AI w codziennej pracy',
    ],
};

export default function KalkulatorStratPage() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState({
        branza: null,
        zespol: null,
        godzinyTyg: 8,
        dniRaportow: 4,
        kosztH: 100,
    });
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        document.title = 'Kalkulator strat czasowych | Sprawdź ile traci Twoja firma — Workshift';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 'Bezpłatny kalkulator: zobacz w 60 sekund ile czasu i pieniędzy traci Twoja firma na powtarzalnych zadaniach. Spersonalizowane rekomendacje AI dla Twojej branży.');
        }
        window.scrollTo(0, 0);
    }, []);

    // Obliczenia
    const wielkoscZespolu = ZESPOLY.find(z => z.id === data.zespol)?.value || 0;
    const godzinyMies = (data.godzinyTyg * 4.33 + data.dniRaportow * 8) * wielkoscZespolu;
    const kosztMies = Math.round(godzinyMies * data.kosztH);
    const kosztRok = kosztMies * 12;
    // Konserwatywnie: automatyzacja zwykle zwraca 40-60% straconych godzin.
    const odzyskMies = Math.round(godzinyMies * 0.4);
    const odzyskKwoteMies = Math.round(odzyskMies * data.kosztH);
    const odzyskKwoteRok = odzyskKwoteMies * 12;

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
                            Odpowiedz na 5 prostych pytań. W 60 sekund zobaczysz konkretne liczby i 3 rekomendacje dla Twojej branży.
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
                        <StepCard key="zespol" title="Ile osób jest w Twoim zespole?" subtitle="Cała firma — łącznie z Tobą.">
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
                            subtitle="Brutto, łącznie z narzutami. Przybliżona średnia."
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
                            emailSubmitted={emailSubmitted}
                            setEmailSubmitted={setEmailSubmitted}
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
    formatPLN, email, setEmail, emailSubmitted, setEmailSubmitted,
}) {
    const rekomendacje = REKOMENDACJE[data.branza] || REKOMENDACJE.inne;

    const handleCalendarClick = () => {
        track(EVENTS.CALCULATOR_CTA_CLICK, { cta: 'calendar', branza: data.branza, kosztRok });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;
        // Tymczasowo: tylko track event. Po podpięciu Resend → POST do /api/subscribe-newsletter z tagiem 'calculator'.
        track(EVENTS.CALCULATOR_CTA_CLICK, { cta: 'email_submit', branza: data.branza, kosztRok });
        setEmailSubmitted(true);
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
                    Twoja firma traci <br />
                    <span className="text-lime-dark" style={{ color: '#7a9900' }}>{Math.round(godzinyMies)}h miesięcznie</span>
                </h1>
                <p className="mt-3 text-base md:text-lg text-muted-dark">
                    To <strong className="text-black">{formatPLN(kosztMies)}/mies</strong> = <strong className="text-black">{formatPLN(kosztRok)}/rok</strong> pracy ludzi na zadaniach, które AI mogłoby wykonać.
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
                    <div className="text-xs font-mono uppercase tracking-wider text-black/70 mb-2">Możesz odzyskać (~40%)</div>
                    <div className="text-2xl md:text-3xl font-display text-black mb-1">{formatPLN(odzyskKwoteMies)}</div>
                    <div className="text-sm text-black/70">miesięcznie ({odzyskMies}h)</div>
                    <div className="mt-3 pt-3 border-t border-lime/30">
                        <div className="text-xl font-display text-black">{formatPLN(odzyskKwoteRok)}</div>
                        <div className="text-sm text-black/70">rocznie</div>
                    </div>
                </div>
            </div>

            {/* Rekomendacje */}
            <div className="bg-white/60 backdrop-blur rounded-2xl p-6 md:p-8 border border-black/5">
                <h2 className="text-xl md:text-2xl font-display text-black mb-1">3 procesy, od których zaczęlibyśmy w Twojej firmie</h2>
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
                <h2 className="text-2xl md:text-3xl font-display mb-3">Pokażemy jak odzyskać te {formatPLN(odzyskKwoteRok)}</h2>
                <p className="text-base md:text-lg text-white/70 mb-6 max-w-xl mx-auto">
                    30-minutowa diagnoza online. Mapa Twoich procesów + 2-3 konkretne rekomendacje. Zero zobowiązań.
                </p>
                <a
                    href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3OTv0k-j2FsAJLC5Db_lhbNVoz1GK8Qk5Z62f3rI8SkRJ7DpdUBgyiIeKtmVIMVgDfI9cbQFkj"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleCalendarClick}
                >
                    <Button
                        variant="accent"
                        size="lg"
                        className="h-14 px-8 text-base flex items-center gap-2 mx-auto shadow-lg shadow-lime/20"
                    >
                        <Calendar size={18} />
                        Umów bezpłatną diagnozę
                    </Button>
                </a>
                <p className="text-xs text-white/40 mt-4 font-mono uppercase tracking-wider">
                    Pierwsza dostępna: zwykle w 3-5 dni
                </p>
            </div>

            {/* Email gate (opcjonalny) */}
            <div className="bg-white/40 backdrop-blur rounded-2xl p-6 border border-black/5">
                {!emailSubmitted ? (
                    <>
                        <div className="flex items-start gap-3 mb-4">
                            <Mail size={20} className="text-lime mt-1 shrink-0" />
                            <div>
                                <h3 className="font-display text-lg text-black">Chcesz wynik na maila?</h3>
                                <p className="text-sm text-muted-dark">Wyślemy podsumowanie + case study firmy z Twojej branży, która już to wdrożyła. Zero spamu.</p>
                            </div>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="twoj@email.pl"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="flex-1 h-11 px-4 rounded-lg bg-white border border-black/10 text-black placeholder:text-black/30 focus-visible:outline-none focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/30 text-sm"
                            />
                            <Button type="submit" variant="default" size="lg" className="h-11 px-5">
                                Wyślij
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <CheckCircle size={20} className="text-lime" />
                        <span className="text-sm text-black">Dzięki — wynik i case study dotrą w ciągu 5 minut.</span>
                    </div>
                )}
            </div>

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
