import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Copy,
    Check,
    X,
    Sparkles,
    Code2,
    Image as ImageIcon,
    Braces,
    MessageCircle,
    Library,
    Bot,
} from 'lucide-react';
import { track, EVENTS } from '../lib/analytics';

const WHATSAPP_URL =
    'https://wa.me/48796186067?text=' +
    encodeURIComponent('Cześć Kuba, korzystam z bazy promptów i chcę pogadać o wdrożeniu AI.');

const PAGE_SIZE = 24;

// type → etykieta + ikona (TEXT | STRUCTURED | IMAGE)
const TYPE_META = {
    TEXT: { label: 'Tekstowy', Icon: Sparkles },
    STRUCTURED: { label: 'Strukturalny', Icon: Braces },
    IMAGE: { label: 'Obraz', Icon: ImageIcon },
};

// category key → etykieta PL (lustro CATEGORY_META w scripts/build-prompts-data.py)
const CATEGORY_LABELS = {
    prawo: 'Prawo i kancelarie',
    hr: 'HR i rekrutacja',
    ecommerce: 'E-commerce',
    marketing: 'Marketing i reklama',
    produkcja: 'Produkcja i logistyka',
    konsulting: 'Konsulting i B2B',
    programowanie: 'Programowanie',
    dane: 'Dane i analiza',
    edukacja: 'Edukacja',
    kreatywne: 'Kreatywne',
    pisanie: 'Pisanie i treści',
    produktywnosc: 'Produktywność',
    inne: 'Inne',
};

