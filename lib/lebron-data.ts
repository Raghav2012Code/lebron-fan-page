/**
 * lebron-data.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for every factual claim on the site.
 *
 * GROUND RULES
 *  - Headline honours (titles, MVPs, Finals MVPs, golds, all-time scoring rank)
 *    are exact, stable, well-documented facts.
 *  - Point / game totals are ROUNDED approximations of regular-season figures
 *    and are labelled `approx` in the UI. Update the numbers here, never in the
 *    components.
 *  - The radar chart is an *editorial* index (subjective 0–100 read), clearly
 *    labelled as interpretation, not official data.
 *  - Bump STATS_AS_OF whenever you refresh the numbers.
 */

export const STATS_AS_OF = "2024–25 NBA season";

export const MASTHEAD = {
  kicker: "THE KING",
  born: "BORN 1984",
  place: "AKRON, OHIO",
  number: "№23",
  tributeLabel: "UNOFFICIAL FAN TRIBUTE №23",
} as const;

export const HERO = {
  first: "LEBRON",
  last: "JAMES",
  ghost: "23",
  centerStat: "4 TITLES · 4 MVPs · 40K+ POINTS",
  scrollCaption: "SCROLL — THE RECORD MOVES",
  copy: "An unofficial fan tribute to the player who turned longevity, pressure, and impossible expectations into a competitive language.",
  stats: [
    { value: "4", label: "TITLES" },
    { value: "4", label: "MVPs" },
    { value: "40K+", label: "POINTS" },
  ],
} as const;

export const MARQUEE = {
  top: ["THE KING", "23", "AKRON", "THE CHASE", "LEBRON JAMES", "THE KING", "23"],
  bottom: [
    "FOUR TITLES",
    "FOUR MVPs",
    "LONGEVITY",
    "PRESSURE",
    "LEGACY",
    "FOUR TITLES",
  ],
} as const;

/* ---------------------------------------------------------------------------
 * SECTION 01 — HONOURS & RECORDS
 * ------------------------------------------------------------------------- */

export type Accent = "gold" | "gold-bright" | "red" | "paper";

export interface RecordCard {
  index: string;
  value: number | null; // null → use `display` glyph instead of a counter
  display?: string; // shown when value is null (e.g. "№1")
  suffix?: string;
  label: string;
  context: string;
  accent: Accent;
  /** relative grid weight — drives the asymmetric layout */
  span: "sm" | "md" | "lg";
}

export const RECORDS: RecordCard[] = [
  {
    index: "01",
    value: 4,
    label: "NBA CHAMPIONSHIPS",
    context: "Miami 2012 & 2013 · Cleveland 2016 · Los Angeles 2020.",
    accent: "gold",
    span: "md",
  },
  {
    index: "02",
    value: 4,
    label: "REGULAR-SEASON MVP",
    context: "Most Valuable Player in 2009, 2010, 2012 and 2013.",
    accent: "paper",
    span: "sm",
  },
  {
    index: "03",
    value: 4,
    label: "FINALS MVP",
    context: "Named Finals MVP in each of his four championship runs.",
    accent: "gold",
    span: "sm",
  },
  {
    index: "04",
    value: 40000,
    suffix: "+",
    label: "REGULAR-SEASON POINTS",
    context: "The first player in league history past 40,000 points.",
    accent: "red",
    span: "lg",
  },
  {
    index: "05",
    value: 20,
    suffix: "+",
    label: "ALL-STAR SELECTIONS",
    context: "More than two decades of consecutive All-Star nods.",
    accent: "paper",
    span: "sm",
  },
  {
    index: "06",
    value: 3,
    label: "OLYMPIC GOLD MEDALS",
    context: "Beijing 2008, London 2012 and Paris 2024.",
    accent: "gold-bright",
    span: "sm",
  },
  {
    index: "07",
    value: null,
    display: "№1",
    label: "ALL-TIME SCORING LEADER",
    context: "Passed Kareem Abdul-Jabbar for first all-time in 2023.",
    accent: "red",
    span: "md",
  },
];

export const NEXT_MARK = {
  title: "THE NEXT MARK",
  metric: "REGULAR-SEASON POINTS",
  current: 40000,
  target: 50000,
  currentLabel: "PAST 40,000",
  targetLabel: "THE 50K HORIZON",
  note: "A milestone no one has ever approached — tracked, not predicted.",
} as const;

