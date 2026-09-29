/**
 * Single source of truth for every factual claim on the site.
 *
 * The barrel for the data module. It re-exports the domain files in this
 * directory, and it is the only import path components and tests use:
 *
 *     import { CAREER, SEASONS } from "@/lib/data";
 *
 * Nothing imports a domain file directly. That is the whole point of the
 * barrel: a component names the figures it wants and never learns which file
 * they live in, so the split can be reshuffled without touching a component.
 *
 * GROUND RULES — these bind every file in this directory.
 *  - Headline honours (titles, MVPs, Finals MVPs, golds, all-time scoring rank,
 *    award years, championship years, Olympic years) are exact, stable,
 *    well-documented facts.
 *  - Season, game and counting totals are exact official regular-season
 *    figures. The per-season table they come from sums to the published
 *    career totals in every category (see `career.ts`), so the stint splits
 *    and the career line cannot disagree with each other.
 *  - Per-game figures are those totals divided out and rounded to one decimal,
 *    which is how they are published.
 *  - Nothing here is an invented index or a projection. Bump STATS_AS_OF
 *    whenever the numbers are refreshed.
 */

export * from "./meta";
export * from "./span";
export * from "./hero";
export * from "./honours";
export * from "./career";
export * from "./rooms";
export * from "./ledger";
export * from "./twenty-three";
export * from "./last-shot";
export * from "./four-nights";
export * from "./the-block";
export * from "./shot-zones";
export * from "./father-and-son";
export * from "./era-compare";
export * from "./baseline";
export * from "./playoff-series";
export * from "./buzzer-beaters";
export * from "./triple-doubles";
