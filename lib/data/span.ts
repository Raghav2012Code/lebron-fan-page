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
  // Paris 2024 was BRONZE. USA lost the gold-medal game to France and took
  // bronze; LeBron played three games in Paris (QF, SF, bronze game), where a
  // gold run would have required a fourth. Career tally: 2 gold, 2 bronze.
  { year: 2024, city: "Paris", medal: "Bronze" },
];

/** Milestones pinned to the season they happened in (season START year). */
const MILESTONES: Record<number, string> = {
  2003: "Rookie of the Year",
  2006: "First trip to the Finals",
  2022: "Passes Kareem Abdul-Jabbar for first all-time",
  2023: "First player past 40,000 points",
  2025: "First player to reach a 23rd season",
};

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
    const team =
      TEAM_SPANS.find((t) => start >= t.from && start <= t.to) ?? TEAM_SPANS[0];
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