/* ---------------------------------------------------------------------------
 * SECTION 02 — THE ERAS  (pinned tunnel)
 * ------------------------------------------------------------------------- */

export interface Era {
  id: string;
  index: string; // "01".."06"
  name: string;
  years: string;
  place: string;
  jersey: string;
  headline: string;
  stat: string;
  statLabel: string;
  copy: string;
  ghost: string; // massive background numeral
  bg: string; // flat chapter background
  accent: string; // chapter accent
  text: string; // chapter foreground
}

export const ERAS: Era[] = [
  {
    id: "svsm",
    index: "01",
    name: "ST. VINCENT—ST. MARY",
    years: "2000 — 2003",
    place: "AKRON",
    jersey: "№23",
    headline: "THE CHOSEN ONE",
    stat: "3",
    statLabel: "STATE TITLES",
    copy: "Akron's St. Vincent–St. Mary turned a teenager into national television. Three state titles, a magazine cover at seventeen, and a certainty that the NBA was only a formality.",
    ghost: "01",
    bg: "#0A0908",
    accent: "#C9A227",
    text: "#EFE9DC",
  },
  {
    id: "cle1",
    index: "02",
    name: "CLEVELAND I",
    years: "2003 — 2010",
    place: "CLEVELAND",
    jersey: "№23",
    headline: "THE HOMECOMING WEIGHT",
    stat: "2",
    statLabel: "MVP AWARDS",
    copy: "The first overall pick carried a franchise and a region. Rookie of the Year, back-to-back MVPs, and a 2007 Finals run that arrived years before the roster did.",
    ghost: "02",
    bg: "#21090B",
    accent: "#C9A227",
    text: "#EFE9DC",
  },
  {
    id: "mia",
    index: "03",
    name: "MIAMI HEAT",
    years: "2010 — 2014",
    place: "MIAMI",
    jersey: "№6",
    headline: "THE DECISION, ANSWERED",
    stat: "2",
    statLabel: "CHAMPIONSHIPS",
    copy: "Four seasons, four Finals, two championships. In Miami the noise became a two-way peak and the first rings — proof burned into the record.",
    ghost: "03",
    bg: "#24100A",
    accent: "#E91532",
    text: "#EFE9DC",
  },
  {
    id: "cle2",
    index: "04",
    name: "CLEVELAND II",
    years: "2014 — 2018",
    place: "CLEVELAND",
    jersey: "№23",
    headline: "THE PROMISE KEPT",
    stat: "2016",
    statLabel: "THE TITLE",
    copy: "He came home to deliver what he left to find. Down 3–1 to a 73-win team, Cleveland's fifty-two-year wait ended in seven games.",
    ghost: "04",
    bg: "#1B0E0A",
    accent: "#F1C83B",
    text: "#EFE9DC",
  },
  {
    id: "lal",
    index: "05",
    name: "LOS ANGELES",
    years: "2018 — NOW",
    place: "LOS ANGELES",
    jersey: "№23",
    headline: "THE LONG VIEW",
    stat: "40K+",
    statLabel: "CAREER POINTS",
    copy: "A championship in the bubble, the all-time scoring record, and the first 40,000 points ever scored. Longevity became its own kind of dominance.",
    ghost: "05",
    bg: "#12100B",
    accent: "#C9A227",
    text: "#EFE9DC",
  },
  {
    id: "usa",
    index: "06",
    name: "TEAM USA",
    years: "2004 — 2024",
    place: "UNITED STATES",
    jersey: "№6",
    headline: "THE GLOBAL GAME",
    stat: "3",
    statLabel: "GOLD MEDALS",
    copy: "Bronze in Athens, then gold in Beijing, London and Paris. Two decades in national colours, and a flag to carry into the 2024 opening ceremony.",
    ghost: "06",
    bg: "#092017",
    accent: "#EFE9DC",
    text: "#EFE9DC",
  },
];

/* ---------------------------------------------------------------------------
 * SECTION 03 — STAT EXPLORER
 * ------------------------------------------------------------------------- */

export interface Metric {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  approx?: boolean;
}

export interface RadarAxis {
  axis: string;
  value: number; // editorial index 0–100
}

