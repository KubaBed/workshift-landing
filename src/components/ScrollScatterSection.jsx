import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EMAILS = [
    {
        from: 'Anna Kowalska',
        subject: 'Re: Faktura FV/03/2026 — proszę o korektę',
        preview: 'Cześć, w załączniku poprawiona faktura. Proszę o weryfikację kwoty netto, bo...',
        time: '9:41',
        unread: true,
        hasAttachment: true,
        starred: false,
        category: 'faktura',
    },
    {
        from: 'Klient — Marcin Nowak',
        subject: 'PILNE: Gdzie jest moje zamówienie #4891?',
        preview: 'Dzień dobry, zamówiłem 3 dni temu i nadal nie dostałem potwierdzenia wysyłki...',
        time: '9:38',
        unread: true,
        starred: true,
        category: 'klient',
    },
    {
        from: 'Google Workspace',
        subject: 'Twoja przestrzeń dyskowa jest prawie pełna',
        preview: 'Wykorzystujesz 94% dostępnej przestrzeni. Rozważ upgrade planu lub usuń...',
        time: '9:22',
        unread: false,
        category: 'system',
    },
    {
        from: 'Dostawca XYZ Sp. z o.o.',
        subject: 'Nowy cennik obowiązujący od 01.04',
        preview: 'Szanowni Państwo, w związku ze zmianą warunków handlowych informujemy, że...',
        time: '8:55',
        unread: true,
        hasAttachment: true,
        category: 'dostawca',
    },
    {
        from: 'Karolina (księgowość)',
        subject: 'Brakujące faktury za luty — PROSZĘ O PILNĄ ODPOWIEDŹ',
        preview: 'Hej, potrzebuję jeszcze 3 faktur kosztowych za luty do zamknięcia miesiąca...',
        time: '8:47',
        unread: true,
        category: 'faktura',
    },
    {
        from: 'LinkedIn',
        subject: 'Masz 12 nowych powiadomień',
        preview: 'Jan Wiśniewski wyświetlił Twój profil. Katarzyna Mazur udostępniła post...',
        time: '8:30',
        unread: false,
        category: 'social',
    },
    {
        from: 'Zoom',
        subject: 'Reminder: Spotkanie zespołu za 30 minut',
        preview: 'Twoje spotkanie "Weekly standup" zaczyna się o 10:00. Dołącz tutaj...',
        time: '8:15',
        unread: false,
        category: 'system',
    },
    {
        from: 'Klient — Ewa Jabłońska',
        subject: 'Reklamacja — uszkodzony produkt',
        preview: 'Witam, otrzymałam paczkę i niestety jeden z produktów jest uszkodzony. Załączam zdjęcia...',
        time: 'wczoraj',
        unread: true,
        hasAttachment: true,
        starred: true,
        category: 'klient',
    },
    {
        from: 'mBank',
        subject: 'Potwierdzenie przelewu przychodzącego',
        preview: 'Na Twoje konto wpłynął przelew w wysokości 12 450,00 PLN od...',
        time: 'wczoraj',
        unread: false,
        category: 'finanse',
    },
    {
        from: 'Tomek (handlowiec)',
        subject: 'Fw: Zapytanie ofertowe — hurtowa dostawa',
        preview: 'Szefie, przekazuję zapytanie od nowego klienta. Mówi, że potrzebuje wycenę do piątku...',
        time: 'wczoraj',
        unread: true,
        hasAttachment: true,
        category: 'sprzedaz',
    },
];

const CATEGORY_COLORS = {
    faktura: '#ee703d',
    klient: '#e53e3e',
    dostawca: '#d5a4e7',
    system: '#a0aec0',
    social: '#4299e1',
    finanse: '#48bb78',
    newsletter: '#cc7cab',
    sprzedaz: '#f5a273',
};

