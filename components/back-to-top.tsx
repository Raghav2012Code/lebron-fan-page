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

export function BackToTop({ className }: { className?: string }) {
  const visible = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const scrollToTop = () => {
    const main = document.getElementById("main");
    if (main) {
      main.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
            className,
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
