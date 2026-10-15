import { motion, useReducedMotion } from "framer-motion";

/**
 * Nagłówek wjeżdżający słowo po słowie.
 *
 * Tekst jest widoczny od pierwszego malowania: animujemy tylko przesunięcie słów,
 * bez opacity 0 i rozmycia. Wcześniej nagłówek hero startował niewidoczny i czekał
 * na IntersectionObserver, co przesuwało LCP strony głównej o ok. 1,5 s.
 * Przy prefers-reduced-motion słowa stoją od razu na miejscu.
 */
export function TextReveal({ text, className = "", delay = 0, wordMode = false }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: wordMode ? 0.05 : 0.02,
        delayChildren: delay * 0.1,
      },
    },
  };

  const child = {
    hidden: { y: "0.35em" },
    visible: {
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  const initial = reduce ? false : "hidden";

  if (wordMode) {
    return (
      <motion.div
        className={`flex flex-wrap ${className}`}
        variants={container}
        initial={initial}
        animate="visible"
      >
        {words.map((word, index) => (
          <motion.span
            variants={child}
            style={{ marginRight: "0.25em" }}
            key={index}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial={initial}
      animate="visible"
      className={className}
    >
      <motion.span variants={child} className="inline-block relative">
        {text}
      </motion.span>
    </motion.div>
  );
}
