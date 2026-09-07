"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { LEGACY, type Accent } from "@/lib/lebron-data";
import { DUR, EASE_OUT, fadeUp, makeStagger, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionLabel, SplitText } from "@/components/kinetic";

const accentText: Record<Accent, string> = {
  gold: "text-gold",
  "gold-bright": "text-gold-bright",
  red: "text-red",
  paper: "text-paper",
};
const accentBar: Record<Accent, string> = {
  gold: "bg-gold",
  "gold-bright": "bg-gold-bright",
  red: "bg-red",
  paper: "bg-paper",
};

export function LegacyTimeline() {
  return (
    <section
      id="legacy"
      aria-labelledby="legacy-heading"
      className="relative border-t border-hairline bg-ink px-5 py-20 sm:px-8 sm:py-28 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <SectionLabel className="mb-10">06 — THE LEGACY</SectionLabel>
        <h2
          id="legacy-heading"
          className="mb-14 max-w-4xl font-display leading-[0.86]"
          style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)" }}
        >
          <SplitText text="ONE LAST" className="text-paper" />{" "}
          <SplitText text="RUN" className="type-outline [--stroke-c:var(--gold)] [--stroke-w:1.5px]" delay={0.1} />
        </h2>

        {/* drawn connector */}
        <motion.div
          className="mb-8 hidden h-px w-full origin-left bg-hairline lg:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        />

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={makeStagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {LEGACY.map((event) => (
            <motion.article
              key={event.year}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="group relative flex min-h-[20rem] flex-col justify-between overflow-hidden border border-hairline bg-ink/40 p-6 transition-colors hover:border-paper/30"
            >
              {/* drawn accent rule */}
              <motion.span
                aria-hidden
                className={cn("absolute left-0 top-0 h-[3px] w-full origin-left", accentBar[event.accent])}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: DUR.slow, ease: EASE_OUT, delay: 0.15 }}
              />

              {/* ghost year numeral */}
              <span
                aria-hidden
                className="font-display pointer-events-none absolute -bottom-8 -right-3 select-none leading-none text-paper/[0.04]"
                style={{ fontSize: "11rem" }}
              >
                {event.year.slice(-2)}
              </span>

              <div className="relative z-10">
                <span className={cn("font-mono text-sm tracking-[0.2em]", accentText[event.accent])}>
                  {event.year}
                </span>
                <h3 className="mt-4 font-display text-3xl leading-none text-paper sm:text-4xl">
                  <SplitText text={event.title} />
                </h3>
              </div>

              <p className="relative z-10 mt-6 text-sm leading-relaxed text-muted">
                {event.copy}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
