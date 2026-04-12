import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, Play, Pause, X, Zap, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Logo } from './ui/Logo';
import { Floating } from './animations/Floating';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { ThreeDMarquee } from './ui/ThreeDMarquee';
import PhoneMockupCard from './PhoneMockupCard';
import anthropicLogo from '../assets/logos/anthropic.png';
import claudeLogo from '../assets/logos/claude.png';
import copilotLogo from '../assets/logos/copilot.png';
import deepseekLogo from '../assets/logos/deepseek.png';
import grokLogo from '../assets/logos/grok.png';
import lovableLogo from '../assets/logos/lovable.png';
import n8nLogo from '../assets/logos/n8n.png';
import openaiLogo from '../assets/logos/openai.png';
import perplexityLogo from '../assets/logos/perplexity.png';
import replitLogo from '../assets/logos/replit.png';

// --- EFFECTS & REUSABLE WRAPPERS ---

function ParticleBlur({ position }) {
    const positions = {
        'top-right': '-top-12 -right-12',
        'bottom-left': '-bottom-12 -left-12',
        'bottom-right': '-bottom-12 -right-12',
        'top-left': '-top-12 -left-12',
    };

    return (
        <div className={`absolute ${positions[position]} w-56 h-56 pointer-events-none z-0 opacity-30`}>
            <div className="absolute inset-0 rounded-full bg-lime/25 blur-3xl" />
            <div className="absolute inset-4 rounded-full bg-lime/15 blur-2xl translate-x-4" />
            <div className="absolute inset-8 rounded-full bg-lime/20 blur-xl -translate-x-2 translate-y-2" />
        </div>
    );
}

function GlareCard({ children, className, onClick, isExpanded }) {
    return (
        <div
            onClick={onClick}
            className={`relative ${!isExpanded ? 'cursor-pointer hover:shadow-md hover:border-black/15' : ''} bg-white border border-black/10 shadow-sm rounded-[10px] overflow-hidden flex flex-col transition-all duration-300 ${className}`}
        >
            {children}
        </div>
    );
}

