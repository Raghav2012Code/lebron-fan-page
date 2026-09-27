# Fix plan — repo bug & consistency audit (2026-09-27)

**Status:** covers the 11 findings confirmed by direct inspection. Four specialist audits
(data integrity, React lifecycle, a11y/SSR, code quality) were still running when this was
written; §7 reserves the slot to fold their findings in. Nothing here is speculative — every item
carries the command or file:line that produced it.

**Baseline:** `299cff8`, tree clean, all four gates green (lint 0/0, typecheck clean, 64/64 tests,
build prerenders `/`).

**Ground rule for this plan:** two of my own candidate findings were false alarms, caught by going
to the source rather than trusting recall — the `debutNight` rebound/assist "swap" (BBR confirms
6 TRB / 9 AST, the data was right) and the `layout.tsx` "mojibake" (bytes are `E2 80 94`, a valid
em-dash). Nothing below is reported on recollection. Where a fix depends on a fact not yet
established, the dependency is named rather than assumed.

---

## 1. Severity triage

| ID | Finding | Severity | Wave |
|---|---|---|---|
| B1 | Hand-typed derived figures in `playoff-matrix` prose | serious | 3 |
| B2 | `approx` convention entirely vestigial; two dead UI branches | serious | 2 |
| B3 | README contradicts the code on data precision | serious (trust) | 1 |
| B4 | `stagger()` omits `inherit: true` — silent-breakage trap | moderate | 2 |
| B5 | README stale: suite count, test shapes, primitives, structure | moderate | 1 |
| B6 | Dead code introduced in the last change (`OPENERS`, 3 unused props) | minor | 2 |
| B7 | `playoff-matrix` prose can drift again | minor (needs guard) | 3 |
| B8 | README's `inherit: true` claim over-broad | minor | 1 |
| B9 | Copy: "Rookie of the Year *a season later*" | minor (accuracy) | 1 |
| B10 | No `engines` / `packageManager` | minor | 4 |
| B11 | SSR contract — **verified, no defect** | none | — |

---

## 2. Wave 1 — make the documentation tell the truth

Documentation is not cosmetic here. The README currently makes a claim about data precision that
the code contradicts in two places, and this repo's entire premise is that the figures are true.

### 1.1 B3 — correct the precision claim

`README.md` §Content & data currently says:

> Point and game totals are **rounded approximations** of regular-season figures, marked `approx`
> so the UI can label them.

That is false, and provably so:

- `LEDGER_INTRO.copy` says *"the four add up to the career number exactly"*.
- `the-ledger.tsx:157` says *"Nothing here is rounded to make it land."*
- Verified: 15,251 + 7,919 + 7,868 + 12,402 = **43,440**, the career total exactly.
- Wave 0 of issue #29 independently established the era aggregates as exact attempts-weighted
  figures against Basketball Reference.

Replace with a statement of what is actually true, and say *how* we know:

> Every figure is exact, not rounded for effect. The four stint totals sum to the career number
> exactly (15,251 + 7,919 + 7,868 + 12,402 = 43,440), the era aggregates are attempts-weighted
> over the seasons each `period` names, and both are reconciled against Basketball Reference in
> `tests/smoke.test.ts`. Do not reintroduce an `approx` flag: nothing is approximate, and an
> unused flag that two components branch on is a lie the UI can tell.

**Do not** delete the `approx` field in this wave — that is B2, and it needs Wave 2's ordering.

### 1.2 B5 — fix staleness introduced by the last change

- `npm test  # all four suites` → **five** (`smoke`, `design-guards`, `tier1`, `tier2`, `tier3`).
- *"The test suites assert on `lib/lebron-data.ts` rather than on rendered output"* → now two
  shapes: one asserts on the data module, one reads component and stylesheet **source as text**.
  Point at `AGENTS.md` §5, which was updated for this.
- `typeset.tsx` primitive list → add `Kicker`, `StatBand`, and the `Opener` type.
- Project structure block → add `tests/` (5 files) and `docs/` (`agents/`, `plans/`). Both exist
  and are omitted.

### 1.3 B8 — rescope the `inherit: true` claim

`README.md` §Motion & accessibility says *"Every variant `show` transition sets `inherit: true`"*.
False as written: ~30 component-level `show` transitions do not. The **substance** is correct and
verified — the shared variants that consuming elements depend on (`rise`, `riseChar`) do set it,
and `typeset.tsx:158-162` (`RiseLine`) demonstrably honours its per-line `delay` because of it.

Rescope to: *"Every `show` transition in `lib/motion.ts` sets `inherit: true`, because those are
the variants consuming elements bind to with a `transition` prop. A locally-defined `show` that
carries its own `transition` does not need it — and must not be given one unless it is also
consumed that way."*

