export interface ChalkboardCoordinates {
  x: number;
  y: number;
  elevation?: number;
}

export interface ChalkboardTelemetry {
  clock: string;
  speed: string;
  distance: string;
  action: string;
}

export interface ChalkboardKeyframe {
  step: number;
  time?: number;
  clock: string;
  description: string;
  annotation?: string;
  lebron: ChalkboardCoordinates;
  ball?: ChalkboardCoordinates;
  defender?: ChalkboardCoordinates;
  passer?: ChalkboardCoordinates;
  inbounder?: ChalkboardCoordinates;
  telemetry?: ChalkboardTelemetry;
}

export interface BuzzerBeaterPlay {
  id: string;
  date: string;
  isoDate?: string;
  season?: string;
  seasonYear: number;
  year?: number;
  opponent: string;
  opponentName?: string;
  round: string;
  roundShort?: string;
  game?: string;
  gameNumber: number;
  team: string;
  venue?: string;
  scoreBefore: string;
  scoreAfter: string;
  result?: string;
  clockRemaining: string;
  shotDistance: string;
  shotType: string;
  courtZone?: string;
  seriesContext: string;
  seriesSituationBefore?: string;
  seriesImpact?: string;
  inbounder: string;
  primaryDefender: string;
  screener?: string;
  broadcastCall: string;
  broadcastCallObj?: { caller: string; network: string; quote: string };
  announcer: string;
  description?: string;
  viewBox: "0 0 500 470" | "0 0 500 940";
  isFullCourt: boolean;
  keyframes: ChalkboardKeyframe[];
}

export type ClutchBuzzerBeater = BuzzerBeaterPlay;