export default function PromptyPage() {
    const [tab, setTab] = useState('prompty'); // 'prompty' | 'persony'
    const [index, setIndex] = useState([]);
    const [categories, setCategories] = useState([]); // z meta: {key,label,industry,count}
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('ALL');
    const [onlyPl, setOnlyPl] = useState(true); // domyślnie tylko polskie (toggle wyłącza)
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [active, setActive] = useState(null); // otwarty prompt (modal): {id, act, type, body}
    const [persona, setPersona] = useState(null); // otwarta persona (modal)
    const [toast, setToast] = useState('');

    const bodiesPromise = useRef(null); // lazy mapa id -> pełna treść

    // SEO + view event
    useEffect(() => {
        document.title = 'Baza promptów i skilli AI po polsku | Workshift';
        const meta = document.querySelector('meta[name="description"]');
        if (meta) {
            meta.setAttribute(
                'content',
                '200 polskich promptów AI i 12 gotowych person do ChatGPT, Claude i Gemini. Przeszukuj, kopiuj, wdrażaj. Darmowa baza od Workshift.'
            );
        }
        window.scrollTo(0, 0);
        track(EVENTS.LIBRARY_VIEW);
    }, []);

    // Lekki indeks — lista + wyszukiwarka renderują się natychmiast.
    useEffect(() => {
        let alive = true;
        fetch('/prompty/index.json')
            .then((r) => r.json())
            .then((d) => {
                if (!alive) return;
                setIndex(d.prompts || []);
                setCategories(d.meta?.categories || []);
                setLoading(false);
            })
            .catch(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, []);

    // Persony (małe, ładujemy od razu).
    useEffect(() => {
        let alive = true;
        fetch('/prompty/personas.json')
            .then((r) => r.json())
            .then((d) => alive && setPersonas(d.personas || []))
            .catch(() => {});
        return () => {
            alive = false;
        };
    }, []);

    // Pełne treści doczytujemy leniwie (do kopiowania / modala), bez blokowania paintu.
    const loadBodies = useCallback(() => {
        if (!bodiesPromise.current) {
            bodiesPromise.current = fetch('/prompty/prompts.json')
                .then((r) => r.json())
                .then((d) => {
                    const m = new Map();
                    for (const p of d.prompts || []) m.set(p.id, p.promptPl || p.prompt);
                    return m;
                })
                .catch(() => new Map());
        }
        return bodiesPromise.current;
    }, []);

    // Prefetch treści w bezczynności (po pierwszym renderze listy).
    useEffect(() => {
        if (loading) return;
        const id = window.requestIdleCallback
            ? window.requestIdleCallback(() => loadBodies())
            : setTimeout(() => loadBodies(), 1200);
        return () => (window.cancelIdleCallback ? window.cancelIdleCallback(id) : clearTimeout(id));
    }, [loading, loadBodies]);

    // Debounced search event (nie spamujemy analytics).
    useEffect(() => {
        if (query.trim().length < 3) return;
        const t = setTimeout(() => track(EVENTS.LIBRARY_SEARCH, { q: query.trim().slice(0, 40) }), 700);
        return () => clearTimeout(t);
    }, [query]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return index.filter((p) => {
            if (onlyPl && p.lang !== 'pl') return false;
            if (category !== 'ALL' && p.category !== category) return false;
            if (!q) return true;
            return p.act.toLowerCase().includes(q) || (p.preview || '').toLowerCase().includes(q);
        });
    }, [index, query, category, onlyPl]);

    const plCount = useMemo(() => index.filter((p) => p.lang === 'pl').length, [index]);

    // Liczniki kategorii respektują toggle „tylko polskie".
    const baseForCounts = useMemo(
        () => (onlyPl ? index.filter((p) => p.lang === 'pl') : index),
        [index, onlyPl]
    );
    const catCountMap = useMemo(() => {
        const m = {};
        for (const p of baseForCounts) m[p.category] = (m[p.category] || 0) + 1;
        return m;
    }, [baseForCounts]);
    const catCount = (c) => (onlyPl ? catCountMap[c.key] || 0 : c.count);

    const toggleOnlyPl = () => {
        setOnlyPl((v) => {
            track(EVENTS.LIBRARY_ONLY_PL, { on: !v });
            return !v;
        });
        setVisible(PAGE_SIZE);
    };

    const pickCategory = (key) => {
        setCategory(key);
        setVisible(PAGE_SIZE);
        if (key !== 'ALL') track(EVENTS.LIBRARY_TAB, { category: key });
    };

    const industryCats = categories.filter((c) => c.industry);
    const generalCats = categories.filter((c) => !c.industry);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 2200);
    };

    const handleCopy = useCallback(
        async (p) => {
            const bodies = await loadBodies();
            const text = bodies.get(p.id) || p.preview || '';
            try {
                await navigator.clipboard.writeText(text);
                showToast('Skopiowano do schowka');
                track(EVENTS.PROMPT_COPY, { id: p.id, type: p.type });
            } catch {
                showToast('Nie udało się skopiować');
            }
        },
        [loadBodies]
    );

    const handleOpen = useCallback(
        async (p) => {
            track(EVENTS.PROMPT_OPEN, { id: p.id, type: p.type });
            setActive({ ...p, body: null });
            const bodies = await loadBodies();
            setActive((cur) => (cur && cur.id === p.id ? { ...cur, body: bodies.get(p.id) || '' } : cur));
        },
        [loadBodies]
    );

    const openPersona = useCallback((p) => {
        track(EVENTS.PERSONA_OPEN, { id: p.id });
        setPersona({ act: p.name, body: p.instruction, _persona: true });
    }, []);

    const copyPersona = useCallback(async (p) => {
        const text = p.body || p.instruction || '';
        try {
            await navigator.clipboard.writeText(text);
            showToast('Skopiowano instrukcję');
            track(EVENTS.PERSONA_COPY, { id: p.id || p.act });
        } catch {
            showToast('Nie udało się skopiować');
        }
    }, []);

    const switchTab = (t) => {
        setTab(t);
        track(EVENTS.LIBRARY_TAB, { tab: t });
    };

    return (
        <main className="bg-sage relative overflow-hidden min-h-screen">
            {/* ============ HERO ============ */}
            <section className="relative px-4 pt-12 md:pt-20 pb-10 md:pb-14">
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-lime/15 blur-[140px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] bg-black/5 blur-[140px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto pt-12 md:pt-16 text-center">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-black bg-lime px-3 py-1 rounded-full mb-6">
                            <Library size={12} />
                            Darmowa baza wiedzy
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-black leading-[1.05] text-balance">
                            Baza promptów i person AI
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-dark max-w-2xl mx-auto leading-relaxed">
                            200 starannie dobranych polskich promptów i 12 person AI do ChatGPT, Claude i Gemini —
                            w tym autorskie prompty od Workshift pod konkretne branże. Przeszukuj, kopiuj, wdrażaj.
                        </p>
                    </motion.div>

                    {/* Tabs */}
                    <div className="mt-10 inline-flex items-center gap-1 p-1 rounded-full bg-black/5 border border-black/10">
                        <TabButton active={tab === 'prompty'} onClick={() => switchTab('prompty')} icon={Sparkles}>
                            Prompty
                        </TabButton>
                        <TabButton active={tab === 'persony'} onClick={() => switchTab('persony')} icon={Bot}>
                            Persony
                        </TabButton>
                    </div>
                </div>
            </section>

            {/* ============ TREŚĆ ============ */}
            <section className="relative z-10 px-4 pb-24 max-w-6xl mx-auto">
                {tab === 'prompty' ? (
                    <>
                        {/* Search + filtry */}
                        <div className="sticky top-20 z-20 -mx-4 px-4 py-4 bg-sage/80 backdrop-blur-xl">
                            <div className="relative max-w-2xl mx-auto">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setVisible(PAGE_SIZE);
                                    }}
                                    placeholder="Szukaj promptu (np. marketing, SEO, prawnik, kod...)"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-full bg-sage border border-black/15 text-black placeholder:text-muted-light focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/40 font-sans"
                                />
                            </div>
                            {/* Toggle: tylko polskie */}
                            <div className="mt-3 flex justify-center">
                                <button
                                    onClick={toggleOnlyPl}
                                    aria-pressed={onlyPl}
                                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                        onlyPl
                                            ? 'bg-lime text-black border-lime'
                                            : 'bg-transparent text-muted-dark border-black/15 hover:border-black/40'
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${onlyPl ? 'bg-black' : 'bg-lime'}`} />
                                    Tylko polskie
                                    <span className={`font-mono text-[11px] ${onlyPl ? 'text-black/60' : 'text-muted-light'}`}>
                                        {plCount}
                                    </span>
                                </button>
                            </div>

                            {/* Branże (ICP Workshift) — wyróżnione, na pierwszym miejscu */}
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                <CategoryChip
                                    label="Wszystkie"
                                    count={onlyPl ? plCount : index.length}
                                    active={category === 'ALL'}
                                    onClick={() => pickCategory('ALL')}
                                />
                                {industryCats
                                    .filter((c) => !onlyPl || catCount(c) > 0)
                                    .map((c) => (
                                        <CategoryChip
                                            key={c.key}
                                            label={c.label}
                                            count={catCount(c)}
                                            industry
                                            active={category === c.key}
                                            onClick={() => pickCategory(c.key)}
                                        />
                                    ))}
                            </div>
                            {/* Tematy ogólne */}
                            {generalCats.length > 0 && (
                                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                                    {generalCats
                                        .filter((c) => !onlyPl || catCount(c) > 0)
                                        .map((c) => (
                                            <CategoryChip
                                                key={c.key}
                                                label={c.label}
                                                count={catCount(c)}
                                                active={category === c.key}
                                                onClick={() => pickCategory(c.key)}
                                            />
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* Licznik */}
                        <p className="text-center text-sm text-muted-dark mt-6 font-mono">
                            {loading ? 'Ładowanie…' : `${filtered.length} promptów`}
                        </p>

                        {/* Grid */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                            {filtered.slice(0, visible).map((p) => (
                                <PromptCard key={p.id} p={p} onCopy={handleCopy} onOpen={handleOpen} />
                            ))}
                        </div>

                        {!loading && filtered.length === 0 && (
                            <p className="text-center text-muted-dark py-16">
                                Brak wyników dla „{query}". Spróbuj innego hasła.
                            </p>
                        )}

                        {visible < filtered.length && (
                            <div className="text-center mt-10">
                                <button
                                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                                    className="px-6 py-3 rounded-full bg-black text-sage font-semibold hover:bg-black/85 transition-colors"
                                >
                                    Pokaż więcej ({filtered.length - visible})
                                </button>
                            </div>
                        )}

                        <Attribution />
                    </>
                ) : (
                    <PersonasTab personas={personas} onOpen={openPersona} onCopy={copyPersona} />
                )}
            </section>

            {/* CTA */}
            <CTA />

            {/* Modal promptu */}
            <AnimatePresence>
                {active && <PromptModal p={active} onClose={() => setActive(null)} onCopy={handleCopy} />}
            </AnimatePresence>

            {/* Modal persony */}
            <AnimatePresence>
                {persona && (
                    <PromptModal
                        p={persona}
                        onClose={() => setPersona(null)}
                        onCopy={copyPersona}
                        copyLabel="Kopiuj instrukcję"
                    />
                )}
            </AnimatePresence>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-black text-sage text-sm font-medium shadow-lg flex items-center gap-2"
                    >
                        <Check size={16} className="text-lime" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function TabButton({ active, onClick, icon: Icon, children }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                active ? 'bg-lime text-black' : 'text-muted-dark hover:text-black'
            }`}
        >
            <Icon size={16} />
            {children}
        </button>
    );
}

