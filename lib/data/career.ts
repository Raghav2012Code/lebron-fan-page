/* ---------------------------------------------------------------------------
 * THE LINE — the official career stat line.
 *
 * Every figure below is an exact regular-season total from the official
 * record, cross-checked three ways: the per-season table sums to each of
 * these totals, and each average is its total divided by 1,622 games.
 * ------------------------------------------------------------------------- */

import {
  COMBINED_POINTS,
  PLAYOFF_POINTS,
  REGULAR_SEASON_POINTS,
} from "./honours";

export interface CareerAverage {
  label: string;
  /** per game, to one decimal */
  avg: number;
  total: number;
  rank?: string;
}

export interface CareerRow {
  label: string;
  value: string;
  note?: string;
}

export const CAREER = {
  heading: "The line",
  standfirst:
    "Twenty-three seasons and 1,622 games of it, written the way a stat line is said out loud. Per game across the top, in total underneath.",
  /** points / rebounds / assists — the three numbers a stat line is made of */
  headline: [
    {
      label: "Points",
      avg: 26.8,
      total: REGULAR_SEASON_POINTS,
      rank: "Most in NBA history",
    },
    { label: "Rebounds", avg: 7.5, total: 12095 },
    { label: "Assists", avg: 7.4, total: 12016 },
  ] as CareerAverage[],
  supporting: [
    { label: "Games played", value: "1,622", note: "Most in NBA history" },
    { label: "Minutes played", value: "61,030", note: "Most in NBA history" },
    { label: "Steals", value: "2,417" },
    { label: "Blocks", value: "1,185" },
    { label: "Field goals", value: "50.7%" },
    { label: "Three-pointers", value: "34.8%" },
    { label: "Free throws", value: "73.7%" },
  ] as CareerRow[],
  playoffs: {
    label: "And in the playoffs",
    points: PLAYOFF_POINTS,
    games: 302,
    // Interpolated rather than typed. This sentence is what made the
    // "still open" panel above checkable — a reader could add up the page and
    // find the mark already passed — so its combined total and NEXT_MARK's must
    // not be two separate literals that can drift apart.
    copy: `${PLAYOFF_POINTS.toLocaleString("en-US")} points across 302 playoff games, which is also more than anyone else has scored. Regular season and playoffs together, he has scored ${COMBINED_POINTS.toLocaleString("en-US")}.`,
  },
  triple:
    "He is the only player in the history of the league to reach ten thousand points, ten thousand rebounds and ten thousand assists.",
} as const;
