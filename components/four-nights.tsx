"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { NIGHTS, NIGHTS_INTRO, type Night } from "@/lib/lebron-data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { RiseWords } from "@/components/typeset";

/**
 * Four nights.
 *
 * These four are a chronology, so they get years rather than the invented
 * 01 / 02 / 03 markers this section used to carry. They are also not four
 * equivalent things, so they are not four equivalent cards: each one is a
 * full-width band, alternating maple and paint, with the year set out in the
 * margin where a dateline belongs.
 */

function NightBand({ night, index }: { night: Night; index: number }) {
  const onPaint = index % 2 === 1;

  return (
    <motion.article
      className={cn(
        "relative",
        onPaint ? "on-paint bg-wine text-chalk" : "floor text-wine",
      )}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_SOON}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-14 gap-y-4 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(9rem,14rem)_1fr] md:px-14">
        <motion.span
          className="figure leading-none"
          style={{
            fontSize: "clamp(3.5rem, 9vw, 6.5rem)",
            color: onPaint ? "var(--gold)" : "var(--ochre)",
          }}
          variants={{
            hidden: { opacity: 0, x: -40 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.75, ease: EASE_SETTLE },
            },
          }}
        >
          {night.year}
        </motion.span>

        <div className="flex flex-col gap-4 lg:pt-3">
          <motion.h3
            className="headline text-[1.875rem] sm:text-[2.5rem]"
            variants={{
              hidden: { opacity: 0, x: -24 },
              show: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.65, ease: EASE_SETTLE },
              },
            }}
          >
            {night.title}
          </motion.h3>
          <motion.p
            className="prose-copy text-[1.0625rem] sm:text-lg"
            style={{ color: onPaint ? "var(--chalk-dim)" : "var(--muted)" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { duration: 0.8, ease: EASE_SETTLE },
              },
            }}
          >
            {night.copy}
          </motion.p>
        </div>
      </div>
    </motion.article>
  );
}

export function FourNights() {
  return (
    <section id="nights" aria-labelledby="nights-heading" className="relative">
      <div className="floor px-5 pb-14 pt-20 sm:px-8 sm:pt-28 md:px-14">
        <div className="mx-auto max-w-6xl">
          <h2
            id="nights-heading"
            className="monument text-wine"
            style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}
          >
            <RiseWords text={NIGHTS_INTRO.heading} />
          </h2>
          <motion.p
            className="prose-copy mt-6 max-w-[40ch] text-[1.0625rem] text-muted sm:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_SOON}
            transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.25 }}
          >
            {NIGHTS_INTRO.copy}
          </motion.p>
        </div>
      </div>

      <div>
        {NIGHTS.map((night, i) => (
          <NightBand key={night.year} night={night} index={i} />
        ))}
      </div>
    </section>
  );
}
