"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  FRANCHISE_BREAKDOWN,
  PLAYOFF_SERIES,
  SEASONS,
  type FranchisePostseasonRecord,
  type PlayoffRoundCategory,
  type PlayoffSeries,
} from "@/lib/data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Caption, Counter, PaintRule, RiseWords, StatBand, type Opener } from "@/components/typeset";

type RoundFilter = "ALL" | PlayoffRoundCategory;
type OutcomeFilter = "ALL" | "W" | "L";
type ViewMode = "matrix" | "franchises";

/**
 * The one filter predicate.
 *
 * There were two, and they disagreed on three of the five conditions. A row
 * could be counted in an outcome chip and simultaneously absent from the grid it
 * describes, because the grid fell back to `s.round` when `s.roundCategory` did
 * not match and the chip did not, and the same again for `s.franchise` versus
 * `s.opponentAbbr`. The two search implementations differed too: one tested five
 * fields individually, the other built one concatenated haystack and included
 * `season`, which the first never searched.
 *
 * This is the union of both, so nothing searchable became unsearchable, and it is
 * module-scope and pure so the round tabs can be derived from it at module scope
 * and cannot drift from what the grid will show.
 */
function matchesFilters(
  s: PlayoffSeries,
  f: {
    round: RoundFilter;
    outcome: OutcomeFilter;
    sweepsOnly: boolean;
    franchise: string | null;
    query: string;
  },
): boolean {
  if (f.round !== "ALL" && s.roundCategory !== f.round && s.round !== f.round) {
    return false;
  }
  if (f.outcome !== "ALL" && s.result !== f.outcome) return false;
  if (f.sweepsOnly && !s.isSweep) return false;
  if (
    f.franchise &&
    s.opponentAbbr !== f.franchise &&
    s.franchise !== f.franchise
  ) {
    return false;
  }
  // Match against the TRIMMED query. Using the raw input meant a stray leading or
  // trailing space (" 2018 ") matched nothing at all.
  const q = f.query.trim().toLowerCase();
  if (q) {
    const matchYear = s.year.toString().includes(q);
    const matchOpponent = (s.opponentName ?? s.opponent).toLowerCase().includes(q);
    const matchAbbr = s.opponentAbbr.toLowerCase().includes(q);
    const matchTeam = s.team.toLowerCase().includes(q);
    // `season` is optional on the type, and the old chip-side implementation
    // interpolated it into a template literal — so a row without one searched
    // for the literal text "undefined" and matched any query containing it.
    const matchSeason = (s.season ?? "").toLowerCase().includes(q);
    const matchMoment = s.signatureMoment.toLowerCase().includes(q);
    if (
      !matchYear &&
      !matchOpponent &&
      !matchAbbr &&
      !matchTeam &&
      !matchSeason &&
      !matchMoment
    ) {
      return false;
    }
  }
  return true;
}

interface RoundTabMeta {
  /**
   * The filter VALUE, which is also the human label ("Conf Semifinals"). It is
   * not a DOM id — see `slug`.
   */
  id: RoundFilter;
  /**
   * The DOM id fragment. ASCII whitespace is forbidden in an `id`, and four of
   * the five `id` values contain spaces, which produced live ids like
   * `round-tab-Conf Semifinals`. Nothing broke only because the id was reached
   * through `getElementById` and never used as a selector — but it was
   * unaddressable by CSS, unlinkable as a fragment, and unusable as an
   * `aria-labelledby` target, which is what the tabpanel needs.
   */
  slug: string;
  label: string;
  shortLabel: string;
  /** Won-lost, derived from the rows this tab actually shows. */
  record: string;
  /** How many rows this tab shows, likewise derived. */
  count: number;
}

/**
 * The round tabs, with their record and count derived from the data.
 *
 * These were ten hand-typed figures — five records and five counts — directly
 * above a `career` memo whose stated purpose was that the tiles could not drift
 * from the ledger. They are now computed through `matchesFilters`, the same
 * predicate the grid uses, so a tab cannot advertise a count the grid will not
 * deliver.
 */
