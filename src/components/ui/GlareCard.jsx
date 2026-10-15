import React from 'react';

/** Biała karta bento (siatka usług na stronie głównej i rozwinięty widok strony usługi). */
export function GlareCard({ children, className, onClick, isExpanded }) {
    return (
        <div
            onClick={onClick}
            className={`relative ${!isExpanded ? 'cursor-pointer hover:shadow-md hover:border-black/15' : ''} bg-white border border-black/10 shadow-sm rounded-[10px] overflow-hidden flex flex-col transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}
