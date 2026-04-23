import React, { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * CircularGallery - slow rotating ring of items.
 *
 * React port of the Svelte implementation. GSAP drives `rotation` on a
 * wrapper div; each item is positioned on the circle via two `rotate(...)`
 * transforms (one for angular placement, one to keep the card upright).
 *
 * Items are repeated enough times to fill `2πr / (elementSize + gap)` slots
 * so the ring never shows blank gaps regardless of how few source items
 * you pass.
 *
 * @param {object}  props
 * @param {any[]}   props.items        - Source items to render.
 * @param {Function} props.renderItem  - (item, index) => JSX.
 * @param {number}  [props.radius=600]        - Ring radius (px).
 * @param {number}  [props.duration=20]       - Seconds per full revolution.
 * @param {boolean} [props.reversed=false]    - Reverse rotation direction.
 * @param {number}  [props.offset=0]          - Vertical offset of circle center from container bottom.
 * @param {number}  [props.gap=0]             - Desired gap between items on the arc.
 * @param {number}  [props.elementSize=100]   - Approx item width (for slot count calc).
 * @param {string}  [props.className]         - Extra classes for the outer wrapper.
 */
export function CircularGallery({
  items,
  renderItem,
  radius = 600,
  duration = 20,
  reversed = false,
  offset = 0,
  gap = 0,
  elementSize = 100,
  className,
}) {
  const containerRef = useRef(null);

  const displayItems = useMemo(() => {
    const circumference = 2 * Math.PI * radius;
    const spacePerItem = elementSize + gap;
    const neededItems = Math.ceil(circumference / spacePerItem);
    const repeats = Math.max(1, Math.ceil(neededItems / items.length));
    return Array.from({ length: repeats }, (_, r) =>
      items.map((item, i) => ({ item, key: `${r}-${i}` }))
    ).flat();
  }, [items, radius, elementSize, gap]);

  const angleStep = 360 / displayItems.length;

  useEffect(() => {
    if (!containerRef.current) return;
    const tween = gsap.to(containerRef.current, {
      rotation: reversed ? -360 : 360,
      duration,
      repeat: -1,
      ease: 'none',
    });
    return () => tween.kill();
  }, [duration, reversed]);

  return (
    <div
      className={cn(
        'relative flex h-full w-full items-end justify-center overflow-hidden',
        className
      )}
    >
      <div
        ref={containerRef}
        className="absolute flex items-center justify-center will-change-transform"
        style={{
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          bottom: `${offset - radius}px`,
        }}
      >
        {displayItems.map(({ item, key }, i) => (
          <div
            key={key}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `rotate(${i * angleStep}deg) translate(0, -${radius}px) rotate(90deg)`,
            }}
          >
            <div style={{ transform: 'rotate(-90deg)' }}>
              {renderItem(item, i)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
