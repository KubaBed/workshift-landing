import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function LenisProvider({ children }) {
  useEffect(() => {
    // 1. Initial setup
    const lenis = new Lenis({
      duration: 1.2, // Faster, snappier scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      wheelMultiplier: 1,
      lerp: 0.1,
    });

    // 2. Synchronize ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Connect GSAP ticker to Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 4. Optimization: Stop GSAP from using the default lag smoothing when Lenis is active
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}
