"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { CAREER, STATS_AS_OF } from "@/lib/lebron-data";
import { EASE_PAINT, EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { Caption, Counter, PaintRule, RiseWords } from "@/components/typeset";

/**
 * The line.
 *
 * A stat line is written the way basketball people say it out loud —
 * points / rebounds / assists — so that is exactly how it is set here, as one
 * slashed line in the paint with the totals hung underneath each figure.
 * Everything below it is official and exact; the per-season table these come
 * from sums to each of these totals in every category.
 */
export function TheLine() {
  return (
    <section
      id="line"
      aria-labelledby="line-heading"
      className="floor relative py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-14">
        <h2
          id="line-heading"
          className="monument text-wine"
          style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}
        >
          <RiseWords text={CAREER.heading} />
        </h2>
        <motion.p
          className="prose-copy mt-6 max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
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
        className="on-paint relative mt-12 origin-left overflow-hidden bg-wine text-chalk"
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
          <dl className="flex flex-row items-start gap-3 sm:gap-0 lg:gap-x-14">
            {CAREER.headline.map((stat, i) => (
              <React.Fragment key={stat.label}>
                <div className="flex min-w-0 flex-1 flex-col lg:flex-none">
                  {/* the slash travels with its own figure rather than
                      sitting on the column edge, so the three read as one
                      written stat line however wide the columns get */}
                  <dd
                    className="figure flex items-baseline leading-none text-chalk"
                    style={{ fontSize: "clamp(2rem, 10vw, 7.5rem)" }}
                  >
                    <Counter to={stat.avg} decimals={1} duration={1.8} />
                    {i < CAREER.headline.length - 1 ? (
                      <span
                        aria-hidden
                        className="select-none pl-2 text-gold sm:pl-5"
                      >
                        /
                      </span>
                    ) : null}
                  </dd>
                  <dt className="mt-4">
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

                  <span
                    aria-hidden
                    className="mt-5 block h-px w-full max-w-[9rem] bg-gold"
                  />
                  <Caption bold className="mt-4 block text-gold">
                    {stat.total.toLocaleString("en-US")} in total
                  </Caption>
                  {stat.rank ? (
                    <Caption
                      className="mt-1 block"
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
        <div className="grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[1.1fr_1fr]">
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
