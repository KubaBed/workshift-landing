import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Header } from './components/Header';
import { HeroTypographic } from './components/HeroTypographic';
import { AnimatedQuoteSection } from './components/AnimatedQuoteSection';
import { InteractiveServicesBento } from './components/InteractiveServicesBento';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Below-the-fold: lazy-loaded for faster initial paint
const ProcessSection = lazy(() => import('./components/ProcessSection').then(m => ({ default: m.ProcessSection })));
const IndustriesSection = lazy(() => import('./components/IndustriesSection').then(m => ({ default: m.IndustriesSection })));
const DataMetricsSection = lazy(() => import('./components/DataMetricsSection').then(m => ({ default: m.DataMetricsSection })));
const AboutUsSection = lazy(() => import('./components/AboutUsSection').then(m => ({ default: m.AboutUsSection })));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
const NewsletterSection = lazy(() => import('./components/NewsletterSection').then(m => ({ default: m.NewsletterSection })));
const ContactSection = lazy(() => import('./components/ContactSection').then(m => ({ default: m.ContactSection })));
const FooterAndMiscModule = () => import('./components/FooterAndMisc');
const FAQSection = lazy(() => FooterAndMiscModule().then(m => ({ default: m.FAQSection })));
const CTASection = lazy(() => FooterAndMiscModule().then(m => ({ default: m.CTASection })));
const Footer = lazy(() => FooterAndMiscModule().then(m => ({ default: m.Footer })));

// Blog pages
const BlogListPage = lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));

// Redirect /uslugi (bare) to homepage services section
function ServicesRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
    // Scroll to #uslugi after navigation completes
    setTimeout(() => {
      const el = document.getElementById('uslugi');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [navigate]);
  return null;
}

// Handle hash-based scrolling after navigation
function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      // Small delay to let the page render
      const timer = setTimeout(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    } else if (location.pathname !== '/') {
      // Scroll to top on non-hash navigations to subpages
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}

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
    <div className="bg-sage font-sans text-black antialiased selection:bg-lime selection:text-black">
      <Component />
    </div>
  );
}

function HomePage() {
  return (
    <>
      <main>
        {/* Above-fold: eager-loaded */}
        <HeroTypographic />
        <AnimatedQuoteSection />
        <InteractiveServicesBento id="uslugi" />

        {/* Below-fold: lazy-loaded for faster initial paint */}
        <Suspense fallback={null}>
          <ProcessSection />
          <IndustriesSection />
          <TestimonialsSection />
          <DataMetricsSection />
          <AboutUsSection />
          <FAQSection />
          <NewsletterSection />
          <ContactSection />
          <CTASection />
        </Suspense>
      </main>
    </>
  );
}

function App() {
  const [searchParams] = useSearchParams();
  const previewSection = searchParams.get('preview');

  if (previewSection) {
    return <SectionPreview sectionKey={previewSection} />;
  }

  return (
    <div className="min-h-screen bg-sage font-sans text-black antialiased selection:bg-lime selection:text-black relative">
      {/* Global Margin Lines (Workshift Editorial Grid) */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden lg:flex justify-center px-5">
        <div className="w-full max-w-[1320px] flex relative">
          <div className="absolute top-0 bottom-0 left-0 w-px bg-black/5" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-black/3 -translate-x-px" />
          <div className="absolute top-0 bottom-0 right-0 w-px bg-black/5" />
        </div>
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <Header />

        <ScrollToHash />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/uslugi" element={<ServicesRedirect />} />
            <Route path="/uslugi/:serviceId" element={<ServicePage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
          </Routes>
        </Suspense>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        <FloatingWhatsApp />
      </div>
      <SpeedInsights />
    </div>
  );
}

export default App;
