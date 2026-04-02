import React from 'react';
import { Header } from './components/Header';
import { HeroTypographic } from './components/HeroTypographic';
import { AnimatedQuoteSection } from './components/AnimatedQuoteSection';
import { InteractiveServicesBento } from './components/InteractiveServicesBento';
import { ProcessSection } from './components/ProcessSection';
import { IndustriesSection } from './components/IndustriesSection';
import { DataMetricsSection } from './components/DataMetricsSection';
import { AboutUsSection } from './components/AboutUsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection, CTASection, Footer } from './components/FooterAndMisc';

const SECTION_MAP = {
  'hero': HeroTypographic,
  'quote': AnimatedQuoteSection,
  'services': InteractiveServicesBento,
  'process': ProcessSection,
  'industries': IndustriesSection,
  'metrics': DataMetricsSection,
  'about': AboutUsSection,
  'testimonials': TestimonialsSection,
  'faq': FAQSection,
  'newsletter': NewsletterSection,
  'contact': ContactSection,
  'cta': CTASection,
  'footer': Footer,
};

function SectionPreview({ sectionKey }) {
  const Component = SECTION_MAP[sectionKey];
  if (!Component) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-400">
        Sekcja „{sectionKey}" nie istnieje.
      </div>
    );
  }
  return (
    <div className="bg-white font-sans text-slate-900 antialiased selection:bg-accent selection:text-white">
      <Component />
    </div>
  );
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const previewSection = params.get('preview');

  if (previewSection) {
    return <SectionPreview sectionKey={previewSection} />;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 scroll-smooth selection:bg-accent selection:text-white relative">
      {/* Global Margin Lines (Stripe-inspired Editorial Grid) */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden lg:flex justify-center px-6">
        <div className="w-full max-w-7xl flex relative">
          <div className="absolute top-0 bottom-0 left-0 w-px bg-slate-200/60" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200/30 -translate-x-px" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-slate-200/60" />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <Header />

        <main>
          <HeroTypographic />
          <AnimatedQuoteSection />
          <InteractiveServicesBento id="uslugi" />
          <ProcessSection />
          <IndustriesSection />
          <TestimonialsSection />
          <DataMetricsSection />
          <AboutUsSection />
          <FAQSection />
          <NewsletterSection />
          <ContactSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
