// ============================================================================
// 1. PLAYOFF SERIES MATRIX DATA STRUCTURES (R1)
// ============================================================================

export type PlayoffRoundCategory =
  | "First Round"
  | "Conf Semifinals"
  | "Conf Finals"
  | "NBA Finals";

export interface SeriesBoxScoreTotals {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  fgm: number;
  fga: number;
  ftm: number;
  fta: number;
}

export interface PlayoffSeries {
  id: string;
  season: string; // e.g. "2005-06"
  year: number; // e.g. 2006
  roundCode: "EC1" | "WC1" | "ECS" | "WCS" | "ECF" | "WCF" | "FIN";
  roundCategory: PlayoffRoundCategory;
  roundName: string; // e.g. "Eastern Conference First Round"
  team: "CLE" | "MIA" | "LAL";
  teamName: string;
  opponent: string; // 3-letter abbr
  opponentName: string;
  result: "W" | "L";
  seriesScore: string; // e.g. "4–2"
  gamesWon: number;
  gamesLost: number;
  totalGames: number;
  isSweep: boolean;
  sweepType: "won" | "lost" | null;
  ppg: number;
  rpg: number;
  apg: number;
  spg: number;
  bpg: number;
  fgPct: number;
  threePtPct: number;
  ftPct: number;
  boxScoreTotals: SeriesBoxScoreTotals;
  signatureMoment: string;
}

export interface FranchisePostseasonRecord {
  abbr: string;
  name: string;
  seriesPlayed: number;
  seriesWon: number;
  seriesLost: number;
  gamesWon: number;
  gamesLost: number;
  sweepsWon: number;
  sweepsLost: number;
  years: number[];
  seriesList: string[]; // series IDs
}

// ============================================================================
// 2. CLUTCH GAME-WINNER ANTHOLOGY DATA STRUCTURES (R2)
// ============================================================================

export interface ChalkboardCoordinates {
  x: number; // 0 to 100 percentage width across the court
  y: number; // 0 to 100 percentage length along the court
}

export interface ChalkboardTelemetry {
  clock: string; // e.g. "1.0s"
  speed: string; // e.g. "14.2 mph"
  distance: string; // e.g. "25 ft"
  action: string;
}

export interface ChalkboardKeyframe {
  time: number; // elapsed seconds into sequence (0.0 to duration)
  annotation: string;
  lebron: ChalkboardCoordinates;
  defender: ChalkboardCoordinates;
  inbounder: ChalkboardCoordinates;
  ball: ChalkboardCoordinates;
  telemetry: ChalkboardTelemetry;
}

export interface ClutchBuzzerBeater {
  id: string;
  date: string;
  isoDate: string;
  season: string;
  year: number;
  round: string;
  roundShort: string;
  game: string;
  team: "CLE" | "MIA" | "LAL";
  opponent: string;
  opponentName: string;
  venue: string;
  scoreBefore: string;
  scoreAfter: string;
  result: string;
  clockRemaining: string;
  shotDistance: string;
  shotType: string;
  courtZone: string;
  inbounder: string;
  primaryDefender: string;
  screener: string;
  seriesSituationBefore: string;
  seriesImpact: string;
  broadcastCall: {
    caller: string;
    network: string;
    quote: string;
  };
  description: string;
  keyframes: ChalkboardKeyframe[];
}

// ============================================================================
// 3. TRIPLE-DOUBLE CONSTELLATION DATA STRUCTURES (R3)
// ============================================================================

export type TripleDoubleCategory = "Playoffs" | "Regular Season" | "NBA Finals";

export interface TripleDoubleEntry {
  id: string;
  date: string;
  season?: string;
  year: number;
  era?: "cle1" | "mia" | "cle2" | "lal";
  round?: string;
  roundCode?: string;
  gameNumber?: number;
  team: "CLE" | "MIA" | "LAL";
  opponent: string;
  opponentName: string;
  pts: number;
  reb: number;
  ast: number;
  result: "W" | "L";
  score: string;
  venue: string;
  category?: TripleDoubleCategory;
  milestone?: string;
  notes: string;
}

export interface TripleDoubleSummary {
  careerTotal: number;
  regularSeasonTotal: number;
  playoffTotal: number;
  finalsTotal: number;
  allThirtyFranchisesBeaten: boolean;
  franchisesConqueredDate: string;
  highestScoringRegularSeason: { pts: number; reb: number; ast: number; opp: string; date: string };
  highestScoringPlayoffs: { pts: number; reb: number; ast: number; opp: string; date: string };
  highestRebounds: { pts: number; reb: number; ast: number; opp: string; date: string };
  highestAssists: { pts: number; reb: number; ast: number; opp: string; date: string };
  oldestAge: string;
  youngestAge: string;
}


// --- EXPORTABLE DATA CONSTANTS ---

