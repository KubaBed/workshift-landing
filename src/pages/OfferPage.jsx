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

    // Print stylesheet - aktywuje się gdy klient klika "Pobierz PDF" (window.print).
    // Strategia: globalnie ukrywamy elementy nawigacyjne strony (Header, Footer,
    // WhatsApp button, ConsentBanner) oraz sticky status banner i CTA. Wymuszamy
    // białe tło, wyłączamy animacje framer-motion (opacity:0 by default → show).
    // Page break-inside na sekcjach żeby nie ciąć tabel cenowych w połowie.
    useEffect(() => {
        const style = document.createElement('style');
        style.setAttribute('data-offer-print', '1');
        style.textContent = `
            @media print {
                /* Hide global app chrome */
                header[class*="sticky"], nav, footer, [role="contentinfo"] { display: none !important; }
                a[aria-label*="WhatsApp"], [class*="FloatingWhatsApp"] { display: none !important; }
                [role="dialog"][aria-label*="cookies"], div[id*="cookie"] { display: none !important; }
                /* Hide offer-specific non-print elements */
                main > div.sticky.top-0 { display: none !important; }
                .no-print { display: none !important; }
                /* Force white bg + readable colors */
                html, body, main { background: #ffffff !important; }
                .bg-sage { background: #ffffff !important; }
                .bg-white\\/30, .bg-white\\/60 { background: #fafafa !important; }
                /* Reveal framer-motion elements that started at opacity:0 */
                [style*="opacity: 0"] { opacity: 1 !important; }
                [style*="opacity:0"] { opacity: 1 !important; }
                [style*="transform: translateY"] { transform: none !important; }
                /* Avoid breaking sections mid-content */
                section { break-inside: avoid; page-break-inside: avoid; }
                h1, h2, h3 { break-after: avoid; page-break-after: avoid; }
                .rounded-2xl { break-inside: avoid; page-break-inside: avoid; }
                table { break-inside: avoid; page-break-inside: avoid; }
                /* Compact padding for print */
                section { padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
                /* Make sure lime accents print (color-adjust) */
                .bg-lime, [class*="bg-lime"] {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `;
        document.head.appendChild(style);
        return () => {
            try { document.head.removeChild(style); } catch { /* ok */ }
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
