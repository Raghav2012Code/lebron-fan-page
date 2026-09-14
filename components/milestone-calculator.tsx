"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  MILESTONE_CALC_DATA,
  type MilestoneTarget,
} from "@/lib/lebron-data";
import { cn } from "@/lib/utils";
import { Caption, PaintRule, RiseWords } from "@/components/typeset";

export function MilestoneCalculator() {
  const [ppg, setPpg] = React.useState(22.5);
  const [gamesPerYear, setGamesPerYear] = React.useState(65);

  const annualPoints = Math.round(ppg * gamesPerYear);

  return (
    <section
      id="calculator"
      aria-label="Road to 50,000 — dynamic scoring pace calculator"
      className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* --- Section Header --- */}
      <div className="flex flex-col items-start">
        <Caption bold className="text-wine tracking-[0.2em]">
          {MILESTONE_CALC_DATA.heading.toUpperCase()} · PACE PROJECTION
        </Caption>
        <h2 className="mt-3 text-3xl font-black text-wine sm:text-4xl md:text-5xl">
          <RiseWords text={MILESTONE_CALC_DATA.subheading} />
        </h2>
        <p className="mt-4 max-w-3xl text-base text-ink sm:text-lg leading-relaxed">
          {MILESTONE_CALC_DATA.copy}
        </p>
      </div>

      <PaintRule className="my-8" />

      {/* --- Interactive Controls & Scenario Presets --- */}
      <div className="border border-rule bg-maple-light/30 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Caption bold className="text-wine">
              Pace Presets
            </Caption>
            <p className="text-xs text-muted">
              Select an archetype or fine-tune with the sliders below.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {MILESTONE_CALC_DATA.presets.map((preset) => {
              const isSelected =
                preset.ppg === ppg && preset.gamesPerYear === gamesPerYear;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setPpg(preset.ppg);
                    setGamesPerYear(preset.gamesPerYear);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono font-bold uppercase transition-all border",
                    isSelected
                      ? "bg-wine text-chalk border-wine shadow"
                      : "bg-chalk text-ink border-rule hover:border-wine",
                  )}
                >
                  {preset.name} ({preset.ppg} PPG)
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* SLIDER 1: PPG */}
          <div className="border border-rule bg-chalk/60 p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <Caption className="text-muted font-bold">Scoring Pace</Caption>
              <div className="flex items-baseline gap-1">
                <span className="figure text-3xl font-extrabold text-wine">
                  {ppg.toFixed(1)}
                </span>
                <span className="font-mono text-xs font-bold uppercase text-leather">
                  PPG
                </span>
              </div>
            </div>

            <input
              type="range"
              min="15.0"
              max="28.0"
              step="0.5"
              value={ppg}
              onChange={(e) => setPpg(parseFloat(e.target.value))}
              aria-label="Projected Points Per Game"
              className="mt-4 h-2 w-full cursor-pointer appearance-none bg-maple-dark accent-wine focus:outline-none"
            />

            <div className="mt-2 flex justify-between font-mono text-[0.6875rem] text-muted">
              <span>15.0 (Role player)</span>
              <span>22.5 (Current)</span>
              <span>28.0 (Apex)</span>
            </div>
          </div>

          {/* SLIDER 2: Games / Season */}
          <div className="border border-rule bg-chalk/60 p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <Caption className="text-muted font-bold">Games Per Season</Caption>
              <div className="flex items-baseline gap-1">
                <span className="figure text-3xl font-extrabold text-wine">
                  {gamesPerYear}
                </span>
                <span className="font-mono text-xs font-bold uppercase text-leather">
                  GP
                </span>
              </div>
            </div>

            <input
              type="range"
              min="40"
              max="75"
              step="1"
              value={gamesPerYear}
              onChange={(e) => setGamesPerYear(parseInt(e.target.value, 10))}
              aria-label="Projected Games Played per Season"
              className="mt-4 h-2 w-full cursor-pointer appearance-none bg-maple-dark accent-wine focus:outline-none"
            />

            <div className="mt-2 flex justify-between font-mono text-[0.6875rem] text-muted">
              <span>40 (Heavy load-management)</span>
              <span>65 (Target)</span>
              <span>75 (Iron man)</span>
            </div>
          </div>
        </div>

        {/* Annual Point Output Summary Banner */}
        <div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-rule pt-4 text-xs sm:flex-row sm:items-center font-mono">
          <span className="text-muted">
            At this pace:{" "}
            <strong className="text-wine">
              {annualPoints.toLocaleString()} points
            </strong>{" "}
            accumulated per full season played.
          </span>
          <span className="text-leather font-bold">
            Current Regular Season: 43,440 PTS · All-Time Combined: 51,961 PTS
          </span>
        </div>
      </div>

      {/* --- Dynamic Milestone Horizon Cards --- */}
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {MILESTONE_CALC_DATA.milestones.map((milestone: MilestoneTarget) => {
          const currentTotal =
            milestone.type === "regular"
              ? MILESTONE_CALC_DATA.currentRegular
              : MILESTONE_CALC_DATA.currentCombined;

          const remainingPts = Math.max(0, milestone.target - currentTotal);
          const gamesNeeded = Math.ceil(remainingPts / ppg);
          const seasonsNeeded = +(gamesNeeded / gamesPerYear).toFixed(1);
          const pct = Math.min(100, Math.round((currentTotal / milestone.target) * 100));

          // Projected calendar date estimate based on remaining games
          // Current baseline: 2025-26 season
          const targetStartYear = 2025 + Math.floor(seasonsNeeded);
          const seasonEst = `${targetStartYear}–${String((targetStartYear + 1) % 100).padStart(2, "0")}`;
          const ageEst = 41 + Math.floor(seasonsNeeded);

          return (
            <div
              key={milestone.id}
              className="relative flex flex-col justify-between border-2 border-rule bg-maple-light/40 p-6 shadow-md transition-all hover:border-wine"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-wine px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-chalk font-mono">
                    {milestone.type === "regular" ? "Regular Season" : "Combined"}
                  </span>
                  <span className="font-mono text-xs font-bold text-wine">
                    {pct}% Reached
                  </span>
                </div>

                <h3 className="mt-4 text-2xl font-black text-wine">
                  {milestone.target.toLocaleString()}
                </h3>
                <p className="mt-0.5 text-xs font-mono uppercase text-leather">
                  {milestone.label}
                </p>
                <p className="mt-2 text-xs text-muted">{milestone.desc}</p>

                {/* Progress Bar etched in wood */}
                <div className="mt-5">
                  <div className="relative h-2.5 w-full overflow-hidden bg-maple-dark border border-rule">
                    <motion.div
                      className="h-full bg-wine"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[0.6875rem] font-mono text-muted">
                    <span>{currentTotal.toLocaleString()}</span>
                    <span>{milestone.target.toLocaleString()}</span>
                  </div>
                </div>

                {/* Points & Games to go */}
                <div className="mt-5 border-t border-rule pt-4">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-muted">Points remaining:</span>
                    <span className="figure font-bold text-wine">
                      {remainingPts.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-baseline justify-between text-xs">
                    <span className="text-muted">Games required:</span>
                    <span className="figure font-bold text-wine">
                      ~{gamesNeeded} games
                    </span>
                  </div>
                </div>
              </div>

              {/* Projected Landing Date Footer */}
              <div className="mt-6 border-t border-rule pt-4">
                <Caption className="text-muted text-[0.6875rem]">
                  Projected Arrival
                </Caption>
                <div className="mt-1 flex items-baseline justify-between font-mono">
                  <span className="text-base font-black text-wine">
                    {seasonEst} Season
                  </span>
                  <span className="text-xs text-leather font-bold">
                    Age ~{ageEst}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
