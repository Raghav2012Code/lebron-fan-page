"use client";

import * as React from "react";
import {
  MotionConfig,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";

import { SoundProvider } from "@/components/sound-provider";
import { CustomCursor } from "@/components/custom-cursor";

/**
 * Global client shell: reduced-motion config, sound context, decorative
 * cursor, fine grain, and a thin scroll-progress rule pinned to the top.
 */
export function EditorialShell({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  return (
    <MotionConfig reducedMotion="user">
      <SoundProvider>
        {/* Fine grain — hidden under reduced motion via CSS */}
        <div className="grain-overlay" aria-hidden />

        {/* Global scroll progress */}
        <motion.div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[110] h-[2px] origin-left bg-gold"
          style={{ scaleX: progress }}
        />

        <CustomCursor />

        <main id="main" className="relative">
          {children}
        </main>
      </SoundProvider>
    </MotionConfig>
  );
}
