---
name: gsap-timeline
description: Official GSAP skill for timelines — gsap.timeline(), position parameter, nesting, playback. Use when sequencing animations, choreographing keyframes, or when the user asks about animation sequencing, timelines, or animation order.
---

# GSAP Timeline

## Creating a Timeline
```javascript
const tl = gsap.timeline();

tl.to(".a", { x: 100, duration: 1 })
  .to(".b", { y: 50, duration: 0.5 }, "+=0.5")  // position parameter
  .to(".c", { opacity: 0, duration: 0.3 }, "<"); // sync with previous start
```

## Position Parameters
- **Absolute**: `1` (1 second).
- **Relative**: `"+=0.5"`, `"-=0.2"`.
- **Labels**: `"intro"`, `"<"` (start of previous), `">"` (end of previous).

## Timeline Defaults
```javascript
const tl = gsap.timeline({
  defaults: { duration: 0.5, ease: "power2.out" }
});
```

## Control Methods
- `tl.play()`, `tl.pause()`, `tl.reverse()`, `tl.restart()`, `tl.kill()`.
