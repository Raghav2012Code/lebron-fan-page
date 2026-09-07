"use client";

import * as React from "react";

/**
 * SSR-safe prefers-reduced-motion.
 *
 * Framer's own useReducedMotion reads the media query during the first client
 * render, which can differ from the server (always "no preference") and trip a
 * hydration mismatch when a component *branches its DOM* on the value. This
 * hook returns the server snapshot (false) on the server AND on the first
 * client render, then updates after hydration — so structural branching stays
 * hydration-safe. Use it for layout decisions; MotionConfig still handles the
 * per-animation reduction everywhere else.
 */
const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
