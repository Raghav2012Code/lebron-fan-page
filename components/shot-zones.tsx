"use client";

import * as React from "react";

import {
  SHOT_ZONES,
  type EraShotData,
  type ShotZoneData,
} from "@/lib/lebron-data";
import { cn } from "@/lib/utils";
import { Caption, Kicker, PaintRule, RiseWords, type Opener } from "@/components/typeset";

interface CourtZoneConfig {
  id: string;
  path: string;
  labelX: number;
  labelY: number;
}

/**
 * Efficiency bands, declared once and consumed by BOTH `getZoneColor` and the
 * legend. These thresholds used to be hardcoded in each, so a change to the
 * encoder silently desynchronised the legend from the colours it documents.
 * `min` is inclusive.
 */
const ZONE_BANDS = {
  elite: { min: 70, label: "Elite (70%+)" },
  high: { min: 44, label: "High (44–69%)" },
  solid: { min: 38, label: "Solid (38–43%)" },
  perimeter: { min: 33, label: "Perimeter (33–37%)" },
  // Previously undocumented and sharing the Perimeter swatch, so a 32% sector
  // and a 33% sector were indistinguishable via the legend.
  below: { min: 0, label: "Low (<33%)" },
} as const;

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
    labelY: 345,
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
    labelY: 360,
  },
  {
    id: "corner-3-r",
    path: "M 445,440 L 445,300 L 475,300 L 475,440 Z",
    labelX: 460,
    labelY: 360,
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
  if (fgPct >= ZONE_BANDS.elite.min) {
    return "rgba(224, 167, 44, 0.38)";
  }
  if (fgPct >= ZONE_BANDS.high.min) {
    return "rgba(224, 167, 44, 0.24)";
  }
  if (fgPct >= ZONE_BANDS.solid.min) {
    return "rgba(184, 107, 30, 0.22)";
  }
  if (fgPct >= ZONE_BANDS.perimeter.min) {
    return "rgba(90, 22, 38, 0.28)";
  }
  return "rgba(90, 22, 38, 0.16)";
}

