import test from "node:test";
import assert from "node:assert";
import { SEASONS, SECTIONS } from "@/lib/lebron-data";
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
