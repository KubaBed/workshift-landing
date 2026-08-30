import React from 'react';
import { motion as Motion } from 'framer-motion';

/**
 * Animowane ikony procesów (wzór: heroicons-animated.com).
 * Ścieżki wzięte z lucide (ta sama siatka 24px, stroke 2), animacje
 * framer-motion sterowane propem `active` - karta-rodzic decyduje,
 * kiedy ikona "budzi się" (hover albo pierwsze wejście w viewport).
 * Same SVG - zero dodatkowych zależności, animują się transform
 * i pathLength (compositing, tanie na mobile).
 */

const svgProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
};

const drawLine = (delay) => ({
    idle: { pathLength: 1 },
    active: {
        pathLength: [0, 1],
        transition: { duration: 0.45, delay, ease: 'easeOut' },
    },
});

/** Faktura: dokument stoi, linie tekstu "dopisują się" po kolei. */
function InvoiceIcon({ active }) {
    return (
        <Motion.svg {...svgProps} animate={active ? 'active' : 'idle'} initial={false}>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <Motion.path d="M8 13h8" variants={drawLine(0)} />
            <Motion.path d="M8 17h5" variants={drawLine(0.12)} />
        </Motion.svg>
    );
}

/** Synchronizacja: strzałki robią pół obrotu i wracają na miejsce. */
function SyncIcon({ active }) {
    return (
        <Motion.svg
            {...svgProps}
            initial={false}
            animate={active ? { rotate: 180 } : { rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
            <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
            <path d="M3 21v-5h5" />
        </Motion.svg>
    );
}

/** Raport: słupki rosną od osi, od najniższego do najwyższego. */
function ReportIcon({ active }) {
    const bar = (delay) => ({
        idle: { pathLength: 1 },
        active: {
            pathLength: [0, 1],
            transition: { duration: 0.4, delay, ease: 'easeOut' },
        },
    });
    return (
        <Motion.svg {...svgProps} animate={active ? 'active' : 'idle'} initial={false}>
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <Motion.path d="M7 16v-3" variants={bar(0)} />
            <Motion.path d="M12 16v-6" variants={bar(0.1)} />
            <Motion.path d="M17 16v-9" variants={bar(0.2)} />
        </Motion.svg>
    );
}

/** Eskalacja: dzwonek kołysze się raz i uspokaja. */
function AlertIcon({ active }) {
    return (
        <Motion.svg
            {...svgProps}
            initial={false}
            style={{ originX: 0.5, originY: 0.15 }}
            animate={active ? { rotate: [0, -14, 11, -7, 4, 0] } : { rotate: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </Motion.svg>
    );
}

/** Zegar: wskazówki robią pełny obrót. */
function ClockIcon({ active }) {
    return (
        <Motion.svg {...svgProps} initial={false}>
            <circle cx="12" cy="12" r="10" />
            <Motion.path
                d="M12 6v6l4 2"
                style={{ originX: '12px', originY: '12px' }}
                animate={active ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
        </Motion.svg>
    );
}

/** Skrzynka: strzałka wpada do tacki. */
function InboxIcon({ active }) {
    return (
        <Motion.svg {...svgProps} initial={false}>
            <path d="M22 12h-6l-2 3h-4l-2-3H2" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            <Motion.g
                animate={active ? { y: [-6, 0], opacity: [0, 1] } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <path d="M12 7v4" />
                <path d="m10 9.5 2 2 2-2" />
            </Motion.g>
        </Motion.svg>
    );
}

const ICONS = {
    invoice: InvoiceIcon,
    sync: SyncIcon,
    report: ReportIcon,
    alert: AlertIcon,
    clock: ClockIcon,
    inbox: InboxIcon,
};


export function AnimatedProcessIcon({ name, active = false }) {
    const Icon = ICONS[name];
    if (!Icon) return null;
    return <Icon active={active} />;
}
