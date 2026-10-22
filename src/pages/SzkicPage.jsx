import React from 'react';
import { Link } from 'react-router-dom';
import { Download, Check, X, ArrowRight } from 'lucide-react';
import { FadeUp } from '../components/animations/FadeUp';
import { ServiceFaq } from '../components/ui/ServiceFaq';
import { SzkicHeroVideo } from '../components/szkic/SzkicHeroVideo';
import { SzkicHowItWorks } from '../components/szkic/SzkicHowItWorks';
import { SzkicBento } from '../components/szkic/SzkicBento';
import {
    SZKIC_DOWNLOAD_URL,
    SZKIC_LICENSE_URL,
    SZKIC_REQUIREMENTS,
    SZKIC_HERO,
    SZKIC_PERMISSIONS,
    SZKIC_LICENSE,
    SZKIC_FAQ,
    SZKIC_FINAL,
} from '../data/szkic';

// Twarda spacja po jednoliterowych słowach (a, i, o, u, w, z), żeby nie wisiały na końcu linii.
const nb = (text) => text.replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2\u00A0').replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2\u00A0');

const FAQ = SZKIC_FAQ.map((f) => ({ q: nb(f.q), a: nb(f.a) }));

/**
 * /narzedzia/szkic - strona aplikacji Szkic (macOS, pasek menu).
 * Treść w src/data/szkic.js (wspólna ze statycznym fallbackiem SEO).
 *
 * Sekcje: hero z filmem działania Szkicu, jak to działa (kroki z kadrami), kafelki o prywatności i transkrypcji,
 * wymagania i licencja, FAQ, końcowe wezwanie do pobrania.
 */
export default function SzkicPage() {
    return (
        <main className="bg-sage">
            <Hero />
            <SzkicHowItWorks />
            <SzkicBento />
            <RequirementsAndLicense />
            <section className="px-4 py-16 md:py-24">
                <div className="max-w-[1320px] mx-auto rounded-3xl bg-white px-6 py-12 md:px-12 md:py-16">
                    <ServiceFaq faq={FAQ} heading="Pytania o Szkic" eyebrow="FAQ" />
                </div>
            </section>
            <Final />
        </main>
    );
}

function DownloadButton({ className = '' }) {
    return (
        <a
            href={SZKIC_DOWNLOAD_URL}
            download
            className={`group inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-lime text-black text-base font-medium px-6 h-12 shadow-[0_8px_24px_-10px_rgba(80,140,40,0.6)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_12px_28px_-10px_rgba(80,140,40,0.7)] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-lime/50 whitespace-nowrap ${className}`}
        >
            <Download className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-y-0.5" strokeWidth={2} aria-hidden="true" />
            Pobierz na Maca
        </a>
    );
}

/** Klawisz jak na klawiaturze Maca. */
function Key({ children, size = 'md' }) {
    const sizes = {
        md: 'min-w-10 h-10 px-2.5 text-lg',
        lg: 'min-w-12 h-12 md:min-w-14 md:h-14 px-3 text-xl md:text-2xl',
    };
    return (
        <kbd
            className={`inline-flex items-center justify-center rounded-[10px] bg-white text-black font-mono font-normal ring-1 ring-black/10 shadow-[0_2px_0_rgba(0,0,0,0.12)] ${sizes[size]}`}
        >
            {children}
        </kbd>
    );
}

function Hero() {
    return (
        <section className="px-4 pt-28 lg:pt-36 pb-16 md:pb-24">
            <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
                <div className="lg:col-span-5">
                    <FadeUp duration={0.6}>
                        <p className="text-sm text-muted-dark mb-5">{SZKIC_HERO.eyebrow}</p>
                        <h1 className="text-[40px] leading-[1.05] sm:text-5xl lg:text-[60px] tracking-[-0.035em] text-black text-balance">
                            {nb(SZKIC_HERO.title)}
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-dark leading-relaxed text-pretty max-w-[34ch]">{nb(SZKIC_HERO.lead)}</p>
                        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                            <DownloadButton />
                            <a
                                href="#jak-dziala"
                                className="inline-flex items-center min-h-11 text-base text-black underline decoration-black/25 underline-offset-4 hover:decoration-black transition-[text-decoration-color] duration-200"
                            >
                                Jak to działa
                            </a>
                        </div>
                    </FadeUp>
                </div>
                <div className="lg:col-span-7">
                    <FadeUp duration={0.8} delay={0.15}>
                        <SzkicHeroVideo />
                    </FadeUp>
                </div>
            </div>
        </section>
    );
}

