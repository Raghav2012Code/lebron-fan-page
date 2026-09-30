"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { CAREER, STATS_AS_OF } from "@/lib/data";
import { EASE_PAINT, EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { Caption, Counter, PaintRule, type Opener } from "@/components/typeset";

/**
 * Opener: `written-line` -- Opens on the painted band with the stat line itself as the display; the heading is its label.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "written-line";

export function TheLine() {
  return (
    <section
      id="line"
      aria-labelledby="line-heading"
      className="scroll-clearance floor relative py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-14">
        <motion.p
          className="prose-copy max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_SOON}
          transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.25 }}
        >
          {CAREER.standfirst}
        </motion.p>
      </div>

      {/* the slash line, in the paint */}
      <motion.div
        className="on-paint relative mt-10 origin-left overflow-hidden bg-wine text-chalk"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE_PAINT }}
      >
        <motion.div
          className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20 md:px-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: EASE_SETTLE, delay: 0.45 }}
        >
          {/* Opener: written-line. The heading is the stat line, so the
              heading is set as the line's own label inside the band rather than
              as a colossal monument stacked above it with a standfirst
              between. Nothing on maple comes first — the section opens on the
              painted band, which is a silhouette no other section uses (F-01).
              The heading is still a real <h2>: a screen reader gets "The line"
              as the section name, and the figures below keep their <dl>. */}
          <h2
            id="line-heading"
            className="narrow border-b border-rule-chalk/30 pb-4 text-chalk-dim"
          >
            {CAREER.heading}
          </h2>
          <dl className="mt-10 flex flex-row items-start gap-3 sm:gap-0 lg:gap-x-14">
            {CAREER.headline.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div className="flex min-w-0 flex-1 flex-col lg:flex-none">
                  {/* `dt` must come first in the HTML content model for a
                      `dl`; the figure is still displayed above it via
                      `order`. Emitting `dd` first announces a dangling
                      number before its label.

                      Every child needs an explicit `order`. The rule and the
                      career total are siblings of the `dt`/`dd` pair, not
                      children of either, so they defaulted to `order: 0` and
                      flex put them FIRST — the total rendered above the figure
                      it belongs to, contradicting this component's own
                      docstring ("the totals hung underneath each figure").
                      The reading order is now figure, label, rule, total. */}
                  <dt className="order-2 mt-4">
                    <Caption bold className="block text-chalk">
                      {stat.label}
                    </Caption>
                    <Caption
                      className="block"
                      style={{ color: "var(--chalk-dim)" }}
                    >
                      per game
                    </Caption>
                  </dt>
                  {/* the slash travels with its own figure rather than
                      sitting on the column edge, so the three read as one
                      written stat line however wide the columns get */}
                  <dd
                    className="figure order-1 flex items-baseline leading-none text-chalk"
                    style={{ fontSize: "clamp(2rem, 10vw, 7.5rem)" }}
                  >
                    <Counter to={stat.avg} decimals={1} duration={1.8} />
                    {i < CAREER.headline.length - 1 ? (
                      <span
                        aria-hidden
                        className="select-none pl-2 text-gold-ink sm:pl-5"
                      >
                        /
                      </span>
                    ) : null}
                  </dd>

                  <span
                    aria-hidden
                    className="order-3 mt-5 block h-px w-full max-w-[9rem] bg-gold"
                  />
                  <Caption bold className="order-4 mt-4 block text-gold-ink">
                    {stat.total.toLocaleString("en-US")} in total
                  </Caption>
                  {stat.rank ? (
                    <Caption
                      className="order-5 mt-1 block"
                      style={{ color: "var(--chalk-dim)" }}
                    >
                      {stat.rank}
                    </Caption>
                  ) : null}
                </div>
              </React.Fragment>
            ))}
          </dl>
        </motion.div>
      </motion.div>

      {/* everything else the record holds */}
      <div className="mx-auto mt-16 max-w-6xl px-5 sm:px-8 md:px-14">
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <motion.dl
            className="flex flex-col"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_SOON}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {CAREER.supporting.map((row) => (
              <motion.div
                key={row.label}
                className="flex items-baseline justify-between gap-6 border-b border-rule py-4 last:border-b-0"
                variants={{
                  hidden: { opacity: 0, x: -18 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: EASE_SETTLE },
                  },
                }}
              >
                <dt className="min-w-0">
                  <Caption bold className="block text-wine">
                    {row.label}
                  </Caption>
                  {row.note ? (
                    <Caption className="mt-0.5 block text-muted">
                      {row.note}
                    </Caption>
                  ) : null}
                </dt>
                <dd className="figure shrink-0 text-[1.625rem] text-wine sm:text-[2rem]">
                  {row.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <div className="flex flex-col gap-10">
            <div>
              <PaintRule color="var(--rule-strong)" />
              <Caption bold className="mt-5 block text-wine">
                {CAREER.playoffs.label}
              </Caption>
              <div className="mt-3 flex items-baseline gap-4">
                <span
                  className="figure text-wine"
                  style={{ fontSize: "clamp(2.75rem, 7vw, 4rem)" }}
                >
                  <Counter to={CAREER.playoffs.points} duration={2} />
                </span>
                <Caption className="text-muted">
                  points in {CAREER.playoffs.games} games
                </Caption>
              </div>
              <p className="prose-copy mt-4 max-w-[44ch] text-[1rem] text-muted">
                {CAREER.playoffs.copy}
              </p>
            </div>

            <div>
              <PaintRule color="var(--rule-strong)" />
              <p className="prose-copy mt-5 max-w-[42ch] text-[1.125rem] text-wine sm:text-[1.25rem]">
                {CAREER.triple}
              </p>
              <Caption className="mt-5 block text-muted">
                Official regular-season figures, through {STATS_AS_OF}.
              </Caption>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