export const PLAYOFF_SERIES: readonly PlayoffSeries[] = [
  {
    "id": "series-1",
    "season": "2005-06",
    "year": 2006,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "WAS",
    "opponentName": "Washington Wizards",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 35.7,
    "rpg": 7.5,
    "apg": 5.7,
    "spg": 1.3,
    "bpg": 0.7,
    "fgPct": 0.51,
    "threePtPct": 0.382,
    "ftPct": 0.746,
    "boxScoreTotals": {
      "pts": 214,
      "reb": 45,
      "ast": 34,
      "stl": 8,
      "blk": 4,
      "tov": 34,
      "fgm": 77,
      "fga": 151,
      "ftm": 47,
      "fta": 63
    },
    "signatureMoment": "Playoff debut: 32-11-11 triple-double in Game 1 and game-winning baseline floater in Game 3."
  },
  {
    "id": "series-2",
    "season": "2005-06",
    "year": 2006,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "DET",
    "opponentName": "Detroit Pistons",
    "result": "L",
    "seriesScore": "3\u20134",
    "gamesWon": 3,
    "gamesLost": 4,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 26.6,
    "rpg": 8.6,
    "apg": 6.0,
    "spg": 1.4,
    "bpg": 0.7,
    "fgPct": 0.442,
    "threePtPct": 0.276,
    "ftPct": 0.727,
    "boxScoreTotals": {
      "pts": 186,
      "reb": 60,
      "ast": 42,
      "stl": 10,
      "blk": 5,
      "tov": 31,
      "fgm": 69,
      "fga": 156,
      "ftm": 40,
      "fta": 55
    },
    "signatureMoment": "Pushed the reigning Eastern Champion Pistons to 7 games at age 21."
  },
  {
    "id": "series-3",
    "season": "2006-07",
    "year": 2007,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "WAS",
    "opponentName": "Washington Wizards",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 27.8,
    "rpg": 8.5,
    "apg": 7.5,
    "spg": 1.8,
    "bpg": 0.8,
    "fgPct": 0.425,
    "threePtPct": 0.267,
    "ftPct": 0.813,
    "boxScoreTotals": {
      "pts": 111,
      "reb": 34,
      "ast": 30,
      "stl": 7,
      "blk": 3,
      "tov": 7,
      "fgm": 34,
      "fga": 80,
      "ftm": 39,
      "fta": 48
    },
    "signatureMoment": "Postseason clash vs Washington Wizards (4-0)."
  },
  {
    "id": "series-4",
    "season": "2006-07",
    "year": 2007,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "NJN",
    "opponentName": "New Jersey Nets",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 24.7,
    "rpg": 7.3,
    "apg": 8.5,
    "spg": 1.2,
    "bpg": 0.3,
    "fgPct": 0.423,
    "threePtPct": 0.308,
    "ftPct": 0.754,
    "boxScoreTotals": {
      "pts": 148,
      "reb": 44,
      "ast": 51,
      "stl": 7,
      "blk": 2,
      "tov": 17,
      "fgm": 47,
      "fga": 111,
      "ftm": 46,
      "fta": 61
    },
    "signatureMoment": "Postseason clash vs New Jersey Nets (4-2)."
  },
  {
    "id": "series-5",
    "season": "2006-07",
    "year": 2007,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "DET",
    "opponentName": "Detroit Pistons",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 25.7,
    "rpg": 9.2,
    "apg": 8.5,
    "spg": 2.7,
    "bpg": 0.5,
    "fgPct": 0.449,
    "threePtPct": 0.357,
    "ftPct": 0.741,
    "boxScoreTotals": {
      "pts": 154,
      "reb": 55,
      "ast": 51,
      "stl": 16,
      "blk": 3,
      "tov": 19,
      "fgm": 53,
      "fga": 118,
      "ftm": 43,
      "fta": 58
    },
    "signatureMoment": "Game 5 masterclass: Scored Cavaliers' final 25 straight points and 29 of last 30 in double OT."
  },
  {
    "id": "series-6",
    "season": "2006-07",
    "year": 2007,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "result": "L",
    "seriesScore": "0\u20134",
    "gamesWon": 0,
    "gamesLost": 4,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "lost",
    "ppg": 22.0,
    "rpg": 7.0,
    "apg": 6.8,
    "spg": 1.0,
    "bpg": 0.5,
    "fgPct": 0.356,
    "threePtPct": 0.2,
    "ftPct": 0.69,
    "boxScoreTotals": {
      "pts": 88,
      "reb": 28,
      "ast": 27,
      "stl": 4,
      "blk": 2,
      "tov": 23,
      "fgm": 32,
      "fga": 90,
      "ftm": 20,
      "fta": 29
    },
    "signatureMoment": "First NBA Finals appearance at age 22, facing the dynastic Spurs."
  },
  {
    "id": "series-7",
    "season": "2007-08",
    "year": 2008,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "WAS",
    "opponentName": "Washington Wizards",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 29.8,
    "rpg": 9.5,
    "apg": 7.7,
    "spg": 1.3,
    "bpg": 1.3,
    "fgPct": 0.483,
    "threePtPct": 0.29,
    "ftPct": 0.701,
    "boxScoreTotals": {
      "pts": 179,
      "reb": 57,
      "ast": 46,
      "stl": 8,
      "blk": 8,
      "tov": 17,
      "fgm": 58,
      "fga": 120,
      "ftm": 54,
      "fta": 77
    },
    "signatureMoment": "Postseason clash vs Washington Wizards (4-2)."
  },
  {
    "id": "series-8",
    "season": "2007-08",
    "year": 2008,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "result": "L",
    "seriesScore": "3\u20134",
    "gamesWon": 3,
    "gamesLost": 4,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 26.7,
    "rpg": 6.4,
    "apg": 7.6,
    "spg": 2.1,
    "bpg": 1.3,
    "fgPct": 0.355,
    "threePtPct": 0.231,
    "ftPct": 0.756,
    "boxScoreTotals": {
      "pts": 187,
      "reb": 45,
      "ast": 53,
      "stl": 15,
      "blk": 9,
      "tov": 37,
      "fgm": 55,
      "fga": 155,
      "ftm": 68,
      "fta": 90
    },
    "signatureMoment": "Epic duel with Paul Pierce in Game 7: LeBron scores 45 points against Boston's Big Three."
  },
  {
    "id": "series-9",
    "season": "2008-09",
    "year": 2009,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "DET",
    "opponentName": "Detroit Pistons",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 32.0,
    "rpg": 11.3,
    "apg": 7.5,
    "spg": 1.5,
    "bpg": 0.8,
    "fgPct": 0.506,
    "threePtPct": 0.176,
    "ftPct": 0.797,
    "boxScoreTotals": {
      "pts": 128,
      "reb": 45,
      "ast": 30,
      "stl": 6,
      "blk": 3,
      "tov": 6,
      "fgm": 39,
      "fga": 77,
      "ftm": 47,
      "fta": 59
    },
    "signatureMoment": "Swept Detroit averaging 32.0 PPG, 11.3 RPG, 7.5 APG."
  },
  {
    "id": "series-10",
    "season": "2008-09",
    "year": 2009,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "ATL",
    "opponentName": "Atlanta Hawks",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 33.8,
    "rpg": 8.3,
    "apg": 6.0,
    "spg": 2.5,
    "bpg": 0.5,
    "fgPct": 0.556,
    "threePtPct": 0.481,
    "ftPct": 0.696,
    "boxScoreTotals": {
      "pts": 135,
      "reb": 33,
      "ast": 24,
      "stl": 10,
      "blk": 2,
      "tov": 7,
      "fgm": 45,
      "fga": 81,
      "ftm": 32,
      "fta": 46
    },
    "signatureMoment": "Dominant 4-0 sweep of Atlanta, shooting 55.6% FG and 48.1% 3PT."
  },
  {
    "id": "series-11",
    "season": "2008-09",
    "year": 2009,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "ORL",
    "opponentName": "Orlando Magic",
    "result": "L",
    "seriesScore": "2\u20134",
    "gamesWon": 2,
    "gamesLost": 4,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 38.5,
    "rpg": 8.3,
    "apg": 8.0,
    "spg": 1.2,
    "bpg": 1.2,
    "fgPct": 0.487,
    "threePtPct": 0.297,
    "ftPct": 0.745,
    "boxScoreTotals": {
      "pts": 231,
      "reb": 50,
      "ast": 48,
      "stl": 7,
      "blk": 7,
      "tov": 25,
      "fgm": 75,
      "fga": 154,
      "ftm": 70,
      "fta": 94
    },
    "signatureMoment": "Hit legendary 1.0s buzzer-beating 3-pointer in Game 2; averaged 38.5 PPG for the series."
  },
  {
    "id": "series-12",
    "season": "2009-10",
    "year": 2010,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "CHI",
    "opponentName": "Chicago Bulls",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 31.8,
    "rpg": 9.2,
    "apg": 8.2,
    "spg": 1.2,
    "bpg": 2.4,
    "fgPct": 0.567,
    "threePtPct": 0.542,
    "ftPct": 0.72,
    "boxScoreTotals": {
      "pts": 159,
      "reb": 46,
      "ast": 41,
      "stl": 6,
      "blk": 12,
      "tov": 15,
      "fgm": 55,
      "fga": 97,
      "ftm": 36,
      "fta": 50
    },
    "signatureMoment": "Recorded 37-12-11 triple-double in Game 4 closeout push."
  },
  {
    "id": "series-13",
    "season": "2009-10",
    "year": 2010,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "result": "L",
    "seriesScore": "2\u20134",
    "gamesWon": 2,
    "gamesLost": 4,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 26.8,
    "rpg": 9.3,
    "apg": 7.2,
    "spg": 2.2,
    "bpg": 1.3,
    "fgPct": 0.447,
    "threePtPct": 0.269,
    "ftPct": 0.743,
    "boxScoreTotals": {
      "pts": 161,
      "reb": 56,
      "ast": 43,
      "stl": 13,
      "blk": 8,
      "tov": 27,
      "fgm": 51,
      "fga": 114,
      "ftm": 52,
      "fta": 70
    },
    "signatureMoment": "Postseason clash vs Boston Celtics (2-4)."
  },
  {
    "id": "series-14",
    "season": "2010-11",
    "year": 2011,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "PHI",
    "opponentName": "Philadelphia 76ers",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 24.2,
    "rpg": 10.6,
    "apg": 6.2,
    "spg": 0.8,
    "bpg": 0.8,
    "fgPct": 0.469,
    "threePtPct": 0.25,
    "ftPct": 0.82,
    "boxScoreTotals": {
      "pts": 121,
      "reb": 53,
      "ast": 31,
      "stl": 4,
      "blk": 4,
      "tov": 7,
      "fgm": 38,
      "fga": 81,
      "ftm": 41,
      "fta": 50
    },
    "signatureMoment": "Postseason clash vs Philadelphia 76ers (4-1)."
  },
  {
    "id": "series-15",
    "season": "2010-11",
    "year": 2011,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 28.0,
    "rpg": 8.2,
    "apg": 3.6,
    "spg": 1.8,
    "bpg": 1.8,
    "fgPct": 0.472,
    "threePtPct": 0.435,
    "ftPct": 0.667,
    "boxScoreTotals": {
      "pts": 140,
      "reb": 41,
      "ast": 18,
      "stl": 9,
      "blk": 9,
      "tov": 17,
      "fgm": 51,
      "fga": 108,
      "ftm": 28,
      "fta": 42
    },
    "signatureMoment": "First series win over the Celtics Big Three, scoring 10 straight in closing minutes of Game 5."
  },
  {
    "id": "series-16",
    "season": "2010-11",
    "year": 2011,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "CHI",
    "opponentName": "Chicago Bulls",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 25.8,
    "rpg": 7.8,
    "apg": 6.6,
    "spg": 2.4,
    "bpg": 1.8,
    "fgPct": 0.447,
    "threePtPct": 0.389,
    "ftPct": 0.864,
    "boxScoreTotals": {
      "pts": 129,
      "reb": 39,
      "ast": 33,
      "stl": 12,
      "blk": 9,
      "tov": 18,
      "fgm": 42,
      "fga": 94,
      "ftm": 38,
      "fta": 44
    },
    "signatureMoment": "Suffocating fourth-quarter defense on Derrick Rose to rally from 12 down in Game 5."
  },
  {
    "id": "series-17",
    "season": "2010-11",
    "year": 2011,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "DAL",
    "opponentName": "Dallas Mavericks",
    "result": "L",
    "seriesScore": "2\u20134",
    "gamesWon": 2,
    "gamesLost": 4,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 17.8,
    "rpg": 7.2,
    "apg": 6.8,
    "spg": 1.7,
    "bpg": 0.5,
    "fgPct": 0.478,
    "threePtPct": 0.321,
    "ftPct": 0.6,
    "boxScoreTotals": {
      "pts": 107,
      "reb": 43,
      "ast": 41,
      "stl": 10,
      "blk": 3,
      "tov": 24,
      "fgm": 43,
      "fga": 90,
      "ftm": 12,
      "fta": 20
    },
    "signatureMoment": "Postseason clash vs Dallas Mavericks (2-4)."
  },
  {
    "id": "series-18",
    "season": "2011-12",
    "year": 2012,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "NYK",
    "opponentName": "New York Knicks",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 27.8,
    "rpg": 6.2,
    "apg": 5.6,
    "spg": 2.2,
    "bpg": 0.2,
    "fgPct": 0.478,
    "threePtPct": 0.35,
    "ftPct": 0.807,
    "boxScoreTotals": {
      "pts": 139,
      "reb": 31,
      "ast": 28,
      "stl": 11,
      "blk": 1,
      "tov": 21,
      "fgm": 43,
      "fga": 90,
      "ftm": 46,
      "fta": 57
    },
    "signatureMoment": "Postseason clash vs New York Knicks (4-1)."
  },
  {
    "id": "series-19",
    "season": "2011-12",
    "year": 2012,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 30.0,
    "rpg": 10.8,
    "apg": 6.2,
    "spg": 2.7,
    "bpg": 0.7,
    "fgPct": 0.504,
    "threePtPct": 0.167,
    "ftPct": 0.725,
    "boxScoreTotals": {
      "pts": 180,
      "reb": 65,
      "ast": 37,
      "stl": 16,
      "blk": 4,
      "tov": 17,
      "fgm": 70,
      "fga": 139,
      "ftm": 37,
      "fta": 51
    },
    "signatureMoment": "Postseason clash vs Indiana Pacers (4-2)."
  },
  {
    "id": "series-20",
    "season": "2011-12",
    "year": 2012,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "result": "W",
    "seriesScore": "4\u20133",
    "gamesWon": 4,
    "gamesLost": 3,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 33.6,
    "rpg": 11.0,
    "apg": 3.9,
    "spg": 1.1,
    "bpg": 1.3,
    "fgPct": 0.527,
    "threePtPct": 0.29,
    "ftPct": 0.65,
    "boxScoreTotals": {
      "pts": 235,
      "reb": 77,
      "ast": 27,
      "stl": 8,
      "blk": 9,
      "tov": 24,
      "fgm": 87,
      "fga": 165,
      "ftm": 52,
      "fta": 80
    },
    "signatureMoment": "The Game 6 masterpiece in Boston: 45 points, 15 rebounds on 19-of-26 shooting facing elimination."
  },
  {
    "id": "series-21",
    "season": "2011-12",
    "year": 2012,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "OKC",
    "opponentName": "Oklahoma City Thunder",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 28.6,
    "rpg": 10.2,
    "apg": 7.4,
    "spg": 1.6,
    "bpg": 0.4,
    "fgPct": 0.472,
    "threePtPct": 0.188,
    "ftPct": 0.826,
    "boxScoreTotals": {
      "pts": 143,
      "reb": 51,
      "ast": 37,
      "stl": 8,
      "blk": 2,
      "tov": 19,
      "fgm": 51,
      "fga": 108,
      "ftm": 38,
      "fta": 46
    },
    "signatureMoment": "First NBA Championship: 26-11-13 triple-double in Game 5 to clinch Finals MVP."
  },
  {
    "id": "series-22",
    "season": "2012-13",
    "year": 2013,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "MIL",
    "opponentName": "Milwaukee Bucks",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 24.5,
    "rpg": 7.8,
    "apg": 6.8,
    "spg": 1.0,
    "bpg": 0.3,
    "fgPct": 0.627,
    "threePtPct": 0.273,
    "ftPct": 0.7,
    "boxScoreTotals": {
      "pts": 98,
      "reb": 31,
      "ast": 27,
      "stl": 4,
      "blk": 1,
      "tov": 19,
      "fgm": 37,
      "fga": 59,
      "ftm": 21,
      "fta": 30
    },
    "signatureMoment": "Postseason clash vs Milwaukee Bucks (4-0)."
  },
  {
    "id": "series-23",
    "season": "2012-13",
    "year": 2013,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "CHI",
    "opponentName": "Chicago Bulls",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 23.6,
    "rpg": 7.0,
    "apg": 7.8,
    "spg": 2.2,
    "bpg": 0.2,
    "fgPct": 0.438,
    "threePtPct": 0.353,
    "ftPct": 0.808,
    "boxScoreTotals": {
      "pts": 118,
      "reb": 35,
      "ast": 39,
      "stl": 11,
      "blk": 1,
      "tov": 13,
      "fgm": 35,
      "fga": 80,
      "ftm": 42,
      "fta": 52
    },
    "signatureMoment": "Postseason clash vs Chicago Bulls (4-1)."
  },
  {
    "id": "series-24",
    "season": "2012-13",
    "year": 2013,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "result": "W",
    "seriesScore": "4\u20133",
    "gamesWon": 4,
    "gamesLost": 3,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 29.0,
    "rpg": 7.3,
    "apg": 5.3,
    "spg": 1.4,
    "bpg": 1.4,
    "fgPct": 0.51,
    "threePtPct": 0.441,
    "ftPct": 0.778,
    "boxScoreTotals": {
      "pts": 203,
      "reb": 51,
      "ast": 37,
      "stl": 10,
      "blk": 10,
      "tov": 20,
      "fgm": 73,
      "fga": 143,
      "ftm": 42,
      "fta": 54
    },
    "signatureMoment": "Hit 2.2s driving left-handed layup buzzer-beater in overtime of Game 1."
  },
  {
    "id": "series-25",
    "season": "2012-13",
    "year": 2013,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "result": "W",
    "seriesScore": "4\u20133",
    "gamesWon": 4,
    "gamesLost": 3,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 25.3,
    "rpg": 10.9,
    "apg": 7.0,
    "spg": 2.3,
    "bpg": 0.9,
    "fgPct": 0.447,
    "threePtPct": 0.353,
    "ftPct": 0.795,
    "boxScoreTotals": {
      "pts": 177,
      "reb": 76,
      "ast": 49,
      "stl": 16,
      "blk": 6,
      "tov": 18,
      "fgm": 67,
      "fga": 150,
      "ftm": 31,
      "fta": 39
    },
    "signatureMoment": "Game 7 dagger: 37 points, 12 rebounds, and 19-foot pull-up with 27.9s left to repeat."
  },
  {
    "id": "series-26",
    "season": "2013-14",
    "year": 2014,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "CHA",
    "opponentName": "Charlotte Bobcats",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 30.0,
    "rpg": 8.0,
    "apg": 6.0,
    "spg": 2.3,
    "bpg": 0.3,
    "fgPct": 0.557,
    "threePtPct": 0.35,
    "ftPct": 0.795,
    "boxScoreTotals": {
      "pts": 120,
      "reb": 32,
      "ast": 24,
      "stl": 9,
      "blk": 1,
      "tov": 11,
      "fgm": 39,
      "fga": 70,
      "ftm": 35,
      "fta": 44
    },
    "signatureMoment": "Postseason clash vs Charlotte Bobcats (4-0)."
  },
  {
    "id": "series-27",
    "season": "2013-14",
    "year": 2014,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "BRK",
    "opponentName": "Brooklyn Nets",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 30.0,
    "rpg": 6.4,
    "apg": 3.6,
    "spg": 1.2,
    "bpg": 0.6,
    "fgPct": 0.57,
    "threePtPct": 0.381,
    "ftPct": 0.815,
    "boxScoreTotals": {
      "pts": 150,
      "reb": 32,
      "ast": 18,
      "stl": 6,
      "blk": 3,
      "tov": 11,
      "fgm": 49,
      "fga": 86,
      "ftm": 44,
      "fta": 54
    },
    "signatureMoment": "Tied playoff career high with 49 points in Game 4 in Brooklyn."
  },
  {
    "id": "series-28",
    "season": "2013-14",
    "year": 2014,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 22.8,
    "rpg": 6.3,
    "apg": 5.5,
    "spg": 1.8,
    "bpg": 0.8,
    "fgPct": 0.559,
    "threePtPct": 0.333,
    "ftPct": 0.818,
    "boxScoreTotals": {
      "pts": 137,
      "reb": 38,
      "ast": 33,
      "stl": 11,
      "blk": 5,
      "tov": 20,
      "fgm": 52,
      "fga": 93,
      "ftm": 27,
      "fta": 33
    },
    "signatureMoment": "Postseason clash vs Indiana Pacers (4-2)."
  },
  {
    "id": "series-29",
    "season": "2013-14",
    "year": 2014,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "MIA",
    "teamName": "Miami Heat",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "result": "L",
    "seriesScore": "1\u20134",
    "gamesWon": 1,
    "gamesLost": 4,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 28.2,
    "rpg": 7.8,
    "apg": 4.0,
    "spg": 2.0,
    "bpg": 0.4,
    "fgPct": 0.571,
    "threePtPct": 0.519,
    "ftPct": 0.793,
    "boxScoreTotals": {
      "pts": 141,
      "reb": 39,
      "ast": 20,
      "stl": 10,
      "blk": 2,
      "tov": 19,
      "fgm": 52,
      "fga": 91,
      "ftm": 23,
      "fta": 29
    },
    "signatureMoment": "Postseason clash vs San Antonio Spurs (1-4)."
  },
  {
    "id": "series-30",
    "season": "2014-15",
    "year": 2015,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 27.0,
    "rpg": 9.0,
    "apg": 6.5,
    "spg": 2.3,
    "bpg": 1.5,
    "fgPct": 0.467,
    "threePtPct": 0.2,
    "ftPct": 0.741,
    "boxScoreTotals": {
      "pts": 108,
      "reb": 36,
      "ast": 26,
      "stl": 9,
      "blk": 6,
      "tov": 19,
      "fgm": 42,
      "fga": 90,
      "ftm": 20,
      "fta": 27
    },
    "signatureMoment": "Postseason clash vs Boston Celtics (4-0)."
  },
  {
    "id": "series-31",
    "season": "2014-15",
    "year": 2015,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "CHI",
    "opponentName": "Chicago Bulls",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 26.2,
    "rpg": 11.0,
    "apg": 8.8,
    "spg": 1.7,
    "bpg": 1.7,
    "fgPct": 0.399,
    "threePtPct": 0.107,
    "ftPct": 0.8,
    "boxScoreTotals": {
      "pts": 157,
      "reb": 66,
      "ast": 53,
      "stl": 10,
      "blk": 10,
      "tov": 27,
      "fgm": 61,
      "fga": 153,
      "ftm": 32,
      "fta": 40
    },
    "signatureMoment": "Hit 1.5s buzzer-beating baseline corner jumper over Jimmy Butler in Game 4 after scratching coach's play."
  },
  {
    "id": "series-32",
    "season": "2014-15",
    "year": 2015,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "ATL",
    "opponentName": "Atlanta Hawks",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 30.3,
    "rpg": 11.0,
    "apg": 9.3,
    "spg": 1.5,
    "bpg": 0.5,
    "fgPct": 0.438,
    "threePtPct": 0.25,
    "ftPct": 0.727,
    "boxScoreTotals": {
      "pts": 121,
      "reb": 44,
      "ast": 37,
      "stl": 6,
      "blk": 2,
      "tov": 15,
      "fgm": 46,
      "fga": 105,
      "ftm": 24,
      "fta": 33
    },
    "signatureMoment": "Swept 60-win Hawks while averaging near triple-double (30.3 PPG, 11.0 RPG, 9.3 APG)."
  },
  {
    "id": "series-33",
    "season": "2014-15",
    "year": 2015,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "result": "L",
    "seriesScore": "2\u20134",
    "gamesWon": 2,
    "gamesLost": 4,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 35.8,
    "rpg": 13.3,
    "apg": 8.8,
    "spg": 1.3,
    "bpg": 0.5,
    "fgPct": 0.398,
    "threePtPct": 0.31,
    "ftPct": 0.687,
    "boxScoreTotals": {
      "pts": 215,
      "reb": 80,
      "ast": 53,
      "stl": 8,
      "blk": 3,
      "tov": 21,
      "fgm": 78,
      "fga": 196,
      "ftm": 46,
      "fta": 67
    },
    "signatureMoment": "Historic solo carrying job: averaged 35.8 PPG, 13.3 RPG, 8.8 APG without Irving and Love."
  },
  {
    "id": "series-34",
    "season": "2015-16",
    "year": 2016,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "DET",
    "opponentName": "Detroit Pistons",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 22.8,
    "rpg": 9.0,
    "apg": 6.8,
    "spg": 1.8,
    "bpg": 0.8,
    "fgPct": 0.487,
    "threePtPct": 0.211,
    "ftPct": 0.733,
    "boxScoreTotals": {
      "pts": 91,
      "reb": 36,
      "ast": 27,
      "stl": 7,
      "blk": 3,
      "tov": 13,
      "fgm": 38,
      "fga": 78,
      "ftm": 11,
      "fta": 15
    },
    "signatureMoment": "Postseason clash vs Detroit Pistons (4-0)."
  },
  {
    "id": "series-35",
    "season": "2015-16",
    "year": 2016,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "ATL",
    "opponentName": "Atlanta Hawks",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 24.3,
    "rpg": 8.5,
    "apg": 7.8,
    "spg": 3.0,
    "bpg": 0.5,
    "fgPct": 0.507,
    "threePtPct": 0.421,
    "ftPct": 0.591,
    "boxScoreTotals": {
      "pts": 97,
      "reb": 34,
      "ast": 31,
      "stl": 12,
      "blk": 2,
      "tov": 17,
      "fgm": 38,
      "fga": 75,
      "ftm": 13,
      "fta": 22
    },
    "signatureMoment": "Postseason clash vs Atlanta Hawks (4-0)."
  },
  {
    "id": "series-36",
    "season": "2015-16",
    "year": 2016,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "TOR",
    "opponentName": "Toronto Raptors",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 26.0,
    "rpg": 8.5,
    "apg": 6.7,
    "spg": 2.0,
    "bpg": 1.0,
    "fgPct": 0.622,
    "threePtPct": 0.333,
    "ftPct": 0.614,
    "boxScoreTotals": {
      "pts": 156,
      "reb": 51,
      "ast": 40,
      "stl": 12,
      "blk": 6,
      "tov": 14,
      "fgm": 61,
      "fga": 98,
      "ftm": 27,
      "fta": 44
    },
    "signatureMoment": "Back-to-back 23-11-11 triple-doubles and series-clinching 33 points in Game 6 in Toronto."
  },
  {
    "id": "series-37",
    "season": "2015-16",
    "year": 2016,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "result": "W",
    "seriesScore": "4\u20133",
    "gamesWon": 4,
    "gamesLost": 3,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 29.7,
    "rpg": 11.3,
    "apg": 8.9,
    "spg": 2.6,
    "bpg": 2.3,
    "fgPct": 0.494,
    "threePtPct": 0.371,
    "ftPct": 0.721,
    "boxScoreTotals": {
      "pts": 208,
      "reb": 79,
      "ast": 62,
      "stl": 18,
      "blk": 16,
      "tov": 31,
      "fgm": 82,
      "fga": 166,
      "ftm": 31,
      "fta": 43
    },
    "signatureMoment": "The Miracle Comeback: First team to overcome 3-1 deficit in Finals; Game 7 triple-double and 'The Block'."
  },
  {
    "id": "series-38",
    "season": "2016-17",
    "year": 2017,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 32.8,
    "rpg": 9.8,
    "apg": 9.0,
    "spg": 3.0,
    "bpg": 2.0,
    "fgPct": 0.543,
    "threePtPct": 0.45,
    "ftPct": 0.579,
    "boxScoreTotals": {
      "pts": 131,
      "reb": 39,
      "ast": 36,
      "stl": 12,
      "blk": 8,
      "tov": 18,
      "fgm": 50,
      "fga": 92,
      "ftm": 22,
      "fta": 38
    },
    "signatureMoment": "Historic 25-point halftime deficit comeback in Game 3 with 41-13-12 triple-double."
  },
  {
    "id": "series-39",
    "season": "2016-17",
    "year": 2017,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "TOR",
    "opponentName": "Toronto Raptors",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 36.0,
    "rpg": 8.3,
    "apg": 5.3,
    "spg": 1.3,
    "bpg": 1.0,
    "fgPct": 0.573,
    "threePtPct": 0.481,
    "ftPct": 0.833,
    "boxScoreTotals": {
      "pts": 144,
      "reb": 33,
      "ast": 21,
      "stl": 5,
      "blk": 4,
      "tov": 17,
      "fgm": 43,
      "fga": 75,
      "ftm": 45,
      "fta": 54
    },
    "signatureMoment": "Averaged 36.0 PPG on 57.3% FG in 4-0 sweep of Toronto."
  },
  {
    "id": "series-40",
    "season": "2016-17",
    "year": 2017,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 29.6,
    "rpg": 6.4,
    "apg": 6.8,
    "spg": 2.2,
    "bpg": 1.2,
    "fgPct": 0.58,
    "threePtPct": 0.345,
    "ftPct": 0.667,
    "boxScoreTotals": {
      "pts": 148,
      "reb": 32,
      "ast": 34,
      "stl": 11,
      "blk": 6,
      "tov": 16,
      "fgm": 58,
      "fga": 100,
      "ftm": 22,
      "fta": 33
    },
    "signatureMoment": "Passed Michael Jordan for all-time playoff scoring lead with third-quarter 3-pointer in Game 5."
  },
  {
    "id": "series-41",
    "season": "2016-17",
    "year": 2017,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "result": "L",
    "seriesScore": "1\u20134",
    "gamesWon": 1,
    "gamesLost": 4,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 33.6,
    "rpg": 12.0,
    "apg": 10.0,
    "spg": 1.4,
    "bpg": 1.0,
    "fgPct": 0.564,
    "threePtPct": 0.387,
    "ftPct": 0.649,
    "boxScoreTotals": {
      "pts": 168,
      "reb": 60,
      "ast": 50,
      "stl": 7,
      "blk": 5,
      "tov": 21,
      "fgm": 66,
      "fga": 117,
      "ftm": 24,
      "fta": 37
    },
    "signatureMoment": "First player in NBA history to average a triple-double in the NBA Finals (33.6 PPG, 12.0 RPG, 10.0 APG)."
  },
  {
    "id": "series-42",
    "season": "2017-18",
    "year": 2018,
    "roundCode": "EC1",
    "roundCategory": "First Round",
    "roundName": "Eastern Conference First Round",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "result": "W",
    "seriesScore": "4\u20133",
    "gamesWon": 4,
    "gamesLost": 3,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 34.4,
    "rpg": 10.0,
    "apg": 7.7,
    "spg": 1.4,
    "bpg": 1.0,
    "fgPct": 0.553,
    "threePtPct": 0.353,
    "ftPct": 0.818,
    "boxScoreTotals": {
      "pts": 241,
      "reb": 70,
      "ast": 54,
      "stl": 10,
      "blk": 7,
      "tov": 26,
      "fgm": 83,
      "fga": 150,
      "ftm": 63,
      "fta": 77
    },
    "signatureMoment": "Buzzer-beater 3PT after Oladipo block in Game 5; dropped 45 in Game 7 to advance."
  },
  {
    "id": "series-43",
    "season": "2017-18",
    "year": 2018,
    "roundCode": "ECS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Eastern Conference Semifinals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "TOR",
    "opponentName": "Toronto Raptors",
    "result": "W",
    "seriesScore": "4\u20130",
    "gamesWon": 4,
    "gamesLost": 0,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "won",
    "ppg": 34.0,
    "rpg": 8.3,
    "apg": 11.3,
    "spg": 1.8,
    "bpg": 1.0,
    "fgPct": 0.553,
    "threePtPct": 0.167,
    "ftPct": 0.576,
    "boxScoreTotals": {
      "pts": 136,
      "reb": 33,
      "ast": 45,
      "stl": 7,
      "blk": 4,
      "tov": 8,
      "fgm": 57,
      "fga": 103,
      "ftm": 19,
      "fta": 33
    },
    "signatureMoment": "The 'LeBronto' series: 8.0s running bank-shot buzzer-beater in Game 3 to seal sweep."
  },
  {
    "id": "series-44",
    "season": "2017-18",
    "year": 2018,
    "roundCode": "ECF",
    "roundCategory": "Conf Finals",
    "roundName": "Eastern Conference Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "result": "W",
    "seriesScore": "4\u20133",
    "gamesWon": 4,
    "gamesLost": 3,
    "totalGames": 7,
    "isSweep": false,
    "sweepType": null,
    "ppg": 33.6,
    "rpg": 9.0,
    "apg": 8.4,
    "spg": 1.1,
    "bpg": 1.1,
    "fgPct": 0.524,
    "threePtPct": 0.409,
    "ftPct": 0.692,
    "boxScoreTotals": {
      "pts": 235,
      "reb": 63,
      "ast": 59,
      "stl": 8,
      "blk": 8,
      "tov": 40,
      "fgm": 86,
      "fga": 164,
      "ftm": 45,
      "fta": 65
    },
    "signatureMoment": "Played all 48 minutes in Game 7 in Boston, scoring 35 points with 15 rebounds to reach 8th straight Finals."
  },
  {
    "id": "series-45",
    "season": "2017-18",
    "year": 2018,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "CLE",
    "teamName": "Cleveland Cavaliers",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "result": "L",
    "seriesScore": "0\u20134",
    "gamesWon": 0,
    "gamesLost": 4,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "lost",
    "ppg": 34.0,
    "rpg": 8.5,
    "apg": 10.0,
    "spg": 1.3,
    "bpg": 1.0,
    "fgPct": 0.527,
    "threePtPct": 0.333,
    "ftPct": 0.842,
    "boxScoreTotals": {
      "pts": 136,
      "reb": 34,
      "ast": 40,
      "stl": 5,
      "blk": 4,
      "tov": 20,
      "fgm": 49,
      "fga": 93,
      "ftm": 32,
      "fta": 38
    },
    "signatureMoment": "Mythical 51-point, 8-rebound, 8-assist performance in Game 1 at Oracle Arena."
  },
  {
    "id": "series-46",
    "season": "2019-20",
    "year": 2020,
    "roundCode": "WC1",
    "roundCategory": "First Round",
    "roundName": "Western Conference First Round",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "POR",
    "opponentName": "Portland Trail Blazers",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 27.4,
    "rpg": 10.2,
    "apg": 10.2,
    "spg": 1.2,
    "bpg": 0.4,
    "fgPct": 0.6,
    "threePtPct": 0.464,
    "ftPct": 0.737,
    "boxScoreTotals": {
      "pts": 137,
      "reb": 51,
      "ast": 51,
      "stl": 6,
      "blk": 2,
      "tov": 25,
      "fgm": 48,
      "fga": 80,
      "ftm": 28,
      "fta": 38
    },
    "signatureMoment": "Became first player with 23-17-16 stat line in playoff history (Game 1 vs Portland)."
  },
  {
    "id": "series-47",
    "season": "2019-20",
    "year": 2020,
    "roundCode": "WCS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Western Conference Semifinals",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "HOU",
    "opponentName": "Houston Rockets",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 25.8,
    "rpg": 10.4,
    "apg": 7.4,
    "spg": 2.0,
    "bpg": 1.8,
    "fgPct": 0.511,
    "threePtPct": 0.294,
    "ftPct": 0.711,
    "boxScoreTotals": {
      "pts": 129,
      "reb": 52,
      "ast": 37,
      "stl": 10,
      "blk": 9,
      "tov": 21,
      "fgm": 46,
      "fga": 90,
      "ftm": 27,
      "fta": 38
    },
    "signatureMoment": "Postseason clash vs Houston Rockets (4-1)."
  },
  {
    "id": "series-48",
    "season": "2019-20",
    "year": 2020,
    "roundCode": "WCF",
    "roundCategory": "Conf Finals",
    "roundName": "Western Conference Finals",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "DEN",
    "opponentName": "Denver Nuggets",
    "result": "W",
    "seriesScore": "4\u20131",
    "gamesWon": 4,
    "gamesLost": 1,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 27.0,
    "rpg": 10.4,
    "apg": 9.0,
    "spg": 0.6,
    "bpg": 0.8,
    "fgPct": 0.536,
    "threePtPct": 0.286,
    "ftPct": 0.781,
    "boxScoreTotals": {
      "pts": 135,
      "reb": 52,
      "ast": 45,
      "stl": 3,
      "blk": 4,
      "tov": 17,
      "fgm": 52,
      "fga": 97,
      "ftm": 25,
      "fta": 32
    },
    "signatureMoment": "38-16-10 triple-double in Game 5 closeout over Denver, scoring 16 in fourth quarter."
  },
  {
    "id": "series-49",
    "season": "2019-20",
    "year": 2020,
    "roundCode": "FIN",
    "roundCategory": "NBA Finals",
    "roundName": "NBA Finals",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "MIA",
    "opponentName": "Miami Heat",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 29.8,
    "rpg": 11.8,
    "apg": 8.5,
    "spg": 1.2,
    "bpg": 0.5,
    "fgPct": 0.591,
    "threePtPct": 0.417,
    "ftPct": 0.667,
    "boxScoreTotals": {
      "pts": 179,
      "reb": 71,
      "ast": 51,
      "stl": 7,
      "blk": 3,
      "tov": 21,
      "fgm": 68,
      "fga": 115,
      "ftm": 28,
      "fta": 42
    },
    "signatureMoment": "Fourth NBA title and fourth Finals MVP: 28-14-10 triple-double in Game 6 in Orlando Bubble."
  },
  {
    "id": "series-50",
    "season": "2020-21",
    "year": 2021,
    "roundCode": "WC1",
    "roundCategory": "First Round",
    "roundName": "Western Conference First Round",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "PHO",
    "opponentName": "Phoenix Suns",
    "result": "L",
    "seriesScore": "2\u20134",
    "gamesWon": 2,
    "gamesLost": 4,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 23.3,
    "rpg": 7.2,
    "apg": 8.0,
    "spg": 1.5,
    "bpg": 0.3,
    "fgPct": 0.474,
    "threePtPct": 0.375,
    "ftPct": 0.609,
    "boxScoreTotals": {
      "pts": 140,
      "reb": 43,
      "ast": 48,
      "stl": 9,
      "blk": 2,
      "tov": 25,
      "fgm": 54,
      "fga": 114,
      "ftm": 14,
      "fta": 23
    },
    "signatureMoment": "Postseason clash vs Phoenix Suns (2-4)."
  },
  {
    "id": "series-51",
    "season": "2022-23",
    "year": 2023,
    "roundCode": "WC1",
    "roundCategory": "First Round",
    "roundName": "Western Conference First Round",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "MEM",
    "opponentName": "Memphis Grizzlies",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 22.2,
    "rpg": 11.2,
    "apg": 5.2,
    "spg": 1.0,
    "bpg": 1.3,
    "fgPct": 0.486,
    "threePtPct": 0.195,
    "ftPct": 0.677,
    "boxScoreTotals": {
      "pts": 133,
      "reb": 67,
      "ast": 31,
      "stl": 6,
      "blk": 8,
      "tov": 18,
      "fgm": 52,
      "fga": 107,
      "ftm": 21,
      "fta": 31
    },
    "signatureMoment": "First 20-point, 20-rebound playoff performance (22 pts, 20 reb) in Game 4 overtime win vs Memphis."
  },
  {
    "id": "series-52",
    "season": "2022-23",
    "year": 2023,
    "roundCode": "WCS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Western Conference Semifinals",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 24.7,
    "rpg": 8.8,
    "apg": 5.5,
    "spg": 0.8,
    "bpg": 1.2,
    "fgPct": 0.495,
    "threePtPct": 0.333,
    "ftPct": 0.844,
    "boxScoreTotals": {
      "pts": 148,
      "reb": 53,
      "ast": 33,
      "stl": 5,
      "blk": 7,
      "tov": 13,
      "fgm": 54,
      "fga": 109,
      "ftm": 27,
      "fta": 32
    },
    "signatureMoment": "Dethroned reigning champion Warriors with 30-9-9 closeout in Game 6."
  },
  {
    "id": "series-53",
    "season": "2022-23",
    "year": 2023,
    "roundCode": "WCF",
    "roundCategory": "Conf Finals",
    "roundName": "Western Conference Finals",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "DEN",
    "opponentName": "Denver Nuggets",
    "result": "L",
    "seriesScore": "0\u20134",
    "gamesWon": 0,
    "gamesLost": 4,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "lost",
    "ppg": 27.8,
    "rpg": 9.5,
    "apg": 10.0,
    "spg": 1.5,
    "bpg": 0.8,
    "fgPct": 0.519,
    "threePtPct": 0.269,
    "ftPct": 0.759,
    "boxScoreTotals": {
      "pts": 111,
      "reb": 38,
      "ast": 40,
      "stl": 6,
      "blk": 3,
      "tov": 9,
      "fgm": 41,
      "fga": 79,
      "ftm": 22,
      "fta": 29
    },
    "signatureMoment": "Scored 40 points, 10 rebounds, 9 assists playing all 48 minutes in Game 4."
  },
  {
    "id": "series-54",
    "season": "2023-24",
    "year": 2024,
    "roundCode": "WC1",
    "roundCategory": "First Round",
    "roundName": "Western Conference First Round",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "DEN",
    "opponentName": "Denver Nuggets",
    "result": "L",
    "seriesScore": "1\u20134",
    "gamesWon": 1,
    "gamesLost": 4,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 27.8,
    "rpg": 6.8,
    "apg": 8.8,
    "spg": 2.4,
    "bpg": 1.0,
    "fgPct": 0.566,
    "threePtPct": 0.385,
    "ftPct": 0.739,
    "boxScoreTotals": {
      "pts": 139,
      "reb": 34,
      "ast": 44,
      "stl": 12,
      "blk": 5,
      "tov": 19,
      "fgm": 56,
      "fga": 99,
      "ftm": 17,
      "fta": 23
    },
    "signatureMoment": "Averaged 27.8 PPG on 56.6% FG with 8.8 APG in Year 21 against defending champions."
  },
  {
    "id": "series-55",
    "season": "2024-25",
    "year": 2025,
    "roundCode": "WC1",
    "roundCategory": "First Round",
    "roundName": "Western Conference First Round",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "MIN",
    "opponentName": "Minnesota Timberwolves",
    "result": "L",
    "seriesScore": "1\u20134",
    "gamesWon": 1,
    "gamesLost": 4,
    "totalGames": 5,
    "isSweep": false,
    "sweepType": null,
    "ppg": 25.4,
    "rpg": 9.0,
    "apg": 5.6,
    "spg": 2.0,
    "bpg": 1.8,
    "fgPct": 0.489,
    "threePtPct": 0.357,
    "ftPct": 0.775,
    "boxScoreTotals": {
      "pts": 127,
      "reb": 45,
      "ast": 28,
      "stl": 10,
      "blk": 9,
      "tov": 13,
      "fgm": 43,
      "fga": 88,
      "ftm": 31,
      "fta": 40
    },
    "signatureMoment": "Pushed younger Minnesota core with 25.4 PPG and 9.0 RPG."
  },
  {
    "id": "series-56",
    "season": "2025-26",
    "year": 2026,
    "roundCode": "WC1",
    "roundCategory": "First Round",
    "roundName": "Western Conference First Round",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "HOU",
    "opponentName": "Houston Rockets",
    "result": "W",
    "seriesScore": "4\u20132",
    "gamesWon": 4,
    "gamesLost": 2,
    "totalGames": 6,
    "isSweep": false,
    "sweepType": null,
    "ppg": 23.2,
    "rpg": 7.2,
    "apg": 8.3,
    "spg": 1.3,
    "bpg": 0.3,
    "fgPct": 0.432,
    "threePtPct": 0.3,
    "ftPct": 0.739,
    "boxScoreTotals": {
      "pts": 139,
      "reb": 43,
      "ast": 50,
      "stl": 8,
      "blk": 2,
      "tov": 26,
      "fgm": 48,
      "fga": 111,
      "ftm": 34,
      "fta": 46
    },
    "signatureMoment": "Led Lakers to 4-2 first-round series win over Houston in historic 23rd season."
  },
  {
    "id": "series-57",
    "season": "2025-26",
    "year": 2026,
    "roundCode": "WCS",
    "roundCategory": "Conf Semifinals",
    "roundName": "Western Conference Semifinals",
    "team": "LAL",
    "teamName": "Los Angeles Lakers",
    "opponent": "OKC",
    "opponentName": "Oklahoma City Thunder",
    "result": "L",
    "seriesScore": "0\u20134",
    "gamesWon": 0,
    "gamesLost": 4,
    "totalGames": 4,
    "isSweep": true,
    "sweepType": "lost",
    "ppg": 23.3,
    "rpg": 6.0,
    "apg": 5.8,
    "spg": 1.3,
    "bpg": 0.3,
    "fgPct": 0.5,
    "threePtPct": 0.364,
    "ftPct": 0.765,
    "boxScoreTotals": {
      "pts": 93,
      "reb": 24,
      "ast": 23,
      "stl": 5,
      "blk": 1,
      "tov": 12,
      "fgm": 36,
      "fga": 72,
      "ftm": 13,
      "fta": 17
    },
    "signatureMoment": "Faced top-seeded Oklahoma City Thunder in 57th career postseason series."
  }
] as const;

