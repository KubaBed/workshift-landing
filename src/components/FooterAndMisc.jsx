import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { Floating } from './animations/Floating';
// -------------------------------------------------------------
// FAQ SECTION
// -------------------------------------------------------------
const faqs = [
    {
        q: "Czy moja firma nie jest na to za mała?",
        a: "Nie. AI dla korporacji to miliony. AI dla MŚP to po prostu spięcie skrzynki mailowej z systemem faktur czy CRM-em by odzyskać 10 godzin pracy w tygodniu. Każda skala zasługuje na optymalizację. Naszym \"sweet spotem\" są firmy 10–200 osób."
    },
    {
        q: "Czy to znaczy, że będę musiał zwalniać ludzi?",
        a: "Nie. Celem jest \"uwolnienie\" Twoich sprawdzonych ekspertów od klikania w arkusze, po to by zajęli się tym, co faktycznie powiększa zyski biznesu, bez konieczności zatrudniania kolejnych osób."
    },
    {
        q: "Od czego zacząć współpracę?",
        a: "Od pierwszej darmowej wideokonferencji. Cel? Wymieniamy się informacjami, a my projektujemy co najmniej jeden pomysł (Quick Win) do wdrożenia na już. Bez zobowiązań, bez karty kredytowej, bez haczyka."
    },
    {
        q: "Ile czasu trwa przeciętne wdrożenie?",
        a: "Większość procesów, takich jak automatyzacja obsługi zapytań czy kategoryzacja dokumentów finansowych, wdrażamy i testujemy w ciągu 2 do 4 tygodni. Pierwsze efekty (Quick Wins) widzisz od razu."
    },
    {
        q: "Czy automatyzacje integrują się z naszym obecnym CRM-em lub ERP?",
        a: "Tak. Budujemy rozwiązania w oparciu o API, co pozwala spiąć ze sobą niemal każde popularne oprogramowanie (np. HubSpot, Salesforce, fakturownia, Slack, Gmail) beziinwazyjnie dla obecnej infrastruktury."
    },
    {
        q: "Jak dbacie o bezpieczeństwo danych firmowych?",
        a: "Każde rozwiązanie projektujemy w oparciu o zamknięte instancje i rygorystyczne polityki dostępu. Twoje dane dokumentowe i finansowe nigdy nie służą globalnym modelom do celów trenowania."
    },
    {
        q: "Czy potrzebuję dedykowanego programisty do utrzymania systemu?",
        a: "Nie. Konfigurujemy platformy tak, by działały autonomicznie na narzędziach no-code/low-code. Oddajemy w Twoje ręce gotowy system i zapewniamy pełne wsparcie techniczne po wdrożeniu."
    },
    {
        q: "W jaki sposób mierzycie zwrot z inwestycji (ROI)?",
        a: "Wspólnie ustalamy metryki przed startem projektu. Najczęściej mierzymy ROI poprzez ilość zaoszczędzonych roboczogodzin w miesiącu, spadek liczby błędów operacyjnych i skrócenie czasu obsługi klienta."
    },
    {
        q: "Ile kosztuje utrzymanie automatyzacji po wdrożeniu?",
        a: "Stawiamy na transparentność. Główne koszty utrzymania to podstawowe subskrypcje narzędzi (np. Make, OpenAI API), co dla kilku procesów w firmie zatrudniającej 20 osób wynosi najczęściej od 200 do 600 PLN miesięcznie zależnie od wolumenu ruchu."
    },
    {
        q: "Czy mogę zobaczyć demo zanim się zdecyduję?",
        a: "Tak - każda konsultacja zawiera prezentację procesu na żywo. Pokazujemy realne workflow, nie slajdy."
    }
];

export function FAQSection() {
    return (
        <section className="py-24 bg-sage relative">
            <div className="max-w-4xl mx-auto px-6 max-md:px-4">

                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-display tracking-tight text-black">
                        Pytania, które słyszymy najczęściej.
                    </h2>
                </div>

                <div className="border-t border-black/10">
                    <Accordion>
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} className="border-b border-black/10">
                                <AccordionTrigger className="w-full flex items-center justify-between py-8 text-left focus:outline-none hover:no-underline data-[state=open]:text-lime">
                                    <span className="text-xl md:text-2xl font-display text-black pr-8">{faq.q}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8 text-lg text-muted-dark leading-relaxed max-w-[65ch]">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

            </div>
        </section>
    );
}