export function ScrollScatterSection() {
    const containerRef = useRef(null);
    const emailRowRefs = useRef([]);
    const chromeRef = useRef(null);
    const emailsBgRef = useRef(null);
    const revealRef = useRef(null);
    const topTextRef = useRef(null);
    const bottomTextRef = useRef(null);
    const finalContentRef = useRef(null);

    const unreadCount = EMAILS.filter(e => e.unread).length;

    useEffect(() => {
        let ctx = gsap.context(() => {
            let mm = gsap.matchMedia();

            mm.add({
                isDesktop: "(min-width: 1024px)",
                isTablet: "(min-width: 768px) and (max-width: 1023px)",
                isMobile: "(max-width: 767px)"
            }, (context) => {
                let { isDesktop, isTablet, isMobile } = context.conditions;

                const rows = emailRowRefs.current.filter(Boolean);
                const chrome = chromeRef.current;
                const emailsBg = emailsBgRef.current;
                const reveal = revealRef.current;
                const topText = topTextRef.current;
                const bottomText = bottomTextRef.current;
                const finalContent = finalContentRef.current;

                // Initial state
                gsap.set(rows, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 });
                gsap.set(reveal, { opacity: 0, scale: 0.9, y: 40, x: 0 });
                gsap.set([chrome, topText, bottomText, emailsBg], { opacity: 1, scale: 1 });
                gsap.set(finalContent, { opacity: 0, y: isMobile ? 30 : 0, x: isMobile ? 0 : 50 });

                // Timeline
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "+=350vh", // Extended to allow time for the final shift animation
                        scrub: 1,
                        pin: true,
                    }
                });

                // PHASE 1: Pause — user sees the inbox
                tl.to({}, { duration: 1 });

                // PHASE 2: Chrome fades out
                tl.to([chrome, topText, bottomText], {
                    opacity: 0,
                    scale: 0.95,
                    duration: 1,
                    ease: "power2.in"
                });
                // Background of the inbox container fades out
                tl.to(emailsBg, {
                    opacity: 0,
                    duration: 1,
                    ease: "power2.in"
                }, "<");

                // PHASE 3: Email rows scatter 
                rows.forEach((row) => {
                    const angle = gsap.utils.random(0, Math.PI * 2);
                    const distance = gsap.utils.random(200, 600);

                    tl.to(row, {
                        x: Math.cos(angle) * distance,
                        y: Math.sin(angle) * distance,
                        rotation: gsap.utils.random(-45, 45),
                        opacity: 0,
                        scale: gsap.utils.random(0.4, 0.7),
                        ease: "power1.inOut",
                        duration: 5,
                    }, 1.5);
                });

                // PHASE 4: Reveal the organized card
                tl.to(reveal, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 2,
                    ease: "power2.out"
                }, "-=2.5");

                // Pause so user can read the card
                tl.to({}, { duration: 1 });

                // PHASE 5: Shift left, show final problem statement text
                const revealX = isMobile ? "0" : (isTablet ? "-20vw" : "-22vw");
                const revealY = isMobile ? "-22vh" : "0";
                const revealScale = isMobile ? 0.85 : 1;

                const textX = isMobile ? "0" : (isTablet ? "20vw" : "22vw");
                const textY = isMobile ? "18vh" : "0";

                tl.to(reveal, {
                    x: revealX,
                    y: revealY,
                    scale: revealScale,
                    duration: 2,
                    ease: "power2.inOut"
                });

                tl.to(finalContent, {
                    opacity: 1,
                    x: textX,
                    y: textY,
                    duration: 2,
                    ease: "power2.out"
                }, "<"); // Run contemporaneously with shift

                // Final pause
                tl.to({}, { duration: 1 });

            });

            return () => mm.revert();
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="w-full bg-slate-50 overflow-hidden relative" style={{ height: '100vh' }}>
            <div className="w-full h-full flex flex-col items-center justify-center px-4 md:px-6 relative">

                {/* Top text — zanika z chrome */}
                <p ref={topTextRef} className="text-base md:text-xl text-slate-500 font-medium text-center mb-6 md:mb-8 relative z-20">
                    Poniedziałek, 9:45 rano. Tak wygląda Twoja skrzynka.
                </p>

                {/* Gmail mockup container */}
                <div className="relative w-full max-w-full md:max-w-xl lg:max-w-2xl z-10 transition-all">

                    {/* Chrome (traffic lights + search + inbox header) — ref for fade */}
                    <div ref={chromeRef}>
                        {/* macOS traffic lights + search bar */}
                        <div className="bg-[#f6f8fc] rounded-t-xl border border-b-0 border-slate-200/80 px-4 py-3 flex items-center gap-3">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="flex-1 ml-4 bg-white/80 rounded-lg border border-slate-200/60 px-4 py-1.5 flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                                </svg>
                                <span className="text-xs text-slate-400">Szukaj w poczcie</span>
                            </div>
                        </div>

                        {/* Inbox header */}
                        <div className="bg-white border-x border-slate-200/80 px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-sm border-2 border-slate-300" />
                                <span className="text-sm font-semibold text-slate-800">Odebrane</span>
                                <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 font-bold">{unreadCount}</span>
                            </div>
                            <span className="text-xs text-slate-400">1–{EMAILS.length} z 847</span>
                        </div>
                    </div>

                    {/* Email rows container */}
                    <div className="relative overflow-visible">
                        {/* Background element that fades out separately */}
                        <div ref={emailsBgRef} className="absolute inset-0 bg-white border-x border-b border-slate-200/80 rounded-b-xl shadow-sm z-0" />

                        <div className="relative z-10 divide-y divide-slate-100 flex flex-col">
                            {EMAILS.map((email, idx) => (
                                <div
                                    key={idx}
                                    ref={(el) => { emailRowRefs.current[idx] = el; }}
                                    className={`flex items-center gap-2 px-3 md:px-4 py-2.5 ${email.unread ? 'bg-[#f2f6fc]' : 'bg-white'} will-change-transform shadow-sm relative z-20`}
                                    style={{ borderLeft: `3px solid ${CATEGORY_COLORS[email.category] || 'transparent'}` }}
                                >
                                    {/* Checkbox */}
                                    <div className="w-4 h-4 rounded-sm border-2 border-slate-300 shrink-0 hidden sm:block" />

                                    {/* Star */}
                                    <svg width="14" height="14" viewBox="0 0 24 24"
                                        fill={email.starred ? '#f6ad55' : 'none'}
                                        stroke={email.starred ? '#f6ad55' : '#cbd5e0'} strokeWidth="2" className="shrink-0 hidden sm:block">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>

                                    {/* From */}
                                    <span className={`w-24 sm:w-28 md:w-36 truncate text-xs shrink-0 ${email.unread ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                                        {email.from}
                                    </span>

                                    {/* Subject + preview */}
                                    <div className="flex-1 min-w-0 flex items-baseline gap-1 relative overflow-hidden">
                                        <span className={`truncate text-xs ${email.unread ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                                            {email.subject}
                                        </span>
                                        <span className="hidden lg:inline text-xs text-slate-400 truncate flex-1 opacity-80 pl-1 shrink-0">
                                            — {email.preview}
                                        </span>
                                    </div>

                                    {/* Attachment icon */}
                                    {email.hasAttachment && (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2" strokeLinecap="round" className="shrink-0">
                                            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                        </svg>
                                    )}

                                    {/* Time */}
                                    <span className={`text-[10px] md:text-xs shrink-0 ml-1 ${email.unread ? 'font-bold text-slate-700' : 'text-slate-400'}`}>
                                        {email.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom text — zanika z chrome */}
                <p ref={bottomTextRef} className="text-sm text-slate-400 text-center mt-6 relative z-20">
                    Nie musisz się na tym znać. My to ogarniemy.
                </p>

                {/* Reveal card — absolute positioned, centered, starts hidden */}
                <div ref={revealRef} className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none px-4">
                    <div className="pointer-events-auto max-w-sm w-full mx-auto bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl overflow-hidden rounded-xl">

                        {/* Header */}
                        <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-purple))' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-[#0A2540] font-display">Posortowane. Gotowe.</h3>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                11 maili w <span className="font-semibold text-[#ee703d]">12 sekund</span>.
                            </p>
                        </div>

                        {/* Sorted categories */}
                        <div className="px-5 md:px-6 py-3 space-y-2 md:space-y-3">
                            {[
                                { label: 'Faktury', count: 3, icon: '📄', status: 'Wysłane do FK', color: '#ee703d' },
                                { label: 'Pytania', count: 2, icon: '💬', status: 'Odpisane', color: '#e53e3e' },
                                { label: 'Do decyzji', count: 2, icon: '⚡', status: 'Oczekują w folderze', color: '#f5a273' },
                            ].map((cat, idx) => (
                                <div key={idx} className="flex items-center gap-3 py-1">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[13px] font-semibold text-[#0A2540]">{cat.label}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-400">{cat.status}</p>
                                    </div>
                                    <span className="text-xs text-slate-400 font-bold">({cat.count})</span>
                                </div>
                            ))}
                        </div>

                        {/* Time saved */}
                        <div className="px-5 md:px-6 py-3 bg-[#f7f7f8] border-t border-slate-100 flex items-baseline justify-between">
                            <span className="text-xs text-slate-500">Zaoszczędzono dziś:</span>
                            <span className="text-lg font-bold text-[#0A2540] tracking-tight">47 min</span>
                        </div>
                    </div>
                </div>

                {/* Final Content: AI tools overloading problem message */}
                <div ref={finalContentRef} className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none px-6">
                    <div className="pointer-events-auto max-w-lg bg-white/50 backdrop-blur-2xl md:bg-transparent md:backdrop-blur-none p-6 rounded-2xl md:p-0 w-full text-center md:text-left border border-slate-200/50 md:border-none shadow-xl md:shadow-none">
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-medium text-navy tracking-tight leading-tight mb-4">
                            Codziennie powstają setki "przełomowych" funkcji AI.
                        </h3>
                        <p className="text-base md:text-lg text-slate-600 mb-4 leading-relaxed">
                            Technologia rozwija się tak szybko, że ciężko za nią nadążyć.<br className="hidden md:block" />
                            <strong className="text-accent font-semibold">I wcale nie musisz tego robić.</strong>
                        </p>
                        <p className="text-[15px] md:text-base text-slate-500 leading-relaxed max-w-md mx-auto md:mx-0">
                            Nie musisz śledzić nowinek, wdrażać skomplikowanych dashboardów ani uczyć się pisania promptów. Zamiast przebijać się przez technologiczny chaos, wybierz wąskie gardło w swojej firmie. My dobierzemy <b>jedno narzędzie</b>, które rozwiąże problem.
                        </p>
                        <p className="text-sm font-semibold text-slate-400 mt-6 uppercase tracking-wider">
                            Ty masz biznes. My dowieziemy wynik.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
