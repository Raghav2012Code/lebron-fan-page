import type { Variants, Transition } from "framer-motion";

/**
 * motion.ts — the site's shared animation vocabulary.
 * Editorial easing, a small set of durations, and reusable Framer Motion
 * variants so choreography stays consistent instead of being re-invented
 * in every component.
 */

/* Easing — expo-out for entrances, a symmetric quint for scroll-linked moves. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.83, 0, 0.17, 1];
export const EASE_OUT_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DUR = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
  xslow: 1.4,
} as const;

/** Shared whileInView viewport config — reveal once, a third of the way in. */
export const VIEWPORT = { once: true, amount: 0.3 } as const;
export const VIEWPORT_SOON = { once: true, amount: 0.15 } as const;

export const springSoft: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 0.6,
};

/* --- Containers ---------------------------------------------------------- */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerFast: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045 },
  },
};

export function makeStagger(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/* --- Item entrances ------------------------------------------------------ */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.slow, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

/** For metadata labels that slide in from a direction. */
export const slideFrom = (axis: "x" | "y", distance: number): Variants => {
  const transition = { duration: DUR.slow, ease: EASE_OUT };
  return axis === "x"
    ? {
        hidden: { opacity: 0, x: distance },
        show: { opacity: 1, x: 0, transition },
      }
    : {
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0, transition },
      };
};

/* --- Masked line / letter reveal ---------------------------------------- */
/** Inner element animates within an overflow-hidden mask (y: 110% → 0). */
export const maskUp: Variants = {
  hidden: { y: "115%" },
  show: {
    y: "0%",
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

export const charClip: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

export const wordUp: Variants = {
  hidden: { opacity: 0, y: "60%", rotateX: 40 },
  show: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

/* --- SVG path drawing ---------------------------------------------------- */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: DUR.xslow, ease: EASE_OUT },
      opacity: { duration: 0.25 },
    },
  },
};

/** Thin border that draws itself via scaleX. Pair with transform-origin left. */
export const drawRuleX: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};

export const drawRuleY: Variants = {
  hidden: { scaleY: 0 },
  show: {
    scaleY: 1,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};
