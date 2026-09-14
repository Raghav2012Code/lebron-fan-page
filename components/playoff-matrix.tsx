"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  FRANCHISE_BREAKDOWN,
  PLAYOFF_SERIES,
  type FranchisePostseasonRecord,
  type PlayoffRoundCategory,
  type PlayoffSeries,
} from "@/lib/lebron-data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Caption, Counter, PaintRule, RiseWords } from "@/components/typeset";

type RoundFilter = "ALL" | PlayoffRoundCategory;
type OutcomeFilter = "ALL" | "W" | "L";
type ViewMode = "matrix" | "franchises";

interface RoundTabMeta {
  id: RoundFilter;
  label: string;
  shortLabel: string;
  record: string;
  count: number;
}

const ROUND_TABS: readonly RoundTabMeta[] = [
  {
    id: "ALL",
    label: "All Rounds",
    shortLabel: "All",
    record: "42–15",
    count: 57,
  },
  {
    id: "First Round",
    label: "First Round",
    shortLabel: "1st Round",
    record: "16–3",
    count: 19,
  },
  {
    id: "Conf Semifinals",
    label: "Conference Semifinals",
    shortLabel: "Conf Semis",
    record: "12–4",
    count: 16,
  },
  {
    id: "Conf Finals",
    label: "Conference Finals",
    shortLabel: "Conf Finals",
    record: "10–2",
    count: 12,
  },
  {
    id: "NBA Finals",
    label: "NBA Finals",
    shortLabel: "Finals",
    record: "4–6",
    count: 10,
  },
] as const;

function teamColor(team: string) {
  switch (team) {
    case "CLE":
      return "#5A1626"; // wine
    case "MIA":
      return "#7A1810"; // crimson
    case "LAL":
      return "#3B2352"; // purple
    default:
      return "var(--wine)";
  }
}

