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

    // In a light environment (white bg), we want navy text and dark opacities.
    // In a dark environment (navy bg), we want white text and light opacities.
    const textColorClass = isDark ? 'text-white' : 'text-navy';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* SVG implementation of the "C1 Parallelogram" motif */}
            <svg width={size} height={size} viewBox="0 0 512 512" fill="none" className="shrink-0 overflow-visible">
                <defs>
                    {/* Top/Bottom Layer Gradient (Subtle) */}
                    <linearGradient id="ss-logo-bg-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stopColor="#f5a273" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#d5a4e7" stopOpacity="0.10" />
                    </linearGradient>

                    {/* Middle Layer Brand Gradient: Orange (#ee703d) -> Rose (#cc7cab) -> Violet (#8530d1) */}
                    <linearGradient id="ss-logo-grad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
                        <stop offset="0%" stopColor="#ee703d" />
                        <stop offset="50%" stopColor="#cc7cab" />
                        <stop offset="100%" stopColor="#8530d1" />
                    </linearGradient>
                </defs>

                {/* Top Layer Parallelogram */}
                <polygon points="141,141 371,141 333,205 103,205" fill="url(#ss-logo-bg-grad)" />

                {/* Middle Layer (Shifted right + Gradient) */}
                <polygon points="192,237 422,237 384,301 154,301" fill="url(#ss-logo-grad)" />

                {/* Bottom Layer Parallelogram */}
                <polygon points="141,333 371,333 333,397 103,397" fill="url(#ss-logo-bg-grad)" />
            </svg>

            {/* Wordmark in Plus Jakarta Sans */}
            {showWordmark && (
                <span className={`font-bold tracking-tight text-xl ${textColorClass}`} style={{ 
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    letterSpacing: '-0.04em' 
                }}>
                    Workshift
                </span>
            )}
        </div>
    );
}
