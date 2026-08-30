import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';

/**
 * FAQ strony usługi (`service.faq`). Wizualnie lustrzane do FAQSection
 * ze strony głównej, ale data-driven i na białym tle ServicePage.
 *
 * `keepMounted` jest celowe: Base UI domyślnie odmontowuje zamknięte panele,
 * a odpowiedzi muszą siedzieć w DOM, żeby renderer Google i LLM-y je widziały.
 */
export function ServiceFaq({ faq, heading = 'Pytania o automatyzację AI' }) {
    if (!faq?.length) return null;

    return (
        <section className="max-w-3xl mx-auto mt-8 md:mt-12">
            <h2 className="text-2xl md:text-3xl font-display tracking-tight text-black mb-8">
                {heading}
            </h2>
            <div className="border-t border-black/10">
                <Accordion>
                    {faq.map((item) => (
                        <AccordionItem key={item.q} className="border-b border-black/10">
                            <AccordionTrigger className="w-full flex items-center justify-between py-6 text-left focus:outline-none hover:no-underline data-[state=open]:text-lime">
                                <span className="text-lg md:text-xl font-display text-black pr-8">{item.q}</span>
                            </AccordionTrigger>
                            <AccordionContent keepMounted className="pb-6 text-lg text-muted-dark leading-relaxed max-w-[65ch]">
                                {item.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
