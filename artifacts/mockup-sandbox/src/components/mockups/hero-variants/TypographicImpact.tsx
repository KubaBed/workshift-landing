import { motion } from "framer-motion";
import { ParticleSphere } from "./ParticleSphere";

const NAVY = "#0A2540";
const ACCENT = "#ee703d";

const HEADLINE_PARTS = [
  { words: ["Wdrażamy", "AI,"], line: 1 },
  { words: ["które", "po", "prostu"], line: 2 },
];

function WordReveal({ word, delay }: { word: string; delay: number }) {
  return (
    <span style={{ overflow: "hidden", display: "inline-block" }}>
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "inline-block",
          color: NAVY,
          fontSize: "clamp(40px, 5.5vw, 72px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export function TypographicImpact() {
  const stats = [
    { value: "30%", desc: "mniej czasu na powtarzalnych zadaniach" },
    { value: "128", desc: "e-maili obsłużonych automatycznie" },
    { value: "0 dni", desc: "przestoju przy wdrożeniu" },
  ];

  let wordIndex = 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${ACCENT}, #8530d1)`,
          transformOrigin: "left",
          zIndex: 10,
        }}
      />

      {/* Left panel — text content */}
      <div
        style={{
          flex: "0 0 52%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 40px 48px 64px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 32,
            color: ACCENT,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 24, height: 2, background: ACCENT, display: "inline-block" }} />
          AI Consulting dla MŚP
        </motion.div>

        {/* Headline */}
        <div style={{ marginBottom: 20 }}>
          {HEADLINE_PARTS.map((part, lineI) => (
            <div key={lineI} style={{ display: "flex", flexWrap: "nowrap", gap: "0 16px", alignItems: "flex-end" }}>
              {part.words.map((word) => {
                const delay = 0.2 + wordIndex * 0.1;
                wordIndex++;
                return <WordReveal key={word + delay} word={word} delay={delay} />;
              })}
              {lineI === 1 && (
                <span style={{ position: "relative", display: "inline-block" }}>
                  <WordReveal word="działa." delay={0.2 + wordIndex * 0.1} />
                  <motion.svg
                    viewBox="0 0 300 16"
                    style={{
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      width: "100%",
                      overflow: "visible",
                    }}
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
              )}
            </div>
          ))}
        </div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: "rgba(10,37,64,0.1)",
            marginBottom: 24,
            marginTop: 24,
            transformOrigin: "left",
            maxWidth: 480,
          }}
        />

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            color: "#64748b",
            fontSize: 15,
            lineHeight: 1.7,
            maxWidth: "46ch",
            margin: "0 0 28px",
            fontWeight: 400,
          }}
        >
          Pomożemy przebić się przez szum. Konkretne wyniki, bez rewolucji
          — odzyskaj czas na budowanie firmy, resztę zautomatyzujemy.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 40 }}
        >
          <a
            href="#kontakt"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: ACCENT,
              color: "#fff",
              padding: "14px 28px",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
              boxShadow: `0 4px 20px rgba(238,112,61,0.3)`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(238,112,61,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(238,112,61,0.3)";
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
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              opacity: 0.5,
            }}
          >
            Zobacz usługi ↓
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          style={{ display: "flex", gap: 32, flexWrap: "wrap" }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ maxWidth: 160 }}>
              <div style={{
                fontSize: 24, fontWeight: 800, color: NAVY,
                letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: 12, color: "#94a3b8", fontWeight: 500, lineHeight: 1.4
              }}>
                {s.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — Particle Sphere */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ParticleSphere />
        </motion.div>
      </div>
    </div>
  );
}
