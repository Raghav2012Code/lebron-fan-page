"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  LEDGER,
  LEDGER_INTRO,
  STATS_AS_OF,
  TEAM_SPANS,
  type LedgerEntry,
  type Metric,
} from "@/lib/lebron-data";
import { EASE_PAINT, EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Caption, Counter, PaintRule, RiseWords } from "@/components/typeset";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * The points, added up.
 *
 * The old version of this section put a radar chart here scored on an
 * invented "editorial index". That has been removed: nothing on this page
 * should be a number somebody made up. In its place is the one shape the
 * career actually makes — every point accumulating across four
 * stints, drawn to scale, with the running total marked at each handover.
 */

const decimalsFor = (v: number) => (Number.isInteger(v) ? 0 : 1);

/** Only the four NBA stints contribute to the scoring total. */
const STINTS = LEDGER.filter(
  (e): e is LedgerEntry & { scored: number } => e.scored !== null,
);
const TOTAL = STINTS.reduce((sum, e) => sum + e.scored, 0);

function colourFor(id: string) {
  return TEAM_SPANS.find((t) => t.id === id)?.floor ?? "var(--wine)";
}

function Accumulation({
  activeId,
  setActive,
}: {
  activeId: string;
  setActive: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <Caption bold className="text-wine">
          Every point, in the order it arrived
        </Caption>
        <Caption className="hidden text-muted sm:block">
          Regular season
        </Caption>
      </div>

      <motion.div
        className="mt-4 flex h-24 w-full overflow-hidden sm:h-28"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.14 } },
        }}
      >
        {STINTS.map((stint) => {
          const on = stint.id === activeId;
          return (
            <div
              key={stint.id}
              role="button"
              tabIndex={0}
              aria-label={`${stint.club}: ${stint.scored.toLocaleString("en-US")} points`}
              aria-pressed={on}
              onClick={() => setActive(stint.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(stint.id);
                }
              }}
              className={cn(
                "group relative min-w-0 cursor-pointer overflow-hidden transition-all duration-200",
                "hover:brightness-110",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine focus-visible:outline-offset-2 focus-visible:z-10",
              )}
              style={{ flexGrow: stint.scored, flexBasis: 0 }}
            >
              {/* only the paint scales, so the figure sitting on it never
                  gets squashed while the bar is being laid down */}
              <motion.span
                aria-hidden
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: colourFor(stint.id) }}
                variants={{
                  hidden: { scaleX: 0 },
                  show: {
                    scaleX: 1,
                    transition: { duration: 0.75, ease: EASE_PAINT },
                  },
                }}
              />
              {/* the selected stint is marked, not dimmed — the segments are
                  the data, and dimming data to show selection loses it */}
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[5px] bg-chalk"
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: 0.25, ease: EASE_SETTLE }}
              />
              <span className="absolute inset-x-2 bottom-2 truncate">
                <Caption
                  bold
                  className="text-chalk transition-opacity duration-200 group-hover:opacity-100"
                  style={{ opacity: on ? 1 : 0.72 }}
                >
                  {stint.scored.toLocaleString("en-US")}
                </Caption>
              </span>
            </div>
          );
        })}
      </motion.div>

      {/* the running total at each handover */}
      <div className="mt-2 flex w-full">
        {STINTS.map((stint) => (
          <div
            key={stint.id}
            className="min-w-0 border-r border-rule-strong pr-2 text-right last:border-r-0 last:pr-0"
            style={{ flexGrow: stint.scored, flexBasis: 0 }}
          >
            <Caption className="block truncate text-muted">
              {stint.running.value.toLocaleString("en-US")}
              {stint.running.suffix ?? ""}
            </Caption>
          </div>
        ))}
      </div>

      <Caption className="mt-3 block text-muted/80">
        {TOTAL.toLocaleString("en-US")} across the four stints, which is the
        career total exactly. Nothing here is rounded to make it land.
      </Caption>
    </div>
  );
}

