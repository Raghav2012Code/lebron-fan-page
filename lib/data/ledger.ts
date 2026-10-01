/* ---------------------------------------------------------------------------
 * THE LEDGER — the points, added up
 * ------------------------------------------------------------------------- */

import { CAREER_POINTS } from "./honours";

/**
 * One ledger metric: a figure, and the scale its bar is drawn against.
 *
 * There is deliberately no `approx` flag. There was one, and nothing in this file
 * ever set it, so the two places that branched on it were unreachable and the
 * README spent a paragraph describing a labelling convention the page could not
 * perform. Nothing here is an approximation: the four stint point totals sum to
 * 43,440 and the game totals to 1,622, both the career figures exactly, and a
 * `Points per game` is the correctly-rounded quotient of two exact totals rather
 * than a rounded stand-in for a fact.
 *
 * If a future metric genuinely is an approximation, add the flag AND populate it
 * in the same commit, and render the label. A flag nothing sets is worse than no
 * flag, because the type says the case is handled.
 */
export interface Metric {
  label: string;
  value: number;
  max: number;
  suffix?: string;
}

export interface Achievement {
  when: string;
  what: string;
}

export interface LedgerEntry {
  id: string;
  tab: string;
  club: string;
  years: string;
  place: string;
  metrics: [Metric, Metric, Metric];
  /** points scored in this stint — drives the accumulation column */
  scored: number | null;
  running: { value: number; suffix?: string; label: string };
  achievements: Achievement[];
  note: string;
}

export const LEDGER_INTRO = {
  heading: "The points, added up",
  copy: "Four stints, one running total. Every figure is a regular-season total, and the four add up to the career number exactly.",
} as const;

export const LEDGER: LedgerEntry[] = [
  {
    id: "cle1",
    tab: "Cleveland",
    club: "Cleveland Cavaliers",
    years: "2003-2010",
    place: "Cleveland, Ohio",
    metrics: [
      { label: "Points", value: 15251, max: 16000 },
      { label: "Games", value: 548, max: 600 },
      { label: "Points per game", value: 27.8, max: 30 },
    ],
    scored: 15251,
    running: { value: 15251, label: "Career points through 2010" },
    achievements: [
      { when: "2004", what: "Rookie of the Year" },
      { when: "2009, 2010", what: "Regular-season MVP" },
      { when: "2007", what: "First NBA Finals" },
    ],
    note: "Production arrived immediately. A supporting cast took rather longer.",
  },
  {
    id: "mia",
    tab: "Miami",
    club: "Miami Heat",
    years: "2010-2014",
    place: "Miami, Florida",
    metrics: [
      { label: "Points", value: 7919, max: 16000 },
      { label: "Games", value: 294, max: 600 },
      { label: "Points per game", value: 26.9, max: 30 },
    ],
    scored: 7919,
    running: { value: 23170, label: "Career points through 2014" },
    achievements: [
      { when: "2012, 2013", what: "NBA champion" },
      { when: "2012, 2013", what: "Finals MVP" },
      { when: "2012, 2013", what: "Regular-season MVP" },
      { when: "2011-2014", what: "Four straight Finals" },
    ],
    note: "The two-way peak, and the first proof burned into the record.",
  },
  {
    id: "cle2",
    tab: "Cleveland, again",
    club: "Cleveland Cavaliers",
    years: "2014-2018",
    place: "Cleveland, Ohio",
    metrics: [
      { label: "Points", value: 7868, max: 16000 },
      { label: "Games", value: 301, max: 600 },
      { label: "Points per game", value: 26.1, max: 30 },
    ],
    scored: 7868,
    running: { value: 31038, label: "Career points through 2018" },
    achievements: [
      { when: "2016", what: "NBA champion" },
      { when: "2016", what: "Back from three games to one down" },
      { when: "2016", what: "Finals MVP" },
      { when: "2015-2018", what: "Four straight Finals" },
    ],
    note: "A city's first title in fifty-two years, and the promise closed out.",
  },
  {
    id: "lal",
    tab: "Los Angeles",
    club: "Los Angeles Lakers",
    years: "2018-2026",
    place: "Los Angeles, California",
    metrics: [
      { label: "Points", value: 12402, max: 16000 },
      { label: "Games", value: 479, max: 600 },
      { label: "Points per game", value: 25.9, max: 30 },
    ],
    scored: 12402,
    running: { value: CAREER_POINTS, label: "Career points" },
    achievements: [
      { when: "2020", what: "NBA champion" },
      { when: "2020", what: "Finals MVP" },
      { when: "2023", what: "All-time scoring leader" },
      { when: "2024", what: "First past 40,000 points" },
      { when: "2025", what: "First to play a 23rd season" },
    ],
    note: "Records that measure endurance at least as much as talent.",
  },
  {
    id: "usa",
    tab: "National colours",
    club: "United States",
    years: "2004-2024",
    place: "Olympic basketball",
    metrics: [
      { label: "Olympic Games", value: 4, max: 4 },
      { label: "Gold medals", value: 3, max: 4 },
      { label: "Total medals", value: 4, max: 4 },
    ],
    scored: null,
    running: { value: 3, label: "Olympic gold medals" },
    achievements: [
      { when: "2008", what: "Gold in Beijing" },
      { when: "2012", what: "Gold in London" },
      { when: "2004", what: "Bronze in Athens" },
      { when: "2024", what: "Gold in Paris" },
      { when: "2024", what: "Flag bearer for the United States" },
    ],
    note: "Two decades in the same shirt, and three golds to show for it.",
  },
];
