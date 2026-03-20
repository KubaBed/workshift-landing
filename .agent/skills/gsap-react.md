---
name: gsap-react
description: Official GSAP skill for React — useGSAP hook, refs, gsap.context(), cleanup. Use when the user wants animation in React or Next.js, or asks about GSAP with React, useGSAP, or cleanup on unmount.
---

# GSAP with React

## Important: useGSAP() Hook
Always use the `useGSAP()` hook from `@gsap/react` for React-based GSAP setup.

```javascript
import { useGSAP } from "@gsap/react";

useGSAP(() => {
  gsap.to(".box", { x: 100 });
}, { scope: containerRef });
```

- Handles automatic cleanup on unmount.
- Scopes selectors to your component.

## ContextSafe for Callbacks
Use `contextSafe` for animations triggered outside of the hook (e.g. in event handlers).

```javascript
const { contextSafe } = useGSAP({ scope: containerRef });

const onClick = contextSafe(() => {
  gsap.to(".box", { rotation: 180 });
});
```

## Best Practices
- Register the `useGSAP` plugin.
- Use `refs` for targets.
- Clean up manually if not using `useGSAP`.
