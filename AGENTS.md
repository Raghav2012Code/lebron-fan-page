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
- **Cards & Inset Panels**: Never use stark white cards (`bg-white` or pure `bg-chalk`) on top of the maple court floor. Inset containers, cards, and data boxes must harmonize with the floor using `bg-maple-deep/40` or `bg-maple-deep/50` with `border-rule` (`rgba(90, 22, 38, 0.22)`). A panel on a `floor-deep` ground needs a lighter fill to read as an inset at all — move the ground, don't stack maple-deep on maple-deep.
- **Section rhythm**: each top-level unit in `app/page.tsx` declares its opener — `device`, `ruled-ledger`, `written-line`, `margin-note` or `instrument` — as an exported `OPENER` constant. **No two adjacent units may declare the same one**, and the page ran one identical rhythm thirteen times before this was fixed. The four-item band (`StatBand`) is capped at **two** uses on the whole page; it is not a default container. Both are enforced by `tests/design-guards.test.ts` (G3, G4). Reordering the page means reconsidering the rhythm, not just the list.
- **Zero Generic Agency Tells**:
  - No custom cursor gimmicks.
  - No artificial grain/noise overlays.
  - No tracked-out all-caps eyebrows with middle dots (`A · B · C`). `tracking-[0.2em]` and `tracking-widest` are lint errors. Where a section genuinely needs a kicker, use the **`Kicker`** component (`components/typeset.tsx`): body face, body size, sentence case, untracked, no separator glyph. Do not build a kicker on `Caption`/`.narrow` — that class is uppercase with `0.04em` tracking, so removing the utility would satisfy the lint rule and leave the page looking identical.
  - No stock photography.
  - **Shapes are square.** `rounded`, `rounded-sm/md/lg/xl/2xl` are lint errors and `rounded-none` is the explicit statement. `rounded-full` has a budget of **four** on the whole page, each encoding a genuinely round object: the two balls, the made-shot ring, the live-status dot. `tests/design-guards.test.ts` G5 asserts the count *and* the named list.
  - **No raw hex in a component.** Use a named token or a `var(--…)` reference; per-team colours belong in the data module. Lint error.
  - **No bare `1fr` grid track** — use `minmax(0,1fr)` so a long unbroken string cannot force overflow. Lint error.
  - **No uniform card hover-lift.** `whileHover={{ y: … }}` is a lint error. A hover on a card must carry information about that card.

### Anchor targets
Every in-page anchor target carries the `scroll-clearance` class from `app/globals.css`
(`scroll-margin-top: 6rem`). Declared once, on the *target* rather than as an offset on each link,
so adding a section cannot forget it. It covers native anchor navigation, the hero's
`scrollIntoView` affordance, and the season ruler's focusable targets. `back-to-top` deliberately
does **not** carry it: it scrolls to `#main` in order to put the reader at the top, where clearance
would be wrong. Enforced by `tests/design-guards.test.ts` G2.

## 2. Typography Rules
- **Display & Headings (`--font-display`)**: **`Oswald`** (weights 600, 700).
  - Used for `.monument`, `.headline`, and `.figure`.
  - Monolithic, condensed, authentic athletic stadium typography.
  - Figures (`4`, `43,440`, `8,521`) use `tabular-nums` for scoreboard alignment.
- **Body & Editorial Copy (`--font-text`)**: **`Plus Jakarta Sans`** (weights 400, 500, 600, 700).
  - Used for `.prose-copy`, `.narrow`, and `.narrow-bold`, and for inline body copy via the `font-text` utility.
  - Clean, modern, highly legible geometric sans. Do **not** use bookish/Victorian serifs.
- **Exactly two families.** `font-mono` and `font-serif` are lint errors. So is `font-sans`:
  it is Tailwind's **default system stack** (`-apple-system, BlinkMacSystemFont, "Segoe UI", …`),
  *not* `--font-text`, so it silently introduces a third family. Use `font-text` or one of the
  declared classes.
- **Route a label by its role, not mechanically.** A field label is `.narrow` (or the `Caption`
  component); a coloured badge is `.narrow-bold`; a data string inside a sentence wants
  `tabular-nums` with its case preserved (`Age 27` should not become `AGE 27`); prose is
  `.prose-copy`. Where a role is decorative, delete the utility rather than replacing it.
- **SVG `<text>` has no family of its own** and falls back to the browser default (monospace).
  Set `font-text` on the `<svg>` root *and* remove any `font-family` presentation attribute —
  an explicit attribute beats inheritance, so the root alone is not enough.

## 3. Data Integrity & Content Rules
- **Single Source of Truth**: All stats, box scores, series logs, and milestones live in `lib/lebron-data.ts`.
- **Accuracy**: Stats must match official NBA record books and Basketball Reference. Never fabricate stats or invent subjective rating indices.
- **Navigation Registry**: Any top-level section displayed on the page must have its anchor ID registered in `SECTIONS` inside `lib/lebron-data.ts` (e.g. `playoff-matrix`, `shot-zones`, `era-compare`, `the-block`). Do not add navigation anchors for unimplemented future milestones.

