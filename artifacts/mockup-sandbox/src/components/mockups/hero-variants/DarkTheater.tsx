import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const NAVY = "#0A2540";
const ACCENT = "#ee703d";
const VIOLET = "#8530d1";
const ROSE = "#cc7cab";

export function DarkTheater() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const blob1X = useTransform(springX, [0, 1], ["-8vw", "8vw"]);
  const blob1Y = useTransform(springY, [0, 1], ["-6vh", "6vh"]);
  const blob2X = useTransform(springX, [0, 1], ["6vw", "-6vw"]);
  const blob2Y = useTransform(springY, [0, 1], ["4vh", "-4vh"]);
  const blob3X = useTransform(springX, [0, 1], ["-4vw", "4vw"]);
  const blob3Y = useTransform(springY, [0, 1], ["8vh", "-8vh"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const words = ["Wdrażamy", "AI,", "które", "po", "prostu"];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: "100vh",
        background: NAVY,
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      {/* Noise texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          zIndex: 0,
        }}
      />

      {/* Gradient blobs */}
      <motion.div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${ACCENT}55 0%, ${ACCENT}00 70%)`,
          top: "10%",
          left: "15%",
          x: blob1X,
          y: blob1Y,
          zIndex: 1,
          pointerEvents: "none",
        }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${VIOLET}44 0%, ${VIOLET}00 70%)`,
          bottom: "5%",
          right: "10%",
          x: blob2X,
          y: blob2Y,
          zIndex: 1,
          pointerEvents: "none",
        }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      <motion.div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle at center, ${ROSE}33 0%, ${ROSE}00 70%)`,
          top: "45%",
          right: "25%",
          x: blob3X,
          y: blob3Y,
          zIndex: 1,
          pointerEvents: "none",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Dot grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          zIndex: 2,
          pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 800, padding: "0 40px" }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 100,
            padding: "6px 16px",
            marginBottom: 32,
            backdropFilter: "blur(8px)",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, display: "inline-block", animation: "pulse 2s infinite" }} />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AI Consulting · Wrocław
          </span>
        </motion.div>

        {/* Headline */}
        <h1 style={{ margin: "0 0 24px", lineHeight: 1.05 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px" }}>
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "inline-block", color: "#ffffff", fontSize: "clamp(44px, 6vw, 76px)", fontWeight: 700, letterSpacing: "-0.02em" }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "inline-block",
                fontSize: "clamp(44px, 6vw, 76px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                background: `linear-gradient(135deg, ${ACCENT} 0%, ${ROSE} 50%, ${VIOLET} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              działa.
            </motion.span>
          </div>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 18,
            lineHeight: 1.7,
            maxWidth: "52ch",
            margin: "0 auto 40px",
            fontWeight: 400,
          }}
        >
          Pomagamy firmom wdrażać AI tam, gdzie naprawdę ma to znaczenie —
          z konkretnymi wynikami, bez rewolucji.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.25 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <a
            href="#kontakt"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: ACCENT,
              color: "#fff",
              padding: "16px 36px",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              boxShadow: `0 0 40px ${ACCENT}55`,
              letterSpacing: "0.01em",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = "translateY(-2px)"; (e.target as HTMLElement).style.boxShadow = `0 8px 48px ${ACCENT}77`; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = ""; (e.target as HTMLElement).style.boxShadow = `0 0 40px ${ACCENT}55`; }}
          >
            Odbierz darmowy plan
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#uslugi" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 500, textDecoration: "none", letterSpacing: "0.02em" }}>
            Zobacz, jak to działa ↓
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {[{ n: "50+", label: "zautomatyzowanych procesów" }, { n: "0", label: "dni przestoju" }, { n: "3×", label: "szybsze wdrożenie" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>
                {s.n}
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 500, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
      >
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>Scrolluj</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{ width: 1, height: 44, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
        />
      </motion.div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