export function PlayoffMatrix() {
  const [activeRound, setActiveRound] = React.useState<RoundFilter>("ALL");
  const [outcomeFilter, setOutcomeFilter] = React.useState<OutcomeFilter>("ALL");
  const [sweepsOnly, setSweepsOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFranchise, setSelectedFranchise] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>("matrix");
  const [inspectSeries, setInspectSeries] = React.useState<PlayoffSeries | null>(null);

  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = React.useRef<HTMLElement | null>(null);

  // Close drawer on Escape key and manage focus
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && inspectSeries) {
        e.preventDefault();
        setInspectSeries(null);
      }
    }
    if (inspectSeries) {
      lastActiveElementRef.current = document.activeElement as HTMLElement;
      window.addEventListener("keydown", handleKeyDown);
      // Focus drawer close button
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else if (lastActiveElementRef.current) {
      lastActiveElementRef.current.focus();
      lastActiveElementRef.current = null;
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inspectSeries]);

  // Filter series based on user selections
  const filteredSeries = React.useMemo(() => {
    return PLAYOFF_SERIES.filter((s) => {
      // Round filter
      if (activeRound !== "ALL") {
        if (s.roundCategory !== activeRound && s.round !== activeRound) {
          return false;
        }
      }
      // Outcome filter
      if (outcomeFilter !== "ALL" && s.result !== outcomeFilter) {
        return false;
      }
      // Sweeps filter
      if (sweepsOnly && !s.isSweep) {
        return false;
      }
      // Franchise filter
      if (selectedFranchise && s.opponentAbbr !== selectedFranchise && s.franchise !== selectedFranchise) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchYear = s.year.toString().includes(q);
        const matchOpponent = (s.opponentName ?? s.opponent).toLowerCase().includes(q);
        const matchAbbr = s.opponentAbbr.toLowerCase().includes(q);
        const matchTeam = s.team.toLowerCase().includes(q);
        const matchMoment = s.signatureMoment.toLowerCase().includes(q);
        if (!matchYear && !matchOpponent && !matchAbbr && !matchTeam && !matchMoment) {
          return false;
        }
      }
      return true;
    });
  }, [activeRound, outcomeFilter, sweepsOnly, selectedFranchise, searchQuery]);

  // Totals for filtered subset
  const filteredRecord = React.useMemo(() => {
    const wins = filteredSeries.filter((s) => s.result === "W").length;
    const losses = filteredSeries.filter((s) => s.result === "L").length;
    const sweeps = filteredSeries.filter((s) => s.isSweep && s.result === "W").length;
    const swept = filteredSeries.filter((s) => s.isSweep && s.result === "L").length;
    const totalPoints = filteredSeries.reduce((acc, s) => acc + (s.boxScoreTotals?.pts ?? s.lebronStats.totalPoints), 0);
    const totalGames = filteredSeries.reduce((acc, s) => acc + s.games, 0);
    return { wins, losses, sweeps, swept, totalPoints, totalGames };
  }, [filteredSeries]);

  // Keyboard navigation for round tabs
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % ROUND_TABS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + ROUND_TABS.length) % ROUND_TABS.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = ROUND_TABS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setActiveRound(ROUND_TABS[nextIndex].id);
    const target = document.getElementById(`round-tab-${ROUND_TABS[nextIndex].id}`);
    target?.focus();
  };

  return (
    <section
      id="playoff-matrix"
      aria-labelledby="playoff-matrix-heading"
      className="floor relative py-20 sm:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse" aria-hidden="true" />
              <Caption bold className="text-gold uppercase tracking-wider">
                Postseason Historical Ledger
              </Caption>
            </div>
            <h2
              id="playoff-matrix-heading"
              className="monument text-wine mt-3"
              style={{ fontSize: "clamp(2.5rem, 8vw, 6.5rem)" }}
            >
              <RiseWords text="THE PLAYOFF MATRIX" />
            </h2>
          </div>

          {/* View mode toggle */}
          <div
            role="group"
            aria-label="View toggle"
            className="inline-flex rounded-md p-1 bg-maple-deep/50 border border-rule self-start md:self-end"
          >
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={cn(
                "relative px-4 py-2 text-xs uppercase tracking-wider narrow-bold rounded transition-colors duration-150",
                viewMode === "matrix" ? "text-chalk" : "text-wine hover:text-wine-deep",
              )}
            >
              {viewMode === "matrix" && (
                <motion.div
                  layoutId="view-pill-bg"
                  className="absolute inset-0 rounded bg-wine"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Series Ledger (57)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("franchises")}
              className={cn(
                "relative px-4 py-2 text-xs uppercase tracking-wider narrow-bold rounded transition-colors duration-150",
                viewMode === "franchises" ? "text-chalk" : "text-wine hover:text-wine-deep",
              )}
            >
              {viewMode === "franchises" && (
                <motion.div
                  layoutId="view-pill-bg"
                  className="absolute inset-0 rounded bg-wine"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Franchises (25)</span>
            </button>
          </div>
        </div>

        {/* Narrative Standfirst */}
        <motion.p
          className="prose-copy mt-6 max-w-[64ch] text-[1.0625rem] text-muted sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_SOON}
          transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.2 }}
        >
          Across 23 seasons and 57 postseason series, LeBron James has amassed an all-time series record of{" "}
          <strong className="text-wine font-semibold">42 wins and 15 losses (73.7%)</strong> over 302 games—scoring{" "}
          <strong className="text-wine font-semibold">8,521 points</strong>, the most in NBA history. He holds the league record with{" "}
          <strong className="text-wine font-semibold">12 series sweeps</strong> while facing 25 distinct opponent franchises.
        </motion.p>

        {/* Aggregate Headline Cards */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded border border-rule bg-maple-deep/40 backdrop-blur-xs">
            <Caption bold className="text-muted block">All-Time Series</Caption>
            <div className="figure text-2xl sm:text-3xl lg:text-4xl text-wine mt-1">
              <Counter to={42} />–<Counter to={15} />
            </div>
            <Caption className="text-muted mt-1 block">57 series • 73.7% Win Rate</Caption>
          </div>

          <div className="p-4 rounded border border-rule bg-maple-deep/40 backdrop-blur-xs">
            <Caption bold className="text-muted block">Playoff Games</Caption>
            <div className="figure text-2xl sm:text-3xl lg:text-4xl text-wine mt-1">
              <Counter to={302} />
            </div>
            <Caption className="text-muted mt-1 block">182–120 • 60.3% game mark</Caption>
          </div>

          <div className="p-4 rounded border border-rule bg-maple-deep/40 backdrop-blur-xs">
            <Caption bold className="text-muted block">Playoff Scoring</Caption>
            <div className="figure text-2xl sm:text-3xl lg:text-4xl text-wine mt-1">
              <Counter to={8521} />
            </div>
            <Caption className="text-muted mt-1 block">28.2 PPG • Most in history</Caption>
          </div>

          <div className="p-4 rounded border border-rule bg-maple-deep/40 backdrop-blur-xs">
            <Caption bold className="text-muted block">Sweeps Mastery</Caption>
            <div className="figure text-2xl sm:text-3xl lg:text-4xl text-gold mt-1">
              <Counter to={12} />W – <Counter to={4} />L
            </div>
            <Caption className="text-muted mt-1 block">12 sweeps won (NBA record)</Caption>
          </div>
        </div>

        <div className="my-8">
          <PaintRule color="var(--rule-strong)" thickness={1} />
        </div>

        {/* Controls Section */}
        {viewMode === "matrix" ? (
          <div className="space-y-6">
            {/* Round Filter Tabs */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <Caption bold className="text-wine uppercase tracking-wider text-xs">
                  Filter By Playoff Round
                </Caption>
                <div aria-live="polite" className="text-xs narrow text-muted">
                  Showing {filteredSeries.length} of 57 series ({filteredRecord.wins}–{filteredRecord.losses})
                </div>
              </div>

              <div
                role="tablist"
                aria-label="Playoff rounds"
                className="flex flex-wrap gap-2 sm:gap-3 p-1 rounded-md bg-maple-deep/40 border border-rule"
              >
                {ROUND_TABS.map((tab, idx) => {
                  const isActive = activeRound === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`round-tab-${tab.id}`}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls="playoff-matrix-grid"
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => {
                        setActiveRound(tab.id);
                        setSelectedFranchise(null);
                      }}
                      onKeyDown={(e) => handleTabKeyDown(e, idx)}
                      className={cn(
                        "relative flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2.5 rounded text-left transition-colors duration-150",
                        isActive ? "text-chalk shadow-xs" : "text-wine hover:bg-maple/70",
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-round-tab-bg"
                          className="absolute inset-0 rounded bg-wine"
                          transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
                        />
                      )}
                      <div className="relative z-10 flex flex-col">
                        <span className="narrow-bold text-xs uppercase tracking-wider sm:inline hidden">
                          {tab.label}
                        </span>
                        <span className="narrow-bold text-xs uppercase tracking-wider sm:hidden inline">
                          {tab.shortLabel}
                        </span>
                        <span className={cn("text-[0.6875rem] narrow font-normal mt-0.5", isActive ? "text-gold" : "text-muted")}>
                          {tab.record} ({tab.count})
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Bar: Outcome, Sweeps, Search, Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Outcome Toggle */}
                <div role="group" aria-label="Outcome filter" className="inline-flex rounded border border-rule bg-maple-deep/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setOutcomeFilter("ALL")}
                    className={cn(
                      "px-2.5 py-1 text-xs narrow-bold rounded transition-colors",
                      outcomeFilter === "ALL" ? "bg-wine text-chalk" : "text-wine hover:text-wine-deep",
                    )}
                  >
                    All ({filteredRecord.wins + filteredRecord.losses})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutcomeFilter("W")}
                    className={cn(
                      "px-2.5 py-1 text-xs narrow-bold rounded transition-colors",
                      outcomeFilter === "W" ? "bg-wine text-chalk" : "text-wine hover:text-wine-deep",
                    )}
                  >
                    Won ({filteredRecord.wins})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutcomeFilter("L")}
                    className={cn(
                      "px-2.5 py-1 text-xs narrow-bold rounded transition-colors",
                      outcomeFilter === "L" ? "bg-wine text-chalk" : "text-wine hover:text-wine-deep",
                    )}
                  >
                    Lost ({filteredRecord.losses})
                  </button>
                </div>

                {/* Sweeps Only Checkbox / Button */}
                <button
                  type="button"
                  aria-pressed={sweepsOnly}
                  onClick={() => setSweepsOnly(!sweepsOnly)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded border text-xs narrow-bold transition-colors",
                    sweepsOnly
                      ? "bg-gold text-wine border-gold shadow-xs"
                      : "bg-maple-deep/40 border-rule text-wine hover:border-wine hover:bg-maple-deep/60",
                  )}
                >
                  <span aria-hidden className="text-sm">★</span>
                  <span>Sweeps Only ({sweepsOnly ? filteredSeries.length : "16"})</span>
                </button>

                {/* Active Franchise Filter Pill if selected */}
                {selectedFranchise && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-wine text-chalk text-xs narrow-bold">
                    <span>vs {selectedFranchise}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFranchise(null)}
                      className="hover:text-gold ml-1 focus-visible:outline-none"
                      aria-label={`Clear ${selectedFranchise} filter`}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search opponent, year..."
                  aria-label="Search playoff series"
                  className="w-full px-3 py-1.5 rounded border border-rule bg-maple-deep/40 text-wine text-xs narrow placeholder:text-muted/70 focus:bg-maple-deep/60 focus:border-wine focus:ring-1 focus:ring-wine outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-wine text-xs"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Series Cards Grid */}
            <div
              id="playoff-matrix-grid"
              role="region"
              aria-label="Playoff series results"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-6"
            >
              {filteredSeries.map((series) => {
                const isWon = series.result === "W";
                return (
                  <motion.div
                    key={series.id ?? `${series.year}-${series.roundCode}`}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-expanded={inspectSeries?.id === series.id}
                    onClick={() => setInspectSeries(series)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setInspectSeries(series);
                      }
                    }}
                    className={cn(
                      "group relative flex flex-col justify-between p-4 rounded-md border text-left cursor-pointer transition-all duration-200",
                      "bg-maple-deep/40 hover:bg-maple-deep/75 border-rule hover:border-wine hover:shadow-md",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine focus-visible:outline-offset-2",
                    )}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* Top Metadata Row */}
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-rule/60 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="px-1.5 py-0.5 rounded text-[0.6875rem] narrow-bold text-chalk"
                            style={{ backgroundColor: teamColor(series.team) }}
                          >
                            {series.team}
                          </span>
                          <span className="figure text-sm text-wine">{series.year}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {series.isSweep && (
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[0.625rem] narrow-bold uppercase tracking-wider",
                                isWon ? "bg-gold text-wine" : "bg-leather/20 text-leather",
                              )}
                            >
                              {isWon ? "★ Sweep" : "Swept"}
                            </span>
                          )}
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-xs narrow-bold",
                              isWon ? "bg-wine text-chalk" : "bg-wine/15 text-wine border border-wine/25",
                            )}
                          >
                            {series.result} {series.seriesScore ?? `${series.wins}–${series.losses}`}
                          </span>
                        </div>
                      </div>

                      {/* Opponent & Round */}
                      <div className="mt-3">
                        <div className="text-[0.6875rem] narrow uppercase text-muted tracking-wider">
                          {series.roundName ?? series.round}
                        </div>
                        <div className="headline text-lg sm:text-xl text-wine mt-0.5 flex items-baseline justify-between">
                          <span className="truncate">{series.opponentName ?? series.opponent}</span>
                          <span className="text-xs narrow-bold text-muted ml-2 shrink-0">{series.opponentAbbr}</span>
                        </div>
                      </div>

                      {/* LeBron Series Slash Stats */}
                      <div className="mt-3 p-2.5 rounded bg-maple-deep/60 border border-rule/50">
                        <div className="flex items-baseline justify-between text-wine">
                          <div className="flex items-baseline gap-1">
                            <span className="figure text-lg font-bold">
                              {series.ppg ?? series.lebronStats.ppg}
                            </span>
                            <span className="text-[0.6875rem] narrow text-muted">PPG</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="figure text-lg font-bold">
                              {series.rpg ?? series.lebronStats.rpg}
                            </span>
                            <span className="text-[0.6875rem] narrow text-muted">RPG</span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="figure text-lg font-bold">
                              {series.apg ?? series.lebronStats.apg}
                            </span>
                            <span className="text-[0.6875rem] narrow text-muted">APG</span>
                          </div>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[0.6875rem] narrow text-muted">
                          <span>{series.boxScoreTotals?.pts ?? series.lebronStats.totalPoints} Total PTS</span>
                          <span>{series.totalGames ?? series.games} Games</span>
                        </div>
                      </div>

                      {/* Signature Moment Snippet */}
                      <p className="mt-2.5 text-xs prose-copy line-clamp-2 text-muted italic">
                        &ldquo;{series.signatureMoment}&rdquo;
                      </p>
                    </div>

                    {/* Bottom Prompt */}
                    <div className="mt-4 pt-2 border-t border-rule/40 flex items-center justify-between text-[0.6875rem] narrow text-muted group-hover:text-wine transition-colors">
                      <span>Inspect Series Box Score</span>
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty state */}
            {filteredSeries.length === 0 && (
              <div className="p-12 text-center rounded-md border border-dashed border-rule bg-maple-deep/30">
                <Caption bold className="text-wine text-base block">No series found matching these criteria</Caption>
                <Caption className="text-muted mt-1 block">Try clearing the search query or resetting the filters.</Caption>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRound("ALL");
                    setOutcomeFilter("ALL");
                    setSweepsOnly(false);
                    setSelectedFranchise(null);
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 rounded bg-wine text-chalk narrow-bold text-xs uppercase tracking-wider hover:bg-wine-deep"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Franchise Breakdown View (25 Opponents) */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Caption bold className="text-wine uppercase tracking-wider text-xs">
                  Head-To-Head Postseason Records Across 25 NBA Franchises
                </Caption>
                <p className="text-xs text-muted narrow mt-0.5">
                  Click any franchise to filter the ledger by all postseason series played against them.
                </p>
              </div>
              <div className="text-xs narrow text-muted">
                25 franchises faced • 42 series wins • 15 series losses
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FRANCHISE_BREAKDOWN.map((f: FranchisePostseasonRecord) => {
                const hasWonSeries = f.seriesWon > f.seriesLost;
                const isTied = f.seriesWon === f.seriesLost;
                return (
                  <div
                    key={f.abbr}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedFranchise(f.abbr);
                      setViewMode("matrix");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedFranchise(f.abbr);
                        setViewMode("matrix");
                      }
                    }}
                    className={cn(
                      "group p-4 rounded-md border text-left cursor-pointer transition-all duration-150",
                      "bg-maple-deep/40 hover:bg-maple-deep/75 border-rule hover:border-wine hover:shadow-md",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine focus-visible:outline-offset-2",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="headline text-lg text-wine group-hover:text-wine-deep">
                          {f.name}
                        </div>
                        <div className="text-xs narrow text-muted mt-0.5">
                          {f.years.join(", ")}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs narrow-bold bg-maple-deep/70 text-wine border border-rule">
                        {f.abbr}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-4 grid grid-cols-3 gap-2 p-2 rounded bg-maple-deep/60 border border-rule/50">
                      <div>
                        <Caption className="text-muted block text-[0.6875rem]">Series</Caption>
                        <div className={cn("figure text-base font-bold", hasWonSeries ? "text-wine" : isTied ? "text-muted" : "text-leather")}>
                          {f.seriesWon}–{f.seriesLost}
                        </div>
                      </div>
                      <div>
                        <Caption className="text-muted block text-[0.6875rem]">Games</Caption>
                        <div className="figure text-base text-wine">
                          {f.gamesWon}–{f.gamesLost}
                        </div>
                      </div>
                      <div>
                        <Caption className="text-muted block text-[0.6875rem]">Sweeps</Caption>
                        <div className="figure text-base text-gold">
                          {f.sweepsWon}W / {f.sweepsLost}L
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[0.6875rem] narrow text-muted group-hover:text-wine">
                      <span>View {f.seriesPlayed} series in ledger</span>
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail Inspection Drawer / Modal */}
      <AnimatePresence>
        {inspectSeries && (
          <div
            className="fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-series-title"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setInspectSeries(null)}
              className="fixed inset-0 bg-wine-deep/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className={cn(
                "relative z-10 w-full max-w-2xl bg-[#FBF7EF] h-full shadow-2xl border-l-2 border-wine",
                "flex flex-col justify-between overflow-y-auto p-6 sm:p-8",
              )}
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-start justify-between gap-4 border-b border-rule pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs narrow-bold text-chalk"
                        style={{ backgroundColor: teamColor(inspectSeries.team) }}
                      >
                        {inspectSeries.team}
                      </span>
                      <Caption bold className="text-gold uppercase tracking-wider text-xs">
                        {inspectSeries.year} {inspectSeries.roundName ?? inspectSeries.round}
                      </Caption>
                    </div>
                    <h3 id="drawer-series-title" className="headline text-2xl sm:text-3xl text-wine mt-2">
                      vs {inspectSeries.opponentName ?? inspectSeries.opponent}
                    </h3>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setInspectSeries(null)}
                    aria-label="Close series details"
                    className="p-2 rounded-full text-muted hover:text-wine hover:bg-maple/80 transition-colors focus-visible:outline-wine"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Series Outcome Summary Banner */}
                <div className="mt-6 p-4 rounded-md bg-maple/50 border border-rule flex items-center justify-between">
                  <div>
                    <div className="text-xs narrow uppercase text-muted tracking-wider">Series Result</div>
                    <div className="figure text-xl sm:text-2xl text-wine font-bold mt-0.5">
                      {inspectSeries.result === "W" ? "Won Series" : "Lost Series"} ({inspectSeries.seriesScore ?? `${inspectSeries.wins}–${inspectSeries.losses}`})
                    </div>
                  </div>
                  {inspectSeries.isSweep && (
                    <span className="px-3 py-1 rounded bg-gold text-wine narrow-bold text-xs uppercase tracking-wider">
                      {inspectSeries.result === "W" ? "4–0 Sweep Victory" : "0–4 Sweep Loss"}
                    </span>
                  )}
                </div>

                {/* LeBron Series Scoring & Per-Game Averages */}
                <div className="mt-6">
                  <Caption bold className="text-wine uppercase tracking-wider text-xs block mb-3">
                    LeBron James Series Averages & Totals
                  </Caption>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded bg-chalk border border-rule">
                      <Caption className="text-muted block text-xs">Points / Game</Caption>
                      <div className="figure text-2xl text-wine mt-1">
                        {inspectSeries.ppg ?? inspectSeries.lebronStats.ppg}
                      </div>
                      <Caption className="text-muted text-[0.6875rem] mt-0.5 block">
                        {inspectSeries.boxScoreTotals?.pts ?? inspectSeries.lebronStats.totalPoints} total PTS
                      </Caption>
                    </div>

                    <div className="p-3 rounded bg-chalk border border-rule">
                      <Caption className="text-muted block text-xs">Rebounds / Game</Caption>
                      <div className="figure text-2xl text-wine mt-1">
                        {inspectSeries.rpg ?? inspectSeries.lebronStats.rpg}
                      </div>
                      <Caption className="text-muted text-[0.6875rem] mt-0.5 block">
                        {inspectSeries.boxScoreTotals?.reb} total REB
                      </Caption>
                    </div>

                    <div className="p-3 rounded bg-chalk border border-rule">
                      <Caption className="text-muted block text-xs">Assists / Game</Caption>
                      <div className="figure text-2xl text-wine mt-1">
                        {inspectSeries.apg ?? inspectSeries.lebronStats.apg}
                      </div>
                      <Caption className="text-muted text-[0.6875rem] mt-0.5 block">
                        {inspectSeries.boxScoreTotals?.ast} total AST
                      </Caption>
                    </div>

                    <div className="p-3 rounded bg-chalk border border-rule">
                      <Caption className="text-muted block text-xs">Defense / Game</Caption>
                      <div className="figure text-xl text-wine mt-1">
                        {inspectSeries.spg ?? 0}S / {inspectSeries.bpg ?? 0}B
                      </div>
                      <Caption className="text-muted text-[0.6875rem] mt-0.5 block">
                        {inspectSeries.boxScoreTotals?.stl} stl • {inspectSeries.boxScoreTotals?.blk} blk
                      </Caption>
                    </div>
                  </div>
                </div>

                {/* Shooting Splits & Box Score Totals */}
                {inspectSeries.boxScoreTotals && (
                  <div className="mt-6">
                    <Caption bold className="text-wine uppercase tracking-wider text-xs block mb-3">
                      Shooting Efficiency & Detailed Box Score
                    </Caption>
                    <div className="p-4 rounded-md bg-chalk border border-rule space-y-3">
                      <div className="grid grid-cols-3 gap-2 pb-3 border-b border-rule/60 text-center">
                        <div>
                          <Caption className="text-muted block text-xs">Field Goals</Caption>
                          <div className="narrow-bold text-wine text-base mt-0.5">
                            {((inspectSeries.fgPct ?? 0) * 100).toFixed(1)}%
                          </div>
                          <Caption className="text-muted text-[0.6875rem]">
                            {inspectSeries.boxScoreTotals.fgm}/{inspectSeries.boxScoreTotals.fga} FGM/A
                          </Caption>
                        </div>
                        <div>
                          <Caption className="text-muted block text-xs">Three-Pointers</Caption>
                          <div className="narrow-bold text-wine text-base mt-0.5">
                            {((inspectSeries.threePtPct ?? 0) * 100).toFixed(1)}%
                          </div>
                          <Caption className="text-muted text-[0.6875rem]">
                            3PT Percentage
                          </Caption>
                        </div>
                        <div>
                          <Caption className="text-muted block text-xs">Free Throws</Caption>
                          <div className="narrow-bold text-wine text-base mt-0.5">
                            {((inspectSeries.ftPct ?? 0) * 100).toFixed(1)}%
                          </div>
                          <Caption className="text-muted text-[0.6875rem]">
                            {inspectSeries.boxScoreTotals.ftm}/{inspectSeries.boxScoreTotals.fta} FTM/A
                          </Caption>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs narrow text-muted pt-1">
                        <span>Turnovers: <strong className="text-wine">{inspectSeries.boxScoreTotals.tov}</strong></span>
                        <span>Games Played: <strong className="text-wine">{inspectSeries.totalGames ?? inspectSeries.games}</strong></span>
                        <span>Team: <strong className="text-wine">{inspectSeries.teamName ?? inspectSeries.team}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signature Moment */}
                <div className="mt-6">
                  <Caption bold className="text-wine uppercase tracking-wider text-xs block mb-2">
                    Signature Moment & Historical Context
                  </Caption>
                  <blockquote className="p-4 rounded-md bg-gold/10 border-l-4 border-gold text-wine prose-copy text-sm sm:text-base leading-relaxed">
                    &ldquo;{inspectSeries.signatureMoment}&rdquo;
                  </blockquote>
                </div>

                {/* Box Summary Callout */}
                <div className="mt-4 text-xs narrow text-muted">
                  Official Record: {inspectSeries.boxSummary}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 mt-8 border-t border-rule flex items-center justify-between">
                <Caption className="text-muted text-xs">Press Escape or click outside to dismiss</Caption>
                <button
                  type="button"
                  onClick={() => setInspectSeries(null)}
                  className="px-4 py-2 rounded bg-wine text-chalk narrow-bold text-xs uppercase tracking-wider hover:bg-wine-deep transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
