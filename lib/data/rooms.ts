/* ---------------------------------------------------------------------------
 * THE ROOMS — pinned chapters
 * ------------------------------------------------------------------------- */

export interface Room {
  id: string;
  name: string;
  years: string;
  venue: string;
  jersey: string;
  stat: string;
  statLabel: string;
  copy: string;
  floor: string;
  paint: string;
  type: string;
  dim: string;
}

export const ROOMS_INTRO = {
  heading: "The rooms he has played in",
  copy: "An Akron high-school gym, three NBA cities, and two decades in national colours. Six rooms, one long argument.",
} as const;

export const ROOMS: Room[] = [
  {
    id: "akron",
    name: "Akron",
    years: "2000-2003",
    venue: "St. Vincent-St. Mary High School",
    jersey: "23",
    stat: "3",
    statLabel: "Ohio state titles",
    copy: "A high-school gym in Akron outgrew itself and moved its games to the university arena down the road. Three state titles, a national magazine cover at seventeen, and a growing sense that the NBA was a formality rather than an ambition.",
    floor: "#E7D6B4",
    paint: "#1E5B3A",
    type: "#231508",
    dim: "rgba(35,21,8,0.72)",
  },
  {
    id: "cle1",
    name: "Cleveland",
    years: "2003-2010",
    venue: "Cleveland Cavaliers",
    jersey: "23",
    stat: "2",
    statLabel: "MVP awards",
    copy: "The first overall pick went to the team down the road from where he grew up, and to a region that badly needed him to be as good as advertised. Rookie of the Year, back-to-back MVPs, and a Finals run in 2007 that arrived years before the roster around him did.",
    floor: "#5C1626",
    paint: "#E0A72C",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
  {
    id: "mia",
    name: "Miami",
    years: "2010-2014",
    venue: "Miami Heat",
    jersey: "6",
    stat: "2",
    statLabel: "Championships",
    copy: "He left, and the noise followed him south. Four seasons, four Finals, two rings. Miami is where the criticism turned into a two-way peak, and where the argument stopped being theoretical.",
    floor: "#7A1810",
    paint: "#E8761E",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
  {
    id: "cle2",
    name: "Cleveland, again",
    years: "2014-2018",
    venue: "Cleveland Cavaliers",
    jersey: "23",
    stat: "2016",
    statLabel: "The title he went back for",
    copy: "He returned to deliver the thing he had left in order to go and find. Three games to one down against a team that had won seventy-three, Cleveland took the last three, and a fifty-two-year wait ended in game seven.",
    floor: "#E0A72C",
    paint: "#5C1626",
    type: "#2A0C13",
    dim: "rgba(42,12,19,0.76)",
  },
  {
    id: "lal",
    name: "Los Angeles",
    years: "2018-2026",
    venue: "Los Angeles Lakers",
    jersey: "23",
    stat: "12,402",
    statLabel: "Points in eight seasons",
    copy: "A championship won inside a sealed campus in Orlando with nobody in the building, the all-time scoring record, and the first forty thousand points anyone has scored. Eight seasons in Los Angeles, in which endurance became its own form of dominance.",
    floor: "#3B2352",
    paint: "#E0A72C",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
  {
    id: "usa",
    name: "National colours",
    years: "2004-2024",
    venue: "United States",
    jersey: "6",
    stat: "3",
    statLabel: "Gold medals",
    copy: "Bronze in Athens as a teenager, then gold in Beijing, London and Paris. Twenty years in the same shirt, and the flag to carry into the opening ceremony at the end of it.",
    floor: "#16305A",
    paint: "#FBF7EF",
    type: "#FBF7EF",
    dim: "rgba(251,247,239,0.74)",
  },
];