### 1.4 B9 — fix the one inaccurate night

`lib/lebron-data.ts` `NIGHTS[0].copy`: *"Rookie of the Year a season later"* — he won Rookie of
the Year in his **debut** season (2003-04), the same season he was drafted. As written a reader
concludes he did not win it as a rookie. Change to *"Rookie of the Year in the same season"* (or
equivalent).

The other three were fact-checked and are clean — do not touch them:
2016 (3-1 down to a 73-9 Warriors, 52-year wait) ✓ · 2020 (sealed bubble, 4th ring, 4th FMVP,
3rd franchise) ✓ · 2024 (Paris bronze, carried the flag, floor with Bronny) ✓.

### 1.5 Gates

`lint`, `typecheck`, `test`, `build`. Doc-only plus one data string — all four must stay green.

---

## 3. Wave 2 — delete what is dead, close the trap

### 3.1 B2 — retire the `approx` convention

**Precondition:** confirm with the (pending) data audit that no figure is genuinely approximate.
Everything checked so far says none is, and Wave 0 verified the era aggregates as exact. If that
audit surfaces a real approximation, this becomes "set the flag on that one figure" instead of
"delete the flag", and the README edit in 1.1 must be revisited.

- Remove `approx?: boolean` from `interface Metric` (`lib/lebron-data.ts:432`).
- Remove the dead branch at `the-ledger.tsx:183-187` (renders an `approx.` label).
- Remove the dead branch at `the-ledger.tsx:328` (renders `" (approximate)"`).
- TypeScript will not catch these today because `approx` is genuinely `boolean | undefined`; they
  are dead by *data*, not by type. That is the whole reason they are dangerous.

### 3.2 B4 — fix the `stagger()` trap

`lib/motion.ts:38-43`. `stagger()`'s `show` transition omits `inherit: true` — the exact omission
`motion.ts:46` calls "load-bearing" — and `stagger()` is exported and used three times
(`center-court.tsx:74, 79, 143`).

Currently harmless: no consuming child has both a `transition` prop and its own `show` transition
(verified by scanning every `<motion.*` opening tag for both). But the obvious usage — a
`stagger()` parent whose children bind variants *and* pass `delay` via a `transition` prop — breaks
silently, which is the exact failure the neighbouring comment warns about.

- Add `inherit: true` to `stagger()`'s `show` transition.
- Move the "load-bearing" comment so it covers `stagger()` as well as `rise`/`riseChar`, or add a
  line to `stagger()` naming the hazard.

**This changes behaviour for three live call sites.** Verify in the browser afterwards that the
hero's name, meta lines and figures still stagger identically (see §6).

### 3.3 B6 — delete the dead code I introduced

Honest self-audit; these are mine, from the last change:

- `typeset.tsx:375` `export const OPENERS` — exported, consumed nowhere. **Better than deleting:**
  wire it into guard G4 so the guard asserts every declared `OPENER` is one of the five known
  values. That gives the export a purpose and strengthens the guard (today a typo would be caught
  only by the type, and the guard compares adjacency blind).
- `StatBandItem.valueClassName`, `.captionClassName`, `.itemClassName` — used at **no** call
  site (grep across `components/**` excluding `typeset.tsx`: 0 matches each). Delete them.
  `labelClassName` and `tone` are used and stay.

### 3.4 Gates

`lint`, `typecheck`, `test`, `build`, then the `stagger()` visual check in §6.

---

## 4. Wave 3 — one source of truth for the prose figures

### 4.1 B1 — derive `playoff-matrix`'s standfirst

`components/playoff-matrix.tsx:393-396` hand-types seven figures that the same file already derives
20 lines earlier:

| Prose says | Should come from |
|---|---|
| "23 seasons" | `SEASONS.length` |
| "57 postseason series" | `career.series` |
| "42 wins and 15 losses (73.7%)" | `career.wins`, `career.losses`, `career.seriesWinPct` |
| "over 302 games" | `career.games` |
| "8,521 points" | `career.points` |
| "12 series sweeps" | `career.sweepsWon` |
| "25 distinct opponent franchises" | `FRANCHISE_BREAKDOWN.length` (verified 25) |

Also `playoff-matrix.tsx:363, 380` — the toggle labels `Series Ledger (57)` and `Franchises (25)`.

This is not a style preference. The same component's `career` memo carries the comment
*"derived from the ledger so the tiles cannot drift from it"* — the invariant is declared and then
violated 20 lines later. And **issue #20 was opened for precisely this failure mode**: eleven
hand-duplicated figures that had already drifted from source.