// ─── Orbit Hub: half-visible cropped layout (ruixen-style) ────────────────
const ORBIT_ICONS = [
    // Ring 1 (inner, 4 icons)
    { label: 'Gmail',    color: '#EA4335', ring: 0, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
    { label: 'Slack',    color: '#4A154B', ring: 0, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="18" height="18"><path strokeLinecap="round" d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5zM9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5zM14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5zM10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/></svg> },
    { label: 'Excel',    color: '#217346', ring: 0, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> },
    { label: 'CRM',      color: '#000', ring: 0, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg> },
    // Ring 2 (mid, 5 icons)
    { label: 'Calendar', color: '#1a73e8', ring: 1, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg> },
    { label: 'n8n',      color: '#ea6b00', ring: 1, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path strokeLinecap="round" d="M7 12h10"/><circle cx="12" cy="6" r="2"/><path strokeLinecap="round" d="M12 8v4"/></svg> },
    { label: 'Docs',     color: '#4285F4', ring: 1, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg> },
    { label: 'API',      color: '#d946ef', ring: 1, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg> },
    { label: 'Chat',     color: '#0ea5e9', ring: 1, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
    // Ring 3 (outer, 6 icons)
    { label: 'Zapier',   color: '#FF4A00', ring: 2, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
    { label: 'Teams',    color: '#6264A7', ring: 2, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20H7a2 2 0 01-2-2v-2a4 4 0 014-4h6a4 4 0 014 4v2a2 2 0 01-2 2z"/><circle cx="12" cy="7" r="3"/></svg> },
    { label: 'Drive',    color: '#0F9D58', ring: 2, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l3-6 3 6M15 11l-3-6-3 6M21 17H3M9 17l6-12"/></svg> },
    { label: 'Webhook',  color: '#6366f1', ring: 2, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14"><circle cx="12" cy="12" r="3"/><path strokeLinecap="round" d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg> },
    { label: 'Notion',   color: '#000000', ring: 2, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg> },
    { label: 'Office',   color: '#D83B01', ring: 2, icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="14" height="14"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h6v16H4zM14 8h6v12h-6zM14 4h6v2h-6z"/></svg> },
];

const RING_CONFIGS = [
    { radius: 90,  speed: 12, iconSize: 34, borderW: '1.5px dashed rgba(0,0,0,0.1)' },
    { radius: 148, speed: 18, iconSize: 30, borderW: '1.5px dashed rgba(0,0,0,0.1)' },
    { radius: 210, speed: 24, iconSize: 26, borderW: '1.5px dashed rgba(0,0,0,0.1)' },
];

function AutomationPreview() {
    const icons = [
        ORBIT_ICONS.filter(i => i.ring === 0),
        ORBIT_ICONS.filter(i => i.ring === 1),
        ORBIT_ICONS.filter(i => i.ring === 2),
    ];

    return (
        <div className="w-full h-full relative overflow-visible pointer-events-none select-none pt-12 -mt-12" style={{ minHeight: 200 }}>
            <style>{`
                @keyframes hs-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes ws-hub-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(238,112,61,0); } 50% { box-shadow: 0 0 28px 6px rgba(238,112,61,0.18); } }
            `}</style>
            
            {/* Orbit system - center pushed to right edge (50% translateX) so only left half visible */}
            <div style={{
                position: 'absolute',
                top: '50%', right: 0,
                transform: 'translate(50%, -50%)',
                width: 500, height: 500,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {/* Rings */}
                {RING_CONFIGS.map((ring, ri) => (
                    <div key={ri} style={{
                        position: 'absolute',
                        width: ring.radius * 2, height: ring.radius * 2,
                        borderRadius: '50%',
                        border: ring.borderW,
                        animation: `hs-spin ${ring.speed}s linear infinite`,
                        transformOrigin: 'center',
                        willChange: 'transform',
                    }}>
                        {icons[ri].map((item, ii) => {
                            const angle = (ii / icons[ri].length) * (2 * Math.PI);
                            const x = ring.radius + ring.radius * Math.cos(angle) - ring.iconSize / 2;
                            const y = ring.radius + ring.radius * Math.sin(angle) - ring.iconSize / 2;
                            return (
                                <div key={item.label} style={{
                                    position: 'absolute', left: x, top: y,
                                    width: ring.iconSize, height: ring.iconSize,
                                    borderRadius: '50%',
                                    background: 'white',
                                    border: `1px solid ${item.color}22`,
                                    boxShadow: `0 2px 8px ${item.color}18`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: item.color,
                                    /* counter-rotate so icon stays upright */
                                    animation: `hs-spin ${ring.speed}s linear infinite reverse`,
                                    transformOrigin: 'center',
                                    willChange: 'transform',
                                }}>
                                    {item.icon}
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* Central Workshift hub */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    width: 72, height: 72,
                    borderRadius: '50%',
                    background: 'white',
                    border: '2px solid rgba(156,224,105,0.3)',
                    animation: 'ws-hub-pulse 3s ease-in-out infinite',
                    willChange: 'transform, box-shadow',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Logo size={40} showWordmark={false} />
                    <span style={{ fontSize: 7, fontWeight: 800, letterSpacing: '0.05em', color: '#000', marginTop: 1, fontFamily: 'Inter' }}>WORKSHIFT</span>
                </div>
            </div>
        </div>
    );
}

function AuditPreview() {
    const mainColor = '#9CE069';
    const secondaryColor = '#d5a4e7';

    // Bar data: default state and hover state
    const barsData = [
        { w: 15, h: 20, y: 130, hH: 20, hY: 140, fill: 'default', hFill: 'secondary' },
        { w: 15, h: 30, y: 110, hH: 35, hY: 125, fill: 'main', hFill: 'main' },
        { w: 15, h: 45, y: 95, hH: 30, hY: 130, fill: 'main', hFill: 'main' },
        { w: 15, h: 35, y: 105, hH: 55, hY: 105, fill: 'main', hFill: 'main' },
        { w: 15, h: 25, y: 125, hH: 40, hY: 120, fill: 'default', hFill: 'secondary' },
        { w: 15, h: 50, y: 100, hH: 25, hY: 135, fill: 'default', hFill: 'secondary' },
        { w: 15, h: 60, y: 80, hH: 40, hY: 120, fill: 'main', hFill: 'main' },
        { w: 15, h: 35, y: 105, hH: 20, hY: 140, fill: 'main', hFill: 'main' },
        { w: 15, h: 20, y: 130, hH: 50, hY: 110, fill: 'default', hFill: 'secondary' },
        { w: 15, h: 45, y: 95, hH: 65, hY: 95, fill: 'main', hFill: 'main' },
        { w: 15, h: 30, y: 120, hH: 75, hY: 85, fill: 'default', hFill: 'secondary' },
        { w: 15, h: 55, y: 95, hH: 55, hY: 105, fill: 'default', hFill: 'secondary' },
        { w: 15, h: 25, y: 125, hH: 85, hY: 75, fill: 'default', hFill: 'secondary' },
        { w: 15, h: 40, y: 100, hH: 95, hY: 65, fill: 'main', hFill: 'main' },
    ];

    const getFill = (type) => {
        if (type === 'main') return mainColor;
        if (type === 'secondary') return secondaryColor;
        return 'rgba(148, 163, 184, 0.15)'; // default: subtle slate
    };

    return (
        <div className="relative w-full max-w-[356px] h-[220px] md:h-[240px] overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-lg
                        group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-500 will-change-transform">

            {/* Grid overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-[4] h-full w-full bg-transparent opacity-50"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    backgroundPosition: 'center',
                    maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 60%, transparent 100%)',
                }}
            />

            {/* Radial gradient glow */}
            <div className="absolute inset-0 z-[5] flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 356 220" fill="none" preserveAspectRatio="none">
                    <rect width="356" height="220" fill="url(#auditGlow)" />
                    <defs>
                        <radialGradient id="auditGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(178 140) rotate(90) scale(100 178)">
                            <stop stopColor={mainColor} stopOpacity="0.2" />
                            <stop offset="0.4" stopColor={mainColor} stopOpacity="0.08" />
                            <stop offset="1" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Stat badges - fade out on hover */}
            <div className="absolute top-3 left-3 z-[9] flex items-center gap-1.5 transition-opacity duration-300 group-hover:opacity-0">
                <div className="flex items-center rounded-full border border-slate-200 bg-white/60 px-2 py-0.5 backdrop-blur-sm">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: mainColor }} />
                    <span className="ml-1.5 text-[10px] font-bold text-black">+32%</span>
                </div>
                <div className="flex items-center rounded-full border border-slate-200 bg-white/60 px-2 py-0.5 backdrop-blur-sm">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                    <span className="ml-1.5 text-[10px] font-bold text-black">+18,7%</span>
                </div>
            </div>

            {/* Hover tooltip - slides up on hover */}
            <div className="absolute inset-0 z-[7] flex items-start justify-center p-4
                            translate-y-full group-hover:translate-y-0
                            transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]">
                <div className="rounded-lg border border-slate-200 bg-white/70 p-2.5 backdrop-blur-sm
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: mainColor }} />
                        <p className="text-xs font-bold text-black">Potencjał oszczędności</p>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">Zidentyfikowaliśmy 32% czasu do odzyskania.</p>
                </div>
            </div>

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 z-[6] translate-y-full opacity-0
                            group-hover:translate-y-0 group-hover:opacity-100
                            transition-all duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]">
                <svg width="100%" height="100%" viewBox="0 0 356 220" fill="none" preserveAspectRatio="none">
                    <rect width="356" height="220" fill="url(#auditHoverGrad)" />
                    <defs>
                        <linearGradient id="auditHoverGrad" x1="178" y1="0" x2="178" y2="220" gradientUnits="userSpaceOnUse">
                            <stop offset="0.35" stopColor={mainColor} stopOpacity="0" />
                            <stop offset="1" stopColor={mainColor} stopOpacity="0.25" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Animated bars  */}
            <div className="absolute inset-0 z-[8] flex items-center justify-center
                            group-hover:scale-[1.15] transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]">
                <svg width="356" height="180" viewBox="0 0 356 180" xmlns="http://www.w3.org/2000/svg" className="mt-4">
                    {barsData.map((bar, i) => (
                        <rect
                            key={i}
                            width={bar.w}
                            x={30 + i * 21}
                            rx="2" ry="2"
                            className="transition-all duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]"
                            style={{
                                height: bar.h,
                                y: bar.y,
                                fill: getFill(bar.fill),
                            }}
                        >
                            {/* CSS can't animate SVG y/height attrs, so we use two-state approach with group-hover in the style */}
                        </rect>
                    ))}
                </svg>

                {/* Hidden duplicate that shows on hover with different values */}
                <svg width="356" height="180" viewBox="0 0 356 180" xmlns="http://www.w3.org/2000/svg"
                    className="absolute mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {barsData.map((bar, i) => (
                        <rect
                            key={i}
                            width={bar.w}
                            height={bar.hH}
                            x={30 + i * 21}
                            y={bar.hY}
                            rx="2" ry="2"
                            fill={getFill(bar.hFill)}
                            className="transition-all duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]"
                        />
                    ))}
                </svg>
            </div>

            {/* Branding tag */}
            <div className="absolute bottom-3 left-3 z-[10] flex items-center gap-1.5">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center">
                    <span className="text-white text-[7px] font-bold">W</span>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Audyt AI</span>
            </div>

            <ParticleBlur position="top-right" />
        </div>
    );
}

function DisplayCard({
  className,
  icon = <Sparkles className="w-4 h-4 text-accent" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-accent",
  titleClassName = "text-black",
}) {
  return (
    <div
      className={cn(
        "relative flex h-32 w-64 select-none flex-col justify-between rounded-2xl border border-slate-200/60 bg-white/95 backdrop-blur-sm px-5 py-4 transition-all duration-500 hover:border-accent/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 shadow-sm border border-slate-100">
          {icon}
        </span>
        <p className={cn("text-sm font-semibold tracking-tight", titleClassName)}>{title}</p>
      </div>
      <div className="mt-1 text-left">
        <p className="text-[13px] text-slate-600 font-medium leading-tight">{description}</p>
      </div>
      <div className="mt-auto text-left">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{date}</p>
      </div>
    </div>
  );
}

function TrainingPreview() {
  const cards = [
    {
      title: "Prompt Engineering",
      description: "Pisz instrukcje docelowe",
      date: "Wprowadzenie",
      icon: <Sparkles className="w-4 h-4 text-accent" />,
      className: "[grid-area:stack] z-30 translate-x-0 translate-y-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] group-hover/bento:-translate-y-2 group-hover/bento:-translate-x-2 transition-all duration-500",
    },
    {
      title: "Bezpieczeństwo AI",
      description: "Ochrona danych firmy",
      date: "Dobre praktyki",
      icon: <Sparkles className="w-4 h-4 text-accent-light" />,
      className: "[grid-area:stack] z-20 translate-x-4 -translate-y-6 opacity-90 shadow-md group-hover/bento:translate-x-6 group-hover/bento:-translate-y-8 group-hover/bento:opacity-100 transition-all duration-500 group-hover/bento:rotate-2",
    },
    {
      title: "Narzędzia GenAI",
      description: "Automatyzacja zadań",
      date: "Poziom średnio.",
      icon: <Sparkles className="w-4 h-4 text-slate-400" />,
      className: "[grid-area:stack] z-10 translate-x-8 -translate-y-12 opacity-80 shadow-sm group-hover/bento:translate-x-12 group-hover/bento:-translate-y-14 group-hover/bento:opacity-100 transition-all duration-500 group-hover/bento:rotate-3",
    },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center relative mt-8 pr-8">
      <div className="grid [grid-template-areas:'stack'] place-items-center">
        {cards.map((cardProps, index) => (
          <Floating 
            key={index} 
            duration={4 + index} 
            amplitude={10 + index * 5} 
            delay={index * 0.5}
            className="[grid-area:stack]"
          >
            <DisplayCard {...cardProps} />
          </Floating>
        ))}
      </div>
    </div>
  );
}

function AgentPreview() {
    const containerRef = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 85%",
                }
            });
            tl.fromTo(".gsap-chat-1", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 })
              .fromTo(".gsap-chat-typing", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "+=0.1")
              .to(".gsap-chat-typing", { opacity: 0, duration: 0.2 }, "+=0.3")
              .fromTo(".gsap-chat-2", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 })
              .fromTo(".gsap-chat-3", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, "+=0.3")
              .fromTo(".gsap-chat-4", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, "+=0.3")
              .fromTo(".gsap-chat-5", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, "+=0.3");
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // -40px broke out to fill 100% of card width.
    // +10px on each side = phone is 75% of that (shrunk 25%).
    const AVATAR = (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #9CE069, #7ab84e)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white"><path d="M8 1a3 3 0 100 6 3 3 0 000-6zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z" fillRule="evenodd"/></svg>
        </div>
    );
    const AVATAR_SPACER = <div style={{ width: 32, height: 32, flexShrink: 0 }} />;

    // Waveform bars for audio message
    const WAVE_BARS = [4,7,12,9,14,11,8,13,10,7,11,9,13,8,5,10,12,7,9,11];

    return (
        <div ref={containerRef} className="w-full h-full flex items-start justify-center pt-6 px-4">
            <Floating duration={6} amplitude={12} rotation={2}>
                <PhoneMockupCard className="shadow-2xl will-change-transform">
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', margin: '-24px -24px -64px -24px' }}>
                        {/* App header bar */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '16px 16px 10px',
                            borderBottom: '1px solid #f0f4f8',
                            background: 'rgba(255,255,255,0.97)',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                        }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #9CE069, #7ab84e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M8 1a3 3 0 100 6 3 3 0 000-6zM2 14s-1 0-1-1 1-4 7-4 7 3 7 4-1 1-1 1H2z" fillRule="evenodd"/></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#000', margin: 0, fontFamily: 'Inter, system-ui' }}>Agent Workshift</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                                    <p style={{ fontSize: 10, color: '#64748b', margin: 0, fontFamily: 'Inter, system-ui' }}>Dostępny teraz</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat feed */}
                        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, background: '#f8fafc', height: '100%', overflowY: 'hidden', paddingBottom: '32px' }}>
                            {/* Timestamp */}
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'Inter, system-ui', background: '#e2e8f0', borderRadius: 99, padding: '2px 8px' }}>Dzisiaj, 14:32</span>
                            </div>

                            {/* User msg 1 */}
                            <div className="gsap-chat-1" style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0 }}>
                                <div style={{ background: '#000', borderRadius: '16px 16px 4px 16px', padding: '8px 12px', maxWidth: '78%' }}>
                                    <p style={{ fontSize: 12, color: '#fff', fontWeight: 500, lineHeight: 1.4, margin: 0, fontFamily: 'Inter, system-ui' }}>Potrzebuję fakturę za luty dla XYZ Sp. z o.o.</p>
                                </div>
                            </div>

                            {/* Typing */}
                            <div className="gsap-chat-typing" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 6, opacity: 0 }}>
                                {AVATAR}
                                <div style={{ background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '8px 12px', border: '1px solid #e2e8f0', display: 'flex', gap: 4, alignItems: 'center' }}>
                                    {[0, 150, 300].map(d => <span key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animationDelay: `${d}ms` }} className="animate-bounce" />)}
                                </div>
                            </div>

                            {/* Agent reply 1 */}
                            <div className="gsap-chat-2" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 6, opacity: 0 }}>
                                {AVATAR}
                                <div style={{ background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '8px 12px', maxWidth: '75%', border: '1px solid #e8f4e8' }}>
                                    <p style={{ fontSize: 12, color: '#000', fontWeight: 500, lineHeight: 1.45, margin: 0, fontFamily: 'Inter, system-ui' }}>
                                        Znalazłem FV/02/2026 🎉<br/>
                                        <strong>4 230 PLN</strong> netto<br/>
                                        <span style={{ color: '#22c55e', fontWeight: 600 }}>✓ Wysłano na jan@xyz.pl</span>
                                    </p>
                                </div>
                            </div>

                            {/* User msg 2 */}
                            <div className="gsap-chat-3" style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0 }}>
                                <div style={{ background: '#000', borderRadius: '16px 16px 4px 16px', padding: '8px 12px', maxWidth: '65%' }}>
                                    <p style={{ fontSize: 12, color: '#fff', fontWeight: 500, lineHeight: 1.4, margin: 0, fontFamily: 'Inter, system-ui' }}>Świetnie! A kiedy wpłynęła płatność?</p>
                                </div>
                            </div>

                            {/* Agent - audio waveform message */}
                            <div className="gsap-chat-4" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', gap: 6, opacity: 0 }}>
                                {AVATAR}
                                <div style={{ background: 'linear-gradient(135deg, rgba(238,112,61,0.08), rgba(133,48,209,0.08))', borderRadius: '16px 16px 16px 4px', padding: '8px 12px', border: '1px solid rgba(133,48,209,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {/* Play button */}
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #9CE069, #7ab84e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <svg width="10" height="11" viewBox="0 0 10 12" fill="white"><path d="M1 1l8 5-8 5V1z"/></svg>
                                    </div>
                                    {/* Waveform */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 24 }}>
                                        {WAVE_BARS.map((h, i) => (
                                            <div key={i} style={{ width: 2.5, height: h, background: i < 12 ? 'linear-gradient(to top, #9CE069, #7ab84e)' : '#cbd5e1', borderRadius: 2, opacity: i < 12 ? 1 : 0.6 }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 10, color: '#64748b', fontFamily: 'Inter, system-ui', whiteSpace: 'nowrap' }}>0:23</span>
                                </div>
                            </div>

                            {/* User final reply */}
                            <div className="gsap-chat-5" style={{ display: 'flex', justifyContent: 'flex-end', opacity: 0 }}>
                                <div style={{ background: '#000', borderRadius: '16px 16px 4px 16px', padding: '8px 12px' }}>
                                    <p style={{ fontSize: 12, color: '#fff', fontWeight: 500, lineHeight: 1.4, margin: 0, fontFamily: 'Inter, system-ui' }}>Dzięki! 👌</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </PhoneMockupCard>
            </Floating>
        </div>
    );
}
function CreativePreview() {
    return (
        <div className="w-full h-full flex items-start justify-center overflow-hidden relative -mt-4">
            <ThreeDMarquee className="w-full" />
            <ParticleBlur position="bottom-right" />
        </div>
    );
}

// --- DATA STRUCTURE & EXPANDED BENTO BUILDER ---

const SERVICES = [
    {
        id: 'automatyzacja',
        title: 'Automatyzacja procesów',
        tagline: 'Twój zespół odzyskuje 10h+ na każdego pracownika. Pracujcie, a maszyna wpisuje sama.',
        colSpan: 'lg:col-span-6',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',
        Preview: AutomationPreview,

        categoryTag: 'Nasza flagowa usługa',
        expandedTitle: 'Twoje narzędzia, jeden płynny przepływ.',
        expandedDescription: 'Zamiast ręcznie kopiować dane z maila do arkusza, z arkusza do CRM-a, a z CRM-a do systemu fakturowego - budujemy automatyczny pipeline, który robi to za Ciebie. Używamy n8n, Make i dedykowanych skryptów, które wpinają się w to, jak już pracujesz. Bez zmiany przyzwyczajeń, bez wdrażania nowego "systemu". Po prostu - dane płyną same.',
        heroMetric: { value: '10h+', label: 'oszczędności na pracowniku tygodniowo - średnia z naszych wdrożeń', subtext: 'Przy zespole 5-osobowym to 200h+ miesięcznie.' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Co automatyzujemy',
                items: [
                    'Obieg faktur - od maila do księgowości',
                    'Synchronizacja CRM ↔ mail ↔ kalendarz',
                    'Generowanie raportów z danych rozproszonych w narzędziach',
                    'Powiadomienia i eskalacje (np. niezapłacona faktura → alert dla CFO)',
                ],
            },
            {
                type: 'process',
                colSpan: 'lg:col-span-4',
                label: '3 kroki do pierwszego workflow',
                steps: [
                    { num: '01', title: 'Mapujemy', desc: 'Pokazujesz nam, jak dziś wygląda proces (1 spotkanie, 30 min).' },
                    { num: '02', title: 'Budujemy', desc: 'Tworzymy workflow i testujemy na Twoich danych (1-2 tygodnie).' },
                    { num: '03', title: 'Odpalamy', desc: 'Workflow działa, Ty dostajesz dashboard z wynikami.' },
                ]
            },
            {
                type: 'stack',
                colSpan: 'lg:col-span-4',
                label: 'Narzędzia, których używamy',
                subtitle: 'Integrujemy się z 200+ narzędziami.',
                tools: ['n8n', 'Make', 'Zapier', 'Google Workspace', 'Slack', 'API'] // placeholders for logos
            },
            {
                type: 'case',
                colSpan: 'lg:col-span-8',
                label: 'Przykład wdrożenia',
                title: 'Firma produkcyjna, 30 osób',
                content: 'Dział księgowości przepisywał dane z 80+ faktur tygodniowo ręcznie z maili do systemu. Wdrożyliśmy pipeline: mail przychodzący → OCR (AI odczytuje fakturę) → automatyczna kategoryzacja → zapis w systemie FK. Czas operacji spadł z 2 dni roboczych do 15 minut.',
                beforeAfter: { before: '16h / tydz.', after: '0.5h / tydz.' }
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zautomatyzuj pierwszy proces',
                subline: 'Bezpłatna diagnoza - pokażemy Quick Win w 30 minut.',
                ctaLabel: 'Umów rozmowę',
            },
        ],
    },
    {
        id: 'audyt',
        title: 'Audyt i Strategia AI',
        tagline: 'Powiemy Ci gdzie tracisz czas - zanim napiszemy jedną linijkę kodu.',
        colSpan: 'lg:col-span-6',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',
        Preview: AuditPreview,

        categoryTag: 'Krok pierwszy',
        expandedTitle: 'Zanim zaczniemy budować - musimy wiedzieć, co budować.',
        expandedDescription: 'Nie sprzedajemy technologii na ślepo. Najpierw siadamy z Tobą na 30-minutową diagnozę, mapujemy jak wyglądają Twoje procesy, rozmawiamy z zespołem, i wskazujemy 2-3 miejsca, gdzie automatyzacja da najszybszy, policzalny zwrot. Bez tego kroku - reszta to strzały w ciemno.',
        heroMetric: { value: '32%', label: 'średni potencjał oszczędności czasu, który identyfikujemy u klientów MŚP', subtext: 'U niektórych firm to 50+ godzin miesięcznie.' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-6',
                label: 'Co dostajesz po audycie',
                items: [
                    'Mapę przepływu pracy Twojej firmy (workflow diagram)',
                    'Listę zidentyfikowanych wąskich gardeł z priorytetyzacją',
                    'Szacunek ROI - ile czasu / pieniędzy odzyskasz per automatyzacja',
                    'Roadmapę: co wdrożyć najpierw, co może poczekać',
                ],
            },
            {
                type: 'timeline',
                colSpan: 'lg:col-span-6',
                label: 'Jak to wygląda',
                steps: [
                    { title: 'Dzień 1', desc: 'Diagnoza online (30 min, darmowa)' },
                    { title: 'Tydzień 1', desc: 'Wywiady z zespołem + mapowanie procesów' },
                    { title: 'Tydzień 2', desc: 'Dostajesz raport z roadmapą i Quick Wins' },
                ]
            },
            {
                type: 'insights',
                colSpan: 'lg:col-span-8',
                label: 'Co najczęściej znajdujemy u klientów',
                cards: [
                    { icon: '🕐', title: 'Ręczne przepisywanie danych', desc: 'Pracownicy kopiują te same dane między 3-4 narzędziami. Często 5-8h/tydzień.' },
                    { icon: '📧', title: 'Chaos w skrzynkach', desc: 'Zlecenia, faktury, pytania klientów - wszystko w jednym inboxie, bez filtrów.' },
                    { icon: '📊', title: 'Raporty robione ręcznie', desc: 'Comiesięczne zestawienia składane z 5 źródeł w arkuszu. 2 dni pracy.' }
                ]
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zacznij od darmowej diagnozy',
                subline: '30 minut Twojego czasu. Zero zobowiązań. Konkretne rekomendacje od razu.',
                ctaLabel: 'Umów diagnozę',
            },
        ],
    },
    {
        id: 'szkolenia',
        title: 'Szkolenia AI',
        tagline: 'Zbuduj zespół operacyjny odporny na przyszłość. Praktyczny warsztat, odwracający opór przed AI w chęć do pracy.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',
        Preview: TrainingPreview,

        categoryTag: 'Rozwój zespołu',
        expandedTitle: 'Twój zespół nie boi się AI. Po prostu nikt im nie pokazał, jak korzystać.',
        expandedDescription: 'Nie robimy wykładów. Robimy warsztaty, na których Twój zespół pracuje na SWOICH danych, w SWOICH narzędziach. Po jednym dniu - wiedzą jak promptować, jak zautomatyzować powtarzalną robotę, i jak AI wbudować w swój dzień pracy. Bez teoretyzowania.',
        heroMetric: { value: '2-3x', label: 'wzrost produktywności pracownika po szkoleniu - raportowany przez naszych klientów' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Formaty',
                items: [
                    'Warsztat onsite (1 dzień, u Ciebie w biurze)',
                    'Warsztat online (2x po 3h, rozłożone na tydzień)',
                    'Konsultacja 1:1 dla kadry zarządzającej',
                    'Materiały follow-up + 30 dni wsparcia po szkoleniu'
                ],
            },
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Tematy',
                items: [
                    'ChatGPT / Claude w codziennej pracy',
                    'Prompt engineering dla Twojej branży',
                    'AI w mailu, raportach, analizie danych',
                    'Budowanie prostych automatyzacji (bez kodu)'
                ],
            },
            {
                type: 'personas',
                colSpan: 'lg:col-span-4',
                label: 'Dla kogo to jest',
                roles: [
                    { title: 'Zespoły operacyjne', desc: 'Przetwarzają codziennie duże zbiory danych' },
                    { title: 'Kadra zarządzająca', desc: 'Chce zrozumieć szeroko co AI może zmienić' },
                    { title: 'Działy marketingu/sprzed.', desc: 'Do skalowania swojego outreachu z asystentem' }
                ]
            },
            {
                type: 'usp',
                colSpan: 'lg:col-span-8',
                label: 'Dlaczego nasze szkolenia działają',
                points: [
                    { title: 'Na Twoich danych', desc: 'Nie uczymy na abstrakcyjnych przykładach. Bierzemy TWOJE maile, TWOJE arkusze, TWOJE procesy.' },
                    { title: 'Efekt od razu', desc: 'Po warsztacie każdy bierze do ręki 2-3 własne prompty, które od jutra oszczędzają mu konkretny czas.' },
                    { title: 'Nie zostawiamy samych', desc: '30 dni wsparcia po ukończeniu szkolenia. Pytania, problemy, fine-tuning - jesteśmy dostępni.' },
                ]
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Umów szkolenie dla zespołu',
                subline: 'Dostosowujemy program do Twojej branży i poziomu zaawansowania.',
                ctaLabel: 'Zapytaj o termin',
            },
        ],
    },
    {
        id: 'agenty',
        title: 'Agenci AI',
        tagline: 'Rozwiąż problem wypalenia personelu i obsługuj klientów o 3 w nocy, bez błędów i spóźnień.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[520px] lg:min-h-[420px]',
        Preview: AgentPreview,

        categoryTag: 'Automatyzacja komunikacji',
        expandedTitle: 'Agent, który rozwiązuje - nie przekierowuje.',
        expandedDescription: 'Budujemy boty, które działają na Twoich danych, respektują Twoje procedury i rozwiązują prawdziwe problemy klientów. Nie chodzi o chatbota, który mówi "przekierowuję do konsultanta". Chodzi o agenta, który odpowiada, wystawia, wysyła - i dopiero gdy nie wie, eskaluje do człowieka.',
        heroMetric: { value: '40%', label: 'zapytań rozwiązanych autonomicznie - bez udziału człowieka' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Rodzaje agentów',
                items: [
                    'Chatbot na stronę / Messenger / WhatsApp',
                    'Voicebot do obsługi linii telefonicznej',
                    'Email bot - kategoryzacja, odpowiedzi, forwarding',
                    'Wewnętrzny asystent wiedzy firmowej'
                ],
            },
            {
                type: 'features', // Reusing simple text list logic but naming it learning
                colSpan: 'lg:col-span-4',
                label: 'Jak to działa',
                items: [
                    'Trenujemy agenta na Twoich FAQ i procedurach',
                    'Korzysta z bazy wiedzy (RAG) - zero halucynacji',
                    'Monitoring w czasie rzeczywistym w dashboardzie',
                    'Agent uczy się z feedbacku ewaluując rozmowy'
                ],
            },
            {
                type: 'integrations',
                colSpan: 'lg:col-span-4',
                label: 'Integracje gotowe pod klucz',
                badges: ['Strona WWW', 'Messenger', 'WhatsApp', 'Slack', 'Email', 'Telefon (Voice)']
            },
            {
                type: 'case',
                colSpan: 'lg:col-span-8',
                label: 'Przykład wdrożenia',
                title: 'E-commerce, BOK z 200+ zapytaniami dziennie',
                content: 'Zespół BOK tonął w powtarzalnych pytaniach: "gdzie moja paczka?", "jak zwrócić?", "jaki rozmiar wybrać?". Agent od Workshift obsługuje ~40% zapytań od ręki na pierwszej linii. Reszta trafia do ludzi z pełnym kontekstem rozmowy. Pracownicy przestali odchodzić z wypalenia z powodu monotonii.',
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zbuduj swojego agenta',
                subline: 'Od prototypu do działającego bota - 2-4 tygodnie.',
                ctaLabel: 'Porozmawiajmy',
            },
        ],
    },
    {
        id: 'kreacje',
        title: 'Kreacje reklamowe AI',
        tagline: 'Zastąp drogą agencję pipeline\'m. Dni ucinamy do godzin, budżety zmniejszamy o połowę.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',
        Preview: CreativePreview,

        categoryTag: 'Content i Visual',
        expandedTitle: 'Skaluj produkcję kreacji, bez działu grafików.',
        expandedDescription: 'Zastępujemy drogie sesje zdjęciowe i tygodnie czekania na grafika dedykowanymi pipeline\'ami generatywnymi. Tworzysz brief, a my dostarczamy setki wariantów spójnych z Twoim brandbookiem - packshoty, reklamy social, wideo. W dni, nie w miesiące.',
        heroMetric: { value: 'Dni', label: 'zamiast miesięcy produkcji kreacji reklamowych', subtext: 'Średnio 10x szybciej niż tradycyjny proces agencji.' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-6',
                label: 'Co tworzymy za Ciebie',
                items: [
                    'Packshoty i trójwymiarowe wizualizacje produktów',
                    'Personalizowane warianty reklam na skalę dużego A/B',
                    'Utrzymana spójność z brandbookiem (modele LoRA)',
                    'Materiały wideo i generatywne animacje'
                ],
            },
            {
                type: 'stack', // reuse visual
                colSpan: 'lg:col-span-6',
                label: 'Stack technologiczny',
                subtitle: 'Dobieramy narzędzia pod brief.',
                tools: ['ComfyUI', 'Midjourney', 'Runway', 'DALL-E', 'LoRA', 'Kling']
            },
            {
                type: 'comparison',
                colSpan: 'lg:col-span-8',
                label: 'Jak zmieniamy proces dostarczania (Before/After)',
                before: { title: 'Tradycyjnie', desc: 'Briefing → Studio zdjęciowe → Obróbka w Lightroom → Wersjonowanie dla social (4-6 tygodni, duże koszty).', highlight: 'Miesiące' },
                after: { title: 'Z Workshift AI', desc: 'Brief z wymaganiami → Własny AI pipeline → Setki wariantów brandowych renderowane od razu (3-5 dni pracy).', highlight: 'Dni' }
            },
            {
                type: 'cta',
                colSpan: 'lg:col-span-4',
                headline: 'Zobacz demo kreacji AI',
                subline: 'Pokażemy na żywo, jak generujemy content na bazie Twojego brandbooka.',
                ctaLabel: 'Umów demo',
            },
        ],
    },
];