export const FRANCHISE_BREAKDOWN: readonly FranchisePostseasonRecord[] = [
  {
    "abbr": "BOS",
    "name": "Boston Celtics",
    "seriesPlayed": 7,
    "seriesWon": 5,
    "seriesLost": 2,
    "gamesWon": 25,
    "gamesLost": 16,
    "years": [
      2008,
      2010,
      2011,
      2012,
      2015,
      2017,
      2018
    ],
    "sweepsWon": 1,
    "sweepsLost": 0,
    "seriesList": [
      "series-8",
      "series-13",
      "series-15",
      "series-20",
      "series-30",
      "series-40",
      "series-44"
    ]
  },
  {
    "abbr": "IND",
    "name": "Indiana Pacers",
    "seriesPlayed": 5,
    "seriesWon": 5,
    "seriesLost": 0,
    "gamesWon": 20,
    "gamesLost": 10,
    "years": [
      2012,
      2013,
      2014,
      2017,
      2018
    ],
    "sweepsWon": 1,
    "sweepsLost": 0,
    "seriesList": [
      "series-19",
      "series-24",
      "series-28",
      "series-38",
      "series-42"
    ]
  },
  {
    "abbr": "GSW",
    "name": "Golden State Warriors",
    "seriesPlayed": 5,
    "seriesWon": 2,
    "seriesLost": 3,
    "gamesWon": 11,
    "gamesLost": 17,
    "years": [
      2015,
      2016,
      2017,
      2018,
      2023
    ],
    "sweepsWon": 0,
    "sweepsLost": 1,
    "seriesList": [
      "series-33",
      "series-37",
      "series-41",
      "series-45",
      "series-52"
    ]
  },
  {
    "abbr": "CHI",
    "name": "Chicago Bulls",
    "seriesPlayed": 4,
    "seriesWon": 4,
    "seriesLost": 0,
    "gamesWon": 16,
    "gamesLost": 5,
    "years": [
      2010,
      2011,
      2013,
      2015
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-12",
      "series-16",
      "series-23",
      "series-31"
    ]
  },
  {
    "abbr": "DET",
    "name": "Detroit Pistons",
    "seriesPlayed": 4,
    "seriesWon": 3,
    "seriesLost": 1,
    "gamesWon": 15,
    "gamesLost": 6,
    "years": [
      2006,
      2007,
      2009,
      2016
    ],
    "sweepsWon": 2,
    "sweepsLost": 0,
    "seriesList": [
      "series-2",
      "series-5",
      "series-9",
      "series-34"
    ]
  },
  {
    "abbr": "WAS",
    "name": "Washington Wizards",
    "seriesPlayed": 3,
    "seriesWon": 3,
    "seriesLost": 0,
    "gamesWon": 12,
    "gamesLost": 4,
    "years": [
      2006,
      2007,
      2008
    ],
    "sweepsWon": 1,
    "sweepsLost": 0,
    "seriesList": [
      "series-1",
      "series-3",
      "series-7"
    ]
  },
  {
    "abbr": "ATL",
    "name": "Atlanta Hawks",
    "seriesPlayed": 3,
    "seriesWon": 3,
    "seriesLost": 0,
    "gamesWon": 12,
    "gamesLost": 0,
    "years": [
      2009,
      2015,
      2016
    ],
    "sweepsWon": 3,
    "sweepsLost": 0,
    "seriesList": [
      "series-10",
      "series-32",
      "series-35"
    ]
  },
  {
    "abbr": "TOR",
    "name": "Toronto Raptors",
    "seriesPlayed": 3,
    "seriesWon": 3,
    "seriesLost": 0,
    "gamesWon": 12,
    "gamesLost": 2,
    "years": [
      2016,
      2017,
      2018
    ],
    "sweepsWon": 2,
    "sweepsLost": 0,
    "seriesList": [
      "series-36",
      "series-39",
      "series-43"
    ]
  },
  {
    "abbr": "SAS",
    "name": "San Antonio Spurs",
    "seriesPlayed": 3,
    "seriesWon": 1,
    "seriesLost": 2,
    "gamesWon": 5,
    "gamesLost": 11,
    "years": [
      2007,
      2013,
      2014
    ],
    "sweepsWon": 0,
    "sweepsLost": 1,
    "seriesList": [
      "series-6",
      "series-25",
      "series-29"
    ]
  },
  {
    "abbr": "DEN",
    "name": "Denver Nuggets",
    "seriesPlayed": 3,
    "seriesWon": 1,
    "seriesLost": 2,
    "gamesWon": 5,
    "gamesLost": 9,
    "years": [
      2020,
      2023,
      2024
    ],
    "sweepsWon": 0,
    "sweepsLost": 1,
    "seriesList": [
      "series-48",
      "series-53",
      "series-54"
    ]
  },
  {
    "abbr": "HOU",
    "name": "Houston Rockets",
    "seriesPlayed": 2,
    "seriesWon": 2,
    "seriesLost": 0,
    "gamesWon": 8,
    "gamesLost": 3,
    "years": [
      2020,
      2026
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-47",
      "series-56"
    ]
  },
  {
    "abbr": "OKC",
    "name": "Oklahoma City Thunder",
    "seriesPlayed": 2,
    "seriesWon": 1,
    "seriesLost": 1,
    "gamesWon": 4,
    "gamesLost": 5,
    "years": [
      2012,
      2026
    ],
    "sweepsWon": 0,
    "sweepsLost": 1,
    "seriesList": [
      "series-21",
      "series-57"
    ]
  },
  {
    "abbr": "NJN",
    "name": "New Jersey Nets",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 2,
    "years": [
      2007
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-4"
    ]
  },
  {
    "abbr": "PHI",
    "name": "Philadelphia 76ers",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 1,
    "years": [
      2011
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-14"
    ]
  },
  {
    "abbr": "NYK",
    "name": "New York Knicks",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 1,
    "years": [
      2012
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-18"
    ]
  },
  {
    "abbr": "MIL",
    "name": "Milwaukee Bucks",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 0,
    "years": [
      2013
    ],
    "sweepsWon": 1,
    "sweepsLost": 0,
    "seriesList": [
      "series-22"
    ]
  },
  {
    "abbr": "CHA",
    "name": "Charlotte Bobcats",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 0,
    "years": [
      2014
    ],
    "sweepsWon": 1,
    "sweepsLost": 0,
    "seriesList": [
      "series-26"
    ]
  },
  {
    "abbr": "BRK",
    "name": "Brooklyn Nets",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 1,
    "years": [
      2014
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-27"
    ]
  },
  {
    "abbr": "POR",
    "name": "Portland Trail Blazers",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 1,
    "years": [
      2020
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-46"
    ]
  },
  {
    "abbr": "MIA",
    "name": "Miami Heat",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 2,
    "years": [
      2020
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-49"
    ]
  },
  {
    "abbr": "MEM",
    "name": "Memphis Grizzlies",
    "seriesPlayed": 1,
    "seriesWon": 1,
    "seriesLost": 0,
    "gamesWon": 4,
    "gamesLost": 2,
    "years": [
      2023
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-51"
    ]
  },
  {
    "abbr": "ORL",
    "name": "Orlando Magic",
    "seriesPlayed": 1,
    "seriesWon": 0,
    "seriesLost": 1,
    "gamesWon": 2,
    "gamesLost": 4,
    "years": [
      2009
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-11"
    ]
  },
  {
    "abbr": "DAL",
    "name": "Dallas Mavericks",
    "seriesPlayed": 1,
    "seriesWon": 0,
    "seriesLost": 1,
    "gamesWon": 2,
    "gamesLost": 4,
    "years": [
      2011
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-17"
    ]
  },
  {
    "abbr": "PHO",
    "name": "Phoenix Suns",
    "seriesPlayed": 1,
    "seriesWon": 0,
    "seriesLost": 1,
    "gamesWon": 2,
    "gamesLost": 4,
    "years": [
      2021
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-50"
    ]
  },
  {
    "abbr": "MIN",
    "name": "Minnesota Timberwolves",
    "seriesPlayed": 1,
    "seriesWon": 0,
    "seriesLost": 1,
    "gamesWon": 1,
    "gamesLost": 4,
    "years": [
      2025
    ],
    "sweepsWon": 0,
    "sweepsLost": 0,
    "seriesList": [
      "series-55"
    ]
  }
] as const;

