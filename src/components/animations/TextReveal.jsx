import { motion } from "framer-motion";

export function TextReveal({ text, className = "", delay = 0, wordMode = false }) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: () => ({
      opacity: 1,
      transition: {
        staggerChildren: wordMode ? 0.05 : 0.02,
        delayChildren: delay * 0.1,
      },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  if (wordMode) {
    return (
      <motion.div
        className={`flex flex-wrap ${className}`}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
      className={className}
    >
      <motion.span variants={child} className="inline-block relative">
        {text}
      </motion.span>
    </motion.div>
  );
}
