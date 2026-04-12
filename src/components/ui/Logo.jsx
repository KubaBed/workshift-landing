import React from 'react';

/**
 * Stack Shift Brand Logo Component
 * Based on v3 Brand Bible.
 *
 * @param {object} props
 * @param {'light'|'dark'} props.variant - Sets the text color and layer opacities. Use 'light' for white backgrounds (dark text), 'dark' for navy backgrounds (white text).
 * @param {boolean} props.showWordmark - Whether to display the text "Workshift" next to the logo.
 * @param {string} props.className - Additional classes for the wrapper.
 * @param {number} props.size - Size of the SVG icon.
 */
export function Logo({ variant = 'light', showWordmark = true, className = '', size = 36 }) {
    const isDark = variant === 'dark';

    // Project uses solid black for text instead of navy
    const textColorClass = isDark ? 'text-white' : 'text-black';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* SVG implementation of the "C1 Parallelogram" motif */}
            <svg width={size} height={size} viewBox="0 0 512 512" fill="none" className="shrink-0 overflow-visible">
                <defs>
                    {/* Top/Bottom Layer Gradient (Subtle Workshift darks) */}
                    <linearGradient id="ss-logo-bg-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stopColor="#000000" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0.05" />
                    </linearGradient>

                    {/* Middle Layer Brand Gradient: Workshift Lime */}
                    <linearGradient id="ss-logo-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stopColor="#9CE069" />
                        <stop offset="100%" stopColor="#81c44e" />
                    </linearGradient>
                </defs>

                {/* Top Layer Parallelogram */}
                <polygon points="141,141 371,141 333,205 103,205" fill="url(#ss-logo-bg-grad)" />

                {/* Middle Layer (Shifted right + Gradient) */}
                <polygon points="192,237 422,237 384,301 154,301" fill="url(#ss-logo-grad)" />

                {/* Bottom Layer Parallelogram */}
                <polygon points="141,333 371,333 333,397 103,397" fill="url(#ss-logo-bg-grad)" />
            </svg>

            {/* Wordmark in Inter (inherited from body/font-display) */}
            {showWordmark && (
                <span className={`font-bold font-display tracking-tight text-xl ${textColorClass}`} style={{ 
                    letterSpacing: '-0.04em' 
                }}>
                    Workshift
                </span>
            )}
        </div>
    );
}
