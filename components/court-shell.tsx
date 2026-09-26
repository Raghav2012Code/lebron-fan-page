"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

import { SoundProvider } from "@/components/sound-provider";
import { BackToTop } from "@/components/back-to-top";

/**
 * Global client shell. Deliberately almost empty: no custom cursor, no fixed
 * progress rail, no grain overlay. The page carries itself, the season ruler
 * is the map, and the footer holds the index. `MotionConfig reducedMotion`
 * neutralises every Framer animation for people who ask for that.
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
