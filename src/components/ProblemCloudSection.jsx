import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Colored AI Tools Mock Data (using Lucide icons as stand-ins to avoid broken CDN links, but colored contextually)
const TOOL_ICONS = [
    { color: 'text-emerald-500', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>' }, // ChatGPT/Bot
    { color: 'text-purple-500', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' }, // Slack/Comms
    { color: 'text-rose-500', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>' }, // Notion/Docs
    { color: 'text-blue-500', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' }, // Asana/Tasks
    { color: 'text-amber-500', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="8" height="8" x="8" y="8" rx="2"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.9 4.9l1.4 1.4"/><path d="M17.7 17.7l1.4 1.4"/><path d="M4.9 19.1l1.4-1.4"/><path d="M17.7 6.3l1.4-1.4"/></svg>' }, // Make/Automations
    { color: 'text-sky-400', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/></svg>' } // Design/Graphics
];

export function ProblemCloudSection() {
    const containerRef = useRef(null);
    const cloudContainerRef = useRef(null);
    const textRevealRef = useRef(null);
    const introTextRef = useRef(null);
    const cloudItems = useRef([]);

    useEffect(() => {
        let ctx = gsap.context(() => {

            // Infinite floating animation for logos (independent of scroll)
            cloudItems.current.forEach((item, i) => {
                gsap.to(item, {
                    y: "random(-15, 15)",
                    x: "random(-15, 15)",
                    rotation: "random(-10, 10)",
                    duration: "random(3, 5)",
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });

            // Master ScrollTrigger Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=2000", // Stretch the scroll distance for all phases
                    scrub: 1,
                    pin: true,
                }
            });

            // PHASE 1: Blur Reveal of the intro text
            // Text starts blurred and transparent
            gsap.set(introTextRef.current, { filter: 'blur(20px)', opacity: 0, scale: 0.9 });
            tl.to(introTextRef.current, { filter: 'blur(0px)', opacity: 1, scale: 1, duration: 2 }, 0);

            // Pause for阅读 (empty duration in timeline)
            tl.to({}, { duration: 1 });

            // PHASE 2: Intro text fades out, cloud drops in
            tl.to(introTextRef.current, { opacity: 0, y: -50, filter: 'blur(10px)', duration: 1.5 });

            // Cloud starts hidden and scaled down
            gsap.set(cloudItems.current, { opacity: 0, scale: 0, y: -100 });

            // Cloud drops in randomly
            tl.to(cloudItems.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                stagger: { amount: 1, from: "center", ease: "power2.out" },
                duration: 1.5
            });

            // Pause to let the chaos sink in
            tl.to({}, { duration: 1 });

            // PHASE 3: Cloud disperses violently
            cloudItems.current.forEach((item, index) => {
                const angle = (index / cloudItems.current.length) * Math.PI * 2;
                const pushDistance = 1500; // Push off screen
                const xDist = Math.cos(angle) * pushDistance;
                const yDist = Math.sin(angle) * pushDistance;

                tl.to(item, {
                    x: xDist,
                    y: yDist,
                    rotation: "random(-360, 360)",
                    scale: 0.2,
                    opacity: 0,
                    duration: 2.5,
                    ease: "power3.inOut"
                }, "<"); // start at same time as next block
            });

            // PHASE 4: Core Message Reveals from the center
            gsap.set(textRevealRef.current, { opacity: 0, scale: 0.8, y: 50 });
            tl.to(textRevealRef.current, { opacity: 1, scale: 1, y: 0, duration: 2, ease: "power2.out" }, "-=1.5");

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const generateLogos = () => {
        return Array.from({ length: 45 }).map((_, i) => {
            const size = Math.random() * 45 + 35; // 35-80px
            const top = `${Math.random() * 80 + 10}%`;
            const left = `${Math.random() * 80 + 10}%`;
            const tool = TOOL_ICONS[i % TOOL_ICONS.length];

            return (
                <div
                    key={i}
                    ref={(el) => (cloudItems.current[i] = el)}
                    className={`absolute glass-panel rounded-2xl flex items-center justify-center shadow-lg border border-slate-200/50 hover:bg-white hover:scale-110 transition-transform ${tool.color}`}
                    style={{ width: size, height: size, top, left }}
                    dangerouslySetInnerHTML={{ __html: tool.svg }}
                />
            );
        });
    };

    return (
        <section ref={containerRef} className="relative h-screen w-full bg-alabaster overflow-hidden flex flex-col items-center justify-center">

            {/* Starting Text: Blurred initially, revealed via GSAP */}
            <div ref={introTextRef} className="absolute z-40 pointer-events-none text-center max-w-3xl px-6">
                <p className="font-display text-2xl md:text-5xl font-bold text-navy leading-tight tracking-tight mb-4 text-balance">
                    Codziennie powstają setki narzędzi i "przełomowych" funkcji AI.
                </p>
                <p className="text-xl md:text-2xl font-medium text-slate-500">
                    Technologia ewoluuje tak szybko, że ciężko za nią nadążyć.
                </p>
            </div>

            {/* The Cloud container */}
            <div ref={cloudContainerRef} className="absolute inset-0 z-30 pointer-events-none">
                {generateLogos()}
            </div>

            {/* The Revealed Message Center */}
            <div ref={textRevealRef} className="relative z-20 max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-5xl md:text-7xl font-bold font-display tracking-tighter text-navy mb-8">
                    I wcale <span className="text-terra bg-terra/10 px-4 py-1 -mx-2 rounded-xl inline-block -rotate-2 border border-terra/20">nie musisz</span> tego robić.
                </h2>
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-[65ch] mx-auto text-balance font-medium">
                    Nie musisz śledzić technologicznych nowinek, wdrażać obcych dashboardów ani uczyć się pisania promptów. Ty masz biznes do prowadzenia, my wiemy, jak dowieźć wynik.
                    <br /><br />
                    Zamiast przebijać się przez technologiczny szum, zdejmij najgorszą powtarzalną pracę z Twojego zespołu.
                </p>
            </div>

        </section>
    );
}
