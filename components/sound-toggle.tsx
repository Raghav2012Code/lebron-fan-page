"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VolumeX } from "lucide-react";

import { cn } from "@/lib/utils";
import { useSound } from "@/components/sound-provider";

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
      data-cursor={enabled ? "MUTE" : "SOUND"}
      className={cn(
        "group inline-flex items-center gap-2.5 border border-hairline-strong bg-ink/50 px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted backdrop-blur-[2px] transition-colors hover:border-gold hover:text-paper",
        className,
      )}
    >
      <span className="relative flex h-3.5 w-4 items-center justify-center">
        {enabled ? (
          <span className="flex items-end gap-[2px]" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-[2px] bg-gold"
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
          </span>
        ) : (
          <VolumeX className="size-3.5" aria-hidden />
        )}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={enabled ? "on" : "off"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
        >
          {enabled ? "AMBIENCE ON" : "AMBIENCE OFF"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
