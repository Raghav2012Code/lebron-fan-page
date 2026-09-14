"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  ERA_COMPARE_INTRO,
  PEAK_ERAS,
  type PeakEraProfile,
} from "@/lib/lebron-data";
import { cn } from "@/lib/utils";
import { Caption, PaintRule, RiseWords } from "@/components/typeset";

interface MetricRowProps {
  label: string;
  valA: number;
  valB: number;
  unit?: string;
  format?: (v: number) => string;
  higherIsBetter?: boolean;
}

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
    <div className="group border-b border-rule py-3 transition-colors hover:bg-maple-dark/30">
      <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider text-muted">
        <span
          className={cn(
            "text-base font-black font-sans tracking-tight",
            aWins ? "text-wine font-extrabold" : "text-ink/80",
          )}
        >
          {displayA}
          {aWins && (
            <span className="ml-1.5 inline-block text-[0.6875rem] font-mono font-bold text-leather">
              ▲
            </span>
          )}
        </span>

        <span className="text-center text-xs font-semibold normal-case text-ink font-sans">
          {label}
        </span>

        <span
          className={cn(
            "text-base font-black font-sans tracking-tight text-right",
            bWins ? "text-wine font-extrabold" : "text-ink/80",
          )}
        >
          {bWins && (
            <span className="mr-1.5 inline-block text-[0.6875rem] font-mono font-bold text-leather">
              ▲
            </span>
          )}
          {displayB}
        </span>
      </div>

      {/* Visual differential balance bar */}
      <div className="mt-2 flex h-2 w-full overflow-hidden bg-maple-dark/50">
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: `${pctA}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "h-full transition-colors",
            aWins ? "bg-wine" : isTie ? "bg-muted/40" : "bg-maple-dark",
          )}
        />
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: `${pctB}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "h-full transition-colors",
            bWins ? "bg-gold" : isTie ? "bg-muted/40" : "bg-maple-dark",
          )}
        />
      </div>
    </div>
  );
}

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
      aria-label="Era versus era — peak seasons comparative tool"
      className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* --- Section Header --- */}
      <div className="flex flex-col items-start">
        <Caption bold className="text-wine tracking-[0.2em]">
          {ERA_COMPARE_INTRO.heading.toUpperCase()} · PEAK COMPARATOR
        </Caption>
        <h2 className="mt-3 text-3xl font-black text-wine sm:text-4xl md:text-5xl">
          <RiseWords text={ERA_COMPARE_INTRO.subheading} />
        </h2>
        <p className="mt-4 max-w-3xl text-base text-ink sm:text-lg leading-relaxed">
          {ERA_COMPARE_INTRO.copy}
        </p>
      </div>

      <PaintRule className="my-8" />

      {/* --- Dual Peak Selectors --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* ERA A SELECTOR CARD */}
        <div className="border-2 border-wine bg-maple-light/40 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="bg-wine px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-chalk font-mono">
              Profile A
            </span>
            <span className="font-mono text-xs font-bold text-wine">
              Age {eraA.age}
            </span>
          </div>

          <div className="mt-4">
            <label
              htmlFor="era-a-select"
              className="block text-xs font-mono font-semibold uppercase text-muted"
            >
              Select Peak Season:
            </label>
            <select
              id="era-a-select"
              value={eraAId}
              onChange={(e) => setEraAId(e.target.value)}
              className="mt-1.5 w-full cursor-pointer border border-rule bg-chalk px-3 py-2 text-base font-bold text-wine shadow-inner focus:border-wine focus:outline-none"
            >
              {PEAK_ERAS.map((e) => (
                <option key={`a-${e.id}`} value={e.id}>
                  {e.seasonLabel} ({e.city}) — {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 border-t border-rule pt-3">
            <h3 className="text-xl font-black text-wine">{eraA.archetype}</h3>
            <p className="mt-1 text-xs font-mono uppercase text-leather">
              {eraA.team} · {eraA.seasonLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">
              {eraA.summary}
            </p>
          </div>
        </div>

        {/* ERA B SELECTOR CARD */}
        <div className="border-2 border-gold bg-maple-light/40 p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="bg-gold px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-wine-deep font-mono">
              Profile B
            </span>
            <span className="font-mono text-xs font-bold text-leather">
              Age {eraB.age}
            </span>
          </div>

          <div className="mt-4">
            <label
              htmlFor="era-b-select"
              className="block text-xs font-mono font-semibold uppercase text-muted"
            >
              Select Peak Season:
            </label>
            <select
              id="era-b-select"
              value={eraBId}
              onChange={(e) => setEraBId(e.target.value)}
              className="mt-1.5 w-full cursor-pointer border border-rule bg-chalk px-3 py-2 text-base font-bold text-wine shadow-inner focus:border-gold focus:outline-none"
            >
              {PEAK_ERAS.map((e) => (
                <option key={`b-${e.id}`} value={e.id}>
                  {e.seasonLabel} ({e.city}) — {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 border-t border-rule pt-3">
            <h3 className="text-xl font-black text-wine">{eraB.archetype}</h3>
            <p className="mt-1 text-xs font-mono uppercase text-leather">
              {eraB.team} · {eraB.seasonLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/90">
              {eraB.summary}
            </p>
          </div>
        </div>
      </div>

      {/* --- Head-to-Head Comparative Metric Rows --- */}
      <div className="mt-10 border border-rule bg-maple-light/30 p-6 sm:p-8">
        <div className="flex items-center justify-between border-b border-rule pb-4">
          <span className="font-mono text-xs font-bold uppercase text-wine">
            {eraA.seasonLabel} ({eraA.city})
          </span>
          <Caption bold className="text-wine">
            Metric Audit & Edge
          </Caption>
          <span className="font-mono text-xs font-bold uppercase text-leather">
            {eraB.seasonLabel} ({eraB.city})
          </span>
        </div>

        {/* Scoring & Shooting Efficiency */}
        <div className="mt-6">
          <Caption className="text-muted uppercase tracking-widest text-[0.6875rem]">
            Scoring & Shooting Efficiency
          </Caption>
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
          <Caption className="text-muted uppercase tracking-widest text-[0.6875rem]">
            Playmaking & Control
          </Caption>
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
          <Caption className="text-muted uppercase tracking-widest text-[0.6875rem]">
            Rebounding & Defense
          </Caption>
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
          <Caption className="text-muted uppercase tracking-widest text-[0.6875rem]">
            Team Regular Season Record
          </Caption>
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
        <div className="border border-rule bg-maple-light/40 p-6">
          <Caption bold className="text-wine">
            {eraA.seasonLabel} Hardware & Accolades
          </Caption>
          <ul className="mt-4 space-y-2 font-mono text-xs text-ink">
            {eraA.hardware.map((hw) => (
              <li key={`hw-a-${hw}`} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-wine" />
                <span>{hw}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-rule bg-maple-light/40 p-6">
          <Caption bold className="text-leather">
            {eraB.seasonLabel} Hardware & Accolades
          </Caption>
          <ul className="mt-4 space-y-2 font-mono text-xs text-ink">
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
