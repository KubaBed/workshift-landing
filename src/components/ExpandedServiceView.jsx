import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { animate } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Zap } from 'lucide-react';
import { GlareCard } from './ui/GlareCard';
import { IntegrationsMarquee, IntegrationLogo } from './ui/IntegrationsMarquee';
import { AnimatedProcessIcon } from './ui/AnimatedProcessIcon';

/**
 * Rozwinięty widok usługi: górna część strony /uslugi/:id (nagłówek, metryka, karty).
 *
 * Osobny moduł, żeby strona usługi nie ciągnęła siatki bento ze strony głównej
 * (CircularGallery, Terminal, podglądy) ani gsap. Wejście bez opacity 0 na treści:
 * opis usługi to element LCP na telefonie (PSI 15.10: LCP 3,45 s przy FCP 2,15 s,
 * bo kontener startował niewidoczny i czekał na gsap). Animacje kart i odsłonięcie
 * to klasy CSS z src/index.css (service-reveal, service-card-in, service-step-in).
 */

/**
 * Kafelek karty insights: ikona z zestawu AnimatedProcessIcon (animuje się
 * na hover), styl spójny z resztą kart (mono labelki, weight-medium tytuły).
 * Nieznana nazwa ikony (np. stare emoji) renderuje się jak dotąd - fallback.
 */
function InsightTile({ insight }) {
    const [hovered, setHovered] = useState(false);
    // Nazwa slugowa = ikona z zestawu; wszystko inne (np. stare emoji) = fallback tekstowy.
    const named = /^[a-z]+$/.test(insight.icon ?? '');
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="p-4 rounded-[10px] border border-black/5 bg-sage flex flex-col transition-colors duration-300 hover:border-black/15"
        >
            <div className="mb-3 bg-white w-10 h-10 rounded-[10px] flex items-center justify-center border border-black/5 text-black">
                {named ? <AnimatedProcessIcon name={insight.icon} active={hovered} /> : <span className="text-2xl">{insight.icon}</span>}
            </div>
            <div className="font-medium text-black text-[15px] mb-1.5 leading-snug">{insight.title}</div>
            <div className="text-[13px] text-muted-dark leading-relaxed">{insight.desc}</div>
        </div>
    );
}

