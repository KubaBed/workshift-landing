import React from 'react';

/**
 * GradientDivider
 * A subtle, signature brand divider representing the shift layers.
 * 3px high, rounded, with the brand's orange-to-violet gradient.
 */
export function GradientDivider({ className = '' }) {
    return (
        <div className={`w-full flex justify-center py-6 md:py-10 ${className}`} role="separator" aria-hidden="true">
            <div className="w-full max-w-[120px] h-[3px] rounded-full"
                style={{
                    background: 'linear-gradient(90deg, #9CE069 0%, #b8e88a 50%, #E6E8DD 100%)',
                    opacity: 0.8
                }}
            />
        </div>
    );
}