export interface ExplorerEra {
  id: string;
  tab: string;
  full: string;
  years: string;
  place: string;
  /** three headline metric bars */
  metrics: [Metric, Metric, Metric];
  /** running-total panel */
  running: { value: number; suffix?: string; label: string };
  achievements: string[];
  radar: RadarAxis[];
  note: string;
}

export const EXPLORER: ExplorerEra[] = [
  {
    id: "cle1",
    tab: "CLEVELAND I",
    full: "CLEVELAND CAVALIERS",
    years: "2003 — 2010",
    place: "CLEVELAND, OHIO",
    metrics: [
      { label: "POINTS", value: 15251, max: 16000, approx: true },
      { label: "GAMES", value: 548, max: 600 },
      { label: "POINTS / GAME", value: 27.8, max: 30, approx: true },
    ],
    running: { value: 15251, label: "CAREER POINTS THROUGH 2010" },
    achievements: [
      "ROOKIE OF THE YEAR — 2004",
      "REGULAR-SEASON MVP — 2009 & 2010",
      "FIRST NBA FINALS — 2007",
    ],
    radar: [
      { axis: "SCORING", value: 88 },
      { axis: "PLAYMAKING", value: 90 },
      { axis: "DEFENCE", value: 78 },
      { axis: "TITLES", value: 20 },
      { axis: "LONGEVITY", value: 55 },
    ],
    note: "The phenom years: production immediately, a supporting cast slowly.",
  },
  {
    id: "mia",
    tab: "MIAMI",
    full: "MIAMI HEAT",
    years: "2010 — 2014",
    place: "MIAMI, FLORIDA",
    metrics: [
      { label: "POINTS", value: 7919, max: 16000, approx: true },
      { label: "GAMES", value: 294, max: 600 },
      { label: "POINTS / GAME", value: 26.9, max: 30, approx: true },
    ],
    running: { value: 23170, label: "CAREER POINTS THROUGH 2014" },
    achievements: [
      "NBA CHAMPION — 2012 & 2013",
      "FINALS MVP — 2012 & 2013",
      "REGULAR-SEASON MVP — 2012 & 2013",
      "FOUR STRAIGHT FINALS",
    ],
    radar: [
      { axis: "SCORING", value: 92 },
      { axis: "PLAYMAKING", value: 88 },
      { axis: "DEFENCE", value: 92 },
      { axis: "TITLES", value: 80 },
      { axis: "LONGEVITY", value: 70 },
    ],
    note: "The two-way peak: the criticism turned into the first championships.",
  },
  {
    id: "cle2",
    tab: "CLEVELAND II",
    full: "CLEVELAND CAVALIERS",
    years: "2014 — 2018",
    place: "CLEVELAND, OHIO",
    metrics: [
      { label: "POINTS", value: 8192, max: 16000, approx: true },
      { label: "GAMES", value: 301, max: 600 },
      { label: "POINTS / GAME", value: 27.2, max: 30, approx: true },
    ],
    running: { value: 31362, label: "CAREER POINTS THROUGH 2018" },
    achievements: [
      "NBA CHAMPION — 2016",
      "3–1 FINALS COMEBACK",
      "FINALS MVP — 2016",
      "FOUR STRAIGHT FINALS",
    ],
    radar: [
      { axis: "SCORING", value: 90 },
      { axis: "PLAYMAKING", value: 92 },
      { axis: "DEFENCE", value: 80 },
      { axis: "TITLES", value: 72 },
      { axis: "LONGEVITY", value: 82 },
    ],
    note: "The promise kept: a city's first title in fifty-two years.",
  },
  {
    id: "lal",
    tab: "LOS ANGELES",
    full: "LOS ANGELES LAKERS",
    years: "2018 — NOW",
    place: "LOS ANGELES, CALIFORNIA",
    metrics: [
      { label: "POINTS", value: 8900, max: 16000, approx: true },
      { label: "GAMES", value: 350, max: 600, approx: true },
      { label: "POINTS / GAME", value: 25.4, max: 30, approx: true },
    ],
    running: { value: 40000, suffix: "+", label: "CAREER POINTS — AND COUNTING" },
    achievements: [
      "NBA CHAMPION — 2020",
      "FINALS MVP — 2020",
      "ALL-TIME SCORING LEADER — 2023",
      "40,000 POINTS — 2024",
    ],
    radar: [
      { axis: "SCORING", value: 88 },
      { axis: "PLAYMAKING", value: 86 },
      { axis: "DEFENCE", value: 68 },
      { axis: "TITLES", value: 70 },
      { axis: "LONGEVITY", value: 100 },
    ],
    note: "The long view: records that measure endurance as much as talent.",
  },
  {
    id: "usa",
    tab: "TEAM USA",
    full: "UNITED STATES",
    years: "2004 — 2024",
    place: "OLYMPIC BASKETBALL",
    metrics: [
      { label: "OLYMPIC GAMES", value: 4, max: 4 },
      { label: "GOLD MEDALS", value: 3, max: 4 },
      { label: "TOTAL MEDALS", value: 4, max: 4 },
    ],
    running: { value: 3, label: "OLYMPIC GOLD MEDALS" },
    achievements: [
      "GOLD — BEIJING 2008",
      "GOLD — LONDON 2012",
      "GOLD — PARIS 2024",
      "BRONZE — ATHENS 2004",
      "FLAG BEARER — PARIS 2024",
    ],
    radar: [
      { axis: "SCORING", value: 84 },
      { axis: "PLAYMAKING", value: 88 },
      { axis: "DEFENCE", value: 90 },
      { axis: "TITLES", value: 96 },
      { axis: "LONGEVITY", value: 88 },
    ],
    note: "The global game: two decades of national colours, three golds.",
  },
];

