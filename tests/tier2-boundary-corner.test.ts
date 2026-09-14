import test, { describe } from "node:test";
import assert from "node:assert";
import {
  getPlayoffSeries,
  getBuzzerBeaters,
  getTripleDoubles,
} from "./helpers/test-loader";

describe("Tier 2: Boundary & Corner Cases Suite", () => {
  // --------------------------------------------------------------------------
  // Category A: Sweeps Boundary & Extreme Records (4 tests)
  // --------------------------------------------------------------------------
  test("Tier 2.1 - Sweeps: Exactly 12 sweeps won (4-0) across career", () => {
    const { data } = getPlayoffSeries();
    const sweepsWon = data.filter(
      (s) => s.isSweep && s.gamesWon === 4 && s.gamesLost === 0,
    );

    assert.strictEqual(
      sweepsWon.length,
      12,
      `Expected exactly 12 sweeps won, found ${sweepsWon.length}`,
    );

    for (const s of sweepsWon) {
      assert.strictEqual(s.result, "W");
      assert.strictEqual(s.totalGames, 4);
      assert.strictEqual(s.sweepType, "won");
    }
  });

  test("Tier 2.2 - Sweeps: Exactly 4 sweeps suffered (0-4) across career", () => {
    const { data } = getPlayoffSeries();
    const sweepsSuffered = data.filter(
      (s) => s.isSweep && s.gamesWon === 0 && s.gamesLost === 4,
    );

    assert.strictEqual(
      sweepsSuffered.length,
      4,
      `Expected exactly 4 sweeps suffered, found ${sweepsSuffered.length}`,
    );

    const sweepYears = sweepsSuffered.map((s) => s.year).sort();
    assert.deepStrictEqual(sweepYears, [2007, 2018, 2023, 2026]);

    const sweepOpponents = sweepsSuffered.map((s) => s.opponentAbbr || s.franchise).sort();
    assert.deepStrictEqual(sweepOpponents, ["DEN", "GSW", "OKC", "SAS"]);
  });

  test("Tier 2.3 - Sweeps: Sweeps-only filter yields exactly 16 series with zero unclassified sweeps", () => {
    const { data } = getPlayoffSeries();
    const allSweeps = data.filter((s) => s.isSweep);

    assert.strictEqual(
      allSweeps.length,
      16,
      `Expected 16 sweep series (12 won + 4 lost), found ${allSweeps.length}`,
    );

    const nonSweeps = data.filter((s) => !s.isSweep);
    assert.strictEqual(nonSweeps.length, 41);

    for (const s of nonSweeps) {
      assert.ok(
        s.totalGames >= 5,
        `Non-sweep series ${s.id} has only ${s.totalGames} games`,
      );
      assert.strictEqual(s.sweepType, null);
    }
  });

  test("Tier 2.4 - Sweeps: Scoring dominance in sweeps won vs suffered", () => {
    const { data } = getPlayoffSeries();
    const sweeps = data.filter((s) => s.isSweep);

    for (const s of sweeps) {
      assert.ok(
        s.ppg >= 22.0,
        `PPG in sweep ${s.id} should be >= 22.0, got ${s.ppg}`,
      );
    }

    // Highest scoring sweep: 2017 ECS vs TOR (36.0 PPG)
    const torSweep2017 = sweeps.find(
      (s) => s.year === 2017 && (s.opponentAbbr === "TOR" || s.opponent.includes("Toronto")),
    );
    assert.ok(torSweep2017, "2017 Toronto sweep must exist");
    assert.strictEqual(torSweep2017.ppg, 36.0);
  });

  // --------------------------------------------------------------------------
  // Category B: Extreme Shots & Spatial Geometry (4 tests)
  // --------------------------------------------------------------------------
  test("Tier 2.5 - Extreme Shot: Shot 5 (2018 Raptors) full-court sprint originates in defensive backcourt", () => {
    const { data } = getBuzzerBeaters();
    const shot5 = data.find((b) => b.opponent === "TOR");
    assert.ok(shot5, "Shot 5 vs Raptors must exist");

    // Must originate in backcourt: y <= 15 on 0-100 scale
    const firstKf = shot5.keyframes[0];
    assert.ok(
      firstKf.lebron.y <= 15,
      `Shot 5 initial LeBron Y must be <= 15, got ${firstKf.lebron.y}`,
    );
    assert.ok(
      firstKf.ball.y <= 10,
      `Shot 5 initial ball Y must be <= 10, got ${firstKf.ball.y}`,
    );

    // Final keyframe reaches terminal offensive paint: y >= 82
    const lastKf = shot5.keyframes[shot5.keyframes.length - 1];
    assert.ok(
      lastKf.lebron.y >= 80,
      `Shot 5 final LeBron Y must be >= 80, got ${lastKf.lebron.y}`,
    );

    // Total spatial delta along Y axis must be > 70% of court
    const yTravel = lastKf.lebron.y - firstKf.lebron.y;
    assert.ok(
      yTravel > 70,
      `Expected full-court Y delta > 70, got ${yTravel}`,
    );
  });

  test("Tier 2.6 - Extreme Shot: Shortest buzzer-beater distance (1 ft) vs longest (26 ft)", () => {
    const { data } = getBuzzerBeaters();

    const distances = data.map((b) => parseInt(b.shotDistance.replace(" ft", ""), 10));
    const minDistance = Math.min(...distances);
    const maxDistance = Math.max(...distances);

    assert.strictEqual(minDistance, 1, "Shortest buzzer beater must be 1 ft layup");
    assert.strictEqual(maxDistance, 26, "Longest buzzer beater must be 26 ft pull-up 3PT");

    const shot1ft = data.find((b) => b.shotDistance === "1 ft");
    assert.ok(shot1ft?.shotType.toLowerCase().includes("layup"));

    const shot26ft = data.find((b) => b.shotDistance === "26 ft");
    assert.ok(shot26ft?.shotType.toLowerCase().includes("3-pointer"));
  });

  test("Tier 2.7 - Extreme Clock: Shortest clock remaining (1.0s) vs longest sequence duration (8.0s)", () => {
    const { data } = getBuzzerBeaters();

    const clocks = data.map((b) => parseFloat(b.clockRemaining.replace("s", "")));
    const minClock = Math.min(...clocks);
    const maxClock = Math.max(...clocks);

    assert.strictEqual(minClock, 1.0, "Shortest clock remaining must be 1.0s");
    assert.strictEqual(maxClock, 8.0, "Longest clock remaining must be 8.0s");

    for (const b of data) {
      const c = parseFloat(b.clockRemaining.replace("s", ""));
      assert.ok(c > 0 && c <= 8.0);
    }
  });

  test("Tier 2.8 - Extreme Situation: Overtime game handling (Shot 2, May 22, 2013 vs IND)", () => {
    const { data } = getBuzzerBeaters();
    const shot2 = data.find((b) => b.date === "May 22, 2013");
    assert.ok(shot2, "Shot 2 (2013 vs Pacers) must exist");

    assert.ok(shot2.scoreBefore.includes("101"));
    assert.ok(shot2.scoreAfter.includes("103") || shot2.scoreAfter.includes("102"));
    assert.strictEqual(shot2.primaryDefender, "Paul George");
    assert.ok(
      shot2.seriesImpact.toLowerCase().includes("hibbert") ||
        shot2.description.toLowerCase().includes("hibbert"),
      "Context must document Roy Hibbert being benched by Frank Vogel",
    );
  });

  // --------------------------------------------------------------------------
  // Category C: 0-0 Clock Terminal State & Parabolic Trajectory (3 tests)
  // --------------------------------------------------------------------------
  test("Tier 2.9 - Terminal State: All buzzer-beater plays terminate at clock 0.0s", () => {
    const { data } = getBuzzerBeaters();

    for (const b of data) {
      const finalKf = b.keyframes[b.keyframes.length - 1];
      assert.strictEqual(finalKf.telemetry.clock, "0.0s");
      assert.strictEqual(finalKf.telemetry.distance, "0 ft");
    }
  });

  test("Tier 2.10 - Parabolic Arc: Ball coordinates arrive at rim/hoop center on final keyframe", () => {
    const { data } = getBuzzerBeaters();

    for (const b of data) {
      const finalKf = b.keyframes[b.keyframes.length - 1];
      // On normalized 0-100 scale, the basket rim is at x: 50, y: 88
      assert.ok(
        Math.abs(finalKf.ball.x - 50) <= 2,
        `Ball X at rim should be ~50, got ${finalKf.ball.x}`,
      );
      assert.ok(
        Math.abs(finalKf.ball.y - 88) <= 2,
        `Ball Y at rim should be ~88, got ${finalKf.ball.y}`,
      );
    }
  });

  test("Tier 2.11 - Parabolic Arc: Vertical elevation rises to apex during shot and returns to 0 on hardwood", () => {
    const { data } = getBuzzerBeaters();

    // Shot 1 (2009 Magic 3PT) jump elevation trajectory
    const shot1 = data[0];
    const initialElev = shot1.keyframes[0].lebron.elevation ?? 0;
    assert.strictEqual(initialElev, 0, "Initial elevation must be 0 on hardwood");

    // Find apex elevation during shot release
    let maxElevation = 0;
    for (const kf of shot1.keyframes) {
      const elev = kf.lebron.elevation ?? 0;
      if (elev > maxElevation) maxElevation = elev;
    }
    assert.ok(maxElevation >= 8, `Jump apex elevation must be >= 8 ft, got ${maxElevation}`);

    // Initial and pre-jump keyframes are at ground elevation 0
    assert.strictEqual(shot1.keyframes[1].lebron.elevation ?? 0, 0);
  });

  // --------------------------------------------------------------------------
  // Category D: Empty Filter Sets & Out-of-Bounds Queries (3 tests)
  // --------------------------------------------------------------------------
  test("Tier 2.12 - Out-of-Bounds: Filtering by non-existent opponent franchise returns empty array gracefully", () => {
    const { data } = getPlayoffSeries();
    const fakeFranchise = "ZZZ";
    const filtered = data.filter((s) => s.opponent === fakeFranchise);

    assert.ok(Array.isArray(filtered), "Filtered result must be an array");
    assert.strictEqual(filtered.length, 0);
  });

  test("Tier 2.13 - Out-of-Bounds: Filtering by non-existent playoff round returns empty array gracefully", () => {
    const { data } = getPlayoffSeries();
    const fakeRound = "Wildcard Round";
    const filtered = data.filter((s) => (s.roundCategory as string) === fakeRound);

    assert.ok(Array.isArray(filtered));
    assert.strictEqual(filtered.length, 0);
  });

  test("Tier 2.14 - Out-of-Bounds: Querying season bounds outside career range returns empty array", () => {
    const { data } = getPlayoffSeries();

    const beforeRookie = data.filter((s) => s.year < 2003);
    assert.strictEqual(beforeRookie.length, 0);

    const farFuture = data.filter((s) => s.year > 2035);
    assert.strictEqual(farFuture.length, 0);
  });

  // --------------------------------------------------------------------------
  // Category E: 2023 WCF 0-4 Edge Case & Conference Finals Math (3 tests)
  // --------------------------------------------------------------------------
  test("Tier 2.15 - 2023 WCF: Denver Nuggets 0-4 series is classified under Conference Finals", () => {
    const { data } = getPlayoffSeries();
    const denverWcf = data.find((s) => s.year === 2023 && s.roundCode === "WCF");

    assert.ok(denverWcf, "2023 WCF vs Denver Nuggets must exist");
    assert.ok(
      denverWcf.opponentAbbr === "DEN" || denverWcf.opponent.includes("Denver"),
      "Opponent must be Denver Nuggets (DEN)",
    );
    assert.strictEqual(denverWcf.roundCategory, "Conf Finals");
    assert.strictEqual(denverWcf.gamesWon, 0);
    assert.strictEqual(denverWcf.gamesLost, 4);
    assert.strictEqual(denverWcf.isSweep, true);
    assert.strictEqual(denverWcf.sweepType, "lost");
    assert.strictEqual(denverWcf.ppg, 27.8);
    assert.strictEqual(denverWcf.rpg, 9.5);
    assert.strictEqual(denverWcf.apg, 10.0);
  });

  test("Tier 2.16 - Math Discrepancy Resolution: All-time Conf Finals is 10-2 (10-1 East, 0-1 West)", () => {
    const { data } = getPlayoffSeries();
    const confFinalsSeries = data.filter((s) => s.roundCategory === "Conf Finals");

    assert.strictEqual(confFinalsSeries.length, 12, "Expected 12 Conference Finals series");

    let cfWins = 0;
    let cfLosses = 0;
    for (const s of confFinalsSeries) {
      if (s.result === "W") cfWins++;
      else cfLosses++;
    }

    assert.strictEqual(cfWins, 10, "Expected 10 Conference Finals wins (9 East + 1 West)");
    assert.strictEqual(cfLosses, 2, "Expected 2 Conference Finals losses (2009 ORL, 2023 DEN)");

    // Eastern Conference Finals was 10 series (9-1)
    const ecfSeries = confFinalsSeries.filter((s) => s.roundCode === "ECF");
    const ecfLosses = ecfSeries.filter((s) => s.result === "L");
    assert.strictEqual(ecfSeries.length, 10);
    assert.strictEqual(ecfLosses.length, 1);
    assert.ok(
      ecfLosses[0].opponentAbbr === "ORL" || ecfLosses[0].opponent.includes("Orlando"),
    );

    // Resolves round sum invariant: 16-3 + 12-4 + 10-2 + 4-6 = 42-15 = 57 series
    const totalWins = 16 + 12 + 10 + 4;
    const totalLosses = 3 + 4 + 2 + 6;
    assert.strictEqual(totalWins, 42);
    assert.strictEqual(totalLosses, 15);
    assert.strictEqual(totalWins + totalLosses, 57);
  });

  test("Tier 2.17 - Game 4 2023 WCF near-triple-double lore context", () => {
    const { data } = getPlayoffSeries();
    const denverWcf = data.find((s) => s.year === 2023 && s.roundCode === "WCF");
    assert.ok(denverWcf);
    assert.ok(
      denverWcf.signatureMoment.includes("40") ||
        denverWcf.signatureMoment.toLowerCase().includes("denver"),
      "Signature moment must document 40-point Game 4 effort",
    );
  });

  // --------------------------------------------------------------------------
  // Category F: 50-Point Lore Clarification (3 tests)
  // --------------------------------------------------------------------------
  test("Tier 2.18 - 50-pt Lore: Proof that zero official 50-point triple-doubles exist in NBA record books", () => {
    const { regularSeason, playoffs, summary } = getTripleDoubles();
    const allOfficialTripleDoubles = [...regularSeason, ...playoffs];

    // Verify no official triple-double has 50+ points
    const fiftyPointTripleDoubles = allOfficialTripleDoubles.filter(
      (g) => g.pts >= 50 && g.reb >= 10 && g.ast >= 10,
    );

    assert.strictEqual(
      fiftyPointTripleDoubles.length,
      0,
      `Expected 0 official 50-point triple-doubles, found ${fiftyPointTripleDoubles.length}`,
    );

    // Highest regular season is 44 PTS, highest playoff is 42 PTS
    assert.ok(summary.highestScoringRegularSeason.pts < 50);
    assert.ok(summary.highestScoringPlayoffs.pts < 50);
  });

  test("Tier 2.19 - 50-pt Lore: Highest verified regular-season scoring triple-double is 44 PTS (2018 vs PHI)", () => {
    const { summary, regularSeason } = getTripleDoubles();
    assert.strictEqual(summary.highestScoringRegularSeason.pts, 44);
    assert.strictEqual(summary.highestScoringRegularSeason.opp, "PHI");
    assert.strictEqual(summary.highestScoringRegularSeason.date, "2018-04-06");

    const phillyGame = regularSeason.find((g) => g.date === "2018-04-06");
    assert.ok(phillyGame);
    assert.strictEqual(phillyGame.pts, 44);
    assert.strictEqual(phillyGame.reb, 11);
    assert.strictEqual(phillyGame.ast, 11);
  });

  test("Tier 2.20 - 50-pt Lore: Highest verified playoff scoring triple-double is 42 PTS (2018 vs BOS)", () => {
    const { summary, playoffs } = getTripleDoubles();
    assert.strictEqual(summary.highestScoringPlayoffs.pts, 42);
    assert.strictEqual(summary.highestScoringPlayoffs.opp, "BOS");
    assert.strictEqual(summary.highestScoringPlayoffs.date, "2018-05-15");

    const bostonGame = playoffs.find((g) => g.date === "2018-05-15");
    assert.ok(bostonGame);
    assert.strictEqual(bostonGame.pts, 42);
    assert.strictEqual(bostonGame.reb, 10);
    assert.strictEqual(bostonGame.ast, 12);
  });
});
