import { motion } from "framer-motion";

/**
 * fade={false}: element widoczny od pierwszego malowania, animujemy tylko przesunięcie.
 * Dla treści u góry strony (nagłówki, element LCP): strony są prerenderowane do HTML
 * i opacity 0 chowałoby gotowy tekst do czasu załadowania JS.
 */
export function FadeUp({ children, delay = 0, className = "", duration = 0.8, fade = true }) {
  return (
    <motion.div
      initial={fade ? { opacity: 0, y: 30 } : { y: 30 }}
      whileInView={fade ? { opacity: 1, y: 0 } : { y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
