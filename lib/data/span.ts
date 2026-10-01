/* ---------------------------------------------------------------------------
 * THE SPAN — the career as seasons. Everything on the ruler is derived from
 * these small fact tables rather than hand-written, so the two cannot drift.
 * A "season year" is the year the season STARTED: 2003 means 2003-04.
 * ------------------------------------------------------------------------- */

export const FIRST_SEASON = 2003;
export const LAST_SEASON = 2025; // i.e. the 2025-26 season
export const SEASON_COUNT = LAST_SEASON - FIRST_SEASON + 1;

/** Season-ending years in which he won the title. */
const TITLE_YEARS = [2012, 2013, 2016, 2020];
/** Years the regular-season MVP was awarded to him. */
const MVP_YEARS = [2009, 2010, 2012, 2013];

export interface TeamSpan {
  id: string;
  club: string;
  city: string;
  /** first and last season START years */
  from: number;
  to: number;
  floor: string;
  paint: string;
}

export const TEAM_SPANS: TeamSpan[] = [
  {
    id: "cle1",
    club: "Cleveland Cavaliers",
    city: "Cleveland",
    from: 2003,
    to: 2009,
    floor: "#5C1626",
    paint: "#E0A72C",
  },
  {
    id: "mia",
    club: "Miami Heat",
    city: "Miami",
    from: 2010,
    to: 2013,
    floor: "#7A1810",
    paint: "#E8761E",
  },
  {
    id: "cle2",
    club: "Cleveland Cavaliers",
    city: "Cleveland",
    from: 2014,
    to: 2017,
    floor: "#5C1626",
    paint: "#E0A72C",
  },
  {
    id: "lal",
    club: "Los Angeles Lakers",
    city: "Los Angeles",
    from: 2018,
    to: 2025,
    floor: "#3B2352",
    paint: "#E0A72C",
  },
];

export interface OlympicYear {
  year: number;
  city: string;
  medal: "Gold" | "Bronze";
}

export const OLYMPICS: OlympicYear[] = [
  { year: 2004, city: "Athens", medal: "Bronze" },
  { year: 2008, city: "Beijing", medal: "Gold" },
  { year: 2012, city: "London", medal: "Gold" },
  // Paris 2024 was GOLD. USA beat France 98-87 in the final on 10 August and
  // did not play a third-place game, so there was no bronze to take. LeBron
  // played three in Paris — quarter-final, semi-final, and that final — and was
  // named MVP of the tournament. Career tally: 3 gold, 1 bronze.
  { year: 2024, city: "Paris", medal: "Gold" },
];

/** Milestones pinned to the season they happened in (season START year). */
const MILESTONES: Record<number, string> = {
  2003: "Rookie of the Year",
  2006: "First trip to the Finals",
  2022: "Passes Kareem Abdul-Jabbar for first all-time",
  // The 40,000th point fell on 2 March 2024, which is in the season that
  // STARTED in 2023 — hence the key. The string carries the calendar year so
  // the key cannot be read as one.
  2023: "First player past 40,000 points, in March 2024",
  2025: "First player to reach a 23rd season",
};

/**
 * The team span covering a season START year.
 *
 * Throws when no span covers the year. The previous form read
 * `TEAM_SPANS.find(...) ?? TEAM_SPANS[0]`, which silently labelled every gap
 * year "Cleveland" — a wrong team on the ruler, with no gate able to see it.
 * The spans are contiguous today; the throw is what keeps them so.
 */
export function teamForSeason(start: number): TeamSpan {
  const span = TEAM_SPANS.find((t) => start >= t.from && start <= t.to);
  if (!span) {
    throw new Error(
      `No TEAM_SPANS entry covers season ${start}. A gap year must not ` +
        `silently inherit the first team; add the span or fix its from/to.`,
    );
  }
  return span;
}

export interface Season {
  /** season start year — 2003 means the 2003-04 season */
  start: number;
  label: string;
  team: TeamSpan;
  /** true on the first season of a team span */
  opensSpan: boolean;
  title: boolean;
  mvp: boolean;
  olympic: OlympicYear | null;
  milestone: string | null;
}

export const SEASONS: Season[] = Array.from(
  { length: SEASON_COUNT },
  (_, i): Season => {
    const start = FIRST_SEASON + i;
    const team = teamForSeason(start);
    return {
      start,
      label: `${start}-${String((start + 1) % 100).padStart(2, "0")}`,
      team,
      opensSpan: team.from === start,
      title: TITLE_YEARS.includes(start + 1),
      mvp: MVP_YEARS.includes(start + 1),
      // The summer Games fall between seasons; hang each one on the season
      // that ended that spring so every marker has exactly one home.
      olympic: OLYMPICS.find((o) => o.year === start + 1) ?? null,
      milestone: MILESTONES[start] ?? null,
    };
  },
);

export const SPAN = {
  heading: "He has been here since 2003.",
  copy: "Twenty-three seasons, three NBA cities, and four Olympic teams. Longevity is not a footnote to this career. It is the argument.",
  legend: [
    { key: "title", text: "Championship season" },
    { key: "mvp", text: "Regular-season MVP" },
    { key: "olympic", text: "Olympic summer" },
  ],
} as const;
