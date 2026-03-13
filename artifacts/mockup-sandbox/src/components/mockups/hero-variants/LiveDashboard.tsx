import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const NAVY = "#0A2540";
const ACCENT = "#ee703d";

const TASKS = [
  { id: 1, label: "Wysyłka oferty do Jana K.", time: "przed chwilą", done: false },
  { id: 2, label: "Kategoryzacja e-maili (128)", time: "12s", done: false },
  { id: 3, label: "Raport sprzedaży — PDF", time: "1 min", done: false },
  { id: 4, label: "Follow-up do klientów (×14)", time: "5 min", done: false },
  { id: 5, label: "Aktualizacja CRM", time: "8 min", done: false },
];

const SAVINGS = [
  { label: "Zaoszczędzone godziny", value: 0, target: 127, suffix: "h" },
  { label: "Obsłużone e-maile", value: 0, target: 2840, suffix: "" },
  { label: "Procesów aktywnych", value: 0, target: 12, suffix: "" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCurrent(start);
      if (start >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{current.toLocaleString("pl")}{suffix}</>;
}

export function LiveDashboard() {
  const [tasks, setTasks] = useState(TASKS.map(t => ({ ...t, done: false })));
  const [processingIdx, setProcessingIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => {
        const first = prev.findIndex(t => !t.done);
        if (first === -1) {
          clearInterval(interval);
          return prev;
        }
        const updated = [...prev];
        updated[first] = { ...updated[first], done: true };
        setProcessingIdx(first + 1);
        return updated;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        overflow: "hidden",
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
      }}
    >
      {/* Left panel — text */}
      <div
        style={{
          flex: "0 0 48%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 48px 64px 64px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Vertical accent */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            left: 0,
            top: "15%",
            bottom: "15%",
            width: 3,
            background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)`,
            transformOrigin: "top",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
            background: `${ACCENT}15`,
            border: `1px solid ${ACCENT}30`,
            borderRadius: 100,
            padding: "5px 14px",
            color: ACCENT,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, display: "inline-block" }}
          />
          AI pracuje teraz
        </motion.div>

        <h1 style={{ margin: "0 0 20px", color: NAVY, fontSize: "clamp(36px, 4.2vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08 }}>
          {["Wdrażamy", "AI, które", "po prostu"].map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.66, ease: [0.16, 1, 0.3, 1] }}
            style={{ color: ACCENT }}
          >
            działa.
          </motion.div>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, margin: "0 0 36px", maxWidth: "38ch", fontWeight: 400 }}
        >
          Pomagamy firmom wdrażać AI tam, gdzie naprawdę
          ma to znaczenie — z konkretnymi wynikami, bez rewolucji.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <a
            href="#kontakt"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: ACCENT,
              color: "#fff",
              padding: "13px 24px",
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              boxShadow: `0 4px 20px ${ACCENT}40`,
            }}
          >
            Odbierz darmowy plan
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#uslugi" style={{ color: NAVY, fontSize: 13, fontWeight: 600, textDecoration: "none", opacity: 0.5 }}>
            Jak to działa ↓
          </a>
        </motion.div>

        {/* Mini stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          style={{ display: "flex", gap: 28, marginTop: 44 }}
        >
          {SAVINGS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: "-0.02em" }}>
                <AnimatedNumber target={s.target} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — Live AI Dashboard */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 40px 40px 20px",
          position: "relative",
        }}
      >
        {/* Subtle bg gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 30% 50%, ${ACCENT}08 0%, transparent 70%), radial-gradient(ellipse at 80% 20%, #8530d122 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 40, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 24px 64px rgba(10,37,64,0.12), 0 4px 16px rgba(10,37,64,0.06)",
            width: "100%",
            maxWidth: 460,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Dashboard header */}
          <div style={{ background: NAVY, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginLeft: 8, fontFamily: "monospace" }}>
              workshift · AI Autopilot
            </span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, color: "#22c55e", fontSize: 11, fontWeight: 600 }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              Online
            </motion.div>
          </div>

          {/* Task queue */}
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Kolejka zadań AI
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <AnimatePresence>
                {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.08 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 8,
                      background: task.done ? "#f0fdf4" : i === processingIdx ? "#fff7f0" : "#f8fafc",
                      border: `1px solid ${task.done ? "#bbf7d0" : i === processingIdx ? `${ACCENT}30` : "#e2e8f0"}`,
                      transition: "all 0.4s ease",
                    }}
                  >
                    {task.done ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                          width: 20, height: 20, borderRadius: "50%", background: "#22c55e",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </motion.div>
                    ) : i === processingIdx ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{
                          width: 20, height: 20, borderRadius: "50%", border: `2px solid ${ACCENT}30`,
                          borderTop: `2px solid ${ACCENT}`, flexShrink: 0
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%", border: "2px solid #e2e8f0", flexShrink: 0
                      }} />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 500, color: task.done ? "#166534" : NAVY,
                        textDecoration: task.done ? "line-through" : "none",
                        opacity: task.done ? 0.7 : 1,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }}>
                        {task.label}
                      </div>
                    </div>

                    <div style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>
                      {task.done ? "✓ gotowe" : task.time}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom status bar */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#f8fafc",
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }}
            />
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
              AI przetwarza {tasks.filter(t => !t.done).length} zadań...
            </span>
            <div style={{ marginLeft: "auto", background: "#e2e8f0", borderRadius: 4, height: 4, width: 80, overflow: "hidden" }}>
              <motion.div
                style={{
                  height: "100%",
                  background: `linear-gradient(90deg, ${ACCENT}, #8530d1)`,
                  borderRadius: 4,
                }}
                animate={{ width: `${(tasks.filter(t => t.done).length / tasks.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
