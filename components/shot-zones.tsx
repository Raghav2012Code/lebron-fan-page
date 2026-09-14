"use client";

import * as React from "react";

import {
  SHOT_ZONES,
  type EraShotData,
  type ShotZoneData,
} from "@/lib/lebron-data";
import { cn } from "@/lib/utils";
import { Caption, PaintRule, RiseWords } from "@/components/typeset";

interface CourtZoneConfig {
  id: string;
  path: string;
  labelX: number;
  labelY: number;
}

const COURT_ZONES: CourtZoneConfig[] = [
  {
    id: "restricted",
    path: "M 210,440 L 210,390 A 40,40 0 0,1 290,390 L 290,440 Z",
    labelX: 250,
    labelY: 416,
  },
  {
    id: "paint",
    path: "M 170,440 L 170,250 L 330,250 L 330,440 L 290,440 L 290,390 A 40,40 0 0,0 210,390 L 210,440 Z",
    labelX: 250,
    labelY: 320,
  },
  {
    id: "mid-left",
    path: "M 55,440 L 55,300 A 214.77,214.77 0 0,1 170,190.7 L 170,440 Z",
    labelX: 112,
    labelY: 340,
  },
  {
    id: "mid-center",
    path: "M 170,250 L 170,190.7 A 214.77,214.77 0 0,1 330,190.7 L 330,250 Z",
    labelX: 250,
    labelY: 218,
  },
  {
    id: "mid-right",
    path: "M 330,440 L 330,190.7 A 214.77,214.77 0 0,1 445,300 L 445,440 Z",
    labelX: 388,
    labelY: 340,
  },
  {
    id: "corner-3-l",
    path: "M 25,440 L 25,300 L 55,300 L 55,440 Z",
    labelX: 40,
    labelY: 370,
  },
  {
    id: "corner-3-r",
    path: "M 445,440 L 445,300 L 475,300 L 475,440 Z",
    labelX: 460,
    labelY: 370,
  },
  {
    id: "above-break-3",
    path: "M 25,300 L 55,300 A 214.77,214.77 0 0,1 445,300 L 475,300 L 475,100 L 25,100 Z",
    labelX: 250,
    labelY: 135,
  },
  {
    id: "deep-3",
    path: "M 25,100 L 475,100 L 475,30 L 25,30 Z",
    labelX: 250,
    labelY: 65,
  },
];

function getZoneColor(fgPct: number, isSelected: boolean, isHovered: boolean) {
  if (isSelected) {
    return "rgba(224, 167, 44, 0.55)";
  }
  if (isHovered) {
    return "rgba(224, 167, 44, 0.4)";
  }
  if (fgPct >= 70) {
    return "rgba(224, 167, 44, 0.38)";
  }
  if (fgPct >= 44) {
    return "rgba(224, 167, 44, 0.24)";
  }
  if (fgPct >= 38) {
    return "rgba(184, 107, 30, 0.22)";
  }
  if (fgPct >= 33) {
    return "rgba(90, 22, 38, 0.28)";
  }
  return "rgba(90, 22, 38, 0.16)";
}