export const CLUTCH_BUZZER_BEATERS: readonly ClutchBuzzerBeater[] = [
  {
    "id": "clutch-2009-magic",
    "date": "May 22, 2009",
    "isoDate": "2009-05-22",
    "season": "2008-09",
    "year": 2009,
    "round": "Eastern Conference Finals",
    "roundShort": "ECF",
    "game": "Game 2",
    "team": "CLE",
    "opponent": "ORL",
    "opponentName": "Orlando Magic",
    "venue": "Quicken Loans Arena, Cleveland, OH",
    "scoreBefore": "ORL 95 \u2013 CLE 93",
    "scoreAfter": "ORL 95 \u2013 CLE 96",
    "result": "W (96\u201395)",
    "clockRemaining": "1.0s",
    "shotDistance": "25 ft",
    "shotType": "Catch-and-shoot 3-pointer",
    "courtZone": "Top of the Key",
    "inbounder": "Mo Williams",
    "primaryDefender": "Hedo Turkoglu",
    "screener": "Sasha Pavlovic / Zydrunas Ilgauskas",
    "seriesSituationBefore": "CLE trailed 0\u20131 (lost Game 1 at home 106\u2013107)",
    "seriesImpact": "Tied series 1\u20131; prevented 0\u20132 hole heading to Orlando; iconic shot of his early career.",
    "broadcastCall": {
      "caller": "Marv Albert",
      "network": "TNT",
      "quote": "Williams into James... for three... YES! IT GOES IN AT THE BUZZER! LEBRON JAMES DELIVERS AT THE BUZZER!"
    },
    "description": "After Hedo Turkoglu sank a go-ahead jumper with 1.0 second on the clock, Cleveland faced an 0-2 deficit heading to Orlando. Out of a timeout, Mo Williams delivered a pinpoint inbounds pass to LeBron, who curled around double screens to the top of the key, caught cleanly, squared in mid-air, and drilled a 25-foot three-pointer over Turkoglu as the red horn sounded.",
    "keyframes": [
      {
        "time": 0.0,
        "annotation": "Timeout ends. Mo Williams sets up at the sideline hash. LeBron starts at the right elbow, flanked by Turkoglu.",
        "lebron": {
          "x": 62,
          "y": 74
        },
        "defender": {
          "x": 64,
          "y": 76
        },
        "inbounder": {
          "x": 4,
          "y": 64
        },
        "ball": {
          "x": 4,
          "y": 64
        },
        "telemetry": {
          "clock": "1.0s",
          "speed": "0.0 mph",
          "distance": "25 ft",
          "action": "Pre-snap setup"
        }
      },
      {
        "time": 0.3,
        "annotation": "LeBron cuts hard across the lane toward the left wing, then abruptly plants and redirects toward the top of the key.",
        "lebron": {
          "x": 56,
          "y": 66
        },
        "defender": {
          "x": 60,
          "y": 70
        },
        "inbounder": {
          "x": 4,
          "y": 64
        },
        "ball": {
          "x": 18,
          "y": 65
        },
        "telemetry": {
          "clock": "0.8s",
          "speed": "14.2 mph",
          "distance": "25 ft",
          "action": "Curling off screen"
        }
      },
      {
        "time": 0.6,
        "annotation": "LeBron gathers the pass at 25 feet with both hands, establishes his pivot, and elevates straight up.",
        "lebron": {
          "x": 50,
          "y": 62
        },
        "defender": {
          "x": 53,
          "y": 65
        },
        "inbounder": {
          "x": 4,
          "y": 64
        },
        "ball": {
          "x": 50,
          "y": 62
        },
        "telemetry": {
          "clock": "0.5s",
          "speed": "4.1 mph",
          "distance": "25 ft",
          "action": "Catch & elevate"
        }
      },
      {
        "time": 1.0,
        "annotation": "LeBron releases at the apex over Turkoglu's lunging contest. The backboard lights red as the ball hangs in the air.",
        "lebron": {
          "x": 50,
          "y": 62
        },
        "defender": {
          "x": 52,
          "y": 64
        },
        "inbounder": {
          "x": 4,
          "y": 64
        },
        "ball": {
          "x": 50,
          "y": 74
        },
        "telemetry": {
          "clock": "0.0s",
          "speed": "0.0 mph",
          "distance": "25 ft",
          "action": "Release at buzzer"
        }
      },
      {
        "time": 1.4,
        "annotation": "SWISH! The ball snaps the twine. Quicken Loans Arena detonates as LeBron sprints backwards into his teammates' arms.",
        "lebron": {
          "x": 48,
          "y": 55
        },
        "defender": {
          "x": 52,
          "y": 68
        },
        "inbounder": {
          "x": 10,
          "y": 64
        },
        "ball": {
          "x": 50,
          "y": 88
        },
        "telemetry": {
          "clock": "0.0s",
          "speed": "12.0 mph",
          "distance": "0 ft",
          "action": "Shot converts"
        }
      }
    ]
  },
  {
    "id": "clutch-2013-pacers",
    "date": "May 22, 2013",
    "isoDate": "2013-05-22",
    "season": "2012-13",
    "year": 2013,
    "round": "Eastern Conference Finals",
    "roundShort": "ECF",
    "game": "Game 1",
    "team": "MIA",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "venue": "AmericanAirlines Arena, Miami, FL",
    "scoreBefore": "IND 102 \u2013 MIA 101 (OT)",
    "scoreAfter": "IND 102 \u2013 MIA 103 (OT)",
    "result": "W (103\u2013102 OT)",
    "clockRemaining": "2.2s",
    "shotDistance": "1 ft",
    "shotType": "Driving left-handed layup",
    "courtZone": "At Rim / Restricted Area",
    "inbounder": "Shane Battier",
    "primaryDefender": "Paul George",
    "screener": "None (Isolation / Clear-out)",
    "seriesSituationBefore": "Game 1 of Conference Finals",
    "seriesImpact": "Secured Game 1 in overtime; capitalized on Frank Vogel benching Roy Hibbert; propelled Miami toward 7-game series victory.",
    "broadcastCall": {
      "caller": "Marv Albert",
      "network": "TNT",
      "quote": "Battier... to James, gets into the lane... at the buzzer, it counts! He makes the layup at the buzzer! LeBron James wins it for Miami!"
    },
    "description": "With 2.2 seconds left in overtime and Indiana leading by one, Pacers coach Frank Vogel subbed 7-foot-2 rim protector Roy Hibbert to the bench to guard against a 3-pointer. Shane Battier inbounded to LeBron at the left wing. Sizing up Paul George, LeBron executed a lightning-fast left-to-right crossover, blew past George's right hip, and glided to the unprotected rim for a left-handed layup as the horn sounded.",
    "keyframes": [
      {
        "time": 0.0,
        "annotation": "Shane Battier lines up the inbound at the left sideline. Frank Vogel benches Roy Hibbert; lane is unprotected.",
        "lebron": {
          "x": 28,
          "y": 66
        },
        "defender": {
          "x": 29,
          "y": 69
        },
        "inbounder": {
          "x": 4,
          "y": 68
        },
        "ball": {
          "x": 4,
          "y": 68
        },
        "telemetry": {
          "clock": "2.2s",
          "speed": "0.0 mph",
          "distance": "22 ft",
          "action": "Inbound stance"
        }
      },
      {
        "time": 0.5,
        "annotation": "Battier zips a pass into LeBron's chest at the three-point arc. Paul George crowds his right side to deny the pull-up.",
        "lebron": {
          "x": 26,
          "y": 68
        },
        "defender": {
          "x": 28,
          "y": 70
        },
        "inbounder": {
          "x": 4,
          "y": 68
        },
        "ball": {
          "x": 26,
          "y": 68
        },
        "telemetry": {
          "clock": "1.7s",
          "speed": "6.5 mph",
          "distance": "20 ft",
          "action": "Catch on perimeter"
        }
      },
      {
        "time": 1.2,
        "annotation": "LeBron rips through with a devastating left-hand drive, blowing past George into the vacant heart of the paint.",
        "lebron": {
          "x": 38,
          "y": 78
        },
        "defender": {
          "x": 33,
          "y": 75
        },
        "inbounder": {
          "x": 6,
          "y": 68
        },
        "ball": {
          "x": 38,
          "y": 78
        },
        "telemetry": {
          "clock": "1.0s",
          "speed": "17.8 mph",
          "distance": "12 ft",
          "action": "Downhill attack"
        }
      },
      {
        "time": 1.8,
        "annotation": "LeBron takes off off two feet at the edge of the charge circle, shielding the ball with his body against George's trailing hand.",
        "lebron": {
          "x": 47,
          "y": 86
        },
        "defender": {
          "x": 43,
          "y": 82
        },
        "inbounder": {
          "x": 8,
          "y": 68
        },
        "ball": {
          "x": 48,
          "y": 87
        },
        "telemetry": {
          "clock": "0.3s",
          "speed": "12.4 mph",
          "distance": "3 ft",
          "action": "Elevation to rim"
        }
      },
      {
        "time": 2.2,
        "annotation": "Left-handed scoop rolls gently off the glass and falls through the net as the buzzer blares! Heat win 103-102.",
        "lebron": {
          "x": 49,
          "y": 88
        },
        "defender": {
          "x": 46,
          "y": 86
        },
        "inbounder": {
          "x": 10,
          "y": 68
        },
        "ball": {
          "x": 50,
          "y": 88
        },
        "telemetry": {
          "clock": "0.0s",
          "speed": "0.0 mph",
          "distance": "0 ft",
          "action": "Buzzer-beater layup"
        }
      }
    ]
  },
  {
    "id": "clutch-2015-bulls",
    "date": "May 10, 2015",
    "isoDate": "2015-05-10",
    "season": "2014-15",
    "year": 2015,
    "round": "Eastern Conference Semifinals",
    "roundShort": "ECS",
    "game": "Game 4",
    "team": "CLE",
    "opponent": "CHI",
    "opponentName": "Chicago Bulls",
    "venue": "United Center, Chicago, IL",
    "scoreBefore": "CHI 84 \u2013 CLE 84",
    "scoreAfter": "CHI 84 \u2013 CLE 86",
    "result": "W (86\u201384)",
    "clockRemaining": "1.5s",
    "shotDistance": "21 ft",
    "shotType": "Corner baseline turnaround jumper",
    "courtZone": "Left Corner / Baseline",
    "inbounder": "Matthew Dellavedova",
    "primaryDefender": "Jimmy Butler",
    "screener": "None (Play scratched by LeBron)",
    "seriesSituationBefore": "CLE trailed 1\u20132 (facing potential 1\u20133 deficit after Derrick Rose G3 buzzer-beater)",
    "seriesImpact": "Evens series 2\u20132; saves Cavaliers' season; ignited 3-game win streak to win series 4\u20132.",
    "broadcastCall": {
      "caller": "Mike Breen",
      "network": "ABC",
      "quote": "Dellavedova inbounds... James, fires from the corner... IT'S GOOD! AT THE BUZZER! LEBRON JAMES WINS IT FOR CLEVELAND!"
    },
    "description": "Facing an existential 1-3 series hole after Derrick Rose's Game 3 bank shot, Cleveland found themselves tied 84-84 with 1.5 seconds remaining. Coach David Blatt diagrammed a play with LeBron inbounding. LeBron scratched the play: 'Give me the ball. Just get me the ball out of bounds, we're either going to overtime or I'm going to make the shot.' Matthew Dellavedova fired a cross-court bullet to the left corner. LeBron caught, faded away over Jimmy Butler's contest, and buried the 21-footer at the horn.",
    "keyframes": [
      {
        "time": 0.0,
        "annotation": "The Scratch: LeBron vetoes coach Blatt's play in the huddle. Dellavedova prepares to inbound from the far right sideline.",
        "lebron": {
          "x": 52,
          "y": 80
        },
        "defender": {
          "x": 50,
          "y": 78
        },
        "inbounder": {
          "x": 96,
          "y": 70
        },
        "ball": {
          "x": 96,
          "y": 70
        },
        "telemetry": {
          "clock": "1.5s",
          "speed": "0.0 mph",
          "distance": "21 ft",
          "action": "Veto in huddle"
        }
      },
      {
        "time": 0.4,
        "annotation": "LeBron fakes a cut toward the rim, planting his right foot to send Jimmy Butler leaning into the paint.",
        "lebron": {
          "x": 42,
          "y": 82
        },
        "defender": {
          "x": 44,
          "y": 80
        },
        "inbounder": {
          "x": 96,
          "y": 70
        },
        "ball": {
          "x": 96,
          "y": 70
        },
        "telemetry": {
          "clock": "1.2s",
          "speed": "11.4 mph",
          "distance": "22 ft",
          "action": "Decoy step inside"
        }
      },
      {
        "time": 0.8,
        "annotation": "LeBron flares out to the deep left baseline corner. Dellavedova zips a laser pass across the court.",
        "lebron": {
          "x": 12,
          "y": 86
        },
        "defender": {
          "x": 20,
          "y": 84
        },
        "inbounder": {
          "x": 96,
          "y": 70
        },
        "ball": {
          "x": 45,
          "y": 80
        },
        "telemetry": {
          "clock": "0.9s",
          "speed": "15.0 mph",
          "distance": "21 ft",
          "action": "Flare to corner"
        }
      },
      {
        "time": 1.2,
        "annotation": "LeBron catches in the left corner, plants his feet, and rises into a high-arcing turnaround fadeaway over Butler's outstretched hand.",
        "lebron": {
          "x": 10,
          "y": 87
        },
        "defender": {
          "x": 14,
          "y": 87
        },
        "inbounder": {
          "x": 94,
          "y": 70
        },
        "ball": {
          "x": 10,
          "y": 87
        },
        "telemetry": {
          "clock": "0.3s",
          "speed": "2.2 mph",
          "distance": "21 ft",
          "action": "Turnaround fadeaway"
        }
      },
      {
        "time": 1.5,
        "annotation": "Breen yells 'IT'S GOOD! AT THE BUZZER!' as the shot snaps cleanly through the cords. Cavaliers bench rushes the floor.",
        "lebron": {
          "x": 8,
          "y": 87
        },
        "defender": {
          "x": 13,
          "y": 87
        },
        "inbounder": {
          "x": 90,
          "y": 70
        },
        "ball": {
          "x": 50,
          "y": 88
        },
        "telemetry": {
          "clock": "0.0s",
          "speed": "0.0 mph",
          "distance": "0 ft",
          "action": "Corner dagger converts"
        }
      }
    ]
  },
  {
    "id": "clutch-2018-pacers",
    "date": "April 25, 2018",
    "isoDate": "2018-04-25",
    "season": "2017-18",
    "year": 2018,
    "round": "Eastern Conference First Round",
    "roundShort": "EC1",
    "game": "Game 5",
    "team": "CLE",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "venue": "Quicken Loans Arena, Cleveland, OH",
    "scoreBefore": "IND 95 \u2013 CLE 95",
    "scoreAfter": "IND 95 \u2013 CLE 98",
    "result": "W (98\u201395)",
    "clockRemaining": "3.0s",
    "shotDistance": "26 ft",
    "shotType": "Straight-on pull-up 3-pointer",
    "courtZone": "Top of Key / Logo Range",
    "inbounder": "Jeff Green",
    "primaryDefender": "Thaddeus Young",
    "screener": "None (Isolation / Self-creation)",
    "seriesSituationBefore": "Series tied 2\u20132 (pivotal Game 5 in Cleveland)",
    "seriesImpact": "Put Cavaliers ahead 3\u20132 in grueling 7-game dogfight; capped back-to-back clutch plays (block on Oladipo + buzzer-beater).",
    "broadcastCall": {
      "caller": "Mike Breen",
      "network": "TNT / NBA on ABC",
      "quote": "Green to inbound... gets it to James. 2 seconds... 1 second... for the win... HE HITS IT! LEBRON JAMES WITH A THREE AT THE BUZZER!"
    },
    "description": "With five seconds left in a tied 95-95 game, Victor Oladipo attacked the rim for a potential game-winning layup. LeBron raced from behind and pinned Oladipo's shot against the glass with 3.0 seconds remaining. Cleveland called timeout. Jeff Green inbounded to LeBron at mid-court. LeBron took two decisive dribbles left against Thaddeus Young, stepped back straight-on at 26 feet, and drilled the game-winning three at the horn before leaping onto the scorer's table.",
    "keyframes": [
      {
        "time": 0.0,
        "annotation": "The Block: 3.0s earlier, LeBron swatted Victor Oladipo's layup against the backboard at (50, 88). Timeout Cavaliers.",
        "lebron": {
          "x": 50,
          "y": 88
        },
        "defender": {
          "x": 50,
          "y": 87
        },
        "inbounder": {
          "x": 4,
          "y": 55
        },
        "ball": {
          "x": 4,
          "y": 55
        },
        "telemetry": {
          "clock": "3.0s",
          "speed": "18.5 mph",
          "distance": "70 ft",
          "action": "Chasedown block"
        }
      },
      {
        "time": 0.8,
        "annotation": "Jeff Green inbounds from the sideline. LeBron catches on the dead run at the Cavaliers logo (50, 52).",
        "lebron": {
          "x": 50,
          "y": 52
        },
        "defender": {
          "x": 50,
          "y": 56
        },
        "inbounder": {
          "x": 4,
          "y": 55
        },
        "ball": {
          "x": 50,
          "y": 52
        },
        "telemetry": {
          "clock": "2.4s",
          "speed": "12.3 mph",
          "distance": "36 ft",
          "action": "Inbound reception"
        }
      },
      {
        "time": 1.6,
        "annotation": "LeBron takes two heavy rhythmic dribbles to his left, using his frame to bump Thaddeus Young off balance.",
        "lebron": {
          "x": 46,
          "y": 59
        },
        "defender": {
          "x": 48,
          "y": 62
        },
        "inbounder": {
          "x": 6,
          "y": 55
        },
        "ball": {
          "x": 46,
          "y": 59
        },
        "telemetry": {
          "clock": "1.4s",
          "speed": "10.0 mph",
          "distance": "29 ft",
          "action": "Left-hand pound dribble"
        }
      },
      {
        "time": 2.4,
        "annotation": "LeBron plants both sneakers, executes a subtle gather-step back, and elevates from 26 feet straight-on.",
        "lebron": {
          "x": 48,
          "y": 62
        },
        "defender": {
          "x": 49,
          "y": 65
        },
        "inbounder": {
          "x": 8,
          "y": 55
        },
        "ball": {
          "x": 48,
          "y": 62
        },
        "telemetry": {
          "clock": "0.5s",
          "speed": "2.1 mph",
          "distance": "26 ft",
          "action": "Elevation from logo"
        }
      },
      {
        "time": 3.0,
        "annotation": "The shot splashes true! LeBron sprints straight toward the scorer's table, leaping atop it with arms outstretched as the building shakes.",
        "lebron": {
          "x": 50,
          "y": 62
        },
        "defender": {
          "x": 49,
          "y": 67
        },
        "inbounder": {
          "x": 12,
          "y": 55
        },
        "ball": {
          "x": 50,
          "y": 88
        },
        "telemetry": {
          "clock": "0.0s",
          "speed": "0.0 mph",
          "distance": "0 ft",
          "action": "Buzzer-beater 3PT"
        }
      }
    ]
  },
  {
    "id": "clutch-2018-raptors",
    "date": "May 5, 2018",
    "isoDate": "2018-05-05",
    "season": "2017-18",
    "year": 2018,
    "round": "Eastern Conference Semifinals",
    "roundShort": "ECS",
    "game": "Game 3",
    "team": "CLE",
    "opponent": "TOR",
    "opponentName": "Toronto Raptors",
    "venue": "Quicken Loans Arena, Cleveland, OH",
    "scoreBefore": "TOR 103 \u2013 CLE 103",
    "scoreAfter": "TOR 103 \u2013 CLE 105",
    "result": "W (105\u2013103)",
    "clockRemaining": "8.0s",
    "shotDistance": "12 ft",
    "shotType": "Running off-balance bank shot off glass",
    "courtZone": "Left Paint / Mid-Range Left",
    "inbounder": "Jeff Green",
    "primaryDefender": "OG Anunoby",
    "screener": "None (Coast-to-coast sprint)",
    "seriesSituationBefore": "CLE led 2\u20130 (having won Games 1 & 2 in Toronto)",
    "seriesImpact": "Takes 3\u20130 stranglehold; broke the spirit of 59-win Raptors; cemented the 'LeBronto' era before Game 4 sweep.",
    "broadcastCall": {
      "caller": "Brian Anderson",
      "network": "TNT",
      "quote": "James on the run... floats it up... BANKS IT IN! HE BANKS IT IN AT THE BUZZER! LEBRON JAMES DOES IT AGAIN!"
    },
    "description": "After OG Anunoby nailed a stunning game-tying 3-pointer with 8.0 seconds left, Cleveland had no timeouts. Jeff Green quickly inbounded under the Cavaliers' own basket. LeBron caught the ball on the dead sprint, stormed coast-to-coast down the left side of the floor, veered around OG Anunoby and CJ Miles, jumped off his right foot from 12 feet, and banked a one-handed running teardrop softly off the glass as time expired.",
    "keyframes": [
      {
        "time": 0.0,
        "annotation": "OG Anunoby ties game with 8.0s left. Cleveland has no timeouts. Jeff Green inbounds under Cleveland's own hoop.",
        "lebron": {
          "x": 48,
          "y": 8
        },
        "defender": {
          "x": 45,
          "y": 25
        },
        "inbounder": {
          "x": 50,
          "y": 4
        },
        "ball": {
          "x": 50,
          "y": 4
        },
        "telemetry": {
          "clock": "8.0s",
          "speed": "8.5 mph",
          "distance": "86 ft",
          "action": "Coast-to-coast ignition"
        }
      },
      {
        "time": 2.5,
        "annotation": "LeBron catches in full stride and blazes across half court at 19.4 mph, pushing through Toronto's backpedaling defense.",
        "lebron": {
          "x": 42,
          "y": 50
        },
        "defender": {
          "x": 40,
          "y": 58
        },
        "inbounder": {
          "x": 48,
          "y": 15
        },
        "ball": {
          "x": 42,
          "y": 50
        },
        "telemetry": {
          "clock": "5.5s",
          "speed": "19.4 mph",
          "distance": "44 ft",
          "action": "Open-floor acceleration"
        }
      },
      {
        "time": 5.2,
        "annotation": "LeBron angles toward the left side of the paint, keeping OG Anunoby on his hip and absorbing contact.",
        "lebron": {
          "x": 34,
          "y": 74
        },
        "defender": {
          "x": 36,
          "y": 77
        },
        "inbounder": {
          "x": 44,
          "y": 35
        },
        "ball": {
          "x": 34,
          "y": 74
        },
        "telemetry": {
          "clock": "2.8s",
          "speed": "15.1 mph",
          "distance": "20 ft",
          "action": "Angled drive left"
        }
      },
      {
        "time": 7.0,
        "annotation": "LeBron launches off his right foot from 12 feet, floating laterally toward the sideline while squaring his eyes to the backboard.",
        "lebron": {
          "x": 36,
          "y": 82
        },
        "defender": {
          "x": 38,
          "y": 83
        },
        "inbounder": {
          "x": 42,
          "y": 50
        },
        "ball": {
          "x": 36,
          "y": 82
        },
        "telemetry": {
          "clock": "1.0s",
          "speed": "9.8 mph",
          "distance": "12 ft",
          "action": "One-footed bank floater"
        }
      },
      {
        "time": 8.0,
        "annotation": "The high-arching push shot kisses the top-left square of the glass and drops in as the horn expires! Cavaliers win 105-103!",
        "lebron": {
          "x": 34,
          "y": 86
        },
        "defender": {
          "x": 39,
          "y": 85
        },
        "inbounder": {
          "x": 40,
          "y": 60
        },
        "ball": {
          "x": 50,
          "y": 88
        },
        "telemetry": {
          "clock": "0.0s",
          "speed": "0.0 mph",
          "distance": "0 ft",
          "action": "Bank shot buzzer-beater"
        }
      }
    ]
  }
] as const;

