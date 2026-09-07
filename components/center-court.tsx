"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { HERO } from "@/lib/lebron-data";
import { EASE_PAINT, EASE_SETTLE, stagger } from "@/lib/motion";
import { CourtDiagram } from "@/components/court-diagram";
import { Caption, PaintedName } from "@/components/typeset";

/**
 * The hero. One idea, executed once: the name straddles the paint line.
 * LEBRON sits on bare maple in wine; JAMES is inside the painted key and
 * reverses to chalk. The court is drawn to scale behind it, and the whole
 * thing lays itself down in a single sequence on load — court lines, then
 * the paint, then the lettering, then the figures.
 */
export function CenterCourt() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const courtY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const nameSize = { fontSize: "clamp(3.1rem, 13.5vw, 12rem)" };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-name"
      className="floor relative flex min-h-[92svh] w-full flex-col justify-center overflow-clip"
    >
      {/* The painted end of a court, drawn to scale and anchored bottom
          right, running off the edge of the frame the way a floor does. The
          wine band crosses it on purpose: that is paint over hardwood. */}
      <motion.div
        className="pointer-events-none absolute -right-[22%] bottom-0 h-[62%] w-[110%] opacity-30 sm:-right-[10%] sm:w-[78%] sm:opacity-50 lg:-right-[4%] lg:h-[68%] lg:w-[56%] lg:opacity-100"
        style={{ y: courtY }}
      >
        <CourtDiagram className="h-full w-full" opacity={0.6} delay={0.15} />
      </motion.div>

      <motion.div
        className="relative z-10 w-full"
        style={{ y: nameY }}
        initial="hidden"
        animate="show"
        variants={stagger(0.06)}
      >
        <div className="px-5 sm:px-8 md:px-14">
          <motion.div
            className="flex flex-col gap-0.5"
            variants={stagger(0.08, 0.2)}
          >
            {HERO.meta.map((line) => (
              <motion.span
                key={line}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.6, ease: EASE_SETTLE },
                  },
                }}
              >
                <Caption className="text-muted">{line}</Caption>
              </motion.span>
            ))}
          </motion.div>
        </div>

        <h1 id="hero-name" aria-label="LeBron James" className="mt-6">
          {/* on bare maple */}
          <motion.span
            className="monument block px-5 text-wine sm:px-8 md:px-14"
            style={nameSize}
            initial="hidden"
            animate="show"
          >
            <PaintedName word={HERO.first} baseDelay={0.55} />
          </motion.span>

          {/* inside the paint — full bleed, so it reads as an area of floor
              rather than a card sitting on top of one */}
          <motion.span
            className="mt-2 block origin-left bg-wine py-3 sm:py-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.85, ease: EASE_PAINT, delay: 0.95 }}
          >
            <motion.span
              className="monument block px-5 text-chalk sm:px-8 md:px-14"
              style={nameSize}
              initial="hidden"
              animate="show"
            >
              <PaintedName word={HERO.last} baseDelay={1.35} />
            </motion.span>
          </motion.span>
        </h1>

        <div className="px-5 sm:px-8 md:px-14">
          <motion.p
            className="prose-copy mt-8 max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_SETTLE, delay: 1.75 }}
          >
            {HERO.standfirst}
          </motion.p>

          <motion.dl
            className="mt-10 flex flex-wrap gap-x-12 gap-y-6 sm:gap-x-20"
            initial="hidden"
            animate="show"
            variants={stagger(0.11, 2)}
          >
            {HERO.figures.map((f) => (
              <motion.div
                key={f.label}
                className="flex flex-col gap-1.5"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.65, ease: EASE_SETTLE },
                  },
                }}
              >
                <dd className="figure text-[2.75rem] text-wine sm:text-[3.5rem]">
                  {f.value}
                </dd>
                <dt>
                  <Caption className="text-muted">{f.label}</Caption>
                </dt>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>
    </section>
  );
}
