"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASE_SETTLE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Floating Back-to-Top control.
 *
 * Appears when the reader has travelled deep into the page (scrollY > 600)
 * so they can return to center court without scrubbing through thousands of
 * pixels. Strictly adheres to the hardwood aesthetic: wine border, maple-deep
 * ground, sharp square geometry, and smooth travel back to `#main`.
 */
function subscribe(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

function getSnapshot() {
  return window.scrollY > 600;
}

function getServerSnapshot() {
  return false;
}

/**
 * The scroll-to-top control, in `court-shell` so it is inside the skip-link's
 * landmark and the page's own layout.
 *
 * It used to take a `className` and merge it last, which would override any of
 * the positioning and sizing above. The only call site passes none, so that was
 * a prop whose whole effect was to be optional: a positioning override nobody
 * used, on the one control whose position is load-bearing against the fixed
 * footer. The `cn` merge is kept for the classes that are here.
 */
export function BackToTop() {
  const visible = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const scrollToTop = () => {
    // Respect the OS reduced-motion preference. An explicit
    // `behavior: "smooth"` argument overrides the element's computed
    // `scroll-behavior`, so globals.css cannot catch this JS path — it has
    // to be read here. ("auto" then defers to the stylesheet, which already
    // neutralises smooth scrolling under reduce.)
    const behavior: ScrollBehavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";
    const main = document.getElementById("main");
    if (main) {
      main.scrollIntoView({ behavior });
      // The button unmounts at scrollY <= 600, so focus must be handed to a
      // node that survives the scroll rather than dropped on <body>.
      main.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 16, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ duration: 0.25, ease: EASE_SETTLE }}
          className={cn(
            "group fixed bottom-6 right-5 z-40 sm:bottom-8 sm:right-8 md:right-14",
            "flex h-11 w-11 items-center justify-center rounded-none",
            "border border-wine bg-maple-deep text-wine shadow-sm",
            "transition-colors duration-200 hover:bg-wine hover:text-chalk",
            "cursor-pointer outline-offset-2",
          )}
        >
          <svg
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
            aria-hidden="true"
          >
            <path d="M3 9.5L8 4.5L13 9.5" />
            <path d="M8 12.5V5.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
