/* ---------------------------------------------------------------------------
 * THE HEAT MAP — Shot zones and scoring evolution across eras
 * ------------------------------------------------------------------------- */

export interface ShotZoneData {
  id: string;
  name: string;
  area: string;
  fgPct: number;
  leagueAvg: number;
  frequency: number; // percentage of total shot diet
  signatureMoment: string;
}

/**
 * One career era's shot profile.
 *
 * `ppg` / `fgPct` / `threePtPct` / `ftPct` are the era's ATTEMPTS-WEIGHTED aggregates
 * across every season named by `period` — not a peak season and not a simple mean of
 * the seasonal rates. That distinction is load-bearing: `2011-12` was a 62-game
 * season, so a simple mean of Miami's four seasonal FG% rates reads ~54.3% by
 * coincidence while the true weighted figure is also 54.3%; but for most eras the
 * two methods disagree by several tenths, and the unweighted one is the wrong number.
 *
 * Verified 2026-09-26 against Basketball Reference season totals (see the
 * `SHOT_ZONES.eras` block below for the per-era game counts). These are aggregates,
 * so the UI must label them as such wherever a single-season peak appears beside
 * them — see F-04 in DESIGN-AUDIT.md.
 */
export interface EraShotData {
  id: string;
  name: string;
  period: string;
  team: string;
  tagline: string;
  narrative: string;
  /** Games played across the era. Attempts-weighted, so this is the denominator. */
  games: number;
  ppg: number;
  fgPct: number;
  threePtPct: number;
  ftPct: number;
  primaryColor: string;
  zones: Record<string, ShotZoneData>;
}

