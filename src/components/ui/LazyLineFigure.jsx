import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';

const LineFigure = lazy(() => import('./LineFigure').then((m) => ({ default: m.LineFigure })));

/**
 * LineFigure ładowana dopiero, gdy ramka zbliża się do ekranu.
 *
 * - Pakiet hairline (ok. 13 KB gzip za cztery figury) nie wchodzi do JS potrzebnego
 *   do pierwszego malowania strony. Na stronie (poza /showcase) używaj tego wrappera.
 * - Ramka 5:4 stoi od początku, więc po doładowaniu figury układ nie skacze.
 * - Po zamontowaniu nic więcej nie bramkujemy: figura sama nie liczy klatek poza ekranem.
 * - Propsy idą 1:1 do LineFigure (figure, tone, play, intensity, label).
 */
export function LazyLineFigure({ className, ...props }) {
    const el = useRef(null);
    // Bez IntersectionObserver (stare przeglądarki) figura montuje się od razu.
    const [near, setNear] = useState(() => !('IntersectionObserver' in window));

    useEffect(() => {
        const node = el.current;
        if (!node || near) return undefined;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setNear(true);
                    io.disconnect();
                }
            },
            { rootMargin: '300px 0px' },
        );
        io.observe(node);
        return () => io.disconnect();
    }, [near]);

    return (
        <div ref={el} className={className} style={{ aspectRatio: '5 / 4' }}>
            {near && (
                <Suspense fallback={null}>
                    <LineFigure {...props} />
                </Suspense>
            )}
        </div>
    );
}
