import test from "node:test";
import assert from "node:assert";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  SEASONS,
  SECTIONS,
  NEXT_MARK,
  CAREER,
  LEDGER,
  REGULAR_SEASON_POINTS,
  THE_BLOCK,
  TRIPLE_DOUBLES,
  TRIPLE_DOUBLE_SUMMARY,
} from "@/lib/data";
import {
  getBuzzerBeaters,
  getFranchiseBreakdown,
  getPlayoffSeries,
  getTripleDoubles,
} from "./helpers/test-loader";

test("smoke test - imports lib/data via the path alias", () => {
  assert.strictEqual(SEASONS.length, 23);
  assert.ok(SECTIONS.length > 0);
});

/**
 * The test resolver derived the project root from the PROCESS's working
 * directory (`path.resolve(".")`). `npm test` runs from the package root, so it
 * worked — and running the suite from anywhere else failed to resolve
 * `@/lib/data`, which reads as a broken suite rather than a broken
 * resolver.
 *
 * This spawns a child from the OS temp directory and imports the alias there. It
 * is the only assertion in the suite that can fail for a reason that has nothing
 * to do with the data, which is the point: the previous behaviour was invisible to
 * every other test, because they all ran from the one directory where it worked.
 */
test("smoke test - the test resolver does not depend on the working directory", () => {
  const register = pathToFileURL(join(import.meta.dirname, "register.mjs")).href;
  const child = spawnSync(
    process.execPath,
    [
      "--import",
      register,
      "--input-type=module",
      "-e",
      'import { SEASONS, SECTIONS } from "@/lib/data";' +
        "console.log(SEASONS.length + ':' + SECTIONS.length);",
    ],
    { cwd: tmpdir(), encoding: "utf8" },
  );

  assert.strictEqual(
    child.status,
    0,
    `importing the "@/" alias failed from ${tmpdir()}, so the resolver still ` +
      `depends on the working directory. stderr: ${child.stderr.trim()}`,
  );
  assert.strictEqual(
    child.stdout.trim(),
    "23:13",
    `the alias resolved to the wrong module from ${tmpdir()}: ` +
      `${child.stdout.trim()}`,
  );
});

/**
 * The 50,000-point panel shipped a contradiction that every gate passed: it read
 * "The measure that is still open" and "Nobody has been near it" at 86.9%, while
 * `CAREER.playoffs.copy` stated the combined total as 51,961 — on the same page,
 * two sections apart, 1,961 past the mark it called open. The cause was a
 * definition mismatch rather than a stale digit: `current` was the
 * regular-season total and the 50,000 mark is a combined figure.
 *
 * These assert the three things that made the contradiction possible, so it
 * cannot come back by editing one string.
 */
test("smoke test - NEXT_MARK measures one definition, and admits the mark is closed", () => {
  const regularSeason = CAREER.headline.find((h) => h.label === "Points");
  assert.ok(regularSeason, "CAREER.headline must carry a Points row");

  // 1. `current` is the COMBINED total, and equals the two components the page
  //    already publishes. Previously it was regular-season only.
  assert.strictEqual(
    NEXT_MARK.current,
    regularSeason.total + CAREER.playoffs.points,
    `NEXT_MARK.current (${NEXT_MARK.current}) must be the regular-season total ` +
      `plus the playoff total (${regularSeason.total} + ${CAREER.playoffs.points}). ` +
      `The 50,000 mark is a COMBINED figure; measuring a regular-season-only ` +
      `number against it is the bug this test exists to prevent.`,
  );

  // 2. The label is the number, formatted from it, so the two cannot disagree.
  assert.strictEqual(
    NEXT_MARK.currentLabel,
    NEXT_MARK.current.toLocaleString("en-US"),
    "NEXT_MARK.currentLabel must be derived from NEXT_MARK.current",
  );

  // 3. The prose may not describe a mark as open that the numbers say is passed.
  //    This is the assertion that would have caught the original defect on its
  //    own, without needing to know what the right target should have been.
  const claimsOpen = /still open|nobody has been near|not a prediction/i;
  const text = `${NEXT_MARK.heading} ${NEXT_MARK.note}`;
  if (NEXT_MARK.current >= NEXT_MARK.target) {
    assert.ok(
      !claimsOpen.test(text),
      `NEXT_MARK.current (${NEXT_MARK.current}) is at or past its target ` +
        `(${NEXT_MARK.target}), so the copy must not describe it as open or ` +
        `unapproached. Found: ${JSON.stringify(text)}`,
    );
  }
});

