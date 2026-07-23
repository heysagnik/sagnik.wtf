// Centralized motion presets. The literals below were moved verbatim from the
// per-component ANIMATION_* blocks so the on-screen motion is unchanged — only
// the duplication is removed. `as const` is required so the bezier easings land
// as tuples (framer-motion's BezierDefinition is a readonly 4-tuple).

export const EASING = {
  easeOut: [0.25, 0.46, 0.45, 0.94] as const,
  easeInOut: [0.32, 0.72, 0, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  expo: [0.25, 0.1, 0.25, 1.0] as const,
} as const;

export const SPRING = {
  stiff: { type: "spring", stiffness: 600, damping: 15, mass: 0.6 } as const,
  smooth: { type: "spring", stiffness: 400, damping: 20, mass: 0.8 } as const,
  quick: { type: "spring", stiffness: 800, damping: 20, duration: 0.08 } as const,
} as const;

// Entrance: 200ms fade + rise + settle. Used by message rows popping in one by
// one on first visit, like a message arriving in iOS Messages.
export const fadeUp = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

// Photo lightbox: container with a slightly softer/faster exit than entrance.
export const lightbox = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } },
  transition: { duration: 0.25, ease: EASING.out },
} as const;
