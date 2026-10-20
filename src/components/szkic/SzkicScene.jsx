import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Mic, Square, MousePointer2 } from 'lucide-react';

/**
 * Animowana scena w hero /narzedzia/szkic: jedno nagranie od startu do wklejenia.
 *
 * Fazy (pętla ok. 12 s):
 *   0 spoczynek, 1 nagrywanie i kursor jedzie do „Zapisz”, 2 kliknięcie,
 *   3 kreska wokół miejsca na komunikat, 4 stop i powiadomienie,
 *   5 paczka wklejona do czatu z agentem, 6 odpowiedź agenta.
 *
 * Wszystkie wymiary w jednostkach cqw (procent szerokości kontenera), więc scena skaluje się
 * od telefonu po szeroki ekran bez przeliczania w JS. Przy prefers-reduced-motion scena stoi
 * w ostatniej fazie, a poza ekranem pętla się zatrzymuje.
 */

const PHASES = [
    { at: 0 },
    { at: 900 },
    { at: 2600 },
    { at: 3600 },
    { at: 6000 },
    { at: 7400 },
    { at: 9000 },
];
const LOOP_MS = 12500;
const FINAL_PHASE = 6;

const RED = '#DD453D';
const EASE = [0.22, 1, 0.36, 1];

// Odręczne kółko wokół pustego miejsca pod przyciskiem (viewBox 0 0 100 60).
const CIRCLE_PATH = 'M 14 34 C 10 12, 82 4, 94 24 C 104 44, 40 58, 16 46 C 6 40, 12 22, 34 16';
// Środek przycisku „Zapisz” i droga kursora po kształcie kreski (w % okna aplikacji).
const BUTTON_AT = { left: '13.4%', top: '64.3%' };
const DRAW_X = ['12.1%', '33%', '58.5%', '38.8%', '13.3%', '11%', '23.7%'];
const DRAW_Y = ['86.6%', '76.2%', '82.6%', '93.8%', '91.4%', '84.2%', '79.4%'];

