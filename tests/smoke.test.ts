import test from "node:test";
import assert from "node:assert";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { SEASONS, SECTIONS, NEXT_MARK, CAREER, THE_BLOCK } from "@/lib/lebron-data";
import {
  getBuzzerBeaters,
  getFranchiseBreakdown,
  getPlayoffSeries,
  getTripleDoubles,
} from "./helpers/test-loader";

test("smoke test - imports lebron-data via path alias", () => {
  assert.strictEqual(SEASONS.length, 23);
  assert.ok(SECTIONS.length > 0);
});

/**
 * The test resolver derived the project root from the PROCESS's working
 * directory (`path.resolve(".")`). `npm test` runs from the package root, so it
 * worked — and running the suite from anywhere else failed to resolve
 * `@/lib/lebron-data`, which reads as a broken suite rather than a broken
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
      'import { SEASONS, SECTIONS } from "@/lib/lebron-data";' +
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
    "PLAYOFF_SERIES did not resolve from lib/lebron-data; the suite is testing the fixture",
  );
  assert.ok(
    getBuzzerBeaters().isLive,
    "CLUTCH_BUZZER_BEATERS did not resolve from lib/lebron-data; the suite is testing the fixture",
  );
  assert.ok(
    getTripleDoubles().isLive,
    "the triple-double datasets did not resolve from lib/lebron-data; the suite is testing the fixture",
  );
  assert.ok(
    getFranchiseBreakdown().isLive,
    "FRANCHISE_BREAKDOWN did not resolve from lib/lebron-data; the suite is testing the fixture",
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
 * Shot-zone volumes are presented to the reader as "share of all shots
 * taken", so the nine zones of an era must partition 100%. One era summed to
 * 102.0.
 */
test("smoke test - every era's shot-zone volumes sum to 100%", async () => {
  const { SHOT_ZONES } = await import("@/lib/lebron-data");
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
  const { SHOT_ZONES } = await import("@/lib/lebron-data");

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
