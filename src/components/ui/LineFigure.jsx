import React, { useLayoutEffect, useRef } from 'react';
import { relay, hub, settle, format } from '@lucasmarkes/hairline';

/**
 * Figura izometryczna z kreski, reagująca na kursor (pakiet @lucasmarkes/hairline, MIT).
 *
 * - Lekka alternatywa dla ryciny ze skilla anatomy, bez zależności.
 * - Własny wrapper zamiast `@lucasmarkes/hairline/react`: tamten tworzy wszystkie 33 komponenty
 *   wywołaniami bez adnotacji @__PURE__, więc Rollup ciągnie całą paczkę (ok. 63 KB gzip).
 *   Funkcje z głównego wejścia wycinają się: do bundla trafiają tylko figury z FIGURES.
 * - Paleta przez zmienne --hairline-*. Płyty figury są wypełnione kolorem tła
 *   (zasłaniają to, co za nimi), więc `plate` MUSI równać się tłu sekcji.
 * - Jedynym akcentem jest krawędź `hi`: czarna na sage, limonkowa na czarnej sekcji.
 *   Kolor w samej figurze łamie jej reguły (żadnych wypełnień ani poświat).
 * - Kadr 5:4, szerokość z rodzica; przed montażem pusta ramka, bez skoku układu.
 *   Poza ekranem figura nie liczy klatek; prefers-reduced-motion wyłącza autoodtwarzanie.
 * - Odczyt (`onRead`) zwraca krótkie podpisy po angielsku z pakietu ("rest", numery).
 */

const FIGURES = { relay, hub, settle, format };

// Odcienie liczone jako sage przyciemniony do 89/80/62% (na czerni: 16/25/37%),
// w proporcjach jasnego i ciemnego motywu pakietu.
const TONES = {
    sage: {
        '--hairline-plate': '#E6E8DD',
        '--hairline-hi': '#000000',
        '--hairline-edge': '#8F9089',
        '--hairline-mid': '#B8BAB1',
        '--hairline-lo': '#CDCEC5',
    },
    dark: {
        '--hairline-plate': '#000000',
        '--hairline-hi': '#9CE069',
        '--hairline-edge': '#555652',
        '--hairline-mid': '#3A3A37',
        '--hairline-lo': '#252523',
    },
};

export function LineFigure({ figure, tone = 'sage', intensity, play, label, onRead, style, ...props }) {
    const el = useRef(null);
    const instance = useRef(null);
    const read = useRef(onRead);
    const mount = FIGURES[figure];

    useLayoutEffect(() => {
        read.current = onRead;
    });

    // Montaż raz na figurę; zmiany opcji idą do działającej figury przez update().
    useLayoutEffect(() => {
        if (!mount) return undefined;
        const f = mount(el.current, { intensity, play, label, onRead: (text) => read.current?.(text) });
        instance.current = f;
        return () => {
            f.destroy();
            instance.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mount]);

    useLayoutEffect(() => {
        instance.current?.update({ intensity, play, label });
    }, [intensity, play, label]);

    if (!mount) return null;
    return <div ref={el} style={{ aspectRatio: '5 / 4', ...TONES[tone], ...style }} {...props} />;
}

export const LINE_FIGURES = Object.keys(FIGURES);
