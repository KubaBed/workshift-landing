import { motion } from "framer-motion";

const NAVY = "#0A2540";
const ACCENT = "#ee703d";

const WORDS = ["Wdrażamy", "AI,", "które", "po", "prostu"];

function WordReveal({ word, delay, size }: { word: string; delay: number; size?: number }) {
  return (
    <div style={{ overflow: "hidden", display: "inline-block" }}>
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "inline-block",
          color: NAVY,
          fontSize: size ?? "clamp(56px, 7.5vw, 96px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.0,
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        }}
      >
        {word}
      </motion.span>
    </div>
  );
}

export function TypographicImpact() {
  const stats = [
    { icon: "⚡", value: "50+", label: "procesów" },
    { icon: "🔒", value: "0", label: "dni przestoju" },
    { icon: "🚀", value: "3×", label: "szybciej" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAFA",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 60px",
        overflow: "hidden",
        position: "relative",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      {/* Thin accent line top */}
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
        }}
      />

      {/* Background large text watermark */}
      <div
        style={{
          position: "absolute",
          right: -40,
          bottom: -20,
          fontSize: "clamp(180px, 22vw, 320px)",
          fontWeight: 900,
          color: "rgba(10,37,64,0.04)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        AI
      </div>

      <div style={{ maxWidth: 1100, width: "100%" }}>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 40,
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

        {/* Main headline — word by word reveal */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 20px", alignItems: "baseline" }}>
            {WORDS.map((word, i) => (
              <WordReveal key={i} word={word} delay={0.2 + i * 0.1} />
            ))}
          </div>

          {/* "działa." with underline animation */}
          <div style={{ position: "relative", display: "inline-block", marginTop: 8 }}>
            <WordReveal word="działa." delay={0.75} />
            <motion.svg
              viewBox="0 0 340 18"
              style={{
                position: "absolute",
                bottom: -8,
                left: 0,
                width: "100%",
                overflow: "visible",
              }}
              aria-hidden
            >
              <motion.path
                d="M4 9 C60 14, 160 4, 336 9"
                stroke={ACCENT}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>
          </div>
        </div>

        {/* Separator */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: "rgba(10,37,64,0.1)",
            marginBottom: 32,
            marginTop: 40,
            transformOrigin: "left",
            maxWidth: 640,
          }}
        />

        {/* Bottom row: subtitle + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{ display: "flex", alignItems: "flex-end", gap: 48, flexWrap: "wrap" }}
        >
          <p style={{
            color: "#64748b",
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: "44ch",
            margin: 0,
            fontWeight: 400,
          }}>
            Konkretne wyniki, bez rewolucji. Odzyskaj czas
            na budowanie firmy — resztę zautomatyzujemy.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
            <a
              href="#kontakt"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: NAVY,
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 4,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
              }}
            >
              Odbierz darmowy plan
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#uslugi" style={{
              color: NAVY,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              opacity: 0.6,
            }}>
              Zobacz usługi ↓
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          style={{
            display: "flex",
            gap: 40,
            marginTop: 56,
            flexWrap: "wrap",
          }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
