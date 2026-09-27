"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  FATHER_AND_SON,
  type FatherSonMilestone,
  type GameComparisonNode,
} from "@/lib/lebron-data";
import { cn } from "@/lib/utils";
import { Caption, Counter, PaintRule, RiseWords, type Opener } from "@/components/typeset";

/* -------------------------------------------------------------------------
 * BoxLine — a box score set as a line score.
 *
 * These two were five-across grids of filled tiles, two of the seven identical
 * bands the page ran (F-01). A box score is not a card grid; it is a line. So it
 * is set as a line: five figures on one rule, hairline verticals between them,
 * no per-cell fill, label over figure.
 *
 * `StatBand` is deliberately not used here. The cap in F-01 allows two bands on
 * the whole page and they are spent on the scoreboard tiles and the block's
 * telemetry; a third would break the cap that exists to stop exactly this
 * pattern spreading.
 * ------------------------------------------------------------------------ */

const BOX_LABELS = ["PTS", "REB", "AST", "STL", "FG"] as const;

function BoxLine({ box }: { box: GameComparisonNode["boxScore"] }) {
  const values = [box.pts, box.reb, box.ast, box.stl, box.fg];
  return (
    <dl className="mt-2 flex items-stretch">
      {BOX_LABELS.map((label, i) => (
        <div
          key={label}
          className="flex flex-1 flex-col items-center border-r border-rule/60 px-1 last:border-r-0"
        >
          <dt>
            <Caption className="text-muted">{label}</Caption>
          </dt>
          <dd
            className={cn(
              "figure text-wine",
              // The FG cell is a slash line like "9-16", not a bare integer,
              // so it needs a size down to sit on the same optical baseline.
              typeof values[i] === "string"
                ? "text-sm leading-6"
                : "text-xl leading-7",
            )}
          >
            {values[i]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Opener: `margin-note` -- Heading in a narrow left column, the 21-year timeline running beside it.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "margin-note";

export function FatherAndSon() {
  // Index into a data array, so it is clamped on read: if the timeline is ever
  // shortened, `activeMilestone` would be undefined and take the section down
  // with it. The default (the Oct 22, 2024 history night) is expressed as
  // "last entry" rather than a magic 5 that only means that today.
  const [activeMilestoneIdx, setActiveMilestoneIdx] = React.useState(
    FATHER_AND_SON.timeline.length - 1,
  );
  const activeMilestone: FatherSonMilestone =
    FATHER_AND_SON.timeline[
      Math.min(activeMilestoneIdx, FATHER_AND_SON.timeline.length - 1)
    ];

  const debut = FATHER_AND_SON.debutNight;
  const history = FATHER_AND_SON.historyNight;

  return (
    <section
      id="father-son"
      aria-label="Father and son: the 21-year arc and NBA history"
      className="scroll-clearance relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* --- Section Header ---
          Opener: margin-note. Heading in a narrow left column, the 21-year
          timeline running beside it. The eyebrow that stood here restated the
          heading and carried a `·` separator on top of it, both banned by
          AGENTS.md §1 — gone, see F-02. */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div>
          <h2 className="text-3xl font-black text-wine sm:text-4xl md:text-5xl">
            <RiseWords text={FATHER_AND_SON.subheading} />
          </h2>
        </div>
        <p className="max-w-2xl self-end text-base text-ink sm:text-lg leading-relaxed">
          {FATHER_AND_SON.copy}
        </p>
      </div>

      <PaintRule className="my-8" />

      {/* --- Headline Figures Plaque --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-rule bg-maple-deep/40 p-5">
          <Caption className="text-muted">Span Between Games</Caption>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
              <Counter to={FATHER_AND_SON.daysApart} />
            </span>
            <span className="narrow text-xs text-leather">
              Days
            </span>
          </div>
          <span className="mt-1 block text-xs text-muted">
            October 29, 2003 to October 22, 2024
          </span>
        </div>

        <div className="border border-rule bg-maple-deep/40 p-5">
          <Caption className="text-muted">Generational Span</Caption>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
              <Counter to={FATHER_AND_SON.yearsSpan} />
            </span>
            <span className="narrow text-xs text-leather">
              Full Seasons
            </span>
          </div>
          <span className="mt-1 block text-xs text-muted">
            Age 18 rookie to age 39 teammate
          </span>
        </div>

        <div className="border border-rule bg-maple-deep/40 p-5">
          <Caption className="text-muted">NBA Precedent</Caption>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
              1st
            </span>
            <span className="narrow text-xs text-leather">
              In History
            </span>
          </div>
          <span className="mt-1 block text-xs text-muted">
            Never before in 78 NBA seasons
          </span>
        </div>
      </div>

      {/* --- Scorer's Table Mic'd Up Quote Banner --- */}
      <div className="mt-6 border-l-4 border-gold bg-wine p-6 text-chalk shadow-lg sm:p-8">
        <span className="narrow text-xs text-gold">
          Scorer&apos;s Table · 4:00 2nd Quarter · Oct 22, 2024
        </span>
        {/* AGENTS.md: all reading copy is Plus Jakarta Sans, and bookish /
          Victorian serifs are explicitly ruled out. */}
      <blockquote className="mt-3 text-lg italic leading-relaxed text-chalk sm:text-xl md:text-2xl">
          {FATHER_AND_SON.quote}
        </blockquote>
        <p className="narrow mt-3 text-xs text-chalk-dim">
          {FATHER_AND_SON.quoteAuthor}
        </p>
      </div>

      {/* --- Two Parallel Split Columns: Debut vs History --- */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* LEFT COLUMN: THE DEBUT (OCT 29, 2003) */}
        <div className="relative flex flex-col justify-between border border-rule bg-maple-deep/40 p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="narrow-bold bg-wine px-2.5 py-1 text-[0.6875rem] text-chalk">
                The Debut
              </span>
              <span className="text-xs tabular-nums text-muted">
                {debut.date}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-wine sm:text-3xl">
              {debut.venue}
            </h3>
            <p className="narrow mt-1 text-xs text-leather">
              {debut.city} · vs {debut.opponent}
            </p>

            <div className="mt-4 border-t border-rule pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted">LeBron Age:</span>
                <span className="font-bold text-wine">{debut.lebronAge}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-muted">Bronny Status:</span>
                <span className="font-semibold text-ink">{debut.bronnyStatus}</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/90">
              {debut.context}
            </p>
          </div>

          {/* Debut Box Score */}
          <div className="mt-6 border-t border-rule pt-4">
            <Caption className="text-muted">Debut Box Score</Caption>
            <BoxLine box={debut.boxScore} />
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORY NIGHT (OCT 22, 2024) */}
        <div className="relative flex flex-col justify-between border-2 border-wine bg-maple-deep/40 p-6 shadow-xl sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="narrow-bold bg-gold px-2.5 py-1 text-[0.6875rem] text-wine-deep">
                History Made
              </span>
              <span className="text-xs font-bold tabular-nums text-wine">
                {history.date}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-wine sm:text-3xl">
              {history.venue}
            </h3>
            <p className="narrow mt-1 text-xs text-leather">
              {history.city} · vs {history.opponent}
            </p>

            <div className="mt-4 border-t border-rule pt-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted">LeBron Age:</span>
                <span className="font-bold text-wine">{history.lebronAge}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-muted">Bronny Age:</span>
                <span className="font-bold text-leather">{history.bronnyStatus}</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink/90">
              {history.context}
            </p>
          </div>

          {/* History Box Score */}
          <div className="mt-6 border-t border-rule pt-4">
            <Caption className="text-muted">Opening Night Box Score</Caption>
            <BoxLine box={history.boxScore} />
          </div>
        </div>
      </div>

      {/* --- The 21-Year Interactive Timeline Spine --- */}
      <div className="mt-14 border border-rule bg-maple-deep/40 p-6 sm:p-8">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Caption bold className="text-wine">
              The 21-Year Bridge
            </Caption>
            <p className="mt-1 text-xs text-muted">
              Select any milestone to trace the journey from unborn son to NBA teammate.
            </p>
          </div>
          <span className="mt-2 narrow text-xs text-leather sm:mt-0">
            2003 to 2024
          </span>
        </div>

        {/* Milestone Buttons Strip */}
        <div
          role="tablist"
          aria-label="Timeline of father and son milestones"
          className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
        >
          {FATHER_AND_SON.timeline.map((m, idx) => {
            const isSelected = idx === activeMilestoneIdx;
            return (
              <button
                key={`${m.year}-${m.title}`}
                id={`father-son-tab-${idx}`}
                role="tab"
                aria-selected={isSelected}
                aria-controls="father-son-panel"
                // Roving tabindex + arrow keys: the APG tabs pattern, which
                // was previously declared but not implemented (every tab was
                // tabbable and arrow keys did nothing).
                tabIndex={isSelected ? 0 : -1}
                onKeyDown={(ev) => {
                  const last = FATHER_AND_SON.timeline.length - 1;
                  let next: number | null = null;
                  if (ev.key === "ArrowRight" || ev.key === "ArrowDown") {
                    next = idx === last ? 0 : idx + 1;
                  } else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") {
                    next = idx === 0 ? last : idx - 1;
                  } else if (ev.key === "Home") {
                    next = 0;
                  } else if (ev.key === "End") {
                    next = last;
                  }
                  if (next === null) return;
                  ev.preventDefault();
                  setActiveMilestoneIdx(next);
                  document.getElementById(`father-son-tab-${next}`)?.focus();
                }}
                onClick={() => setActiveMilestoneIdx(idx)}
                className={cn(
                  "flex flex-col p-3 text-left transition-all border",
                  isSelected
                    ? "bg-wine text-chalk border-wine shadow-md"
                    : "bg-maple-deep/50 text-ink border-rule hover:border-wine hover:bg-maple-shadow",
                )}
              >
                <span
                  className={cn(
                    "narrow text-xs",
                    isSelected ? "text-gold" : "text-muted",
                  )}
                >
                  {m.date}
                </span>
                <span className="mt-1 text-xs font-bold tracking-tight line-clamp-1">
                  {m.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Milestone Highlight Card */}
        <motion.div
          key={activeMilestone.title}
          id="father-son-panel"
          role="tabpanel"
          aria-labelledby={`father-son-tab-${activeMilestoneIdx}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6 border-t border-rule pt-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-black tabular-nums text-wine">
                  {activeMilestone.date}
                </span>
                <span className="text-xs text-muted">·</span>
                <h4 className="text-lg font-black text-wine">
                  {activeMilestone.title}
                </h4>
              </div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink/90 sm:text-base">
                {activeMilestone.description}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 text-xs tabular-nums">
              <div>
                <span className="text-muted">LeBron:</span>{" "}
                <span className="font-bold text-wine">Age {activeMilestone.lebronAge}</span>
              </div>
              <div>
                <span className="text-muted">Bronny:</span>{" "}
                <span className="font-bold text-leather">
                  {activeMilestone.bronnyAge === "Unborn"
                    ? "Unborn"
                    : `Age ${activeMilestone.bronnyAge}`}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