Note `career.seriesWinPct` is a computed float; the prose currently types `73.7%` by hand. Typing
a computed percentage is the most drift-prone form of this, because it looks authoritative.

Add `seasons` and `franchiseCount` to the `career` memo so every figure in the file has one home.

### 4.2 B7 — guard it

A test-gate assertion, alongside G1–G7 in `tests/design-guards.test.ts`:

> **G8** — `components/playoff-matrix.tsx` contains **no digit-bearing JSX text node**.

Checked: the file currently has exactly five (`363`, `380`, `394`, `395`, `396`) and all five are
derivable, so the invariant is achievable. The point is that a hardcoded figure in this file can
only appear as an interpolated `{career.*}` expression, never as a typed literal.

Scope it to this one file. A blanket repo-wide version would false-positive immediately on
`the-block.tsx`'s court coordinates and `No. 23` in the hero.

### 4.3 Gates

`lint`, `typecheck`, `test`, `build`. Then confirm the rendered paragraph still reads identically —
it is user-visible prose and a wrong interpolation is worse than the literal it replaced.

---

## 5. Wave 4 — production hygiene

### 5.1 B10 — pin the toolchain

`package.json` has neither `engines` nor `packageManager`. For a repo whose `AGENTS.md` opens with
*"This is NOT the Next.js you know"* and which pins a version with breaking changes, an unpinned
Node is a real deployment risk.

```json
"engines": { "node": ">=20.9" },
"packageManager": "npm@11.16.0"
```

`>=20.9` is Next.js 16's floor, not this machine's version — the point is to reject a Node that
cannot run the pinned Next, not to pin the laptop. Verified locally on Node v24.18.0 / npm 11.16.0.

### 5.2 Gates

All four, plus `npm ci` from the lockfile to prove the `packageManager` pin is satisfiable.

---

## 6. Verification this plan requires beyond the gates

The gates cannot see these. Each is a manual check, and each is a real regression class in this
repo's history.

1. **The `stagger()` change (B4)** — load `/`, watch the hero name, the three meta lines and the
   three hero figures. They must stagger exactly as before. Adding `inherit: true` changes which
   transition wins; the intent is no visible change, and "no visible change" has to be looked at.
2. **The prose derivation (B1)** — read the rendered playoff-matrix standfirst against the tiles
   immediately below it. A derived value that renders as `NaN`, `undefined` or a raw float is worse
   than the literal it replaced.
3. **The copy change (B9)** — re-read `NIGHTS[0].copy` as prose. "In the same season" must read
   naturally; it is the first thing a reader of that section sees.
4. **Guards stay honest** — after adding G8 and rewiring `OPENERS` into G4, prove each new
   assertion goes red: inject a typed digit into the playoff-matrix prose, and set an `OPENER` to
   a bogus value. A guard never observed failing is not a guard.

---

## 7. The four specialist audits — integrated

All four reported. Each claim was re-verified against source before it entered a
commit, and the two candidates from §8 below were disproved and are not being
acted on. The audits roughly sextupled the scope: they found two defects that
**every one of the four gates passed clean**, plus a page-wide typography fault
and a no-JS failure, none of which the test suite can see by construction.

### 7.1 What shipped

