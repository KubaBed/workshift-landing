import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { OfferGate } from '../components/offer/OfferGate';
import {
    HeroSection,
    TldrSection,
    ContextSection,
    ProblemsSection,
    ApproachSection,
    PilotSection,
    TimelineSection,
    PricingSection,
    SaldeoSection,
    NextStepsSection,
    StatusBanner,
    NeedsSection,
    ExtraSections,
    BoardSection,
    PartDivider,
} from '../components/offer/OfferSections';
import NotFoundPage from './NotFoundPage';

// Niełamliwe spacje tam, gdzie złamanie wiersza rozbija sens: tysiące w kwotach
// („14 400"), liczba + jednostka („500 PLN", „7 dni", „2 420 m²"), numer modułu
// („modułu 1"), skróty przed liczbą („ok. 50", „do 31"), jednoliterowe spójniki na
// końcu wiersza („i", „w", „z"), liczba + miesiąc („7 października") oraz niełamliwy
// dywiz w złożeniach typu „e-commerce". Reguły jak w nbsp() z
// lead-magnets/build-offer-pdf.mjs, a do tego dwie, których PDF jeszcze nie ma:
// „m²" i liczba + nazwa miesiąca w dopełniaczu.
const MONTHS_GEN = 'stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia';
const MONTH_RE = new RegExp(`(\\d) (${MONTHS_GEN})`, 'g');
function nbspText(s) {
    const orphan = /(^|[\s(„])([aiouwzAIOUWZ]) /g;
    return s
        .replace(/(\d) (\d{3})\b/g, '$1\u00a0$2')
        .replace(/(\d) (PLN|zł|dni|tyg\.?|godz\w*|lekcj\w*|film\w*|osób|parków|faktur|m²)/g, '$1\u00a0$2')
        .replace(/\b(moduł\w*|Moduł) (\d)\b/g, '$1\u00a0$2')
        .replace(/\b(ok\.|np\.|do|od) (\d)/g, '$1\u00a0$2')
        // Dwa przebiegi, bo w „i w domu" pierwszy zjada spację przed „w".
        .replace(orphan, '$1$2\u00a0')
        .replace(orphan, '$1$2\u00a0')
        .replace(MONTH_RE, '$1\u00a0$2')
        .replace(/\be-(commerce|mail|book|learning)\b/g, 'e\u2011$1');
}
function nbspDeep(v) {
    if (typeof v === 'string') return nbspText(v);
    if (Array.isArray(v)) return v.map(nbspDeep);
    if (v && typeof v === 'object') {
        // Adresy (`board.demo.url`) zostają nietknięte.
        return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === 'url' ? x : nbspDeep(x)]));
    }
    return v;
}

// Domyślne przekładki części 2 i 3, gdy oferta ma `board`, a nie ma `parts`.
const PART_DEFAULTS = {
    details: { label: 'Część 2', title: 'Szczegóły' },
    technical: { label: 'Część 3', title: 'Załącznik techniczny' },
};

// Oferta z częścią dla zarządu: Część 1 (BoardSection) zamiast "W skrócie", potem przekładka
// części 2 i rozdziały w kolejności z PDF, na końcu przekładka części 3 i załącznik.
function BoardOfferBody({ offer }) {
    const sections = Array.isArray(offer.sections) ? offer.sections : [];
    const byPos = (pos) => sections.filter((s) => (s.position || 'main') === pos);
    const appendix = byPos('appendix');
    const details = { ...PART_DEFAULTS.details, ...(offer.parts?.details || {}) };
    const technical = { ...PART_DEFAULTS.technical, ...(offer.parts?.technical || {}) };
    return (
        <>
            <BoardSection board={offer.board} validUntil={offer.meta.validUntil} />
            <PartDivider part={details} />
            {offer.context && <ContextSection context={offer.context} />}
            {offer.problems?.length > 0 && (
                <ProblemsSection
                    problems={offer.problems}
                    label={offer.labels?.problems}
                    subtitle={offer.labels?.problemsSubtitle}
                    badge={offer.labels?.problemsBadge}
                />
            )}
            {offer.approach && <ApproachSection approach={offer.approach} />}
            <ExtraSections sections={byPos('beforePhases')} />
            <PilotSection
                pilot={offer.pilot}
                asysta={offer.asysta}
                phases={offer.phases}
                label={offer.labels?.scopeLabel}
                title={offer.labels?.scopeTitle}
            />
            {offer.needs && <NeedsSection needs={offer.needs} />}
            <ExtraSections sections={[...byPos('afterPhases'), ...byPos('main')]} />
            <TimelineSection
                timeline={offer.timeline}
                title={offer.labels?.timelineTitle}
                label={offer.labels?.timelineLabel}
            />
            {offer.pricing && <PricingSection pricing={offer.pricing} title={offer.labels?.pricingTitle} />}
            <ExtraSections sections={byPos('afterPricing')} />
            {offer.saldeo && <SaldeoSection saldeo={offer.saldeo} />}
            {appendix.length > 0 && <PartDivider part={technical} />}
            <ExtraSections sections={appendix} />
        </>
    );
}

// Kontakt w stopce - używamy bezpośredniego maila Jakuba zamiast kontakt@.
const CONTACT = {
    name: 'Jakub Bednarz · Workshift',
    email: 'jakub@workshift.pl',
};

