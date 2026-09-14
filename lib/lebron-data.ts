/**
 * lebron-data.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for every factual claim on the site.
 *
 * GROUND RULES
 *  - Headline honours (titles, MVPs, Finals MVPs, golds, all-time scoring rank,
 *    award years, championship years, Olympic years) are exact, stable,
 *    well-documented facts.
 *  - Season, game and counting totals are exact official regular-season
 *    figures. The per-season table they come from sums to the published
 *    career totals in every category (see CAREER below), so the stint splits
 *    and the career line cannot disagree with each other.
 *  - Per-game figures are those totals divided out and rounded to one decimal,
 *    which is how they are published.
 *  - Nothing here is an invented index or a projection. Bump STATS_AS_OF
 *    whenever the numbers are refreshed.
 */

export const STATS_AS_OF = "the 2025-26 season";

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
  { year: 2024, city: "Paris", medal: "Gold" },
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

/* ---------------------------------------------------------------------------
 * HERO
 * ------------------------------------------------------------------------- */

export const HERO = {
  first: "LEBRON",
  last: "JAMES",
  meta: ["Akron, Ohio", "Born 1984", "No. 23"],
  standfirst:
    "An unofficial fan tribute to the player who turned longevity, pressure, and impossible expectations into a competitive language.",
  figures: [
    { value: "4", label: "Championships" },
    { value: "4", label: "Most Valuable Player" },
    { value: "43,440", label: "Regular-season points" },
  ],
} as const;

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
      "He passed forty thousand in March 2024, the first player in league history to get there, and has not stopped.",
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
    value: 3,
    label: "Olympic gold medals",
    context: "Beijing 2008, London 2012 and Paris 2024, plus bronze in Athens.",
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

export const NEXT_MARK = {
  heading: "The measure that is still open",
  current: 43440,
  target: 50000,
  currentLabel: "43,440",
  targetLabel: "50,000",
  note: "Nobody has been near it. A mark being tracked, not a prediction.",
} as const;

/* ---------------------------------------------------------------------------
 * THE LINE — the official career stat line.
 *
 * Every figure below is an exact regular-season total from the official
 * record, cross-checked three ways: the per-season table sums to each of
 * these totals, and each average is its total divided by 1,622 games.
 * ------------------------------------------------------------------------- */

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
    { label: "Points", avg: 26.8, total: 43440, rank: "Most in NBA history" },
    { label: "Rebounds", avg: 7.5, total: 12095 },
    { label: "Assists", avg: 7.4, total: 12016 },
  ] as CareerAverage[],
  supporting: [
    { label: "Games played", value: "1,622", note: "Most in NBA history" },
    { label: "Minutes played", value: "61,031", note: "Most in NBA history" },
    { label: "Steals", value: "2,417" },
    { label: "Blocks", value: "1,185" },
    { label: "Field goals", value: "50.7%" },
    { label: "Three-pointers", value: "34.8%" },
    { label: "Free throws", value: "73.7%" },
  ] as CareerRow[],
  playoffs: {
    label: "And in the playoffs",
    points: 8289,
    games: 292,
    copy: "8,289 points across 292 playoff games, which is also more than anyone else has scored. Regular season and playoffs together, he finished the season on 51,729.",
  },
  triple:
    "He is the only player in the history of the league to reach ten thousand points, ten thousand rebounds and ten thousand assists.",
} as const;

/* ---------------------------------------------------------------------------
 * THE ROOMS — pinned chapters
 * ------------------------------------------------------------------------- */

export interface Room {
  id: string;
  name: string;
  years: string;
  venue: string;
  jersey: string;
  stat: string;
  statLabel: string;
  copy: string;
  floor: string;
  paint: string;
  type: string;
  dim: string;
}

export const ROOMS_INTRO = {
  heading: "The rooms he has played in",
  copy: "An Akron high-school gym, three NBA cities, and two decades in national colours. Six rooms, one long argument.",
} as const;