/**
 * THE BLOCK presented three separately-measured figures as one reconciled set.
 * 88 ft over 2.8 s is a 21.4 mph AVERAGE, and the tile beside it read "Peak
 * sprint speed 20.1 mph" — an average above the peak, which is impossible. The
 * comment in the data module had already rejected an earlier value ("93 ft") for
 * exactly this reasoning and then accepted 88 ft, which commits the same
 * violation one point smaller.
 *
 * Both figures are sourced, so neither can change. What can be enforced is that
 * the copy says so: if the distance or the duration is ever edited, the derived
 * average moves and the sentence has to move with it.
 */
test("smoke test - THE BLOCK states the average its own distance and time imply", () => {
  const stat = (label: string) => {
    const row = THE_BLOCK.stats.find((s) => s.label === label);
    assert.ok(row, `THE_BLOCK.stats is missing "${label}"`);
    return row.value;
  };

  const feet = Number(stat("Chase distance").replace(/[^\d.]/g, ""));
  const seconds = Number(stat("Time to glass").replace(/[^\d.]/g, ""));
  assert.ok(feet > 0 && seconds > 0, "both figures must parse");

  // 1 mph = 1.46667 ft/s
  const averageMph = (feet / seconds / 1.46667).toFixed(1);
  assert.strictEqual(
    feet / seconds / 1.46667 > Number(averageMph),
    true,
    "rounding sanity: the average must be at or above its own truncation",
  );
  assert.ok(
    THE_BLOCK.copy.includes(`${averageMph} mph`),
    `88 ft over 2.8 s works out at ${averageMph} mph, and THE_BLOCK.copy must ` +
      `state that figure. It is higher than the 20.1 mph peak tile beside it, ` +
      `which is the whole point: the two are measured over different windows and ` +
      `the copy has to say so rather than leaving a reader to divide. Current ` +
      `copy: ${JSON.stringify(THE_BLOCK.copy)}`,
  );

  // The unsourced per-keyframe speeds are gone, so the scrubber cannot print a
  // speed that contradicts its own distances. Asserted on the rendered data
  // rather than the type, because a type says nothing about a runtime value.
  for (const k of THE_BLOCK.keyframes) {
    assert.ok(
      !("speed" in k.telemetry),
      `keyframe at t=${k.time} still carries a speed (${JSON.stringify(k.telemetry)}). ` +
        `No source reports a speed at those instants, and every segment's ` +
        `distance implied an average faster than both its own endpoints.`,
    );
  }
});

/**
 * The test helper probes several speculative export names and silently
 * substitutes `tests/fixtures/authoritative-data.ts` when none of them match.
 * That fallback is a genuine hazard: the fixture is a DIFFERENT dataset (its
 * `REGULAR_SEASON_TRIPLE_DOUBLES` holds 39 entries against the live 125,
 * describing entirely different games under the same ids), so a green suite
 * could be validating data the site never renders.
 *
 * Each getter already computes an `isLive` flag. Nothing asserted on it, so
 * the guard existed and was simply unused. These assertions are what make the
 * fallback loud instead of silent.
 */
test("smoke test - every dataset resolves to the live module, not the fixture", () => {
  assert.ok(
    getPlayoffSeries().isLive,
    "PLAYOFF_SERIES did not resolve from lib/data; the suite is testing the fixture",
  );
  assert.ok(
    getBuzzerBeaters().isLive,
    "CLUTCH_BUZZER_BEATERS did not resolve from lib/data; the suite is testing the fixture",
  );
  assert.ok(
    getTripleDoubles().isLive,
    "the triple-double datasets did not resolve from lib/data; the suite is testing the fixture",
  );
  assert.ok(
    getFranchiseBreakdown().isLive,
    "FRANCHISE_BREAKDOWN did not resolve from lib/data; the suite is testing the fixture",
  );
});

/**
 * Guards the invariants the UI now derives rather than hardcodes. Each of
 * these was a literal in a component at some point and drifted from the data.
 */