function CategoryChip({ label, count, active, industry, onClick }) {
    const base = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border';
    const cls = active
        ? 'bg-lime text-black border-lime'
        : industry
        ? 'bg-lime/10 text-black border-lime/50 hover:border-lime'
        : 'bg-transparent text-muted-dark border-black/15 hover:border-black/40';
    return (
        <button onClick={onClick} className={`${base} ${cls}`}>
            {industry && !active && <span className="w-1.5 h-1.5 rounded-full bg-lime" />}
            {label}
            {typeof count === 'number' && (
                <span className={`font-mono text-[11px] ${active ? 'text-black/60' : 'text-muted-light'}`}>{count}</span>
            )}
        </button>
    );
}

function PromptCard({ p, onCopy, onOpen }) {
    const [copied, setCopied] = useState(false);
    const copy = async (e) => {
        e.stopPropagation();
        await onCopy(p);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
    };
    return (
        <button
            onClick={() => onOpen(p)}
            className="group text-left flex flex-col h-full p-5 rounded-2xl bg-sage border border-black/10 hover:border-black/30 hover:shadow-[0_8px_32px_#0000000a] transition-all"
        >
            <div className="flex flex-wrap items-center gap-2 mb-3">
                {p.source === 'workshift' ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-black bg-lime px-2 py-0.5 rounded-full">
                        <Sparkles size={10} />
                        Workshift
                    </span>
                ) : p.lang === 'pl' ? (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-black bg-lime/40 px-2 py-0.5 rounded-full">
                        PL
                    </span>
                ) : null}
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-dark bg-black/5 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[p.category] || p.category}
                </span>
                {p.type === 'IMAGE' && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-muted-dark bg-black/5 px-2 py-0.5 rounded-full">
                        <ImageIcon size={10} />
                        Obraz
                    </span>
                )}
                {p.forDevs && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-black bg-lime/60 px-2 py-0.5 rounded-full">
                        <Code2 size={10} />
                        Dev
                    </span>
                )}
            </div>
            <h3 className="font-display text-lg text-black leading-snug mb-2">{p.act}</h3>
            <p className="text-sm text-muted-dark leading-relaxed line-clamp-3 flex-grow">{p.preview}…</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                <span className="text-xs text-muted-dark group-hover:text-black transition-colors">Otwórz</span>
                <span
                    onClick={copy}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-black px-3 py-1.5 rounded-full bg-black/5 hover:bg-lime transition-colors cursor-pointer"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Skopiowano' : 'Kopiuj'}
                </span>
            </div>
        </button>
    );
}

