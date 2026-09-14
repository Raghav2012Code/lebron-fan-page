<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository Guidelines for AI Agents

## Project Overview
This repository is **The King — an unofficial LeBron James tribute**, a high-craft, single-page editorial experience celebrating LeBron's 23-season career.

## 1. Design System & The Hardwood Aesthetic
- **Ground (Court Floor)**: Maple (`#E9D6B0`, `--maple`) and Maple Deep (`#DCBF8C`, `--maple-deep`). The background is rendered with subtle court seams.
- **Paint & Accents**: Wine (`#5A1626`, `--wine`), Deep Wine (`#380C16`, `--wine-deep`), Gold (`#E0A72C`, `--gold`), Ochre (`#A2670F`, `--ochre`), Leather (`#C24A16`, `--leather`), and Chalk (`#FBF7EF`, `--chalk`).
- **Cards & Inset Panels**: Never use stark white cards (`bg-white` or pure `bg-chalk`) on top of the maple court floor. Inset containers, cards, and data boxes must harmonize with the floor using `bg-maple-deep/40` or `bg-maple-deep/50` with `border-rule` (`rgba(90, 22, 38, 0.22)`).
- **Zero Generic Agency Tells**:
  - No custom cursor gimmicks.
  - No artificial grain/noise overlays.
  - No tracked-out all-caps eyebrows with middle dots (`A · B · C`).
  - No stock photography.

## 2. Typography Rules
- **Display & Headings (`--font-display`)**: **`Oswald`** (weights 600, 700).
  - Used for `.monument`, `.headline`, and `.figure`.
  - Monolithic, condensed, authentic athletic stadium typography.
  - Figures (`4`, `43,440`, `8,521`) use `tabular-nums` for scoreboard alignment.
- **Body & Editorial Copy (`--font-text`)**: **`Plus Jakarta Sans`** (weights 400, 500, 600, 700).
  - Used for `.prose-copy`, `.narrow`, and `.narrow-bold`.
  - Clean, modern, highly legible geometric sans. Do **not** use bookish/Victorian serifs.

## 3. Data Integrity & Content Rules
- **Single Source of Truth**: All stats, box scores, series logs, and milestones live in `lib/lebron-data.ts`.
- **Accuracy**: Stats must match official NBA record books and Basketball Reference. Never fabricate stats or invent subjective rating indices.
- **Navigation Registry**: Any top-level section displayed on the page must have its anchor ID registered in `SECTIONS` inside `lib/lebron-data.ts` (e.g. `playoff-matrix`, `shot-zones`, `era-compare`, `the-block`). Do not add navigation anchors for unimplemented future milestones.

## 4. Feature Milestones Roadmap
- **Milestone 1 (Complete)**: Playoff Series Matrix (`components/playoff-matrix.tsx`) — 57 career playoff series, 42–15 record, round filter tabs, 25-franchise breakdown, and game-by-game box score drawer.
- **Milestone 2 (Queued)**: Clutch Game-Winner Anthology — interactive chalkboard player diagramming 5 iconic playoff buzzer-beaters.
- **Milestone 3 (Queued)**: Triple-Double Constellation — interactive visual breakdown of 150+ career triple-doubles.

## 5. Quality Verification Gates
Always verify changes with all three gates before committing:
1. `npm run lint` — ESLint must pass with 0 errors and 0 warnings.
2. `npm run typecheck` — `tsc --noEmit` must pass cleanly.
3. `npm run build` — Next.js Turbopack production build must compile and statically prerender all routes without errors.
