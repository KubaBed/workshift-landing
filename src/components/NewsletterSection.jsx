import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from './ui/Button';
import { Input } from './ui/input';

gsap.registerPlugin(ScrollTrigger);

const articles = [
    {
        title: "Jak zautomatyzowaliśmy onboarding w firmie produkcyjnej",
        tag: "Case Study",
        time: "4 min czytania"
    },
    {
        title: "OCR vs AI: Dlaczego stare systemy do faktur zawodzą",
        tag: "Edukacja",
        time: "6 min czytania"
    }
];

export function NewsletterSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                ".newsletter-animate",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        once: true
                    }
                }
            );
            
            gsap.fromTo(
                ".article-animate",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        once: true
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-slate-50 relative border-t border-slate-200">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="max-w-xl">
                        <h2 className="newsletter-animate opacity-0 text-4xl md:text-5xl font-bold font-display tracking-tight text-navy mb-6">
                            Nie chcesz kupować od razu? Pozwól nam udowodnić, że wiemy o czym mówimy.
                        </h2>
                        <p className="newsletter-animate opacity-0 text-lg text-slate-600 mb-10 leading-relaxed">
                            Dołącz do czytelników naszego newslettera "AI Praktycznie". Co dwa tygodnie dzielimy się jednym procesem, który zautomatyzowaliśmy, podając użyte narzędzia i wygenerowane oszczędności. Zero teoretyzowania.
                        </p>

                        <form
                            className="newsletter-animate opacity-0 flex flex-col sm:flex-row gap-4"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <Input
                                type="email"
                                required
                                placeholder="Twój adres e-mail"
                                className="flex-1 h-14 px-6 rounded-full border-slate-300 bg-white text-navy focus-visible:ring-navy shadow-sm text-base"
                            />
                            <Button type="submit" size="lg" className="shrink-0 w-full sm:w-auto">
                                Zapisz mnie
                            </Button>
                        </form>
                        <p className="newsletter-animate opacity-0 text-xs text-slate-400 mt-4 px-4 font-medium">Brak spamu. Wypisujesz się jednym kliknięciem.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {articles.map((article, idx) => (
                            <a
                                href="#!"
                                key={idx}
                                className="article-animate opacity-0 group block p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                            >
                                <div className="flex justify-between items-center mb-16">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[#ee703d] bg-navy px-3 py-1 rounded-full">{article.tag}</span>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-navy transition-colors group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                                </div>
                                <h3 className="text-xl font-bold font-display text-navy mb-4 leading-snug group-hover:text-[#ee703d] group-hover:bg-navy group-hover:px-1 group-hover:-mx-1 box-decoration-clone transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-sm font-medium text-slate-500">{article.time}</p>
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
