/* ---------------------------------------------------------------------------
 * HARDWARE — the honours ledger
 * ------------------------------------------------------------------------- */

export interface Honour {
  id: string;
  value: number | null;
  /** shown when value is null */
  display?: string;
  suffix?: string;
  label: string;
  context: string;
  /** "row" sits in the ledger; "block" breaks out full width, into the paint */
  weight: "row" | "block";
}

export const HARDWARE = {
  heading: "Hardware",
  standfirst:
    "Everything that came with a trophy, a ceremony, or a line in the record book.",
} as const;

export const HONOURS: Honour[] = [
  {
    id: "titles",
    value: 4,
    label: "NBA championships",
    context: "Miami in 2012 and 2013, Cleveland in 2016, Los Angeles in 2020.",
    weight: "row",
  },
  {
    id: "mvp",
    value: 4,
    label: "Regular-season MVP",
    context: "Named Most Valuable Player in 2009, 2010, 2012 and 2013.",
    weight: "row",
  },
  {
    id: "fmvp",
    value: 4,
    label: "Finals MVP",
    context: "One in each championship run, for three different franchises.",
    weight: "row",
  },
  {
    id: "points",
    value: 43440,
    label: "Regular-season points",
    context:
      "He passed forty thousand in March 2023, the first player in league history to get there, and has not stopped.",
    weight: "block",
  },
  {
    id: "allstar",
    value: 22,
    label: "All-Star selections",
    context:
      "Twenty-two of them, in consecutive years, which is more than anybody else has managed.",
    weight: "row",
  },
  {
    id: "gold",
    value: 2,
    label: "Olympic gold medals",
    context:
      "Beijing 2008 and London 2012, with bronze in Athens 2004 and again in Paris 2024.",
    weight: "row",
  },
  {
    id: "scoring",
    value: null,
    display: "No. 1",
    label: "All-time scoring leader",
    context:
      "He passed Kareem Abdul-Jabbar in February 2023, thirty-nine years after the record was set.",
    weight: "block",
  },
];

/** Career regular-season points. Declared once: `CAREER` and the combined
 *  figure below both derive from it, so the two cannot disagree.
 *
 *  Exported because `career.ts` builds the career stat line from the same
 *  three numbers. That dependency was invisible while this file and that one
 *  were the same file, which is exactly the kind of thing the split exists to
 *  surface: two sections quoting one total must quote one constant, not two
 *  literals that can drift. */
export const REGULAR_SEASON_POINTS = 43440;
/** Career playoff points — also the most anyone has scored in the playoffs. */
export const PLAYOFF_POINTS = 8521;
/** Regular season and playoffs together. This is the basis of the 50,000 mark. */
export const COMBINED_POINTS = REGULAR_SEASON_POINTS + PLAYOFF_POINTS;

/**
 * THE MEASURE — and the fact that it is closed.
 *
 * This used to read "The measure that is still open / Nobody has been near it",
 * with `current: 43440` measured against `target: 50000`. Two things were wrong
 * with that, and the second is the one that matters:
 *
 * 1. `current` was the REGULAR-SEASON total while the 50,000 mark is a COMBINED
 *    figure. Two different definitions measured against each other, which is why
 *    it read as a target nobody is approaching.
 * 2. The mark is not open. `CAREER.playoffs.copy` states the combined total as
 *    51,961 — on the same page, two sections apart — and 51,961 is 1,961 PAST
 *    50,000. The panel was showing a measure at 86.9% for a target the page
 *    itself contradicted.
 *
 * He passed it on 4 March 2025, first quarter, on a three against New Orleans,
 * at 41,871 regular-season plus 8,162 playoff points for 50,033 (NBA.com, AP).
 * So the honest presentation is a closed measure, and the only figures used are
 * ones the module already asserts: `REGULAR_SEASON_POINTS` and `PLAYOFF_POINTS`.
 *
 * There is deliberately no replacement "next" target. The highest regular-season
 * total in NBA history is Kareem's 38,387 and LeBron is past it, so there is no
 * open regular-season scoring mark to track, and inventing a 60,000 round number
 * would be fabricating a milestone. AGENTS.md §3 forbids it.
 *
 * `honours-board` computes `pct = min(1, current / target)`, so a passed mark
 * renders as a filled measure with the tick on the end post, which is the right
 * picture for it.
 */
export const NEXT_MARK = {
  heading: "Fifty thousand, passed",
  current: COMBINED_POINTS,
  target: 50000,
  currentLabel: COMBINED_POINTS.toLocaleString("en-US"),
  targetLabel: "50,000",
  note: "Regular season and playoffs together, 1,961 past it. Reached on 4 March 2025, in the first quarter against New Orleans.",
} as const;