// -------------------------------------------------------------
// FINAL CTA SECTION
// -------------------------------------------------------------
export function CTASection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <section id="darmowa-konsultacja" className="py-32 bg-black relative overflow-hidden">

            {/* Decorative overlay */}
            <Floating duration={10} amplitude={100} rotation={0} className="absolute top-0 right-0 pointer-events-none">
                <div className="w-[800px] h-[800px] bg-lime rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2" />
            </Floating>

            <div className="max-w-4xl mx-auto px-6 max-md:px-4 text-center relative z-10">
                <h2 className="text-5xl md:text-7xl font-display tracking-tighter text-white mb-8 text-balance">
                    Ile godzin tygodniowo Twój zespół traci na rzeczy, które maszyna zrobiłaby lepiej?
                </h2>
                <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
                    30 minut. Zero kosztów. Znajdziemy jedno "wąskie gardło" w Twoich procesach i pokażemy, jak je usunąć.
                </p>
                <div className="flex flex-col items-center">
                    <Button onClick={() => setIsModalOpen(true)} variant="accent" size="lg" className="w-full sm:w-auto text-lg px-10 h-16 shadow-2xl shadow-lime/20 transition-transform active:scale-95">
                        Wybierz termin darmowej konsultacji
                    </Button>
                    <p className="mt-6 text-sm text-white/40 font-mono tracking-wide text-center">
                        Wybierasz termin sam(a) - bez presji i bez telefonów.
                    </p>
                </div>
            </div>
        </section>

        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-sage rounded-[10px] shadow-2xl overflow-hidden flex flex-col z-10"
                    >
                        <div className="flex justify-between items-center p-5 border-b border-black/5 bg-sage">
                            <h3 className="text-lg font-display text-black">Wybierz termin: Darmowa Konsultacja</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-sage hover:bg-sage/80 rounded-full transition-colors text-muted-dark hover:text-black cursor-pointer" aria-label="Zamknij">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 w-full bg-slate-50 overflow-auto relative min-h-[500px] md:min-h-[600px]">
                            {/* Loader behind iframe */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime"></div>
                            </div>
                            <iframe 
                                src="https://calendar.app.google/djYy2maXAivipcSH6" 
                                className="relative z-10 w-full h-full border-0 bg-transparent"
                                title="Kuba Bednarczyk - Kalendarz Spotkań"
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        </>
    );
}

// -------------------------------------------------------------
// FOOTER
// -------------------------------------------------------------
export function Footer() {
    return (
        <footer className="bg-black pt-20 pb-10 border-t border-white/10">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    <div className="md:col-span-2">
                        <div className="mb-6">
                            <Floating duration={5} amplitude={5} rotation={3}>
                                <Logo variant="dark" size={48} />
                            </Floating>
                        </div>
                        <p className="text-white/50 max-w-sm leading-relaxed">
                            AI consulting dla polskich firm. Mniej rutyny, więcej wyników.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-display mb-6">Sekcje</h4>
                        <ul className="space-y-4">
                            <li><Link to="/#uslugi" className="text-white/50 hover:text-lime transition-colors">Usługi i Automatyzacje</Link></li>
                            <li><Link to="/#proces" className="text-white/50 hover:text-lime transition-colors">Nasz proces wdrożenia</Link></li>
                            <li><Link to="/blog" className="text-white/50 hover:text-lime transition-colors">Baza wiedzy (Blog)</Link></li>
                            <li><Link to="/#newsletter" className="text-white/50 hover:text-lime transition-colors">Newsletter AI Praktycznie</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-display mb-6">Kontakt</h4>
                        <ul className="space-y-4">
                            <li><a href="mailto:kontakt@workshift.pl" className="text-white/50 hover:text-white transition-colors flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> kontakt@workshift.pl</a></li>
                            <li><span className="text-white/50 flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> Poznań, Stawna 10/5</span></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-white/30 text-sm">© {new Date().getFullYear()} Workshift. Wszelkie prawa zastrzeżone.</p>
                    <div className="flex gap-6">
                        <Link to="/polityka-prywatnosci" className="text-sm font-mono text-white/30 hover:text-white transition-colors">Polityka Prywatności</Link>
                        <a href="#!" className="text-sm font-mono text-white/30 hover:text-white transition-colors">Regulamin</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