function PromptModal({ p, onClose, onCopy, copyLabel = 'Kopiuj prompt' }) {
    const meta = TYPE_META[p.type] || TYPE_META.TEXT;
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-sage rounded-t-3xl sm:rounded-3xl border border-black/10 shadow-2xl overflow-hidden"
            >
                <div className="flex items-start justify-between gap-4 p-6 border-b border-black/10">
                    <div>
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-black bg-lime/60 px-2 py-0.5 rounded-full mb-2">
                            {p._persona ? <Bot size={10} /> : <meta.Icon size={10} />}
                            {p._persona ? 'Persona' : meta.label}
                        </span>
                        <h2 className="font-display text-2xl text-black leading-tight">{p.act}</h2>
                    </div>
                    <button onClick={onClose} className="shrink-0 p-2 rounded-full hover:bg-black/5 transition-colors">
                        <X size={20} className="text-muted-dark" />
                    </button>
                </div>
                <div className="overflow-y-auto p-6">
                    {p.body === null ? (
                        <p className="text-muted-dark font-mono text-sm">Ładowanie treści…</p>
                    ) : (
                        <pre className="whitespace-pre-wrap break-words font-mono text-sm text-black leading-relaxed">
                            {p.body}
                        </pre>
                    )}
                </div>
                <div className="p-4 border-t border-black/10 bg-sage">
                    <button
                        onClick={() => onCopy(p)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-black text-sage font-semibold hover:bg-black/85 transition-colors"
                    >
                        <Copy size={16} />
                        {copyLabel}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

function PersonasTab({ personas, onOpen, onCopy }) {
    return (
        <div className="max-w-5xl mx-auto pt-6">
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <h2 className="font-display text-3xl text-black mb-3">Persony AI</h2>
                <p className="text-muted-dark leading-relaxed">
                    Gotowe instrukcje, które wklejasz jako <strong>opis gema w Gemini</strong>, instrukcje{' '}
                    <strong>Custom GPT</strong> lub system prompt. Definiują, jak model ma się zachowywać, na co
                    zwracać uwagę i jaki output proponować — raz ustawiasz, a potem masz wyspecjalizowanego asystenta.
                </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {personas.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onOpen(p)}
                        className="group text-left flex flex-col h-full p-5 rounded-2xl bg-sage border border-black/10 hover:border-black/30 hover:shadow-[0_8px_32px_#0000000a] transition-all"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-black bg-lime px-2 py-0.5 rounded-full">
                                <Bot size={10} />
                                Persona
                            </span>
                            {p.categoryLabel && (
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-dark bg-black/5 px-2 py-0.5 rounded-full">
                                    {p.categoryLabel}
                                </span>
                            )}
                        </div>
                        <h3 className="font-display text-lg text-black leading-snug mb-2">{p.name}</h3>
                        <p className="text-sm text-muted-dark leading-relaxed line-clamp-3 flex-grow">{p.forWhat}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                            <span className="text-xs text-muted-dark group-hover:text-black transition-colors">Otwórz</span>
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCopy(p);
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-black px-3 py-1.5 rounded-full bg-black/5 hover:bg-lime transition-colors cursor-pointer"
                            >
                                <Copy size={14} />
                                Kopiuj
                            </span>
                        </div>
                    </button>
                ))}
            </div>
            <p className="text-center text-xs text-muted-light mt-10 font-mono">
                Persony autorskie Workshift. Dopisujemy kolejne — masz pomysł na konkretną? Napisz.
            </p>
        </div>
    );
}