// --- UNIVERSAL INNER CARDS RENDERER FOR EXPANDED VIEW ---
function ExtendedInnerCard({ card, index }) {
    const elRef = useRef(null);
    useEffect(() => {
        gsap.fromTo(elRef.current, 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.4, delay: 0.15 + index * 0.08, ease: "power2.out" }
        );
        
        if (card.type === 'timeline' && elRef.current) {
             gsap.fromTo(elRef.current.querySelectorAll('.gsap-timeline-step'),
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1, delay: 0.2, ease: "back.out(1.5)" }
             );
        }
    }, [index, card.type]);

    return (
        <div
            ref={elRef}
            className={`
          ${card.colSpan || 'lg:col-span-1'}
          bg-sage rounded-[10px] border border-black/5 
          overflow-hidden flex flex-col min-h-[140px] opacity-0
          ${card.type === 'cta' ? 'lg:row-span-2 min-h-full' : ''}
        `}
        >
            {card.type === 'features' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-dark mb-5">{card.label}</h4>
                    <ul className="space-y-3.5 flex-1">
                        {card.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-md bg-lime/20 flex items-center justify-center shrink-0 mt-0.5 border border-lime/30">
                                    <Check size={12} className="text-black stroke-[3]" />
                                </div>
                                <span className="text-sm md:text-[15px] text-black font-medium leading-[1.4] relative top-[1px]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {card.type === 'process' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-dark mb-6">{card.label}</h4>
                    <div className="flex flex-col gap-4 relative pl-3 border-l-2 border-black/10">
                        {card.steps.map((step, i) => (
                            <div key={i} className="relative z-10 pl-4 before:absolute before:w-3 before:h-3 before:rounded-full before:bg-lime before:-left-[23px] before:top-1.5 before:shadow-[0_0_0_4px_white]">
                                <span className="text-[13px] font-mono font-bold text-black/50 mr-1">{step.num}.</span>
                                <span className="font-medium text-black text-[15px] block leading-tight mb-1">{step.title}</span>
                                <span className="text-sm text-muted-dark leading-snug block">{step.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'stack' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-sage">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-dark mb-5">{card.label}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 content-start mb-6">
                        {card.tools.map((tool, i) => (
                            <div key={i} className="bg-white border border-black/10 rounded-[10px] p-3 flex items-center justify-center text-sm font-medium text-black grayscale hover:grayscale-0 hover:text-black hover:border-lime/40 hover:shadow-sm transition-all text-center">
                                {tool}
                            </div>
                        ))}
                    </div>
                    {card.subtitle && <p className="text-[13px] text-muted-dark font-mono">✨ {card.subtitle}</p>}
                </div>
            )}

            {card.type === 'case' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white border-l-[6px] border-lime relative">
                    <h4 className="text-[11px] font-mono uppercase tracking-widest text-black mb-3 bg-lime/20 inline-block px-3 py-1 rounded-full w-max">{card.label}</h4>
                    <p className="text-xl font-display text-black mb-3 mt-2">{card.title}</p>
                    <p className="text-[15px] text-muted-dark leading-relaxed font-medium flex-1">{card.content}</p>
                    {card.beforeAfter && (
                        <div className="flex items-center gap-4 mt-6 bg-sage p-4 rounded-[10px] border border-black/5">
                            <div className="flex-1">
                                <div className="text-[10px] uppercase font-mono text-muted-light tracking-wider mb-1">Przed wdrożeniem</div>
                                <div className="text-lg font-medium text-muted-dark line-through decoration-black/20">{card.beforeAfter.before}</div>
                            </div>
                            <div className="mx-2 text-muted-light" aria-hidden="true"><ArrowRight size={20} /></div>
                            <div className="flex-1">
                                <div className="text-[10px] uppercase font-mono text-black tracking-wider mb-1">Po algorytmizacji</div>
                                <div className="text-xl font-black text-black">{card.beforeAfter.after}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {card.type === 'timeline' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-sage relative overflow-hidden">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-dark mb-8">{card.label}</h4>
                    <div className="flex w-full mt-4 justify-between items-start relative z-10 px-2 lg:px-8">
                        <div className="absolute left-6 right-6 lg:left-12 lg:right-12 top-2 h-0.5 bg-black/10 -z-10" />
                        {card.steps.map((step, i) => (
                            <div key={i} className="gsap-timeline-step flex flex-col items-center max-w-[120px] text-center gap-3 opacity-0">
                                <div className={`w-4 h-4 rounded-full border-[3px] border-sage shadow-sm ${i === 2 ? 'bg-lime scale-125' : 'bg-black/20'}`} />
                                <div className="font-medium text-black text-sm mt-1">{step.title}</div>
                                <div className="text-[11px] font-mono text-muted-dark leading-snug">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'insights' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white relative">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">{card.label}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {card.cards.map((insight, i) => (
                            <div key={i} className="p-4 rounded-xl border border-black/5 bg-sage flex flex-col">
                                <div className="text-2xl mb-3 bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border border-slate-200/50">{insight.icon}</div>
                                <div className="font-bold text-black text-sm mb-2">{insight.title}</div>
                                <div className="text-[13px] text-slate-500 leading-relaxed font-medium">{insight.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'personas' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white relative">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">{card.label}</h4>
                    <div className="flex flex-col gap-3">
                        {card.roles.map((role, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 rounded-lg border border-black/5 bg-sage hover:border-lime/30 hover:bg-lime/10 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-400 border border-slate-200 shrink-0">{(i + 1)}</div>
                                <div className="mt-0.5">
                                    <div className="font-bold text-black text-sm leading-none mb-1">{role.title}</div>
                                    <div className="text-[12px] text-slate-500 font-medium">{role.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'usp' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-black text-white relative overflow-hidden">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-white/50 mb-6 relative z-10">{card.label}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {card.points.map((pt, i) => (
                            <div key={i} className="flex flex-col">
                                <div className="w-8 h-1 bg-lime rounded-full mb-4" />
                                <div className="text-base font-medium text-white mb-2">{pt.title}</div>
                                <div className="text-[13px] text-white/60 leading-relaxed">{pt.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'integrations' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white relative">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">{card.label}</h4>
                    <div className="flex flex-wrap gap-2">
                        {card.badges.map((badge, i) => (
                            <span key={i} className="px-3 py-1.5 bg-sage border border-black/5 text-black text-xs font-bold rounded-lg shadow-sm">{badge}</span>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'comparison' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white relative">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">{card.label}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">{card.before.title}</div>
                            <p className="text-sm font-medium text-slate-600 mb-6 flex-1">{card.before.desc}</p>
                            <div className="inline-block mt-auto bg-slate-200 text-slate-500 font-bold px-3 py-1 rounded-md text-sm w-max self-start">{card.before.highlight} <span className="opacity-50">czekania</span></div>
                        </div>
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/20 shadow-sm flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={100} /></div>
                            <div className="text-[11px] font-bold uppercase tracking-wider text-accent mb-2">{card.after.title}</div>
                            <p className="text-sm font-medium text-black mb-6 flex-1 relative z-10">{card.after.desc}</p>
                            <div className="inline-block mt-auto bg-gradient-to-r from-accent to-accent-purple text-white font-bold px-4 py-1.5 rounded-md text-sm shadow-md w-max self-start relative z-10">Tylko {card.after.highlight.toLowerCase()}</div>
                        </div>
                    </div>
                </div>
            )}


            {card.type === 'cta' && (
                <div className="p-8 md:p-10 flex flex-col justify-center items-center h-full text-center 
                          bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-black relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(120% 120% at 50% 100%, rgba(156, 224, 105, 0.3) 0%, transparent 60%)' }} />
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm shadow-xl">
                        <ArrowRight size={24} className="text-lime mix-blend-screen" />
                    </div>
                    <h4 className="text-2xl lg:text-3xl font-display text-white mb-4 relative z-10 leading-[1.1]">{card.headline}</h4>
                    <p className="text-sm text-white/60 mb-10 max-w-[240px] relative z-10">{card.subline}</p>
                    <a href="#kontakt" className="inline-flex items-center gap-2 bg-lime text-black px-8 py-4 
                                         rounded-[10px] font-medium text-sm shadow-[0_4px_20px_-5px_rgba(156,224,105,0.4)] group-hover:shadow-[0_10px_30px_-5px_rgba(156,224,105,0.4)] group-hover:-translate-y-1 transition-all duration-300 relative z-10 w-full justify-center">
                        {card.ctaLabel}
                    </a>
                </div>
            )}
        </div>
    );
}

function ExpandedServiceView({ service, onClose }) {
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const el = containerRef.current;
            const top = el.getBoundingClientRect().top + window.pageYOffset - 24;
            window.scrollTo({ top, behavior: 'smooth' });

            gsap.fromTo(el, 
                { opacity: 0, clipPath: 'inset(8% 2% 8% 2% round 2rem)', scale: 0.97 },
                { opacity: 1, clipPath: 'inset(0% 0% 0% 0% round 2rem)', scale: 1, duration: 0.55, ease: "power3.out" }
            );
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full relative opacity-0"
        >
            <button
                onClick={onClose}
                className="mb-8 inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-muted-dark hover:text-black transition-colors group/back px-2"
            >
                <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center group-hover/back:bg-sage/80 transition-colors border border-black/5">
                    <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" />
                </div>
                Wróć do usług
            </button>

            <GlareCard className="w-full shadow-2xl" isExpanded={true}>
                <div className="p-6 md:p-10 lg:p-14 h-full flex flex-col w-full">

                    {/* Rząd 1: Header + Metric */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-8 lg:mb-12">
                        <div className="lg:col-span-7">
                            <p className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-black mb-5 bg-lime/20 px-3 py-1.5 rounded-md border border-lime/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                                {service.categoryTag}
                            </p>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-display text-black mb-6 tracking-tight leading-[1.05] text-balance">
                                {service.expandedTitle}
                            </h3>
                            <p className="text-lg md:text-[19px] text-muted-dark leading-[1.6] max-w-2xl text-balance">
                                {service.expandedDescription}
                            </p>
                        </div>

                        <div className="lg:col-span-5 flex items-center justify-start lg:justify-end">
                            <div className="text-left lg:text-right border-l-[3px] lg:border-l-0 lg:border-r-[3px] border-lime pl-6 lg:pl-0 lg:pr-6 py-2 bg-gradient-to-r lg:bg-gradient-to-l from-sage to-transparent pr-8 lg:pl-12 rounded-r-[10px] lg:rounded-r-none lg:rounded-l-[10px]">
                                <div className="text-5xl md:text-7xl font-display font-black text-black tracking-tighter mb-2 pb-2">
                                    {service.heroMetric.value}
                                </div>
                                <p className="text-xs text-muted-dark font-mono uppercase tracking-wider max-w-[180px] lg:ml-auto leading-tight mb-2">{service.heroMetric.label}</p>
                                {service.heroMetric.subtext && <p className="text-[11px] font-mono text-muted-light italic max-w-[150px] lg:ml-auto leading-tight">{service.heroMetric.subtext}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Wewnętrzny Grid - Unikalny na podstawie JSON-like bazy danych u góry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 flex-1">
                        {service.innerCards.map((card, idx) => (
                            <ExtendedInnerCard key={idx} card={card} index={idx} />
                        ))}
                    </div>

                </div>
            </GlareCard>
        </div>
    );
}

// --- MAIN GRID EXPORT ---

function CollapsedCard({ service }) {
    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden p-8 md:p-10 group-hover:bg-sage/50 transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sage to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-bl-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-lime/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Header info */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-2xl font-display text-black mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-dark max-w-sm leading-relaxed">{service.tagline}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-sage border border-black/5 flex items-center justify-center shrink-0 group-hover:bg-lime/20 group-hover:border-lime/30 group-hover:scale-110 transition-all duration-300">
                    <ArrowUpRight size={18} className="text-muted-dark group-hover:text-black transition-colors" />
                </div>
            </div>

            {/* Preview Artifact Area */}
            <div className="mt-8 flex-1 flex items-center justify-center relative">
                <service.Preview />
            </div>
        </div>
    );
}

const AI_LOGOS = [anthropicLogo, openaiLogo, n8nLogo, perplexityLogo, lovableLogo, replitLogo, claudeLogo, copilotLogo, deepseekLogo, grokLogo];

function MarqueeRow({ reverse = false }) {
    const logos = [...AI_LOGOS, ...AI_LOGOS, ...AI_LOGOS, ...AI_LOGOS];
    return (
        <div className="flex overflow-hidden w-full pointer-events-none">
            <div
                className="flex shrink-0 gap-8 md:gap-12 items-center py-4"
                style={{
                    animation: `${reverse ? 'marquee-reverse' : 'marquee'} 80s linear infinite`,
                }}
            >
                {logos.map((src, i) => (
                    <div key={i} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-200/60 bg-white/60 shrink-0">
                        <img src={src} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain" style={{ filter: 'grayscale(1)', opacity: 0.22 }} loading="lazy" />
                    </div>
                ))}
            </div>
            <div
                className="flex shrink-0 gap-8 md:gap-12 items-center py-4"
                aria-hidden="true"
                style={{
                    animation: `${reverse ? 'marquee-reverse' : 'marquee'} 80s linear infinite`,
                }}
            >
                {logos.map((src, i) => (
                    <div key={`dup-${i}`} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-200/60 bg-white/60 shrink-0">
                        <img src={src} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain" style={{ filter: 'grayscale(1)', opacity: 0.22 }} loading="lazy" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function LogoCloudHeader() {
    const containerRef = useRef(null);
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        let ctx = gsap.context(() => {
            gsap.fromTo(".gsap-header-el", 
                { opacity: 0, y: 15 }, 
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out", scrollTrigger: { trigger: containerRef.current, start: "top 80%" } }
            );
            gsap.fromTo(".gsap-header-logo", 
                { opacity: 0, scale: 0.85 }, 
                { opacity: 1, scale: 1, duration: 0.6, delay: 0.15, ease: "back.out(1.5)", scrollTrigger: { trigger: containerRef.current, start: "top 80%" } }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="w-full relative py-20 lg:py-28 mb-16 rounded-[2rem] bg-sage overflow-hidden flex flex-col items-center justify-center text-center">
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
                @keyframes marquee-reverse {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(0); }
                }
            `}</style>

            <div className="absolute inset-0 z-0 flex flex-col justify-center gap-2 overflow-hidden">
                <MarqueeRow />
                <MarqueeRow reverse />
            </div>

            <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 65% at center, #E6E8DD 20%, transparent 75%)' }} />
            <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(to right, #E6E8DD 0%, transparent 15%, transparent 85%, #E6E8DD 100%)' }} />

            <p className="gsap-header-el text-[11px] md:text-sm font-mono uppercase tracking-[0.25em] text-black mb-4 md:mb-5 relative z-10 opacity-0">
                Nasze usługi
            </p>

            <div className="gsap-header-logo relative z-10 mb-6 opacity-0">
                <Logo variant="light" size={56} showWordmark={true} className="justify-center" />
            </div>
            
            <h2 className="gsap-header-el text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-display tracking-tight text-black leading-[1.05] relative z-10 max-w-[90%] md:max-w-2xl px-4 opacity-0">
                Co możemy dla Ciebie zrobić?
            </h2>
        </div>
    );
}

export function InteractiveServicesBento() {
    const [selectedId, setSelectedId] = useState(null);
    const containerRef = useRef(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        let ctx = gsap.context(() => {
            gsap.fromTo(".gsap-modular-note", 
                { opacity: 0, y: 16 }, 
                { opacity: 1, y: 0, duration: 0.5, delay: 0.3, scrollTrigger: { trigger: ".gsap-modular-note", start: "top 90%" } }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Fade in grid on mount/unmount/change
    useLayoutEffect(() => {
        if (!selectedId && containerRef.current) {
            gsap.fromTo(".gsap-bento-grid", 
                { opacity: 0 }, 
                { opacity: 1, duration: 0.4 }
            );
        }
    }, [selectedId]);

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden" id="uslugi" ref={containerRef}>
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <LogoCloudHeader />

                <div className="relative">
                    {selectedId ? (
                        <ExpandedServiceView
                            key={selectedId}
                            service={SERVICES.find(s => s.id === selectedId)}
                            onClose={() => setSelectedId(null)}
                        />
                    ) : (
                        <div
                            key="grid"
                            className="gsap-bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5"
                        >
                            {SERVICES.map((service, idx) => (
                                <GlareCard
                                    key={service.id}
                                    onClick={() => setSelectedId(service.id)}
                                    className={`${service.colSpan} ${service.minHeight}`}
                                >
                                    <CollapsedCard service={service} index={idx} />
                                </GlareCard>
                            ))}
                        </div>
                    )}
                </div>

                {/* Modular services note */}
                {!selectedId && (
                    <div className="gsap-modular-note opacity-0 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 md:p-6 rounded-[10px] bg-sage border border-black/5">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center">
                                <span className="text-lg">🧩</span>
                            </div>
                            <div>
                                <p className="font-medium text-black text-sm mb-0.5">Kupujesz tylko to, czego naprawdę potrzebujesz</p>
                                <p className="text-muted-dark text-sm">Każdą usługę możesz zamówić osobno - sam audyt, samo wdrożenie, samo szkolenie. Bez pakietów, bez nadmuchanych scope'ów.</p>
                            </div>
                        </div>
                        <a href="#kontakt" className="inline-flex items-center gap-2 bg-white border border-black/10 text-black px-5 py-2.5 rounded-[10px] font-medium text-sm shadow-sm hover:border-lime/40 hover:bg-lime/10 transition-all duration-200 shrink-0 whitespace-nowrap">
                            Zapytaj o zakres →
                        </a>
                    </div>
                )}

            </div>
        </section>
    );
}

