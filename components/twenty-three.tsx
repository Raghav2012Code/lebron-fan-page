"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { NUMBER } from "@/lib/data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { Caption, PaintRule, RiseLine, type Opener } from "@/components/typeset";

/**
 * Twenty-three.
 *
 * The quiet section, deliberately: the hero already spent the page's boldness,
 * so this one is a single colossal numeral, two paragraphs, and the honest
 * detail that the number was not actually constant — 23, then 6, then 23
 * again. No rotating ring of text, which is what used to sit here.
 */
/**
 * Opener: `device` -- A colossal numeral bleeding off a full-viewport painted field.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "device";

export function TwentyThree() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const numeralY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <section
      ref={ref}
      id="number"
      aria-labelledby="number-heading"
      className="scroll-clearance on-paint relative flex min-h-[100svh] items-center overflow-clip bg-wine px-5 py-24 text-chalk sm:px-8 md:px-14"
    >
      {/* The numeral, cropped by the edge of the floor.

          F-13: this was `-right-[8vw]`, which cut the second digit off
          mid-glyph at every width, so it read as a rendering fault rather than
          a decision. Large ghosted numerals are themselves a familiar
          editorial tic, so the fix is to crop to a CLEAN edge — align the
          numeral's right edge to the section's own padding edge instead of
          pushing it off-canvas by a viewport-relative amount. `inset-y-0` plus
          `right-0` inside the padding box means the glyph stops exactly where
          the text column does.

          "at 320 and at 1440 alike" is what this used to claim, and it is only
          true of the BASE offset. The class is `right-0 sm:right-7 md:right-14`,
          so the numeral steps IN with the text column's own padding: flush below
          640px, 1.75rem in from `sm`, 3.5rem from `md` up. The point that
          survives is the narrower one — the offset is a REM constant stepped
          at the same two breakpoints as everything else, not a viewport-relative
          amount that scaled with the window. */}
      <motion.span
        aria-hidden
        className="figure pointer-events-none absolute inset-y-0 right-0 flex select-none items-center text-chalk sm:right-7 md:right-14"
        style={{
          y: numeralY,
          fontSize: "clamp(20rem, 46vw, 44rem)",
          opacity: 0.14,
        }}
      >
        {NUMBER.numeral}
      </motion.span>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <h2
          id="number-heading"
          className="monument text-chalk"
          style={{ fontSize: "clamp(2.75rem, 10vw, 8rem)" }}
        >
          <RiseLine>{NUMBER.spoken}</RiseLine>
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-2">
          {NUMBER.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className="prose-copy max-w-[48ch] text-[1.0625rem] sm:text-lg"
              style={{ color: "var(--chalk-dim)" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT_SOON}
              transition={{
                duration: 0.85,
                ease: EASE_SETTLE,
                delay: 0.15 + i * 0.12,
              }}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* what he actually wore, in order */}
        <div className="mt-16 max-w-2xl">
          <PaintRule color="var(--rule-chalk)" />
          <motion.dl
            className="mt-6 flex flex-col gap-5"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_SOON}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
            }}
          >
            {NUMBER.worn.map((w, i) => (
              <motion.div
                key={i}
                className="flex items-baseline gap-6"
                variants={{
                  hidden: { opacity: 0, x: -22 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.55, ease: EASE_SETTLE },
                  },
                }}
              >
                <dt className="figure w-[3.5ch] shrink-0 text-[2.5rem] text-gold sm:text-[3rem]">
                  {w.n}
                </dt>
                <dd>
                  <Caption style={{ color: "var(--chalk-dim)" }}>
                    {w.where}
                  </Caption>
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
