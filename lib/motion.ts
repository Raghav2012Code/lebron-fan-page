import type { Variants, Transition } from "framer-motion";

/**
 * motion.ts — the shared animation vocabulary.
 *
 * The old site used one fade-and-slide-up for every element on every section,
 * which is the tell this rewrite is trying to lose. So the vocabulary here is
 * deliberately split by *job*, and each section leans on a different one:
 *
 *   paint*   — something is being laid onto the floor (rules, blocks, bands)
 *   rise*    — lettering coming up out of the boards, inside a mask
 *   fromEdge — content entering from the page margin, horizontally
 *
 * Nothing generic-slides up on entry.
 */

/* Easing. `EASE_PAINT` is a long expo-out: it looks like a roller being
   dragged, fast then settling. `EASE_SETTLE` is gentler, for type. */
export const EASE_PAINT: [number, number, number, number] = [0.19, 1, 0.22, 1];
export const EASE_SETTLE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SWEEP: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DUR = {
  fast: 0.34,
  base: 0.62,
  slow: 0.9,
  paint: 1.15,
} as const;

export const VIEWPORT = { once: true, amount: 0.3 } as const;
export const VIEWPORT_SOON = { once: true, amount: 0.12 } as const;

export const springFirm: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.6,
};

/* --- Containers ---------------------------------------------------------- */
export function stagger(children = 0.075, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: children, delayChildren } },
  };
}

/* --- Paint: a rule or block laid down from one edge ----------------------- */
export const paintX: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: DUR.paint, ease: EASE_PAINT },
  },
};

export const paintY: Variants = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: DUR.slow, ease: EASE_PAINT },
  },
};

/* --- Rise: lettering coming up inside an overflow-hidden mask ------------- */
export const rise: Variants = {
  hidden: { y: "112%" },
  show: {
    y: "0%",
    transition: { duration: DUR.slow, ease: EASE_SETTLE },
  },
};

export const riseChar: Variants = {
  hidden: { y: "112%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.78, ease: EASE_SETTLE },
  },
};

/* --- From the margin: horizontal entry, used instead of a vertical fade --- */
export const fromEdge = (distance = -34): Variants => ({
  hidden: { opacity: 0, x: distance },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: DUR.base, ease: EASE_SETTLE },
  },
});

/** For copy that should arrive without moving — used where movement would
 *  compete with something else already in motion. */
export const holdFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.slow, ease: EASE_SETTLE } },
};

/* --- SVG line drawing ----------------------------------------------------- */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, ease: EASE_PAINT },
      opacity: { duration: 0.2 },
    },
  },
};
