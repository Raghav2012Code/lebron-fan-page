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
/**
 * A parent variant whose only job is to sequence its children.
 *
 * `inherit: true` is here for the same reason it is on `rise` and `riseChar`
 * below, and it was missing until this was audited. Framer resolves a variant's
 * own `transition` as the whole story: when a variant carries one, the consuming
 * element's `transition` PROP is discarded outright, so a child that binds this
 * and passes a `delay` through that prop silently gets nothing. No current caller
 * does — `center-court.tsx` uses this three times and its children carry their
 * delays inside their own variants — so the omission was invisible. It would not
 * have stayed invisible: this is the obvious way to write a staggered list, and
 * the failure is a delay that quietly does not apply.
 *
 * Cost of setting it: for a child that has no `transition` prop there is nothing
 * to merge, so behaviour is unchanged. Do not remove it on the grounds that
 * nothing needs it today.
 */
export function stagger(children = 0.075, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: children, delayChildren, inherit: true },
    },
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
   animated as one simultaneous pop.

   Scope it to these two, and to `stagger()` above. A locally-defined `show`
   that carries its own transition does NOT need it: `inherit` merges the
   consuming element's `transition` prop into the variant, so on a variant that
   is its own animation it only introduces a second source of truth for timing.
   The bug is specific to a variant being consumed by an element that carries
   its own `transition` prop — which is exactly what `rise` and `riseChar` are
   for, and what roughly thirty component-local `show` transitions are not. */
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