test("smoke test - derived UI figures reconcile with the data module", () => {
  const { data: series } = getPlayoffSeries();

  // The playoff-matrix game-record tile used to read a hardcoded 182-120.
  const gamesWon = series.reduce((a, s) => a + s.wins, 0);
  const gamesLost = series.reduce((a, s) => a + s.losses, 0);
  const games = series.reduce((a, s) => a + s.games, 0);
  assert.strictEqual(games, gamesWon + gamesLost, "games must equal wins + losses");
  assert.strictEqual(games, 302, "career playoff games");
  assert.strictEqual(gamesWon, 188, "career playoff game wins");
  assert.strictEqual(gamesLost, 114, "career playoff game losses");

  // The All-Time Series tile.
  const wins = series.filter((s) => s.result === "W").length;
  const losses = series.filter((s) => s.result === "L").length;
  assert.strictEqual(series.length, 57, "career playoff series");
  assert.strictEqual(wins, 42);
  assert.strictEqual(losses, 15);

  // The Playoff Scoring tile.
  const points = series.reduce(
    (a, s) => a + (s.boxScoreTotals?.pts ?? s.lebronStats.totalPoints),
    0,
  );
  assert.strictEqual(points, 8521, "career playoff points");

  // The Sweeps Mastery tile.
  assert.strictEqual(series.filter((s) => s.isSweep && s.result === "W").length, 12);
  assert.strictEqual(series.filter((s) => s.isSweep && s.result === "L").length, 4);

  // Every series score and game total must be internally consistent.
  for (const s of series) {
    assert.strictEqual(s.games, s.wins + s.losses, `${s.id}: games != wins + losses`);
    assert.strictEqual(s.isSweep, s.games === 4, `${s.id}: isSweep disagrees with games`);
  }
});

/**
 * `the-ledger.tsx` prints "the career total exactly" over the four stint
 * segments, and `LEDGER_INTRO.copy` makes the same claim. Nothing asserted it:
 * the ledger was pinned by export name only, so a stint total could have been
 * edited to any value without a gate going red. The four `scored` figures are
 * the ones the component sums into `TOTAL`.
 */
test("smoke test - the four ledger stints sum to the career point total", () => {
  const stints = LEDGER.filter(
    (e): e is typeof e & { scored: number } => e.scored !== null,
  );
  assert.strictEqual(stints.length, 4, "expected four NBA stints in the ledger");
  const sum = stints.reduce((a, e) => a + e.scored, 0);
  assert.strictEqual(
    sum,
    REGULAR_SEASON_POINTS,
    `the ledger stints sum to ${sum}, but the career regular-season total is ` +
      `${REGULAR_SEASON_POINTS}. The component promises the four add up to the ` +
      `career number exactly; if a stint was edited, the other three or the ` +
      `career total must move with it.`,
  );
});

/**
 * Shot-zone volumes are presented to the reader as "share of all shots
 * taken", so the nine zones of an era must partition 100%. One era summed to
 * 102.0.
 */
test("smoke test - every era's shot-zone volumes sum to 100%", async () => {
  const { SHOT_ZONES } = await import("@/lib/data");
  for (const era of SHOT_ZONES.eras) {
    const values = Object.values(era.zones).map((z) => z.frequency);
    assert.strictEqual(values.length, 9, `${era.id}: expected 9 zones`);
    const sum = values.reduce((a, b) => a + b, 0);
    // Nine values rounded to one decimal can carry up to +/-0.45 of
    // accumulated rounding error.
    assert.ok(
      Math.abs(sum - 100) <= 0.5,
      `${era.id}: zone volumes sum to ${sum.toFixed(1)}, expected 100 +/- 0.5`,
    );
  }
});

