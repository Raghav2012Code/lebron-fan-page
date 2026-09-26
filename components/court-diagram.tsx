"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { EASE_PAINT } from "@/lib/motion";

/**
 * A half-court drawn to real proportions (1 foot = 10 units), seen from
 * above: a 16ft key 19ft long, a 6ft free-throw circle, and a three-point
 * line that runs 14ft straight up from the baseline before arcing at 23ft 9in
 * from the basket.
 *
 * Two cuts. `paint` is everything from the baseline up to the top of the arc
 * and is what the hero uses — it stays legible when the hero's wine band
 * crosses it, because every line in it belongs to one recognisable shape.
 * `full` adds the sidelines and the centre circle and is only used where the
 * whole diagram can be seen at once.
 */

const W = 500;
const H = 470;
const BASKET_Y = H - 52.5;
const ARC_TOP = 180; // 417.5 - 237.5

/** three-point line: up the corners, then the arc */
/* Three-point line: 14ft straight up from the baseline in the corners, then
   an arc of 237.5 units (23ft 9in) centred on the basket.
   The sweep flag MUST be 1. With 0 the browser resolves the arc against the
   other possible centre — (250, 240.52) instead of the basket at
   (250, 417.5) — so the line bows away from the hoop and dips ~8 units
   *below* the baseline, where both viewBoxes clip it. */
const THREE = `M 30 ${H} L 30 328.02 A 237.5 237.5 0 0 1 470 328.02 L 470 ${H}`;

/**
 * Aspect ratio of the default `paint` cut, as a CSS `aspect-ratio` value.
 *
 * Export it because the ratio is the thing consumers get wrong. A box that
 * frames the court at the wrong ratio makes `preserveAspectRatio="meet"`
 * letterbox the drawing and pin it to one edge — the court is complete but
 * reads as a fragment. Size on this and the fit is exact by construction.
 *
 * Note it is `aspect-ratio` on a plain block, not on the `<svg>`: an inline
 * SVG with `width: auto` resolves to `100%` of its containing block rather
 * than deriving from its own viewBox, so setting the ratio on the wrapper and
 * filling it is the only reliable arrangement.
 */
export const COURT_PAINT_ASPECT = `${W} / ${H - (ARC_TOP - 14)}`;

export function CourtDiagram({
  className,
  variant = "paint",
  stroke = "var(--ochre)",
  opacity = 0.5,
  animate = true,
  delay = 0,
  preserveAspectRatio = "xMidYMax meet",
}: {
  className?: string;
  variant?: "paint" | "full";
  stroke?: string;
  opacity?: number;
  animate?: boolean;
  delay?: number;
  preserveAspectRatio?: string;
}) {
  const full = variant === "full";
  const top = full ? 0 : ARC_TOP - 14;

  const common = {
    fill: "none",
    stroke,
    strokeWidth: 2,
    vectorEffect: "non-scaling-stroke" as const,
  };

  const draw = (i: number) =>
    animate
      ? {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: {
            duration: 1.5,
            ease: EASE_PAINT,
            delay: delay + i * 0.1,
          },
        }
      : {};

  return (
    <svg
      aria-hidden
      viewBox={`0 ${top} ${W} ${H - top}`}
      className={className}
      style={{ opacity }}
      preserveAspectRatio={preserveAspectRatio}
    >
      {/* baseline */}
      <motion.path d={`M 0 ${H} L ${W} ${H}`} {...common} {...draw(0)} />
      {/* the key */}
      <motion.path
        d={`M 170 ${H} L 170 280 L 330 280 L 330 ${H}`}
        {...common}
        {...draw(1)}
      />
      {/* free-throw circle */}
      <motion.circle cx="250" cy="280" r="60" {...common} {...draw(2)} />
      {/* three-point line */}
      <motion.path d={THREE} {...common} {...draw(3)} />
      {/* backboard and rim */}
      <motion.path d="M 220 430 L 280 430" {...common} {...draw(4)} />
      <motion.circle cx="250" cy={BASKET_Y} r="7.5" {...common} {...draw(4)} />

      {full ? (
        <>
          <motion.path
            d={`M 0 0 L 0 ${H} M ${W} 0 L ${W} ${H} M 0 0 L ${W} 0`}
            {...common}
            {...draw(5)}
          />
          <motion.circle cx="250" cy="0" r="60" {...common} {...draw(6)} />
        </>
      ) : null}
    </svg>
  );
}
