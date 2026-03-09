import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Gradient Strips Background
 * Inspired by Framer "Gradient Strips BG" component.
 * Renders animated vertical gradient bars with configurable shape,
 * smooth appear animation, subtle pulse, and edge feathering.
 * Adapted for a light (#FFFFFF) hero with #635BFF accent palette.
 */

// Shape functions — control how bar height varies across the strip
const SHAPES = {
    valley: (t) => 0.3 + 0.7 * Math.abs(t * 2 - 1), // tallest at edges
    hill: (t) => 0.3 + 0.7 * (1 - Math.abs(t * 2 - 1)), // tallest at center
    'rounded-hill': (t) => 0.3 + 0.7 * Math.pow(1 - Math.abs(t * 2 - 1), 1.5),
    wave: (t) => 0.5 + 0.5 * Math.sin(t * Math.PI * 2.5),
    'ramp-left': (t) => 0.25 + 0.75 * t,
    'ramp-right': (t) => 0.25 + 0.75 * (1 - t),
    flat: () => 1,
};

// Generate a color along a soft gradient range
function lerpColor(from, to, t) {
    const f = hexToRgb(from);
    const tt = hexToRgb(to);
    const r = Math.round(f.r + (tt.r - f.r) * t);
    const g = Math.round(f.g + (tt.g - f.g) * t);
    const b = Math.round(f.b + (tt.b - f.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
    const v = parseInt(hex.replace('#', ''), 16);
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}

export function GradientStripsBg({
    barCount = 40,
    shape = 'rounded-hill',
    colorFrom = '#c7d2fe',   // indigo-200 (light)
    colorTo = '#635BFF',     // brand purple
    opacity = 0.35,
    blur = 0,
    animate = true,
    feather = true,
    noise = true,
    className = '',
    style = {},
}) {
    const containerRef = useRef(null);
    const shapeFn = SHAPES[shape] || SHAPES['rounded-hill'];

    // Pre-compute bar data
    const bars = useMemo(() => {
        const result = [];
        for (let i = 0; i < barCount; i++) {
            const t = barCount > 1 ? i / (barCount - 1) : 0.5;
            const heightFactor = shapeFn(t);
            // Add a tiny random jitter for organic feel
            const jitter = 0.9 + Math.random() * 0.2;
            const finalHeight = heightFactor * jitter;
            // Color: interpolate with slight hue variation
            const colorT = t + (Math.random() - 0.5) * 0.15;
            const clampedT = Math.max(0, Math.min(1, colorT));
            const color = lerpColor(colorFrom, colorTo, clampedT);
            // Angle variation for natural look
            const angle = 170 + (Math.random() - 0.5) * 30;
            const delay = i * 0.04;

            result.push({ t, heightFactor: finalHeight, color, angle, delay, index: i });
        }
        return result;
    }, [barCount, shape, colorFrom, colorTo]);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden ${className}`}
            style={{ ...style }}
        >
            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-center">
                {bars.map((bar) => (
                    <div
                        key={bar.index}
                        className="flex-1 relative"
                        style={{
                            height: `${bar.heightFactor * 100}%`,
                            animation: animate
                                ? `gradientStripAppear 1.2s ease-out ${bar.delay}s both, ${animate ? `gradientStripPulse 4s ease-in-out ${bar.delay + 1.2}s infinite` : ''
                                }`
                                : undefined,
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(${bar.angle}deg, transparent 0%, ${bar.color} 40%, ${bar.color} 60%, transparent 100%)`,
                                opacity: opacity,
                                filter: blur > 0 ? `blur(${blur}px)` : undefined,
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Edge feather mask */}
            {feather && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'linear-gradient(to right, white 0%, transparent 8%, transparent 92%, white 100%), linear-gradient(to bottom, white 0%, transparent 15%, transparent 75%, white 100%)',
                        backgroundBlendMode: 'multiply',
                    }}
                />
            )}

            {/* Subtle noise overlay */}
            {noise && (
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                        backgroundSize: '128px 128px',
                    }}
                />
            )}

            {/* CSS Keyframes injected via style tag */}
            <style>{`
                @keyframes gradientStripAppear {
                    0% { transform: scaleY(0); opacity: 0; }
                    60% { opacity: 1; }
                    100% { transform: scaleY(1); opacity: 1; }
                }
                @keyframes gradientStripPulse {
                    0%, 100% { transform: scaleY(1); opacity: 1; }
                    50% { transform: scaleY(1.06); opacity: 0.85; }
                }
            `}</style>
        </div>
    );
}
