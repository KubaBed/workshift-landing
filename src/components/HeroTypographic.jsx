import { motion } from 'framer-motion';
import { HeroParticleSphere } from './HeroParticleSphere';
import { TextReveal } from './animations/TextReveal';
import { FadeUp } from './animations/FadeUp';
import { Floating } from './animations/Floating';
import logo1 from '../assets/partners/logo1.png';
import logo2 from '../assets/partners/logo2.png';
import logo3 from '../assets/partners/logo3.png';
import logo4 from '../assets/partners/logo4.png';
import logo5 from '../assets/partners/logo5.png';

export function HeroTypographic() {


  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row overflow-hidden relative"
      style={{
        background: '#E6E8DD',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Decorative Floating Elements (Workshift aesthetic) */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <Floating amplitude={20} duration={6} delay={0} rotation={5} className="absolute top-[15%] right-[10%] opacity-20 hidden lg:block">
          <div className="w-64 h-64 rounded-full bg-lime/20 blur-3xl" />
        </Floating>
        <Floating amplitude={15} duration={8} delay={1} rotation={-10} className="absolute bottom-[20%] left-[5%] opacity-15 hidden lg:block">
          <div className="w-48 h-48 rounded-full bg-black/5 blur-2xl" />
        </Floating>
      </div>

      {/* Top accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, #9CE069, #7bc44a)`,
          transformOrigin: 'left',
          zIndex: 10,
        }}
      />

      {/* Background sphere - full bleed (left as-is per decision) */}
      <div className="hidden lg:block" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <HeroParticleSphere />
      </div>

      {/* Left panel - text content */}
      <div
        className="w-full lg:w-[52%] lg:flex-shrink-0 flex flex-col justify-center px-5 py-24 md:px-10 lg:px-16 lg:py-12 relative z-[2]"
        style={{
          background: 'linear-gradient(to right, #E6E8DD 78%, transparent)',
        }}
      >
        {/* Eyebrow - Workshift section label pattern */}
        <FadeUp delay={0.1}>
          <span className="font-mono text-xs uppercase tracking-wider text-black mb-8 inline-block">
            AI Consulting dla MŚP
          </span>
        </FadeUp>

        {/* Headline - Workshift style: normal weight, tight tracking */}
        <div style={{ marginBottom: 20 }}>
          <TextReveal
            text="Wdrażamy AI, które po prostu działa."
            wordMode
            delay={0.5}
            className="text-[36px] sm:text-[52px] md:text-[68px] lg:text-[72px] leading-[1.1] tracking-[-2px] lg:tracking-[-3.6px] font-normal text-black"
          />
        </div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: 'rgba(0,0,0,0.1)',
            marginBottom: 24,
            marginTop: 4,
            transformOrigin: 'left',
            maxWidth: 480,
          }}
        />

        {/* Subheading */}
        <FadeUp delay={0.6}>
          <p
            className="text-base md:text-lg"
            style={{
              color: '#595959',
              lineHeight: 1.7,
              maxWidth: '46ch',
              margin: '0 0 28px',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Pomożemy przebić się przez szum. Konkretne wyniki, bez rewolucji
            - odzyskaj czas na budowanie firmy, resztę zautomatyzujemy.
          </p>
        </FadeUp>

        {/* CTA - Workshift pill button pattern */}
        <FadeUp delay={0.7}>
          <div className="flex flex-col gap-6 mb-10">
            <div className="flex items-center gap-6">
              <a
                href="#kontakt"
                className="inline-flex items-center gap-2 bg-black rounded-full py-2 pr-2 pl-4 text-white text-xs font-medium w-fit hover:bg-black/90 transition-all duration-300 active:scale-95 group shadow-lg"
              >
                Kontakt
                <span className="w-7 h-7 rounded-full bg-lime flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="black" strokeWidth="2">
                    <path d="M4 10L10 4M10 4H5M10 4V9" />
                  </svg>
                </span>
              </a>
              <a
                href="#uslugi"
                className="text-xs font-medium text-black flex items-center gap-1 hover:opacity-100 transition-opacity font-semibold"
              >
                Zobacz usługi ↓
              </a>
            </div>

            {/* Phone & WhatsApp inline conversion */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              <p className="text-muted-dark flex items-center gap-2">
                <span className="opacity-60">Wolisz porozmawiać? Zadzwoń:</span>
                <a href="tel:+48796186067" className="font-bold text-black hover:text-lime transition-colors">+48 796 186 067</a>
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Trusted By Marquee */}
        <FadeUp delay={0.7}>
          <div className="mt-4">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-dark mb-3">
              Zaufali nam
            </div>
            <div
              style={{
                overflow: 'hidden',
                width: '100%',
                position: 'relative',
                maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
              }}
            >
              <motion.div
                style={{ display: 'flex', gap: 40, width: 'max-content', alignItems: 'center' }}
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
              >
                {[logo1, logo2, logo3, logo4, logo5, logo1, logo2, logo3, logo4, logo5].map((logo, i) => (
                  <img
                    key={i}
                    src={logo}
                    alt="Trusted Company Logo"
                    className="h-6 md:h-7 object-contain opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </FadeUp>
      </div>

    </div>
  );
}
