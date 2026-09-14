import test, { describe } from "node:test";
import assert from "node:assert";
import {
  getPlayoffSeries,
  getBuzzerBeaters,
  getTripleDoubles,
  LebronData,
} from "./helpers/test-loader";

describe("Tier 3: Cross-Feature Combinations Suite", () => {
  // --------------------------------------------------------------------------
  // Pairwise Feature Linkages: Buzzer-Beaters <-> Playoff Matrix
  // --------------------------------------------------------------------------
  test("Tier 3.1 - Cross-Feature: Buzzer-Beater 1 (2009 Magic) maps to 2008-09 ECF in Playoff Series Matrix", () => {
    const { data: series } = getPlayoffSeries();
    const { data: shots } = getBuzzerBeaters();

    const shot1 = shots[0];
    assert.strictEqual(shot1.opponent, "ORL");

    const matchedSeries = series.find(
      (s) => s.year === 2009 && s.roundCode === "ECF" && (s.opponentAbbr === "ORL" || s.opponent.includes("Orlando")),
    );

    assert.ok(matchedSeries, "Matching 2009 ECF vs ORL series must exist in matrix");
    assert.strictEqual(matchedSeries.result, "L");
    assert.strictEqual(matchedSeries.seriesScore, "2\u20134");
    assert.ok(
      matchedSeries.signatureMoment.toLowerCase().includes("buzzer") ||
        matchedSeries.signatureMoment.toLowerCase().includes("game 2"),
      "Series signature moment must mention the Game 2 buzzer beater",
    );
  });

  test("Tier 3.2 - Cross-Feature: Buzzer-Beater 2 (2013 Pacers) maps to 2012-13 ECF in Playoff Series Matrix", () => {
    const { data: series } = getPlayoffSeries();
    const { data: shots } = getBuzzerBeaters();

    const shot2 = shots[1];
    assert.strictEqual(shot2.opponent, "IND");

    const matchedSeries = series.find(
      (s) => s.year === 2013 && s.roundCode === "ECF" && (s.opponentAbbr === "IND" || s.opponent.includes("Pacers")),
    );

    assert.ok(matchedSeries, "Matching 2013 ECF vs IND series must exist in matrix");
    assert.strictEqual(matchedSeries.result, "W");
    assert.strictEqual(matchedSeries.team, "MIA");
    assert.strictEqual(matchedSeries.gamesWon, 4);
    assert.strictEqual(matchedSeries.gamesLost, 3);
  });

  test("Tier 3.3 - Cross-Feature: Buzzer-Beater 3 (2015 Bulls) maps to 2014-15 ECS in Playoff Series Matrix", () => {
    const { data: series } = getPlayoffSeries();
    const { data: shots } = getBuzzerBeaters();

    const shot3 = shots[2];
    assert.strictEqual(shot3.opponent, "CHI");

    const matchedSeries = series.find(
      (s) => s.year === 2015 && s.roundCode === "ECS" && (s.opponentAbbr === "CHI" || s.opponent.includes("Bulls")),
    );

    assert.ok(matchedSeries, "Matching 2015 ECS vs CHI series must exist in matrix");
    assert.strictEqual(matchedSeries.result, "W");
    assert.strictEqual(matchedSeries.gamesWon, 4);
    assert.strictEqual(matchedSeries.gamesLost, 2);
    assert.ok(
      matchedSeries.signatureMoment.toLowerCase().includes("buzzer") ||
        matchedSeries.signatureMoment.toLowerCase().includes("game 4"),
    );
  });

  test("Tier 3.4 - Cross-Feature: Buzzer-Beaters 4 & 5 (2018 Pacers & Raptors) map to consecutive series in 2018 run", () => {
    const { data: series } = getPlayoffSeries();
    const { data: shots } = getBuzzerBeaters();

    const shot4 = shots[3]; // April 25, 2018 vs IND
    const shot5 = shots[4]; // May 5, 2018 vs TOR

    const pacersSeries = series.find(
      (s) => s.year === 2018 && s.roundCode === "EC1" && (s.opponentAbbr === "IND" || s.opponent.includes("Pacers")),
    );
    const raptorsSeries = series.find(
      (s) => s.year === 2018 && s.roundCode === "ECS" && (s.opponentAbbr === "TOR" || s.opponent.includes("Raptors")),
    );

    assert.ok(pacersSeries, "2018 EC1 vs IND must exist");
    assert.ok(raptorsSeries, "2018 ECS vs TOR must exist");

    assert.strictEqual(pacersSeries.result, "W");
    assert.strictEqual(pacersSeries.seriesScore, "4\u20133");

    assert.strictEqual(raptorsSeries.result, "W");
    assert.strictEqual(raptorsSeries.seriesScore, "4\u20130");
    assert.strictEqual(raptorsSeries.isSweep, true);

    // Both occurred within 10 days in 2018
    assert.strictEqual(shot4.year, 2018);
    assert.strictEqual(shot5.year, 2018);
  });

  // --------------------------------------------------------------------------
  // Cross-Feature: Clutch Anthology <-> Triple-Double Dual Occurrence
  // --------------------------------------------------------------------------
  test("Tier 3.5 - Cross-Feature: May 22, 2013 Dual Occurrence (Triple-Double AND Buzzer-Beater in Same Game)", () => {
    const { data: shots } = getBuzzerBeaters();
    const { playoffs: tds } = getTripleDoubles();

    // Shot 2: May 22, 2013 vs IND
    const shot2 = shots.find((s) => s.date === "May 22, 2013");
    assert.ok(shot2);

    // Triple-double on 2013-05-22 vs IND
    const tdGame = tds.find((t) => t.date === "2013-05-22");
    assert.ok(tdGame, "May 22, 2013 triple-double must exist");
    assert.strictEqual(tdGame.opponent, "IND");
    assert.strictEqual(tdGame.pts, 30);
    assert.strictEqual(tdGame.reb, 10);
    assert.strictEqual(tdGame.ast, 10);
    assert.strictEqual(tdGame.result, "W");

    // Both features document the exact same 103-102 overtime win
    assert.ok(shot2.scoreAfter.includes("103") && shot2.scoreAfter.includes("102"));
    assert.ok(tdGame.score.includes("103") && tdGame.score.includes("102"));
    assert.ok(tdGame.notes.toLowerCase().includes("buzzer") || tdGame.notes.toLowerCase().includes("2.2"));
  });

  // --------------------------------------------------------------------------
  // Cross-Feature: Playoff Triple-Doubles <-> Playoff Series Matrix
  // --------------------------------------------------------------------------
  test("Tier 3.6 - Cross-Feature: All 28 playoff triple-doubles map to valid playoff series in the 57-series matrix", () => {
    const { data: series } = getPlayoffSeries();
    const { playoffs: tds } = getTripleDoubles();

    for (const td of tds) {
      const match = series.find(
        (s) => s.year === td.year && (s.opponentAbbr === td.opponent || s.franchise === td.opponent),
      );
      assert.ok(
        match,
        `Playoff triple-double ${td.id} (${td.date} vs ${td.opponent}) has no enclosing series in 57-series matrix`,
      );
    }
  });

  test("Tier 3.7 - Cross-Feature: Playoff opponent franchises are a strict subset of triple-double opponent franchises", () => {
    const { data: series } = getPlayoffSeries();
    const { regularSeason, playoffs } = getTripleDoubles();

    const playoffFranchises = new Set(series.map((s) => s.opponentAbbr || s.franchise));
    const allTdFranchises = new Set([...regularSeason, ...playoffs].map((g) => g.opponentAbbr || g.opponent));

    assert.strictEqual(playoffFranchises.size, 25);

    for (const franchise of playoffFranchises) {
      assert.ok(
        allTdFranchises.has(franchise),
        `Playoff franchise ${franchise} should exist in career triple-double franchise registry`,
      );
    }
  });

  // --------------------------------------------------------------------------
  // Multi-Filter Interactions & State Invariants
  // --------------------------------------------------------------------------
  test("Tier 3.8 - Multi-Filter Interaction: Combining Round filter with Franchise filter yields exact intersecting series", () => {
    const { data: series } = getPlayoffSeries();

    // Finals vs GSW: 4 series (2015, 2016, 2017, 2018)
    const finalsGsw = series.filter(
      (s) => s.roundCategory === "NBA Finals" && (s.opponentAbbr === "GSW" || s.opponent.includes("Warriors")),
    );
    assert.strictEqual(finalsGsw.length, 4);
    const gswWins = finalsGsw.filter((s) => s.result === "W");
    assert.strictEqual(gswWins.length, 1);
    assert.strictEqual(gswWins[0].year, 2016);

    // Conf Finals vs BOS: 3 series (2012, 2017, 2018)
    const cfBos = series.filter(
      (s) => s.roundCategory === "Conf Finals" && (s.opponentAbbr === "BOS" || s.opponent.includes("Celtics")),
    );
    assert.strictEqual(cfBos.length, 3);
    for (const s of cfBos) {
      assert.strictEqual(s.result, "W");
    }

    // First Round vs WAS: 3 series (2006, 2007, 2008)
    const r1Was = series.filter(
      (s) => s.roundCategory === "First Round" && (s.opponentAbbr === "WAS" || s.opponent.includes("Wizards")),
    );
    assert.strictEqual(r1Was.length, 3);
    for (const s of r1Was) {
      assert.strictEqual(s.result, "W");
    }
  });

  test("Tier 3.9 - State Invariant: Switching between triple-double filter tiers preserves chronological order", () => {
    const { playoffs } = getTripleDoubles();

    // Filter "NBA Finals" (11 games)
    const finalsOnly = playoffs.filter((g) => g.round?.startsWith("NBA Finals"));
    assert.strictEqual(finalsOnly.length, 11);

    // Verify chronological order
    for (let i = 1; i < finalsOnly.length; i++) {
      assert.ok(
        finalsOnly[i].date >= finalsOnly[i - 1].date,
        `Finals games must be in chronological order: ${finalsOnly[i - 1].date} <= ${finalsOnly[i].date}`,
      );
    }

    // Filter "Conf Finals" (6 games)
    const cfOnly = playoffs.filter((g) => g.round?.startsWith("Conf Finals"));
    assert.strictEqual(cfOnly.length, 6);
    for (let i = 1; i < cfOnly.length; i++) {
      assert.ok(cfOnly[i].date >= cfOnly[i - 1].date);
    }
  });

  test("Tier 3.10 - State Persistence: Filtering never mutates underlying datasets", () => {
    const { data: initialSeries } = getPlayoffSeries();
    const { data: initialShots } = getBuzzerBeaters();
    const { playoffs: initialTds } = getTripleDoubles();

    // Perform multiple aggressive filter operations
    const sweepFilter = initialSeries.filter((s) => s.isSweep);
    const finalsFilter = sweepFilter.filter((s) => s.roundCategory === "NBA Finals");
    assert.strictEqual(finalsFilter.length, 2); // 2007 Spurs, 2018 Warriors

    // Original dataset lengths must remain unchanged
    const { data: freshSeries } = getPlayoffSeries();
    const { data: freshShots } = getBuzzerBeaters();
    const { playoffs: freshTds } = getTripleDoubles();

    assert.strictEqual(freshSeries.length, initialSeries.length);
    assert.strictEqual(freshShots.length, initialShots.length);
    assert.strictEqual(freshTds.length, initialTds.length);
    assert.strictEqual(freshSeries.length, 57);
    assert.strictEqual(freshShots.length, 5);
    assert.strictEqual(freshTds.length, 28);
  });

  // --------------------------------------------------------------------------
  // Counting Invariants: Playoff Counting Numbers <-> Headline Career
  // --------------------------------------------------------------------------
  test("Tier 3.11 - Counting Invariant: Playoff series total points sum strictly equals CAREER.playoffs.points (8,521)", () => {
    const { data: series } = getPlayoffSeries();
    const totalPointsFromSeries = series.reduce((sum, s) => sum + s.boxScoreTotals.pts, 0);

    const careerPlayoffPoints = LebronData.CAREER.playoffs.points;
    assert.strictEqual(careerPlayoffPoints, 8521);
    assert.strictEqual(
      totalPointsFromSeries,
      careerPlayoffPoints,
      `Sum of series points (${totalPointsFromSeries}) must equal CAREER.playoffs.points (${careerPlayoffPoints})`,
    );
  });

  test("Tier 3.12 - Counting Invariant: Playoff series total games sum strictly equals CAREER.playoffs.games (302)", () => {
    const { data: series } = getPlayoffSeries();
    const totalGamesFromSeries = series.reduce((sum, s) => sum + s.totalGames, 0);

    const careerPlayoffGames = LebronData.CAREER.playoffs.games;
    assert.strictEqual(careerPlayoffGames, 302);
    assert.strictEqual(
      totalGamesFromSeries,
      careerPlayoffGames,
      `Sum of series totalGames (${totalGamesFromSeries}) must equal CAREER.playoffs.games (${careerPlayoffGames})`,
    );
  });
});