const ROUND_TABS: readonly RoundTabMeta[] = (
  [
    { id: "ALL", slug: "all", label: "All Rounds", shortLabel: "All" },
    {
      id: "First Round",
      slug: "first-round",
      label: "First Round",
      shortLabel: "1st Round",
    },
    {
      id: "Conf Semifinals",
      slug: "conf-semifinals",
      label: "Conference Semifinals",
      shortLabel: "Conf Semis",
    },
    {
      id: "Conf Finals",
      slug: "conf-finals",
      label: "Conference Finals",
      shortLabel: "Conf Finals",
    },
    {
      id: "NBA Finals",
      slug: "nba-finals",
      label: "NBA Finals",
      shortLabel: "Finals",
    },
  ] as const satisfies readonly Omit<RoundTabMeta, "record" | "count">[]
).map((meta) => {
  const rows = PLAYOFF_SERIES.filter((s) =>
    matchesFilters(s, {
      round: meta.id,
      outcome: "ALL",
      sweepsOnly: false,
      franchise: null,
      query: "",
    }),
  );
  return {
    ...meta,
    record: `${rows.filter((r) => r.result === "W").length}-${rows.filter((r) => r.result === "L").length}`,
    count: rows.length,
  };
});

/**
 * "Showing N of M series", announced — but only once the typing has settled.
 *
 * This was a bare `aria-live="polite"`, so every keystroke in the search box
 * produced an announcement: typing "2018" announced four intermediate counts on
 * the way to "Showing 4 of 57 series (3–1)". A live region is for a state
 * change, and each keystroke is not one the reader was told to expect.
 *
 * The visible text updates immediately, because a sighted reader filtering a
 * list expects that. Only the ANNOUNCEMENT is debounced, by 400ms — long enough
 * that a word is one announcement rather than one per letter, short enough that
 * it still feels responsive. `role="status"` and `aria-atomic` are both needed
 * for the region to be announced as a whole rather than as changed fragments.
 */
function ResultCount({
  shown,
  total,
  wins,
  losses,
}: {
  shown: number;
  total: number;
  wins: number;
  losses: number;
}) {
  const text = `Showing ${shown} of ${total} series (${wins}-${losses})`;
  const [announced, setAnnounced] = React.useState(text);
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAnnounced(text), 400);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [text]);

  return (
    <div role="status" aria-atomic="true" className="text-xs narrow text-muted">
      <span aria-hidden>{text}</span>
      <span className="sr-only">{announced}</span>
    </div>
  );
}

/**
 * A series' identity, with a fallback for a row that carries no `id`.
 * `id` is declared optional on `PlayoffSeries`, so `inspectSeries?.id ===
 * series.id` is `undefined === undefined` for two id-less rows and BOTH would
 * report `aria-expanded="true"`. Harmless today — all 57 rows carry one — and
 * wrong the moment one does not, which is the same shape as the key on the card
 * below, which already had to spell out this fallback.
 */
export function cardId(series: PlayoffSeries): string {
  return series.id ?? `${series.year}-${series.roundCode}`;
}

/**
 * Team paint for the series badge. These are team colours, not brand colours,
 * and they used to be bare hex literals in this component — which is exactly the
 * leak DESIGN-AUDIT.md F-07 describes, because a value living in a component
 * cannot be restyled from the stylesheet. They are tokens now; the values are
 * unchanged (CLE was already the wine token, and Miami's and the Lakers' were
 * the same hexes as before).
 */
function teamColor(team: string) {
  switch (team) {
    case "CLE":
      return "var(--team-cle)";
    case "MIA":
      return "var(--team-mia)";
    case "LAL":
      return "var(--team-lal)";
    default:
      return "var(--wine)";
  }
}

