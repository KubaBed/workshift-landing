import { useEffect } from "react";

/**
 * Płynne przewijanie (Lenis) zsynchronizowane z ScrollTrigger.
 *
 * - Lenis wygładza tylko kółko myszy; dotyk przewija natywnie. Na urządzeniach bez
 *   precyzyjnego wskaźnika i przy prefers-reduced-motion nie ładujemy go wcale.
 * - Na desktopie lenis + gsap (ok. 45 KB gzip) ładują się dynamicznie po zdarzeniu load,
 *   więc nie konkurują z pierwszym malowaniem strony.
 * - Ticker gsap dostaje nazwaną funkcję, żeby cleanup naprawdę ją zdjął (wcześniej
 *   anonimowa strzałka zostawała w tickerze po odmontowaniu).
 */
export function LenisProvider({ children }) {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let cancelled = false;
    let stop = () => {};

    const start = async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2, // Faster, snappier scroll
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        wheelMultiplier: 1,
        lerp: 0.1,
      });

      // Synchronize ScrollTrigger with Lenis
      lenis.on("scroll", ScrollTrigger.update);

      // Connect GSAP ticker to Lenis
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);

      // Stop GSAP from using the default lag smoothing when Lenis is active
      gsap.ticker.lagSmoothing(0);

      stop = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    };

    const run = () => {
      start();
    };
    if (document.readyState === "complete") run();
    else window.addEventListener("load", run, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", run);
      stop();
    };
  }, []);

  return <>{children}</>;
}
