import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Sekcja artykułowa strony usługi (`service.seoSections`).
 *
 * Treść siedzi w src/data/services.js, bo to samo źródło konsumuje statyczny
 * fallback w scripts/seo-routes.mjs - crawler bez JS i użytkownik z JS mają
 * widzieć tę samą treść. Tu tylko prezentacja.
 */
export function ServiceArticle({ sections, related }) {
    if (!sections?.length) return null;

    return (
        <article className="max-w-3xl mx-auto mt-24 md:mt-32">
            {sections.map((section) => (
                <section key={section.heading} className="mb-14 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-display tracking-tight text-black mb-5">
                        {section.heading}
                    </h2>
                    {section.paragraphs?.map((text) => (
                        <p key={text.slice(0, 40)} className="text-lg text-muted-dark leading-relaxed mb-4 last:mb-0">
                            {text}
                        </p>
                    ))}
                    {section.items && (
                        <dl className="space-y-6 mt-2">
                            {section.items.map((item) => (
                                <div key={item.title}>
                                    <dt className="text-lg text-black mb-1">{item.title}</dt>
                                    <dd className="text-lg text-muted-dark leading-relaxed">{item.desc}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                </section>
            ))}

            {related?.length > 0 && (
                <p className="text-lg text-muted-dark leading-relaxed border-t border-black/10 pt-8">
                    Sprawdź też:{' '}
                    {related.map((link, idx) => (
                        <React.Fragment key={link.href}>
                            {idx > 0 && ' · '}
                            <Link to={link.href} className="text-black underline underline-offset-4 hover:text-lime transition-colors">
                                {link.label}
                            </Link>
                        </React.Fragment>
                    ))}
                </p>
            )}
        </article>
    );
}
