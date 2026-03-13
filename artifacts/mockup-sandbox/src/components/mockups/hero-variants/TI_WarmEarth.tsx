import { motion } from "framer-motion";
import { ParticleSphereConfigurable } from "./ParticleSphereConfigurable";

const BG = "#FFFBF5";
const TEXT = "#1C1008";
const MUTED = "#7C6047";
const ACCENT = "#C4662A";
const SEP = "rgba(28,16,8,0.08)";

const SPHERE_CONFIG = {
  palette: [
    0xC4662A, 0xC4662A, 0xC4662A,
    0x8B6534, 0x8B6534,
    0xD4965A, 0xD4965A,
    0xE8B887,
    0xA0522D,
    0xCD853F,
  ],
  lineColor: 0xC4662A,
  lineOpacity: 0.06,
  bgColor: 0xFFFBF5,
};

function WordReveal({ word, delay, color }: { word: string; delay: number; color: string }) {
  return (
    <span style={{ overflow: "hidden", display: "inline-block", verticalAlign: "bottom" }}>
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: "inline-block",
          color,
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

export function TI_WarmEarth() {
  const stats = [
    { value: "30%", desc: "mniej czasu na powtarzalnych zadaniach" },
    { value: "128", desc: "e-maili obsłużonych automatycznie" },
    { value: "0 dni", desc: "przestoju przy wdrożeniu" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG,
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
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${ACCENT}, #D4965A)`,
          transformOrigin: "left",
          zIndex: 10,
        }}
      />

      {/* Subtle warm texture overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 70% 50%, rgba(196,102,42,0.04) 0%, transparent 60%)",
      }} />

      {/* Left panel */}
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

        <div style={{ marginBottom: 20, lineHeight: 0 }}>
          <div>
            <WordReveal word="Wdrażamy" delay={0.2} color={TEXT} />
            {" "}
            <WordReveal word="AI," delay={0.3} color={TEXT} />
          </div>
          <div>
            <WordReveal word="które" delay={0.4} color={TEXT} />
            {" "}
            <WordReveal word="po" delay={0.5} color={TEXT} />
            {" "}
            <WordReveal word="prostu" delay={0.6} color={TEXT} />
            {" "}
            <span style={{ position: "relative", display: "inline-block", verticalAlign: "bottom" }}>
              <WordReveal word="działa." delay={0.7} color={ACCENT} />
              <motion.svg
                viewBox="0 0 300 16"
                style={{ position: "absolute", bottom: -4, left: 0, width: "100%", overflow: "visible" }}
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

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: SEP,
            marginBottom: 24, marginTop: 24,
            transformOrigin: "left",
            maxWidth: 480,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            color: MUTED,
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
              boxShadow: `0 4px 20px rgba(196,102,42,0.28)`,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(196,102,42,0.42)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(196,102,42,0.28)";
            }}
          >
            Odbierz darmowy plan
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#uslugi" style={{ color: MUTED, fontSize: 13, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, opacity: 0.7 }}>
            Zobacz usługi ↓
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.35 }}
          style={{ display: "flex", gap: 32, flexWrap: "wrap" }}
        >
          {stats.map((s, i) => (
            <div key={i} style={{ maxWidth: 160 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: MUTED, fontWeight: 500, lineHeight: 1.4 }}>
                {s.desc}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, position: "relative", minHeight: "100vh" }}>
        <ParticleSphereConfigurable config={SPHERE_CONFIG} />
      </div>
    </div>
  );
}
