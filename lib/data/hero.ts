/* ---------------------------------------------------------------------------
 * HERO
 * ------------------------------------------------------------------------- */

import { CAREER_POINTS } from "./honours";

export const HERO = {
  first: "LEBRON",
  last: "JAMES",
  meta: ["Akron, Ohio", "Born 1984", "No. 23"],
  standfirst: "A LeBron tribute.",
  figures: [
    { value: "4", label: "Championships" },
    { value: "4", label: "Most Valuable Player" },
    { value: CAREER_POINTS.toLocaleString("en-US"), label: "Regular-season points" },
  ],
} as const;
