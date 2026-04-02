import { motion } from 'framer-motion';
import { HeroParticleSphere } from './HeroParticleSphere';
import logo1 from '../assets/partners/logo1.png';
import logo2 from '../assets/partners/logo2.png';
import logo3 from '../assets/partners/logo3.png';
import logo4 from '../assets/partners/logo4.png';
import logo5 from '../assets/partners/logo5.png';

const NAVY = '#0A2540';
const ACCENT = '#ee703d';

function WordReveal({ word, delay }) {
  return (
    <span style={{ overflow: 'hidden', display: 'inline-block', verticalAlign: 'bottom', paddingBottom: '0.12em', marginBottom: '-0.12em' }}>
      <motion.span
        initial={{ y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'inline-block',
          color: NAVY,
          fontSize: 'clamp(40px, 5.5vw, 72px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          fontFamily: "'Satoshi', sans-serif",
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export function HeroTypographic() {
  const stats = [
    { value: '30%', desc: 'mniej czasu na powtarzalnych zadaniach' },
    { value: '128', desc: 'e-maili obsłużonych automatycznie' },
    { value: '0 dni', desc: 'przestoju przy wdrożeniu' },
  ];

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row overflow-hidden relative"
      style={{
        background: '#FAFAFA',
        fontFamily: "'Satoshi', sans-serif",
      }}
    >
      {/* Top accent bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${ACCENT}, #8530d1)`,
          transformOrigin: 'left',
          zIndex: 10,
        }}
      />

      {/* Background sphere — full bleed */}
      <div className="hidden lg:block" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <HeroParticleSphere />
      </div>

      {/* Left panel — text content */}
      <div
        className="w-full lg:w-[52%] lg:flex-shrink-0 flex flex-col justify-center px-6 py-24 md:px-10 lg:px-16 lg:py-12 relative z-[2]"
        style={{
          background: 'linear-gradient(to right, #FAFAFA 78%, transparent)',
        }}
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 32,
            color: ACCENT,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ width: 24, height: 2, background: ACCENT, display: 'inline-block' }} />
          AI Consulting dla MŚP
        </motion.div>

        {/* Headline */}
        <div style={{ marginBottom: 20, lineHeight: 0 }}>
          <div>
            <WordReveal word="Wdrażamy" delay={0.2} />
            {' '}
            <WordReveal word="AI," delay={0.3} />
          </div>
          <div>
            <WordReveal word="które" delay={0.4} />
            {' '}
            <WordReveal word="po" delay={0.5} />
            {' '}
            <WordReveal word="prostu" delay={0.6} />
            {' '}
            <span style={{ position: 'relative', display: 'inline-block', verticalAlign: 'bottom' }}>
              <WordReveal word="działa." delay={0.7} />
              <motion.svg
                viewBox="0 0 300 16"
                style={{ position: 'absolute', bottom: -4, left: 0, width: '100%', overflow: 'visible' }}
                aria-hidden
              >
                <motion.path
                  d="M4 8 C50 13, 140 3, 296 8"
                  stroke={ACCENT}
                  strokeWidth="4.5"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.svg>
            </span>
          </div>
        </div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: 'rgba(10,37,64,0.1)',
            marginBottom: 24,
            marginTop: 24,
            transformOrigin: 'left',
            maxWidth: 480,
          }}
        />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            color: '#64748b',
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: '46ch',
            margin: '0 0 28px',
            fontWeight: 400,
          }}
        >
          Pomożemy przebić się przez szum. Konkretne wyniki, bez rewolucji
          - odzyskaj czas na budowanie firmy, resztę zautomatyzujemy.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 40 }}
        >
          <a
            href="#darmowa-konsultacja"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: ACCENT,
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(238,112,61,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(238,112,61,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(238,112,61,0.3)';
            }}
          >
            Odbierz darmowy plan
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#uslugi"
            style={{
              color: NAVY,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              opacity: 0.5,
            }}
          >
            Zobacz usługi ↓
          </a>
        </motion.div>

        {/* Trusted By Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          className="mt-4"
        >
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
            Zaufali nam
          </div>
          <div 
            style={{ 
              overflow: 'hidden', 
              width: '100%', 
              position: 'relative', 
              // Fade out edges
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
            }}
          >
            <motion.div
              style={{ display: 'flex', gap: 48, width: 'max-content', alignItems: 'center' }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
            >
              {/* Duplicated array to create a seamless loop */}
              {[logo1, logo2, logo3, logo4, logo5, logo1, logo2, logo3, logo4, logo5].map((logo, i) => (
                <img 
                  key={i} 
                  src={logo} 
                  alt="Trusted Company Logo" 
                  className="h-7 md:h-8 object-contain opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
                  style={{ mixBlendMode: 'multiply' }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
