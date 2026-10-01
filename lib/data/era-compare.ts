/* ---------------------------------------------------------------------------
 * ERA COMPARATOR — Peak-versus-Peak Head-to-Head Comparative Tool
 * ------------------------------------------------------------------------- */

export interface PeakEraProfile {
  id: string;
  name: string;
  seasonLabel: string;
  team: string;
  city: string;
  age: number;
  archetype: string;
  summary: string;
  metrics: {
    ppg: number;
    rpg: number;
    apg: number;
    spg: number;
    bpg: number;
    fgPct: number;
    threePtPct: number;
    tsPct: number;
    astToRatio: number;
    teamWins: number;
    teamLosses: number;
  };
  hardware: string[];
}

export const PEAK_ERAS: readonly PeakEraProfile[] = [
  {
    id: "2009",
    name: "Apex Athleticism",
    seasonLabel: "2008–09",
    team: "Cleveland Cavaliers",
    city: "Cleveland",
    age: 24,
    archetype: "Unstoppable Force",
    summary:
      "A 66-win juggernaut powered by raw, uncontainable transition force and terrorizing perimeter defense.",
    metrics: {
      ppg: 28.4,
      rpg: 7.6,
      apg: 7.2,
      spg: 1.7,
      bpg: 1.1,
      fgPct: 48.9,
      threePtPct: 34.4,
      tsPct: 59.1,
      astToRatio: 2.4,
      teamWins: 66,
      teamLosses: 16,
    },
    hardware: [
      "Regular Season MVP",
      "All-Defensive 1st Team",
      "All-NBA 1st Team",
      "66-16 Best Record in NBA",
    ],
  },
  {
    id: "2013",
    name: "Hyper-Efficient Apex",
    seasonLabel: "2012–13",
    team: "Miami Heat",
    city: "Miami",
    age: 28,
    archetype: "Perfection Engineered",
    summary:
      "Near-unanimous MVP who posted 56.5% FG and 40.6% 3PT during Miami's historic 27-game winning streak.",
    metrics: {
      ppg: 26.8,
      rpg: 8.0,
      apg: 7.3,
      spg: 1.7,
      bpg: 0.9,
      fgPct: 56.5,
      threePtPct: 40.6,
      tsPct: 64.0,
      astToRatio: 2.4,
      teamWins: 66,
      teamLosses: 16,
    },
    hardware: [
      "NBA Champion",
      "Finals MVP",
      "Regular Season MVP",
      "DPOY Runner-Up",
      "All-Defensive 1st Team",
    ],
  },
  {
    id: "2016",
    name: "The Cleveland Climax",
    seasonLabel: "2015–16",
    team: "Cleveland Cavaliers",
    city: "Cleveland",
    age: 31,
    archetype: "Will to Win",
    summary:
      "Led both Finals teams in points, rebounds, assists, steals, and blocks to erase a 3–1 deficit against 73-win Golden State.",
    metrics: {
      ppg: 25.3,
      rpg: 7.4,
      apg: 6.8,
      spg: 1.4,
      bpg: 0.6,
      fgPct: 52.0,
      threePtPct: 30.9,
      tsPct: 58.8,
      astToRatio: 2.1,
      teamWins: 57,
      teamLosses: 25,
    },
    hardware: [
      "NBA Champion",
      "Finals MVP (Unanimous)",
      "All-NBA 1st Team",
      "First Title in 52 Years",
    ],
  },
  {
    id: "2020",
    name: "Point LeBron",
    seasonLabel: "2019–20",
    team: "Los Angeles Lakers",
    city: "Los Angeles",
    age: 35,
    archetype: "Floor General",
    summary:
      "Shifted to full-time point guard, led the NBA in assists (10.2 APG), and dominated the Orlando Bubble to win his 4th title.",
    metrics: {
      ppg: 25.3,
      rpg: 7.8,
      apg: 10.2,
      spg: 1.2,
      bpg: 0.5,
      fgPct: 49.3,
      threePtPct: 34.8,
      tsPct: 57.7,
      astToRatio: 2.6,
      teamWins: 52,
      teamLosses: 19,
    },
    hardware: [
      "NBA Champion",
      "Finals MVP",
      "League Assist Leader (10.2 APG)",
      "All-NBA 1st Team",
    ],
  },
  {
    id: "2024",
    name: "Ageless 40K Maestro",
    seasonLabel: "2023–24",
    team: "Los Angeles Lakers",
    city: "Los Angeles",
    age: 39,
    archetype: "Longevity Miracle",
    summary:
      "First player to cross 40,000 career points, shot a career-best 41.0% from three, and closed out with a gold in Paris.",
    metrics: {
      ppg: 25.7,
      rpg: 7.3,
      apg: 8.3,
      spg: 1.3,
      bpg: 0.5,
      fgPct: 54.0,
      threePtPct: 41.0,
      tsPct: 63.0,
      astToRatio: 2.4,
      teamWins: 47,
      teamLosses: 35,
    },
    hardware: [
      "First to 40,000 Points",
      "Olympic Gold",
      "All-NBA Team at Age 39",
      "In-Season Tournament MVP",
    ],
  },
];

export const ERA_COMPARE_INTRO = {
  heading: "Era vs. Era",
  subheading: "Five peaks. Twenty-three seasons. One impossible standard.",
  copy: "Select any two signature seasons from across LeBron’s career to run a direct head-to-head metric audit: scoring volume, shooting efficiency, playmaking burden, defensive presence, and hardware won.",
} as const;

/* ---------------------------------------------------------------------------
 * ROAD TO 50,000 — Dynamic Pace & Milestone Projection Model
 * ------------------------------------------------------------------------- */

export interface MilestoneTarget {
  id: string;
  target: number;
  label: string;
  desc: string;
  type: "regular" | "combined";
}

export interface PacePreset {
  name: string;
  ppg: number;
  gamesPerYear: number;
  narrative: string;
}