| Commit | Finding | Verified by |
|---|---|---|
| `b407b99` | B3/B5/B8/B9 — the README's "rounded approximations" claim was false; suite count, test shapes, primitives and structure block were stale; the `inherit: true` claim was over-broad; NIGHTS[0] said ROY came "a season later" | gates; 15,251+7,919+7,868+12,402 = 43,440 |
| `642f460` | B2/B4/B6 — retired the vestigial `approx` convention and its two dead branches; `inherit: true` on `stagger()`; deleted `OPENERS` and 3 unused `StatBandItem` props; wired G4's archetype assertion | points sum to 43,440 and games to 1,622; G4 proven red on a bogus opener |
| `0bb9be0` | **The page scrolled itself 16,372px and stole focus on every load** — the drawer's focus effect keyed on `inspectSeries`, so its *close* branch ran on mount and `focus()`ed a `tabIndex={-1}` section | rAF trace 0 → 186 → 5,983 → 12,733 → 16,372; drawer cycle re-verified after |
| `775cb64` | **The type classes were unlayered**, so every utility touching a property they set was silently discarded. `prose-copy max-w-[46ch]` computed 749.568px, not 538.752px; a live site rendered at 843px | 21 sites affected; G8 added |
| `6399ab2` | **With JS off the page was ~0% visible** — 175 elements at `opacity:0`, hero 0%, ~27,000 characters unpainted | now 0 elements with hidden text; G9 added |
| `681df1e` | `NEXT_MARK` called 50,000 "still open / nobody has been near it" at 86.9% while the same page stated 51,961 combined; `THE_BLOCK` claimed a 20.1 mph *peak* beside an 88 ft / 2.8 s chase that averages 21.4, and its scrubber printed unsourced speeds contradicting its own distances | 4 new assertions, each proven red |
| `e954be8` | 6 React defects: ledger re-animated on every scroll pass; ruler mapped touches in viewport coords and raced its own buttons; `storage` listener was dead code; footer year was a hydration hazard; two components used Framer's one-shot `useReducedMotion`; in-flight animations untracked | ledger bars stay at 0.95/0.91/0.93 through a full scroll cycle; ruler picks 17 where the old maths gave 11 |
| `9631075` | 4 a11y defects: 6 focusable controls inside `aria-hidden`; tabpanel with no `aria-labelledby`; 4 DOM ids containing whitespace; 3 touch targets under 24px | re-measured after; scrubber thumb confirmed by pixel probe |
| `WAVE3` | **B1 + B7** — 18 hand-typed figures in `playoff-matrix` derived from the `career` memo; the two filter predicates unified; G10 added | all 18 derived values reproduce the typed ones exactly; clicking NBA Finals shows 10 of 57 with 10 cards rendered; G10 proven red on 9 injections |
| `WAVE4` | **B10** — `engines.node` read from Next's own field, `packageManager`, and the three script/resolver defects recorded beside it: a test script that enumerated five filenames, a resolver whose root came from the CWD, and a `.tsx` in its extension probe | `npm ci --dry-run` reports "up to date"; the CWD test proven red by restoring `path.resolve(".")` |
| `3894098` | **S1** — 11 of the 12 banned utilities were being compiled into the production stylesheet, because Tailwind's automatic detection reads this repo's own Markdown and lint config | 12 -> 1 in the built bundle; G11 added, proven red on 7 injections |
| `403e009` | **S2** — the bare-`fr` lint rule matched a string that occurs zero times, so it could never fire, and its comment called `1.3fr` "already safe" | rule proven red on 4 injections including inside a `cn()` call; all 21 arbitrary-track grids measured, ratios identical, zero overflow |
| `dda6a65` | **F-5** — `--gold` measured 1.36:1 and `--leather` 3.10:1 on the maple floor; added ink variants and darkened `--muted` | 89 -> 3 failures across 1,352 measured text nodes, by painting the page with text hidden and reading real pixels |
| `bee958e` | **S6, S7, S8, S10, S11, S13** — the rooms indicator named the wrong room; no error boundary; three headings in the body face; a duration labelled an age; a stark-white drawer; a dot that pulsed forever under reduced motion | rooms walked at 13 scroll positions, nav matches the visible panel at every one; 13 of 14 headings now Oswald |
| `455fea3` | **S12** — four tests that could not fail under any circumstances, and three more with a tautology beside a real assertion | proven by changing `--maple`, `W`, `BASKET_Y` and `SECTIONS` — all four were green before |

### 7.2 The two defects no gate could see

Worth stating separately, because they are the argument for the rest of this
document. `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`
were **all green** while the page auto-scrolled 16,000px on every visit, while
every prose measure rendered 20–70% too wide, and while the no-JS document was
blank. None of them resolve a cascade, a focus side-effect, or a runtime
measurement. The guards that now exist for those cases (G8, G9) read the
stylesheet and the layout source, which is as close to a static gate as this
project can get without a DOM.

### 7.3 Confirmed and still open

Severity as it affects a reader of the page today.

**Serious — rendered**