function Attribution() {
    return (
        <p className="text-center text-xs text-muted-light mt-12 font-mono">
            Prompty na licencji CC0 1.0 — źródło:{' '}
            <a href="https://prompts.chat" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-dark">
                prompts.chat
            </a>
            . Kuracja i polskie wdrożenie: Workshift.
        </p>
    );
}

function CTA() {
    return (
        <section className="relative px-4 py-16 bg-black text-sage">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="font-display text-3xl md:text-4xl mb-4">Prompt to dopiero początek.</h2>
                <p className="text-sage/70 leading-relaxed mb-8 max-w-xl mx-auto">
                    Kopiowanie promptów oszczędza minuty. Wdrożenie AI w procesy firmy oszczędza etaty. Pokażemy
                    Ci gdzie zacząć.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                        href="/audyt-ai"
                        className="px-6 py-3 rounded-full bg-lime text-black font-semibold hover:bg-lime/90 transition-colors"
                    >
                        Zrób darmowy mikro-audyt AI
                    </a>
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => track(EVENTS.WHATSAPP_CLICK, { source: 'prompty' })}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-sage/30 text-sage font-semibold hover:bg-sage/10 transition-colors"
                    >
                        <MessageCircle size={18} />
                        Napisz na WhatsApp
                    </a>
                </div>
            </div>
        </section>
    );
}
