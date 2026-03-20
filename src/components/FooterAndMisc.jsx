import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Logo } from './ui/Logo';
// -------------------------------------------------------------
// FAQ SECTION
// -------------------------------------------------------------
const faqs = [
    {
        q: "Czy moja firma nie jest na to za mała?",
        a: "Nie. AI dla korporacji to miliony. AI dla MŚP to po prostu spięcie skrzynki mailowej z systemem faktur czy CRM-em by odzyskać 10 godzin pracy w tygodniu. Każda skala zasługuje na optymalizację."
    },
    {
        q: "Czy to znaczy, że będę musiał zwalniać ludzi?",
        a: "Nie. Celem jest \"uwolnienie\" Twoich sprawdzonych ekspertów od klikania w arkusze, po to by zajęli się tym, co faktycznie powiększa zyski biznesu, bez konieczności zatrudniania kolejnych osób."
    },
    {
        q: "Od czego zacząć współpracę?",
        a: "Od pierwszej darmowej wideokonferencji. Cel? Wymieniamy się informacjami, a my projektujemy co najmniej jeden pomysł (Quick Win) do wdrożenia na już. Bez zobowiązań."
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
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-4xl mx-auto px-6 max-md:px-4">

                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-navy">
                        Pytania, które słyszymy najczęściej.
                    </h2>
                </div>

                <div className="border-t border-slate-200">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div key={idx} className="border-b border-slate-200">
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full flex items-center justify-between py-8 text-left focus:outline-none"
                                >
                                    <span className="text-xl md:text-2xl font-bold font-display text-navy pr-8">{faq.q}</span>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${isOpen ? 'border-navy bg-navy text-accent' : 'border-slate-300 text-navy hover:bg-slate-50'}`}>
                                        {isOpen ? (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
                                        )}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-8 text-lg text-slate-600 leading-relaxed max-w-[65ch]">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

// -------------------------------------------------------------
// FINAL CTA SECTION
// -------------------------------------------------------------
export function CTASection() {
    return (
        <section className="py-32 bg-navy relative overflow-hidden">

            {/* Decorative overlay */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 max-md:px-4 text-center relative z-10">
                <h2 className="text-5xl md:text-7xl font-bold font-display tracking-tighter text-white mb-8 text-balance">
                    Zastanawiasz się, jakie procesy u Ciebie marnują najwięcej zysków?
                </h2>
                <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Nasza 30-minutowa rozmowa diagnostyczna jest darmowa i niczego Cię nie kosztuje. Po prostu poszukamy wspólnie tzw. "wąskiego gardła".
                </p>
                <div className="flex flex-col items-center">
                    <Button variant="accent" size="lg" className="w-full sm:w-auto text-lg px-10 h-16 shadow-2xl shadow-accent/20">
                        Wyślij zapytanie o darmowy plan
                    </Button>
                    <p className="mt-6 text-sm text-slate-500 font-medium tracking-wide text-center">
                        Skontaktujemy się z Tobą w ciągu 24h by dobrać pasujący termin.
                    </p>
                </div>
            </div>
        </section>
    );
}

// -------------------------------------------------------------
// FOOTER
// -------------------------------------------------------------
export function Footer() {
    return (
        <footer className="bg-navy pt-20 pb-10 border-t border-slate-800">
            <div className="max-w-[1400px] mx-auto px-6 max-md:px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    <div className="md:col-span-2">
                        <div className="mb-6">
                            <Logo variant="dark" size={48} />
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed">
                            Wdrażamy pragmatyczne innowacje AI dla ambitnych Polskich MŚP. Odzyskaj godziny tracone na rutynę.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold font-display mb-6">Sekcje</h4>
                        <ul className="space-y-4">
                            <li><a href="#uslugi" className="text-slate-400 hover:text-accent transition-colors">Usługi i Automatyzacje</a></li>
                            <li><a href="#proces" className="text-slate-400 hover:text-accent transition-colors">Nasz proces wdrożenia</a></li>
                            <li><a href="#case-studies" className="text-slate-400 hover:text-accent transition-colors">Historie Klientów</a></li>
                            <li><a href="#!" className="text-slate-400 hover:text-accent transition-colors">Newsletter AI Praktycznie</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold font-display mb-6">Kontakt</h4>
                        <ul className="space-y-4">
                            <li><a href="mailto:hello@workshift.pl" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> hello@workshift.pl</a></li>
                            <li><span className="text-slate-400 flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> Warszawa, Polska</span></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Workshift. Wszelkie prawa zastrzeżone.</p>
                    <div className="flex gap-6">
                        <a href="#!" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Polityka Prywatności</a>
                        <a href="#!" className="text-sm font-medium text-slate-500 hover:text-white transition-colors">Regulamin</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