export const CLUTCH_BUZZER_BEATERS: readonly BuzzerBeaterPlay[] = [
  {
    "id": "clutch-2009-magic",
    "date": "May 22, 2009",
    "isoDate": "2009-05-22",
    "season": "2008-09",
    "seasonYear": 2009,
    "year": 2009,
    "round": "Eastern Conference Finals",
    "roundShort": "ECF",
    "game": "Game 2",
    "gameNumber": 2,
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
    "seriesContext": "CLE trailed 0\u20131 (lost Game 1 at home 106\u2013107)",
    "seriesImpact": "Tied series 1\u20131; prevented 0\u20132 hole heading to Orlando; iconic shot of his early career.",
    "broadcastCall": "Williams into James... for three... YES! IT GOES IN AT THE BUZZER! LEBRON JAMES DELIVERS AT THE BUZZER!",
    "broadcastCallObj": {
      "caller": "Marv Albert",
      "network": "TNT",
      "quote": "Williams into James... for three... YES! IT GOES IN AT THE BUZZER! LEBRON JAMES DELIVERS AT THE BUZZER!"
    },
    "announcer": "Marv Albert, TNT",
    "description": "After Hedo Turkoglu sank a go-ahead jumper with 1.0 second on the clock, Cleveland faced a 0-1 deficit heading to Orlando. Out of a timeout, Mo Williams delivered a pinpoint inbounds pass to LeBron, who curled around double screens to the top of the key, caught cleanly, squared in mid-air, and drilled a 25-foot three-pointer over Turkoglu as the red horn sounded.",
    "viewBox": "0 0 500 470",
    "isFullCourt": false,
    "keyframes": [
      {
        "step": 0,
        "time": 0.0,
        "clock": "1.0s",
        "description": "Timeout ends. Mo Williams sets up at the sideline hash. LeBron starts at the right elbow, flanked by Turkoglu.",
        "annotation": "Timeout ends. Mo Williams sets up at the sideline hash. LeBron starts at the right elbow, flanked by Turkoglu.",
        "lebron": {
          "x": 62,
          "y": 74,
          "elevation": 0
        },
        "ball": {
          "x": 4,
          "y": 64,
          "elevation": 0
        },
        "defender": {
          "x": 64,
          "y": 76
        },
        "passer": {
          "x": 4,
          "y": 64
        },
        "inbounder": {
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
        "step": 1,
        "time": 0.3,
        "clock": "0.8s",
        "description": "LeBron cuts hard across the lane toward the left wing, then abruptly plants and redirects toward the top of the key.",
        "annotation": "LeBron cuts hard across the lane toward the left wing, then abruptly plants and redirects toward the top of the key.",
        "lebron": {
          "x": 56,
          "y": 66,
          "elevation": 0
        },
        "ball": {
          "x": 18,
          "y": 65,
          "elevation": 0
        },
        "defender": {
          "x": 60,
          "y": 70
        },
        "passer": {
          "x": 4,
          "y": 64
        },
        "inbounder": {
          "x": 4,
          "y": 64
        },
        "telemetry": {
          "clock": "0.8s",
          "speed": "14.2 mph",
          "distance": "25 ft",
          "action": "Curling off screen"
        }
      },
      {
        "step": 2,
        "time": 0.6,
        "clock": "0.5s",
        "description": "LeBron gathers the pass at 25 feet with both hands, establishes his pivot, and elevates straight up.",
        "annotation": "LeBron gathers the pass at 25 feet with both hands, establishes his pivot, and elevates straight up.",
        "lebron": {
          "x": 50,
          "y": 62,
          "elevation": 0
        },
        "ball": {
          "x": 50,
          "y": 62,
          "elevation": 0
        },
        "defender": {
          "x": 53,
          "y": 65
        },
        "passer": {
          "x": 4,
          "y": 64
        },
        "inbounder": {
          "x": 4,
          "y": 64
        },
        "telemetry": {
          "clock": "0.5s",
          "speed": "4.1 mph",
          "distance": "25 ft",
          "action": "Catch & elevate"
        }
      },
      {
        "step": 3,
        "time": 0.8,
        "clock": "0.2s",
        "description": "LeBron releases at the apex over Turkoglu's lunging contest. The backboard lights red as the ball hangs in the air.",
        "annotation": "LeBron releases at the apex over Turkoglu's lunging contest. The backboard lights red as the ball hangs in the air.",
        "lebron": {
          "x": 50,
          "y": 62,
          "elevation": 8
        },
        "ball": {
          "x": 50,
          "y": 74,
          "elevation": 12
        },
        "defender": {
          "x": 52,
          "y": 64
        },
        "passer": {
          "x": 4,
          "y": 64
        },
        "inbounder": {
          "x": 4,
          "y": 64
        },
        "telemetry": {
          "clock": "0.2s",
          "speed": "0.0 mph",
          "distance": "25 ft",
          "action": "Release, ball in the air"
        }
      },
      {
        "step": 4,
        "time": 1.0,
        "clock": "0.0s",
        "description": "SWISH! The ball snaps the twine. Quicken Loans Arena detonates as LeBron sprints backwards into his teammates' arms.",
        "annotation": "SWISH! The ball snaps the twine. Quicken Loans Arena detonates as LeBron sprints backwards into his teammates' arms.",
        "lebron": {
          "x": 48,
          "y": 55,
          "elevation": 10
        },
        "ball": {
          "x": 50,
          "y": 88,
          "elevation": 10
        },
        "defender": {
          "x": 52,
          "y": 68
        },
        "passer": {
          "x": 10,
          "y": 64
        },
        "inbounder": {
          "x": 10,
          "y": 64
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
    "seasonYear": 2013,
    "year": 2013,
    "round": "Eastern Conference Finals",
    "roundShort": "ECF",
    "game": "Game 1",
    "gameNumber": 1,
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
    "seriesContext": "Game 1 of Conference Finals",
    "seriesImpact": "Secured Game 1 in overtime; capitalized on Frank Vogel benching Roy Hibbert; propelled Miami toward 7-game series victory.",
    "broadcastCall": "Battier... to James, gets into the lane... at the buzzer, it counts! He makes the layup at the buzzer! LeBron James wins it for Miami!",
    "broadcastCallObj": {
      "caller": "Marv Albert",
      "network": "TNT",
      "quote": "Battier... to James, gets into the lane... at the buzzer, it counts! He makes the layup at the buzzer! LeBron James wins it for Miami!"
    },
    "announcer": "Marv Albert, TNT",
    "description": "With 2.2 seconds left in overtime and Indiana leading by one, Pacers coach Frank Vogel subbed 7-foot-2 rim protector Roy Hibbert to the bench to guard against a 3-pointer. Shane Battier inbounded to LeBron at the left wing. Sizing up Paul George, LeBron executed a lightning-fast left-to-right crossover, blew past George's right hip, and glided to the unprotected rim for a left-handed layup as the horn sounded.",
    "viewBox": "0 0 500 470",
    "isFullCourt": false,
    "keyframes": [
      {
        "step": 0,
        "time": 0.0,
        "clock": "2.2s",
        "description": "Shane Battier lines up the inbound at the left sideline. Frank Vogel benches Roy Hibbert; lane is unprotected.",
        "annotation": "Shane Battier lines up the inbound at the left sideline. Frank Vogel benches Roy Hibbert; lane is unprotected.",
        "lebron": {
          "x": 28,
          "y": 66,
          "elevation": 0
        },
        "ball": {
          "x": 4,
          "y": 68,
          "elevation": 0
        },
        "defender": {
          "x": 29,
          "y": 69
        },
        "passer": {
          "x": 4,
          "y": 68
        },
        "inbounder": {
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
        "step": 1,
        "time": 0.5,
        "clock": "1.7s",
        "description": "Battier zips a pass into LeBron's chest at the three-point arc. Paul George crowds his right side to deny the pull-up.",
        "annotation": "Battier zips a pass into LeBron's chest at the three-point arc. Paul George crowds his right side to deny the pull-up.",
        "lebron": {
          "x": 26,
          "y": 68,
          "elevation": 0
        },
        "ball": {
          "x": 26,
          "y": 68,
          "elevation": 0
        },
        "defender": {
          "x": 28,
          "y": 70
        },
        "passer": {
          "x": 4,
          "y": 68
        },
        "inbounder": {
          "x": 4,
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
        "step": 2,
        "time": 1.2,
        "clock": "1.0s",
        "description": "LeBron rips through with a devastating left-hand drive, blowing past George into the vacant heart of the paint.",
        "annotation": "LeBron rips through with a devastating left-hand drive, blowing past George into the vacant heart of the paint.",
        "lebron": {
          "x": 38,
          "y": 78,
          "elevation": 0
        },
        "ball": {
          "x": 38,
          "y": 78,
          "elevation": 0
        },
        "defender": {
          "x": 33,
          "y": 75
        },
        "passer": {
          "x": 6,
          "y": 68
        },
        "inbounder": {
          "x": 6,
          "y": 68
        },
        "telemetry": {
          "clock": "1.0s",
          "speed": "17.8 mph",
          "distance": "12 ft",
          "action": "Downhill attack"
        }
      },
      {
        "step": 3,
        "time": 1.8,
        "clock": "0.3s",
        "description": "LeBron takes off off two feet at the edge of the charge circle, shielding the ball with his body against George's trailing hand.",
        "annotation": "LeBron takes off off two feet at the edge of the charge circle, shielding the ball with his body against George's trailing hand.",
        "lebron": {
          "x": 47,
          "y": 86,
          "elevation": 8
        },
        "ball": {
          "x": 48,
          "y": 87,
          "elevation": 12
        },
        "defender": {
          "x": 43,
          "y": 82
        },
        "passer": {
          "x": 8,
          "y": 68
        },
        "inbounder": {
          "x": 8,
          "y": 68
        },
        "telemetry": {
          "clock": "0.3s",
          "speed": "12.4 mph",
          "distance": "3 ft",
          "action": "Elevation to rim"
        }
      },
      {
        "step": 4,
        "time": 2.2,
        "clock": "0.0s",
        "description": "Left-handed scoop rolls gently off the glass and falls through the net as the buzzer blares! Heat win 103-102.",
        "annotation": "Left-handed scoop rolls gently off the glass and falls through the net as the buzzer blares! Heat win 103-102.",
        "lebron": {
          "x": 49,
          "y": 88,
          "elevation": 10
        },
        "ball": {
          "x": 50,
          "y": 88,
          "elevation": 10
        },
        "defender": {
          "x": 46,
          "y": 86
        },
        "passer": {
          "x": 10,
          "y": 68
        },
        "inbounder": {
          "x": 10,
          "y": 68
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
    "seasonYear": 2015,
    "year": 2015,
    "round": "Eastern Conference Semifinals",
    "roundShort": "ECS",
    "game": "Game 4",
    "gameNumber": 4,
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
    "seriesContext": "CLE trailed 1\u20132 (facing potential 1\u20133 deficit after Derrick Rose G3 buzzer-beater)",
    "seriesImpact": "Evens series 2\u20132; saves Cavaliers' season; ignited 3-game win streak to win series 4\u20132.",
    "broadcastCall": "Dellavedova inbounds... James, fires from the corner... IT'S GOOD! AT THE BUZZER! LEBRON JAMES WINS IT FOR CLEVELAND!",
    "broadcastCallObj": {
      "caller": "Mike Breen",
      "network": "ABC",
      "quote": "Dellavedova inbounds... James, fires from the corner... IT'S GOOD! AT THE BUZZER! LEBRON JAMES WINS IT FOR CLEVELAND!"
    },
    "announcer": "Mike Breen, ABC",
    "description": "Facing an existential 1-3 series hole after Derrick Rose's Game 3 bank shot, Cleveland found themselves tied 84-84 with 1.5 seconds remaining. Coach David Blatt diagrammed a play with LeBron inbounding. LeBron scratched the play: 'Give me the ball. Just get me the ball out of bounds, we're either going to overtime or I'm going to make the shot.' Matthew Dellavedova fired a cross-court bullet to the left corner. LeBron caught, faded away over Jimmy Butler's contest, and buried the 21-footer at the horn.",
    "viewBox": "0 0 500 470",
    "isFullCourt": false,
    "keyframes": [
      {
        "step": 0,
        "time": 0.0,
        "clock": "1.5s",
        "description": "The Scratch: LeBron vetoes coach Blatt's play in the huddle. Dellavedova prepares to inbound from the far right sideline.",
        "annotation": "The Scratch: LeBron vetoes coach Blatt's play in the huddle. Dellavedova prepares to inbound from the far right sideline.",
        "lebron": {
          "x": 52,
          "y": 80,
          "elevation": 0
        },
        "ball": {
          "x": 96,
          "y": 70,
          "elevation": 0
        },
        "defender": {
          "x": 50,
          "y": 78
        },
        "passer": {
          "x": 96,
          "y": 70
        },
        "inbounder": {
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
        "step": 1,
        "time": 0.4,
        "clock": "1.2s",
        "description": "LeBron fakes a cut toward the rim, planting his right foot to send Jimmy Butler leaning into the paint.",
        "annotation": "LeBron fakes a cut toward the rim, planting his right foot to send Jimmy Butler leaning into the paint.",
        "lebron": {
          "x": 42,
          "y": 82,
          "elevation": 0
        },
        "ball": {
          "x": 96,
          "y": 70,
          "elevation": 0
        },
        "defender": {
          "x": 44,
          "y": 80
        },
        "passer": {
          "x": 96,
          "y": 70
        },
        "inbounder": {
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
        "step": 2,
        "time": 0.8,
        "clock": "0.9s",
        "description": "LeBron flares out to the deep left baseline corner. Dellavedova zips a laser pass across the court.",
        "annotation": "LeBron flares out to the deep left baseline corner. Dellavedova zips a laser pass across the court.",
        "lebron": {
          "x": 12,
          "y": 86,
          "elevation": 0
        },
        "ball": {
          "x": 45,
          "y": 80,
          "elevation": 0
        },
        "defender": {
          "x": 20,
          "y": 84
        },
        "passer": {
          "x": 96,
          "y": 70
        },
        "inbounder": {
          "x": 96,
          "y": 70
        },
        "telemetry": {
          "clock": "0.9s",
          "speed": "15.0 mph",
          "distance": "21 ft",
          "action": "Flare to corner"
        }
      },
      {
        "step": 3,
        "time": 1.2,
        "clock": "0.3s",
        "description": "LeBron catches in the left corner, plants his feet, and rises into a high-arcing turnaround fadeaway over Butler's outstretched hand.",
        "annotation": "LeBron catches in the left corner, plants his feet, and rises into a high-arcing turnaround fadeaway over Butler's outstretched hand.",
        "lebron": {
          "x": 10,
          "y": 87,
          "elevation": 8
        },
        "ball": {
          "x": 10,
          "y": 87,
          "elevation": 12
        },
        "defender": {
          "x": 14,
          "y": 87
        },
        "passer": {
          "x": 94,
          "y": 70
        },
        "inbounder": {
          "x": 94,
          "y": 70
        },
        "telemetry": {
          "clock": "0.3s",
          "speed": "2.2 mph",
          "distance": "21 ft",
          "action": "Turnaround fadeaway"
        }
      },
      {
        "step": 4,
        "time": 1.5,
        "clock": "0.0s",
        "description": "Breen yells 'IT'S GOOD! AT THE BUZZER!' as the shot snaps cleanly through the cords. Cavaliers bench rushes the floor.",
        "annotation": "Breen yells 'IT'S GOOD! AT THE BUZZER!' as the shot snaps cleanly through the cords. Cavaliers bench rushes the floor.",
        "lebron": {
          "x": 8,
          "y": 87,
          "elevation": 10
        },
        "ball": {
          "x": 50,
          "y": 88,
          "elevation": 10
        },
        "defender": {
          "x": 13,
          "y": 87
        },
        "passer": {
          "x": 90,
          "y": 70
        },
        "inbounder": {
          "x": 90,
          "y": 70
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
    "seasonYear": 2018,
    "year": 2018,
    "round": "Eastern Conference First Round",
    "roundShort": "EC1",
    "game": "Game 5",
    "gameNumber": 5,
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
    "seriesContext": "Series tied 2\u20132 (pivotal Game 5 in Cleveland)",
    "seriesImpact": "Put Cavaliers ahead 3\u20132 in grueling 7-game dogfight; capped back-to-back clutch plays (block on Oladipo + buzzer-beater).",
    "broadcastCall": "Green to inbound... gets it to James. 2 seconds... 1 second... for the win... HE HITS IT! LEBRON JAMES WITH A THREE AT THE BUZZER!",
    "broadcastCallObj": {
      "caller": "Mike Breen",
      "network": "TNT / NBA on ABC",
      "quote": "Green to inbound... gets it to James. 2 seconds... 1 second... for the win... HE HITS IT! LEBRON JAMES WITH A THREE AT THE BUZZER!"
    },
    "announcer": "Mike Breen, TNT / NBA on ABC",
    "description": "With five seconds left in a tied 95-95 game, Victor Oladipo attacked the rim for a potential game-winning layup. LeBron raced from behind and pinned Oladipo's shot against the glass with 3.0 seconds remaining. Cleveland called timeout. Jeff Green inbounded to LeBron at mid-court. LeBron took two decisive dribbles left against Thaddeus Young, stepped back straight-on at 26 feet, and drilled the game-winning three at the horn before leaping onto the scorer's table.",
    "viewBox": "0 0 500 470",
    "isFullCourt": false,
    "keyframes": [
      {
        "step": 0,
        "time": 0.0,
        "clock": "3.0s",
        "description": "The Block: 3.0s earlier, LeBron swatted Victor Oladipo's layup against the backboard at (50, 88). Timeout Cavaliers.",
        "annotation": "The Block: 3.0s earlier, LeBron swatted Victor Oladipo's layup against the backboard at (50, 88). Timeout Cavaliers.",
        "lebron": {
          "x": 50,
          "y": 88,
          "elevation": 0
        },
        "ball": {
          "x": 4,
          "y": 55,
          "elevation": 0
        },
        "defender": {
          "x": 50,
          "y": 87
        },
        "passer": {
          "x": 4,
          "y": 55
        },
        "inbounder": {
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
        "step": 1,
        "time": 0.8,
        "clock": "2.4s",
        "description": "Jeff Green inbounds from the sideline. LeBron catches on the dead run at the Cavaliers logo (50, 52).",
        "annotation": "Jeff Green inbounds from the sideline. LeBron catches on the dead run at the Cavaliers logo (50, 52).",
        "lebron": {
          "x": 50,
          "y": 52,
          "elevation": 0
        },
        "ball": {
          "x": 50,
          "y": 52,
          "elevation": 0
        },
        "defender": {
          "x": 50,
          "y": 56
        },
        "passer": {
          "x": 4,
          "y": 55
        },
        "inbounder": {
          "x": 4,
          "y": 55
        },
        "telemetry": {
          "clock": "2.4s",
          "speed": "12.3 mph",
          "distance": "36 ft",
          "action": "Inbound reception"
        }
      },
      {
        "step": 2,
        "time": 1.6,
        "clock": "1.4s",
        "description": "LeBron takes two heavy rhythmic dribbles to his left, using his frame to bump Thaddeus Young off balance.",
        "annotation": "LeBron takes two heavy rhythmic dribbles to his left, using his frame to bump Thaddeus Young off balance.",
        "lebron": {
          "x": 46,
          "y": 59,
          "elevation": 0
        },
        "ball": {
          "x": 46,
          "y": 59,
          "elevation": 0
        },
        "defender": {
          "x": 48,
          "y": 62
        },
        "passer": {
          "x": 6,
          "y": 55
        },
        "inbounder": {
          "x": 6,
          "y": 55
        },
        "telemetry": {
          "clock": "1.4s",
          "speed": "10.0 mph",
          "distance": "29 ft",
          "action": "Left-hand pound dribble"
        }
      },
      {
        "step": 3,
        "time": 2.4,
        "clock": "0.5s",
        "description": "LeBron plants both sneakers, executes a subtle gather-step back, and elevates from 26 feet straight-on.",
        "annotation": "LeBron plants both sneakers, executes a subtle gather-step back, and elevates from 26 feet straight-on.",
        "lebron": {
          "x": 48,
          "y": 62,
          "elevation": 8
        },
        "ball": {
          "x": 48,
          "y": 62,
          "elevation": 12
        },
        "defender": {
          "x": 49,
          "y": 65
        },
        "passer": {
          "x": 8,
          "y": 55
        },
        "inbounder": {
          "x": 8,
          "y": 55
        },
        "telemetry": {
          "clock": "0.5s",
          "speed": "2.1 mph",
          "distance": "26 ft",
          "action": "Elevation from logo"
        }
      },
      {
        "step": 4,
        "time": 3.0,
        "clock": "0.0s",
        "description": "The shot splashes true! LeBron sprints straight toward the scorer's table, leaping atop it with arms outstretched as the building shakes.",
        "annotation": "The shot splashes true! LeBron sprints straight toward the scorer's table, leaping atop it with arms outstretched as the building shakes.",
        "lebron": {
          "x": 50,
          "y": 62,
          "elevation": 10
        },
        "ball": {
          "x": 50,
          "y": 88,
          "elevation": 10
        },
        "defender": {
          "x": 49,
          "y": 67
        },
        "passer": {
          "x": 12,
          "y": 55
        },
        "inbounder": {
          "x": 12,
          "y": 55
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
    "seasonYear": 2018,
    "year": 2018,
    "round": "Eastern Conference Semifinals",
    "roundShort": "ECS",
    "game": "Game 3",
    "gameNumber": 3,
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
    "seriesContext": "CLE led 2\u20130 (having won Games 1 & 2 in Toronto)",
    "seriesImpact": "Takes 3\u20130 stranglehold; broke the spirit of 59-win Raptors; cemented the 'LeBronto' era before Game 4 sweep.",
    "broadcastCall": "James on the run... floats it up... BANKS IT IN! HE BANKS IT IN AT THE BUZZER! LEBRON JAMES DOES IT AGAIN!",
    "broadcastCallObj": {
      "caller": "Brian Anderson",
      "network": "TNT",
      "quote": "James on the run... floats it up... BANKS IT IN! HE BANKS IT IN AT THE BUZZER! LEBRON JAMES DOES IT AGAIN!"
    },
    "announcer": "Brian Anderson, TNT",
    "description": "After OG Anunoby nailed a stunning game-tying 3-pointer with 8.0 seconds left, Cleveland had no timeouts. Jeff Green quickly inbounded under the Cavaliers' own basket. LeBron caught the ball on the dead sprint, stormed coast-to-coast down the left side of the floor, veered around OG Anunoby and CJ Miles, jumped off his right foot from 12 feet, and banked a one-handed running teardrop softly off the glass as time expired.",
    "viewBox": "0 0 500 940",
    "isFullCourt": true,
    "keyframes": [
      {
        "step": 0,
        "time": 0.0,
        "clock": "8.0s",
        "description": "OG Anunoby ties game with 8.0s left. Cleveland has no timeouts. Jeff Green inbounds under Cleveland's own hoop.",
        "annotation": "OG Anunoby ties game with 8.0s left. Cleveland has no timeouts. Jeff Green inbounds under Cleveland's own hoop.",
        "lebron": {
          "x": 48,
          "y": 8,
          "elevation": 0
        },
        "ball": {
          "x": 50,
          "y": 4,
          "elevation": 0
        },
        "defender": {
          "x": 45,
          "y": 25
        },
        "passer": {
          "x": 50,
          "y": 4
        },
        "inbounder": {
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
        "step": 1,
        "time": 2.5,
        "clock": "5.5s",
        "description": "LeBron catches in full stride and blazes across half court at 19.4 mph, pushing through Toronto's backpedaling defense.",
        "annotation": "LeBron catches in full stride and blazes across half court at 19.4 mph, pushing through Toronto's backpedaling defense.",
        "lebron": {
          "x": 42,
          "y": 50,
          "elevation": 0
        },
        "ball": {
          "x": 42,
          "y": 50,
          "elevation": 0
        },
        "defender": {
          "x": 40,
          "y": 58
        },
        "passer": {
          "x": 48,
          "y": 15
        },
        "inbounder": {
          "x": 48,
          "y": 15
        },
        "telemetry": {
          "clock": "5.5s",
          "speed": "19.4 mph",
          "distance": "44 ft",
          "action": "Open-floor acceleration"
        }
      },
      {
        "step": 2,
        "time": 5.2,
        "clock": "2.8s",
        "description": "LeBron angles toward the left side of the paint, keeping OG Anunoby on his hip and absorbing contact.",
        "annotation": "LeBron angles toward the left side of the paint, keeping OG Anunoby on his hip and absorbing contact.",
        "lebron": {
          "x": 34,
          "y": 74,
          "elevation": 0
        },
        "ball": {
          "x": 34,
          "y": 74,
          "elevation": 0
        },
        "defender": {
          "x": 36,
          "y": 77
        },
        "passer": {
          "x": 44,
          "y": 35
        },
        "inbounder": {
          "x": 44,
          "y": 35
        },
        "telemetry": {
          "clock": "2.8s",
          "speed": "15.1 mph",
          "distance": "20 ft",
          "action": "Angled drive left"
        }
      },
      {
        "step": 3,
        "time": 7.0,
        "clock": "1.0s",
        "description": "LeBron launches off his right foot from 12 feet, floating laterally toward the sideline while squaring his eyes to the backboard.",
        "annotation": "LeBron launches off his right foot from 12 feet, floating laterally toward the sideline while squaring his eyes to the backboard.",
        "lebron": {
          "x": 36,
          "y": 82,
          "elevation": 8
        },
        "ball": {
          "x": 36,
          "y": 82,
          "elevation": 12
        },
        "defender": {
          "x": 38,
          "y": 83
        },
        "passer": {
          "x": 42,
          "y": 50
        },
        "inbounder": {
          "x": 42,
          "y": 50
        },
        "telemetry": {
          "clock": "1.0s",
          "speed": "9.8 mph",
          "distance": "12 ft",
          "action": "One-footed bank floater"
        }
      },
      {
        "step": 4,
        "time": 8.0,
        "clock": "0.0s",
        "description": "The high-arching push shot kisses the top-left square of the glass and drops in as the horn expires! Cavaliers win 105-103!",
        "annotation": "The high-arching push shot kisses the top-left square of the glass and drops in as the horn expires! Cavaliers win 105-103!",
        "lebron": {
          "x": 34,
          "y": 86,
          "elevation": 10
        },
        "ball": {
          "x": 50,
          "y": 88,
          "elevation": 10
        },
        "defender": {
          "x": 39,
          "y": 85
        },
        "passer": {
          "x": 40,
          "y": 60
        },
        "inbounder": {
          "x": 40,
          "y": 60
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
