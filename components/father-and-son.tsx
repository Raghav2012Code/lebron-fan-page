"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  FATHER_AND_SON,
  type FatherSonMilestone,
} from "@/lib/lebron-data";
import { cn } from "@/lib/utils";
import { Caption, Counter, PaintRule, RiseWords } from "@/components/typeset";

export function FatherAndSon() {
  const [activeMilestoneIdx, setActiveMilestoneIdx] = React.useState(5); // Default to the Oct 22, 2024 history night
  const activeMilestone: FatherSonMilestone =
    FATHER_AND_SON.timeline[activeMilestoneIdx];

  const debut = FATHER_AND_SON.debutNight;
  const history = FATHER_AND_SON.historyNight;

  return (
    <section
      id="father-son"
      aria-label="Father and son — the 21-year arc and NBA history"
      className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* --- Section Header --- */}
      <div className="flex flex-col items-start">
        <Caption bold className="text-wine tracking-[0.2em]">
          {FATHER_AND_SON.heading.toUpperCase()} · 2003—2024
        </Caption>
        <h2 className="mt-3 text-3xl font-black text-wine sm:text-4xl md:text-5xl">
          <RiseWords text={FATHER_AND_SON.subheading} />
        </h2>
        <p className="mt-4 max-w-3xl text-base text-ink sm:text-lg leading-relaxed">
          {FATHER_AND_SON.copy}
        </p>
      </div>

      <PaintRule className="my-8" />

      {/* --- Headline Figures Plaque --- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border border-rule bg-maple-light/40 p-5">
          <Caption className="text-muted">Span Between Games</Caption>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
              <Counter to={FATHER_AND_SON.daysApart} />
            </span>
            <span className="font-mono text-xs font-bold uppercase text-leather">
              Days
            </span>
          </div>
          <span className="mt-1 block text-xs text-muted">
            October 29, 2003 to October 22, 2024
          </span>
        </div>

        <div className="border border-rule bg-maple-light/40 p-5">
          <Caption className="text-muted">Generational Span</Caption>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
              <Counter to={FATHER_AND_SON.yearsSpan} />
            </span>
            <span className="font-mono text-xs font-bold uppercase text-leather">
              Full Seasons
            </span>
          </div>
          <span className="mt-1 block text-xs text-muted">
            Age 18 rookie to age 39 teammate
          </span>
        </div>

        <div className="border border-rule bg-maple-light/40 p-5">
          <Caption className="text-muted">NBA Precedent</Caption>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
              1st
            </span>
            <span className="font-mono text-xs font-bold uppercase text-leather">
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
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-gold">
          Scorer&apos;s Table · 4:00 2nd Quarter · Oct 22, 2024
        </span>
        <blockquote className="mt-3 font-serif text-lg italic leading-relaxed text-chalk sm:text-xl md:text-2xl">
          {FATHER_AND_SON.quote}
        </blockquote>
        <p className="mt-3 text-xs font-mono tracking-wider uppercase text-chalk/70">
          — {FATHER_AND_SON.quoteAuthor}
        </p>
      </div>

      {/* --- Two Parallel Split Columns: Debut vs History --- */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* LEFT COLUMN: THE DEBUT (OCT 29, 2003) */}
        <div className="relative flex flex-col justify-between border border-rule bg-maple-light/30 p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-wine px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-chalk font-mono">
                The Debut
              </span>
              <span className="font-mono text-xs text-muted">
                {debut.date}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-wine sm:text-3xl">
              {debut.venue}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase text-leather">
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
            <Caption className="text-muted mb-2">Debut Box Score</Caption>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">PTS</span>
                <span className="figure text-lg font-black text-wine">{debut.boxScore.pts}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">REB</span>
                <span className="figure text-lg font-black text-wine">{debut.boxScore.reb}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">AST</span>
                <span className="figure text-lg font-black text-wine">{debut.boxScore.ast}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">STL</span>
                <span className="figure text-lg font-black text-wine">{debut.boxScore.stl}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">FG</span>
                <span className="figure text-xs font-bold text-wine leading-5">12-20</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORY NIGHT (OCT 22, 2024) */}
        <div className="relative flex flex-col justify-between border-2 border-wine bg-maple-light/40 p-6 shadow-xl sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <span className="bg-gold px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-wine-deep font-mono">
                History Made
              </span>
              <span className="font-mono text-xs font-bold text-wine">
                {history.date}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-black text-wine sm:text-3xl">
              {history.venue}
            </h3>
            <p className="mt-1 font-mono text-xs uppercase text-leather">
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
            <Caption className="text-muted mb-2">Opening Night Box Score</Caption>
            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">PTS</span>
                <span className="figure text-lg font-black text-wine">{history.boxScore.pts}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">REB</span>
                <span className="figure text-lg font-black text-wine">{history.boxScore.reb}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">AST</span>
                <span className="figure text-lg font-black text-wine">{history.boxScore.ast}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">STL</span>
                <span className="figure text-lg font-black text-wine">{history.boxScore.stl}</span>
              </div>
              <div className="bg-maple-dark/40 p-2">
                <span className="block text-[0.625rem] font-mono text-muted uppercase">FG</span>
                <span className="figure text-xs font-bold text-wine leading-5">7-16</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- The 21-Year Interactive Timeline Spine --- */}
      <div className="mt-14 border border-rule bg-maple-light/30 p-6 sm:p-8">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Caption bold className="text-wine">
              The 21-Year Bridge
            </Caption>
            <p className="mt-1 text-xs text-muted">
              Select any milestone to trace the journey from unborn son to NBA teammate.
            </p>
          </div>
          <span className="mt-2 font-mono text-xs font-bold uppercase text-leather sm:mt-0">
            2003 — 2024
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
                role="tab"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setActiveMilestoneIdx(idx)}
                className={cn(
                  "flex flex-col p-3 text-left transition-all border",
                  isSelected
                    ? "bg-wine text-chalk border-wine shadow-md"
                    : "bg-maple-light/60 text-ink border-rule hover:border-wine hover:bg-maple-dark",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs font-bold",
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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-6 border-t border-rule pt-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-black text-wine">
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
            <div className="flex shrink-0 items-center gap-4 text-xs font-mono">
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