- **F-5** · ~~9 text/background pairs below 4.5:1 (or 3:1 large)~~ **REMAINING: 3, all
  marginal.** Fixed by adding `--gold-ink` (#5E3B05) and `--leather-ink` (#7A2E08)
  and applying them on maple-family grounds only, darkening `--muted` one step
  (#6E5039 → #6A4C36), and dropping the `/80` alpha from three `text-muted/80`
  sites that measured 3.23:1 at 80% and 4.62:1 at full. Measured by painting the
  page with text hidden and reading the real pixels — not by compositing the
  ancestor chain, which cannot see this page's absolutely-positioned bars, pills
  and court floors and reported 1,191 false failures. Failures across eleven
  scroll-invariant sections: **89 → 3**, worst 1.36 → 4.01. Still failing: the
  playoff-matrix card `→` glyph at 4.40 against a maple-deep track (2% short, and
  decorative); the block's court player token at 4.01, chalk on a `--leather`
  marker fill; and one `→` sample at 1.52 that is a mid-hover-transition reading,
  not a resting state. The three ink-on-paint regressions this introduced — the
  matrix tab caption, the Scorer's Table banner and the milestone pill — were all
  caught by re-measuring and are conditional on the ground, which is the actual
  lesson: a blanket find-and-replace cannot be right when two states of one
  control sit on different grounds.
- ~~**S1** ·~~ **CLOSED** — see the shipped table. Tailwind's automatic content detection scans the whole repo, so
  `AGENTS.md`, `README.md`, `DESIGN-AUDIT.md`, `eslint.config.mjs`,
  `docs/plans/*.md` and the guards all inject the *banned* utilities into the
  production CSS. Confirmed in the built bundle: `.rounded`, `.rounded-sm…2xl`,
  `.font-mono`, `.font-serif`, `.font-sans`, `.tracking-[0.2em]`,
  `.tracking-widest`. Zero components use any of them. Worst: `.font-sans`
  resolves against an **empty** `--font-sans` and computes to an invalid
  `font-family`. Fix: `@source` directives in `globals.css`, then re-verify G5.
- ~~**S2** ·~~ **CLOSED** — see the shipped table. the bare-`1fr` lint rule matches `/grid-cols-\[1fr/`, which occurs
  **zero** times in the repo — the rule can never fire. Its justifying comment
  claims `grid-cols-[1.3fr_1fr]` "is already safe"; it is not, since an `fr` track
  has an automatic `min-content` minimum. 8 sites violate the rule as AGENTS.md
  states it. Fix the regex to match a bare `fr` anywhere, and convert the 8
  templates to `minmax(0,Nfr)` — `era-compare.tsx:155` and `the-rooms.tsx:76`
  already do it correctly, so the convention exists.
- ~~**S3** ·~~ **CLOSED** — see the shipped table. `playoff-matrix.tsx` derives `career` in a memo at :258-286 with the
  comment "so the tiles cannot drift from it", then hand-types all of it 100 lines
  later: the standfirst at :393-396, the toggle labels, and
  `Showing {n} of 57 series` at :453. This is the plan's original B1/B7, still
  open. Needs the figures interpolated and a guard (no digit-bearing JSX text in
  that file).
- ~~**S4** ·~~ **CLOSED** — see the shipped table. `filteredSeries` (:185-221) and `recordForOutcomeChips` (:227-245)
  implement the same five filters twice and **disagree on three** — round,
  franchise and search. A row can be counted in a chip but absent from the grid.
  Fix: one `matchesFilters(s, { skipOutcome })` predicate.
- ~~**S6** ·~~ **CLOSED** — see the shipped table. `playoff-matrix.tsx:895` uses `bg-chalk` for the drawer panel, which
  AGENTS.md §1 forbids outright ("never stark white cards on the maple floor"). The
  other four `bg-chalk` uses are 5px selection bars and a badge inversion.
- ~~**S7** ·~~ **CLOSED** — see the shipped table. `[data-reveal-loop]` sets `animation: none` / `transition: none`, which
  can only stop *CSS* animation. Its two carriers are driven by Framer's
  `repeat: Infinity` (a JS rAF loop), which it cannot reach — and does not need to,
  because the `reduce ? … : …` ternaries already handle it. Meanwhile the one real
  CSS loop on the page, `animate-pulse` on the live-status dot, has no such
  attribute and pulses forever under reduced motion.
- ~~**S8** ·~~ **CLOSED** — see the shipped table. `the-rooms.tsx` segments the same scroll two ways: `1 / N` for the panel
  opacity ranges (:55, deliberate and documented) and `1 / (N - 1)` for the floor
  colour, the active index and `goTo` (:149, :167, :176). With N=6, panel 0 rests
  on progress [0.025, 0.142] while `active` flips at 0.1 — so for that window the
  Akron panel is at full opacity while `ROOMS[active]` reports Cleveland, and the
  nav underline, label colour and `aria-live` region all name the wrong room.
- ~~**S10** ·~~ **CLOSED** — see the shipped table. no `error.tsx` / `global-error.tsx` anywhere, and five unguarded index
  expressions that would white-screen the document on a data change
  (`era-compare` :139/:141, `season-ruler` :79, `the-rooms` :236/:248,
  `shot-zones` :128, `the-ledger` :355). `father-and-son.tsx:69-79` is the one
  place that got this right.
- ~~**S11** ·~~ **CLOSED** — see the shipped table. `father-and-son.tsx:240-242` labels `history.bronnyStatus` — a *span
  since debut*, not an age — as "Bronny Age:". The clone at :198 uses the same
  field labelled "Bronny Status:". The timeline below uses a third field
  (`bronnyAge`).
- ~~**R8** ·~~ **CLOSED** — `cardId()` now serves both the `aria-expanded` comparison and the React key; measured: exactly one element reports `aria-expanded="true"` in an open drawer. `playoff-matrix.tsx` `aria-expanded={inspectSeries?.id === series.id}`
  where `id` is `id?: string`. Harmless today (57/57 rows carry one), but
  `undefined === undefined` would make every id-less card report expanded.
- ~~**F-9** ·~~ **CLOSED** — the two selects are now "Profile A, peak season:" and "Profile B, peak season:". the two `<select>`s in `era-compare` both have the accessible name
  "Select Peak Season:", so a screen-reader user cannot tell them apart.
- ~~**F-10** ·~~ **CLOSED** — the shot-zone live region reads the SELECTED zone, not the hovered one; the matrix result count debounces its announcement by 400ms in a `role="status"` region while the visible text still updates immediately. two live regions over-announce: `shot-zones` announces on
  `onMouseEnter` (hover is not a state change worth announcing, and leaving a
  sector fires a tenth announcement reverting to the selected zone), and
  `playoff-matrix`'s result count announces once per keystroke.
- ~~**F-12** ·~~ **CLOSED** — the chart `<svg>` is now `role="group"`, matching the sibling in `last-shot`. the `shot-zones` chart `<svg>` has `aria-label` but no role; the
  sibling in `last-shot` correctly uses `role="group"`.

**Serious — queued-milestone data (not rendered; Milestones 2 and 3)**

`AGENTS.md` §3 governs these as strictly as rendered ones — it is the designated
single source of truth — but no user can reach them yet.
- `TRIPLE_DOUBLE_SUMMARY.oldestAge` names 2026-02-12 / "41 years, 44 days" while
  its own array contains two older entries, the oldest being 2026-03-30 at 41
  years 90 days. `rtd-123`'s prose also claims "capping 125" at array position
  123, and claims the NBA record that `rtd-125` holds. `rtd-125`'s date is one day
  off (2026-03-30 vs a sourced 2026-03-31).
- `REGULAR_SEASON_TRIPLE_DOUBLES` per-season distribution is wrong: 2017-18 holds
  18 entries against a sourced 20; 2003-04 and 2011-12 hold none; and the
  2021-04-13 play-in triple-double against Golden State is absent, though it is a
  regular-season game. The career totals (125/28) happen to be right, so the error
  is absorbed somewhere inside the per-season rows.
- `clutch-2009-magic`'s `description` says an "0-2 deficit" where
  `seriesSituationBefore` on the same object says 0-1, and the sourced series
  confirms 0-1. Its keyframe timeline runs to 1.4s for a play whose
  `clockRemaining` is 1.0s — the only one of five entries that overruns, and it
  does so by holding the clock at `0.0s` across two keyframes.
- `ptd-6` says "playoff career-high 19 rebounds", true when written (2010) and
  superseded by the 20-rebound game the same file records. A "career high at the
  time" with no time qualifier.
- The comment justifying `allThirtyFranchisesBeaten` mis-states its own
  arithmetic: it says "30 distinct `franchise` values" where there are 31 tokens
  (BKN and NJN are one franchise), and concludes the claim is *not* derivable when
  it is — 30 NBA franchises minus CLE/LAL/MIA equals the 27 opponent franchises
  the table reaches, verified set-equal in both directions.

**Type-level looseness (no user impact; the compiler enforces nothing today)**

- `PlayoffSeries.opponentName?` is declared and populated by **0 of 57** entries
  while `opponent` holds the identical string. Every consumer falls back, so it is
  dead rather than wrong — but a consumer that trusted the type would get
  `undefined` with no error.
- 19 further optional `PlayoffSeries` fields are present on 57/57, and `wins`,
  `losses`, `games` plus `lebronStats.{ppg,rpg,apg}` and `boxScoreTotals.pts` are
  each stored a second and third time. All equal today; the `?` means nothing
  verifies them.
- `TripleDoubleGame` is one interface for two disjoint shapes: `stl`/`blk` exist on
  every regular-season entry and no playoff entry; `venue`/`round`/`roundCode`/
  `gameNumber` the reverse. `minutes?` and `milestone?` are populated 0/153.
- `MilestoneTarget` and `PacePreset` are exported interfaces with **zero**
  implementations and no `SECTIONS` entry.
- `Metric.suffix?` and `Honour.suffix?` are populated 0/15 and 0/7, and both are
  read by their consumers — the same shape as the `approx` flag removed in
  `642f460`, so the same argument applies.

**Code quality and hygiene**

- ~~**S12** ·~~ **CLOSED** — see the shipped table. 8 of the 64 tests cannot fail. `tier1` 1.16 asserts a literal against
  itself in both branches; 1.18 and 1.19 assert values from `test-loader.ts`
  rather than reading `globals.css` or `court-diagram.tsx`, so changing every
  palette token leaves them green; 1.20 asserts a local array contains a literal;
  `tier2` 2.12/2.13 assert that `.filter()` returns an array; `tier3` 3.10 asserts
  `.filter()` does not mutate, then re-reads the same array; 3.8/3.9 re-implement
  the filter with a *different* predicate than the component. Leaving them in
  inflates the "64 passing" number. `AGENTS.md` §5 claims every guard was confirmed
  to fail when its pattern was reintroduced; that discipline was applied to
  design-guards and not to the tiers.
- ~~**S13** ·~~ **CLOSED** — see the shipped table. three section `<h2>`s render in the body face
  (`era-compare` :157, `father-and-son` :97, `shot-zones` :151 — the identical
  `text-3xl font-black text-wine sm:text-4xl md:text-5xl` literal, Plus Jakarta
  Sans 900 at 48px on a hardcoded rem ladder) where the other ten use
  `.headline` with a `clamp()`. `the-line.tsx:70` is a third treatment again:
  `.narrow` — uppercase, 600, tracked, body face — as the section's only heading.
- ~~**S14** ·~~ **CLOSED** — ten middle-dot sites reworded to commas; the lone dot in a `gap-3` flex row deleted rather than replaced; G12 added, proven red on 8 injections. Its first version keyed the exception by FILE, which exempted the whole of `playoff-matrix.tsx`. the banned "tracked all-caps eyebrow with middle dots" survives inside
  `.narrow`, which the lint rule cannot see because AGENTS.md §1 only bans
  `tracking-[0.2em]` and `tracking-widest`. Six sites join strings with `·` or `•`
  inside a `.narrow` class (`era-compare` :224/:280, `playoff-matrix`
  :414/:419/:424/:780, `shot-zones` :242, `father-and-son` :159/:189/:231), and
  `father-and-son.tsx:90-94` states the pattern "is gone".
- ~~**M4** ·~~ **CLOSED** in Wave 4 — the `test` script is now a glob (verified to
  match exactly the same five suites and to exclude `tests/fixtures/` and
  `tests/helpers/`), `tests/resolver.mjs` derives its root from `import.meta.url`
  with a test that spawns a child from the OS temp directory, and the `.tsx`
  extension probe is gone so the "no test imports a component" limitation is no
  longer reachable. `lint` says `eslint .` rather than relying on the default.
  `tests/*.test.ts` is silently never run. `tests/resolver.mjs:5` resolves the
  project root from the CWD rather than `import.meta.url`, so `npm test` from a
  subdirectory fails to resolve `@/lib/lebron-data`. The resolver's extension probe
  includes `.tsx`, which is the documented cause of the "no test imports a
  component" limitation — removing it would make the limitation impossible to hit.
  `tsconfig` has `target: ES2017` against `lib: esnext`.
- **M3** · comment-accuracy, ~12 sites. The notable ones: `court-shell.tsx:12-13`
  claims `MotionConfig reducedMotion` neutralises "every" Framer animation, which
  `globals.css` and `lib/motion.ts` both contradict; `shot-zones.tsx:20-24`
  claims the legend and the encoder share their colours when they are two
  independent hardcoded lists; `twenty-three.tsx:44-52` claims the numeral aligns
  "at 320 and at 1440 alike" when only `md:right-14` matches;
  `playoff-matrix.tsx:490-495` relies on `.hidden` being emitted before `.inline`,
  which works and is the reverse of the conventional idiom.
- ~~**M2** · dead code ·~~ **CLOSED, with a correction to the finding.**
  `CourtDiagram`'s `variant="full"` branch is gone — one call site existed and it never
  passed `variant`, so ten lines rendered nothing, under a comment claiming the variant
  "is only used where the whole diagram can be seen at once". `stroke`, `animate` and
  `preserveAspectRatio` went with it because the call site set none of them, so each
  default was the entire behaviour. **The finding was wrong that `delay` is dead** — it
  is passed (`delay={0.15}`) and stays.
  The rest of the finding was right. `MetricRow` (in `era-compare.tsx`, not
  `typeset.tsx`) had a `higherIsBetter` prop no call site ever set, so its
  `false` branch was unreachable while three expressions and a screen-reader
  phrase carried it; and three call sites passed `unit="%"` alongside a `format`
  that already appended the `%`, making the `unit` inert. `BackToTop` took a
  `className` no call site passed, merged last, so it would have overridden the
  positioning of the one control whose position is load-bearing. `StatBandItem`
  is no longer exported — nothing outside `typeset.tsx` referenced it.
- **M1** · duplication worth extracting, ten groups: three identical section
  shells, three copies of the AGENTS.md §1 inset recipe, three number-formatting
  implementations, four hand-rolled roving-tabindex tablists, three team-colour
  resolvers, and four near-identical block pairs.
- ~~**M5** ·~~ **SPLIT: the `createPortal` half is NOT A DEFECT, the rest is OPEN.**
  `createPortal` is a pure factory returning a portal object, not a side effect, and
  calling it during render is React's own documented pattern; calling it in an effect
  would be strictly worse. The `typeof document !== "undefined"` guard is sufficient
  because the drawer can only open from a click. See §7.4.
  **Still open from this finding:** three `AnimatePresence` children have no `key`
  where two siblings do; `the-rooms.tsx` calls `scrollTo({ behavior: "smooth" })`
  unconditionally while two other call sites branch on the media query and say why.
- ~~**M7** · README accuracy ·~~ **CLOSED, with a correction to the finding.**
  The icon claim said "none. The one icon in the UI is hand-drawn SVG". Counted with
  comments stripped there are **8** live inline `<svg>` elements: 1 navigational icon and
  7 court and chart illustrations. A naive grep finds 10, because two are `` `<svg>` ``
  mentioned inside the very comments that explain the drawing — the same trap G5
  documents, in a README rather than a stylesheet.
  The component index also transcribed four sets of figures that live in the data
  module. **Every one of them was correct** — 23 seasons, 26.8 / 7.5 / 7.4, 420vh,
  2.8s, 57 series, 25 franchises, 9 zones, 4 eras, 5 peaks all reconcile — so this
  was never a wrongness, it was a second home. The statistical values are now
  described rather than quoted, because a component index is more useful saying
  what a section *is* than restating numbers that age.
  The verification sign-off was the one claim that had actually gone stale: it
  predated every fix above. Re-measured rather than restated, and the README now
  carries the method as well as the result.
- ~~**M8** · the `as HTMLElement` cast ·~~ **CLOSED.** Now
  `document.activeElement as HTMLElement | null`, matching the ref it is stored in.
  Everywhere else is clean, and the finding said so: zero `any`, zero `@ts-ignore`,
  zero non-null assertions.

### 7.4 Disproved — do not "fix" these

- `debutNight`'s `reb: 6, ast: 9` looked transposed; Basketball Reference's box
  score confirms 6 TRB / 9 AST. Correct.
- `app/layout.tsx`'s title looked like mojibake; the bytes are `E2 80 94`, a valid
  em-dash. A PowerShell console artefact.
- `LEDGER`'s fifth row setting `running.value = 2` looked like it broke the
  accumulation column. `the-ledger` filters to `STINTS` (`scored !== null`), so the
  `usa` row never reaches the running-total row. Only the interface comment
  over-promises.
- The HMR "hasn't mounted yet" warnings in the captured console log are dev-only
  artefacts of a file being edited mid-session. A clean load of the same server
  produces zero errors and zero warnings.

---

## 8. Explicitly not doing

- **Not** renaming or restructuring `DESIGN-AUDIT.md`. It is a punch list, and `design.md` at the
  root is a locked system for the design skill that would disarm every future audit.
- **Not** re-auditing the design. Variety and Hierarchy are judgements; that is the Hallmark
  re-audit already recorded as owed in `DESIGN-AUDIT.md` §Re-audit.
- **Not** touching the verified-correct figures. `tests/smoke.test.ts` now locks the era aggregates
  and the 849-game Cleveland reconciliation for exactly this reason.
- **Not** adding a DOM/browser test layer. It would add a dependency and still cannot judge the
  findings that motivated the design work.
- **Not** "fixing" `createPortal` being called on every render of
  `playoff-matrix`. `createPortal` is a pure factory that returns a portal
  object; it is not a side effect, and calling it during render is React's
  own documented pattern. Calling it in an effect would be strictly worse —
  the portal's children could not be in the first client tree, and the
  mount would need state to gate. The `typeof document !== "undefined"`
  guard is sufficient because the drawer can only open from a click, so the
  two renders cannot differ.
- **Not** "fixing" `reb: 6, ast: 9` in the debut box score, or the `layout.tsx` title. Both were
  checked against source and are correct; the first looked wrong only because the widely-reported
  narrative orders those two stats the other way round.
