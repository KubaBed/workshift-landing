import React, { useEffect, useRef, useState } from 'react';

// Direct lottie-web integration (no lottie-react wrapper).
// Why: lottie-react's ref exposes animationItem asynchronously which
// conflicts with hover/autoplay control. Direct lottie.loadAnimation
// gives us synchronous access to the instance.
export function LottiePreview({
  src,
  className = '',
  hoverToPlay = true,
  loop = true,
  speed = 1,
  preserveAspectRatio = 'xMidYMid slice',
  scale = 1,
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);
  const [data, setData] = useState(null);

  // Fetch JSON
  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => console.error('[LottiePreview] fetch failed', e));
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Mount animation once data + container are ready
  useEffect(() => {
    if (!data || !containerRef.current) return;
    let cancelled = false;
    let anim = null;

    import('lottie-web').then((mod) => {
      if (cancelled || !containerRef.current) return;
      const lottie = mod.default || mod;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay: !hoverToPlay, // true when we don't gate on hover
        animationData: data,
        rendererSettings: { preserveAspectRatio },
      });
      anim.setSpeed(speed);
      animRef.current = anim;
      if (typeof window !== 'undefined') window.__lottie = anim;
    });

    return () => {
      cancelled = true;
      if (anim) anim.destroy();
      animRef.current = null;
    };
  }, [data, loop, hoverToPlay, speed, preserveAspectRatio]);

  const handleEnter = () => {
    if (!hoverToPlay || !animRef.current) return;
    animRef.current.play();
  };

  const handleLeave = () => {
    if (!hoverToPlay || !animRef.current) return;
    animRef.current.pause();
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'center center',
        }}
      />
    </div>
  );
}
