import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Wyciszony film z nagrania Szkicu: AV1 (lżejszy) z zapasem H.264 dla przeglądarek bez AV1.
 * `src` bez rozszerzenia: oczekuje plików `<src>-av1.mp4` i `<src>.mp4` w public/.
 * Gra w pętli tylko na ekranie; przy prefers-reduced-motion stoi na kadrze startowym z kontrolkami.
 */
export function SzkicVideo({ src, poster, label, className = '' }) {
    const reduce = useReducedMotion();
    const ref = useRef(null);

    useEffect(() => {
        const video = ref.current;
        if (!video || reduce) return undefined;
        const io = new IntersectionObserver(
            ([entry]) => (entry.isIntersecting ? video.play().catch(() => {}) : video.pause()),
            { threshold: 0.25 },
        );
        io.observe(video);
        return () => io.disconnect();
    }, [reduce, src]);

    return (
        <video
            ref={ref}
            className={className}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            controls={reduce}
            aria-label={label}
        >
            <source src={`${src}-av1.mp4`} type='video/mp4; codecs="av01.0.05M.08"' />
            <source src={`${src}.mp4`} type="video/mp4" />
        </video>
    );
}
