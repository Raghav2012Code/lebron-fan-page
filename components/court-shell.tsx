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
        <main id="main" className="relative">
          {children}
        </main>
        <BackToTop />
      </SoundProvider>
    </MotionConfig>
  );
}
