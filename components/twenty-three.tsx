"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { NUMBER } from "@/lib/lebron-data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { Caption, PaintRule, RiseLine } from "@/components/typeset";

/**
 * Twenty-three.
 *
 * The quiet section, deliberately: the hero already spent the page's boldness,
 * so this one is a single colossal numeral, two paragraphs, and the honest
 * detail that the number was not actually constant — 23, then 6, then 23
 * again. No rotating ring of text, which is what used to sit here.
 */
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
      className="on-paint relative flex min-h-[100svh] items-center overflow-clip bg-wine px-5 py-24 text-chalk sm:px-8 md:px-14"
    >
      {/* the numeral, cropped by the edge of the floor */}
      <motion.span
        aria-hidden
        className="figure pointer-events-none absolute -right-[8vw] top-1/2 -translate-y-1/2 select-none text-chalk"
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
