import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSectionV1 } from './components/HeroSectionV1';
import { HeroSectionV2 } from './components/HeroSectionV2';
import { HeroSectionV3 } from './components/HeroSectionV3';
import { HeroSectionV4 } from './components/HeroSectionV4';
import { HeroSectionV5 } from './components/HeroSectionV5';
import { LogoBar } from './components/LogoBar';
import { AnimatedQuoteSection } from './components/AnimatedQuoteSection';
import { ProblemCloudSection } from './components/ProblemCloudSection';
import { ScrollScatterSection } from './components/ScrollScatterSection';
import { InteractiveServicesBento } from './components/InteractiveServicesBento';
import { ProcessSection } from './components/ProcessSection';
import { IndustriesSection } from './components/IndustriesSection';
import { DataMetricsSection } from './components/DataMetricsSection';
import { AboutUsSection } from './components/AboutUsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { ContactSection } from './components/ContactSection';
import { FAQSection, CTASection, Footer } from './components/FooterAndMisc';
import { GradientDivider } from './components/ui/GradientDivider';
const HERO_VARIANTS = {
  v5: { label: 'V5 · Scrollytelling', component: HeroSectionV5 },
  v1: { label: 'V1 · Three.js', component: HeroSectionV1 },
  v2: { label: 'V2 · Strips', component: HeroSectionV2 },
  v3: { label: 'V3 · Split', component: HeroSectionV3 },
  v4: { label: 'V4 · Full', component: HeroSectionV4 },
};

function App() {
  const [heroVariant, setHeroVariant] = useState('v5');
  const HeroComponent = HERO_VARIANTS[heroVariant].component;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 scroll-smooth selection:bg-accent selection:text-white relative">
      {/* Global Margin Lines (Stripe-inspired Editorial Grid) */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden lg:flex justify-center px-6">
        <div className="w-full max-w-7xl flex relative">
          {/* Lewa linia */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-slate-200/60" />
          {/* Środkowa linia */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-200/30 -translate-x-px" />
          {/* Prawa linia */}
          <div className="absolute top-0 bottom-0 right-0 w-px bg-slate-200/60" />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <Header />

        {/* Hero variant switcher — floating toolbar */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-1 bg-white/90 backdrop-blur-md rounded-full px-2 py-1.5 shadow-lg border border-slate-200/60">
          <span className="text-xs text-slate-400 font-medium px-2">Hero:</span>
          {Object.entries(HERO_VARIANTS).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setHeroVariant(key)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${heroVariant === key
                ? 'bg-accent text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <main>
          <div id="hero-wrapper">
            <HeroComponent key={heroVariant} />
          </div>
          <LogoBar />
          <GradientDivider />
          <AnimatedQuoteSection />
          <GradientDivider />
          <ScrollScatterSection />
          <GradientDivider />
          {/* <ProblemCloudSection /> */}
          <InteractiveServicesBento />
          <GradientDivider />
          <ProcessSection />
          <GradientDivider />
          <IndustriesSection />
          <GradientDivider />
          <DataMetricsSection />
          <GradientDivider />
          <AboutUsSection />
          <GradientDivider />
          <TestimonialsSection />
          <GradientDivider />
          <FAQSection />
          <GradientDivider />
          <NewsletterSection />
          <GradientDivider />
          <ContactSection />
          <CTASection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