export const PLAYOFF_TRIPLE_DOUBLES: readonly TripleDoubleEntry[] = [
  {
    "id": "ptd-1",
    "date": "2006-04-22",
    "year": 2006,
    "round": "First Round",
    "roundCode": "EC1",
    "gameNumber": 1,
    "team": "CLE",
    "opponent": "WAS",
    "opponentName": "Washington Wizards",
    "pts": 32,
    "reb": 11,
    "ast": 11,
    "result": "W",
    "score": "97\u201386",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "Playoff debut: became only the third player in NBA history (after Magic Johnson and Johnny McCarthy) to record a triple-double in his first career playoff game."
  },
  {
    "id": "ptd-2",
    "date": "2006-05-13",
    "year": 2006,
    "round": "Conf Semifinals",
    "roundCode": "ECS",
    "gameNumber": 3,
    "team": "CLE",
    "opponent": "DET",
    "opponentName": "Detroit Pistons",
    "pts": 21,
    "reb": 10,
    "ast": 10,
    "result": "W",
    "score": "86\u201377",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "First career playoff win over the defending conference champion Pistons, igniting Cleveland's comeback from 0-2 down."
  },
  {
    "id": "ptd-3",
    "date": "2008-05-02",
    "year": 2008,
    "round": "First Round",
    "roundCode": "EC1",
    "gameNumber": 6,
    "team": "CLE",
    "opponent": "WAS",
    "opponentName": "Washington Wizards",
    "pts": 27,
    "reb": 13,
    "ast": 13,
    "result": "W",
    "score": "105\u201388",
    "venue": "Verizon Center, Washington, D.C.",
    "notes": "Series closeout masterclass on the road to eliminate the rival Wizards for the third consecutive postseason."
  },
  {
    "id": "ptd-4",
    "date": "2009-05-28",
    "year": 2009,
    "round": "Conf Finals",
    "roundCode": "ECF",
    "gameNumber": 5,
    "team": "CLE",
    "opponent": "ORL",
    "opponentName": "Orlando Magic",
    "pts": 37,
    "reb": 14,
    "ast": 12,
    "result": "W",
    "score": "112\u2013102",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "Staved off elimination in Game 5, scoring or assisting on 32 of Cleveland's final 34 points in the second half."
  },
  {
    "id": "ptd-5",
    "date": "2010-04-25",
    "year": 2010,
    "round": "First Round",
    "roundCode": "EC1",
    "gameNumber": 4,
    "team": "CLE",
    "opponent": "CHI",
    "opponentName": "Chicago Bulls",
    "pts": 37,
    "reb": 12,
    "ast": 11,
    "result": "W",
    "score": "121\u201398",
    "venue": "United Center, Chicago",
    "notes": "Dominant 37-point triple-double hitting 6 of 9 from three-point range to take commanding 3-1 lead in Chicago."
  },
  {
    "id": "ptd-6",
    "date": "2010-05-13",
    "year": 2010,
    "round": "Conf Semifinals",
    "roundCode": "ECS",
    "gameNumber": 6,
    "team": "CLE",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "pts": 27,
    "reb": 19,
    "ast": 10,
    "result": "L",
    "score": "85\u201394",
    "venue": "TD Garden, Boston",
    "notes": "Final game of his first Cleveland stint: grabbed a playoff career-high 19 rebounds despite battling elbow strain."
  },
  {
    "id": "ptd-7",
    "date": "2011-06-09",
    "year": 2011,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 5,
    "team": "MIA",
    "opponent": "DAL",
    "opponentName": "Dallas Mavericks",
    "pts": 17,
    "reb": 10,
    "ast": 10,
    "result": "L",
    "score": "103\u2013112",
    "venue": "American Airlines Center, Dallas",
    "notes": "First triple-double in Miami Heat playoff franchise history."
  },
  {
    "id": "ptd-8",
    "date": "2012-06-21",
    "year": 2012,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 5,
    "team": "MIA",
    "opponent": "OKC",
    "opponentName": "Oklahoma City Thunder",
    "pts": 26,
    "reb": 11,
    "ast": 13,
    "result": "W",
    "score": "121\u2013106",
    "venue": "AmericanAirlines Arena, Miami",
    "notes": "First NBA Championship: orchestrated a blowout title-clincher to secure unanimous Finals MVP honours."
  },
  {
    "id": "ptd-9",
    "date": "2013-05-22",
    "year": 2013,
    "round": "Conf Finals",
    "roundCode": "ECF",
    "gameNumber": 1,
    "team": "MIA",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "pts": 30,
    "reb": 10,
    "ast": 10,
    "result": "W",
    "score": "103\u2013102 (OT)",
    "venue": "AmericanAirlines Arena, Miami",
    "notes": "Dual-glory game: recorded 30-10-10 triple-double and sank the 2.2s driving left-handed buzzer-beater at the rim."
  },
  {
    "id": "ptd-10",
    "date": "2013-06-06",
    "year": 2013,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 1,
    "team": "MIA",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "pts": 18,
    "reb": 18,
    "ast": 10,
    "result": "L",
    "score": "88\u201392",
    "venue": "AmericanAirlines Arena, Miami",
    "notes": "Pulled down 18 rebounds while orchestrating the offense in a tight defensive series opener."
  },
  {
    "id": "ptd-11",
    "date": "2013-06-18",
    "year": 2013,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 6,
    "team": "MIA",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "pts": 32,
    "reb": 10,
    "ast": 11,
    "result": "W",
    "score": "103\u2013100 (OT)",
    "venue": "AmericanAirlines Arena, Miami",
    "notes": "Headband-less fourth quarter fury: scored 16 in fourth to spark historic rally leading into Ray Allen's corner three."
  },
  {
    "id": "ptd-12",
    "date": "2015-05-24",
    "year": 2015,
    "round": "Conf Finals",
    "roundCode": "ECF",
    "gameNumber": 3,
    "team": "CLE",
    "opponent": "ATL",
    "opponentName": "Atlanta Hawks",
    "pts": 37,
    "reb": 18,
    "ast": 13,
    "result": "W",
    "score": "114\u2013111 (OT)",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "Exhaustion masterclass: missed first 10 shots, then tallied 37 pts, 18 reb, 13 ast, collapsing to his knees at buzzer."
  },
  {
    "id": "ptd-13",
    "date": "2015-06-07",
    "year": 2015,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 2,
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 39,
    "reb": 16,
    "ast": 11,
    "result": "W",
    "score": "95\u201393 (OT)",
    "venue": "Oracle Arena, Oakland",
    "notes": "Stole Game 2 in Oracle without Irving or Love, playing 50 minutes with 39 points, 16 rebounds, and 11 assists."
  },
  {
    "id": "ptd-14",
    "date": "2015-06-14",
    "year": 2015,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 5,
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 40,
    "reb": 14,
    "ast": 11,
    "result": "L",
    "score": "91\u2013104",
    "venue": "Oracle Arena, Oakland",
    "notes": "Became only the second player in NBA Finals history (after Jerry West) to record a 40-point Finals triple-double."
  },
  {
    "id": "ptd-15",
    "date": "2016-05-19",
    "year": 2016,
    "round": "Conf Finals",
    "roundCode": "ECF",
    "gameNumber": 2,
    "team": "CLE",
    "opponent": "TOR",
    "opponentName": "Toronto Raptors",
    "pts": 23,
    "reb": 11,
    "ast": 11,
    "result": "W",
    "score": "108\u201389",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "Flawless game control on 7-of-13 shooting as Cleveland cruised to 10-0 start in the 2016 postseason."
  },
  {
    "id": "ptd-16",
    "date": "2016-06-19",
    "year": 2016,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 7,
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 27,
    "reb": 11,
    "ast": 11,
    "result": "W",
    "score": "93\u201389",
    "venue": "Oracle Arena, Oakland",
    "notes": "The Promise Delivered: Game 7 triple-double, 'The Block' with 1:52 left, and Cleveland's first championship in 52 years."
  },
  {
    "id": "ptd-17",
    "date": "2017-04-20",
    "year": 2017,
    "round": "First Round",
    "roundCode": "EC1",
    "gameNumber": 3,
    "team": "CLE",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "pts": 41,
    "reb": 13,
    "ast": 12,
    "result": "W",
    "score": "119\u2013114",
    "venue": "Bankers Life Fieldhouse, Indianapolis",
    "notes": "Historic 25-point halftime comeback: played the entire second half with bench unit, scoring 28 of his 41 after break."
  },
  {
    "id": "ptd-18",
    "date": "2017-06-04",
    "year": 2017,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 2,
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 29,
    "reb": 11,
    "ast": 14,
    "result": "L",
    "score": "113\u2013132",
    "venue": "Oracle Arena, Oakland",
    "notes": "Tied Magic Johnson's all-time record with his 8th career NBA Finals triple-double."
  },
  {
    "id": "ptd-19",
    "date": "2017-06-09",
    "year": 2017,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 4,
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 31,
    "reb": 10,
    "ast": 11,
    "result": "W",
    "score": "137\u2013116",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "Passed Magic Johnson for the most triple-doubles in NBA Finals history with his 9th career Finals triple-double."
  },
  {
    "id": "ptd-20",
    "date": "2018-04-15",
    "year": 2018,
    "round": "First Round",
    "roundCode": "EC1",
    "gameNumber": 1,
    "team": "CLE",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "pts": 24,
    "reb": 10,
    "ast": 12,
    "result": "L",
    "score": "80\u201398",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "Carried the offensive creation burden in a tough series opener to open the legendary 2018 postseason run."
  },
  {
    "id": "ptd-21",
    "date": "2018-05-01",
    "year": 2018,
    "round": "Conf Semifinals",
    "roundCode": "ECS",
    "gameNumber": 1,
    "team": "CLE",
    "opponent": "TOR",
    "opponentName": "Toronto Raptors",
    "pts": 26,
    "reb": 11,
    "ast": 13,
    "result": "W",
    "score": "113\u2013112 (OT)",
    "venue": "Air Canada Centre, Toronto",
    "notes": "Overtime steal in Toronto: hit tying fadeaway late in regulation and orchestrated OT victory."
  },
  {
    "id": "ptd-22",
    "date": "2018-05-15",
    "year": 2018,
    "round": "Conf Finals",
    "roundCode": "ECF",
    "gameNumber": 2,
    "team": "CLE",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "pts": 42,
    "reb": 10,
    "ast": 12,
    "result": "L",
    "score": "94\u2013107",
    "venue": "TD Garden, Boston",
    "notes": "Highest-scoring playoff triple-double of career: dropped 42 points on 16-of-29 shooting with 12 assists."
  },
  {
    "id": "ptd-23",
    "date": "2018-06-06",
    "year": 2018,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 3,
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 33,
    "reb": 10,
    "ast": 11,
    "result": "L",
    "score": "102\u2013110",
    "venue": "Quicken Loans Arena, Cleveland",
    "notes": "Tenth career NBA Finals triple-double, highlighted by self alley-oop off the backboard."
  },
  {
    "id": "ptd-24",
    "date": "2020-08-18",
    "year": 2020,
    "round": "First Round",
    "roundCode": "WC1",
    "gameNumber": 1,
    "team": "LAL",
    "opponent": "POR",
    "opponentName": "Portland Trail Blazers",
    "pts": 23,
    "reb": 17,
    "ast": 16,
    "result": "L",
    "score": "93\u2013100",
    "venue": "AdventHealth Arena, Orlando Bubble",
    "notes": "Historic bubble playoff debut: first player in NBA history with at least 20 pts, 15 reb, and 15 ast in a playoff game."
  },
  {
    "id": "ptd-25",
    "date": "2020-08-29",
    "year": 2020,
    "round": "First Round",
    "roundCode": "WC1",
    "gameNumber": 5,
    "team": "LAL",
    "opponent": "POR",
    "opponentName": "Portland Trail Blazers",
    "pts": 36,
    "reb": 10,
    "ast": 10,
    "result": "W",
    "score": "131\u2013122",
    "venue": "AdventHealth Arena, Orlando Bubble",
    "notes": "Closed out Portland with 36 points on 14-of-19 shooting (73.7% FG) alongside Anthony Davis' 43."
  },
  {
    "id": "ptd-26",
    "date": "2020-09-12",
    "year": 2020,
    "round": "Conf Semifinals",
    "roundCode": "WCS",
    "gameNumber": 5,
    "team": "LAL",
    "opponent": "HOU",
    "opponentName": "Houston Rockets",
    "pts": 29,
    "reb": 11,
    "ast": 11,
    "result": "W",
    "score": "119\u201396",
    "venue": "AdventHealth Arena, Orlando Bubble",
    "notes": "Eliminated Houston's small-ball system in 31 dominant minutes to return to Conference Finals."
  },
  {
    "id": "ptd-27",
    "date": "2020-09-26",
    "year": 2020,
    "round": "Conf Finals",
    "roundCode": "WCF",
    "gameNumber": 5,
    "team": "LAL",
    "opponent": "DEN",
    "opponentName": "Denver Nuggets",
    "pts": 38,
    "reb": 16,
    "ast": 10,
    "result": "W",
    "score": "117\u2013107",
    "venue": "AdventHealth Arena, Orlando Bubble",
    "notes": "Fourth-quarter takeover: scored 16 of his 38 points in the final period to advance Lakers to Finals."
  },
  {
    "id": "ptd-28",
    "date": "2020-10-11",
    "year": 2020,
    "round": "NBA Finals",
    "roundCode": "FIN",
    "gameNumber": 6,
    "team": "LAL",
    "opponent": "MIA",
    "opponentName": "Miami Heat",
    "pts": 28,
    "reb": 14,
    "ast": 10,
    "result": "W",
    "score": "106\u201393",
    "venue": "AdventHealth Arena, Orlando Bubble",
    "notes": "The Fourth Crown: 28-14-10 championship-clinching triple-double, capturing fourth title and fourth Finals MVP."
  }
] as const;

