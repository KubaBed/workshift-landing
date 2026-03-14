import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowLeft, ArrowRight, Check, Play, Pause, X, Zap } from 'lucide-react';
import { Logo } from './ui/Logo';
import anthropicLogo from '../assets/logos/anthropic.png';
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
            <div className="absolute inset-0 rounded-full bg-[#ee703d]/25 blur-3xl" />
            <div className="absolute inset-4 rounded-full bg-[#d5a4e7]/20 blur-2xl translate-x-4" />
            <div className="absolute inset-8 rounded-full bg-[#cc7cab]/20 blur-xl -translate-x-2 translate-y-2" />
        </div>
    );
}

function GlareCard({ children, className, onClick, isExpanded }) {
    const cardRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current || isExpanded) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setMousePosition({ x: 50, y: 50 }); }}
            onClick={onClick}
            className={`relative ${!isExpanded ? 'cursor-pointer' : ''} group ${className}`}
            style={{ padding: '1px' }}
        >
            {/* Gradient border layer */}
            <div
                className="absolute inset-0 rounded-[2rem] transition-opacity duration-500 pointer-events-none"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(
            600px circle at ${mousePosition.x}% ${mousePosition.y}%,
            rgba(238, 112, 61, 0.4),
            rgba(204, 124, 171, 0.25) 40%,
            rgba(213, 164, 231, 0.15) 60%,
            transparent 80%
          )`,
                }}
            />

            {/* Static subtle border */}
            <div
                className="absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-500"
                style={{
                    opacity: isHovered ? 0 : 1,
                    border: '1px solid rgba(226, 232, 240, 0.6)',
                }}
            />

            {/* Inner card content */}
            <div className="relative bg-[#f7f7f8] rounded-[calc(2rem-1px)] h-full w-full overflow-hidden flex flex-col">
                {children}
            </div>
        </motion.div>
    );
}

// --- COLLAPSED ARTIFACT PREVIEWS ---

function AutomationPreview() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none group-hover:scale-[1.03] transition-transform duration-500">
            <div className="flex items-center gap-3 relative w-full justify-center">

                {/* Tools Stack (Input) */}
                <div className="flex flex-col gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2">
                        {/* Gmail-like Outline */}
                        <svg className="w-full h-full text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2">
                        {/* Excel/Sheets-like Outline */}
                        <svg className="w-full h-full text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-2">
                        {/* Database/CRM Outline */}
                        <svg className="w-full h-full text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                    </div>
                </div>

                {/* Animated Paths 1 */}
                <div className="flex flex-col justify-center items-center h-full gap-8 mx-1 w-12 relative overflow-hidden">
                    <svg width="40" height="2" className="absolute top-[18px]">
                        <line x1="0" y1="1" x2="40" y2="1" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
                        <circle r="3" fill="#ee703d" className="animate-[moveDot_4s_linear_infinite]" style={{ animationDelay: '0s' }} />
                    </svg>
                    <svg width="40" height="2" className="absolute top-1/2 -translate-y-1/2">
                        <line x1="0" y1="1" x2="40" y2="1" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
                        <circle r="3" fill="#ee703d" className="animate-[moveDot_4s_linear_infinite]" style={{ animationDelay: '1s' }} />
                    </svg>
                    <svg width="40" height="2" className="absolute bottom-[18px]">
                        <line x1="0" y1="1" x2="40" y2="1" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
                        <circle r="3" fill="#ee703d" className="animate-[moveDot_4s_linear_infinite]" style={{ animationDelay: '2s' }} />
                    </svg>
                </div>

                {/* Central Node (Workshift AI) */}
                <div className="relative z-10 group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-[#ee703d]/20 blur-xl rounded-full scale-[2] animate-pulse" style={{ animationDuration: '3s' }} />
                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#ee703d]/30 flex flex-col items-center justify-center text-[#ee703d] shadow-[0_0_25px_-5px_rgba(238,112,61,0.4)]">
                        <svg className="w-6 h-6 mb-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#0A2540]">Workshift</span>
                    </div>
                </div>

                {/* Animated Paths 2 */}
                <div className="flex flex-col justify-center items-center h-full mx-1 w-12 relative overflow-hidden">
                    <svg width="40" height="2" className="absolute top-1/2 -translate-y-1/2">
                        <line x1="0" y1="1" x2="40" y2="1" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4 4" />
                        <circle r="3" fill="#ee703d" className="animate-[moveDot_4s_linear_infinite]" style={{ animationDelay: '3s' }} />
                    </svg>
                </div>

                {/* Output (Check/Done) */}
                <div className="w-12 h-12 rounded-xl bg-[#0A2540] shadow-md flex items-center justify-center p-3 relative z-10">
                    <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                </div>

            </div>

            <style jsx>{`
                @keyframes moveDot {
                    0% { cx: 0; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { cx: 40; opacity: 0; }
                }
            `}</style>
        </div>
    );
}

function AuditPreview() {
    const mainColor = '#ee703d';
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
                        group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-500">

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

            {/* Stat badges — fade out on hover */}
            <div className="absolute top-3 left-3 z-[9] flex items-center gap-1.5 transition-opacity duration-300 group-hover:opacity-0">
                <div className="flex items-center rounded-full border border-slate-200 bg-white/60 px-2 py-0.5 backdrop-blur-sm">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: mainColor }} />
                    <span className="ml-1.5 text-[10px] font-bold text-[#0A2540]">+32%</span>
                </div>
                <div className="flex items-center rounded-full border border-slate-200 bg-white/60 px-2 py-0.5 backdrop-blur-sm">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
                    <span className="ml-1.5 text-[10px] font-bold text-[#0A2540]">+18,7%</span>
                </div>
            </div>

            {/* Hover tooltip — slides up on hover */}
            <div className="absolute inset-0 z-[7] flex items-start justify-center p-4
                            translate-y-full group-hover:translate-y-0
                            transition-transform duration-500 ease-[cubic-bezier(0.6,0.6,0,1)]">
                <div className="rounded-lg border border-slate-200 bg-white/70 p-2.5 backdrop-blur-sm
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <div className="flex items-center gap-2 mb-0.5">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: mainColor }} />
                        <p className="text-xs font-bold text-[#0A2540]">Potencjał oszczędności</p>
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

function TrainingPreview() {
    return (
        <div className="w-full flex flex-col gap-4 relative z-10 px-4 md:px-0">
            <div className="flex flex-col gap-1 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100/60">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Prompt engineering</span>
                    <span className="text-sm font-black text-[#0A2540]">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: "0%" }} whileInView={{ width: "85%" }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full" />
                </div>
            </div>

            <div className="flex flex-col gap-1 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100/60 ml-4 md:ml-8">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Narzędzia AI w pracy</span>
                    <span className="text-sm font-black text-[#0A2540]">72%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: "0%" }} whileInView={{ width: "72%" }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }} className="h-full bg-gradient-to-r from-accent-light to-accent-rose rounded-full" />
                </div>
            </div>

            <div className="flex flex-col gap-1 w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100/60 ml-8 md:ml-16">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Automatyzacja zadań</span>
                    <span className="text-sm font-black text-[#0A2540]">60%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: "0%" }} whileInView={{ width: "60%" }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }} className="h-full bg-gradient-to-r from-accent-rose to-accent-purple rounded-full" />
                </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium text-center mt-2 group-hover:text-slate-500 transition-colors">Średni wzrost kompetencji po szkoleniu</p>
        </div>
    );
}

function AgentPreview() {
    return (
        <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden
                    group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-500 relative z-10 flex flex-col items-center">

            <div className="w-full px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-bold text-[#0A2540] uppercase tracking-wider">Agent Workshift</span>
            </div>

            <div className="w-full p-4 space-y-4 relative bg-white">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex justify-end">
                    <div className="bg-slate-100/80 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] border border-slate-200/50">
                        <p className="text-[12px] text-[#0A2540] font-medium leading-relaxed">Potrzebuję fakturę za luty.</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex justify-start">
                    <div className="bg-gradient-to-br from-accent/5 to-accent-purple/5 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%] border border-accent/15 shadow-sm shadow-accent/5 relative">
                        <p className="text-[12px] text-[#0A2540] font-medium leading-relaxed">Gotowe! Wysyłam FV/02/2026 na podany adres. Kwota: <span className="font-bold">4 230 PLN</span>.</p>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: [1, 1, 0] }} transition={{ times: [0, 0.8, 1], duration: 1.5, delay: 0.3 }} className="flex justify-start absolute bottom-4 left-4">
                    <div className="bg-slate-100 rounded-2xl px-3 py-2 flex gap-1 border border-slate-200/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function CreativePreview() {
    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="grid grid-cols-3 gap-2 w-full max-w-sm shrink-0 group-hover:scale-[1.03] transition-transform duration-500">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="aspect-square rounded-xl bg-gradient-to-br shadow-sm overflow-hidden relative border border-white/20"
                        style={{
                            backgroundImage: `linear-gradient(135deg, 
                                ${i % 2 === 0 ? 'rgba(238, 112, 61, 0.4)' : 'rgba(245, 162, 115, 0.4)'}, 
                                ${i % 3 === 0 ? 'rgba(204, 124, 171, 0.4)' : 'rgba(133, 48, 209, 0.4)'}
                            )`,
                        }}
                    >
                        {/* Shimmer Effect */}
                        <motion.div
                            className="absolute inset-0 bg-white/40 skew-x-12 -translate-x-full"
                            animate={{ translateX: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, ease: 'easeInOut', delay: i * 0.3 }}
                        />
                        {/* Occasional Sparkle */}
                        {(i === 1 || i === 4) && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-50 text-white">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
            <ParticleBlur position="bottom-right" />
        </div>
    );
}

// --- DATA STRUCTURE & EXPANDED BENTO BUILDER ---

const SERVICES = [
    {
        id: 'automatyzacja',
        title: 'Automatyzacja procesów',
        tagline: 'Łączymy Twoje narzędzia w jeden workflow. Bez ręcznego przepisywania.',
        colSpan: 'lg:col-span-7',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',
        Preview: AutomationPreview,

        categoryTag: 'Nasza flagowa usługa',
        expandedTitle: 'Twoje narzędzia, jeden płynny przepływ.',
        expandedDescription: 'Zamiast ręcznie kopiować dane z maila do arkusza, z arkusza do CRM-a, a z CRM-a do systemu fakturowego — budujemy automatyczny pipeline, który robi to za Ciebie. Używamy n8n, Make i dedykowanych skryptów, które wpinają się w to, jak już pracujesz. Bez zmiany przyzwyczajeń, bez wdrażania nowego "systemu". Po prostu — dane płyną same.',
        heroMetric: { value: '10h+', label: 'oszczędności na pracowniku tygodniowo — średnia z naszych wdrożeń', subtext: 'Przy zespole 5-osobowym to 200h+ miesięcznie.' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Co automatyzujemy',
                items: [
                    'Obieg faktur — od maila do księgowości',
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
                subline: 'Bezpłatna diagnoza — pokażemy Quick Win w 30 minut.',
                ctaLabel: 'Umów rozmowę',
            },
        ],
    },
    {
        id: 'audyt',
        title: 'Audyt i Strategia AI',
        tagline: 'Powiemy Ci gdzie tracisz czas — zanim napiszemy jedną linijkę kodu.',
        colSpan: 'lg:col-span-5',
        minHeight: 'min-h-[420px] lg:min-h-[480px]',
        Preview: AuditPreview,

        categoryTag: 'Krok pierwszy',
        expandedTitle: 'Zanim zaczniemy budować — musimy wiedzieć, co budować.',
        expandedDescription: 'Nie sprzedajemy technologii na ślepo. Najpierw siadamy z Tobą na 30-minutową diagnozę, mapujemy jak wyglądają Twoje procesy, rozmawiamy z zespołem, i wskazujemy 2-3 miejsca, gdzie automatyzacja da najszybszy, policzalny zwrot. Bez tego kroku — reszta to strzały w ciemno.',
        heroMetric: { value: '32%', label: 'średni potencjał oszczędności czasu, który identyfikujemy u klientów MŚP', subtext: 'U niektórych firm to 50+ godzin miesięcznie.' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-6',
                label: 'Co dostajesz po audycie',
                items: [
                    'Mapę przepływu pracy Twojej firmy (workflow diagram)',
                    'Listę zidentyfikowanych wąskich gardeł z priorytetyzacją',
                    'Szacunek ROI — ile czasu / pieniędzy odzyskasz per automatyzacja',
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
                    { icon: '📧', title: 'Chaos w skrzynkach', desc: 'Zlecenia, faktury, pytania klientów — wszystko w jednym inboxie, bez filtrów.' },
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
        tagline: 'Twój zespół zacznie używać AI jutro, nie za pół roku.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',
        Preview: TrainingPreview,

        categoryTag: 'Rozwój zespołu',
        expandedTitle: 'Twój zespół nie boi się AI. Po prostu nikt im nie pokazał, jak korzystać.',
        expandedDescription: 'Nie robimy wykładów. Robimy warsztaty, na których Twój zespół pracuje na SWOICH danych, w SWOICH narzędziach. Po jednym dniu — wiedzą jak promptować, jak zautomatyzować powtarzalną robotę, i jak AI wbudować w swój dzień pracy. Bez teoretyzowania.',
        heroMetric: { value: '2-3x', label: 'wzrost produktywności pracownika po szkoleniu — raportowany przez naszych klientów' },

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
                    { title: 'Nie zostawiamy samych', desc: '30 dni wsparcia po ukończeniu szkolenia. Pytania, problemy, fine-tuning — jesteśmy dostępni.' },
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
        title: 'Agenty AI',
        tagline: 'Niestrudzona pierwsza linia — 24/7, bez urlopów.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',
        Preview: AgentPreview,

        categoryTag: 'Automatyzacja komunikacji',
        expandedTitle: 'Agent, który rozwiązuje — nie przekierowuje.',
        expandedDescription: 'Budujemy boty, które działają na Twoich danych, respektują Twoje procedury i rozwiązują prawdziwe problemy klientów. Nie chodzi o chatbota, który mówi "przekierowuję do konsultanta". Chodzi o agenta, który odpowiada, wystawia, wysyła — i dopiero gdy nie wie, eskaluje do człowieka.',
        heroMetric: { value: '40%', label: 'zapytań rozwiązanych autonomicznie — bez udziału człowieka' },

        innerCards: [
            {
                type: 'features',
                colSpan: 'lg:col-span-4',
                label: 'Rodzaje agentów',
                items: [
                    'Chatbot na stronę / Messenger / WhatsApp',
                    'Voicebot do obsługi linii telefonicznej',
                    'Email bot — kategoryzacja, odpowiedzi, forwarding',
                    'Wewnętrzny asystent wiedzy firmowej'
                ],
            },
            {
                type: 'features', // Reusing simple text list logic but naming it learning
                colSpan: 'lg:col-span-4',
                label: 'Jak to działa',
                items: [
                    'Trenujemy agenta na Twoich FAQ i procedurach',
                    'Korzysta z bazy wiedzy (RAG) — zero halucynacji',
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
                subline: 'Od prototypu do działającego bota — 2-4 tygodnie.',
                ctaLabel: 'Porozmawiajmy',
            },
        ],
    },
    {
        id: 'kreacje',
        title: 'Kreacje reklamowe AI',
        tagline: 'Setki kreacji. Dni zamiast miesięcy.',
        colSpan: 'lg:col-span-4',
        minHeight: 'min-h-[380px] lg:min-h-[420px]',
        Preview: CreativePreview,

        categoryTag: 'Content i Visual',
        expandedTitle: 'Skaluj produkcję kreacji, bez działu grafików.',
        expandedDescription: 'Zastępujemy drogie sesje zdjęciowe i tygodnie czekania na grafika dedykowanymi pipeline\'ami generatywnymi. Tworzysz brief, a my dostarczamy setki wariantów spójnych z Twoim brandbookiem — packshoty, reklamy social, wideo. W dni, nie w miesiące.',
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
            className={`
          ${card.colSpan || 'lg:col-span-1'}
          bg-[#f7f7f8] rounded-2xl border border-slate-200/60 
          overflow-hidden flex flex-col min-h-[140px]
          ${card.type === 'cta' ? 'lg:row-span-2 min-h-full' : ''}
        `}
        >
            {card.type === 'features' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">{card.label}</h4>
                    <ul className="space-y-3.5 flex-1">
                        {card.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-md bg-[#ee703d]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#ee703d]/20">
                                    <Check size={12} className="text-[#ee703d] stroke-[3]" />
                                </div>
                                <span className="text-sm md:text-[15px] text-[#0A2540] font-medium leading-[1.4] relative top-[1px]">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {card.type === 'process' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">{card.label}</h4>
                    <div className="flex flex-col gap-4 relative pl-3 border-l-2 border-slate-100">
                        {card.steps.map((step, i) => (
                            <div key={i} className="relative z-10 pl-4 before:absolute before:w-3 before:h-3 before:rounded-full before:bg-[#ee703d] before:-left-[23px] before:top-1.5 before:shadow-[0_0_0_4px_white]">
                                <span className="text-[13px] font-bold text-[#ee703d] mr-1">{step.num}.</span>
                                <span className="font-bold text-[#0A2540] text-[15px] block leading-tight mb-1">{step.title}</span>
                                <span className="text-sm text-slate-500 leading-snug block font-medium">{step.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'stack' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-[#f7f7f8]">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">{card.label}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 content-start mb-6">
                        {card.tools.map((tool, i) => (
                            <div key={i} className="bg-white border border-slate-200/80 rounded-lg p-3 flex items-center justify-center text-sm font-bold text-slate-400 grayscale hover:grayscale-0 hover:text-navy hover:border-[#ee703d]/30 hover:shadow-sm transition-all text-center">
                                {tool}
                            </div>
                        ))}
                    </div>
                    {card.subtitle && <p className="text-[13px] text-slate-500 font-medium">✨ {card.subtitle}</p>}
                </div>
            )}

            {card.type === 'case' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white border-l-[6px] border-[#ee703d] relative">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#ee703d] mb-3 bg-[#ee703d]/10 inline-block px-3 py-1 rounded-full w-max">{card.label}</h4>
                    <p className="text-xl font-display font-bold text-[#0A2540] mb-3 mt-2">{card.title}</p>
                    <p className="text-[15px] text-slate-600 leading-relaxed font-medium flex-1">{card.content}</p>
                    {card.beforeAfter && (
                        <div className="flex items-center gap-4 mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex-1">
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Przed wdrożeniem</div>
                                <div className="text-lg font-bold text-slate-600 line-through decoration-slate-300">{card.beforeAfter.before}</div>
                            </div>
                            <div className="mx-2 text-slate-300"><ArrowRight size={20} /></div>
                            <div className="flex-1">
                                <div className="text-[10px] uppercase font-bold text-[#ee703d] tracking-wider mb-1">Po algorytmizacji</div>
                                <div className="text-xl font-black text-[#0A2540]">{card.beforeAfter.after}</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {card.type === 'timeline' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-[#f7f7f8] relative overflow-hidden">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">{card.label}</h4>
                    <div className="flex w-full mt-4 justify-between items-start relative z-10 px-2 lg:px-8">
                        <div className="absolute left-6 right-6 lg:left-12 lg:right-12 top-2 h-0.5 bg-slate-200 -z-10" />
                        {card.steps.map((step, i) => (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + (i * 0.1) }} key={i} className="flex flex-col items-center max-w-[120px] text-center gap-3">
                                <div className={`w-4 h-4 rounded-full border-[3px] border-[#f7f7f8] shadow-sm ${i === 2 ? 'bg-[#ee703d] scale-125' : 'bg-slate-300'}`} />
                                <div className="font-bold text-[#0A2540] text-sm mt-1">{step.title}</div>
                                <div className="text-[11px] font-medium text-slate-500 leading-snug">{step.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'insights' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-white relative">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">{card.label}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {card.cards.map((insight, i) => (
                            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col">
                                <div className="text-2xl mb-3 bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border border-slate-200/50">{insight.icon}</div>
                                <div className="font-bold text-[#0A2540] text-sm mb-2">{insight.title}</div>
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
                            <div key={i} className="flex items-start gap-4 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:border-[#ee703d]/20 hover:bg-[#ee703d]/5 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-400 border border-slate-200 shrink-0">{(i + 1)}</div>
                                <div className="mt-0.5">
                                    <div className="font-bold text-[#0A2540] text-sm leading-none mb-1">{role.title}</div>
                                    <div className="text-[12px] text-slate-500 font-medium">{role.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {card.type === 'usp' && (
                <div className="p-6 md:p-8 flex flex-col h-full bg-[#0A2540] text-white relative overflow-hidden">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6 relative z-10">{card.label}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {card.points.map((pt, i) => (
                            <div key={i} className="flex flex-col">
                                <div className="w-8 h-1 bg-gradient-to-r from-accent via-accent-rose to-accent-purple rounded-full mb-4" />
                                <div className="text-base font-bold text-white mb-2">{pt.title}</div>
                                <div className="text-[13px] font-medium text-slate-300 leading-relaxed opacity-80">{pt.desc}</div>
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
                            <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-[#0A2540] text-xs font-bold rounded-lg shadow-sm">{badge}</span>
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
                            <p className="text-sm font-medium text-[#0A2540] mb-6 flex-1 relative z-10">{card.after.desc}</p>
                            <div className="inline-block mt-auto bg-gradient-to-r from-accent to-accent-purple text-white font-bold px-4 py-1.5 rounded-md text-sm shadow-md w-max self-start relative z-10">Tylko {card.after.highlight.toLowerCase()}</div>
                        </div>
                    </div>
                </div>
            )}


            {card.type === 'cta' && (
                <div className="p-8 md:p-10 flex flex-col justify-center items-center h-full text-center 
                          bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[#0A2540] relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(120% 120% at 50% 100%, rgba(238, 112, 61, 0.4) 0%, transparent 60%)' }} />
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm shadow-xl">
                        <ArrowRight size={24} className="text-[#ee703d] mix-blend-screen" />
                    </div>
                    <h4 className="text-2xl lg:text-3xl font-display font-bold text-white mb-4 relative z-10 leading-[1.1]">{card.headline}</h4>
                    <p className="text-sm font-medium text-white/70 mb-10 max-w-[240px] relative z-10">{card.subline}</p>
                    <a href="#kontakt" className="inline-flex items-center gap-2 bg-white text-[#0A2540] px-8 py-4 
                                         rounded-xl font-bold text-sm shadow-[0_4px_20px_-5px_rgba(255,255,255,0.4)] group-hover:shadow-[0_10px_30px_-5px_rgba(255,255,255,0.4)] group-hover:-translate-y-1 transition-all duration-300 relative z-10 w-full justify-center">
                        {card.ctaLabel}
                    </a>
                </div>
            )}
        </motion.div>
    );
}

function ExpandedServiceView({ service, onClose }) {
    useEffect(() => {
        const section = document.getElementById("uslugi");
        if (section) {
            const yOffset = -80;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative"
        >
            <button
                onClick={onClose}
                className="mb-8 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-navy transition-colors group/back px-2"
            >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover/back:bg-slate-200 transition-colors border border-slate-200/50">
                    <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" />
                </div>
                Wróć do usług
            </button>

            <GlareCard className="w-full shadow-2xl" isExpanded={true}>
                <div className="p-6 md:p-10 lg:p-14 h-full flex flex-col w-full">

                    {/* Rząd 1: Header + Metric */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-8 lg:mb-12">
                        <div className="lg:col-span-7">
                            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ee703d] mb-5 bg-[#ee703d]/10 px-3 py-1.5 rounded-md border border-[#ee703d]/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ee703d] animate-pulse" />
                                {service.categoryTag}
                            </p>
                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[#0A2540] mb-6 tracking-tight leading-[1.05] text-balance">
                                {service.expandedTitle}
                            </h3>
                            <p className="text-lg md:text-[19px] text-slate-500 font-medium leading-[1.6] max-w-2xl text-balance">
                                {service.expandedDescription}
                            </p>
                        </div>

                        <div className="lg:col-span-5 flex items-center justify-start lg:justify-end">
                            <div className="text-left lg:text-right border-l-[3px] lg:border-l-0 lg:border-r-[3px] border-[#ee703d] pl-6 lg:pl-0 lg:pr-6 py-2 bg-gradient-to-r lg:bg-gradient-to-l from-slate-50 to-transparent pr-8 lg:pl-12 rounded-r-2xl lg:rounded-r-none lg:rounded-l-2xl">
                                <div className="text-5xl md:text-7xl font-display font-black text-[#0A2540] tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-br from-[#0A2540] to-slate-600">
                                    {service.heroMetric.value}
                                </div>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider max-w-[180px] lg:ml-auto leading-tight mb-2">{service.heroMetric.label}</p>
                                {service.heroMetric.subtext && <p className="text-[11px] font-medium text-slate-400 italic max-w-[150px] lg:ml-auto leading-tight">{service.heroMetric.subtext}</p>}
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
        </motion.div>
    );
}

// --- MAIN GRID EXPORT ---

function CollapsedCard({ service, index }) {
    return (
        <div className="flex flex-col h-full bg-white relative overflow-hidden p-8 md:p-10 group-hover:bg-[#f7f7f8]/50 transition-colors duration-500">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f7f7f8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-bl-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-[#f5a273]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Header info */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-2xl font-display font-bold text-[#0A2540] mb-2">{service.title}</h3>
                    <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">{service.tagline}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/50 flex items-center justify-center shrink-0 group-hover:bg-[#ee703d]/10 group-hover:border-[#ee703d]/20 group-hover:scale-110 transition-all duration-300">
                    <ArrowUpRight size={18} className="text-slate-400 group-hover:text-[#ee703d] transition-colors" />
                </div>
            </div>

            {/* Preview Artifact Area */}
            <div className="mt-8 flex-1 flex items-center justify-center relative">
                <service.Preview />
            </div>
        </div>
    );
}

const AI_LOGOS = [anthropicLogo, openaiLogo, n8nLogo, perplexityLogo, lovableLogo, replitLogo];

function MarqueeRow({ reverse = false }) {
    const logos = [...AI_LOGOS, ...AI_LOGOS, ...AI_LOGOS, ...AI_LOGOS];
    return (
        <div className="flex overflow-hidden w-full pointer-events-none">
            <div
                className="flex shrink-0 gap-8 md:gap-12 items-center py-4"
                style={{
                    animation: `${reverse ? 'marquee-reverse' : 'marquee'} 40s linear infinite`,
                }}
            >
                {logos.map((src, i) => (
                    <div key={i} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-200/60 bg-white/60 shrink-0">
                        <img src={src} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain" style={{ filter: 'grayscale(1)', opacity: 0.22 }} />
                    </div>
                ))}
            </div>
            <div
                className="flex shrink-0 gap-8 md:gap-12 items-center py-4"
                aria-hidden="true"
                style={{
                    animation: `${reverse ? 'marquee-reverse' : 'marquee'} 40s linear infinite`,
                }}
            >
                {logos.map((src, i) => (
                    <div key={`dup-${i}`} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-200/60 bg-white/60 shrink-0">
                        <img src={src} alt="" className="w-6 h-6 md:w-8 md:h-8 object-contain" style={{ filter: 'grayscale(1)', opacity: 0.22 }} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function LogoCloudHeader() {
    return (
        <div className="w-full relative py-20 lg:py-28 mb-16 rounded-[2.5rem] lg:rounded-[3rem] bg-[#FAFAFA] overflow-hidden flex flex-col items-center justify-center text-center">
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
                <MarqueeRow />
            </div>

            <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 65% at center, #FAFAFA 20%, transparent 75%)' }} />
            <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'linear-gradient(to right, #FAFAFA 0%, transparent 15%, transparent 85%, #FAFAFA 100%)' }} />

            <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative z-10 mb-6"
            >
                <Logo variant="light" size={56} showWordmark={true} className="justify-center" />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="text-[11px] md:text-sm font-bold uppercase tracking-[0.25em] text-[#ee703d] mb-4 md:mb-5 relative z-10"
            >
                Nasze usługi
            </motion.p>
            <motion.h2
                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-display font-medium tracking-tight text-navy leading-[1.05] relative z-10 max-w-[90%] md:max-w-2xl px-4"
            >
                Co możemy dla Ciebie zrobić
            </motion.h2>
        </div>
    );
}

export function InteractiveServicesBento() {
    const [selectedId, setSelectedId] = useState(null);

    return (
        <section className="py-24 md:py-32 bg-white relative overflow-hidden" id="uslugi">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <LogoCloudHeader />

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {selectedId ? (
                            <ExpandedServiceView
                                key={selectedId}
                                service={SERVICES.find(s => s.id === selectedId)}
                                onClose={() => setSelectedId(null)}
                            />
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5"
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
