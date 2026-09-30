"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { HERO } from "@/lib/data";
import { EASE_PAINT, EASE_SETTLE, stagger } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { COURT_PAINT_ASPECT, CourtDiagram } from "@/components/court-diagram";
import { Caption, Kicker, PaintedName, type Opener } from "@/components/typeset";

/**
 * Opener: `device` -- The hero court and the painted name. No heading stack above it -- the court is the first thing on the page.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "device";

/**
 * The hero. One idea, executed once: the name straddles the paint line.
 * LEBRON sits on bare maple in wine; JAMES is inside the painted key and
 * reverses to chalk. The court is drawn to scale behind it, and the whole
 * thing lays itself down in a single sequence on load — court lines, then
 * the paint, then the lettering, then the figures.
 */
export function CenterCourt() {
  const ref = React.useRef<HTMLElement>(null);
  // The scroll affordance pulses forever. `reducedMotion="user"` cannot stop
  // it: that only snaps transform keys, so the opacity pulse runs untouched.
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const courtY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const nameSize = { fontSize: "clamp(3.1rem, 13.5vw, 12rem)" };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-name"
      className="floor relative flex min-h-[92svh] w-full flex-col justify-between overflow-clip pt-12 pb-6 sm:pt-16 sm:pb-8"
    >
      {/* The painted end of a court, drawn to scale and anchored bottom
          right, running off the edge of the frame the way a floor does. The
          wine band crosses it on purpose: that is paint over hardwood.

          Sized by HEIGHT as a fraction of the section, with the width derived
          from the court's own aspect ratio. Both halves of that matter: the
          band's position is driven by the hero's content flow, so a
          height-fraction is the only unit that stays in step with it; and the
          previous width-based box measured 0.77-1.29 aspect against the
          drawing's 1.645, which letterboxed the court and let the opaque
          full-width band swallow the arc apex and the top half of the
          free-throw circle. `h-[40%]` keeps the whole court clear of the band
          at every breakpoint. */}
      <motion.div
        className="pointer-events-none absolute bottom-0 -right-[12%] h-[30%] opacity-30 sm:-right-[8%] sm:h-[40%] sm:opacity-50 lg:-right-[3%] lg:h-[40%] lg:opacity-100"
        style={{ y: courtY, aspectRatio: COURT_PAINT_ASPECT }}
      >
        <CourtDiagram className="h-full w-full" opacity={0.6} delay={0.15} />
      </motion.div>

      <motion.div
        className="relative z-10 my-auto w-full"
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
            <PaintedName word={HERO.first} baseDelay={0.05} perLetter={0.03} />
          </motion.span>

          {/* inside the paint — full bleed, so it reads as an area of floor
              rather than a card sitting on top of one */}
          <motion.span
            className="mt-2 block origin-left bg-wine py-3 sm:py-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: EASE_PAINT, delay: 0.3 }}
          >
            <motion.span
              className="monument block px-5 text-chalk sm:px-8 md:px-14"
              style={nameSize}
              initial="hidden"
              animate="show"
            >
              <PaintedName word={HERO.last} baseDelay={0.42} perLetter={0.03} />
            </motion.span>
          </motion.span>
        </h1>

        <div className="px-5 sm:px-8 md:px-14">
          <motion.p
            className="prose-copy mt-8 max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_SETTLE, delay: 0.55 }}
          >
            {HERO.standfirst}
          </motion.p>

          <motion.dl
            className="mt-10 flex flex-wrap gap-x-12 gap-y-6 sm:gap-x-20"
            initial="hidden"
            animate="show"
            variants={stagger(0.08, 0.6)}
          >
            {HERO.figures.map((f) => (
              <motion.div
                key={f.label}
                className="flex flex-col gap-1.5 [&>dt]:order-2 [&>dd]:order-1"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: EASE_SETTLE },
                  },
                }}
              >
                {/* `dt` must precede `dd` in the HTML content model. The
                    figure is still displayed above the label via `order`. */}
                <dt className="order-2">
                  <Caption className="text-muted">{f.label}</Caption>
                </dt>
                <dd className="figure order-1 text-[2.75rem] text-wine sm:text-[3.5rem]">
                  {f.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </motion.div>

      {/* Subtle hardwood scroll affordance indicator */}
      <motion.div
        className="relative z-10 w-full px-5 pt-8 sm:px-8 md:px-14"
        style={{ opacity: indicatorOpacity }}
      >
        <motion.a
          href="#span"
          onClick={(e) => {
            const spanEl = document.getElementById("span");
            if (spanEl) {
              e.preventDefault();
              // See back-to-top: an explicit "smooth" beats the stylesheet's
              // reduced-motion `scroll-behavior: auto`, so choose here.
              spanEl.scrollIntoView({
                behavior: reduce ? "auto" : "smooth",
              });
            }
          }}
          aria-label="Scroll down to explore career span"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_SETTLE, delay: 0.7 }}
          className="group inline-flex flex-col items-start gap-2.5 outline-offset-4"
        >
          <div className="flex items-center gap-2.5">
            <motion.span
              className="inline-block h-1.5 w-1.5 bg-wine"
              data-reveal-loop=""
              animate={
                reduce
                  ? { opacity: 1, scale: 1 }
                  : { opacity: [0.35, 1, 0.35], scale: [0.85, 1, 0.85] }
              }
              transition={{
                duration: 2.4,
                repeat: reduce ? 0 : Infinity,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            />
            <Kicker className="text-[0.8125rem] transition-colors group-hover:text-wine">
              Scroll to explore
            </Kicker>
          </div>
          {/* Animated hairline floor seam */}
          <div className="relative ml-[3px] h-7 w-px overflow-hidden bg-wine/20">
            <motion.div
              className="h-3 w-full bg-wine/60"
              data-reveal-loop=""
              animate={reduce ? { y: 0 } : { y: [-12, 28] }}
              transition={{
                duration: 1.8,
                repeat: reduce ? 0 : Infinity,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            />
          </div>
        </motion.a>
      </motion.div>
    </section>
  );
}