export const REGULAR_SEASON_TRIPLE_DOUBLES: readonly TripleDoubleEntry[] = [
  {
    "id": "rtd-1",
    "date": "2005-01-19",
    "season": "2004-05",
    "year": 2005,
    "era": "cle1",
    "team": "CLE",
    "opponent": "POR",
    "opponentName": "Portland Trail Blazers",
    "pts": 27,
    "reb": 11,
    "ast": 10,
    "result": "W",
    "score": "107\u2013101",
    "venue": "Gund Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "First Career Triple-Double",
    "notes": "Youngest player in NBA history at the time to record a triple-double (20 years, 20 days)."
  },
  {
    "id": "rtd-2",
    "date": "2005-01-22",
    "season": "2004-05",
    "year": 2005,
    "era": "cle1",
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 28,
    "reb": 12,
    "ast": 10,
    "result": "W",
    "score": "105\u201387",
    "venue": "Gund Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "Second career triple-double 3 days later",
    "notes": "Followed his historic first triple-double with another just three nights later."
  },
  {
    "id": "rtd-3",
    "date": "2006-02-15",
    "season": "2005-06",
    "year": 2006,
    "era": "cle1",
    "team": "CLE",
    "opponent": "BOS",
    "opponentName": "Boston Celtics",
    "pts": 26,
    "reb": 11,
    "ast": 10,
    "result": "W",
    "score": "113\u2013109 (2OT)",
    "venue": "TD Banknorth Garden, Boston",
    "category": "Regular Season",
    "milestone": "Double OT Garden Thriller",
    "notes": "Played 54 minutes on the road in Boston, leading a double-overtime duel against Paul Pierce."
  },
  {
    "id": "rtd-4",
    "date": "2008-01-11",
    "season": "2007-08",
    "year": 2008,
    "era": "cle1",
    "team": "CLE",
    "opponent": "CHA",
    "opponentName": "Charlotte Bobcats",
    "pts": 31,
    "reb": 19,
    "ast": 8,
    "result": "W",
    "score": "113\u2013106 (2OT)",
    "venue": "Charlotte Bobcats Arena, Charlotte",
    "category": "Regular Season",
    "milestone": "Near 30-20 Triple-Double",
    "notes": "Pulled down 19 rebounds with 31 points in double-OT battle."
  },
  {
    "id": "rtd-5",
    "date": "2008-01-19",
    "season": "2007-08",
    "year": 2008,
    "era": "cle1",
    "team": "CLE",
    "opponent": "MIA",
    "opponentName": "Miami Heat",
    "pts": 28,
    "reb": 10,
    "ast": 10,
    "result": "W",
    "score": "98\u201392",
    "venue": "AmericanAirlines Arena, Miami",
    "category": "Regular Season",
    "milestone": "Duel with Dwyane Wade",
    "notes": "First career triple-double against the Miami Heat franchise."
  },
  {
    "id": "rtd-6",
    "date": "2009-02-04",
    "season": "2008-09",
    "year": 2009,
    "era": "cle1",
    "team": "CLE",
    "opponent": "NYK",
    "opponentName": "New York Knicks",
    "pts": 52,
    "reb": 9,
    "ast": 11,
    "result": "W",
    "score": "107\u2013102",
    "venue": "Madison Square Garden, New York",
    "category": "Regular Season",
    "milestone": "The 52-Point MSG Masterpiece",
    "notes": "Originally credited with 52-10-11 on the broadcast; post-game NBA review rescinded 1 rebound to Ben Wallace, officially making it 52 PTS, 9 REB, 11 AST."
  },
  {
    "id": "rtd-7",
    "date": "2009-02-20",
    "season": "2008-09",
    "year": 2009,
    "era": "cle1",
    "team": "CLE",
    "opponent": "TOR",
    "opponentName": "Toronto Raptors",
    "pts": 20,
    "reb": 12,
    "ast": 12,
    "result": "W",
    "score": "100\u201391",
    "venue": "Air Canada Centre, Toronto",
    "category": "Regular Season",
    "milestone": "Franchise Sweep Campaign",
    "notes": "Efficient 20-12-12 line in Toronto during Cleveland's 66-win campaign."
  },
  {
    "id": "rtd-8",
    "date": "2010-02-18",
    "season": "2009-10",
    "year": 2010,
    "era": "cle1",
    "team": "CLE",
    "opponent": "DEN",
    "opponentName": "Denver Nuggets",
    "pts": 43,
    "reb": 13,
    "ast": 15,
    "result": "L",
    "score": "116\u2013118 (OT)",
    "venue": "Quicken Loans Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "Monster 40-10-15 Duel with Carmelo",
    "notes": "One of only two 40-point, 13-rebound, 15-assist games in modern NBA history; epic clash with Carmelo Anthony."
  },
  {
    "id": "rtd-9",
    "date": "2010-03-17",
    "season": "2009-10",
    "year": 2010,
    "era": "cle1",
    "team": "CLE",
    "opponent": "ORL",
    "opponentName": "Orlando Magic",
    "pts": 29,
    "reb": 12,
    "ast": 14,
    "result": "W",
    "score": "115\u2013106",
    "venue": "Amway Arena, Orlando",
    "category": "Regular Season",
    "milestone": "Revenge Win in Orlando",
    "notes": "Orchestrated offense against Dwight Howard's defense with 14 assists on national television."
  },
  {
    "id": "rtd-10",
    "date": "2010-12-25",
    "season": "2010-11",
    "year": 2010,
    "era": "mia",
    "team": "MIA",
    "opponent": "LAL",
    "opponentName": "Los Angeles Lakers",
    "pts": 27,
    "reb": 11,
    "ast": 10,
    "result": "W",
    "score": "96\u201380",
    "venue": "STAPLES Center, Los Angeles",
    "category": "Regular Season",
    "milestone": "Christmas Day Showcase in LA",
    "notes": "Dominated Kobe Bryant and the defending champion Lakers on Christmas Day in Staples Center."
  },
  {
    "id": "rtd-11",
    "date": "2011-03-29",
    "season": "2010-11",
    "year": 2011,
    "era": "mia",
    "team": "MIA",
    "opponent": "CLE",
    "opponentName": "Cleveland Cavaliers",
    "pts": 19,
    "reb": 10,
    "ast": 10,
    "result": "L",
    "score": "90\u2013102",
    "venue": "Quicken Loans Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "Return to Cleveland Triple-Double",
    "notes": "First career triple-double against his former team in Cleveland."
  },
  {
    "id": "rtd-12",
    "date": "2013-03-20",
    "season": "2012-13",
    "year": 2013,
    "era": "mia",
    "team": "MIA",
    "opponent": "CLE",
    "opponentName": "Cleveland Cavaliers",
    "pts": 25,
    "reb": 12,
    "ast": 10,
    "result": "W",
    "score": "98\u201395",
    "venue": "Quicken Loans Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "27-Game Streak: 27-Point Comeback",
    "notes": "Rallied Miami from a 27-point third-quarter deficit to keep the historic 27-game winning streak alive."
  },
  {
    "id": "rtd-13",
    "date": "2014-04-12",
    "season": "2013-14",
    "year": 2014,
    "era": "mia",
    "team": "MIA",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "pts": 36,
    "reb": 6,
    "ast": 0,
    "result": "W",
    "score": "98\u201386",
    "venue": "AmericanAirlines Arena, Miami",
    "category": "Regular Season",
    "milestone": "No-Assist 36pt Line",
    "notes": "Showcased scoring adaptability against Indiana's No. 1 defense."
  },
  {
    "id": "rtd-14",
    "date": "2015-02-26",
    "season": "2014-15",
    "year": 2015,
    "era": "cle2",
    "team": "CLE",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 42,
    "reb": 11,
    "ast": 5,
    "result": "W",
    "score": "110\u201399",
    "venue": "Quicken Loans Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "42-Point Statement vs 67-win Warriors",
    "notes": "Set the tone for the rivalry, dropping 42 points on Stephen Curry's squad."
  },
  {
    "id": "rtd-15",
    "date": "2017-01-23",
    "season": "2016-17",
    "year": 2017,
    "era": "cle2",
    "team": "CLE",
    "opponent": "NOP",
    "opponentName": "New Orleans Pelicans",
    "pts": 26,
    "reb": 10,
    "ast": 12,
    "result": "L",
    "score": "122\u2013124",
    "venue": "Smoothie King Center, New Orleans",
    "category": "Regular Season",
    "milestone": "Pelicans Checked Off",
    "notes": "Conquered New Orleans with 26-10-12 line in a high-scoring shootout."
  },
  {
    "id": "rtd-16",
    "date": "2017-02-06",
    "season": "2016-17",
    "year": 2017,
    "era": "cle2",
    "team": "CLE",
    "opponent": "WAS",
    "opponentName": "Washington Wizards",
    "pts": 32,
    "reb": 7,
    "ast": 17,
    "result": "W",
    "score": "140\u2013135 (OT)",
    "venue": "Verizon Center, Washington, D.C.",
    "category": "Regular Season",
    "milestone": "The Turnaround Bank 3PT + 17 Assists",
    "notes": "Banked in full-court turnaround 3PT to force OT, then fouled out as Kevin Love and Kyrie sealed it with his 17 assists."
  },
  {
    "id": "rtd-17",
    "date": "2017-03-09",
    "season": "2016-17",
    "year": 2017,
    "era": "cle2",
    "team": "CLE",
    "opponent": "DET",
    "opponentName": "Detroit Pistons",
    "pts": 29,
    "reb": 14,
    "ast": 10,
    "result": "L",
    "score": "101\u2013106",
    "venue": "The Palace of Auburn Hills, Detroit",
    "category": "Regular Season",
    "milestone": "50th Career Triple-Double",
    "notes": "Became only the 7th player in NBA history to reach 50 career regular season triple-doubles."
  },
  {
    "id": "rtd-18",
    "date": "2017-03-27",
    "season": "2016-17",
    "year": 2017,
    "era": "cle2",
    "team": "CLE",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "pts": 17,
    "reb": 8,
    "ast": 8,
    "result": "L",
    "score": "74\u2013103",
    "venue": "AT&T Center, San Antonio",
    "category": "Regular Season",
    "milestone": "Spurs Showdown",
    "notes": "Defensive battle in San Antonio."
  },
  {
    "id": "rtd-19",
    "date": "2017-04-11",
    "season": "2016-17",
    "year": 2017,
    "era": "cle2",
    "team": "CLE",
    "opponent": "BKN",
    "opponentName": "Brooklyn Nets",
    "pts": 36,
    "reb": 13,
    "ast": 13,
    "result": "W",
    "score": "120\u2013111",
    "venue": "Barclays Center, Brooklyn",
    "category": "Regular Season",
    "milestone": "36-13-13 Masterclass",
    "notes": "Tune-up before the 2017 playoffs with 36 points on 14-of-21 shooting."
  },
  {
    "id": "rtd-20",
    "date": "2017-12-16",
    "season": "2017-18",
    "year": 2017,
    "era": "cle2",
    "team": "CLE",
    "opponent": "UTA",
    "opponentName": "Utah Jazz",
    "pts": 29,
    "reb": 11,
    "ast": 10,
    "result": "W",
    "score": "109\u2013100",
    "venue": "Quicken Loans Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "Jazz Checked Off",
    "notes": "Passed Larry Bird for 6th on all-time triple-double list with his 60th career triple-double."
  },
  {
    "id": "rtd-21",
    "date": "2018-02-07",
    "season": "2017-18",
    "year": 2018,
    "era": "cle2",
    "team": "CLE",
    "opponent": "MIN",
    "opponentName": "Minnesota Timberwolves",
    "pts": 37,
    "reb": 10,
    "ast": 15,
    "result": "W",
    "score": "140\u2013138 (OT)",
    "venue": "Quicken Loans Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "Block + Buzzer-Beater Over Butler",
    "notes": "Blocked Jimmy Butler's shot with 1.4s left in OT, then hit the turnaround game-winner at the buzzer."
  },
  {
    "id": "rtd-22",
    "date": "2018-02-09",
    "season": "2017-18",
    "year": 2018,
    "era": "cle2",
    "team": "CLE",
    "opponent": "ATL",
    "opponentName": "Atlanta Hawks",
    "pts": 22,
    "reb": 12,
    "ast": 19,
    "result": "W",
    "score": "123\u2013107",
    "venue": "Philips Arena, Atlanta",
    "category": "Regular Season",
    "milestone": "Career-High 19 Assists",
    "notes": "Tied his career high with 19 assists while orchestrating a revamped Cleveland roster."
  },
  {
    "id": "rtd-23",
    "date": "2018-03-20",
    "season": "2017-18",
    "year": 2018,
    "era": "cle2",
    "team": "CLE",
    "opponent": "IND",
    "opponentName": "Indiana Pacers",
    "pts": 37,
    "reb": 10,
    "ast": 15,
    "result": "W",
    "score": "124\u2013117",
    "venue": "Quicken Loans Arena, Cleveland",
    "category": "Regular Season",
    "milestone": "Pacers Preview Masterpiece",
    "notes": "Poured in 37 points with 15 assists on 60% shooting."
  },
  {
    "id": "rtd-24",
    "date": "2018-04-06",
    "season": "2017-18",
    "year": 2018,
    "era": "cle2",
    "team": "CLE",
    "opponent": "PHI",
    "opponentName": "Philadelphia 76ers",
    "pts": 44,
    "reb": 11,
    "ast": 11,
    "result": "L",
    "score": "130\u2013132",
    "venue": "Wells Fargo Center, Philadelphia",
    "category": "Regular Season",
    "milestone": "Highest-Scoring RS Triple-Double (44 pts)",
    "notes": "Official regular-season career-high scoring triple-double: 44 points, 11 rebounds, 11 assists."
  },
  {
    "id": "rtd-25",
    "date": "2018-12-15",
    "season": "2018-19",
    "year": 2018,
    "era": "lal",
    "team": "LAL",
    "opponent": "CHA",
    "opponentName": "Charlotte Hornets",
    "pts": 24,
    "reb": 12,
    "ast": 11,
    "result": "W",
    "score": "128\u2013100",
    "venue": "Spectrum Center, Charlotte",
    "category": "Regular Season",
    "milestone": "Dual Triple-Double with Lonzo Ball",
    "notes": "First Lakers teammates with triple-doubles in the same game since Magic Johnson and Kareem Abdul-Jabbar in 1982."
  },
  {
    "id": "rtd-26",
    "date": "2019-11-01",
    "season": "2019-20",
    "year": 2019,
    "era": "lal",
    "team": "LAL",
    "opponent": "DAL",
    "opponentName": "Dallas Mavericks",
    "pts": 39,
    "reb": 12,
    "ast": 16,
    "result": "W",
    "score": "119\u2013110 (OT)",
    "venue": "American Airlines Center, Dallas",
    "category": "Regular Season",
    "milestone": "Historic Duel with Luka Don\u010di\u0107",
    "notes": "First opposing players in NBA history with 30-10-15 triple-doubles in the same game (Luka had 31-13-15)."
  },
  {
    "id": "rtd-27",
    "date": "2019-11-03",
    "season": "2019-20",
    "year": 2019,
    "era": "lal",
    "team": "LAL",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "pts": 21,
    "reb": 11,
    "ast": 13,
    "result": "W",
    "score": "103\u201396",
    "venue": "AT&T Center, San Antonio",
    "category": "Regular Season",
    "milestone": "Back-to-Back Road Triple-Doubles",
    "notes": "Second straight triple-double during Lakers' 7-game road win streak."
  },
  {
    "id": "rtd-28",
    "date": "2019-11-05",
    "season": "2019-20",
    "year": 2019,
    "era": "lal",
    "team": "LAL",
    "opponent": "CHI",
    "opponentName": "Chicago Bulls",
    "pts": 30,
    "reb": 10,
    "ast": 11,
    "result": "W",
    "score": "118\u2013112",
    "venue": "United Center, Chicago",
    "category": "Regular Season",
    "milestone": "3rd Straight Triple-Double at Age 34",
    "notes": "First Laker with three straight triple-doubles since Magic Johnson in 1987."
  },
  {
    "id": "rtd-29",
    "date": "2019-11-19",
    "season": "2019-20",
    "year": 2019,
    "era": "lal",
    "team": "LAL",
    "opponent": "OKC",
    "opponentName": "Oklahoma City Thunder",
    "pts": 25,
    "reb": 11,
    "ast": 10,
    "result": "W",
    "score": "112\u2013107",
    "venue": "STAPLES Center, Los Angeles",
    "category": "Regular Season",
    "milestone": "First Player to Beat All 30 Franchises",
    "notes": "With this performance, LeBron became the first player in NBA history to record a triple-double against all 30 NBA franchises."
  },
  {
    "id": "rtd-30",
    "date": "2020-03-01",
    "season": "2019-20",
    "year": 2020,
    "era": "lal",
    "team": "LAL",
    "opponent": "NOP",
    "opponentName": "New Orleans Pelicans",
    "pts": 34,
    "reb": 12,
    "ast": 13,
    "result": "W",
    "score": "122\u2013114",
    "venue": "Smoothie King Center, New Orleans",
    "category": "Regular Season",
    "milestone": "Battle of Generations vs Zion",
    "notes": "Schooled rookie sensation Zion Williamson with deep 3-pointers and full-court outlet passes."
  },
  {
    "id": "rtd-31",
    "date": "2021-12-28",
    "season": "2021-22",
    "year": 2021,
    "era": "lal",
    "team": "LAL",
    "opponent": "HOU",
    "opponentName": "Houston Rockets",
    "pts": 32,
    "reb": 11,
    "ast": 11,
    "result": "W",
    "score": "132\u2013123",
    "venue": "Toyota Center, Houston",
    "category": "Regular Season",
    "milestone": "Starting Center Triple-Double",
    "notes": "Started at center for the first time in his career, producing 32-11-11."
  },
  {
    "id": "rtd-32",
    "date": "2022-03-21",
    "season": "2021-22",
    "year": 2022,
    "era": "lal",
    "team": "LAL",
    "opponent": "CLE",
    "opponentName": "Cleveland Cavaliers",
    "pts": 38,
    "reb": 11,
    "ast": 12,
    "result": "W",
    "score": "131\u2013120",
    "venue": "Rocket Mortgage FieldHouse, Cleveland",
    "category": "Regular Season",
    "milestone": "Homecoming Monster Line",
    "notes": "Vintage performance in Cleveland including a vicious poster dunk over former teammate Kevin Love."
  },
  {
    "id": "rtd-33",
    "date": "2023-01-31",
    "season": "2022-23",
    "year": 2023,
    "era": "lal",
    "team": "LAL",
    "opponent": "NYK",
    "opponentName": "New York Knicks",
    "pts": 28,
    "reb": 10,
    "ast": 11,
    "result": "W",
    "score": "129\u2013123 (OT)",
    "venue": "Madison Square Garden, New York",
    "category": "Regular Season",
    "milestone": "Year 20 Triple-Double at MSG",
    "notes": "First player in NBA history to record a triple-double in his 20th season; moved into 4th all-time in career assists."
  },
  {
    "id": "rtd-34",
    "date": "2024-01-27",
    "season": "2023-24",
    "year": 2024,
    "era": "lal",
    "team": "LAL",
    "opponent": "GSW",
    "opponentName": "Golden State Warriors",
    "pts": 36,
    "reb": 20,
    "ast": 12,
    "result": "W",
    "score": "145\u2013144 (2OT)",
    "venue": "Chase Center, San Francisco",
    "category": "Regular Season",
    "milestone": "Career-High 20 Rebounds at Age 39",
    "notes": "Oldest player in NBA history with a 30-20-10 game; sank winning free throws with 1.2s left in double-overtime."
  },
  {
    "id": "rtd-35",
    "date": "2024-03-26",
    "season": "2023-24",
    "year": 2024,
    "era": "lal",
    "team": "LAL",
    "opponent": "MIL",
    "opponentName": "Milwaukee Bucks",
    "pts": 29,
    "reb": 10,
    "ast": 16,
    "result": "W",
    "score": "128\u2013124 (2OT)",
    "venue": "Fiserv Forum, Milwaukee",
    "category": "Regular Season",
    "milestone": "52 Minutes in Double-OT without AD",
    "notes": "Played 52 grueling minutes in Milwaukee without Anthony Davis, engineering 19-point 4th-quarter comeback."
  },
  {
    "id": "rtd-36",
    "date": "2024-10-26",
    "season": "2024-25",
    "year": 2024,
    "era": "lal",
    "team": "LAL",
    "opponent": "SAC",
    "opponentName": "Sacramento Kings",
    "pts": 32,
    "reb": 14,
    "ast": 10,
    "result": "W",
    "score": "131\u2013127",
    "venue": "Crypto.com Arena, Los Angeles",
    "category": "Regular Season",
    "milestone": "16-Point 4th Quarter Flurry",
    "notes": "Scored 16 points on 6-of-6 shooting in less than three minutes to start the 4th quarter to remain undefeated."
  },
  {
    "id": "rtd-37",
    "date": "2024-11-13",
    "season": "2024-25",
    "year": 2024,
    "era": "lal",
    "team": "LAL",
    "opponent": "MEM",
    "opponentName": "Memphis Grizzlies",
    "pts": 35,
    "reb": 12,
    "ast": 14,
    "result": "W",
    "score": "128\u2013123",
    "venue": "Crypto.com Arena, Los Angeles",
    "category": "Regular Season",
    "milestone": "3rd Straight Triple-Double at Age 39",
    "notes": "Recorded his third consecutive triple-double, the oldest player in league history to achieve a 3-game streak."
  },
  {
    "id": "rtd-38",
    "date": "2024-11-15",
    "season": "2024-25",
    "year": 2024,
    "era": "lal",
    "team": "LAL",
    "opponent": "SAS",
    "opponentName": "San Antonio Spurs",
    "pts": 15,
    "reb": 16,
    "ast": 12,
    "result": "W",
    "score": "120\u2013115",
    "venue": "Frost Bank Center, San Antonio",
    "category": "Regular Season",
    "milestone": "Career-First 4 Straight Triple-Doubles",
    "notes": "First time in his 22-year NBA career recording four consecutive triple-doubles."
  },
  {
    "id": "rtd-39",
    "date": "2026-02-12",
    "season": "2025-26",
    "year": 2026,
    "era": "lal",
    "team": "LAL",
    "opponent": "DAL",
    "opponentName": "Dallas Mavericks",
    "pts": 28,
    "reb": 10,
    "ast": 12,
    "result": "W",
    "score": "116\u2013110",
    "venue": "Crypto.com Arena, Los Angeles",
    "category": "Regular Season",
    "milestone": "Oldest in NBA History (Age 41)",
    "notes": "Became the oldest player in NBA history to record a triple-double (41 years, 44 days), capping 125 regular-season triple-doubles."
  }
] as const;

export const TRIPLE_DOUBLE_SUMMARY: TripleDoubleSummary = {
  "careerTotal": 153,
  "regularSeasonTotal": 125,
  "playoffTotal": 28,
  "finalsTotal": 11,
  "allThirtyFranchisesBeaten": true,
  "franchisesConqueredDate": "November 19, 2019 vs OKC",
  "highestScoringRegularSeason": {
    "pts": 44,
    "reb": 11,
    "ast": 11,
    "opp": "PHI",
    "date": "2018-04-06"
  },
  "highestScoringPlayoffs": {
    "pts": 42,
    "reb": 10,
    "ast": 12,
    "opp": "BOS",
    "date": "2018-05-15"
  },
  "highestRebounds": {
    "pts": 36,
    "reb": 20,
    "ast": 12,
    "opp": "GSW",
    "date": "2024-01-27"
  },
  "highestAssists": {
    "pts": 22,
    "reb": 12,
    "ast": 19,
    "opp": "ATL",
    "date": "2018-02-09"
  },
  "oldestAge": "41 years, 44 days (2026-02-12 vs DAL)",
  "youngestAge": "20 years, 20 days (2005-01-19 vs POR)"
} as const;
