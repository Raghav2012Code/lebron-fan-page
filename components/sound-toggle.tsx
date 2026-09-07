"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useSound } from "@/components/sound-provider";

/**
 * Opt-in shot feedback. Off by default, never autoplays, and it lives next to
 * the game it belongs to rather than floating over the hero.
 */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle, play } = useSound();
  // `play` is recreated whenever `enabled` changes, but the click handler
  // below closes over the render at click time (enabled still false when
  // turning sound on). Route through a ref so the deferred call reads the
  // latest `play`, not one whose closure still thinks sound is off.
  const playRef = React.useRef(play);
  React.useEffect(() => {
    playRef.current = play;
  }, [play]);

  return (
    <button
      type="button"
      onClick={() => {
        const turningOn = !enabled;
        toggle();
        // play a confirmation tone only when turning ON
        if (turningOn) window.setTimeout(() => playRef.current("click"), 20);
      }}
      aria-pressed={enabled}
      className={cn(
        "narrow-bold group inline-flex items-center gap-3 border-b-2 border-wine pb-1.5 text-[0.875rem] text-wine outline-offset-4 transition-colors hover:border-leather hover:text-leather",
        className,
      )}
    >
      <span className="flex h-4 w-4 items-end justify-center gap-[2px]" aria-hidden>
        {[0, 1, 2].map((i) =>
          enabled ? (
            <motion.span
              key={i}
              className="w-[3px] bg-current"
              animate={{ height: ["30%", "100%", "45%"] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.12,
                ease: "easeInOut",
              }}
              style={{ height: "50%" }}
            />
          ) : (
            <span
              key={i}
              className="w-[3px] bg-current"
              style={{ height: i === 1 ? "40%" : "18%", opacity: 0.45 }}
            />
          ),
        )}
      </span>
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}
