import React from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export function BrandSymbol({ 
    type = 'layer-transform', 
    size = 24, 
    className,
    variant = 'gradient' 
}) {
    const renderSymbol = () => {
        const colors = {
            navy: '#0A2540',
            orange: '#ee703d',
            rose: '#cc7cab',
            violet: '#8530d1',
            slate: '#94a3b8'
        };

        const gradientId = `symbol-grad-${type}`;

        switch (type) {
            case 'layer-transform':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
                        <defs>
                            <linearGradient id={gradientId} x1="4" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor={colors.orange} />
                                <stop offset="50%" stopColor={colors.rose} />
                                <stop offset="100%" stopColor={colors.violet} />
                            </linearGradient>
                        </defs>
                        <path d="M4 8L10 6L20 9L14 11L4 8Z" fill={variant === 'gradient' ? colors.slate : 'currentColor'} opacity="0.3" />
                        <path d="M4 12L10 10L20 13L14 15L4 12Z" fill={`url(#${gradientId})`} />
                        <path d="M4 16L10 14L20 17L14 19L4 16Z" fill={variant === 'gradient' ? colors.navy : 'currentColor'} opacity="0.15" />
                    </svg>
                );
            case 'process-scan':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
                        <defs>
                            <linearGradient id={gradientId} x1="4" y1="12" x2="20" y2="12" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor={colors.orange} />
                                <stop offset="100%" stopColor={colors.violet} />
                            </linearGradient>
                        </defs>
                        <path d="M4 12L10 10L20 13L14 15L4 12Z" fill={variant === 'gradient' ? `url(#${gradientId})` : 'currentColor'} />
                        <rect x="2" y="11.5" width="20" height="1" fill={colors.orange} opacity="0.8">
                            <animate attributeName="y" values="6;18;6" duration="3s" repeatCount="indefinite" />
                        </rect>
                    </svg>
                );
            case 'build-blocks':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
                        <path d="M4 7L8 6L14 8L10 9L4 7Z" fill={colors.orange} />
                        <path d="M10 10L14 9L20 11L16 12L10 10Z" fill={colors.rose} />
                        <path d="M4 15L8 14L14 16L10 17L4 15Z" fill={colors.violet} />
                        <path d="M10 18L14 17L20 19L16 20L10 18Z" fill={colors.navy} opacity="0.2" />
                    </svg>
                );
            case 'activity-pulse':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
                        <path d="M4 12L10 10L20 13L14 15L4 12Z" fill={colors.slate} opacity="0.1" />
                        <path d="M3 14H7L9 8L12 16L14 11L16 14H21" stroke={colors.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'flow-pipeline':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
                        <path d="M4 6L8 5L14 7L10 8L4 6Z" fill={colors.slate} opacity="0.2" />
                        <path d="M9 7C9 7 10 14 15 14" stroke={colors.rose} strokeWidth="1.5" strokeDasharray="2 2" />
                        <path d="M10 17L14 16L20 18L16 19L10 17Z" fill={colors.orange} />
                        <circle cx="15" cy="14" r="2" fill={colors.violet} />
                    </svg>
                );
            case 'time-saved':
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
                        <circle cx="12" cy="12" r="9" stroke={colors.slate} strokeWidth="1" opacity="0.2" />
                        <path d="M12 7V12L15 15" stroke={colors.orange} strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 10L10 9L16 11L13 12L7 10Z" fill={colors.violet} transform="translate(4, 4) scale(0.5)" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cn("inline-flex items-center justify-center", className)}>
            {renderSymbol()}
        </div>
    );
}
