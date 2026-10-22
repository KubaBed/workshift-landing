import React from 'react';
import { SzkicVideo } from './SzkicVideo';

/**
 * Film w hero /narzedzia/szkic: prawdziwe nagranie Szkicu na tle tapety Maca (24 s, 16:9, bez dźwięku, pętla).
 * Źródło: repo Szkicu, promo/record_demo.py, montaż promo/out/edit/build.py, tło dodane przez Kubę (export-*.mp4).
 */
export function SzkicHeroVideo() {
    return (
        <figure className="relative w-full">
            <div className="relative w-full aspect-video rounded-2xl bg-[#c9d3e6] ring-1 ring-black/5 shadow-[0_30px_80px_-30px_rgba(40,48,20,0.35)] overflow-hidden">
                <SzkicVideo
                    src="/szkic/szkic-demo"
                    poster="/szkic/szkic-demo-poster.webp"
                    label="Nagranie: w Szkicu zaznaczam błąd na stronie, wklejam paczkę agentowi, a on go naprawia"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </figure>
    );
}
