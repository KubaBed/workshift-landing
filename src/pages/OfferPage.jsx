import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
} from '../components/offer/OfferSections';
import NotFoundPage from './NotFoundPage';

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
            setState({ status: 'ready', offer: data.offer });
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
            <OfferGate
                slug={slug}
                clientName="Oferta indywidualna"
                onUnlock={loadOffer}
            />
        );
    }

    const offer = state.offer;
    return (
        <main className="bg-sage min-h-screen relative">
            <StatusBanner views={views} validUntil={offer.meta.validUntil} />
            <HeroSection meta={offer.meta} client={offer.client} video={offer.video} />
            <TldrSection tldr={offer.tldr} />
            <ContextSection context={offer.context} />
            <ProblemsSection problems={offer.problems} />
            <ApproachSection approach={offer.approach} />
            <PilotSection pilot={offer.pilot} asysta={offer.asysta} />
            <TimelineSection timeline={offer.timeline} />
            <PricingSection pricing={offer.pricing} />
            {offer.saldeo && <SaldeoSection saldeo={offer.saldeo} />}
            <NextStepsSection
                steps={offer.nextSteps}
                validUntil={offer.meta.validUntil}
                contact={CONTACT}
                client={offer.client}
            />
        </main>
    );
}
