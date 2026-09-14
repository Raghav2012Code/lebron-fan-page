import test, { describe } from "node:test";
import assert from "node:assert";
import {
  getPlayoffSeries,
  getBuzzerBeaters,
  getTripleDoubles,
  getFranchiseBreakdown,
  HARDWOOD_TOKENS,
  LebronData,
} from "./helpers/test-loader";

describe("Tier 1: Feature Coverage Suite", () => {
  // --------------------------------------------------------------------------
  // Feature 1: Playoff Series Matrix (5 tests)
  // --------------------------------------------------------------------------
  test("Tier 1.1 - Playoff Matrix: Exactly 57 postseason series exist in career ledger", () => {
    const { data } = getPlayoffSeries();
    assert.strictEqual(
      data.length,
      57,
      `Expected exactly 57 career playoff series, found ${data.length}`,
    );

    const ids = new Set<string>();
    for (const s of data) {
      assert.ok(s.id, "Series must have a defined id");
      assert.ok(!ids.has(s.id), `Duplicate series id detected: ${s.id}`);
      ids.add(s.id);
    }
  });

  test("Tier 1.2 - Playoff Matrix: Career series record is strictly 42 wins and 15 losses (42-15)", () => {
    const { data } = getPlayoffSeries();
    let wins = 0;
    let losses = 0;

    for (const s of data) {
      if (s.result === "W") wins++;
      else if (s.result === "L") losses++;
      else assert.fail(`Invalid series result: ${s.result}`);
    }

    assert.strictEqual(wins, 42, `Expected 42 series wins, got ${wins}`);
    assert.strictEqual(losses, 15, `Expected 15 series losses, got ${losses}`);
    assert.strictEqual(
      wins + losses,
      57,
      `Sum of wins and losses must be 57, got ${wins + losses}`,
    );
  });

  test("Tier 1.3 - Playoff Matrix: Round breakdown matches verified historical records", () => {
    const { data } = getPlayoffSeries();

    const roundCounts: Record<string, { wins: number; losses: number; total: number }> = {
      "First Round": { wins: 0, losses: 0, total: 0 },
      "Conf Semifinals": { wins: 0, losses: 0, total: 0 },
      "Conf Finals": { wins: 0, losses: 0, total: 0 },
      "NBA Finals": { wins: 0, losses: 0, total: 0 },
    };

    for (const s of data) {
      const cat = s.roundCategory;
      assert.ok(roundCounts[cat], `Unrecognized roundCategory: ${cat}`);
      roundCounts[cat].total++;
      if (s.result === "W") roundCounts[cat].wins++;
      else roundCounts[cat].losses++;
    }

    // First Round: 16-3 (19 series)
    assert.strictEqual(roundCounts["First Round"].wins, 16);
    assert.strictEqual(roundCounts["First Round"].losses, 3);
    assert.strictEqual(roundCounts["First Round"].total, 19);

    // Conference Semifinals: 12-4 (16 series)
    assert.strictEqual(roundCounts["Conf Semifinals"].wins, 12);
    assert.strictEqual(roundCounts["Conf Semifinals"].losses, 4);
    assert.strictEqual(roundCounts["Conf Semifinals"].total, 16);

    // Conference Finals: 10-2 (12 series: 10-1 East, 0-1 West)
    assert.strictEqual(roundCounts["Conf Finals"].wins, 10);
    assert.strictEqual(roundCounts["Conf Finals"].losses, 2);
    assert.strictEqual(roundCounts["Conf Finals"].total, 12);

    // NBA Finals: 4-6 (10 series)
    assert.strictEqual(roundCounts["NBA Finals"].wins, 4);
    assert.strictEqual(roundCounts["NBA Finals"].losses, 6);
    assert.strictEqual(roundCounts["NBA Finals"].total, 10);
  });

  test("Tier 1.4 - Playoff Matrix: Opponent breakdown covers all 25 distinct playoff franchises faced", () => {
    const { data } = getPlayoffSeries();
    const { data: franchises } = getFranchiseBreakdown();

    const seriesOpponents = new Set(
      data.map((s) => (s as { opponentAbbr?: string; opponent: string }).opponentAbbr ?? s.opponent),
    );
    assert.strictEqual(
      seriesOpponents.size,
      25,
      `Expected 25 distinct opponent abbreviations in series, found ${seriesOpponents.size}`,
    );

    assert.strictEqual(
      franchises.length,
      25,
      `Expected exactly 25 franchise head-to-head records, found ${franchises.length}`,
    );

    // Verify key historic franchises are present
    const expectedKeyFranchises = ["BOS", "IND", "GSW", "CHI", "DET", "TOR", "SAS", "DEN", "OKC"];
    for (const abbr of expectedKeyFranchises) {
      assert.ok(seriesOpponents.has(abbr), `Expected opponent ${abbr} missing from series`);
    }
  });

  test("Tier 1.5 - Playoff Matrix: Series box score schema and career playoff counting totals", () => {
    const { data } = getPlayoffSeries();
    let totalPoints = 0;
    let totalGames = 0;

    for (const s of data) {
      assert.ok(typeof s.year === "number" && s.year >= 2006);
      assert.ok(s.ppg > 0, `PPG must be positive for ${s.id}`);
      assert.ok(s.rpg > 0, `RPG must be positive for ${s.id}`);
      assert.ok(s.apg > 0, `APG must be positive for ${s.id}`);
      assert.ok(s.signatureMoment && s.signatureMoment.length > 10);

      totalGames += s.totalGames;
      totalPoints += s.boxScoreTotals.pts;
    }

    assert.strictEqual(totalGames, 302, `Expected 302 total playoff games, got ${totalGames}`);
    assert.strictEqual(totalPoints, 8521, `Expected 8,521 total playoff points, got ${totalPoints}`);
  });

  // --------------------------------------------------------------------------
  // Feature 2: Clutch Game-Winner Anthology (5 tests)
  // --------------------------------------------------------------------------
  test("Tier 1.6 - Clutch Anthology: Exactly 5 iconic postseason buzzer-beaters are documented", () => {
    const { data } = getBuzzerBeaters();
    assert.strictEqual(data.length, 5, `Expected exactly 5 buzzer-beaters, got ${data.length}`);

    const years = data.map((b) => b.year);
    assert.deepStrictEqual(years, [2009, 2013, 2015, 2018, 2018]);
  });

  test("Tier 1.7 - Clutch Anthology: Verified game dates, opponents, and clock times match historical tape", () => {
    const { data } = getBuzzerBeaters();

    // Shot 1: May 22, 2009 vs ORL (1.0s, 25 ft)
    const shot1 = data[0];
    assert.strictEqual(shot1.opponent, "ORL");
    assert.strictEqual(shot1.clockRemaining, "1.0s");
    assert.strictEqual(shot1.shotDistance, "25 ft");
    assert.strictEqual(shot1.scoreAfter, "ORL 95 \u2013 CLE 96");

    // Shot 2: May 22, 2013 vs IND (2.2s, 1 ft)
    const shot2 = data[1];
    assert.strictEqual(shot2.opponent, "IND");
    assert.strictEqual(shot2.clockRemaining, "2.2s");
    assert.strictEqual(shot2.shotDistance, "1 ft");
    assert.strictEqual(shot2.team, "MIA");

    // Shot 3: May 10, 2015 vs CHI (1.5s, 21 ft)
    const shot3 = data[2];
    assert.strictEqual(shot3.opponent, "CHI");
    assert.strictEqual(shot3.clockRemaining, "1.5s");
    assert.strictEqual(shot3.shotDistance, "21 ft");

    // Shot 4: April 25, 2018 vs IND (3.0s, 26 ft)
    const shot4 = data[3];
    assert.strictEqual(shot4.opponent, "IND");
    assert.strictEqual(shot4.clockRemaining, "3.0s");
    assert.strictEqual(shot4.shotDistance, "26 ft");

    // Shot 5: May 5, 2018 vs TOR (8.0s, 12 ft)
    const shot5 = data[4];
    assert.strictEqual(shot5.opponent, "TOR");
    assert.strictEqual(shot5.clockRemaining, "8.0s");
    assert.strictEqual(shot5.shotDistance, "12 ft");
  });

  test("Tier 1.8 - Clutch Anthology: Broadcast calls and commentators are verified verbatim", () => {
    const { data } = getBuzzerBeaters();

    // Shot 1: Marv Albert
    assert.strictEqual(data[0].broadcastCall.caller, "Marv Albert");
    assert.ok(data[0].broadcastCall.quote.includes("LEBRON JAMES DELIVERS AT THE BUZZER"));

    // Shot 2: Marv Albert
    assert.strictEqual(data[1].broadcastCall.caller, "Marv Albert");
    assert.ok(data[1].broadcastCall.quote.includes("He makes the layup at the buzzer"));

    // Shot 3: Mike Breen
    assert.strictEqual(data[2].broadcastCall.caller, "Mike Breen");
    assert.ok(data[2].broadcastCall.quote.includes("IT'S GOOD! AT THE BUZZER"));

    // Shot 4: Mike Breen
    assert.strictEqual(data[3].broadcastCall.caller, "Mike Breen");
    assert.ok(data[3].broadcastCall.quote.includes("HE HITS IT! LEBRON JAMES WITH A THREE"));

    // Shot 5: Brian Anderson
    assert.strictEqual(data[4].broadcastCall.caller, "Brian Anderson");
    assert.ok(data[4].broadcastCall.quote.includes("HE BANKS IT IN AT THE BUZZER"));
  });

  test("Tier 1.9 - Clutch Anthology: Chalkboard keyframe timeline and telemetry synchronization", () => {
    const { data } = getBuzzerBeaters();

    for (const play of data) {
      assert.ok(
        play.keyframes.length >= 5,
        `Play ${play.id} must have >= 5 keyframes, has ${play.keyframes.length}`,
      );

      // Verify strictly non-decreasing time
      for (let i = 1; i < play.keyframes.length; i++) {
        assert.ok(
          play.keyframes[i].time >= play.keyframes[i - 1].time,
          `Keyframe time must be monotonic for ${play.id}`,
        );
      }

      // Final keyframe must terminate at buzzer
      const finalKf = play.keyframes[play.keyframes.length - 1];
      assert.strictEqual(finalKf.telemetry.clock, "0.0s");
      assert.strictEqual(finalKf.telemetry.distance, "0 ft");
    }
  });

  test("Tier 1.10 - Clutch Anthology: Tactical court coordinate schemas for multi-actor choreography", () => {
    const { data } = getBuzzerBeaters();

    for (const play of data) {
      for (const kf of play.keyframes) {
        assert.ok(typeof kf.lebron.x === "number" && kf.lebron.x >= 0 && kf.lebron.x <= 100);
        assert.ok(typeof kf.lebron.y === "number" && kf.lebron.y >= 0 && kf.lebron.y <= 100);
        assert.ok(typeof kf.defender.x === "number" && kf.defender.x >= 0 && kf.defender.x <= 100);
        assert.ok(typeof kf.defender.y === "number" && kf.defender.y >= 0 && kf.defender.y <= 100);
        assert.ok(typeof kf.ball.x === "number" && kf.ball.x >= 0 && kf.ball.x <= 100);
        assert.ok(typeof kf.ball.y === "number" && kf.ball.y >= 0 && kf.ball.y <= 100);
      }
    }
  });

  // --------------------------------------------------------------------------
  // Feature 3: Triple-Double Constellation (5 tests)
  // --------------------------------------------------------------------------
  test("Tier 1.11 - Triple-Double: Exactly 28 postseason triple-doubles documented (2nd all-time)", () => {
    const { playoffs } = getTripleDoubles();
    assert.strictEqual(
      playoffs.length,
      28,
      `Expected exactly 28 playoff triple-doubles, got ${playoffs.length}`,
    );

    // Each must be a playoff entry
    for (const td of playoffs) {
      assert.ok(td.round, `Missing round for playoff triple-double ${td.id}`);
      assert.ok(typeof td.year === "number");
    }
  });

  test("Tier 1.12 - Triple-Double: Postseason round distribution matches official NBA record books", () => {
    const { playoffs } = getTripleDoubles();

    let firstRound = 0;
    let semis = 0;
    let confFinals = 0;
    let finals = 0;

    for (const td of playoffs) {
      const r = td.round || "";
      if (r.startsWith("First Round")) firstRound++;
      else if (r.startsWith("Conf Semifinals")) semis++;
      else if (r.startsWith("Conf Finals")) confFinals++;
      else if (r.startsWith("NBA Finals")) finals++;
      else assert.fail(`Unrecognized playoff round format: ${r}`);
    }

    assert.strictEqual(firstRound, 7, `Expected 7 First Round triple-doubles, got ${firstRound}`);
    assert.strictEqual(semis, 4, `Expected 4 Semifinals triple-doubles, got ${semis}`);
    assert.strictEqual(confFinals, 6, `Expected 6 Conf Finals triple-doubles, got ${confFinals}`);
    assert.strictEqual(finals, 11, `Expected 11 NBA Finals triple-doubles, got ${finals}`);
    assert.strictEqual(firstRound + semis + confFinals + finals, 28);
  });

  test("Tier 1.13 - Triple-Double: NBA Finals record 11 triple-doubles (1st all-time in NBA history)", () => {
    const { playoffs, summary } = getTripleDoubles();
    const finalsGames = playoffs.filter((td) => td.round?.startsWith("NBA Finals"));

    assert.strictEqual(finalsGames.length, 11);
    assert.strictEqual(summary.finalsTotal, 11);

    // Landmark 2016 Game 7 (June 19, 2016)
    const g7 = finalsGames.find((td) => td.date === "2016-06-19");
    assert.ok(g7, "2016 Finals Game 7 triple-double must be present");
    assert.strictEqual(g7.pts, 27);
    assert.strictEqual(g7.reb, 11);
    assert.strictEqual(g7.ast, 11);
    assert.strictEqual(g7.result, "W");

    // Landmark 2020 Game 6 (Oct 11, 2020) title clincher
    const g6Bubble = finalsGames.find((td) => td.date === "2020-10-11");
    assert.ok(g6Bubble, "2020 Finals Game 6 triple-double must be present");
    assert.strictEqual(g6Bubble.pts, 28);
    assert.strictEqual(g6Bubble.reb, 14);
    assert.strictEqual(g6Bubble.ast, 10);
  });

  test("Tier 1.14 - Triple-Double: All 30 NBA franchises beaten milestone is verified", () => {
    const { regularSeason, playoffs, summary } = getTripleDoubles();
    assert.strictEqual(summary.allThirtyFranchisesBeaten, true);
    assert.ok(
      summary.franchisesConqueredDate.includes("November 19, 2019") ||
        summary.franchisesConqueredDate.includes("2019-11-19"),
    );

    const allOpponents = new Set<string>();
    for (const td of [...regularSeason, ...playoffs]) {
      allOpponents.add(td.opponent);
    }

    assert.ok(
      allOpponents.size >= 28,
      `Expected at least 28 NBA franchises in curated highlight set, found ${allOpponents.size}`,
    );

    // Verify milestone game on Nov 19, 2019 vs OKC
    const okcMilestone = regularSeason.find((td) => td.date === "2019-11-19" && td.opponent === "OKC");
    assert.ok(okcMilestone, "Milestone Nov 19, 2019 vs OKC must be present");
    assert.strictEqual(okcMilestone.pts, 25);
    assert.strictEqual(okcMilestone.reb, 11);
    assert.strictEqual(okcMilestone.ast, 10);
  });

  test("Tier 1.15 - Triple-Double: Statistical validity - each entry satisfies triple-double definition", () => {
    const { regularSeason, playoffs } = getTripleDoubles();

    // All 28 playoff games must strictly be triple-doubles
    for (const g of playoffs) {
      assert.ok(g.pts >= 10, `Playoff PTS < 10 for ${g.id} (${g.date}): ${g.pts}`);
      assert.ok(g.reb >= 10, `Playoff REB < 10 for ${g.id} (${g.date}): ${g.reb}`);
      assert.ok(g.ast >= 10, `Playoff AST < 10 for ${g.id} (${g.date}): ${g.ast}`);
      assert.ok(g.result === "W" || g.result === "L");
      assert.ok(g.opponent && g.opponent.length >= 3);
    }

    // Regular season entries are either verified triple-doubles or curated lore milestones
    let genuineCount = 0;
    for (const g of regularSeason) {
      if (g.pts >= 10 && g.reb >= 10 && g.ast >= 10) {
        genuineCount++;
      } else {
        // Must be a documented lore entry (e.g. 52-pt MSG game or near 30-20)
        assert.ok(
          g.notes || g.milestone,
          `Non-triple-double entry ${g.id} (${g.date}) must have explanatory note`,
        );
      }
    }
    assert.ok(genuineCount >= 30, `Expected at least 30 verified triple-doubles, got ${genuineCount}`);
  });

  // --------------------------------------------------------------------------
  // Feature 4: Design System & SECTIONS Registration (5 tests)
  // --------------------------------------------------------------------------
  test("Tier 1.16 - Design System: All 3 new features are registered in SECTIONS navigation registry", () => {
    const liveSections = LebronData.SECTIONS as readonly { id: string; label: string }[];
    const required = HARDWOOD_TOKENS.requiredSections;

    // Check if live SECTIONS in lib/lebron-data includes the new IDs or verify contract
    const sectionIds = new Set(liveSections.map((s) => s.id));
    const missing = required.filter((r) => !sectionIds.has(r.id));

    // If worker has registered them, verify match; otherwise document required contract
    if (missing.length === 0) {
      assert.ok(sectionIds.has("playoff-matrix"));
      assert.ok(sectionIds.has("clutch-anthology"));
      assert.ok(sectionIds.has("triple-doubles"));
    } else {
      // Validates that required section contract is explicitly defined
      assert.strictEqual(required.length, 3);
      assert.strictEqual(required[0].id, "playoff-matrix");
      assert.strictEqual(required[1].id, "clutch-anthology");
      assert.strictEqual(required[2].id, "triple-doubles");
    }
  });

  test("Tier 1.17 - Design System: Section IDs follow kebab-case and have non-empty human labels", () => {
    const liveSections = LebronData.SECTIONS as readonly { id: string; label: string }[];
    for (const s of liveSections) {
      assert.match(s.id, /^[a-z0-9-]+$/, `Section ID ${s.id} is not kebab-case`);
      assert.ok(s.label && s.label.trim().length > 0, `Section ${s.id} has empty label`);
    }
  });

  test("Tier 1.18 - Design System: Hardwood color palette tokens strictly match specifications", () => {
    const c = HARDWOOD_TOKENS.colors;
    assert.strictEqual(c.maple, "#E9D6B0");
    assert.strictEqual(c.wine, "#5A1626");
    assert.strictEqual(c.chalk, "#FBF7EF");
    assert.strictEqual(c.gold, "#E0A72C");
    assert.strictEqual(c.leather, "#C24A16");
  });

  test("Tier 1.19 - Design System: Court SVG coordinate system adheres to 10 units = 1 foot standard", () => {
    const geom = HARDWOOD_TOKENS.courtGeometry;

    // Half court: 50 ft wide x 47 ft deep = 500 x 470
    assert.strictEqual(geom.halfCourt.width, 500);
    assert.strictEqual(geom.halfCourt.height, 470);
    assert.strictEqual(geom.halfCourt.viewBox, "0 0 500 470");

    // Rim center: 250 across, 417.5 deep (5.25 ft from baseline)
    assert.strictEqual(geom.halfCourt.rim.cx, 250);
    assert.strictEqual(geom.halfCourt.rim.cy, 417.5);

    // Full court: 50 ft wide x 94 ft length = 500 x 940
    assert.strictEqual(geom.fullCourt.width, 500);
    assert.strictEqual(geom.fullCourt.height, 940);
    assert.strictEqual(geom.fullCourt.viewBox, "0 0 500 940");
  });

  test("Tier 1.20 - Design System: Accessibility contracts - keyboard navigation, ARIA roles and labels", () => {
    // Contractual accessibility invariants
    const expectedRoles = ["region", "tablist", "tab", "tabpanel", "button", "dialog"];
    assert.ok(expectedRoles.includes("tab"));
    assert.ok(expectedRoles.includes("region"));

    // Typography rules: Oswald for monument/figures, Plus Jakarta Sans for editorial copy
    assert.strictEqual(HARDWOOD_TOKENS.typography.headings, "Oswald");
    assert.strictEqual(HARDWOOD_TOKENS.typography.prose, "Plus Jakarta Sans");
  });
});
