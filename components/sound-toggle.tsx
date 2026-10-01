"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useSound } from "@/components/sound-provider";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Opt-in shot feedback. Off by default, never autoplays, and it lives next to
 * the game it belongs to rather than floating over the hero.
 */
export function SoundToggle({ className }: { className?: string }) {
  const { enabled, toggle, play } = useSound();
  const reduce = usePrefersReducedMotion();
  // `play` is recreated whenever `enabled` changes, but the click handler
  // below closes over the render at click time (enabled still false when
  // turning sound on). Route through a ref so the deferred call reads the
  // latest `play`, not one whose closure still thinks sound is off.
  const playRef = React.useRef(play);
  React.useEffect(() => {
    playRef.current = play;
  }, [play]);

  // The confirmation tone is deferred so it is not cut off by the state change
  // that precedes it. Track the timer so unmount clears it: an orphaned timeout
  // firing into a torn-down audio context is the same defect `last-shot.tsx` and
  // `playoff-matrix.tsx` already clear against.
  const confirmToneRef = React.useRef<number | null>(null);
  React.useEffect(
    () => () => {
      if (confirmToneRef.current !== null) {
        window.clearTimeout(confirmToneRef.current);
      }
    },
    [],
  );

  return (
    <button
      type="button"
      onClick={() => {
        const turningOn = !enabled;
        toggle();
        // play a confirmation tone only when turning ON
        if (turningOn) {
          confirmToneRef.current = window.setTimeout(
            () => playRef.current("click"),
            20,
          );
        }
      }}
      aria-pressed={enabled}
      className={cn(
        "narrow-bold group inline-flex items-center gap-3 border-b-2 border-wine pb-1.5 text-[0.875rem] text-wine outline-offset-4 transition-colors hover:border-leather hover:text-leather",
        className,
      )}
    >
      {/*
        The equalizer bars. `animate={{ height: … }}` with `repeat: Infinity`
        is a JavaScript loop, so neither Framer's `reducedMotion="user"` nor
        the `[data-reveal-loop]` rule in globals.css can stop it — the CSS rule
        reaches CSS animations only, and the globals.css comment says exactly
        that. `center-court` handles its own loops with a `reduce ? … : …`
        ternary, so this does the same: a reader who asked for reduced motion
        gets three static bars, and the button still reports "Sound on", because
        the bars are decoration and the state is not.

        The animated bars carry `data-reveal-loop`, the attribute `globals.css`
        already uses for exactly this case: an element driven by a Framer
        `repeat: Infinity` loop, which CSS cannot stop, so it has to be marked
        for the ternary to be auditable. The attribute is inert there by design
        and that rule says so; it is also what the test asserts on, since a
        rendered height cannot tell an animated bar from a static one.
      */}
      <span className="flex h-4 w-4 items-end justify-center gap-[2px]" aria-hidden>
        {enabled && !reduce ? (
          <>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                data-reveal-loop="true"
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
            ))}
          </>
        ) : (
          <>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-[3px] bg-current"
                style={{
                  height: enabled ? ["55%", "100%", "40%"][i] : i === 1 ? "40%" : "18%",
                  opacity: enabled ? 1 : 0.45,
                }}
              />
            ))}
          </>
        )}
      </span>
      {enabled ? "Sound on" : "Sound off"}
    </button>
  );
}
