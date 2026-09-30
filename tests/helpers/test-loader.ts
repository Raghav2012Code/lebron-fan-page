import * as LebronData from "@/lib/data";
import * as Authoritative from "../fixtures/authoritative-data";

/**
 * Hardwood Design Tokens & Technical Constraints
 * Derived from ORIGINAL_REQUEST.md § R4 and PROJECT.md § Architecture
 */
export const HARDWOOD_TOKENS = {
  colors: {
    maple: "#E9D6B0",
    mapleDeep: "#DCBF8C",
    wine: "#5A1626",
    wineDeep: "#380C16",
    chalk: "#FBF7EF",
    gold: "#E0A72C",
    leather: "#C24A16",
    ochre: "#A2670F",
  },
  typography: {
    headings: "Oswald",
    prose: "Plus Jakarta Sans",
    figuresTabular: "tabular-nums",
  },
  courtGeometry: {
    halfCourt: {
      width: 500,
      height: 470,
      viewBox: "0 0 500 470",
      rim: { cx: 250, cy: 417.5, r: 7.5 },
      key: { x: 170, y: 280, width: 160, height: 190 },
      freeThrowCircle: { cx: 250, cy: 280, r: 60 },
      threePointRadius: 237.5,
    },
    fullCourt: {
      width: 500,
      height: 940,
      viewBox: "0 0 500 940",
      rim: { cx: 250, cy: 887.5, r: 7.5 },
    },
  },
};

/**
 * Get the active PlayoffSeries dataset.
 * Checks lib/data first for live implementation; falls back to authoritative specification.
 */
export function getPlayoffSeries() {
  const mod = LebronData as Record<string, unknown>;
  // The CANONICAL export name only. This used to probe `playoffSeries` and
  // `playoff_series` and then silently substitute
  // `tests/fixtures/authoritative-data.ts` when none matched. The fixture is a
  // DIFFERENT dataset, so a rename could turn the whole suite into one that
  // passes against data the site never renders. A missing canonical export is a
  // hard error now, never a fallback.
  const live = mod.PLAYOFF_SERIES as
    | typeof Authoritative.PLAYOFF_SERIES
    | undefined;
  if (!Array.isArray(live)) {
    throw new Error(
      "lib/data must export PLAYOFF_SERIES as an array. Refusing to fall back " +
        "to tests/fixtures/authoritative-data.ts, which holds a different dataset.",
    );
  }
  return { data: live, isLive: true };
}

/**
 * Get the active Clutch Buzzer Beater dataset.
 */
export function getBuzzerBeaters() {
  const mod = LebronData as Record<string, unknown>;
  const live = (mod.CLUTCH_BUZZER_BEATERS ||
    mod.clutchBuzzerBeaters ||
    mod.BUZZER_BEATERS ||
    mod.buzzerBeaterPlays) as typeof Authoritative.CLUTCH_BUZZER_BEATERS | undefined;
  return {
    data: live && Array.isArray(live) ? live : Authoritative.CLUTCH_BUZZER_BEATERS,
    isLive: Boolean(live && Array.isArray(live)),
  };
}

/**
 * Get the active Triple-Double datasets.
 */
export function getTripleDoubles() {
  const mod = LebronData as Record<string, unknown>;
  const livePlayoff = (mod.PLAYOFF_TRIPLE_DOUBLES ||
    mod.playoffTripleDoubles ||
    mod.TRIPLE_DOUBLES_PLAYOFFS) as typeof Authoritative.PLAYOFF_TRIPLE_DOUBLES | undefined;
  const liveRegular = (mod.REGULAR_SEASON_TRIPLE_DOUBLES ||
    mod.regularSeasonTripleDoubles ||
    mod.TRIPLE_DOUBLES_REGULAR) as
    | typeof Authoritative.REGULAR_SEASON_TRIPLE_DOUBLES
    | undefined;
  const liveSummary = mod.TRIPLE_DOUBLE_SUMMARY as
    | typeof Authoritative.TRIPLE_DOUBLE_SUMMARY
    | undefined;
  return {
    playoffs:
      livePlayoff && Array.isArray(livePlayoff)
        ? livePlayoff
        : Authoritative.PLAYOFF_TRIPLE_DOUBLES,
    regularSeason:
      liveRegular && Array.isArray(liveRegular)
        ? liveRegular
        : Authoritative.REGULAR_SEASON_TRIPLE_DOUBLES,
    // Reads the LIVE summary, not the fixture's. Hard-wiring the fixture meant
    // the live `TRIPLE_DOUBLE_SUMMARY` export had zero coverage of any kind, so
    // it could drift (a new careerTotal, a changed high-scoring line) with no
    // test failing.
    summary: (liveSummary ?? Authoritative.TRIPLE_DOUBLE_SUMMARY) as
      typeof Authoritative.TRIPLE_DOUBLE_SUMMARY,
    // AND of all three sources. `isLive` used to reflect the playoff table
    // alone, so `regularSeason` and `summary` could each fall back to the
    // fixture while this read `true` — the smoke assertion that is supposed to
    // make the fallback loud could not see two thirds of it.
    isLive: Boolean(
      livePlayoff &&
        Array.isArray(livePlayoff) &&
        liveRegular &&
        Array.isArray(liveRegular) &&
        liveSummary,
    ),
  };
}

/**
 * Get Franchise Postseason records.
 */
export function getFranchiseBreakdown() {
  const mod = LebronData as Record<string, unknown>;
  const live = (mod.FRANCHISE_BREAKDOWN || mod.franchiseBreakdown) as
    | typeof Authoritative.FRANCHISE_BREAKDOWN
    | undefined;
  return {
    data: live && Array.isArray(live) ? live : Authoritative.FRANCHISE_BREAKDOWN,
    isLive: Boolean(live && Array.isArray(live)),
  };
}

/**
 * Export raw authoritative models for direct reference
 */
export { Authoritative, LebronData };