export const SHOT_ZONES: {
  heading: string;
  subheading: string;
  copy: string;
  eras: readonly EraShotData[];
} = {
  heading: "The Heat Map",
  subheading: "Spatial evolution of an unstoppable scoring engine.",
  copy: "From young downhill freight train in 2003 to hyper-efficient paint powerhouse in Miami, and late-career logo maestro in Los Angeles. Select an era and tap any floor sector to inspect exact shooting splits and iconic moments.",
  eras: [
    {
      id: "cle1",
      name: "Young Cleveland",
      period: "2003–2010",
      team: "Cleveland Cavaliers",
      tagline: "Downhill Force",
      narrative:
        "The fastest open-floor athlete in basketball history. Opposing defenses routinely built three-man walls in the paint, yet he still converted over 71% of rim attempts while developing his outside jumper.",
      // 2003-04 … 2009-10, seven seasons, 548 games. The old `ftPct: 73.3` was
      // Cleveland's ELEVEN-year figure (both stints, 849 games) pasted into the
      // first stint; the correct seven-season figure is 74.2. cle1 + cle2
      // reconciles to 73.3 over 849 games, which is what exposed it.
      games: 548,
      ppg: 27.8,
      fgPct: 47.5,
      threePtPct: 32.9,
      ftPct: 74.2,
      primaryColor: "#5C1626",
      zones: {
        restricted: {
          id: "restricted",
          name: "Restricted Area",
          area: "0–4 ft",
          fgPct: 71.4,
          leagueAvg: 60.5,
          frequency: 38.5,
          signatureMoment:
            "Over 700 dunks in seven seasons, shattering rim protection with tomahawk slams.",
        },
        paint: {
          id: "paint",
          name: "In the Paint (Non-RA)",
          area: "4–14 ft",
          fgPct: 40.2,
          leagueAvg: 38.1,
          frequency: 14.6,
          signatureMoment:
            "Two-foot power gather runners and running hooks through heavy contact.",
        },
        "mid-left": {
          id: "mid-left",
          name: "Mid-Range Left",
          area: "14–22 ft",
          fgPct: 36.8,
          leagueAvg: 38.8,
          frequency: 11.2,
          signatureMoment:
            "Developing baseline turnaround over sagged off perimeter defenders.",
        },
        "mid-center": {
          id: "mid-center",
          name: "Mid-Range Center",
          area: "14–22 ft",
          fgPct: 39.1,
          leagueAvg: 39.4,
          frequency: 10.8,
          signatureMoment:
            "High pick-and-roll pull-ups from the free throw line against drop coverage.",
        },
        "mid-right": {
          id: "mid-right",
          name: "Mid-Range Right",
          area: "14–22 ft",
          fgPct: 37.4,
          leagueAvg: 38.5,
          frequency: 11.0,
          signatureMoment:
            "Right elbow isolation bank shots off glass from sixteen feet.",
        },
        "corner-3-l": {
          id: "corner-3-l",
          name: "Left Corner 3",
          area: "22 ft",
          fgPct: 36.2,
          leagueAvg: 37.2,
          frequency: 2.2,
          signatureMoment:
            "Weakside catch-and-shoot spot ups punishing collapsed defenses.",
        },
        "corner-3-r": {
          id: "corner-3-r",
          name: "Right Corner 3",
          area: "22 ft",
          fgPct: 35.8,
          leagueAvg: 36.8,
          frequency: 2.0,
          signatureMoment:
            "Baseline drive kickouts fed back for corner rhythm releases.",
        },
        "above-break-3": {
          id: "above-break-3",
          name: "Above the Break 3",
          area: "24–28 ft",
          fgPct: 32.1,
          leagueAvg: 34.8,
          frequency: 8.5,
          signatureMoment:
            "Game 5, 2007 Eastern Conference Finals: 25 straight points to conquer Detroit.",
        },
        "deep-3": {
          id: "deep-3",
          name: "Deep / Logo Range",
          area: "28+ ft",
          fgPct: 26.5,
          leagueAvg: 23.0,
          frequency: 0.8,
          signatureMoment:
            "Shot-clock buzzer heaves and early career heat-check launches.",
        },
      },
    },
    {
      id: "mia",
      name: "Miami Peak",
      period: "2010–2014",
      team: "Miami Heat",
      tagline: "Hyper-Efficient Apex",
      narrative:
        "Reconstructed his shot selection inside Erik Spoelstra's space-and-pace offense. Eliminated bad mid-range shots, mastered post footwork, and peaked at a staggering 56.5% FG and 40.6% 3PT in 2012-13.",
      // 2010-11 … 2013-14, four seasons, 294 games. These four figures are
      // confirmed against Basketball Reference's own MIA 4-year row (.543 /
      // .369 / .758 / 26.9) and were already correct — the Miami panel's
      // "contradiction" is a missing qualifier, not a bad number. The narrative's
      // 2012-13 peak of 56.5% FG / 40.6% 3PT is also exact.
      games: 294,
      ppg: 26.9,
      fgPct: 54.3,
      threePtPct: 36.9,
      ftPct: 75.8,
      primaryColor: "#7A1810",
      zones: {
        restricted: {
          id: "restricted",
          name: "Restricted Area",
          area: "0–4 ft",
          fgPct: 77.2,
          leagueAvg: 61.2,
          frequency: 37.5,
          signatureMoment:
            "Historic rim efficiency: converted 79.6% at the basket in 2012-13 with unstoppable cuts.",
        },
        paint: {
          id: "paint",
          name: "In the Paint (Non-RA)",
          area: "4–14 ft",
          fgPct: 46.8,
          leagueAvg: 39.0,
          frequency: 17.2,
          signatureMoment:
            "Post-up masterclass: Olajuwon-inspired drop-steps and baseline turnarounds.",
        },
        "mid-left": {
          id: "mid-left",
          name: "Mid-Range Left",
          area: "14–22 ft",
          fgPct: 43.1,
          leagueAvg: 39.5,
          frequency: 9.8,
          signatureMoment:
            "Left post fadeaway jumpers with elevated release points over wings.",
        },
        "mid-center": {
          id: "mid-center",
          name: "Mid-Range Center",
          area: "14–22 ft",
          fgPct: 44.5,
          leagueAvg: 40.1,
          frequency: 11.2,
          signatureMoment:
            "High-low pick-and-pop actions and calibrated free-throw line jumpers.",
        },
        "mid-right": {
          id: "mid-right",
          name: "Mid-Range Right",
          area: "14–22 ft",
          fgPct: 45.2,
          leagueAvg: 39.2,
          frequency: 10.4,
          signatureMoment:
            "Game 7, 2013 NBA Finals: 19-foot pull-up dagger over Kawhi Leonard with 27.9s left.",
        },
        "corner-3-l": {
          id: "corner-3-l",
          name: "Left Corner 3",
          area: "22 ft",
          fgPct: 41.5,
          leagueAvg: 38.5,
          frequency: 3.2,
          signatureMoment:
            "Spacing the floor for Dwyane Wade slashes with lethal corner marksmanship.",
        },
        "corner-3-r": {
          id: "corner-3-r",
          name: "Right Corner 3",
          area: "22 ft",
          fgPct: 40.2,
          leagueAvg: 37.9,
          frequency: 2.8,
          signatureMoment:
            "Corner pin-downs and weakside ball movement finishes.",
        },
        "above-break-3": {
          id: "above-break-3",
          name: "Above the Break 3",
          area: "24–28 ft",
          fgPct: 36.4,
          leagueAvg: 35.1,
          frequency: 6.7,
          signatureMoment:
            "Surgical pull-up shooting when defenders backed into drop coverage.",
        },
        "deep-3": {
          id: "deep-3",
          name: "Deep / Logo Range",
          area: "28+ ft",
          fgPct: 33.3,
          leagueAvg: 25.4,
          frequency: 1.2,
          signatureMoment:
            "Uncontested transition pull-ups during the historic 27-game win streak.",
        },
      },
    },
    {
      id: "cle2",
      name: "The Return",
      period: "2014–2018",
      team: "Cleveland Cavaliers",
      tagline: "Total Command",
      narrative:
        "The complete maestro. Carried four straight Finals teams with masterful shot creation, combining physical downhill brute with impossible buzzer-beating fadeaways and clutch playoff heroics.",
      // 2014-15 … 2017-18, four seasons, 301 games. `ftPct` was 70.8; the
      // attempts-weighted figure is 71.1.
      games: 301,
      ppg: 26.1,
      fgPct: 52.6,
      threePtPct: 35.1,
      ftPct: 71.1,
      primaryColor: "#5C1626",
      zones: {
        restricted: {
          id: "restricted",
          name: "Restricted Area",
          area: "0–4 ft",
          fgPct: 74.8,
          leagueAvg: 62.4,
          frequency: 36.2,
          signatureMoment:
            "2016 Finals scoring explosion, dropping 41 back-to-back in Games 5 and 6.",
        },
        paint: {
          id: "paint",
          name: "In the Paint (Non-RA)",
          area: "4–14 ft",
          fgPct: 43.8,
          leagueAvg: 40.5,
          frequency: 16.5,
          signatureMoment:
            "Wrong-foot running floaters and power pivots through rim defenders.",
        },
        "mid-left": {
          id: "mid-left",
          name: "Mid-Range Left",
          area: "14–22 ft",
          fgPct: 41.2,
          leagueAvg: 40.0,
          frequency: 9.4,
          signatureMoment:
            "Game 3 vs Raptors (2018): Full-court sprint to one-handed bank-shot buzzer-beater.",
        },
        "mid-center": {
          id: "mid-center",
          name: "Mid-Range Center",
          area: "14–22 ft",
          fgPct: 42.6,
          leagueAvg: 40.8,
          frequency: 10.5,
          signatureMoment:
            "Decisive pull-ups orchestrating the high pick-and-roll with Tristan Thompson.",
        },
        "mid-right": {
          id: "mid-right",
          name: "Mid-Range Right",
          area: "14–22 ft",
          fgPct: 42.0,
          leagueAvg: 39.8,
          frequency: 10.0,
          signatureMoment:
            "Post fadeaway clinic over Toronto and Boston in the 2018 playoffs.",
        },
        "corner-3-l": {
          id: "corner-3-l",
          name: "Left Corner 3",
          area: "22 ft",
          fgPct: 38.5,
          leagueAvg: 38.9,
          frequency: 2.8,
          signatureMoment:
            "Corner spot-up kickouts off Kyrie Irving dribble penetrations.",
        },
        "corner-3-r": {
          id: "corner-3-r",
          name: "Right Corner 3",
          area: "22 ft",
          fgPct: 37.8,
          leagueAvg: 38.4,
          frequency: 2.5,
          signatureMoment:
            "Baseline corner release puncturing playoff defensive schemes.",
        },
        "above-break-3": {
          id: "above-break-3",
          name: "Above the Break 3",
          area: "24–28 ft",
          fgPct: 34.8,
          leagueAvg: 35.4,
          frequency: 10.4,
          signatureMoment:
            "Game 4 buzzer-beater over Jimmy Butler in Chicago from the left wing.",
        },
        "deep-3": {
          id: "deep-3",
          name: "Deep / Logo Range",
          area: "28+ ft",
          fgPct: 32.4,
          leagueAvg: 26.8,
          frequency: 1.7,
          signatureMoment:
            "30-foot pull-up bombs in the 2018 postseason solo carrying clinic.",
        },
      },
    },
    {
      id: "lal",
      name: "Lakers & 40K",
      period: "2018–2026",
      team: "Los Angeles Lakers",
      tagline: "Logo Maestro",
      narrative:
        "Modernized his profile in his late 30s and age 40 season. Embraced heavy three-point volume with high-arcing step-backs and logo range while sustaining extraordinary rim frequency.",
      // 2018-19 … 2025-26, eight seasons, 479 games. Three figures were stale:
      // 51.8 → 51.3 FG%, 35.8 → 35.6 3P%, 74.5 → 73.0 FT%. Confirmed against
      // Basketball Reference's LAL 8-year row (.513 / .356 / .730 / 25.9).
      games: 479,
      ppg: 25.9,
      fgPct: 51.3,
      threePtPct: 35.6,
      ftPct: 73.0,
      primaryColor: "#3B2352",
      zones: {
        restricted: {
          id: "restricted",
          name: "Restricted Area",
          area: "0–4 ft",
          fgPct: 76.1,
          leagueAvg: 64.1,
          frequency: 32.8,
          signatureMoment:
            "Fastbreak dunks and crafty reverse layups continuing into Season 22 and 23.",
        },
        paint: {
          id: "paint",
          name: "In the Paint (Non-RA)",
          area: "4–14 ft",
          fgPct: 44.5,
          leagueAvg: 42.1,
          frequency: 14.2,
          signatureMoment:
            "Mastery of deceleration: patient pivots, up-and-unders, and touch push shots.",
        },
        "mid-left": {
          id: "mid-left",
          name: "Mid-Range Left",
          area: "14–22 ft",
          fgPct: 41.5,
          leagueAvg: 41.0,
          frequency: 8.4,
          signatureMoment:
            "Feb 7, 2023: The iconic turnaround fadeaway over Kenrich Williams to pass Kareem.",
        },
        "mid-center": {
          id: "mid-center",
          name: "Mid-Range Center",
          area: "14–22 ft",
          fgPct: 42.1,
          leagueAvg: 41.5,
          frequency: 9.2,
          signatureMoment:
            "Top-of-key touch shots and high elbow playmaking hub.",
        },
        "mid-right": {
          id: "mid-right",
          name: "Mid-Range Right",
          area: "14–22 ft",
          fgPct: 41.8,
          leagueAvg: 41.2,
          frequency: 8.6,
          signatureMoment:
            "Right baseline turnaround jumpers defying the aging curve.",
        },
        "corner-3-l": {
          id: "corner-3-l",
          name: "Left Corner 3",
          area: "22 ft",
          fgPct: 39.2,
          leagueAvg: 39.1,
          frequency: 3.4,
          signatureMoment:
            "Spot-up rhythm releases generated by Anthony Davis inside kickouts.",
        },
        "corner-3-r": {
          id: "corner-3-r",
          name: "Right Corner 3",
          area: "22 ft",
          fgPct: 41.4,
          leagueAvg: 39.0,
          frequency: 3.8,
          signatureMoment:
            "Career-high corner accuracy, hitting 41.0% overall from three in 2023-24.",
        },
        "above-break-3": {
          id: "above-break-3",
          name: "Above the Break 3",
          area: "24–28 ft",
          fgPct: 36.5,
          leagueAvg: 35.8,
          frequency: 16.2,
          signatureMoment:
            "The trademark left-wing side-step 3-pointer that became his modern weapon.",
        },
        "deep-3": {
          id: "deep-3",
          name: "Deep / Logo Range",
          area: "28+ ft",
          fgPct: 35.2,
          leagueAvg: 28.1,
          frequency: 3.4,
          signatureMoment:
            "32-foot logo pull-ups at Crypto.com Arena, becoming the first player to 40,000 pts.",
        },
      },
    },
  ],
};
