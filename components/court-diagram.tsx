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
 * One cut: everything from the baseline up to the top of the arc. It stays
 * legible when the hero's wine band crosses it, because every line in it belongs
 * to one recognisable shape.
 *
 * There used to be a second cut, `variant="full"`, which added the sidelines and
 * the centre circle, and a comment here claimed it was "only used where the
 * whole diagram can be seen at once". There is exactly one call site —
 * `center-court.tsx` — and it never passed `variant`, so the branch rendered
 * nothing. A comment asserting a usage that does not exist is worse than no
 * comment: it is the kind of thing that stops the next person looking.
 *
 * The `stroke`, `animate` and `preserveAspectRatio` props went with it, for a
 * different reason: the call site passed none of them, so each one's default was
 * the entire behaviour and the prop was decoration. What is left — `className`,
 * `opacity`, `delay` — is exactly the set of things that differ between call
 * sites, which is the whole interface.
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
  opacity = 0.5,
  delay = 0,
}: {
  className?: string;
  opacity?: number;
  delay?: number;
}) {
  const top = ARC_TOP - 14;

  const common = {
    fill: "none",
    stroke: "var(--ochre)",
    // 1.7 user units renders at ~2px on a desktop court (the drawing scales
    // at 1.198 there) and ~1.45px on a 320px one. It is 1.7 rather than 2
    // because the stroke is no longer pinned — see the note below.
    strokeWidth: 1.7,
    // `vector-effect: non-scaling-stroke` used to live here. It MUST NOT come
    // back. Chromium computes `stroke-dasharray` in SCREEN space when the
    // stroke is non-scaling, so the dash that Framer's `pathLength` reveal
    // leaves behind (`1px, 1px` with `pathLength="1"`) under-covers the path.
    // The free-throw circle rendered with a gap across its upper-right
    // quadrant — roughly the last quarter of the path — and every other line
    // was short by the same fraction, just invisibly, because their endpoints
    // coincide with a corner or the frame edge.
    //
    // Verified in Chromium: dash `1 1` + non-scaling-stroke leaves the gap;
    // dash `1 1` without it draws the full circumference. The trade is that
    // line weight now scales with the drawing instead of being constant,
    // which is why `strokeWidth` is tuned to 1.7 above.
  };

  /**
   * The reveal props for line `i`, staggered by a tenth of a second each.
   *
   * Lines 4 (backboard and rim) share an index deliberately, so the two move as
   * one gesture rather than a beat apart.
   */
  const draw = (i: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: {
      duration: 1.5,
      ease: EASE_PAINT,
      delay: delay + i * 0.1,
    },
  });

  return (
    <svg
      aria-hidden
      viewBox={`0 ${top} ${W} ${H - top}`}
      className={className}
      style={{ opacity }}
      preserveAspectRatio="xMidYMax meet"
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
    </svg>
  );
}
