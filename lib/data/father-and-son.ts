/* ---------------------------------------------------------------------------
 * FATHER & SON — The 21-year arc and the first father-son duo in NBA history
 * ------------------------------------------------------------------------- */

export interface GameComparisonNode {
  date: string;
  year: number;
  venue: string;
  city: string;
  opponent: string;
  lebronAge: string;
  bronnyStatus: string;
  context: string;
  boxScore: {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    min: string;
    fg: string;
  };
}

export interface FatherSonMilestone {
  year: number;
  date: string;
  title: string;
  lebronAge: number;
  bronnyAge: string;
  description: string;
}

export const FATHER_AND_SON = {
  heading: "Father & Son",
  subheading: "7,664 days. Two generations. One hardwood floor.",
  copy: "On October 29, 2003, an eighteen-year-old from Akron played his first NBA game in Sacramento. Bronny James was not yet born. On October 22, 2024, they stood side-by-side at the scorer’s table in Los Angeles — the first father and son in 78 years of NBA history to share an NBA floor.",
  quote:
    "“You see that scorer’s table right there? You ready? You see the intensity, right? Just play carefree, though.”",
  quoteAuthor: "LeBron to Bronny, checking in together with 4:00 left in the 2nd quarter",
  daysApart: 7664,
  yearsSpan: 21,
  /** The three sub-labels under the headline figures. Each restates a fact this
   *  module already holds — the two dates, the two ages, and the 78-year wait in
   *  `copy` — so they live beside that data rather than as literals in the
   *  component, where they could drift from the facts they describe. */
  plaque: {
    days: "October 29, 2003 to October 22, 2024",
    span: "Age 18 rookie to age 39 teammate",
    precedent: "Never before in 78 NBA seasons",
  },
  debutNight: {
    date: "October 29, 2003",
    year: 2003,
    venue: "ARCO Arena",
    city: "Sacramento, California",
    opponent: "Sacramento Kings",
    lebronAge: "18 years, 303 days",
    bronnyStatus: "Not yet born (born Oct 6, 2004)",
    context:
      "The most hyped high-school phenom in athletic history debuts before a capacity arena and national broadcast.",
    boxScore: {
      pts: 25,
      reb: 6,
      ast: 9,
      stl: 4,
      min: "42:50",
      fg: "12-20 (60.0%)",
    },
  } as GameComparisonNode,
  historyNight: {
    date: "October 22, 2024",
    year: 2024,
    venue: "Crypto.com Arena",
    city: "Los Angeles, California",
    opponent: "Minnesota Timberwolves",
    lebronAge: "39 years, 297 days",
    bronnyStatus: "20 years, 16 days (Rookie, Pick 55)",
    context:
      "Ken Griffey Sr. and Ken Griffey Jr. watch from courtside as LeBron and Bronny check into the game together.",
    boxScore: {
      pts: 16,
      reb: 5,
      ast: 4,
      // Basketball-Reference 202410220LAL: 34:39 | 7-16 FG | 1-4 3P |
      // 1-1 FT | 0 ORB, 5 DRB, 5 TRB | 4 AST | 0 STL | 2 BLK | 16 PTS.
      stl: 0,
      min: "34:39",
      fg: "7-16 (43.8%)",
    },
  } as GameComparisonNode,
  timeline: [
    {
      year: 2003,
      date: "Oct 29, 2003",
      title: "The NBA Debut",
      lebronAge: 18,
      bronnyAge: "Unborn",
      description:
        "LeBron scores 25 points in Sacramento at age 18. The 21-year clock begins ticking.",
    },
    {
      year: 2004,
      date: "Oct 6, 2004",
      title: "Bronny is Born",
      lebronAge: 19,
      bronnyAge: "0",
      description:
        "LeBron Raymone James Jr. is born in Cleveland, Ohio, three weeks before LeBron's second NBA season.",
    },
    {
      year: 2016,
      date: "June 19, 2016",
      title: "The Promise Kept",
      lebronAge: 31,
      bronnyAge: "11",
      description:
        "Bronny embraces his father on the Oracle Arena floor after Cleveland's historic Game 7 triumph.",
    },
    {
      year: 2023,
      date: "Feb 7, 2023",
      title: "All-Time Scoring Record",
      lebronAge: 38,
      bronnyAge: "18",
      description:
        "With Bronny filming courtside on his phone, LeBron hits the step-back fadeaway to surpass Kareem.",
    },
    {
      year: 2024,
      date: "June 27, 2024",
      title: "Draft Night Pick 55",
      lebronAge: 39,
      bronnyAge: "19",
      description:
        "The Los Angeles Lakers select Bronny James with the 55th pick in the 2024 NBA Draft.",
    },
    {
      year: 2024,
      date: "Oct 22, 2024",
      title: "History on the Floor",
      lebronAge: 39,
      bronnyAge: "20",
      description:
        "Opening Night: LeBron and Bronny check in simultaneously, becoming the first father-son duo in NBA history.",
    },
  ] as readonly FatherSonMilestone[],
} as const;
