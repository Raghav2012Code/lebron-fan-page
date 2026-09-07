"use client";

import * as React from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

import { MARQUEE } from "@/lib/lebron-data";
import { cn } from "@/lib/utils";

/** Wrap a value into the [min,max) range (for seamless looping). */
function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return (((v - min) % range) + range) % range + min;
}

function MarqueeRow({
  items,
  baseVelocity,
  outline = false,
}: {
  items: readonly string[];
  baseVelocity: number;
  outline?: boolean;
}) {
  const reduce = useReducedMotion();
  const [paused, setPaused] = React.useState(false);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const directionFactor = React.useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || paused) return;

    // Scroll velocity nudges direction + speed. Direction comes from the
    // sign of vf alone; speed scales with its magnitude. Scaling by
    // `1 + vf` directly (rather than `1 + Math.abs(vf)`) would let a large
    // negative vf (fast upward scroll) flip the sign back, cancelling the
    // direction change above and reversing the marquee.
    const vf = velocityFactor.get();
    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;

    const speedMultiplier = 1 + Math.abs(vf);
    const moveBy =
      directionFactor.current * baseVelocity * (delta / 1000) * speedMultiplier;

    baseX.set(baseX.get() + moveBy);
  });

  const phrase = items.join("  ·  ");

  const renderTrack = (copy: number) => (
    <span
      aria-hidden
      className={cn(
        "font-display flex shrink-0 whitespace-nowrap uppercase",
        outline ? "type-outline" : "text-paper",
      )}
      style={
        outline
          ? ({
              ["--stroke-c" as string]: "var(--gold)",
              ["--stroke-w" as string]: "1.5px",
            } as React.CSSProperties)
          : undefined
      }
    >
      {items.map((item, i) => (
        <span key={`${copy}-${i}`} className="flex items-center">
          <span>{item}</span>
          <span className="mx-6 text-gold sm:mx-10" aria-hidden>
            ·
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      role="img"
      aria-label={phrase}
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="flex overflow-hidden py-1 outline-offset-4"
      style={{ fontSize: "clamp(2.25rem, 7.5vw, 6.5rem)", lineHeight: 1.05 }}
    >
      <motion.div className="flex" style={{ x }}>
        {renderTrack(0)}
        {renderTrack(1)}
      </motion.div>
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <section
      aria-label="Marquee — The King, 23, Akron; four titles, four MVPs, longevity, pressure, legacy"
      className="relative border-y border-hairline bg-ink py-4 sm:py-6"
    >
      <MarqueeRow items={MARQUEE.top} baseVelocity={-2.4} />
      <div className="my-2 h-px w-full bg-hairline sm:my-3" />
      <MarqueeRow items={MARQUEE.bottom} baseVelocity={2.4} outline />
    </section>
  );
}