export default function OfferPage() {
    const { slug } = useParams();
    const [state, setState] = useState({ status: 'loading', offer: null });
    const [views, setViews] = useState(null);

    const loadOffer = useCallback(async () => {
        if (!slug) {
            setState({ status: 'notfound', offer: null });
            return;
        }
        try {
            const res = await fetch(`/api/offers/get?slug=${encodeURIComponent(slug)}`, {
                credentials: 'include',
            });
            if (res.status === 401) {
                setState({ status: 'locked', offer: null });
                return;
            }
            if (res.status === 404) {
                setState({ status: 'notfound', offer: null });
                return;
            }
            if (!res.ok) {
                setState({ status: 'error', offer: null });
                return;
            }
            const data = await res.json();
            setState({ status: 'ready', offer: nbspDeep(data.offer) });
        } catch {
            setState({ status: 'error', offer: null });
        }
    }, [slug]);

    useEffect(() => { loadOffer(); }, [loadOffer]);

    // Log view + fetch view stats po odblokowaniu.
    useEffect(() => {
        if (state.status !== 'ready') return;
        let mounted = true;
        const track = async () => {
            try {
                await fetch('/api/offers/track-view', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ slug }),
                });
                const r = await fetch(`/api/offers/views?slug=${encodeURIComponent(slug)}`, {
                    credentials: 'include',
                });
                if (r.ok && mounted) setViews(await r.json());
            } catch { /* ignore - tracking nie blokuje strony */ }
        };
        track();
        return () => { mounted = false; };
    }, [state.status, slug]);

    // Dodaj noindex meta tag tylko dla tej trasy.
    useEffect(() => {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex,nofollow,noarchive';
        document.head.appendChild(meta);
        return () => {
            try { document.head.removeChild(meta); } catch { /* ok */ }
        };
    }, []);

    if (state.status === 'loading') {
        return (
            <main className="min-h-screen bg-sage flex items-center justify-center">
                <div className="font-mono text-xs uppercase tracking-[0.22em] text-muted-dark">Wczytuję ofertę…</div>
            </main>
        );
    }

    if (state.status === 'notfound') {
        return <NotFoundPage />;
    }

    if (state.status === 'error') {
        return (
            <main className="min-h-screen bg-sage flex items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-dark mb-4">Błąd</p>
                    <p className="text-lg text-black mb-6">Nie udało się wczytać oferty. Spróbuj odświeżyć stronę albo napisz na <a className="underline" href="mailto:jakub@workshift.pl">jakub@workshift.pl</a>.</p>
                    <button
                        onClick={loadOffer}
                        className="px-5 h-11 rounded-md border border-black/15 hover:border-black transition"
                    >
                        Spróbuj ponownie
                    </button>
                </div>
            </main>
        );
    }

    if (state.status === 'locked') {
        return (
            <MotionConfig reducedMotion="user">
                <OfferGate
                    slug={slug}
                    clientName="Oferta indywidualna"
                    onUnlock={loadOffer}
                />
            </MotionConfig>
        );
    }

    // reducedMotion="user": przy "ogranicz ruch" w systemie framer-motion pomija przesunięcia
    // (fadeUp robi wtedy samo wygaszenie). Reguła w index.css działa tylko na CSS, nie na JS.
    const offer = state.offer;
    return (
        <MotionConfig reducedMotion="user">
            <main className="bg-sage min-h-screen relative">
                <StatusBanner views={views} validUntil={offer.meta.validUntil} />
                <HeroSection meta={offer.meta} client={offer.client} video={offer.video} />
                {offer.board ? (
                    <BoardOfferBody offer={offer} />
                ) : (
                    <>
                        <TldrSection tldr={offer.tldr} lead={offer.summary?.lead} />
                        <ContextSection context={offer.context} />
                        {offer.problems?.length > 0 && (
                            <ProblemsSection
                                problems={offer.problems}
                                label={offer.labels?.problems}
                                subtitle={offer.labels?.problemsSubtitle}
                                badge={offer.labels?.problemsBadge}
                            />
                        )}
                        <ApproachSection approach={offer.approach} />
                        <ExtraSections sections={offer.sections?.filter((s) => s.position === 'beforePhases')} />
                        <PilotSection
                            pilot={offer.pilot}
                            asysta={offer.asysta}
                            phases={offer.phases}
                            label={offer.labels?.scopeLabel}
                            title={offer.labels?.scopeTitle}
                        />
                        {offer.needs && <NeedsSection needs={offer.needs} />}
                        <ExtraSections sections={offer.sections?.filter((s) => s.position !== 'beforePhases')} />
                        <TimelineSection
                            timeline={offer.timeline}
                            title={offer.labels?.timelineTitle}
                            label={offer.labels?.timelineLabel}
                        />
                        <PricingSection pricing={offer.pricing} title={offer.labels?.pricingTitle} />
                        {offer.saldeo && <SaldeoSection saldeo={offer.saldeo} />}
                    </>
                )}
                <NextStepsSection
                    steps={offer.nextSteps}
                    title={offer.labels?.nextStepsTitle}
                    validUntil={offer.meta.validUntil}
                    contact={CONTACT}
                    client={offer.client}
                />
            </main>
        </MotionConfig>
    );
}