export function SzkicScene() {
    const reduce = useReducedMotion();
    const rootRef = useRef(null);
    const [livePhase, setPhase] = useState(0);
    const [visible, setVisible] = useState(true);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (reduce || !visible) return;
        const timers = PHASES.map((p, i) => setTimeout(() => setPhase(i), p.at));
        timers.push(setTimeout(() => setCycle((c) => c + 1), LOOP_MS));
        return () => timers.forEach(clearTimeout);
    }, [reduce, visible, cycle]);

    const phase = reduce ? FINAL_PHASE : livePhase;

    const recording = phase >= 1 && phase <= 3;
    const said =
        phase === 1 || phase === 2
            ? 'Klikam zapisz i nic się nie dzieje,'
            : phase === 3
              ? 'a tutaj powinien pojawić się komunikat.'
              : null;

    return (
        <figure ref={rootRef} className="relative w-full" aria-label="Animacja: nagranie ekranu w Szkicu i wklejenie paczki do czatu z agentem">
            <div className="relative w-full aspect-[16/10] rounded-2xl bg-[#d9dccf] ring-1 ring-black/10 shadow-[0_30px_80px_-30px_rgba(40,48,20,0.35)] overflow-hidden [container-type:inline-size]">
                <MenuBar recording={recording} phase={phase} />
                <RecordingBar recording={recording} />

                {/* Okno aplikacji, którą nagrywamy. Kreska i kursor są liczone w procentach okna,
                    żeby trzymały się przycisku niezależnie od proporcji sceny. */}
                <div className="absolute left-[6%] top-[13%] w-[60%] [container-type:inline-size]">
                    <AppWindow clickPulse={phase === 2} />

                    {/* Kreska Szkicu: rysuje się w fazie 3 i blednie po nagraniu
                        (w paczce zostaje, stąd stała kreska w miniaturach czatu). */}
                    <motion.svg
                        viewBox="0 0 100 60"
                        preserveAspectRatio="none"
                        className="absolute left-[4%] top-[73%] w-[58%] h-[24%] overflow-visible pointer-events-none"
                        initial={false}
                        animate={{ opacity: phase === 3 || phase === 4 ? 1 : 0 }}
                        transition={{ duration: phase === 3 ? 0 : 0.6 }}
                        aria-hidden="true"
                    >
                        <motion.path
                            d={CIRCLE_PATH}
                            fill="none"
                            stroke={RED}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            initial={false}
                            animate={{ pathLength: phase >= 3 ? 1 : 0 }}
                            transition={{ duration: phase === 3 ? 1.6 : 0, ease: 'easeInOut' }}
                        />
                    </motion.svg>

                    <Cursor phase={phase} reduce={reduce} />
                </div>

                <AnimatePresence>
                    {phase === 4 && (
                        <motion.div
                            key="toast"
                            initial={{ opacity: 0, y: -12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="absolute right-[3%] top-[9%] w-[34%] rounded-[1.6cqw] bg-white/90 backdrop-blur-md ring-1 ring-black/10 shadow-lg px-[2cqw] py-[1.6cqw]"
                        >
                            <p className="text-[1.7cqw] font-medium text-black leading-tight">Szkic: paczka w schowku</p>
                            <p className="text-[1.45cqw] text-muted-dark leading-snug mt-[0.4cqw]">2 klatki, 0:07. Wklej ⌘V w czacie z agentem.</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AgentChat phase={phase} />
            </div>

            {/* Głos: tego nie ma na ekranie, Szkic tylko go zapisuje. Dlatego podpis jest pod sceną. */}
            <figcaption className="mt-4 min-h-10 flex items-center gap-3 text-sm text-muted-dark">
                <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0 transition-colors duration-300 ${said ? 'bg-black text-white' : 'bg-black/5 text-black/40'}`}
                    aria-hidden="true"
                >
                    <Mic className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={said ?? 'quiet'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className={said ? 'text-black' : ''}
                    >
                        {said ? `„${said}”` : phase >= 4 ? 'Szkic dopasował Twoje słowa do klatek.' : 'Mówisz, a Szkic zapisuje.'}
                    </motion.span>
                </AnimatePresence>
            </figcaption>
        </figure>
    );
}

// Licznik nagrania. Montowany tylko na czas nagrywania, więc każde nagranie zaczyna od 0:00.
function RecTimer() {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, []);
    return <span className="font-mono tabular-nums">0:0{Math.min(seconds, 9)}</span>;
}

function MenuBar({ recording, phase }) {
    return (
        <div className="absolute inset-x-0 top-0 h-[5.2%] bg-white/55 backdrop-blur-md flex items-center justify-between px-[2.4cqw] text-[1.45cqw] text-black/80">
            <div className="flex items-center gap-[2.2cqw]">
                <span className="font-semibold">Safari</span>
                <span>Plik</span>
                <span>Edycja</span>
                <span className="hidden sm:inline">Widok</span>
            </div>
            <div className="flex items-center gap-[1.8cqw]">
                <span
                    className={`inline-flex items-center gap-[0.6cqw] rounded-[0.6cqw] px-[0.8cqw] py-[0.15cqw] transition-colors duration-300 ${recording ? 'bg-[#DD453D] text-white' : phase >= 4 ? 'bg-black/10' : ''}`}
                >
                    <SzkicGlyph />
                    {recording && <RecTimer />}
                </span>
                <span className="tabular-nums">wt. 14:32</span>
            </div>
        </div>
    );
}

// Znak w pasku menu: kreska z kółkiem, jak to, co Szkic rysuje. Prosty kształt, nie logo.
function SzkicGlyph() {
    return (
        <svg viewBox="0 0 16 16" className="w-[1.8cqw] h-[1.8cqw]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M3 11.5 C 5 6, 8 5, 13 4" />
            <circle cx="11" cy="10.5" r="2.4" />
        </svg>
    );
}

function RecordingBar({ recording }) {
    return (
        <AnimatePresence>
            {recording && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="absolute left-1/2 -translate-x-1/2 top-[7.5%] flex items-center gap-[1.2cqw] rounded-full bg-black/85 text-white px-[1.6cqw] py-[0.7cqw] text-[1.35cqw] shadow-lg z-10"
                >
                    <span className="w-[1cqw] h-[1cqw] rounded-full bg-[#DD453D] animate-pulse" aria-hidden="true" />
                    <span className="rounded-full bg-white/15 px-[1cqw] py-[0.2cqw]">Używam aplikacji</span>
                    <span className="text-white/50">Zaznaczam</span>
                    <Square className="w-[1.4cqw] h-[1.4cqw] fill-white" strokeWidth={0} aria-hidden="true" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/** Okno nagrywanej aplikacji. Jednostki cqw liczą się od szerokości samego okna. */
function AppWindow({ clickPulse = false, mini = false }) {
    return (
        <div className="w-full rounded-[2cqw] bg-white ring-1 ring-black/10 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="flex items-center gap-[1.2cqw] px-[3cqw] py-[2.2cqw] border-b border-black/5">
                <span className="w-[1.8cqw] h-[1.8cqw] rounded-full bg-black/15" />
                <span className="w-[1.8cqw] h-[1.8cqw] rounded-full bg-black/15" />
                <span className="w-[1.8cqw] h-[1.8cqw] rounded-full bg-black/15" />
                {!mini && <span className="ml-[3cqw] text-[2.6cqw] text-muted-dark">Ustawienia konta</span>}
            </div>
            <div className="px-[5cqw] pt-[4cqw] pb-[22cqw] space-y-[3.2cqw]">
                <Field label="Imię i nazwisko" value="Anna Wiśniewska" mini={mini} />
                <Field label="E-mail" value="anna@pracownia.pl" mini={mini} />
                <div className="relative inline-block">
                    <span data-szkic-save className="inline-flex items-center rounded-[1.4cqw] bg-black text-white text-[2.8cqw] px-[4cqw] py-[1.8cqw]">
                        Zapisz
                    </span>
                    <AnimatePresence>
                        {clickPulse && (
                            <motion.span
                                key="pulse"
                                className="absolute inset-0 rounded-[1.4cqw] ring-[0.6cqw] ring-black/30"
                                initial={{ opacity: 0.9, scale: 1 }}
                                animate={{ opacity: 0, scale: 1.35 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                                aria-hidden="true"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, mini }) {
    return (
        <div>
            <p className="text-[2.3cqw] text-muted-dark mb-[1cqw]">{label}</p>
            <div className="rounded-[1.2cqw] ring-1 ring-black/15 px-[2.4cqw] py-[1.8cqw] text-[2.6cqw] text-black">
                {mini ? <span className="block h-[2.2cqw] w-1/2 rounded bg-black/10" /> : value}
            </div>
        </div>
    );
}

function Cursor({ phase, reduce }) {
    if (reduce || phase >= 5) return null;

    let animate = { left: '92%', top: '30%' };
    let transition = { duration: 1.2, ease: EASE };
    if (phase === 1) animate = { left: BUTTON_AT.left, top: BUTTON_AT.top };
    if (phase === 2) {
        animate = { left: BUTTON_AT.left, top: BUTTON_AT.top, scale: [1, 0.85, 1] };
        transition = { duration: 0.3 };
    }
    if (phase === 3) {
        animate = { left: DRAW_X, top: DRAW_Y };
        transition = { duration: 1.6, ease: 'easeInOut' };
    }
    if (phase === 4) animate = { left: '92%', top: '60%' };

    return (
        <motion.div
            className="absolute z-20 pointer-events-none"
            initial={{ left: '92%', top: '30%' }}
            animate={animate}
            transition={transition}
            aria-hidden="true"
        >
            <MousePointer2 className="w-[5cqw] h-[5cqw] text-black fill-white drop-shadow" strokeWidth={1.5} />
            <AnimatePresence>
                {phase === 3 && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-[5cqw] top-[4cqw] inline-flex items-center justify-center min-w-[5cqw] h-[5cqw] px-[1.2cqw] rounded-[1.2cqw] bg-white ring-1 ring-black/15 shadow-[0_0.4cqw_0_rgba(0,0,0,0.15)] font-mono text-[2.8cqw] text-black"
                    >
                        ⇧
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function AgentChat({ phase }) {
    const open = phase >= 5;
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: '8%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '6%' }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="absolute right-[3%] top-[9%] bottom-[5%] w-[52%] rounded-[3cqw] bg-white ring-1 ring-black/10 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden z-10"
                >
                    <div className="px-[2.2cqw] py-[1.4cqw] border-b border-black/5 text-[1.5cqw] text-muted-dark">Czat z agentem</div>
                    <div className="flex-1 p-[2cqw] flex flex-col gap-[1.6cqw] text-[1.45cqw] leading-snug">
                        <div className="self-end w-[88%] rounded-[1cqw] bg-sage p-[1.4cqw]">
                            <div className="grid grid-cols-2 gap-[0.8cqw]">
                                <MiniFrame badge="#1 0:02" />
                                <MiniFrame badge="#2 0:05" marked />
                            </div>
                            <div className="mt-[1.2cqw] font-mono text-[1.2cqw] text-black/80 space-y-[0.4cqw]">
                                <p>#1 (0:02) [kliknięcie „Zapisz”] „Klikam zapisz i nic się nie dzieje,”</p>
                                <p>#2 (0:05) [zaznaczenie] „a tutaj powinien pojawić się komunikat.”</p>
                            </div>
                        </div>
                        <AnimatePresence>
                            {phase >= 6 && (
                                <motion.p
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                    className="w-[88%] text-black"
                                >
                                    Widzę: po kliknięciu „Zapisz” nie pojawia się żaden komunikat. Sprawdzam obsługę błędów w formularzu ustawień.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function MiniFrame({ badge, marked = false }) {
    return (
        <div className="relative rounded-[0.8cqw] bg-[#d9dccf] p-[0.8cqw] overflow-hidden">
            <div className="w-[78%] [container-type:inline-size]">
                <AppWindow mini />
            </div>
            {marked && (
                <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute left-[18%] top-[52%] w-[52%] h-[30%] overflow-visible" aria-hidden="true">
                    <path d={CIRCLE_PATH} fill="none" stroke={RED} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                </svg>
            )}
            <span className="absolute right-[0.6cqw] bottom-[0.6cqw] rounded-[0.4cqw] bg-black/80 text-white font-mono text-[1cqw] px-[0.6cqw] py-[0.1cqw]">
                {badge}
            </span>
        </div>
    );
}
