"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

import { SoundProvider } from "@/components/sound-provider";
import { BackToTop } from "@/components/back-to-top";

/**
 * Global client shell. Deliberately almost empty: no custom cursor, no fixed
 * progress rail, no grain overlay. The page carries itself, the season ruler
 * is the map, and the footer holds the index.
 *
 * `MotionConfig reducedMotion` is the FIRST of three mechanisms, not the whole
 * of one. It used to be described here as neutralising "every Framer animation",
 * which is false and contradicted three files away: it only snaps transform and
 * layout keys, leaving `opacity`, `delay` and `staggerChildren` running. What
 * actually covers the rest:
 *
 *   1. every element Framer animates carries `data-reveal`, which
 *      `globals.css` uses inside `@media (prefers-reduced-motion: reduce)` to
 *      land it in its final position;
 *   2. repeating attention animations are stopped in JS, because a CSS rule
 *      cannot reach a rAF loop;
 *   3. where reduced motion changes the DOM rather than an animation, the
 *      component branches on `usePrefersReducedMotion()`.
 *
 * The four gates are all green with a comment asserting something untrue, which
 * is the whole reason to care: nothing checks prose.
 */
export function CourtShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SoundProvider>
        {/* `tabIndex={-1}` makes <main> programmatically focusable. Without
            it the skip link can only move the viewport, never keyboard focus,
            so the next Tab lands back in the region the link exists to bypass;
            and Back to Top unmounts the focused button mid-scroll, stranding
            focus on <body>. `outline-none` keeps it from drawing a ring on
            pointer click, while :focus-visible still shows one. */}
        <main id="main" tabIndex={-1} className="relative outline-none">
          {children}
        </main>
        <BackToTop />
      </SoundProvider>
    </MotionConfig>
  );
}