/**
 * The era headline figures are ATTEMPTS-WEIGHTED aggregates over the seasons each
 * era's `period` names — not peaks, not simple means of the seasonal rates.
 *
 * These were wrong in five places and were verified against Basketball Reference
 * season totals on 2026-09-26 (see DESIGN-AUDIT.md F-04). Recorded here so a
 * later pass cannot "tidy" a verified figure back to a stale one — the exact
 * failure issue #28 was opened to prevent.
 *
 *   cle1  2003-04…2009-10  548 G   .475 / .329 / .742
 *   mia   2010-11…2013-14  294 G   .543 / .369 / .758
 *   cle2  2014-15…2017-18  301 G   .526 / .351 / .711
 *   lal   2018-19…2025-26  479 G   .513 / .356 / .730
 *
 * The cross-check that exposed the originals: cle1 + cle2 must reconcile to
 * Basketball Reference's own CLE 11-year row — 849 games, .492 / .337 / .733.
 */
test("smoke test - era aggregates match the verified Basketball Reference figures", async () => {
  const { SHOT_ZONES } = await import("@/lib/data");

  const expected = {
    cle1: { games: 548, ppg: 27.8, fgPct: 47.5, threePtPct: 32.9, ftPct: 74.2 },
    mia: { games: 294, ppg: 26.9, fgPct: 54.3, threePtPct: 36.9, ftPct: 75.8 },
    cle2: { games: 301, ppg: 26.1, fgPct: 52.6, threePtPct: 35.1, ftPct: 71.1 },
    lal: { games: 479, ppg: 25.9, fgPct: 51.3, threePtPct: 35.6, ftPct: 73.0 },
  } as const;

  assert.strictEqual(
    SHOT_ZONES.eras.length,
    Object.keys(expected).length,
    "an era was added or removed without updating the verified figures",
  );

  for (const era of SHOT_ZONES.eras) {
    const want = expected[era.id as keyof typeof expected];
    assert.ok(want, `${era.id}: no verified figures recorded for this era`);
    for (const key of ["games", "ppg", "fgPct", "threePtPct", "ftPct"] as const) {
      assert.strictEqual(
        era[key],
        want[key],
        `${era.id}.${key} is ${era[key]}, verified value is ${want[key]} — ` +
          `see DESIGN-AUDIT.md F-04 before changing it`,
      );
    }
  }

  // The reconciliation that caught the originals: both Cleveland stints together
  // must reproduce the 11-year Cleveland row. Game counts are exact integers, so
  // this fails loudly if an era's window is quietly edited.
  const cle = SHOT_ZONES.eras.filter((e) => e.id === "cle1" || e.id === "cle2");
  assert.strictEqual(
    cle.reduce((a, e) => a + e.games, 0),
    849,
    "cle1 + cle2 must total Cleveland's 849 games",
  );
});

/**
 * `TRIPLE_DOUBLE_SUMMARY.oldestAge` and `.youngestAge` are hand-typed strings
 * beside the array they summarise, which is exactly the shape that rots:
 * `oldestAge` named rtd-123 at 41 years and 44 days while the same array holds
 * rtd-124 and rtd-125, the last of them 46 days older. Nothing failed, because
 * no gate compared a summary field to the rows it claims to summarise.
 *
 * The birth date is not in the module, so this recovers it from the claim the
 * module already makes and which is independently known — rtd-1 on 2005-01-19
 * is "20 years, 20 days" — and then checks BOTH ends of the array against it. No
 * date is typed here, so the test cannot be satisfied by editing this file to
 * match a wrong summary.
 */