export function ShotZones() {
  const [selectedEraIndex, setSelectedEraIndex] = React.useState(1); // Default to Miami Peak (apex efficiency)
  const [selectedZoneId, setSelectedZoneId] = React.useState("restricted");
  const [hoveredZoneId, setHoveredZoneId] = React.useState<string | null>(null);

  const era: EraShotData = SHOT_ZONES.eras[selectedEraIndex];
  const activeZoneId = hoveredZoneId ?? selectedZoneId;
  const activeZone: ShotZoneData =
    era.zones[activeZoneId] ?? era.zones["restricted"];

  const diffVsLeague = +(activeZone.fgPct - activeZone.leagueAvg).toFixed(1);

  return (
    <section
      id="shot-zones"
      aria-label="The heat map — career shot zones and scoring evolution"
      className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* --- Section Header --- */}
      <div className="flex flex-col items-start">
        <Caption bold className="text-wine tracking-[0.2em]">
          {SHOT_ZONES.heading.toUpperCase()}
        </Caption>
        <h2 className="mt-3 text-3xl font-black text-wine sm:text-4xl md:text-5xl">
          <RiseWords text={SHOT_ZONES.subheading} />
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink sm:text-lg">
          {SHOT_ZONES.copy}
        </p>
      </div>

      <PaintRule className="my-8" />

      {/* --- Era Selector Navigation --- */}
      <div
        role="tablist"
        aria-label="Career Scoring Eras"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {SHOT_ZONES.eras.map((e, idx) => {
          const isCurrent = idx === selectedEraIndex;
          return (
            <button
              key={e.id}
              role="tab"
              aria-selected={isCurrent}
              tabIndex={0}
              onClick={() => setSelectedEraIndex(idx)}
              className={cn(
                "group relative flex flex-col p-3 text-left transition-all border sm:p-4",
                isCurrent
                  ? "bg-wine text-chalk border-wine shadow-lg"
                  : "bg-maple-light/60 text-ink border-rule hover:border-wine hover:bg-maple-dark",
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs font-bold tracking-wider uppercase",
                  isCurrent ? "text-gold" : "text-muted",
                )}
              >
                {e.period}
              </span>
              <span className="mt-1 text-sm font-black uppercase tracking-tight sm:text-base">
                {e.name}
              </span>
              <span
                className={cn(
                  "text-xs line-clamp-1 mt-0.5",
                  isCurrent ? "text-chalk/80" : "text-muted",
                )}
              >
                {e.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* --- Era Narrative & Headline Metrics --- */}
      <div className="mt-6 border border-rule bg-maple-light/30 p-4 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-wine">
              {era.team} · {era.period}
            </span>
            <p className="mt-1 text-sm text-ink sm:text-base leading-relaxed">
              {era.narrative}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-4 border-t border-rule pt-4 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-6">
            <div>
              <Caption className="text-muted">PPG</Caption>
              <div className="figure text-xl font-bold text-wine sm:text-2xl">
                {era.ppg.toFixed(1)}
              </div>
            </div>
            <div>
              <Caption className="text-muted">FG%</Caption>
              <div className="figure text-xl font-bold text-wine sm:text-2xl">
                {era.fgPct.toFixed(1)}%
              </div>
            </div>
            <div>
              <Caption className="text-muted">3P%</Caption>
              <div className="figure text-xl font-bold text-wine sm:text-2xl">
                {era.threePtPct.toFixed(1)}%
              </div>
            </div>
            <div>
              <Caption className="text-muted">FT%</Caption>
              <div className="figure text-xl font-bold text-wine sm:text-2xl">
                {era.ftPct.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Court & Detail Grid --- */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* THE HALF COURT SCHEMATIC */}
        <div className="relative aspect-[500/470] w-full overflow-hidden border border-rule-chalk bg-wine-deep shadow-2xl">
          <svg
            className="absolute inset-0 h-full w-full select-none"
            viewBox="0 0 500 470"
            preserveAspectRatio="xMidYMid meet"
            aria-label={`Interactive half court shot chart for ${era.name}`}
          >
            {/* Base court floor background */}
            <rect
              x="0"
              y="0"
              width="500"
              height="470"
              fill="#220A12"
            />

            {/* --- INTERACTIVE SHOT SECTORS --- */}
            {COURT_ZONES.map((zone) => {
              const zoneData = era.zones[zone.id];
              const isSelected = selectedZoneId === zone.id;
              const isHovered = hoveredZoneId === zone.id;
              const fill = getZoneColor(
                zoneData?.fgPct ?? 40,
                isSelected,
                isHovered,
              );

              return (
                <g key={zone.id}>
                  <path
                    d={zone.path}
                    fill={fill}
                    stroke={
                      isSelected
                        ? "var(--gold)"
                        : isHovered
                          ? "rgba(224, 167, 44, 0.8)"
                          : "rgba(251, 247, 239, 0.22)"
                    }
                    strokeWidth={isSelected ? "2.5" : isHovered ? "1.75" : "1"}
                    className="cursor-pointer transition-colors duration-150 focus:outline-none"
                    tabIndex={0}
                    role="button"
                    aria-label={`${zoneData?.name ?? zone.id}: ${zoneData?.fgPct}% FG, ${zoneData?.frequency}% frequency`}
                    onClick={() => setSelectedZoneId(zone.id)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    onFocus={() => {
                      setSelectedZoneId(zone.id);
                      setHoveredZoneId(zone.id);
                    }}
                    onBlur={() => setHoveredZoneId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedZoneId(zone.id);
                      }
                    }}
                  />
                  {/* Zone FG% readout rendered directly on hardwood floor */}
                  <text
                    x={zone.labelX}
                    y={zone.labelY}
                    textAnchor="middle"
                    pointerEvents="none"
                    fill={isSelected || isHovered ? "var(--gold)" : "var(--chalk)"}
                    fontSize={zone.id === "restricted" ? "15" : "13"}
                    fontWeight="800"
                    fontFamily="var(--font-display), sans-serif"
                    className="select-none tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {zoneData?.fgPct.toFixed(1)}%
                  </text>
                  <text
                    x={zone.labelX}
                    y={zone.labelY + 12}
                    textAnchor="middle"
                    pointerEvents="none"
                    fill="rgba(251, 247, 239, 0.65)"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="monospace"
                    className="select-none uppercase tracking-wider"
                  >
                    {zoneData?.frequency.toFixed(1)}% vol
                  </text>
                </g>
              );
            })}

            {/* --- COURT STRUCTURAL LINES & MARKINGS (Rendered above fills) --- */}
            {/* Outer court boundaries */}
            <rect
              x="25"
              y="30"
              width="450"
              height="410"
              fill="none"
              stroke="rgba(251, 247, 239, 0.35)"
              strokeWidth="1.5"
              pointerEvents="none"
            />
            {/* Center circle arc at half court */}
            <path
              d="M 190,30 A 60,60 0 0,0 310,30"
              fill="none"
              stroke="rgba(251, 247, 239, 0.3)"
              strokeWidth="1"
              pointerEvents="none"
            />
            {/* Deep / Logo demarcation line */}
            <line
              x1="25"
              y1="100"
              x2="475"
              y2="100"
              stroke="rgba(251, 247, 239, 0.2)"
              strokeWidth="1"
              strokeDasharray="4 4"
              pointerEvents="none"
            />
            {/* Paint Key Outline */}
            <rect
              x="170"
              y="250"
              width="160"
              height="190"
              fill="none"
              stroke="rgba(251, 247, 239, 0.4)"
              strokeWidth="1.25"
              pointerEvents="none"
            />
            {/* Free throw circle: upper arc solid */}
            <path
              d="M 190,250 A 60,60 0 0,1 310,250"
              fill="none"
              stroke="rgba(251, 247, 239, 0.35)"
              strokeWidth="1"
              pointerEvents="none"
            />
            {/* Free throw circle: lower arc dashed */}
            <path
              d="M 190,250 A 60,60 0 0,0 310,250"
              fill="none"
              stroke="rgba(251, 247, 239, 0.25)"
              strokeWidth="1"
              strokeDasharray="4 4"
              pointerEvents="none"
            />
            {/* Three point line */}
            <path
              d="M 55,440 L 55,300 A 214.77,214.77 0 0,1 445,300 L 445,440"
              fill="none"
              stroke="rgba(251, 247, 239, 0.45)"
              strokeWidth="1.25"
              pointerEvents="none"
            />
            {/* Restricted area arc */}
            <path
              d="M 210,405 L 210,390 A 40,40 0 0,1 290,390 L 290,405"
              fill="none"
              stroke="rgba(251, 247, 239, 0.4)"
              strokeWidth="1"
              pointerEvents="none"
            />
            {/* Backboard */}
            <line
              x1="220"
              y1="405"
              x2="280"
              y2="405"
              stroke="var(--chalk)"
              strokeWidth="2.5"
              pointerEvents="none"
            />
            {/* Rim */}
            <circle
              cx="250"
              cy="390"
              r="10"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="2"
              pointerEvents="none"
            />
            {/* Net tick */}
            <line
              x1="250"
              y1="400"
              x2="250"
              y2="405"
              stroke="var(--chalk)"
              strokeWidth="1.5"
              pointerEvents="none"
            />
          </svg>

          {/* Quick instructions indicator overlay on court */}
          <div className="pointer-events-none absolute bottom-3 left-3 bg-wine-deep/80 px-2 py-1 text-[0.6875rem] font-mono uppercase text-chalk/70 backdrop-blur-sm border border-rule-chalk/30">
            Tap / hover sector to inspect
          </div>
        </div>

        {/* ZONE DETAIL INSPECTOR CARD */}
        <div className="flex flex-col justify-between border border-rule bg-maple-light/40 p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block bg-wine px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-chalk font-mono">
                {activeZone.area}
              </span>
              <span className="text-xs font-mono font-medium text-muted">
                {era.name} ({era.period})
              </span>
            </div>

            <h3 className="mt-3 text-2xl font-black text-wine sm:text-3xl">
              {activeZone.name}
            </h3>

            {/* Metric Comparison Line */}
            <div className="mt-6 grid grid-cols-2 gap-6 border-y border-rule py-5">
              <div>
                <Caption className="text-muted">Field Goal Pct</Caption>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
                    {activeZone.fgPct.toFixed(1)}%
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold font-mono",
                      diffVsLeague >= 0 ? "text-leather" : "text-muted",
                    )}
                  >
                    {diffVsLeague >= 0 ? `+${diffVsLeague}%` : `${diffVsLeague}%`}
                  </span>
                </div>
                <span className="text-[0.6875rem] text-muted">
                  League avg: {activeZone.leagueAvg.toFixed(1)}%
                </span>
              </div>

              <div>
                <Caption className="text-muted">Shot Diet Volume</Caption>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="figure text-3xl font-extrabold text-wine sm:text-4xl">
                    {activeZone.frequency.toFixed(1)}%
                  </span>
                </div>
                <span className="text-[0.6875rem] text-muted">
                  Share of all shots taken
                </span>
              </div>
            </div>

            {/* Signature Highlight / Historical Context */}
            <div className="mt-6">
              <Caption bold className="text-wine">
                Signature Moment & Impact
              </Caption>
              <p className="mt-2 font-serif text-sm italic leading-relaxed text-ink/90 sm:text-base">
                “{activeZone.signatureMoment}”
              </p>
            </div>
          </div>

          {/* Efficiency Color Legend */}
          <div className="mt-8 border-t border-rule pt-4">
            <Caption className="text-muted mb-2">Efficiency Legend</Caption>
            <div className="flex flex-wrap items-center gap-4 text-[0.6875rem] font-mono text-muted">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 bg-[#E0A72C]" />
                <span>Elite (70%+)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 bg-[#E0A72C]/60" />
                <span>High (44–69%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 bg-[#B86B1E]/60" />
                <span>Solid (38–43%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 bg-[#5A1626]/70" />
                <span>Perimeter (33–37%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