/**
 * Opener: `device` -- The full-bleed heat map is the opener; the era rail is its control surface.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "device";

export function ShotZones() {
  const [selectedEraIndex, setSelectedEraIndex] = React.useState(1); // Default to Miami Peak (apex efficiency)
  const [selectedZoneId, setSelectedZoneId] = React.useState("restricted");
  const [hoveredZoneId, setHoveredZoneId] = React.useState<string | null>(null);

  const era: EraShotData = SHOT_ZONES.eras[selectedEraIndex];
  const activeZoneId = hoveredZoneId ?? selectedZoneId;
  const activeZone: ShotZoneData =
    era.zones[activeZoneId] ?? era.zones["restricted"];

  // What the LIVE REGION reads, which is not the same thing as what the panel
  // highlights. Hover drives the highlight and must not drive an announcement;
  // see the note on the `aria-live` paragraph below.
  const announcedZone: ShotZoneData =
    era.zones[selectedZoneId] ?? era.zones["restricted"];

  // This is a difference of two percentages, i.e. PERCENTAGE POINTS. Labelling
  // it "%" invited the reader to compute it relatively (77.2 vs 61.2 is
  // +26%, not +16%). Kept as a number so the precision is not discarded by a
  // unary +.
  const diffVsLeague = Math.round((activeZone.fgPct - activeZone.leagueAvg) * 10) / 10;
  const announcedDiff =
    Math.round((announcedZone.fgPct - announcedZone.leagueAvg) * 10) / 10;

  return (
    <section
      id="shot-zones"
      aria-label="The heat map: career shot zones and scoring evolution"
      className="scroll-clearance relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8"
    >
      {/* --- Section Header ---
          Opener: device. The heat map below is this section's opener, so the
          header is deliberately thin — one heading, one line of copy, and then
          straight into the instrument. The eyebrow that stood here restated the
          heading and is gone (F-02). */}
      <div className="max-w-3xl">
        <h2
          className="headline text-wine"
          style={{ fontSize: "clamp(1.875rem, 4.5vw, 3rem)" }}
        >
          <RiseWords text={SHOT_ZONES.subheading} />
        </h2>
        <p className="mt-3 text-base text-ink sm:text-lg">{SHOT_ZONES.copy}</p>
      </div>

      <PaintRule className="my-6" />

      {/* --- Era Control Rail ---
          Was a four-across grid of cards, one of seven identical bands on the
          page (F-01). Now a rail in the instrument's top edge: full-bleed to the
          section, hairline dividers, no per-item frames, the active era marked
          by a gold rule rather than a filled panel. Same tablist semantics —
          roving tabindex, arrow keys, Home/End — unchanged, because the
          tablists were fixed under issue #25 and must not regress. */}
      <div
        role="tablist"
        aria-label="Career Scoring Eras"
        className="-mx-4 flex flex-wrap border-y border-rule px-4 sm:mx-0 sm:px-0"
      >
        {SHOT_ZONES.eras.map((e, idx) => {
          const isCurrent = idx === selectedEraIndex;
          return (
            <button
              key={e.id}
              id={`shot-zones-era-tab-${e.id}`}
              role="tab"
              aria-selected={isCurrent}
              aria-controls="shot-zones-era-panel"
              // Roving tabindex: one tab stop for the whole group, with
              // arrow keys moving between eras. Previously every tab was
              // tabbable and arrow keys did nothing.
              tabIndex={isCurrent ? 0 : -1}
              onKeyDown={(ev) => {
                const last = SHOT_ZONES.eras.length - 1;
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
                setSelectedEraIndex(next);
                document
                  .getElementById(`shot-zones-era-tab-${SHOT_ZONES.eras[next].id}`)
                  ?.focus();
              }}
              onClick={() => setSelectedEraIndex(idx)}
              className={cn(
                "group relative flex min-w-[9rem] flex-1 flex-col gap-0.5 border-r border-rule px-4 py-3 text-left transition-colors last:border-r-0 hover:bg-maple-deep/50",
                isCurrent ? "text-wine" : "text-ink",
              )}
            >
              <span className="narrow text-[0.6875rem] text-muted">
                {e.period}
              </span>
              <span className="headline text-base">{e.name}</span>
              <span className="text-xs text-muted">{e.tagline}</span>
              {isCurrent ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-px h-[3px] bg-wine"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* --- Era Narrative & Headline Metrics ---
          The four figures were a second four-across band (F-01) and they are the
          site of F-04: the panel showed `FG% 54.3` in the row while the sentence
          beside it read "peaked at 56.5% FG in 2012-13", with nothing on screen
          saying the row is a four-season aggregate and the sentence is one
          season. Both figures are real and verified (DESIGN-AUDIT.md F-04/F-04b),
          so the fix is the qualifier, not a deletion — and the qualifier is now
          a visible line above the row, not a tooltip. */}
      <div
        id="shot-zones-era-panel"
        role="tabpanel"
        aria-labelledby={`shot-zones-era-tab-${era.id}`}
        className="mt-6 border border-rule bg-maple-deep/40 p-4 sm:p-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <span className="narrow text-[0.6875rem] text-wine">
              {era.team}, {era.period}
            </span>
            <p className="mt-1 text-sm text-ink sm:text-base leading-relaxed">
              {era.narrative}
            </p>
          </div>
          <div className="shrink-0 border-t border-rule pt-4 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-6">
            <Kicker className="text-[0.8125rem] font-semibold">
              {era.games}-game average
            </Kicker>
            <dl className="mt-2 flex gap-5 sm:gap-6">
              {(
                [
                  ["PPG", era.ppg.toFixed(1), ""],
                  ["FG%", era.fgPct.toFixed(1), "%"],
                  ["3P%", era.threePtPct.toFixed(1), "%"],
                  ["FT%", era.ftPct.toFixed(1), "%"],
                ] as const
              ).map(([label, value, unit]) => (
                <div key={label}>
                  <dt>
                    <Caption className="text-muted">{label}</Caption>
                  </dt>
                  <dd className="figure text-xl text-wine sm:text-2xl">
                    {value}
                    {unit}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* --- Main Court & Detail Grid --- */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {/* THE HALF COURT SCHEMATIC */}
        <div className="relative aspect-[500/470] w-full overflow-hidden border border-rule-chalk bg-wine-deep shadow-2xl">
          <svg
            /* `font-text` on the root, and no font-family attribute on any
               <text>. SVG <text> has no family of its own, so without this the
               nine sector labels ("37.5% vol" and friends) fall back to the
               browser's default monospace — a third family on the page that no
               grep for the monospace utility in components/ could ever catch, because the
               monospace was a presentation ATTRIBUTE, not a class. Note the
               sibling percentage labels are deliberately `var(--font-display)`:
               those are scoreboard figures, so Oswald is correct there. */
            className="absolute inset-0 h-full w-full select-none font-text"
            viewBox="0 0 500 470"
            preserveAspectRatio="xMidYMid meet"
            /* `role="group"`, matching the sibling in `last-shot`: the nine zone
               sectors inside are `role="button"`, and a container of buttons
               wants a group so the chart is announced as one named thing rather
               than a bare `aria-label` on an element with no role. */
            role="group"
            aria-label={`Interactive half court shot chart for ${era.name}`}
          >
            {/* Base court floor background */}
            <rect
              x="0"
              y="0"
              width="500"
              height="470"
              fill="var(--court-paint)"
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
                    // Without aria-pressed a screen reader announces a plain
                    // button and never says which sector is selected.
                    aria-pressed={isSelected}
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
                  {/* These are SVG user units, so they scale with the
                      viewBox. At a 375px viewport the court renders 343px
                      wide against a 500-unit viewBox — a 0.686 scale that
                      turned `fontSize="9"` into 6.15 rendered px. Sizes are
                      now set so the smallest lands near 9.5px on mobile. */}
                  <text
                    x={zone.labelX}
                    y={zone.labelY}
                    textAnchor="middle"
                    pointerEvents="none"
                    fill={isSelected || isHovered ? "var(--gold)" : "var(--chalk)"}
                    fontSize={zone.id === "restricted" ? "24" : "20"}
                    fontWeight="800"
                    fontFamily="var(--font-display), sans-serif"
                    className="select-none tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {zoneData?.fgPct.toFixed(1)}%
                  </text>
                  <text
                    x={zone.labelX}
                    y={zone.labelY + 17}
                    textAnchor="middle"
                    pointerEvents="none"
                    fill="rgba(251, 247, 239, 0.65)"
                    fontSize="14"
                    fontWeight="600"
                    /* Was fontFamily="monospace" — a presentation attribute, so
                       it beat the `font-text` on the <svg> root and put nine
                       labels on the page in a third family. `tracking-wider` is
                       kept because the widest-tracking ban is about eyebrows,
                       not about a volume label set small on a diagram. */
                    className="select-none font-text uppercase tracking-wider"
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
            {/* Free throw circle. The basket is at the BOTTOM of this
                schematic (baseline y=440, rim cy=390), and on a real court the
                half of the circle nearest the basket is solid while the half
                beyond the line is dashed. Sweep 1 bulges toward y=310, i.e.
                toward the basket, so that is the solid half. */}
            <path
              d="M 190,250 A 60,60 0 0,1 310,250"
              fill="none"
              stroke="rgba(251, 247, 239, 0.35)"
              strokeWidth="1"
              pointerEvents="none"
            />
            {/* Free throw circle: arc away from the basket, dashed */}
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
          <div className="pointer-events-none absolute bottom-3 left-3 bg-wine-deep/80 px-2 py-1 text-[0.6875rem] narrow text-chalk-dim backdrop-blur-sm border border-rule-chalk/30">
            Tap / hover sector to inspect
          </div>
        </div>

        {/* ZONE DETAIL INSPECTOR CARD */}
        <div className="flex flex-col justify-between border border-rule bg-maple-deep/40 p-6 sm:p-8">
          {/* The panel's league average, delta and signature moment are
              conveyed only through this visually-updated region. Without a
              live region a screen-reader user gets no announcement when the
              selected sector changes.

              It announces the SELECTED sector, not the hovered one. Hover is
              not a state change worth announcing: sweeping the pointer across
              the nine sectors produced nine announcements, and leaving one
              produced a tenth reverting to the selection. The hover highlight
              below is still visual-only, which is what hover should be; a
              keyboard user gets the announcement on arrow-key focus, which
              sets `hoveredZoneId` through `onFocus` and moves the selection
              with the arrow keys. */}
          <p aria-live="polite" className="sr-only">
            {`${announcedZone.name}: ${announcedZone.fgPct.toFixed(1)} percent field goal, league average ${announcedZone.leagueAvg.toFixed(1)} percent, ${announcedDiff >= 0 ? "plus" : "minus"} ${Math.abs(announcedDiff)} percentage points, ${announcedZone.frequency.toFixed(1)} percent of shots.`}
          </p>
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="narrow-bold inline-block bg-wine px-2.5 py-1 text-[0.6875rem] text-chalk">
                {activeZone.area}
              </span>
              <span className="text-xs font-medium tabular-nums text-muted">
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
                      "narrow text-xs",
                      diffVsLeague >= 0 ? "text-wine" : "text-muted",
                    )}
                  >
                    {diffVsLeague >= 0
                      ? `+${diffVsLeague} pts`
                      : `${diffVsLeague} pts`}
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
              <p className="mt-2 text-sm italic leading-relaxed text-ink/90 sm:text-base">
                {activeZone.signatureMoment}
              </p>
            </div>
          </div>

          {/* Efficiency Color Legend. Swatch opacity is raised above the zone
              fill alpha so the key stays legible against maple; the band
              labels and thresholds come from ZONE_BANDS so they cannot drift
              from the encoder. */}
          <div className="mt-8 border-t border-rule pt-4">
            <Caption className="text-muted mb-2">Efficiency Legend</Caption>
            <div className="narrow flex flex-wrap items-center gap-4 text-[0.6875rem] text-muted">
              {(
                [
                  [ZONE_BANDS.elite.label, "bg-gold"],
                  [ZONE_BANDS.high.label, "bg-gold/60"],
                  [ZONE_BANDS.solid.label, "bg-band-solid/70"],
                  [ZONE_BANDS.perimeter.label, "bg-wine/70"],
                  [ZONE_BANDS.below.label, "bg-wine/40"],
                ] as const
              ).map(([label, swatch]) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-3 w-3", swatch)} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
