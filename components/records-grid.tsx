"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";

import {
  NEXT_MARK,
  RECORDS,
  STATS_AS_OF,
  type Accent,
  type RecordCard,
} from "@/lib/lebron-data";
import {
  DUR,
  EASE_OUT,
  fadeUp,
  makeStagger,
  VIEWPORT,
  VIEWPORT_SOON,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Counter, SectionLabel, SplitText } from "@/components/kinetic";

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
const accentHover: Record<Accent, string> = {
  gold: "group-hover:border-gold/60",
  "gold-bright": "group-hover:border-gold-bright/60",
  red: "group-hover:border-red/60",
  paper: "group-hover:border-paper/40",
};

const spanClass: Record<RecordCard["span"], string> = {
  sm: "col-span-1 md:col-span-2 lg:col-span-2",
  md: "col-span-2 md:col-span-2 lg:col-span-2",
  lg: "col-span-2 md:col-span-4 lg:col-span-4",
};

function RecordTile({ card }: { card: RecordCard }) {
  const big = card.span === "lg";
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative flex min-h-[13rem] flex-col justify-between overflow-hidden border border-hairline bg-ink/40 p-5 transition-colors sm:min-h-[15rem] sm:p-6",
        accentHover[card.accent],
        spanClass[card.span],
        big && "sm:min-h-[18rem]",
      )}
    >
      {/* drawn accent rule */}
      <motion.span
        aria-hidden
        className={cn("absolute left-0 top-0 h-[3px] w-full origin-left", accentBar[card.accent])}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: DUR.slow, ease: EASE_OUT }}
      />

      {/* faint geometric mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-8 select-none font-mono text-[9rem] leading-none text-paper/[0.03]"
      >
        {card.index}
      </span>

      <div className="flex items-center justify-between">
        <span className="label text-muted">{card.index}</span>
        <span className={cn("h-1.5 w-1.5 rounded-full", accentBar[card.accent])} aria-hidden />
      </div>

      <div className="relative z-10">
        <div
          className={cn("font-display leading-none", accentText[card.accent])}
          style={{ fontSize: big ? "clamp(4.5rem, 12vw, 9rem)" : "clamp(3rem, 7vw, 5.5rem)" }}
        >
          {card.value === null ? (
            <span>{card.display}</span>
          ) : (
            <Counter to={card.value} suffix={card.suffix ?? ""} duration={2} />
          )}
        </div>
        <h3 className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-paper">
          {card.label}
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
          {card.context}
        </p>
      </div>
    </motion.article>
  );
}

function NextMarkPanel() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, VIEWPORT_SOON);
  const pct = Math.min(1, NEXT_MARK.current / NEXT_MARK.target);

  return (
    <motion.article
      ref={ref}
      variants={fadeUp}
      className="col-span-2 flex flex-col gap-6 border border-hairline bg-wine/30 p-6 md:col-span-4 lg:col-span-6 sm:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="label text-gold">{NEXT_MARK.title}</span>
          <h3 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
            {NEXT_MARK.metric}
          </h3>
        </div>
        <span className="label text-muted">AS OF {STATS_AS_OF}</span>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="font-display leading-none text-gold-bright" style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}>
          <Counter to={NEXT_MARK.current} suffix="+" duration={2.2} />
        </div>
        <div className="text-right font-display leading-none text-muted/60" style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
          {NEXT_MARK.target.toLocaleString("en-US")}
        </div>
      </div>

      {/* progress bar */}
      <div className="relative h-3 w-full overflow-hidden border border-hairline">
        <motion.div
          className="absolute inset-y-0 left-0 origin-left bg-gold"
          style={{ width: `${pct * 100}%` }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.2 }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="label text-paper">{NEXT_MARK.currentLabel}</span>
        <p className="hidden max-w-sm text-right text-sm text-muted sm:block">
          {NEXT_MARK.note}
        </p>
        <span className="label text-muted">{NEXT_MARK.targetLabel}</span>
      </div>
    </motion.article>
  );
}

export function RecordsGrid() {
  return (
    <section
      id="records"
      aria-labelledby="records-heading"
      className="relative border-t border-hairline px-5 py-20 sm:px-8 sm:py-28 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <SectionLabel className="mb-10">01 — HONOURS &amp; RECORDS</SectionLabel>

        <h2
          id="records-heading"
          className="mb-14 max-w-5xl font-display leading-[0.86]"
          style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)" }}
        >
          <SplitText text="THE NUMBERS" className="text-paper" />
          <br />
          <SplitText text="DON'T ARGUE" className="type-outline [--stroke-c:var(--gold)] [--stroke-w:1.5px]" delay={0.1} />
        </h2>

        <motion.div
          className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6"
          variants={makeStagger(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {RECORDS.map((card) => (
            <RecordTile key={card.index} card={card} />
          ))}
          <NextMarkPanel />
        </motion.div>
      </div>
    </section>
  );
}