/**
 * Opener: `instrument` -- Heading shares a rule with the view toggle; the 57-series grid is the face.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "instrument";

export function PlayoffMatrix() {
  const [activeRound, setActiveRound] = React.useState<RoundFilter>("ALL");
  // Resolved once per render rather than inside the JSX, because it is needed in
  // two places that must not disagree: the tabpanel's `aria-labelledby` and the
  // per-tab `isActive`. `ROUND_TABS` is a module constant, so the lookup cannot
  // miss, and the fallback keeps the type total if a future filter has no tab.
  const activeTabSlug =
    ROUND_TABS.find((t) => t.id === activeRound)?.slug ?? ROUND_TABS[0].slug;
  const [outcomeFilter, setOutcomeFilter] = React.useState<OutcomeFilter>("ALL");
  const [sweepsOnly, setSweepsOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFranchise, setSelectedFranchise] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>("matrix");
  const [inspectSeries, setInspectSeries] = React.useState<PlayoffSeries | null>(null);

  const drawerRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = React.useRef<HTMLElement | null>(null);
  // Whether the drawer has ever been open. Without this the CLOSE branch below
  // is also the branch that runs on mount: `inspectSeries` is null initially,
  // `lastActiveElementRef.current` is null with it, so the effect fell through
  // to focusing #playoff-matrix -- a `tabIndex={-1}` section -- and focus() with
  // the default `preventScroll: false` scrolls it into view. Measured on a clean
  // load: the page glided from scrollY 0 to 16,372 and parked focus on the
  // section, so the first Tab press resumed 16k px from where the reader
  // thought they were. Restoring focus only makes sense on the null->null
  // transition that FOLLOWS a close.
  const hasOpenedRef = React.useRef(false);

  // Modal behaviour for the drawer: Escape to close, focus moved in on open,
  // focus TRAPPED while open, background scroll locked, and focus restored to
  // the triggering card on close. `aria-modal="true"` on its own enforces
  // none of this, so without this effect a keyboard user tabs straight out of
  // the open dialog and starts operating the page behind it.
  React.useEffect(() => {
    if (!inspectSeries) {
      if (!hasOpenedRef.current) return; // never opened: nothing to restore
      // Restore focus to whatever opened the drawer. If that card has since
      // been filtered out of the grid it is detached, and focusing it is a
      // no-op that strands the user on <body> — so fall back to the section.
      const el = lastActiveElementRef.current;
      lastActiveElementRef.current = null;
      hasOpenedRef.current = false;
      if (el && el.isConnected) {
        el.focus({ preventScroll: true });
      } else {
        document.getElementById("playoff-matrix")?.focus({ preventScroll: true });
      }
      return;
    }

    hasOpenedRef.current = true;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    // Lock background scroll. `body` sets `overflow-x: clip`, so the original
    // inline value has to be captured and put back exactly.
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const main = document.getElementById("main");
    const previouslyInert = main?.hasAttribute("inert") ?? false;
    main?.setAttribute("inert", "");

    const focusables = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setInspectSeries(null);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !drawerRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !drawerRef.current?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      if (!previouslyInert) main?.removeAttribute("inert");
    };
  }, [inspectSeries]);

  // Filter series based on user selections
  const filteredSeries = React.useMemo(
    () =>
      PLAYOFF_SERIES.filter((s) =>
        matchesFilters(s, {
          round: activeRound,
          outcome: outcomeFilter,
          sweepsOnly,
          franchise: selectedFranchise,
          query: searchQuery,
        }),
      ),
    [activeRound, outcomeFilter, sweepsOnly, selectedFranchise, searchQuery],
  );

  // Counts for the outcome chips. These must be computed from the subset
  // filtered by everything EXCEPT `outcomeFilter`, otherwise the chips
  // describe their own effect: selecting LOST made "Won" read 0 even though
  // won series exist in the current round. `matchesFilters` is shared so the
  // chips and the grid cannot disagree about which rows are in scope.
  const recordForOutcomeChips = React.useMemo(() => {
    const base = PLAYOFF_SERIES.filter((s) =>
      matchesFilters(s, {
        round: activeRound,
        outcome: "ALL",
        sweepsOnly,
        franchise: selectedFranchise,
        query: searchQuery,
      }),
    );
    return {
      all: base.length,
      wins: base.filter((s) => s.result === "W").length,
      losses: base.filter((s) => s.result === "L").length,
      sweeps: base.filter((s) => s.isSweep).length,
    };
  }, [activeRound, sweepsOnly, selectedFranchise, searchQuery]);

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

  // Career totals, derived from the ledger so the tiles cannot drift from it.
  const career = React.useMemo(() => {
    // `wins`/`losses` are the required fields; `gamesWon`/`gamesLost` are
    // optional duplicates that are not populated on every row, so the
    // authoritative pair is used here.
    const gamesWon = PLAYOFF_SERIES.reduce((a, s) => a + s.wins, 0);
    const gamesLost = PLAYOFF_SERIES.reduce((a, s) => a + s.losses, 0);
    const games = PLAYOFF_SERIES.reduce((a, s) => a + s.games, 0);
    const wins = PLAYOFF_SERIES.filter((s) => s.result === "W").length;
    const losses = PLAYOFF_SERIES.filter((s) => s.result === "L").length;
    const points = PLAYOFF_SERIES.reduce(
      (a, s) => a + (s.boxScoreTotals?.pts ?? s.lebronStats.totalPoints),
      0,
    );
    return {
      gamesWon,
      gamesLost,
      games,
      gamesWinPct: (gamesWon / games) * 100,
      series: PLAYOFF_SERIES.length,
      wins,
      losses,
      seriesWinPct: (wins / PLAYOFF_SERIES.length) * 100,
      points,
      ppg: points / games,
      sweepsWon: PLAYOFF_SERIES.filter((s) => s.isSweep && s.result === "W").length,
      sweepsLost: PLAYOFF_SERIES.filter((s) => s.isSweep && s.result === "L").length,
      // Distinct opponent franchises, from the same array the franchise view
      // renders, so the standfirst and the view cannot disagree about how many
      // there are.
      franchises: FRANCHISE_BREAKDOWN.length,
    };
  }, []);

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
    const target = document.getElementById(
      `round-tab-${ROUND_TABS[nextIndex].slug}`,
    );
    target?.focus({ preventScroll: true });
  };

  return (
    <section
      id="playoff-matrix"
      // Focus fallback target when the drawer closes and the card that opened
      // it has been filtered out of the grid and is no longer focusable.
      tabIndex={-1}
      aria-labelledby="playoff-matrix-heading"
      className="scroll-clearance floor relative py-20 sm:py-28 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-14">
        {/* Opener: instrument. The 57-series grid and its filters are this
            section's opener, so the heading shares a rule with the view toggle
            instead of sitting above them under a label — and it is demoted from
            `monument` to `headline`, because four sections at the same colossal
            scale is what flattened the page's hierarchy (F-01). The live dot is
            kept: it is a status indicator and is one of only four round shapes
            the design allows (F-08). The label it used to sit beside was a
            restatement of the heading and is gone (F-02). */}
        <div className="flex flex-col gap-4 border-b-2 border-rule-strong pb-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            {/* The live-status dot. Survives the square commitment: a status
                indicator is conventionally round. One of four rounded-full
                shapes on the page; the budget and the survivor list are asserted
                by the test gate (F-08). */}
            <span
      className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse data-reveal-loop"
      aria-hidden
    />
            <h2
              id="playoff-matrix-heading"
              className="headline text-wine"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              <RiseWords text="The Playoff Matrix" />
            </h2>
          </div>

          {/* View mode toggle */}
          <div
            role="group"
            aria-label="View toggle"
            className="inline-flex rounded-none p-1 bg-maple-deep/50 border border-rule self-start md:self-end"
          >
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={cn(
                "relative px-4 py-2 text-xs uppercase tracking-wider narrow-bold rounded-none transition-colors duration-150",
                viewMode === "matrix" ? "text-chalk" : "text-wine hover:text-wine-deep",
              )}
            >
              {viewMode === "matrix" && (
                <motion.div
                  layoutId="view-pill-bg"
                  className="absolute inset-0 rounded-none bg-wine"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Series Ledger ({career.series})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("franchises")}
              className={cn(
                "relative px-4 py-2 text-xs uppercase tracking-wider narrow-bold rounded-none transition-colors duration-150",
                viewMode === "franchises" ? "text-chalk" : "text-wine hover:text-wine-deep",
              )}
            >
              {viewMode === "franchises" && (
                <motion.div
                  layoutId="view-pill-bg"
                  className="absolute inset-0 rounded-none bg-wine"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Franchises ({career.franchises})</span>
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
          Across {SEASONS.length} seasons and {career.series} postseason series,
          LeBron James has amassed an all-time series record of{" "}
          <strong className="text-wine font-semibold">
            {career.wins} wins and {career.losses} losses (
            {career.seriesWinPct.toFixed(1)}%)
          </strong>{" "}
          over {career.games} games—scoring{" "}
          <strong className="text-wine font-semibold">
            {career.points.toLocaleString("en-US")} points
          </strong>
          , the most in NBA history. He holds the league record with{" "}
          <strong className="text-wine font-semibold">
            {career.sweepsWon} series sweeps
          </strong>{" "}
          while facing {career.franchises} distinct opponent franchises.
        </motion.p>

        {/* Aggregate Headline Cards ---
            One of the seven four-item bands (F-01), and one of the two that
            survive the cap. A scoreboard genuinely is four figures on one
            reading, and `variant="framed"` is the one place on the page where
            inset panels are the right container. */}
        <StatBand
          className="mt-10"
          items={[
            {
              label: "All-Time Series",
              value: (
                <>
                  <Counter to={career.wins} />–<Counter to={career.losses} />
                </>
              ),
              caption: `${career.series} series, ${career.seriesWinPct.toFixed(1)}% win rate`,
            },
            {
              label: "Playoff Games",
              value: <Counter to={career.games} />,
              caption: `${career.gamesWon}–${career.gamesLost}, ${career.gamesWinPct.toFixed(1)}% game mark`,
            },
            {
              label: "Playoff Scoring",
              value: <Counter to={career.points} />,
              caption: `${career.ppg.toFixed(1)} PPG, most in history`,
            },
            {
              label: "Sweeps Mastery",
              // Maple ground, so the ink variant. `gold` here measured 1.38:1.
              tone: "gold-ink",
              value: (
                <>
                  <Counter to={career.sweepsWon} />W – <Counter to={career.sweepsLost} />L
                </>
              ),
              caption: `${career.sweepsWon} won, ${career.sweepsLost} swept`,
            },
          ]}
        />

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
                <ResultCount
                  shown={filteredSeries.length}
                  total={career.series}
                  wins={filteredRecord.wins}
                  losses={filteredRecord.losses}
                />
              </div>

              <div
                role="tablist"
                aria-label="Playoff rounds"
                className="flex flex-wrap gap-2 sm:gap-3 p-1 rounded-none bg-maple-deep/40 border border-rule"
              >
                {ROUND_TABS.map((tab, idx) => {
                  const isActive = activeRound === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`round-tab-${tab.slug}`}
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
                        "relative flex-1 min-w-[120px] sm:min-w-[140px] px-3 py-2.5 rounded-none text-left transition-colors duration-150",
                        isActive ? "text-chalk shadow-xs" : "text-wine hover:bg-maple/70",
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-round-tab-bg"
                          className="absolute inset-0 rounded-none bg-wine"
                          transition={{ type: "spring", bounce: 0.18, duration: 0.35 }}
                        />
                      )}
                      <div className="relative z-10 flex flex-col">
                        <span className="narrow-bold text-xs uppercase tracking-wider hidden sm:inline">
                          {tab.label}
                        </span>
                        <span className="narrow-bold text-xs uppercase tracking-wider inline sm:hidden">
                          {tab.shortLabel}
                        </span>
                        {/* The two states sit on DIFFERENT grounds, which is why this
                    is a conditional rather than one colour: the active tab has
                    the wine pill behind it and the inactive ones do not. Gold on
                    the pill passes; gold-ink on maple-deep is 1.36:1 and fails. */}
                <span
                  className={cn(
                    "text-[0.6875rem] narrow font-normal mt-0.5",
                    isActive ? "text-gold" : "text-muted",
                  )}
                >
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
                <div role="group" aria-label="Outcome filter" className="inline-flex rounded-none border border-rule bg-maple-deep/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setOutcomeFilter("ALL")}
                    className={cn(
                      "px-2.5 py-1 text-xs narrow-bold rounded-none transition-colors",
                      outcomeFilter === "ALL" ? "bg-wine text-chalk" : "text-wine hover:text-wine-deep",
                    )}
                  >
                    All ({recordForOutcomeChips.all})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutcomeFilter("W")}
                    className={cn(
                      "px-2.5 py-1 text-xs narrow-bold rounded-none transition-colors",
                      outcomeFilter === "W" ? "bg-wine text-chalk" : "text-wine hover:text-wine-deep",
                    )}
                  >
                    Won ({recordForOutcomeChips.wins})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutcomeFilter("L")}
                    className={cn(
                      "px-2.5 py-1 text-xs narrow-bold rounded-none transition-colors",
                      outcomeFilter === "L" ? "bg-wine text-chalk" : "text-wine hover:text-wine-deep",
                    )}
                  >
                    Lost ({recordForOutcomeChips.losses})
                  </button>
                </div>

                {/* Sweeps Only Checkbox / Button */}
                <button
                  type="button"
                  aria-pressed={sweepsOnly}
                  onClick={() => setSweepsOnly(!sweepsOnly)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-none border text-xs narrow-bold transition-colors",
                    sweepsOnly
                      ? "bg-gold text-wine border-gold shadow-xs"
                      : "bg-maple-deep/40 border-rule text-wine hover:border-wine hover:bg-maple-deep/60",
                  )}
                >
                  <span aria-hidden className="text-sm">★</span>
                  <span>Sweeps Only ({recordForOutcomeChips.sweeps})</span>
                </button>

                {/* Active Franchise Filter Pill if selected */}
                {selectedFranchise && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-wine text-chalk text-xs narrow-bold">
                    <span>vs {selectedFranchise}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFranchise(null)}
                      /* `-m-2 p-2` rather than `h-6 w-6`: it grows the hit area to
                         24px in both axes without growing the pill, so the badge
                         keeps its height. Measured before: 8.5 x 16px, which fails
                         WCAG 2.2 SC 2.5.8 Target Size (Minimum) and gets no help
                         from the spacing exception, because it sits inside a
                         21px-tall pill. */
                      className="-m-2 p-2 hover:text-gold-ink ml-1 focus-visible:outline-none"
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
                  className="w-full px-3 py-1.5 rounded-none border border-rule bg-maple-deep/40 text-wine text-xs narrow placeholder:text-muted/70 focus:bg-maple-deep/60 focus:border-wine focus:ring-1 focus:ring-wine outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    /* Same `-m-2 p-2` trade as the franchise pill: 24px of hit
                       area from a 7.3 x 16px target, with the input's box and the
                       glyph both unchanged. */
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 -m-2.5 p-2.5 text-muted hover:text-wine text-xs"
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
              // Must be a tabpanel: the round tabs point `aria-controls`
              // here, and a tab whose controlled element is a plain region
              // leaves assistive tech unable to resolve the relationship.
              role="tabpanel"
              // Points at the SELECTED tab, not a fixed string. The five round
              // tabs all `aria-controls` this panel, and with a static
              // `aria-label` a screen-reader user arriving at the panel could not
              // tell which round it was showing. The other three tablists on the
              // page (shot-zones, father-and-son, and the Radix tabs in
              // the-ledger) all label their panel from the active tab.
              aria-labelledby={`round-tab-${activeTabSlug}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-6"
            >
              {filteredSeries.map((series) => {
                const isWon = series.result === "W";
                return (
                  <motion.div
                    key={cardId(series)}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-expanded={inspectSeries?.id === cardId(series)}
                    onClick={() => setInspectSeries(series)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setInspectSeries(series);
                      }
                    }}
                    className={cn(
                      "group relative flex flex-col justify-between p-4 rounded-none border text-left cursor-pointer transition-colors duration-200",
                      "bg-maple-deep/40 border-rule",
                      // The affordance, replacing a uniform `whileHover={{ y: -2 }}`
                      // across all 57 cards (F-09). Moving every card the same
                      // two pixels says nothing about any of them. Hovering now
                      // paints the W/L result badge solid and reverses it, so the
                      // interaction reports THIS series' outcome — the one fact
                      // the card exists to convey — and it does so on every card
                      // because every card has a result.
                      "hover:border-wine",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine focus-visible:outline-offset-2",
                    )}
                  >
                    {/* Top Metadata Row */}
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-rule/60 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="px-1.5 py-0.5 rounded-none text-[0.6875rem] narrow-bold text-chalk"
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
                                "px-1.5 py-0.5 rounded-none text-[0.625rem] narrow-bold uppercase tracking-wider",
                                isWon ? "bg-gold text-wine" : "bg-leather/20 text-leather-ink",
                              )}
                            >
                              {isWon ? "★ Sweep" : "Swept"}
                            </span>
                          )}
                          {/* The result badge is the hover affordance. Won
                              series read chalk-on-wine at rest and invert to
                              wine-on-chalk on hover; lost series read
                              wine-on-tint and invert to chalk-on-wine. Either
                              way hovering names the outcome of this specific
                              series, which is what the card is a record of. */}
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-none text-xs narrow-bold transition-colors duration-200",
                              isWon
                                ? "bg-wine text-chalk group-hover:bg-chalk group-hover:text-wine"
                                : "bg-wine/15 text-wine border border-wine/25 group-hover:bg-wine group-hover:text-chalk group-hover:border-wine",
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
                      {/* One frame per level (F-10). This stat group had a
                          border inside a card that already has one, so the card
                          carried six border edges and two background fills
                          before any content. The border and fill are gone; the
                          figures sit on the card's own fill and are held in
                          line by `.figure`'s tabular numerals, which is what
                          the numbers are for. */}
                      <div className="mt-3 pl-2.5">
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

                      {/* Signature moment. Deliberately NOT wrapped in quote
                          marks: this is the site's own editorial narration,
                          not a quotation from anyone, and presenting it as
                          verbatim speech would be a fabricated attribution. */}
                      <p className="mt-2.5 text-xs prose-copy line-clamp-2 text-muted">
                        {series.signatureMoment}
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
              <div className="p-12 text-center rounded-none border border-dashed border-rule bg-maple-deep/30">
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
                  className="mt-4 px-4 py-2 rounded-none bg-wine text-chalk narrow-bold text-xs uppercase tracking-wider hover:bg-wine-deep"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Franchise Breakdown View. A bare JS comment, not `{/* … *\/}`:
             this sits in the consequent of a ternary, which is a JS expression
             position, and a JSX comment there would be a second expression. */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <Caption bold className="text-wine uppercase tracking-wider text-xs">
                  Head-To-Head Postseason Records Across {career.franchises} NBA
                  Franchises
                </Caption>
                <p className="text-xs text-muted narrow mt-0.5">
                  Click any franchise to filter the ledger by all postseason series
                  played against them.
                </p>
              </div>
              <div className="text-xs narrow text-muted">
                {career.franchises} franchises faced, {career.wins} series wins,{" "}
                {career.losses} series losses
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
                      "group p-4 rounded-none border text-left cursor-pointer transition-all duration-150",
                      "bg-maple-deep/40 hover:bg-maple-deep/75 border-rule hover:border-wine",
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
                      <span className="px-2 py-0.5 rounded-none text-xs narrow-bold bg-maple-deep/70 text-wine border border-rule">
                        {f.abbr}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-4 grid grid-cols-3 gap-2 p-2 rounded-none bg-maple-deep/60 border border-rule/50">
                      <div>
                        <Caption className="text-muted block text-[0.6875rem]">Series</Caption>
                        <div className={cn("figure text-base font-bold", hasWonSeries ? "text-wine" : isTied ? "text-muted" : "text-leather-ink")}>
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
                        <div className="figure text-base text-gold-ink">
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

      {/* Detail Inspection Drawer / Modal.
          Portalled to <body> deliberately: the modal effect marks #main
          `inert` so the page behind cannot be tabbed into, and the drawer
          lives inside #main. Without the portal it would be inside its own
          inert subtree and could never receive focus. */}
      {/* `document` does not exist during static prerender. The drawer can
          only ever be open from a click, so this guard never differs between
          the server and client render and cannot cause a mismatch. */}
      {typeof document !== "undefined" &&
        createPortal(
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
                "relative z-10 w-full max-w-2xl bg-maple h-full shadow-2xl border-l-2 border-wine",
                "flex flex-col justify-between overflow-y-auto p-6 sm:p-8",
              )}
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-start justify-between gap-4 border-b border-rule pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-none text-xs narrow-bold text-chalk"
                        style={{ backgroundColor: teamColor(inspectSeries.team) }}
                      >
                        {inspectSeries.team}
                      </span>
                      <Caption bold className="text-gold-ink uppercase tracking-wider text-xs">
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
                    className="p-2 rounded-none text-muted hover:text-wine hover:bg-maple/80 transition-colors focus-visible:outline-wine"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Series Outcome Summary Banner */}
                <div className="mt-6 p-4 rounded-none bg-maple/50 border border-rule flex items-center justify-between">
                  <div>
                    <div className="text-xs narrow uppercase text-muted tracking-wider">Series Result</div>
                    <div className="figure text-xl sm:text-2xl text-wine font-bold mt-0.5">
                      {inspectSeries.result === "W" ? "Won Series" : "Lost Series"} ({inspectSeries.seriesScore ?? `${inspectSeries.wins}–${inspectSeries.losses}`})
                    </div>
                  </div>
                  {inspectSeries.isSweep && (
                    <span className="px-3 py-1 rounded-none bg-gold text-wine narrow-bold text-xs uppercase tracking-wider">
                      {/* No score in the badge. The line directly above already
                          prints the series score, so repeating it here told the
                          reader the same thing twice — and the "4–0" was typed
                          rather than read, so it was a fourth place the sweep
                          score lived. The badge now says what the badge is for. */}
                      {inspectSeries.result === "W" ? "Sweep Victory" : "Sweep Loss"}
                    </span>
                  )}
                </div>

                {/* LeBron Series Scoring & Per-Game Averages ---
                    Was a third four-across band of framed tiles (F-01), and the
                    two `StatBand` uses are already spent. Inside a drawer this
                    is a line of figures, not a card grid, so it is set as one:
                    four columns of label / figure / total, separated by
                    hairlines, with no per-cell frame. */}
                <div className="mt-6">
                  <Caption bold className="text-wine uppercase text-xs block mb-3">
                    LeBron James Series Averages &amp; Totals
                  </Caption>
                  <dl className="flex flex-wrap gap-x-6 gap-y-4 border-t border-rule pt-4">
                    {(
                      [
                        [
                          "Points / Game",
                          inspectSeries.ppg ?? inspectSeries.lebronStats.ppg,
                          `${inspectSeries.boxScoreTotals?.pts ?? inspectSeries.lebronStats.totalPoints} total PTS`,
                        ],
                        [
                          "Rebounds / Game",
                          inspectSeries.rpg ?? inspectSeries.lebronStats.rpg,
                          `${inspectSeries.boxScoreTotals?.reb} total REB`,
                        ],
                        [
                          "Assists / Game",
                          inspectSeries.apg ?? inspectSeries.lebronStats.apg,
                          `${inspectSeries.boxScoreTotals?.ast} total AST`,
                        ],
                        [
                          "Defense / Game",
                          `${inspectSeries.spg ?? 0}S / ${inspectSeries.bpg ?? 0}B`,
                          `${inspectSeries.boxScoreTotals?.stl} stl · ${inspectSeries.boxScoreTotals?.blk} blk`,
                        ],
                      ] as const
                    ).map(([label, value, total]) => (
                      <div
                        key={label}
                        className="min-w-[7rem] flex-1 border-l border-rule/60 pl-4 first:border-l-0 first:pl-0"
                      >
                        <dt>
                          <Caption className="text-muted">{label}</Caption>
                        </dt>
                        <dd className="figure text-2xl text-wine">{value}</dd>
                        <Caption className="mt-0.5 text-muted text-[0.6875rem]">
                          {total}
                        </Caption>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Shooting Splits & Box Score Totals */}
                {inspectSeries.boxScoreTotals && (
                  <div className="mt-6">
                    <Caption bold className="text-wine uppercase tracking-wider text-xs block mb-3">
                      Shooting Efficiency & Detailed Box Score
                    </Caption>
                    <div className="p-4 rounded-none bg-maple-deep/40 border border-rule space-y-3">
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
                  {/* Narration, not speech: see the note on the card. Kept
                      as a div rather than a blockquote for the same reason. */}
                  <div className="p-4 rounded-none bg-gold/10 border-l-4 border-gold text-wine prose-copy text-sm sm:text-base leading-relaxed">
                    {inspectSeries.signatureMoment}
                  </div>
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
                  className="px-4 py-2 rounded-none bg-wine text-chalk narrow-bold text-xs uppercase tracking-wider hover:bg-wine-deep transition-colors"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