/* ---------------------------------------------------------------------------
 * SECTION 04 — THE NUMBER
 * ------------------------------------------------------------------------- */

export const NUMBER_SECTION = {
  word: "TWENTY THREE",
  numeral: "23",
  ring: "KING · 23 · AKRON · KING · ",
  paragraphs: [
    "Twenty-three is not a number he chose so much as one he made unavoidable — worn from Akron gyms to three franchises, bound for rafters he has not finished filling.",
    "It is a number carried on purpose: a statement that the highest standard was the point, and that comparison was never something to be feared.",
  ],
} as const;

/* ---------------------------------------------------------------------------
 * SECTION 06 — THE LEGACY (timeline)
 * ------------------------------------------------------------------------- */

export interface LegacyEvent {
  year: string;
  title: string;
  copy: string;
  accent: Accent;
}

export const LEGACY: LegacyEvent[] = [
  {
    year: "2003",
    title: "THE ARRIVAL",
    copy: "Selected first overall out of high school. Rookie of the Year a season later, and the weight of a franchise from day one.",
    accent: "gold",
  },
  {
    year: "2016",
    title: "THE COMEBACK",
    copy: "Down 3–1 to a 73-win Golden State, he led Cleveland back to end the city's fifty-two-year championship drought.",
    accent: "red",
  },
  {
    year: "2020",
    title: "THE CROWN",
    copy: "A fourth ring with the Lakers and a fourth Finals MVP — a title won in the isolation of the Orlando bubble.",
    accent: "gold-bright",
  },
  {
    year: "2024",
    title: "THE RETURN",
    copy: "Gold again in Paris and a turn as flag bearer — the same year he crossed 40,000 points and shared an NBA floor with his son.",
    accent: "paper",
  },
];

/* ---------------------------------------------------------------------------
 * FOOTER
 * ------------------------------------------------------------------------- */

export const FOOTER = {
  ghost: "23",
  disclaimerTitle: "AN UNOFFICIAL FAN PROJECT",
  disclaimer:
    "Not affiliated with LeBron James, the NBA, the Los Angeles Lakers, the Cleveland Cavaliers, the Miami Heat, or USA Basketball. All trademarks belong to their respective owners.",
  credits: [
    "TYPE — ANTON · ARCHIVO · JETBRAINS MONO",
    "100% ORIGINAL TYPE-LED ARTWORK",
  ],
  closing: "THE WORK CONTINUES.",
} as const;

export const SECTIONS = [
  { id: "records", label: "01 — HONOURS & RECORDS" },
  { id: "eras", label: "02 — THE ERAS" },
  { id: "explorer", label: "03 — STAT EXPLORER" },
  { id: "number", label: "04 — THE NUMBER" },
  { id: "challenge", label: "05 — INTERACTIVE" },
  { id: "legacy", label: "06 — THE LEGACY" },
] as const;
