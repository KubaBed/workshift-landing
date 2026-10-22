import React from 'react';
import { Lock, Languages, Images, Bot, Keyboard } from 'lucide-react';
import { FadeUp } from '../animations/FadeUp';
import { SZKIC_BENTO } from '../../data/szkic';

// Twarda spacja po jednoliterowych słowach (a, i, o, u, w, z), żeby nie wisiały na końcu linii.
const nb = (text) => text.replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2 ').replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2 ');

/**
 * Kafelki z cechami Szkicu (zamiast czarnej sekcji prywatności): duży czarny kafelek o nagraniach na Macu,
 * kafelek z silnikami transkrypcji i trzy małe (wybór klatek, agenci, skróty).
 */
export function SzkicBento() {
    const b = SZKIC_BENTO;
    return (
        <section className="px-4 py-16 md:py-24">
            <div className="max-w-[1320px] mx-auto">
                <FadeUp duration={0.6}>
                    <h2 className="text-4xl md:text-5xl tracking-tight text-black text-balance">{nb(b.title)}</h2>
                    <p className="mt-5 text-lg text-muted-dark leading-relaxed text-pretty max-w-[60ch]">{nb(b.lead)}</p>
                </FadeUp>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <FadeUp className="md:col-span-2 lg:col-span-4 lg:row-span-2" duration={0.6}>
                        <article className="h-full rounded-3xl bg-black text-white p-7 md:p-10 flex flex-col">
                            <Lock className="size-6 text-lime" strokeWidth={1.75} aria-hidden="true" />
                            <h3 className="mt-6 text-3xl md:text-4xl tracking-tight !text-white text-balance">{nb(b.local.title)}</h3>
                            <p className="mt-4 text-lg text-white/65 leading-relaxed text-pretty max-w-[48ch]">{nb(b.local.text)}</p>
                            <FolderListing />
                            <p className="mt-auto pt-8 text-sm text-white/45 leading-relaxed text-pretty max-w-[60ch]">{nb(b.local.note)}</p>
                        </article>
                    </FadeUp>

                    <FadeUp className="lg:col-span-2 lg:row-span-2" duration={0.6} delay={0.05}>
                        <Tile icon={Languages} title={b.transcription.title} text={b.transcription.text}>
                            <ul className="mt-6 space-y-2">
                                {b.transcription.engines.map((e) => (
                                    <li key={e.name} className="rounded-xl bg-sage/60 ring-1 ring-black/5 px-4 py-3">
                                        <p className="text-base text-black">{e.name}</p>
                                        <p className="font-mono text-xs text-black/55 mt-0.5">{e.tag}</p>
                                    </li>
                                ))}
                            </ul>
                        </Tile>
                    </FadeUp>

                    <FadeUp className="lg:col-span-2" duration={0.6} delay={0.1}>
                        <Tile icon={Images} title={b.frames.title} text={b.frames.text} />
                    </FadeUp>
                    <FadeUp className="lg:col-span-2" duration={0.6} delay={0.15}>
                        <Tile icon={Bot} title={b.agents.title} text={b.agents.text}>
                            <p className="mt-5 flex gap-2 font-mono text-xs" aria-hidden="true">
                                {['contact-sheet.png', 'summary.md', 'szkic.json'].map((f) => (
                                    <span key={f} className="rounded-md bg-sage/70 px-2 py-1 text-black/70">{f}</span>
                                ))}
                            </p>
                        </Tile>
                    </FadeUp>
                    <FadeUp className="md:col-span-2 lg:col-span-2" duration={0.6} delay={0.2}>
                        <Tile icon={Keyboard} title={b.shortcuts.title} text={b.shortcuts.text} />
                    </FadeUp>
                </div>
            </div>
        </section>
    );
}

function Tile({ icon: Icon, title, text, children }) {
    return (
        <article className="h-full rounded-3xl bg-white ring-1 ring-black/5 p-7 md:p-8 flex flex-col">
            <Icon className="size-6 text-black" strokeWidth={1.75} aria-hidden="true" />
            <h3 className="mt-5 text-2xl tracking-tight text-black text-balance">{nb(title)}</h3>
            <p className="mt-3 text-base text-muted-dark leading-relaxed text-pretty">{nb(text)}</p>
            {children}
        </article>
    );
}

/** Podgląd folderu ~/Szkic: tak wyglądają nagrania na dysku. */
function FolderListing() {
    const rows = ['2026-10-22-153012.szkic', '2026-10-21-091544.szkic', '2026-10-20-174208.szkic'];
    return (
        <div className="mt-8 rounded-2xl bg-white/[0.06] ring-1 ring-white/10 p-4 font-mono text-sm max-w-md" aria-hidden="true">
            <p className="text-white/45">~/Szkic</p>
            <ul className="mt-2 space-y-1.5">
                {rows.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-white/80">
                        <span className="size-2 rounded-sm bg-lime" />
                        {r}
                    </li>
                ))}
            </ul>
        </div>
    );
}
