import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FuzzyText from './FuzzyText';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedQuoteSection() {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const textWrapperRef = useRef(null);

    const rawText = "Jesteśmy zespołem konsultantów AI. Pomagamy sektorowi MŚP automatyzować kluczowe procesy biznesowe – bez paraliżowania codziennej pracy firmy i bez zbędnego szumu.";
    const wordsArray = rawText.split(" ");

    useEffect(() => {
        const words = textWrapperRef.current.querySelectorAll('.quote-word');

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
            { opacity: 0.15 },
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
            className="w-full relative bg-white"
            style={{ height: '150vh' }}
        >
            {/* Sticky block: stays fixed to viewport while we scroll through the outer track */}
            < div
                ref={stickyRef}
                className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden"
            >
                <div
                    ref={textWrapperRef}
                    className="w-full px-6 max-w-7xl mx-auto leading-[1.15] tracking-tight font-medium text-center md:text-left font-display"
                    style={{ fontSize: 'clamp(1.875rem, 5vw, 3.5rem)' }}
                >
                    {wordsArray.map((word, index) => {
                        const isGlitchWord = word.includes("automatyzować");

                        return (
                            <span key={index} className="relative inline-block mr-[0.25em] mb-2 lg:mb-4">
                                {isGlitchWord ? (
                                    <span
                                        className="quote-word relative inline-flex items-center justify-center translate-y-[-10%]"
                                        style={{ opacity: 0.15, willChange: 'opacity' }}
                                    >
                                        <FuzzyText
                                            className="-mx-[50px]" /* Offsets the fuzzy 50px canvas side margin */
                                            baseIntensity={0.15}
                                            hoverIntensity={0.4}
                                            enableHover={true}
                                            color="#0A2540" /* text-navy */
                                            fontWeight={500}
                                            fontSize="clamp(1.875rem, 5vw, 3.5rem)" /* matches container clamp */
                                        >
                                            {word}
                                        </FuzzyText>
                                    </span>
                                ) : (
                                    <span
                                        className="quote-word text-navy"
                                        style={{ opacity: 0.15, willChange: 'opacity' }}
                                    >
                                        {word}
                                    </span>
                                )}
                            </span>
                        );
                    })}
                </div>
            </div >
        </section >
    );
}
