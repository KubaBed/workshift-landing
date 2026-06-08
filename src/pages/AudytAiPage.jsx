import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ClipboardCheck,
    Clock,
    MessageCircle,
    Phone,
    Sparkles,
    ShieldCheck,
} from 'lucide-react';
import { track, EVENTS } from '../lib/analytics';
import { AudytQuiz } from '../components/AudytQuiz';
import logo1 from '../assets/partners/logo1.png';
import logo2 from '../assets/partners/logo2.png';
import logo3 from '../assets/partners/logo3.png';
import logo4 from '../assets/partners/logo4.png';
import logo5 from '../assets/partners/logo5.png';

const jakubPhoto = '/Jakub-Bednarz.webp';
const PARTNER_LOGOS = [logo1, logo2, logo3, logo4, logo5];
const PHONE_HUMAN = '+48 796 186 067';
const PHONE_TEL = 'tel:+48796186067';
const WHATSAPP_URL = 'https://wa.me/48796186067?text=' + encodeURIComponent('Cześć Kuba, chcę porozmawiać o audycie AI.');

export default function AudytAiPage() {
    useEffect(() => {
        document.title = 'Mikro-audyt AI - sprawdź ile traci Twoja firma | Workshift';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute(
                'content',
                '12 pytań, 4 minuty. Konkretny wynik + 3 rekomendacje dopasowane do Twojej branży. Bezpłatny mikro-audyt AI dla małych i średnich firm.'
            );
        }
        window.scrollTo(0, 0);
        track(EVENTS.AUDIT_VIEW);
    }, []);

    const scrollToQuiz = () => {
        const el = document.getElementById('quiz');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <main className="bg-sage relative overflow-hidden">
            {/* ============ HERO ============ */}
            <section className="relative px-4 pt-12 md:pt-20 pb-16 md:pb-24">
                {/* Background blur orbs (same pattern co kalkulator) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lime/15 blur-[140px] rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-black/5 blur-[140px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto pt-12 md:pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Eyebrow pill */}
                        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-6">
                            <Sparkles size={12} />
                            Bezpłatny mikro-audyt AI
                        </span>

                        {/* H1 - problem-focused (wybór: b) */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-black leading-[1.05] text-balance">
                            Twoi ludzie robią ręcznie
                            <br />
                            <span className="text-muted-dark">to, co AI mogłoby robić za nich.</span>
                        </h1>

                        <p className="mt-6 text-lg md:text-xl text-muted-dark max-w-2xl mx-auto leading-relaxed">
                            12 pytań. 4 minuty. Konkretny wynik wraz z 3 rekomendacjami,
                            dopasowanymi do Twojej branży - bez konieczności podawania maila.
                        </p>

                        {/* Primary CTA */}
                        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
                            <button
                                onClick={() => {
                                    track(EVENTS.AUDIT_START, { source: 'hero' });
                                    scrollToQuiz();
                                }}
                                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white rounded-full font-medium hover:bg-black/85 transition-colors"
                            >
                                Rozpocznij audyt
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                            <a
                                href={PHONE_TEL}
                                onClick={() => track(EVENTS.AUDIT_CTA_HOT, { source: 'hero', channel: 'tel' })}
                                className="inline-flex items-center gap-2 px-6 py-3.5 border border-black/15 text-black rounded-full font-medium hover:bg-white/60 transition-colors"
                            >
                                <Phone size={16} />
                                Wolę po prostu zadzwonić
                            </a>
                        </div>

                        {/* Micro-trust signals */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-dark">
                            <span className="inline-flex items-center gap-2">
                                <Clock size={14} />
                                ~4 minuty
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <ClipboardCheck size={14} />
                                12 pytań
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <ShieldCheck size={14} />
                                Bez maila do startu
                            </span>
                        </div>

                        {/* Trust strip - logo klientów (z audytu landinga: największy zysk CVR) */}
                        <div className="mt-12">
                            <p className="font-mono text-xs uppercase tracking-wider text-muted-dark mb-4">
                                Zaufali nam
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                                {PARTNER_LOGOS.map((logo, i) => (
                                    <img
                                        key={i}
                                        src={logo}
                                        alt="Logo klienta Workshift"
                                        className="h-6 md:h-7 object-contain opacity-50 grayscale"
                                        style={{ mixBlendMode: 'multiply' }}
                                        loading="lazy"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ============ QUIZ (live) ============ */}
            <section id="quiz" className="relative px-4 py-16 md:py-24 scroll-mt-20 min-h-[85vh] flex items-center">
                <div className="w-full">
                    <AudytQuiz />
                </div>
            </section>

            {/* ============ JAK TO DZIAŁA ============ */}
            <section className="px-4 py-16 md:py-24 bg-white/40 border-y border-black/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-4">
                            Jak to działa
                        </span>
                        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black text-balance">
                            Proste 3 kroki do wykonania
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                n: '01',
                                title: 'Odpowiadasz na 12 pytań',
                                body: 'Konkretne, oparte na liczbach (godziny, błędy, czasy reakcji). Bez "ocen w skali 1-10".',
                            },
                            {
                                n: '02',
                                title: 'Widzisz wynik od razu',
                                body: 'Liczba 0-36 + interpretacja + 3 rekomendacje pod Twoją branżę.',
                            },
                            {
                                n: '03',
                                title: 'Decydujesz co dalej',
                                body: 'Newsletter, raport mailem albo rozmowa - w zależności od tego, jak dużo możemy zautomatyzować.',
                            },
                        ].map((step) => (
                            <motion.div
                                key={step.n}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="p-6 rounded-2xl bg-white border border-black/10"
                            >
                                <div className="text-xs font-mono text-muted-dark mb-3 tracking-wider">
                                    {step.n}
                                </div>
                                <h3 className="text-xl font-display text-black mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-muted-dark text-sm leading-relaxed">
                                    {step.body}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ O MNIE (mini) ============ */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                    <div className="md:col-span-5">
                        <div className="relative aspect-[4/5] w-full max-w-sm mx-auto rounded-[10px] overflow-hidden shadow-2xl shadow-black/10 border-4 border-white">
                            <img
                                src={jakubPhoto}
                                alt="Jakub Bednarz - Workshift"
                                loading="lazy"
                                className="w-full h-full object-cover scale-110"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-7">
                        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-4">
                            Kto to robi
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display tracking-tight text-black mb-6 text-balance">
                            Cześć, tu Jakub.
                        </h2>
                        <div className="space-y-4 text-base md:text-lg text-muted-dark leading-relaxed">
                            <p>
                                Od kilku lat wdrażam automatyzacje AI dla małych i średnich firm w
                                Polsce - księgowość, e-commerce, agencje, usługi B2B. Najczęstszy
                                pierwszy krok? Krótki audyt, który pokazuje, gdzie 1 godzina pracy
                                AI wyrzuca z kalendarza 20 godzin pracy ludzi.
                            </p>
                            <p>
                                Ten mikro-audyt to wersja "do samodzielnego sprawdzenia" - bez
                                dzwonka do mnie, bez maila. Jeśli wyjdzie czerwono - porozmawiamy.
                                Jeśli zielono - nie sprzedam Ci niczego, ale dostaniesz konkrety,
                                co warto poczytać.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ FAQ ============ */}
            <section className="px-4 py-16 md:py-24 bg-white/40 border-y border-black/5">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-4">
                            FAQ
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display tracking-tight text-black text-balance">
                            Krótko o tym, co się spodziewasz.
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Czy to naprawdę bezpłatne?',
                                a: 'Tak - quiz, wynik i 3 rekomendacje są bezpłatne. Płatne są dopiero usługi, jeśli zdecydujesz że chcesz pracować razem (audyt szczegółowy od 4 900 PLN).',
                            },
                            {
                                q: 'Co z moimi danymi?',
                                a: 'Nie zbieram danych do startu quizu. Email zostawiasz tylko jeśli sam chcesz wynik na maila. Zero list marketingowych ani spam-sekwencji bez Twojej zgody.',
                            },
                            {
                                q: 'Ile trwa pełny audyt (ten płatny)?',
                                a: 'Od 2 do 4 tygodni - w zależności od rozmiaru firmy. Audyt kończy się raportem z konkretną listą automatyzacji w kolejności priorytetu, z ROI każdej z nich.',
                            },
                            {
                                q: 'Nie chcę quizu, wolę pogadać.',
                                a: (
                                    <>
                                        Spoko -{' '}
                                        <a
                                            href={PHONE_TEL}
                                            onClick={() =>
                                                track(EVENTS.AUDIT_CTA_HOT, {
                                                    source: 'faq',
                                                    channel: 'tel',
                                                })
                                            }
                                            className="underline hover:text-black"
                                        >
                                            zadzwoń ({PHONE_HUMAN})
                                        </a>{' '}
                                        albo{' '}
                                        <a
                                            href={WHATSAPP_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() =>
                                                track(EVENTS.AUDIT_CTA_HOT, {
                                                    source: 'faq',
                                                    channel: 'whatsapp',
                                                })
                                            }
                                            className="underline hover:text-black"
                                        >
                                            napisz na WhatsApp
                                        </a>
                                        . Oddzwonię w ciągu 2h roboczych.
                                    </>
                                ),
                            },
                        ].map((item, i) => (
                            <details
                                key={i}
                                className="group p-5 rounded-xl bg-white border border-black/10 open:border-black/30 transition-colors"
                            >
                                <summary className="flex items-center justify-between cursor-pointer text-black font-medium list-none">
                                    {item.q}
                                    <span className="ml-4 text-muted-dark group-open:rotate-45 transition-transform text-lg leading-none">
                                        +
                                    </span>
                                </summary>
                                <div className="mt-3 text-muted-dark leading-relaxed text-sm">
                                    {item.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ FINAL CTA ============ */}
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black mb-4 text-balance">
                        Albo pomiń quiz i porozmawiajmy.
                    </h2>
                    <p className="text-lg text-muted-dark mb-8 max-w-xl mx-auto">
                        15-minutowa rozmowa pokaże więcej niż każdy formularz. Bez prezentacji
                        PowerPointa.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <a
                            href={PHONE_TEL}
                            onClick={() =>
                                track(EVENTS.AUDIT_CTA_HOT, { source: 'footer_cta', channel: 'tel' })
                            }
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white rounded-full font-medium hover:bg-black/85 transition-colors"
                        >
                            <Phone size={18} />
                            {PHONE_HUMAN}
                        </a>
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                                track(EVENTS.AUDIT_CTA_HOT, {
                                    source: 'footer_cta',
                                    channel: 'whatsapp',
                                })
                            }
                            className="inline-flex items-center gap-2 px-6 py-3.5 bg-lime text-black rounded-full font-medium hover:opacity-90 transition-opacity"
                        >
                            <MessageCircle size={18} />
                            WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
