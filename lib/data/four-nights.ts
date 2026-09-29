/* ---------------------------------------------------------------------------
 * FOUR NIGHTS
 * ------------------------------------------------------------------------- */

export interface Night {
  year: string;
  title: string;
  copy: string;
}

export const NIGHTS_INTRO = {
  heading: "Four nights",
  copy: "Most games get a box score. These four got a name.",
} as const;

export const NIGHTS: Night[] = [
  {
    year: "2003",
    title: "The arrival",
    copy: "Taken first overall out of high school by the team down the road from where he grew up. Named Rookie of the Year in his first season, carrying a franchise before he was old enough to toast the win.",
  },
  {
    year: "2016",
    title: "The comeback",
    copy: "Three games to one down against a Golden State side that had won seventy-three. Cleveland took the last three, and a city that had waited fifty-two years finally stopped waiting.",
  },
  {
    year: "2020",
    title: "The fourth",
    copy: "A title won inside a sealed campus in Orlando with nobody in the building. A fourth ring, a fourth Finals MVP, and a third franchise on the list.",
  },
  {
    year: "2024",
    title: "The long view",
    copy: "Bronze in Paris and the flag at the opening ceremony, in the same year he shared an NBA floor with his son.",
  },
];
