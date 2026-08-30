import React, { useMemo, useRef } from 'react';
import { motion as Motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Scroll-scrubbed word reveal (wzór: skiper-ui #70 / nvg8.io).
 * Słowa wyostrzają się w rytmie scrolla; frazy z `highlights` dostają
 * tło lime. Opacity startuje z 0.15, NIE z 0 - tekst musi być czytelny
 * dla crawlera i renderera Google niezależnie od pozycji scrolla.
 * `prefers-reduced-motion` dostaje statyczny akapit z tymi samymi
 * podświetleniami.
 */

const normalize = (word) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/** Indeksy słów objętych którąś z fraz `highlights` (dopasowanie sekwencji słów). */
function markHighlights(words, highlights) {
    const marked = new Array(words.length).fill(false);
    const normWords = words.map(normalize);
    for (const phrase of highlights) {
        const seq = phrase.split(/\s+/).map(normalize).filter(Boolean);
        if (!seq.length) continue;
        for (let i = 0; i <= normWords.length - seq.length; i += 1) {
            if (seq.every((w, j) => normWords[i + j] === w)) {
                for (let j = 0; j < seq.length; j += 1) marked[i + j] = true;
            }
        }
    }
    return marked;
}

/**
 * Sąsiadujące podświetlone słowa sklejają się w jeden ciągły chip:
 * spacja (twarda) wchodzi do środka poprzedniego spana, a stykające się
 * rogi tracą zaokrąglenie. Zewnętrzny separator jest wtedy pomijany.
 */
function highlightClass(marked, i) {
    if (!marked[i]) return '';
    const joinsPrev = i > 0 && marked[i - 1];
    const joinsNext = i < marked.length - 1 && marked[i + 1];
    return [
        'bg-lime/40',
        joinsPrev ? 'rounded-l-none' : 'rounded-l-[4px] pl-1 -ml-px',
        joinsNext ? 'rounded-r-none' : 'rounded-r-[4px] pr-1 -mr-px',
    ].join(' ');
}

const joinsNext = (marked, i) => marked[i] && i < marked.length - 1 && marked[i + 1];

function Word({ progress, range, className, children }) {
    const opacity = useTransform(progress, range, [0.15, 1]);
    return (
        <Motion.span style={{ opacity }} className={`inline-block ${className}`}>
            {children}
        </Motion.span>
    );
}

export function ScrollReveal({ text, highlights = [], className = '' }) {
    const ref = useRef(null);
    const reducedMotion = useReducedMotion();
    const words = useMemo(() => text.split(/\s+/), [text]);
    const marked = useMemo(() => markHighlights(words, highlights), [words, highlights]);

    const { scrollYProgress } = useScroll({
        target: ref,
        // Reveal zaczyna się, gdy akapit wchodzi w dolne 85% viewportu,
        // i kończy zanim dojedzie do połowy - czytelnik nigdy nie czeka na tekst.
        offset: ['start 0.85', 'end 0.55'],
    });

    // U+00A0: zwykla spacja na koncu inline-blocka pada ofiara white-space collapsing.
    const renderWord = (word, i) => (joinsNext(marked, i) ? `${word}\u00A0` : word);
    const separator = (i) => (joinsNext(marked, i) ? '' : ' ');

    if (reducedMotion) {
        return (
            <p className={className}>
                {words.map((word, i) => (
                    <React.Fragment key={i}>
                        <span className={`inline-block ${highlightClass(marked, i)}`}>{renderWord(word, i)}</span>
                        {separator(i)}
                    </React.Fragment>
                ))}
            </p>
        );
    }

    return (
        <p ref={ref} className={className}>
            {words.map((word, i) => (
                <React.Fragment key={i}>
                    <Word
                        progress={scrollYProgress}
                        range={[i / words.length, (i + 1) / words.length]}
                        className={highlightClass(marked, i)}
                    >
                        {renderWord(word, i)}
                    </Word>
                    {separator(i)}
                </React.Fragment>
            ))}
        </p>
    );
}
