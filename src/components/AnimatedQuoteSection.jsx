import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GradientText from './GradientText';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedQuoteSection() {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const textWrapperRef = useRef(null);

    const rawText = "Jesteśmy zespołem konsultantów AI. Pomagamy sektorowi MŚP automatyzować kluczowe procesy biznesowe - bez paraliżowania codziennej pracy firmy i bez zbędnego szumu.";
    const wordsArray = rawText.split(" ");

    useEffect(() => {
        if (!textWrapperRef.current) return;
        
        const words = textWrapperRef.current.querySelectorAll('.quote-word');
        if (!words.length) return;

        // Setup Timeline WITHOUT GSAP pin.
        // We use native CSS `sticky` for layout stability, and only use GSAP ScrollTrigger to scrub opacity.
        // The trigger is the tall outer container, so scrubbing maps precisely to our scroll track.
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom', // End when the outer container finishes scrolling
                scrub: 1,
            }
        });

        // The Ultimate Scroll Text effect: Fade in words smoothly with an overlapping stagger.
        tl.fromTo(words,
            { opacity: 0.2 },
            {
                opacity: 1,
                stagger: 0.1,
                duration: 0.5,
                ease: 'none',
            }
        );

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <section
            ref={containerRef}
            className="w-full relative"
            style={{ height: '120vh', background: 'linear-gradient(160deg, #E6E8DD 0%, #dfe1d5 100%)' }}
        >
            {/* Sticky block: stays fixed to viewport while we scroll through the outer track */}
            <div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full flex flex-col justify-center items-center pb-[10vh] overflow-hidden"
            >
                <div
                    ref={textWrapperRef}
                    className="w-full px-6 max-w-7xl mx-auto font-display"
                >
                    {/* Eyebrow label */}
                    <p className="font-mono text-xs tracking-wider uppercase text-muted-dark mb-6 md:mb-8">
                        — Nasza filozofia
                    </p>
                    <div className="leading-[1.15] tracking-tight font-normal text-center md:text-left" style={{ fontSize: 'clamp(1.875rem, 5vw, 3.5rem)' }}>
                    {wordsArray.map((word, index) => {
                        const isGradientWord = word === "MŚP" || word === "automatyzować";

                        return (
                            <span key={index} className="relative inline-block mr-[0.25em] mb-2 lg:mb-4">
                                {isGradientWord ? (
                                    <span
                                        className="quote-word"
                                        style={{ opacity: 0.3, willChange: 'opacity', color: '#9CE069', fontWeight: 600 }}
                                    >
                                        {word}
                                    </span>
                                ) : (
                                    <span
                                        className="quote-word text-black"
                                        style={{ opacity: 0.3, willChange: 'opacity' }}
                                    >
                                        {word}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                    </div>
                </div>
            </div>
        </section>
    );
}