## 4. Feature Milestones Roadmap
- **Milestone 1 (Complete)**: Playoff Series Matrix (`components/playoff-matrix.tsx`) — 57 career playoff series, 42–15 record, round filter tabs, 25-franchise breakdown, and game-by-game box score drawer.
- **Milestone 2 (Queued)**: Clutch Game-Winner Anthology — interactive chalkboard player diagramming 5 iconic playoff buzzer-beaters.
- **Milestone 3 (Queued)**: Triple-Double Constellation — interactive visual breakdown of 150+ career triple-doubles.

## 5. Quality Verification Gates
Always verify changes with all four gates before committing:
1. `npm run lint` — ESLint must pass with 0 errors and 0 warnings.
2. `npm run typecheck` — `tsc --noEmit` must pass cleanly.
3. `npm test` — all suites must pass. Two shapes of test live here. `tests/smoke.test.ts` asserts on `lib/lebron-data.ts` — the figures the UI now derives from it (playoff W-L, points, sweeps, shot-zone volume sums, the verified era aggregates) plus an `isLive` assertion so a silent fallback to `tests/fixtures/authoritative-data.ts` fails loudly instead of passing. `tests/design-guards.test.ts` reads component and stylesheet **source as text** and asserts design invariants (anchor clearance, the overflow clip, the band cap, opener adjacency, the shape budget, the em-dash ban, the navigation registry). Three further suites cover the data tiers.
4. `npm run build` — Next.js Turbopack production build must compile and statically prerender all routes without errors.

`npm run lint` additionally carries five `no-restricted-syntax` design rules scoped to `components/**.tsx` (the tracked-eyebrow utilities, `font-mono`, raw hex, the uniform card hover-lift, a bare `1fr` grid track). They are in the lint gate rather than the test gate because they can report a file and a line; the test gate has no AST and can only count.

### Known limits of the test suite
- It exercises the **data module and the source text only**. No test imports a component, because the custom loader resolves `.tsx` but Node's type stripping then refuses it. A rendering, interaction or accessibility regression will not fail a test — verify those in the browser.
- The design guards strip comments and scan only inside quoted strings. That is deliberate: the lint gate gets comment-blindness free from the AST, and a text scan otherwise reports the project's own prose — it once reported the English word "rounded" in a ledger sentence as a radius violation. A guard that cries wolf gets disabled, so keep the scoping.
- A source-level "0 matches" acceptance condition is **not** proof the page is right. Two real defects passed `0 matches for font-mono` while the render was wrong: a `font-family="monospace"` presentation *attribute* on SVG `<text>`, and a `font-sans` utility that resolves to the system stack rather than `--font-text`. For anything visual, check computed styles in the browser.
- Milestones 2 and 3 are **not rendered**, so their data is tested but unreachable by a user. That is expected while they are queued.

## 6. Rendering Without JavaScript
The page must stay readable and truthful with JS disabled. Framer serialises every `initial` variant state into the server HTML as an inline `style` — and `pathLength` animations as `stroke-dasharray="0 1"`. With JS on, hydration animates it away; with JS off nothing does, so **the hidden state becomes the resting state**. Measured with scripting disabled, that shipped 175 elements at `opacity: 0`, 62 letters parked at `translateY(112%)`, 55 rules and panels at `scale(0)`, and a hero at 0% visible, with roughly 27,000 characters in the document of which essentially none were painted. Three rules follow:

- **The guarantee is `NO_SCRIPT_CSS` in `app/layout.tsx`, not a per-element attribute.** A `<noscript>` block is the only mechanism that can reach this case. The tempting alternative — an attribute on every hiding element, styled by a media query — cannot work here: the existing `[data-reveal]` override lives *inside* `@media (prefers-reduced-motion: reduce)`, and a visitor with JS blocked is not necessarily in that query, so the documented remedy structurally cannot reach the failure it was written for. `data-reveal` remains for the reduced-motion case, where it is the right tool, and is deliberately not extended to all ~196 self-hiding elements: that is a hand-maintained invariant with no mechanical enforcement, guarding a case that already works. Guard G9 keeps the block honest and asserts the anchoring described below.
- **Anchor the fallback's selectors on a declaration boundary.** `opacity:0` is a *substring* of `opacity:0.72`, `0.45`, `0.3` and `0.14` — four real design values on this page — so a bare `[style*="opacity:0"]` silently flattens them. The block uses four boundary-anchored forms instead, and the room panels' `color:#231508;opacity:0` (no trailing semicolon) is why the end-of-value form is not optional. Likewise `stroke-dasharray` is matched as exactly `0 1`, never as a bare attribute selector, because the page also draws genuine dashes at `2 3` and `4 4`.
- **Counters must render their final value, not their start value.** `Counter` seeds the DOM with `to` and animates *from* `from` after hydration. Seeding it with `from` shipped every statistic on the page as a literal `0`. Verified still true in the server HTML: every `.figure` carries its final value, and exactly four text nodes in the document equal the literal `"0"`, three of which are the shot challenge's legitimate opening Score/Streak/Best.

Any section whose content is gated behind scroll-linked state still needs its own `<noscript>` fallback — `the-rooms` has one, and it renders.

## Agent skills

### Issue tracker

Issues and specs are tracked as GitHub issues on `origin` (Raghav2012Code/lebron-fan-page); the `upstream` remote is the fork source and is not a tracker. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, using their default strings (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`); a separate severity/ordering vocabulary also exists and does not collide with them. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` plus `docs/adr/` at the repo root, created lazily by `/domain-modeling` when terms or decisions actually get resolved. See `docs/agents/domain.md`.

