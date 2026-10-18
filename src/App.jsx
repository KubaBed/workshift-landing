import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useSearchParams, useNavigate, useLocation, matchPath } from 'react-router-dom';
// Vercel Analytics + Speed Insights are loaded dynamically (see VercelTelemetry below).
// Top-level import zostałby zablokowany przez ad blockery w stylu uBlock Origin/Brave Shields,
// co przy module-level fetch-fail wywala cały graf modułu Apps i blokuje React render.
import { Header } from './components/Header';
import { HeroTypographic } from './components/HeroTypographic';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ConsentBanner } from './components/ConsentBanner';
import { bootstrapConsent } from './lib/consent';
import { STATIC_ROUTE_META, applyMeta, setCanonical } from './lib/seo';

// Below-the-fold: lazy-loaded for faster initial paint.
// Cytat (120vh) i bento usług też: oba są ponad ekran pod hero, a ciągnęły gsap,
// ScrollTrigger i services.js do JS potrzebnego do pierwszego malowania.
const AnimatedQuoteSection = lazy(() => import('./components/AnimatedQuoteSection').then(m => ({ default: m.AnimatedQuoteSection })));
const InteractiveServicesBento = lazy(() => import('./components/InteractiveServicesBento').then(m => ({ default: m.InteractiveServicesBento })));
const KalkulatorCTASection = lazy(() => import('./components/KalkulatorCTASection').then(m => ({ default: m.KalkulatorCTASection })));
const ProcessSection = lazy(() => import('./components/ProcessSection').then(m => ({ default: m.ProcessSection })));
const IndustriesSection = lazy(() => import('./components/IndustriesSection').then(m => ({ default: m.IndustriesSection })));
const DataMetricsSection = lazy(() => import('./components/DataMetricsSection').then(m => ({ default: m.DataMetricsSection })));
const AboutUsSection = lazy(() => import('./components/AboutUsSection').then(m => ({ default: m.AboutUsSection })));
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })));
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
const KalkulatorStratPage = lazy(() => import('./pages/KalkulatorStratPage'));
const AudytAiPage = lazy(() => import('./pages/AudytAiPage'));
const PromptyPage = lazy(() => import('./pages/PromptyPage'));
const OfferPage = lazy(() => import('./pages/OfferPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Katalog komponentów (/showcase). Dostępny też na produkcji, żeby dało się wysłać link.
// Odcięty od wyszukiwarek: X-Robots-Tag w vercel.json + meta robots w samej stronie
// + Disallow w robots.txt. Nigdzie nie podlinkowany.
const ShowcasePage = lazy(() => import('./pages/ShowcasePage'));

// Płótno komponentów (/canvas) tylko w trybie dev. W buildzie import.meta.env.DEV to false,
// więc Rollup wycina ten import razem z chunkiem, a /canvas na produkcji trafia na 404.
const CanvasPage = import.meta.env.DEV ? lazy(() => import('./pages/canvas/CanvasPage')) : null;
const isCanvasPath = (pathname) => import.meta.env.DEV && pathname === '/canvas';

// Sekcje strony głównej są leniwe, więc cel kotwicy może pojawić się w DOM później
// niż po 100 ms. Ponawiamy co 100 ms (do 5 s), aż element istnieje. Zwraca funkcję
// przerywającą oczekiwanie.
function scrollToIdWhenReady(id) {
  let tries = 0;
  const timer = setInterval(() => {
    const el = document.getElementById(id);
    if (el || ++tries > 50) {
      clearInterval(timer);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
  return () => clearInterval(timer);
}

// Redirect /uslugi (bare) to homepage services section
function ServicesRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
    // Bez cleanupu: ten komponent odmontowuje się zaraz po nawigacji, a przewijanie ma
    // zadziałać już na stronie głównej (ponawianie samo kończy się po 5 s).
    scrollToIdWhenReady('uslugi');
  }, [navigate]);
  return null;
}

// Handle hash-based scrolling after navigation
function ScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      return scrollToIdWhenReady(location.hash.slice(1));
    } else if (location.pathname !== '/') {
      // Scroll to top on non-hash navigations to subpages
      window.scrollTo(0, 0);
    }
  }, [location]);
  return null;
}

/**
 * Utrzymuje <head> w zgodzie z trasą przy nawigacji wewnątrz SPA.
 *
 * Pierwsze wejście na URL obsługuje statyczny <head> generowany przez
 * `scripts/build-seo-html.mjs` - i tylko on jest widoczny dla scraperów, które
 * nie wykonują JS (Facebook, LinkedIn, Slack, LLM-y). Ten komponent pokrywa
 * przejścia klient-side, przy których żadne żądanie do serwera nie leci.
 *
 * Trasy oparte o dane (wpis bloga, usługa) ustawiają meta same, bo znają swój
 * rekord dopiero po rozwiązaniu parametru. Tutaj dostają przynajmniej świeży
 * canonical, żeby nie został po poprzedniej stronie.
 */
function RouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = STATIC_ROUTE_META[pathname];
    if (meta) applyMeta({ ...meta, path: pathname });
    else setCanonical(pathname);
  }, [pathname]);
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
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <main>
        {/* Above-fold: eager-loaded */}
        <HeroTypographic />

        {/* Below-fold: lazy-loaded for faster initial paint. Jedna granica, więc sekcje
            pojawiają się razem i w stałej kolejności (#uslugi ma id w samym komponencie). */}
        <Suspense fallback={null}>
          <AnimatedQuoteSection />
          <InteractiveServicesBento />
          <KalkulatorCTASection />
          <ProcessSection />
          <IndustriesSection />
          <TestimonialsSection />
          <DataMetricsSection />
          <AboutUsSection />
          <FAQSection />
          <ContactSection />
          <CTASection />
        </Suspense>
      </main>
    </>
  );
}

// Lazy-loaded telemetry: ad blockery blokują @vercel/analytics fetch i przy top-level
// imporcie wywalają cały moduł App (skutek: pusty #root). Dynamic import izoluje failure.
function VercelTelemetry() {
  const [comps, setComps] = useState(null);
  useEffect(() => {
    let mounted = true;
    Promise.all([
      import('@vercel/analytics/react').catch(() => null),
      import('@vercel/speed-insights/react').catch(() => null),
    ]).then(([a, s]) => {
      if (!mounted) return;
      setComps({
        Analytics: a?.Analytics || null,
        SpeedInsights: s?.SpeedInsights || null,
      });
    });
    return () => { mounted = false; };
  }, []);
  if (!comps) return null;
  return (
    <>
      {comps.Analytics && <comps.Analytics />}
      {comps.SpeedInsights && <comps.SpeedInsights />}
    </>
  );
}

function App() {
  const [searchParams] = useSearchParams();
  const previewSection = searchParams.get('preview');
  const { pathname } = useLocation();

  // Bootstrap analytics: if user previously consented, load GA4 + Clarity
  // od razu (bez wyświetlania bannera). Bez consent - skrypty czekają.
  // Płótno (dev) nie ładuje analityki: podglądy nie mają wysyłać niczego na zewnątrz.
  useEffect(() => {
    if (isCanvasPath(window.location.pathname)) return;
    bootstrapConsent();
  }, []);

  if (previewSection) {
    return <SectionPreview sectionKey={previewSection} />;
  }

  // /canvas jak /showcase: poza layoutem, bez Headera, Footera i banera zgód.
  if (isCanvasPath(pathname)) {
    return (
      <Suspense fallback={null}>
        <CanvasPage />
      </Suspense>
    );
  }

  // /showcase renderuje się poza layoutem (bez Headera i Footera), żeby komponenty
  // były widoczne bez otoczki strony. Patrz src/pages/ShowcasePage.jsx.
  if (pathname === '/showcase') {
    return (
      <Suspense fallback={null}>
        <ShowcasePage />
      </Suspense>
    );
  }

  // Prywatna oferta (/oferta/:slug) też poza layoutem marketingowym: bez menu, WhatsAppa,
  // stopki i banera zgód. Pasek "Ważna do" nie chowa się pod menu, a pierwszy widok klienta
  // to sama oferta. Bez banera nie ma jak wyrazić zgody, więc GA4, Clarity, PostHog i Pixel
  // ładują się tu tylko u kogoś, kto zgodził się wcześniej (bootstrapConsent wyżej).
  // Vercel Analytics jest bezciasteczkowe i zostaje, jak na reszcie strony.
  if (matchPath('/oferta/:slug', pathname)) {
    return (
      <div className="min-h-screen bg-sage font-sans text-black antialiased selection:bg-lime selection:text-black">
        <RouteMeta />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/oferta/:slug" element={<OfferPage />} />
          </Routes>
        </Suspense>
        <VercelTelemetry />
      </div>
    );
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
        <RouteMeta />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/uslugi" element={<ServicesRedirect />} />
            <Route path="/uslugi/:serviceId" element={<ServicePage />} />
            <Route path="/kalkulator" element={<KalkulatorStratPage />} />
            <Route path="/audyt-ai" element={<AudytAiPage />} />
            <Route path="/prompty" element={<PromptyPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Stopka w granicy tras: nie pokaże się, zanim strona nie ma treści. Osobna granica
              obok tras dawała wyścig chunków - gdy stopka doszła przed leniwą stroną, malowała się
              pod nagłówkiem i zjeżdżała w dół (CLS 0,92 w PSI na /uslugi/automatyzacja, 15.10).
              Własna wewnętrzna granica: na stronie głównej (eager) nie wstrzymuje hero. */}
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </Suspense>

        <FloatingWhatsApp />
      </div>

      {/* Vercel Analytics + Speed Insights - loaded dynamically.
          Top-level import wywalał całą aplikację gdy ad blocker (uBO/Brave) blokował fetch. */}
      <VercelTelemetry />

      {/* Cookie consent banner - pokazuje się gdy brak decyzji w localStorage.
          Re-otwierany przez link w stopce ('workshift:consent-open' event). */}
      <ConsentBanner />
    </div>
  );
}

export default App;
