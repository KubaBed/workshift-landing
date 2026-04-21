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
        'z-0 h-full max-h-[400px] w-full max-w-lg rounded-xl border border-black/10 bg-[#0B0F0D] shadow-2xl',
        className
      )}
    >
      <div className="flex flex-col gap-y-2 border-b border-white/10 p-3">
        <div className="flex flex-row gap-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/90" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/90" />
        </div>
      </div>
      <pre className="p-3 overflow-hidden">
        <code className="grid gap-y-1 text-[10px] sm:text-[11px] md:text-xs font-mono leading-snug text-white/90 whitespace-nowrap">
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