test("smoke test - the triple-double age summary matches the array it summarises", () => {
  const young = TRIPLE_DOUBLE_SUMMARY.youngestAge;
  const m = young.match(/^(\d+) years, (\d+) days \((\d{4}-\d{2}-\d{2}) vs /);
  assert.ok(
    m,
    `youngestAge is not in the "N years, D days (date vs OPP)" form the summary ` +
      `and the array share: ${young}. Without that shape the birth date cannot be ` +
      `recovered, and this test would be asserting a hardcoded date instead.`,
  );

  // Walk backwards from the summary's own youngest claim: N years and D days
  // before that game, on the module's convention that D counts from the most
  // recent 30 December.
  const youngAt = Date.parse(`${m[3]}T00:00:00Z`);
  const bday = new Date(youngAt);
  bday.setUTCDate(bday.getUTCDate() - +m[2]);
  bday.setUTCFullYear(bday.getUTCFullYear() - +m[1]);
  const BIRTH = Date.UTC(bday.getUTCFullYear(), bday.getUTCMonth(), bday.getUTCDate());

  /** "N years, D days" for a game date, on the module's convention. */
  const ageOf = (iso: string) => {
    const t = Date.parse(`${iso}T00:00:00Z`);
    const y = +iso.slice(0, 4);
    const dec30 = Date.UTC(y, 11, 30);
    const sinceBday = t >= dec30 ? dec30 : Date.UTC(y - 1, 11, 30);
    const years = Math.floor((t - BIRTH) / 31557600000);
    return `${years} years, ${Math.round((t - sinceBday) / 86400000)} days`;
  };

  const byDate = [...TRIPLE_DOUBLES].sort((a, b) => a.date.localeCompare(b.date));
  const first = byDate[0];
  const last = byDate[byDate.length - 1];

  assert.strictEqual(
    `${ageOf(first.date)} (${first.date} vs ${first.opponentAbbr})`,
    young,
    `youngestAge does not match the EARLIEST entry. The array starts at ` +
      `${first.id} (${first.date} vs ${first.opponentAbbr}) and the summary ` +
      `claims ${young}.`,
  );

  assert.strictEqual(
    `${ageOf(last.date)} (${last.date} vs ${last.opponentAbbr})`,
    TRIPLE_DOUBLE_SUMMARY.oldestAge,
    `oldestAge does not match the LATEST entry. The array ends at ${last.id} ` +
      `(${last.date} vs ${last.opponentAbbr}) and the summary claims ` +
      `${TRIPLE_DOUBLE_SUMMARY.oldestAge}. An age record is only ever true of ` +
      `the maximum, so naming any earlier entry is wrong however plausible it ` +
      `reads — and this one was 46 days short.`,
  );
});

/**
 * Every clutch re-enactment ends with the shot going IN at the buzzer, and its
 * clock counts down to zero. `clutch-2009-magic` did not: its last keyframe was at
 * t=1.4 for a play with `clockRemaining: "1.0s"`, holding the clock at 0.0s across
 * two consecutive steps so that the make appeared 0.4 seconds after the horn. The
 * other four all land on their own `clockRemaining`.
 *
 * The invariant is about the TIMELINE, not the drama: times strictly increase,
 * clocks strictly decrease, and the final frame is the buzzer. Asserted per entry
 * so the failure names the game rather than reporting one count.
 */
test("smoke test - every clutch re-enactment ends on the buzzer", () => {
  const { data: plays, isLive } = getBuzzerBeaters();
  assert.ok(
    isLive,
    "CLUTCH_BUZZER_BEATERS did not resolve from lib/data, so this guard " +
      "would be testing the fixture rather than the data module - and the defect " +
      "it exists to catch lives in the data module.",
  );

  const offenders: string[] = [];

  for (const c of plays) {
    const start = parseFloat(c.clockRemaining);
    const kfs = c.keyframes;
    if (!Number.isFinite(start) || kfs.length === 0) {
      offenders.push(`${c.id}: unreadable clockRemaining or no keyframes`);
      continue;
    }

    for (let i = 1; i < kfs.length; i++) {
      if (kfs[i].time <= kfs[i - 1].time) {
        offenders.push(
          `${c.id}: time goes backwards at step ${kfs[i].step} ` +
            `(${kfs[i - 1].time} -> ${kfs[i].time})`,
        );
      }
      if (kfs[i].clock === kfs[i - 1].clock) {
        offenders.push(
          `${c.id}: clock is held at ${kfs[i].clock} across steps ` +
            `${kfs[i - 1].step} and ${kfs[i].step}, so a stretch of the timeline ` +
            `shows no time passing`,
        );
      }
    }

    const last = kfs[kfs.length - 1];
    if (last.time !== start) {
      offenders.push(
        `${c.id}: the last keyframe is at t=${last.time} but clockRemaining is ` +
          `${c.clockRemaining} \u2014 the make happens ${Math.round((last.time - start) * 100) / 100}s ` +
          `${last.time > start ? "after" : "before"} the horn`,
      );
    }
    if (last.clock !== "0.0s") {
      offenders.push(
        `${c.id}: the last keyframe reads clock ${last.clock}, not 0.0s`,
      );
    }
  }

  assert.deepStrictEqual(
    offenders,
    [],
    `the clutch re-enactments do not all end at the buzzer: ${offenders.join(" | ")}. ` +
      `A scrubber that runs past the horn makes the last frame unreadable as a made ` +
      `shot, and it is the one moment the whole section exists to show.`,
  );
});

/**
 * `allThirtyFranchisesBeaten` carried a comment saying it was NOT derivable from
 * the triple-double tables, on the grounds that they "yield only 27 distinct
 * opponents". The arithmetic was backwards. They hold 28 opponent TOKENS, and those
 * are 27 franchises — BKN and NJN are the same one under two codes — and 30 NBA
 * franchises minus his own three (CLE, LAL, MIA) is exactly 27. So the claim is
 * reachable, and asserting it is cheap.
 *
 * `NBA_30` is written out here rather than imported, on purpose: if the module ever
 * grows its own list, this test still checks the table against an independent
 * statement of what the league contains.
 */
test("smoke test - the triple-double tables reach all 27 opponent franchises", () => {
  // BOTH tables. The claim is about every opponent franchise he has faced in a
  // triple-double, and the 27 are reached across the regular season and the
  // playoffs together — the 28 playoff entries alone reach far fewer, which is
  // what the first version of this test asserted and got wrong.
  const { regularSeason, playoffs, isLive } = getTripleDoubles();
  assert.ok(isLive, "TRIPLE_DOUBLES did not resolve from lib/data");
  const tds = [...regularSeason, ...playoffs];

  const NBA_30 = [
    "ATL", "BOS", "BKN", "CHA", "CHI", "CLE", "DAL", "DEN", "DET", "GSW",
    "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK",
    "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS",
  ];
  const OWN = new Set(tds.map((g) => g.team));
  // The Nets have been BKN and, before 2012, NJN. One franchise, two codes.
  const canonical = (f: string) => (f === "NJN" ? "BKN" : f);

  const beaten = new Set(tds.map((g) => canonical(g.franchise)));
  const want = NBA_30.filter((f) => !OWN.has(f));

  assert.strictEqual(
    want.length,
    27,
    `30 NBA franchises minus his own three is 27; the own-team set read ` +
      `${[...OWN].sort().join(", ")} and the arithmetic no longer holds.`,
  );

  const missing = want.filter((f) => !beaten.has(f)).sort();
  assert.deepStrictEqual(
    missing,
    [],
    `the triple-double tables do not reach ${missing.join(", ")}. ` +
      `TRIPLE_DOUBLE_SUMMARY.allThirtyFranchisesBeaten claims every opponent ` +
      `franchise has been beaten, so either the claim is wrong or the table is ` +
      `missing the games that closed those gaps. Check which before editing ` +
      `either — the comment that used to sit here asserted the gap without ` +
      `naming which franchises it was.`,
  );

  const notLeague = [...beaten].filter((f) => !NBA_30.includes(f)).sort();
  assert.deepStrictEqual(
    notLeague,
    [],
    `the table names franchises that are not among the NBA 30: ` +
      `${notLeague.join(", ")}. That is how PHO survived here for so long: it is ` +
      `not an NBA abbreviation, and a count alone would never have caught it.`,
  );
});

/**
 * The data module's public surface is pinned here.
 *
 * The module was a single 10,394-line file until it was split into
 * `lib/data/*.ts` behind a barrel. Every component and test imports the
 * barrel, so a name that stops being exported is invisible until a page
 * silently renders `undefined`.
 *
 * The 67 names are the exact surface of the original file, plus the three
 * point constants that `career.ts` and `honours.ts` now share. They are checked
 * in two passes because a type and a value need different evidence:
 *
 *  - VALUES are checked by importing the barrel. A missing value is a real
 *    runtime hole and must fail here.
 *  - TYPES are checked against the source text, because `export *` erases a
 *    type at runtime and `n in data` is `false` for a perfectly healthy
 *    interface. Reading the declarations is the only honest way to see them,
 *    and it is the pattern the design guards already use.
 *
 * This is the acceptance condition from issue #30: the split is a pure move, so
 * a rename or a dropped export has to fail loudly rather than quietly shrink
 * what the page can draw.
 */
const DATA_VALUES = [
  "STATS_AS_OF",
  "FIRST_SEASON",
  "LAST_SEASON",
  "SEASON_COUNT",
  "TEAM_SPANS",
  "OLYMPICS",
  "SEASONS",
  "HERO",
  "HARDWARE",
  "HONOURS",
  "NEXT_MARK",
  "CAREER",
  "ROOMS_INTRO",
  "ROOMS",
  "LEDGER_INTRO",
  "LEDGER",
  "NUMBER",
  "SHOT",
  "NIGHTS_INTRO",
  "NIGHTS",
  "THE_BLOCK",
  "SHOT_ZONES",
  "FATHER_AND_SON",
  "PEAK_ERAS",
  "ERA_COMPARE_INTRO",
  "BASELINE",
  "SECTIONS",
  "PLAYOFF_SERIES",
  "FRANCHISE_BREAKDOWN",
  "CLUTCH_BUZZER_BEATERS",
  "PLAYOFF_TRIPLE_DOUBLES",
  "REGULAR_SEASON_TRIPLE_DOUBLES",
  "TRIPLE_DOUBLES",
  "TRIPLE_DOUBLE_SUMMARY",
  // Added by the split: `career.ts` builds the stat line from the same three
  // totals `honours.ts` declares, so one side had to become exported.
  "REGULAR_SEASON_POINTS",
  "PLAYOFF_POINTS",
  "COMBINED_POINTS",
];

const DATA_TYPES = [
  "TeamSpan",
  "OlympicYear",
  "Season",
  "Honour",
  "CareerAverage",
  "CareerRow",
  "Room",
  "Metric",
  "Achievement",
  "LedgerEntry",
  "Night",
  "BlockKeyframe",
  "ShotZoneData",
  "EraShotData",
  "GameComparisonNode",
  "FatherSonMilestone",
  "PeakEraProfile",
  "MilestoneTarget",
  "PacePreset",
  "PlayoffRoundCategory",
  "SeriesBoxScoreTotals",
  "PlayoffSeries",
  "FranchisePostseasonRecord",
  "ChalkboardCoordinates",
  "ChalkboardTelemetry",
  "ChalkboardKeyframe",
  "BuzzerBeaterPlay",
  "ClutchBuzzerBeater",
  "TripleDoubleCategory",
  "TripleDoubleGame",
  "TripleDoubleEntry",
  "TripleDoubleSummary",
];

test("smoke test - the data barrel exports every value the page reads", async () => {
  const data = (await import("@/lib/data")) as Record<string, unknown>;

  const missing = DATA_VALUES.filter((n) => !(n in data));
  assert.deepStrictEqual(
    missing,
    [],
    `the data barrel no longer exports: ${missing.join(", ")}. A section that ` +
      `consumed one of these now renders undefined, which no other gate sees.`,
  );

  // The `get*` accessors are deliberately NOT asserted here: they live in
  // `tests/helpers/test-loader.ts`, not in the data module, and never were part
  // of this surface. The data-tier suites import them from there.
});

test("smoke test - the data barrel exports every type the page reads", () => {
  const dir = join(import.meta.dirname, "..", "lib", "data");
  const declared = new Set<string>();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".ts") || file === "index.ts") continue;
    const source = readFileSync(join(dir, file), "utf-8");
    for (const m of source.matchAll(
      /^export (?:interface|type) ([A-Za-z_][A-Za-z0-9_]*)/gm,
    )) {
      declared.add(m[1]);
    }
  }

  const missing = DATA_TYPES.filter((n) => !declared.has(n));
  assert.deepStrictEqual(
    missing,
    [],
    `no file under lib/data exports the type ${missing.join(", ")}. These are ` +
      `erased at runtime, so the value test above cannot see them and ` +
      `tsc only fails if something still imports them.`,
  );

  // Every domain file must be reachable from the barrel, or a split that drops
  // an `export *` line would silently shrink the surface instead of failing.
  const barrel = readFileSync(join(dir, "index.ts"), "utf-8");
  const unhooked = readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .filter((f) => !barrel.includes(`"./${f.replace(/\.ts$/, "")}"`));
  assert.deepStrictEqual(
    unhooked,
    [],
    `lib/data/${unhooked.join(", lib/data/")} is not re-exported by the barrel, ` +
      `so everything it declares is unreachable.`,
  );
});