function MetricLine({ metric }: { metric: Metric }) {
  const fill = Math.max(0, Math.min(1, metric.value / metric.max));
  return (
    <motion.div
      className="flex flex-col gap-2"
      variants={{
        hidden: { opacity: 0, x: -20 },
        show: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.55, ease: EASE_SETTLE },
        },
      }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex items-baseline gap-2">
          <Caption bold className="text-wine">
            {metric.label}
          </Caption>
          {metric.approx ? (
            <Caption className="text-[0.6875rem] text-muted/80">
              approx.
            </Caption>
          ) : null}
        </span>
        <span className="figure text-[1.75rem] text-wine sm:text-[2rem]">
          <Counter
            to={metric.value}
            decimals={decimalsFor(metric.value)}
            suffix={metric.suffix ?? ""}
            duration={1.5}
          />
        </span>
      </div>
      <div className="relative h-[6px] w-full bg-rule">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left bg-wine"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: fill }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.1, ease: EASE_PAINT, delay: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

function LedgerPanel({ entry }: { entry: LedgerEntry }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-2"
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.15 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      <div className="flex flex-col gap-8">
        <motion.div
          variants={{
            hidden: { opacity: 0, x: -20 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.55, ease: EASE_SETTLE },
            },
          }}
        >
          <h3 className="headline text-[1.875rem] text-wine sm:text-[2.5rem]">
            {entry.club}
          </h3>
          <Caption className="mt-2 block text-muted">
            {entry.place}, {entry.years}
          </Caption>
        </motion.div>

        <div className="flex flex-col gap-7">
          {entry.metrics.map((m) => (
            <MetricLine key={m.label} metric={m} />
          ))}
        </div>

        <motion.div
          className="mt-1"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.6 } },
          }}
        >
          <PaintRule color="var(--rule-strong)" />
          <span
            className="figure mt-5 block text-wine"
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}
          >
            <Counter
              to={entry.running.value}
              suffix={entry.running.suffix ?? ""}
              duration={2}
            />
          </span>
          <Caption className="mt-2 block text-muted">
            {entry.running.label}
          </Caption>
        </motion.div>
      </div>

      <div className="flex flex-col gap-8">
        <motion.dl
          className="flex flex-col"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {entry.achievements.map((a) => (
            <motion.div
              key={`${a.when}-${a.what}`}
              className="flex items-baseline gap-5 border-b border-rule py-3.5 last:border-b-0"
              variants={{
                hidden: { opacity: 0, x: -16 },
                show: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.45, ease: EASE_SETTLE },
                },
              }}
            >
              <dt className="w-[6.5rem] shrink-0">
                <Caption className="text-muted">{a.when}</Caption>
              </dt>
              <dd>
                <Caption bold className="text-wine">
                  {a.what}
                </Caption>
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        <motion.p
          className="prose-copy max-w-[42ch] text-[1.0625rem] italic text-muted"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: 0.6 } },
          }}
        >
          {entry.note}
        </motion.p>
      </div>

      {/* A plain data equivalent for screen readers. Wrapped so the table,
          which sizes to its content, is clipped rather than widening the
          page. */}
      <div className="sr-only">
        <table>
          <caption>
            {entry.club}, {entry.years}: key figures
          </caption>
          <tbody>
            {entry.metrics.map((m) => (
              <tr key={m.label}>
                <th scope="row">{m.label}</th>
                <td>
                  {m.value}
                  {m.suffix ?? ""}
                  {m.approx ? " (approximate)" : ""}
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row">{entry.running.label}</th>
              <td>
                {entry.running.value}
                {entry.running.suffix ?? ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function TheLedger() {
  const [active, setActive] = React.useState(LEDGER[0].id);

  return (
    <section
      id="ledger"
      aria-labelledby="ledger-heading"
      className="floor relative px-5 py-20 sm:px-8 sm:py-28 md:px-14"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="ledger-heading"
          className="monument max-w-[13ch] text-wine"
          style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
        >
          <RiseWords text={LEDGER_INTRO.heading} />
        </h2>
        <motion.p
          className="prose-copy mt-6 max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_SOON}
          transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.25 }}
        >
          {LEDGER_INTRO.copy} As of {STATS_AS_OF}.
        </motion.p>

        <div className="mt-14">
          <Accumulation activeId={active} setActive={setActive} />
        </div>

        <div className="mt-16">
          <Tabs value={active} onValueChange={setActive}>
            <TabsList>
              {LEDGER.map((e) => (
                <TabsTrigger key={e.id} value={e.id}>
                  <span className="relative z-10">{e.tab}</span>
                  {active === e.id ? (
                    <motion.span
                      layoutId="ledger-underline"
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-[3px] bg-wine",
                      )}
                      transition={{ type: "spring", stiffness: 340, damping: 32 }}
                    />
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>

            {LEDGER.map((e) => (
              <TabsContent key={e.id} value={e.id}>
                <LedgerPanel entry={e} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
