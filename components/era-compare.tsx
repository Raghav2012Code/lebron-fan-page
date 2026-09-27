"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  ERA_COMPARE_INTRO,
  PEAK_ERAS,
  type PeakEraProfile,
} from "@/lib/lebron-data";
import { cn } from "@/lib/utils";
import { Caption, Kicker, PaintRule, RiseWords, type Opener } from "@/components/typeset";

interface MetricRowProps {
  label: string;
  valA: number;
  valB: number;
  unit?: string;
  format?: (v: number) => string;
  higherIsBetter?: boolean;
}

/**
 * A single comparison row: label, the better value, the worse value, and the
 * gap between them.
 *
 * The face is `font-text`, not Tailwind's default sans utility. That default is
 * a system stack — `-apple-system, BlinkMacSystemFont, "Segoe UI", …` — which is
 * NOT the declared body face, and `AGENTS.md` §2 bans it precisely because it
 * silently introduces a third family. This table was therefore rendering in a
 * family that no grep for the monospace utility could see, because the defect
 * was a utility pointing at the wrong token rather than a raw monospace request.
 * Two families, full stop: `font-text` and `font-display`.
 *
 * The two utility names this comment used to spell out are deliberately absent.
 * Tailwind's candidate scanner does not skip comments, so naming a banned
 * utility in prose is enough to GENERATE it — see the `source(none)` block at the
 * top of `globals.css`. A comment warning against a utility must not ship it.
 */