export const ROOMS: Room[] = [
  {
    id: "akron",
    name: "Akron",
    years: "2000-2003",
    venue: "St. Vincent-St. Mary High School",
    jersey: "23",
    stat: "3",
    statLabel: "Ohio state titles",
    copy: "A high-school gym in Akron outgrew itself and moved its games to the university arena down the road. Three state titles, a national magazine cover at seventeen, and a growing sense that the NBA was a formality rather than an ambition.",
    floor: "#E7D6B4",
    paint: "#1E5B3A",
    type: "#231508",
    dim: "rgba(35,21,8,0.72)",
  },
  {
    id: "cle1",
    name: "Cleveland",
    years: "2003-2010",
    venue: "Cleveland Cavaliers",
    jersey: "23",
    stat: "2",
    statLabel: "MVP awards",
    copy: "The first overall pick went to the team down the road from where he grew up, and to a region that badly needed him to be as good as advertised. Rookie of the Year, back-to-back MVPs, and a Finals run in 2007 that arrived years before the roster around him did.",
    floor: "#5C1626",
    paint: "#E0A72C",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
  {
    id: "mia",
    name: "Miami",
    years: "2010-2014",
    venue: "Miami Heat",
    jersey: "6",
    stat: "2",
    statLabel: "Championships",
    copy: "He left, and the noise followed him south. Four seasons, four Finals, two rings. Miami is where the criticism turned into a two-way peak, and where the argument stopped being theoretical.",
    floor: "#7A1810",
    paint: "#E8761E",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
  {
    id: "cle2",
    name: "Cleveland, again",
    years: "2014-2018",
    venue: "Cleveland Cavaliers",
    jersey: "23",
    stat: "2016",
    statLabel: "The title he went back for",
    copy: "He returned to deliver the thing he had left in order to go and find. Three games to one down against a team that had won seventy-three, Cleveland took the last three, and a fifty-two-year wait ended in game seven.",
    floor: "#E0A72C",
    paint: "#5C1626",
    type: "#2A0C13",
    dim: "rgba(42,12,19,0.76)",
  },
  {
    id: "lal",
    name: "Los Angeles",
    years: "2018-2026",
    venue: "Los Angeles Lakers",
    jersey: "23",
    stat: "12,402",
    statLabel: "Points in eight seasons",
    copy: "A championship won inside a sealed campus in Orlando with nobody in the building, the all-time scoring record, and the first forty thousand points anyone has scored. Eight seasons in Los Angeles, in which endurance became its own form of dominance.",
    floor: "#3B2352",
    paint: "#E0A72C",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
  {
    id: "usa",
    name: "National colours",
    years: "2004-2024",
    venue: "United States",
    jersey: "6",
    stat: "3",
    statLabel: "Gold medals",
    copy: "Bronze in Athens as a teenager, then gold in Beijing, London and Paris. Twenty years in the same shirt, and the flag to carry into the opening ceremony at the end of it.",
    floor: "#16305A",
    paint: "#FBF7EF",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
];

/* ---------------------------------------------------------------------------
 * THE LEDGER — the points, added up
 * ------------------------------------------------------------------------- */

export interface Metric {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  approx?: boolean;
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
    running: { value: 43440, label: "Career points" },
    achievements: [
      { when: "2020", what: "NBA champion" },
      { when: "2020", what: "Finals MVP" },
      { when: "2023", what: "All-time scoring leader" },
      { when: "2024", what: "First past 40,000 points" },
      { when: "2026", what: "First to play a 23rd season" },
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
      { when: "2024", what: "Gold in Paris" },
      { when: "2004", what: "Bronze in Athens" },
      { when: "2024", what: "Flag bearer for the United States" },
    ],
    note: "Two decades in the same shirt, and three golds to show for it.",
  },
];

/* ---------------------------------------------------------------------------
 * TWENTY-THREE
 * ------------------------------------------------------------------------- */

export const NUMBER = {
  numeral: "23",
  spoken: "Twenty-three",
  worn: [
    { n: "23", where: "Akron, then Cleveland, then Los Angeles" },
    { n: "6", where: "Miami, Team USA, and two Lakers seasons" },
    { n: "23", where: "Los Angeles again, from 2023" },
  ],
  paragraphs: [
    "Twenty-three is less a number he picked than one he made impossible to hand to anybody else. It went from an Akron gym to three franchises, and it is bound for rafters he has not finished filling.",
    "It was carried on purpose. Wearing it said that the highest standard was the point, and that being measured against it was never something to be afraid of.",
  ],
} as const;

/* ---------------------------------------------------------------------------
 * THE LAST SHOT — interactive
 * ------------------------------------------------------------------------- */

export const SHOT = {
  heading: "Take the last shot",
  copy: "Time the release into the painted band and keep the aim centred. Three in a row and the gym starts making noise.",
  keys: [
    { key: "Space or Enter", does: "Shoot" },
    { key: "Left and right arrows", does: "Aim" },
    { key: "Click or tap the court", does: "Shoot" },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * FOUR NIGHTS
 * ------------------------------------------------------------------------- */

export interface Night {
  year: string;
  title: string;
  copy: string;
}

export const NIGHTS_INTRO = {
  heading: "Four nights",
  copy: "Most games get a box score. These four got a name.",
} as const;

export const NIGHTS: Night[] = [
  {
    year: "2003",
    title: "The arrival",
    copy: "Taken first overall out of high school by the team down the road from where he grew up. Rookie of the Year a season later, carrying a franchise before he was old enough to toast the win.",
  },
  {
    year: "2016",
    title: "The comeback",
    copy: "Three games to one down against a Golden State side that had won seventy-three. Cleveland took the last three, and a city that had waited fifty-two years finally stopped waiting.",
  },
  {
    year: "2020",
    title: "The fourth",
    copy: "A title won inside a sealed campus in Orlando with nobody in the building. A fourth ring, a fourth Finals MVP, and a third franchise on the list.",
  },
  {
    year: "2024",
    title: "The long view",
    copy: "Gold in Paris and the flag at the opening ceremony, in the same year he crossed forty thousand points and shared an NBA floor with his son.",
  },
];

/* ---------------------------------------------------------------------------
 * THE BLOCK — June 19, 2016
 * ------------------------------------------------------------------------- */

export interface BlockKeyframe {
  time: number;
  lebron: { x: number; y: number; elevation: number };
  iguodala: { x: number; y: number };
  jrSmith: { x: number; y: number };
  ball: { x: number; y: number };
  annotation: string;
  telemetry: {
    speed: string;
    distance: string;
    elevation: string;
  };
}

export const THE_BLOCK = {
  heading: "The Block",
  subheading: "Game 7, 2016 NBA Finals. 89–89. 1:52 remaining.",
  copy: "Ninety-three feet of hardwood closed in 2.8 seconds. A chase-down sprint at 20.1 miles per hour that ended with both hands on the glass at eleven feet five inches.",
  quote:
    "“Back comes Iguodala to Curry, back to Iguodala, up for the layup... Oh! BLOCKED BY JAMES! LeBron James with the rejection!”",
  caller: "Mike Breen, ABC Sports",
  duration: 2.8,
  stats: [
    { label: "Sprint distance", value: "93 ft" },
    { label: "Peak sprint speed", value: "20.1 mph" },
    { label: "Impact elevation", value: "11' 5\"" },
    { label: "Time to glass", value: "2.8 sec" },
  ],
  keyframes: [
    {
      time: 0.0,
      lebron: { x: 38, y: 8, elevation: 0 },
      iguodala: { x: 42, y: 16 },
      jrSmith: { x: 48, y: 36 },
      ball: { x: 42, y: 16 },
      annotation:
        "Kyrie Irving misses a floater. Andre Iguodala secures the defensive rebound and ignites the Golden State 2-on-1.",
      telemetry: { speed: "11.2 mph", distance: "88 ft", elevation: "0' 0\"" },
    },
    {
      time: 0.7,
      lebron: { x: 42, y: 26, elevation: 0 },
      iguodala: { x: 44, y: 36 },
      jrSmith: { x: 49, y: 52 },
      ball: { x: 44, y: 36 },
      annotation:
        "LeBron crosses the half-court stripe, accelerating past everyone else on the floor.",
      telemetry: { speed: "17.4 mph", distance: "68 ft", elevation: "0' 0\"" },
    },
    {
      time: 1.4,
      lebron: { x: 46, y: 48, elevation: 0 },
      iguodala: { x: 47, y: 56 },
      jrSmith: { x: 50, y: 68 },
      ball: { x: 47, y: 56 },
      annotation:
        "LeBron reaches top sprint speed: 20.1 mph — faster than any sprint recorded in the entire 2016 Finals.",
      telemetry: { speed: "20.1 mph", distance: "45 ft", elevation: "0' 0\"" },
    },
    {
      time: 2.1,
      lebron: { x: 48, y: 72, elevation: 0 },
      iguodala: { x: 48, y: 74 },
      jrSmith: { x: 51, y: 80 },
      ball: { x: 48, y: 74 },
      annotation:
        "JR Smith retreats and contests straight up without fouling, forcing Iguodala to double-clutch and extend high.",
      telemetry: { speed: "19.3 mph", distance: "21 ft", elevation: "0' 0\"" },
    },
    {
      time: 2.5,
      lebron: { x: 49, y: 83, elevation: 2.8 },
      iguodala: { x: 49, y: 84 },
      jrSmith: { x: 52, y: 85 },
      ball: { x: 49, y: 85 },
      annotation:
        "LeBron launches off two feet outside the charge circle, rising toward the glass with eyes level with the rim.",
      telemetry: { speed: "14.8 mph", distance: "8 ft", elevation: "8' 9\"" },
    },
    {
      time: 2.8,
      lebron: { x: 50, y: 87.5, elevation: 3.5 },
      iguodala: { x: 49, y: 87.5 },
      jrSmith: { x: 53, y: 87 },
      ball: { x: 49.5, y: 87.5 },
      annotation:
        "“BLOCKED BY JAMES!” Both hands pin the ball flush against the backboard at eleven feet five inches.",
      telemetry: { speed: "0.0 mph", distance: "0 ft", elevation: "11' 5\"" },
    },
  ] as BlockKeyframe[],
} as const;

/* ---------------------------------------------------------------------------
 * BASELINE — the footer
 * ------------------------------------------------------------------------- */

export const BASELINE = {
  closing: "The work continues.",
  disclaimerTitle: "An unofficial fan project",
  disclaimer:
    "Not affiliated with LeBron James, the NBA, the Los Angeles Lakers, the Cleveland Cavaliers, the Miami Heat, or USA Basketball. All trademarks belong to their respective owners.",
  credits: [
    "Set in Archivo and Newsreader",
    "Original type-led artwork, no photography",
  ],
  identity: ["The King, No. 23", "Akron, Ohio, born 1984"],
} as const;

export const SECTIONS = [
  { id: "span", label: "The span" },
  { id: "hardware", label: "Hardware" },
  { id: "line", label: "The line" },
  { id: "rooms", label: "The rooms" },
  { id: "ledger", label: "The ledger" },
  { id: "number", label: "Twenty-three" },
  { id: "shot", label: "Take the last shot" },
  { id: "nights", label: "Four nights" },
  { id: "the-block", label: "The block" },
] as const;
