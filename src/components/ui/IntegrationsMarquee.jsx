import React, { useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Pas kafelków z narzędziami, które spinamy (karta toolsMarquee w bento).
 *
 * - Logo SVG leżą w src/assets/logos/integrations/ (self-hosted, zero
 *   requestów zewnętrznych w runtime); manifest buduje import.meta.glob.
 * - Narzędzie bez logo (głównie polskie: Fakturownia, Subiekt, Baselinker...)
 *   dostaje monogram w IBM Plex Mono - celowo jednolity zestaw, nie brak.
 * - Dwa rzędy w przeciwnych kierunkach (wzorzec MarqueeRow z bento), hover
 *   pauzuje oba (animation wchodzi inline, więc pauza też musi być inline -
 *   klasa z animation-play-state przegrywa z inline style).
 * - prefers-reduced-motion: statyczna zawijana siatka zamiast marquee.
 */

const LOGO_URLS = import.meta.glob('../../assets/logos/integrations/*.svg', {
    eager: true,
    query: '?url',
    import: 'default',
});

const logoFor = (slug) => (slug ? LOGO_URLS[`../../assets/logos/integrations/${slug}.svg`] : undefined);

/** Monogram: jawny `mono` z danych albo inicjały (max 2 znaki). */
function monogram(tool) {
    if (tool.mono) return tool.mono;
    const words = tool.name.split(/\s+/);
    return (words.length > 1 ? words[0][0] + words[1][0] : tool.name.slice(0, 2)).toUpperCase();
}

/** Samo logo (lub monogram) - np. do chipów „Spinamy je przez" w bento. */
export function IntegrationLogo({ tool, className = 'w-6 h-6 object-contain' }) {
    const logo = logoFor(tool.slug);
    if (!logo) {
        return <span className="font-mono text-sm text-black tracking-tight" aria-hidden="true">{monogram(tool)}</span>;
    }
    return <img src={logo} alt={`${tool.name} - logo`} className={className} loading="lazy" width="24" height="24" />;
}

function Tile({ tool }) {
    return (
        <div className="flex flex-col items-center gap-1.5 shrink-0 w-[72px]" title={tool.name}>
            <div className="w-14 h-14 rounded-[10px] bg-white border border-black/5 shadow-sm flex items-center justify-center transition-[border-color,transform] duration-300 hover:border-black/15 hover:-translate-y-0.5">
                <IntegrationLogo tool={tool} />
            </div>
            <span className="text-[10px] font-mono text-muted-dark leading-none whitespace-nowrap">{tool.name}</span>
        </div>
    );
}

function Row({ tools, reverse, paused, duration }) {
    const group = (ariaHidden) => (
        <div
            aria-hidden={ariaHidden || undefined}
            className="flex shrink-0 gap-3 md:gap-4 items-start pr-3 md:pr-4"
            style={{
                animation: `ws-int-marquee${reverse ? '-rev' : ''} ${duration}s linear infinite`,
                animationPlayState: paused ? 'paused' : 'running',
            }}
        >
            {tools.map((tool) => <Tile key={tool.name} tool={tool} />)}
        </div>
    );
    return (
        <div className="flex overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
            {group(false)}
            {group(true)}
        </div>
    );
}

export function IntegrationsMarquee({ tools = [], badge }) {
    const reducedMotion = useReducedMotion();
    const [paused, setPaused] = useState(false);

    // Podział naprzemienny, żeby polskie i globalne narzędzia mieszały się
    // w obu rzędach zamiast zbić się w jednym.
    const [rowA, rowB] = useMemo(() => {
        const a = tools.filter((_, i) => i % 2 === 0);
        const b = tools.filter((_, i) => i % 2 === 1);
        return [a, b];
    }, [tools]);

    if (reducedMotion) {
        return (
            <div>
                <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
                    {tools.map((tool) => <Tile key={tool.name} tool={tool} />)}
                </div>
                {badge && <p className="mt-5 text-center text-[12px] font-mono text-muted-dark">{badge}</p>}
            </div>
        );
    }

    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <style>{`
                @keyframes ws-int-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
                @keyframes ws-int-marquee-rev { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }
            `}</style>
            <div className="flex flex-col gap-4">
                <Row tools={rowA} paused={paused} duration={55} />
                <Row tools={rowB} reverse paused={paused} duration={70} />
            </div>
            {badge && <p className="mt-5 text-center text-[12px] font-mono text-muted-dark">{badge}</p>}
        </div>
    );
}