function MetricRow({
  label,
  valA,
  valB,
  unit = "",
  format,
  higherIsBetter = true,
}: MetricRowProps) {
  const displayA = format ? format(valA) : `${valA}${unit}`;
  const displayB = format ? format(valB) : `${valB}${unit}`;

  const diff = +(valA - valB).toFixed(1);
  const aWins = higherIsBetter ? diff > 0 : diff < 0;
  const bWins = higherIsBetter ? diff < 0 : diff > 0;
  const isTie = diff === 0;

  // Scale so noticeable differences fill part of the meter
  const pctA = Math.min(100, Math.max(10, (valA / (valA + valB)) * 100));
  const pctB = 100 - pctA;

  return (
    <div className="group border-b border-rule py-3 transition-colors hover:bg-maple-shadow/30">
      <div className="flex items-center justify-between gap-4 narrow text-xs text-muted">
        <span
          className={cn(
            "text-base font-black font-text tracking-tight",
            aWins ? "text-wine font-extrabold" : "text-ink/80",
          )}
        >
          {displayA}
          {aWins && (
            <span className="ml-1.5 inline-block text-[0.6875rem] font-bold tabular-nums text-wine">
              <span aria-hidden>▲</span>
              <span className="sr-only">
                {" "}
                {higherIsBetter ? "higher" : "lower"} by{" "}
                {Math.abs(diff)}
              </span>
            </span>
          )}
        </span>

        <span className="text-center text-xs font-semibold normal-case text-ink font-text">
          {label}
          {isTie && <span className="sr-only">, tied</span>}
        </span>

        <span
          className={cn(
            "text-base font-black font-text tracking-tight text-right",
            bWins ? "text-wine font-extrabold" : "text-ink/80",
          )}
        >
          {bWins && (
            <span className="mr-1.5 inline-block text-[0.6875rem] font-bold tabular-nums text-wine">
              <span aria-hidden>▲</span>
              <span className="sr-only">
                {" "}
                {higherIsBetter ? "higher" : "lower"} by{" "}
                {Math.abs(diff)}
              </span>
            </span>
          )}
          {displayB}
        </span>
      </div>

      {/* Visual differential balance bar */}
      <div className="mt-2 flex h-2 w-full overflow-hidden bg-maple-shadow/40">
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "h-full transition-colors",
            aWins ? "bg-wine" : isTie ? "bg-muted/40" : "bg-maple-shadow",
          )}
        />
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: `${pctB}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "h-full transition-colors",
            bWins ? "bg-gold" : isTie ? "bg-muted/40" : "bg-maple-shadow",
          )}
        />
      </div>
    </div>
  );
}

/**
 * Opener: `margin-note` -- Heading in a narrow left column, the two era selectors are the body.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "margin-note";

export function EraCompare() {
  const [eraAId, setEraAId] = React.useState("2013"); // Miami Apex
  const [eraBId, setEraBId] = React.useState("2016"); // Cleveland 2016 Climax

  const eraA: PeakEraProfile =
    PEAK_ERAS.find((e) => e.id === eraAId) ?? PEAK_ERAS[1];
  const eraB: PeakEraProfile =
    PEAK_ERAS.find((e) => e.id === eraBId) ?? PEAK_ERAS[2];

  return (
    <section
      id="era-compare"
      aria-label="Era versus era: peak seasons comparative tool"
      className="scroll-clearance relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* --- Section Header ---
          Opener: margin-note. The heading sits in a narrow left column and the
          two selectors run beside it, so this section does not open with the
          eyebrow/headline/standfirst stack the page used to run everywhere. The
          eyebrow that stood here ("THE ERA COMPARATOR · PEAK COMPARATOR") was a
          restatement of the heading beneath it and is gone — see F-02. */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <h2
          className="headline text-wine"
          style={{ fontSize: "clamp(1.875rem, 4.5vw, 3rem)" }}
        >
            <RiseWords text={ERA_COMPARE_INTRO.subheading} />
          </h2>
        </div>
        <p className="max-w-2xl self-end text-base text-ink sm:text-lg leading-relaxed">
          {ERA_COMPARE_INTRO.copy}
        </p>
      </div>

      <PaintRule className="my-8" />

      {/* --- Dual Peak Selectors --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ERA A SELECTOR CARD */}
        <div className="border-2 border-wine bg-maple-deep/40 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="narrow-bold bg-wine px-2.5 py-1 text-[0.6875rem] text-chalk">
              Profile A
            </span>
            <span className="text-xs font-bold tabular-nums text-wine">
              Age {eraA.age}
            </span>
          </div>

          <div className="mt-4">
            <label
              htmlFor="era-a-select"
              className="narrow block text-xs text-muted"
            >
              Profile A, peak season:
            </label>
            {/* Native <select> is the right control here — real keyboard
                semantics and a mobile wheel picker, neither of which a
                custom listbox would preserve. It is restyled to the house
                palette instead: `bg-chalk` is the stark-white card treatment
                AGENTS.md forbids on the maple floor, and the OS chevron was
                the only non-hand-drawn control on the page. */}
            <div className="relative mt-1.5">
              <select
                id="era-a-select"
                value={eraAId}
                onChange={(e) => setEraAId(e.target.value)}
                className="w-full cursor-pointer appearance-none border border-rule bg-maple-deep/50 px-3 py-2 pr-9 text-base font-bold text-wine focus:border-wine focus:outline-none"
              >
                {PEAK_ERAS.map((e) => (
                  <option
                    key={`a-${e.id}`}
                    value={e.id}
                    disabled={e.id === eraBId}
                  >
                    {e.seasonLabel} ({e.city}): {e.name}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden
                viewBox="0 0 12 8"
                className="pointer-events-none absolute right-3 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-wine stroke-2"
              >
                <path d="M1 1.5L6 6.5L11 1.5" />
              </svg>
            </div>
          </div>

          <div className="mt-4 border-t border-rule pt-3">
            <h3 className="text-xl font-black text-wine">{eraA.archetype}</h3>
            <p className="narrow mt-1 text-xs text-leather-ink">
              {eraA.team}, {eraA.seasonLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">
              {eraA.summary}
            </p>
          </div>
        </div>

        {/* ERA B SELECTOR CARD */}
        <div className="border-2 border-gold bg-maple-deep/40 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="narrow-bold bg-gold px-2.5 py-1 text-[0.6875rem] text-wine-deep">
              Profile B
            </span>
            <span className="text-xs font-bold tabular-nums text-leather-ink">
              Age {eraB.age}
            </span>
          </div>

          <div className="mt-4">
            <label
              htmlFor="era-b-select"
              className="narrow block text-xs text-muted"
            >
              Profile B, peak season:
            </label>
            <div className="relative mt-1.5">
              <select
                id="era-b-select"
                value={eraBId}
                onChange={(e) => setEraBId(e.target.value)}
                className="w-full cursor-pointer appearance-none border border-rule bg-maple-deep/50 px-3 py-2 pr-9 text-base font-bold text-wine focus:border-gold focus:outline-none"
              >
                {PEAK_ERAS.map((e) => (
                  <option
                    key={`b-${e.id}`}
                    value={e.id}
                    disabled={e.id === eraAId}
                  >
                    {e.seasonLabel} ({e.city}): {e.name}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden
                viewBox="0 0 12 8"
                className="pointer-events-none absolute right-3 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-wine stroke-2"
              >
                <path d="M1 1.5L6 6.5L11 1.5" />
              </svg>
            </div>
          </div>

          <div className="mt-4 border-t border-rule pt-3">
            <h3 className="text-xl font-black text-wine">{eraB.archetype}</h3>
            <p className="narrow mt-1 text-xs text-leather-ink">
              {eraB.team}, {eraB.seasonLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">
              {eraB.summary}
            </p>
          </div>
        </div>
      </div>

      {/* --- Head-to-Head Comparative Metric Rows --- */}
      <div className="mt-10 border border-rule bg-maple-deep/40 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <span className="narrow text-xs text-wine">
            {eraA.seasonLabel} ({eraA.city})
          </span>
          <Caption bold className="text-wine">
            Metric Audit & Edge
          </Caption>
          <span className="narrow text-xs text-leather-ink">
            {eraB.seasonLabel} ({eraB.city})
          </span>
        </div>

        {/* Scoring & Shooting Efficiency */}
        <div className="mt-6">
          <Kicker className="font-semibold">
            Scoring & Shooting Efficiency
          </Kicker>
          <div className="mt-2 space-y-1">
            <MetricRow
              label="Points Per Game"
              valA={eraA.metrics.ppg}
              valB={eraB.metrics.ppg}
              format={(v) => v.toFixed(1)}
            />
            <MetricRow
              label="True Shooting %"
              valA={eraA.metrics.tsPct}
              valB={eraB.metrics.tsPct}
              unit="%"
              format={(v) => `${v.toFixed(1)}%`}
            />
            <MetricRow
              label="Field Goal %"
              valA={eraA.metrics.fgPct}
              valB={eraB.metrics.fgPct}
              unit="%"
              format={(v) => `${v.toFixed(1)}%`}
            />
            <MetricRow
              label="3-Point %"
              valA={eraA.metrics.threePtPct}
              valB={eraB.metrics.threePtPct}
              unit="%"
              format={(v) => `${v.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Playmaking & Ball Security */}
        <div className="mt-8">
          <Kicker className="font-semibold">
            Playmaking & Control
          </Kicker>
          <div className="mt-2 space-y-1">
            <MetricRow
              label="Assists Per Game"
              valA={eraA.metrics.apg}
              valB={eraB.metrics.apg}
              format={(v) => v.toFixed(1)}
            />
            <MetricRow
              label="Assist-to-Turnover Ratio"
              valA={eraA.metrics.astToRatio}
              valB={eraB.metrics.astToRatio}
              format={(v) => `${v.toFixed(1)} : 1`}
            />
          </div>
        </div>

        {/* Rebounding & Defense */}
        <div className="mt-8">
          <Kicker className="font-semibold">
            Rebounding & Defense
          </Kicker>
          <div className="mt-2 space-y-1">
            <MetricRow
              label="Rebounds Per Game"
              valA={eraA.metrics.rpg}
              valB={eraB.metrics.rpg}
              format={(v) => v.toFixed(1)}
            />
            <MetricRow
              label="Steals Per Game"
              valA={eraA.metrics.spg}
              valB={eraB.metrics.spg}
              format={(v) => v.toFixed(1)}
            />
            <MetricRow
              label="Blocks Per Game"
              valA={eraA.metrics.bpg}
              valB={eraB.metrics.bpg}
              format={(v) => v.toFixed(1)}
            />
          </div>
        </div>

        {/* Team Success */}
        <div className="mt-8">
          <Kicker className="font-semibold">
            Team Regular Season Record
          </Kicker>
          <div className="mt-2 space-y-1">
            <MetricRow
              label="Regular Season Wins"
              valA={eraA.metrics.teamWins}
              valB={eraB.metrics.teamWins}
              unit=" Wins"
            />
          </div>
        </div>
      </div>

      {/* --- Hardware & Accolades Showdown --- */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="border border-rule bg-maple-deep/40 p-6">
          <Caption bold className="text-wine">
            {eraA.seasonLabel} Hardware & Accolades
          </Caption>
          <ul className="narrow mt-4 space-y-2 text-xs text-ink">
            {eraA.hardware.map((hw) => (
              <li key={`hw-a-${hw}`} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-wine" />
                <span>{hw}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-rule bg-maple-deep/40 p-6">
          <Caption bold className="text-leather-ink">
            {eraB.seasonLabel} Hardware & Accolades
          </Caption>
          <ul className="narrow mt-4 space-y-2 text-xs text-ink">
            {eraB.hardware.map((hw) => (
              <li key={`hw-b-${hw}`} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-gold" />
                <span>{hw}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