function RequirementsAndLicense() {
    return (
        <section className="px-4 py-16 md:py-24">
            <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
                <FadeUp className="lg:col-span-5" duration={0.6}>
                    <div className="h-full rounded-3xl bg-white p-7 md:p-10">
                        <h2 className="text-3xl md:text-4xl tracking-tight text-black">Wymagania</h2>
                        <dl className="mt-8 space-y-5">
                            <div>
                                <dt className="font-mono text-xs text-muted-dark">System</dt>
                                <dd className="mt-1 text-lg text-black">macOS 26 lub nowszy</dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs text-muted-dark">Komputer</dt>
                                <dd className="mt-1 text-lg text-black">Mac z procesorem Apple (M1 lub nowszy)</dd>
                                <dd className="mt-1 text-base text-muted-dark">Maki z procesorem Intel nie są obsługiwane.</dd>
                            </div>
                            <div>
                                <dt className="font-mono text-xs text-muted-dark">Uprawnienia</dt>
                                <dd className="mt-2">
                                    <ul className="space-y-2">
                                        {SZKIC_PERMISSIONS.map((name) => (
                                            <li key={name} className="text-base text-black">{name}</li>
                                        ))}
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </FadeUp>
                <FadeUp className="lg:col-span-7" duration={0.6} delay={0.1}>
                    <div className="h-full rounded-3xl bg-black/[0.04] ring-1 ring-black/5 p-7 md:p-10">
                        <h2 className="text-3xl md:text-4xl tracking-tight text-black">Licencja</h2>
                        <p className="mt-5 text-lg text-muted-dark leading-relaxed text-pretty max-w-[52ch]">{nb(SZKIC_LICENSE.lead)}</p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div>
                                <p className="text-base text-black mb-3">Możesz</p>
                                <ul className="space-y-2.5">
                                    {SZKIC_LICENSE.allowed.map((item) => (
                                        <li key={item} className="flex gap-2.5 text-base text-black/80">
                                            <Check className="w-[18px] h-[18px] mt-0.5 shrink-0 text-black" strokeWidth={1.75} aria-hidden="true" />
                                            {nb(item)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="text-base text-black mb-3">Bez zgody nie możesz</p>
                                <ul className="space-y-2.5">
                                    {SZKIC_LICENSE.forbidden.map((item) => (
                                        <li key={item} className="flex gap-2.5 text-base text-black/80">
                                            <X className="w-[18px] h-[18px] mt-0.5 shrink-0 text-destructive" strokeWidth={1.75} aria-hidden="true" />
                                            {nb(item)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <p className="mt-8 text-base text-muted-dark">
                            Chcesz wbudować Szkic w płatny produkt? Napisz:{' '}
                            <a href={`mailto:${SZKIC_LICENSE.contact}`} className="text-black underline decoration-black/25 underline-offset-4 hover:decoration-black">
                                {SZKIC_LICENSE.contact}
                            </a>
                            .{' '}
                            <a href={SZKIC_LICENSE_URL} target="_blank" rel="noopener noreferrer" className="text-black underline decoration-black/25 underline-offset-4 hover:decoration-black">
                                Pełny tekst licencji
                            </a>
                        </p>
                    </div>
                </FadeUp>
            </div>
        </section>
    );
}

function Final() {
    return (
        <section className="px-4 pt-8 pb-24 md:pt-12 md:pb-32">
            <FadeUp duration={0.6}>
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center gap-1.5 mb-8" aria-hidden="true">
                        <Key>⌃</Key>
                        <Key>⌥</Key>
                        <Key>S</Key>
                    </div>
                    <h2 className="text-4xl md:text-6xl tracking-[-0.03em] text-black text-balance">{nb(SZKIC_FINAL.title)}</h2>
                    <p className="mt-5 text-lg md:text-xl text-muted-dark leading-relaxed text-pretty max-w-[46ch] mx-auto">{nb(SZKIC_FINAL.text)}</p>
                    <div className="mt-9 flex flex-col items-center gap-4">
                        <DownloadButton />
                        <p className="text-sm text-muted-dark">{SZKIC_REQUIREMENTS}</p>
                    </div>
                    <p className="mt-16 text-base text-muted-dark">
                        {nb(SZKIC_FINAL.workshift)}{' '}
                        <Link to="/" className="inline-flex items-center gap-1 text-black underline decoration-black/25 underline-offset-4 hover:decoration-black">
                            Poznaj Workshift
                            <ArrowRight className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
                        </Link>
                    </p>
                </div>
            </FadeUp>
        </section>
    );
}
