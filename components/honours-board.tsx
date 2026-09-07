"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";

import {
  HARDWARE,
  HONOURS,
  NEXT_MARK,
  STATS_AS_OF,
  type Honour,
} from "@/lib/lebron-data";
import { EASE_PAINT, EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { Caption, Counter, PaintRule, RiseWords } from "@/components/typeset";

/**
 * Hardware — the honours ledger.
 *
 * Not a card grid. Honours are a list, so they are typeset as one: a column
 * of figures against a column of description, ruled off from each other. The
 * two heaviest facts break out of the ledger and into the paint, full bleed,
 * because they are the two that are genuinely unprecedented.
 */

function LedgerRow({ honour, index }: { honour: Honour; index: number }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-x-8 gap-y-2 py-7 sm:grid-cols-[minmax(5rem,8rem)_1fr] sm:py-9"
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT_SOON}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
    >
      <motion.div
        className="figure text-wine"
        style={{ fontSize: "clamp(3.25rem, 7vw, 5rem)" }}
        variants={{
          hidden: { opacity: 0, x: -28 },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.65, ease: EASE_SETTLE },
          },
        }}
      >
        {honour.value === null ? (
          honour.display
        ) : (
          <Counter
            to={honour.value}
            suffix={honour.suffix ?? ""}
            duration={1.6 + index * 0.1}
          />
        )}
      </motion.div>

      <motion.div
        className="flex flex-col gap-2 sm:pt-3"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.7, ease: EASE_SETTLE } },
        }}
      >
        <h3 className="headline text-[1.5rem] text-wine sm:text-[1.875rem]">
          {honour.label}
        </h3>
        <p className="prose-copy max-w-[52ch] text-[1rem] text-muted">
          {honour.context}
        </p>
      </motion.div>
    </motion.div>
  );
}

function PaintBlock({ honour }: { honour: Honour }) {
  return (
    <motion.div
      className="on-paint relative my-4 origin-left overflow-hidden bg-wine text-chalk"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE_PAINT }}
    >
      <motion.div
        className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-14 sm:px-8 sm:py-20 md:px-14"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: EASE_SETTLE, delay: 0.45 }}
      >
        <span
          className="figure text-chalk"
          style={{ fontSize: "clamp(4.5rem, 15vw, 11rem)" }}
        >
          {honour.value === null ? (
            honour.display
          ) : (
            <Counter
              to={honour.value}
              suffix={honour.suffix ?? ""}
              duration={2.4}
            />
          )}
        </span>
        <h3 className="headline text-[1.75rem] text-chalk sm:text-[2.5rem]">
          {honour.label}
        </h3>
        <p
          className="prose-copy max-w-[46ch] text-[1.0625rem]"
          style={{ color: "var(--chalk-dim)" }}
        >
          {honour.context}
        </p>
      </motion.div>
    </motion.div>
  );
}

function NextMark() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT_SOON);
  const pct = Math.min(1, NEXT_MARK.current / NEXT_MARK.target);

  return (
    <div ref={ref} className="pt-14">
      <PaintRule color="var(--rule-strong)" />
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pt-8">
        <h3 className="headline max-w-[18ch] text-[1.5rem] text-wine sm:text-[1.875rem]">
          {NEXT_MARK.heading}
        </h3>
        <Caption className="text-muted">As of {STATS_AS_OF}</Caption>
      </div>

      {/* a measure marked out on the floor rather than a progress bar */}
      <div className="mt-10">
        <div className="relative h-9">
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-rule-strong" />
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-[10px] origin-left bg-wine"
            style={{ width: `${pct * 100}%` }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.5, ease: EASE_PAINT, delay: 0.2 }}
          />
          <span
            aria-hidden
            className="absolute bottom-0 h-9 w-[2px] bg-wine"
            style={{ left: `calc(${pct * 100}% - 1px)` }}
          />
          <span aria-hidden className="absolute bottom-0 right-0 h-6 w-[2px] bg-rule-strong" />
        </div>
        <div className="mt-3 flex items-start justify-between gap-6">
          <Caption bold className="text-wine">
            {NEXT_MARK.currentLabel}
          </Caption>
          <p className="prose-copy hidden max-w-[34ch] text-center text-[0.9375rem] text-muted sm:block">
            {NEXT_MARK.note}
          </p>
          <Caption className="text-muted">{NEXT_MARK.targetLabel}</Caption>
        </div>
        <p className="prose-copy mt-4 max-w-[40ch] text-[0.9375rem] text-muted sm:hidden">
          {NEXT_MARK.note}
        </p>
      </div>
    </div>
  );
}

export function HonoursBoard() {
  // Order comes straight from the data, which alternates deliberately:
  // three ruled rows, the points block, two rows, the scoring block.
  return (
    <section
      id="hardware"
      aria-labelledby="hardware-heading"
      className="floor relative py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-14">
        <h2
          id="hardware-heading"
          className="monument text-wine"
          style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}
        >
          <RiseWords text={HARDWARE.heading} />
        </h2>
        <motion.p
          className="prose-copy mt-6 max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_SOON}
          transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.25 }}
        >
          {HARDWARE.standfirst}
        </motion.p>
      </div>

      <div className="mt-12">
        {HONOURS.map((honour, i) =>
          honour.weight === "block" ? (
            <PaintBlock key={honour.id} honour={honour} />
          ) : (
            <div
              key={honour.id}
              className="mx-auto max-w-6xl px-5 sm:px-8 md:px-14"
            >
              <PaintRule delay={0.05} />
              <LedgerRow honour={honour} index={i} />
            </div>
          ),
        )}
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 md:px-14">
        <NextMark />
      </div>
    </section>
  );
}
