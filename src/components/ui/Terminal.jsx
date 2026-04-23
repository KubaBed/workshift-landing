import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Terminal({ children, className }) {
  return (
    <div
      className={cn(
        'z-0 h-full max-h-[400px] w-full max-w-lg rounded-xl border border-black/10 bg-[#FAF7F0] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15),0_4px_12px_-4px_rgba(0,0,0,0.08)] antialiased',
        className
      )}
    >
      <div className="flex items-center gap-x-2 border-b border-black/5 px-3 py-2.5">
        <div className="flex flex-row gap-x-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28C840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]" />
        </div>
        <span className="flex-1 text-center text-[10px] font-medium tracking-wide text-black/40 font-mono select-none">
          workshift ~ zsh
        </span>
        <span className="w-[46px]" aria-hidden />
      </div>
      <pre className="p-3 overflow-hidden">
        <code className="grid gap-y-1 text-[10px] sm:text-[11px] md:text-xs font-mono leading-snug text-black/85 whitespace-nowrap">
          {children}
        </code>
      </pre>
    </div>
  );
}

export function AnimatedSpan({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
      className={cn('grid text-sm font-normal tracking-tight', className)}
    >
      {children}
    </motion.div>
  );
}

export function TypingAnimation({
  children,
  className,
  duration = 55,
  delay = 0,
  as: Component = 'span',
  loop = false,
  startOnView = true,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(!startOnView);
  const elementRef = useRef(null);

  if (typeof children !== 'string') {
    throw new Error('TypingAnimation: children must be a string.');
  }

  useEffect(() => {
    if (!startOnView) {
      const t = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(t);
    }
    const el = elementRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setStarted(true), delay);
          observer.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, startOnView]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const graphemes = Array.from(children);
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < graphemes.length) {
        setDisplayedText(graphemes.slice(0, i + 1).join(''));
        i += 1;
      } else {
        clearInterval(interval);
        if (loop) {
          setTimeout(() => {
            i = 0;
            setDisplayedText('');
          }, 1500);
        }
      }
    }, duration);
    return () => clearInterval(interval);
  }, [children, duration, started, loop]);

  return (
    <Component
      ref={elementRef}
      className={cn('text-sm font-normal tracking-tight', className)}
    >
      {displayedText}
    </Component>
  );
}
