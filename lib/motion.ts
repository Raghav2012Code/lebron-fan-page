import type { Variants } from "framer-motion";

/**
 * motion.ts — the shared animation vocabulary.
 *
 * The old site used one fade-and-slide-up for every element on every section,
 * which is the tell this rewrite is trying to lose. What is shared here is the
 * easing and duration scale plus the masked-lettering variants the type
 * primitives consume. One-off reveals (rules being laid down, blocks coming in
 * from the margin) are tuned at their call site, because their timing is tied
 * to that specific section's scroll distance rather than to a shared rhythm.
 *
 * Nothing generic-slides up on entry.
 *
 * Reduced motion is handled in two places, deliberately. The variants below
 * only ever animate `y` and `opacity`; a `[data-reveal]` rule in globals.css
 * lands every reveal in its final position under
 * `prefers-reduced-motion: reduce`, because Framer's own `reducedMotion`
 * only suppresses transform keys and leaves opacity and stagger delays
 * running.
 */

/* Easing. `EASE_PAINT` is a long expo-out: it looks like a roller being
   dragged, fast then settling. `EASE_SETTLE` is gentler, for type. */
export const EASE_PAINT: [number, number, number, number] = [0.19, 1, 0.22, 1];
export const EASE_SETTLE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DUR = {
  base: 0.62,
  slow: 0.9,
  paint: 1.15,
} as const;

export const VIEWPORT = { once: true, amount: 0.3 } as const;
export const VIEWPORT_SOON = { once: true, amount: 0.12 } as const;

/* --- Containers ---------------------------------------------------------- */
export function stagger(children = 0.075, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: children, delayChildren } },
  };
}

/* --- Rise: lettering coming up inside an overflow-hidden mask ------------- */
/* `inherit: true` is load-bearing on every `show` transition below.
   Framer resolves a variant's own `transition` as the whole story: when a
   variant carries one, the consuming element's `transition` PROP is discarded
   outright (`animateTarget` does `transition ? resolveTransition(...) :
   defaultTransition`, and `resolveTransition` only merges when `inherit` is
   set). Without it every per-line and per-letter `delay` passed by
   `RiseLine` / `PaintedName` was silently dead code and the whole hero
   animated as one simultaneous pop. */
export const rise: Variants = {
  hidden: { y: "112%" },
  show: {
    y: "0%",
    transition: { duration: DUR.slow, ease: EASE_SETTLE, inherit: true },
  },
};

export const riseChar: Variants = {
  hidden: { y: "112%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.78, ease: EASE_SETTLE, inherit: true },
  },
};