// --- UNIVERSAL INNER CARDS RENDERER FOR EXPANDED VIEW ---
function ExtendedInnerCard({ card, index }) {

    return (
        <div
            style={{ animationDelay: `${0.15 + index * 0.08}s` }}
            className={`service-card-in
          ${card.colSpan || 'lg:col-span-1'}
          bg-sage rounded-[10px] border border-black/5
          overflow-hidden flex flex-col min-h-[140px]
          transition-[border-color,transform,box-shadow] duration-300
          hover:border-black/15 hover:-translate-y-0.5 hover:shadow-sm
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

            {card.type === 'toolsMarquee' && (
                <div className="p-6 md:p-8 flex flex-col bg-white">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-7">
                        <div className="max-w-2xl">
                            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-dark mb-3">{card.label}</h4>
                            <p className="text-[15px] md:text-base text-black leading-relaxed">{card.intro}</p>
                        </div>
                        {card.glue && (
                            <div className="shrink-0">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-muted-dark mb-2 lg:text-right">{card.glue.label}</div>
                                <div className="flex gap-2">
                                    {card.glue.tools.map((tool) => (
                                        <div key={tool.name} className="flex items-center gap-2 bg-sage border border-black/5 rounded-[10px] px-3 py-2 transition-colors hover:border-lime/40">
                                            <IntegrationLogo tool={tool} className="w-4 h-4 object-contain" />
                                            <span className="text-sm font-medium text-black">{tool.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <IntegrationsMarquee tools={card.tools} badge={card.badge} />
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
                            <div key={i} style={{ animationDelay: `${0.2 + i * 0.1}s` }} className="service-step-in flex flex-col items-center max-w-[120px] text-center gap-3">
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
                    <h4 className="text-xs font-mono uppercase tracking-widest text-muted-dark mb-5">{card.label}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {card.cards.map((insight) => (
                            <InsightTile key={insight.title} insight={insight} />
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
                          bg-black relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(120% 120% at 50% 100%, rgba(156, 224, 105, 0.3) 0%, transparent 60%)' }} />
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 relative z-10 backdrop-blur-sm shadow-xl">
                        <ArrowRight size={24} className="text-lime mix-blend-screen" />
                    </div>
                    <h4 className="text-2xl lg:text-3xl font-display text-white mb-4 relative z-10 leading-[1.1]">{card.headline}</h4>
                    <p className="text-sm text-white/60 mb-10 max-w-[240px] relative z-10">{card.subline}</p>
                    <Link to="/#kontakt" className="inline-flex items-center gap-2 bg-lime text-black px-8 py-4
                                         rounded-[10px] font-medium text-sm shadow-[0_4px_20px_-5px_rgba(156,224,105,0.4)] group-hover:shadow-[0_10px_30px_-5px_rgba(156,224,105,0.4)] group-hover:-translate-y-1 transition-all duration-300 relative z-10 w-full justify-center active:scale-[0.96]">
                        {card.ctaLabel}
                    </Link>
                </div>
            )}
        </div>
    );
}

export function ExpandedServiceView({ service, onClose }) {
    const metricRef = useRef(null);

    // Count-up metryki hero ('10h+' -> 0..10 + 'h+'). Zakresy typu '4-8 tyg.'
    // zostają statyczne - animowany początek zakresu wyglądałby jak inna liczba.
    useLayoutEffect(() => {
        const el = metricRef.current;
        if (!el) return undefined;
        const match = /^(\d+)([^-\d].*)?$/.exec(service.heroMetric.value);
        if (!match) return undefined;
        const target = Number(match[1]);
        const suffix = match[2] ?? '';
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const controls = animate(0, target, {
            duration: 1.1,
            delay: 0.25,
            ease: [0.215, 0.61, 0.355, 1],
            onUpdate: (v) => { el.textContent = `${Math.round(v)}${suffix}`; },
        });
        return () => controls.stop();
    }, [service.heroMetric.value]);

    return (
        <div
            className="service-reveal w-full relative pt-10"
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
                            {/* H1 strony usługi = nazwa usługi (fraza SEO), nagłówek wizualny to h2. */}
                            <h1 className="inline-flex items-center gap-2 text-[10px] font-mono font-normal uppercase tracking-[0.2em] text-black mb-5 bg-lime/20 px-3 py-1.5 rounded-md border border-lime/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                                {service.title}
                            </h1>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-black mb-6 tracking-tight leading-[1.05] text-balance">
                                {service.expandedTitle}
                            </h2>
                            <p className="text-lg md:text-[19px] text-muted-dark leading-[1.6] max-w-2xl text-balance">
                                {service.expandedDescription}
                            </p>
                        </div>

                        <div className="lg:col-span-5 flex items-center justify-start lg:justify-end">
                            <div className="text-left lg:text-right border-l-[3px] lg:border-l-0 lg:border-r-[3px] border-lime pl-6 lg:pl-0 lg:pr-6 py-2 bg-gradient-to-r lg:bg-gradient-to-l from-sage to-transparent pr-8 lg:pl-12 rounded-r-[10px] lg:rounded-r-none lg:rounded-l-[10px]">
                                <div ref={metricRef} className="text-5xl md:text-7xl font-display font-black text-black tracking-tighter mb-2 pb-2">
                                    {service.heroMetric.value}
                                </div>
                                <p className="text-xs text-muted-dark font-mono uppercase tracking-wider max-w-[180px] lg:ml-auto leading-tight mb-2">{service.heroMetric.label}</p>
                                {service.heroMetric.subtext && <p className="text-[11px] font-mono text-muted-dark italic max-w-[150px] lg:ml-auto leading-tight">{service.heroMetric.subtext}</p>}
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

            {/* Bottom back button */}
            <button
                onClick={onClose}
                className="mt-8 mx-auto flex items-center gap-2 text-[12px] font-mono uppercase tracking-widest text-muted-dark hover:text-black transition-colors group/back px-2"
            >
                <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center group-hover/back:bg-sage/80 transition-colors border border-black/5">
                    <ArrowLeft size={14} className="group-hover/back:-translate-x-1 transition-transform" />
                </div>
                Wróć do usług
            </button>
        </div>
    );
}
