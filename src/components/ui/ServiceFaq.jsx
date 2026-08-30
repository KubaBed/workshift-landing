import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import { Eyebrow } from './ServiceArticle';
import { FadeUp } from '../animations/FadeUp';

/**
 * FAQ strony usługi (`service.faq`). Prymitywy Base UI jak w FAQSection
 * ze strony głównej, ale na białym tle ServicePage i z mikrointerakcjami:
 * hover podświetla wiersz, chevron wędruje w kapsule, wysokość animowana.
 *
 * `keepMounted` jest celowe: Base UI domyślnie odmontowuje zamknięte panele,
 * a odpowiedzi muszą siedzieć w DOM, żeby renderer Google i LLM-y je widziały.
 */
export function ServiceFaq({ faq, heading = 'Pytania o automatyzację AI', eyebrow = 'FAQ' }) {
    if (!faq?.length) return null;

    return (
        <section className="max-w-3xl mx-auto mt-4 md:mt-6">
            <FadeUp duration={0.6}>
                <Eyebrow>{eyebrow}</Eyebrow>
                <h2 className="text-2xl md:text-[32px] font-display tracking-tight text-black mb-8">
                    {heading}
                </h2>
            </FadeUp>
            <FadeUp duration={0.6} delay={0.1}>
                <div className="border-t border-black/10">
                    <Accordion>
                        {faq.map((item) => (
                            <AccordionItem key={item.q} className="border-b border-black/10">
                                <AccordionTrigger className="w-full flex items-center justify-between py-6 px-4 -mx-4 rounded-xl text-left focus:outline-none focus-visible:bg-sage/60 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-lime hover:no-underline hover:bg-sage/60 transition-colors duration-200 **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-black/30 hover:**:data-[slot=accordion-trigger-icon]:text-black">
                                    <span className="text-lg md:text-xl font-display text-black pr-6">{item.q}</span>
                                </AccordionTrigger>
                                <AccordionContent keepMounted className="pb-6 text-lg text-muted-dark leading-relaxed max-w-[62ch]">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </FadeUp>
        </section>
    );
}
