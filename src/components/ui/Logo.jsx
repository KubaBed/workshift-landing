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
    const rectFill = isDark ? '#F0F0F2' : '#0A2540';
    const textColorClass = isDark ? 'text-white' : 'text-navy';

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* SVG implementation of the "Stack Shift" motif */}
            <svg width={size} height={size} viewBox="0 0 92 92" fill="none" className="shrink-0">
                {/* Top Layer */}
                <rect x="18" y="20" width="40" height="10" rx="3" fill={rectFill} opacity="0.12" />

                {/* Middle Layer (Shifted right + Gradient) */}
                {/* Brand gradient: Orange (#ee703d) -> Rose (#cc7cab) -> Violet (#8530d1) */}
                <rect x="34" y="41" width="40" height="10" rx="3" fill="url(#ss-logo-grad)" />

                {/* Bottom Layer */}
                <rect x="18" y="62" width="40" height="10" rx="3" fill={rectFill} opacity="0.12" />

                <defs>
                    <linearGradient id="ss-logo-grad" x1="34" y1="46" x2="74" y2="46">
                        <stop offset="0%" stopColor="#ee703d" />
                        <stop offset="50%" stopColor="#cc7cab" />
                        <stop offset="100%" stopColor="#8530d1" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Wordmark */}
            {showWordmark && (
                <span className={`font-bold tracking-tight text-xl ${textColorClass}`} style={{ letterSpacing: '-0.03em' }}>
                    Workshift
                </span>
            )}
        </div>
    );
}
