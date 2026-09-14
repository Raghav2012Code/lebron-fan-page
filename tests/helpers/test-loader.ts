import * as LebronData from "@/lib/lebron-data";
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
    headings: "Archivo",
    prose: "Newsreader",
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
  requiredSections: [
    { id: "playoff-matrix", label: "Playoff matrix" },
    { id: "clutch-anthology", label: "Clutch anthology" },
    { id: "triple-doubles", label: "Triple-double constellation" },
  ] as const,
};

/**
 * Get the active PlayoffSeries dataset.
 * Checks lib/lebron-data first for live implementation; falls back to authoritative specification.
 */
export function getPlayoffSeries() {
  const mod = LebronData as Record<string, unknown>;
  const live = (mod.PLAYOFF_SERIES || mod.playoffSeries || mod.playoff_series) as
    | typeof Authoritative.PLAYOFF_SERIES
    | undefined;
  return {
    data: live && Array.isArray(live) ? live : Authoritative.PLAYOFF_SERIES,
    isLive: Boolean(live && Array.isArray(live)),
    authoritative: Authoritative.PLAYOFF_SERIES,
  };
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
    authoritative: Authoritative.CLUTCH_BUZZER_BEATERS,
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
  return {
    playoffs:
      livePlayoff && Array.isArray(livePlayoff)
        ? livePlayoff
        : Authoritative.PLAYOFF_TRIPLE_DOUBLES,
    regularSeason:
      liveRegular && Array.isArray(liveRegular)
        ? liveRegular
        : Authoritative.REGULAR_SEASON_TRIPLE_DOUBLES,
    summary: Authoritative.TRIPLE_DOUBLE_SUMMARY,
    isLive: Boolean(livePlayoff && Array.isArray(livePlayoff)),
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
    authoritative: Authoritative.FRANCHISE_BREAKDOWN,
  };
}

/**
 * Export raw authoritative models for direct reference
 */
export { Authoritative, LebronData };
