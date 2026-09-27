# Design Audit Spec — "The King" (LeBron fan tribute)

**Type:** design audit punch list · **Date:** 2026-09-26
**Amended:** 2026-09-26 — see §Corrections to this document and F-04b
**Status:** F-01 … F-13 and F-04b all **remediated**; the six-axis scores below are the
**pre-change** scores and are now stale. A re-audit is still owed — see §Re-audit.
**Target:** `http://localhost:3000` · Next.js 16.3.3 / React 19.2.8 / Tailwind v4 / Framer Motion 13

---

## What this document is

A ranked, evidence-backed list of where this site reads as machine-generated rather than
made, plus what is working and must not be regressed.

### What this document is *not*

**This is deliberately not named `design.md`.** The Hallmark skill treats a root
`design.md` as *the locked design system for the project* — a file that **overrides the
skill's own genre, theme, typography and structure picks on every future run**. A punch
list is not a locked system. Naming it `design.md` would silently disarm every subsequent
Hallmark audit and redesign pass in this repo. Do not rename it.

---

## Method and scope limits

Audited with the `hallmark` skill, `audit` verb (read-only; no files were modified by the
audit itself).

**Limitation, stated plainly:** the skill's `references/` directory is not present in this
environment — only the `SKILL.md` body was available, and it was truncated at 427 of 573
lines. The full 58-gate slop test therefore **did not run**. Audited against what was
available:

- the six cross-verb disciplines (Philosophy · Hierarchy · Execution · Specificity · Restraint · Variety)
- the named anti-patterns in the skill body
- the ten gates whose full text was present: **34, 38a, 46, 47, 48, 49, 50, 51, 52, 53**

Gates whose text was unavailable are listed as **unverified** in §7. They are *not*
assumed to pass.

Verification method: source grep with line references, computed-style measurement in
Chromium at 1440 / 768 / 414 / 375 / 320 px, `getBoundingClientRect` geometry, live
keyboard and focus-trap interaction, and a leaf-element content-bounds sweep for dead
space.

---

## Verdict

This is **not a slop page.** Two of the six axes are at ceiling, and the slop is
concentrated in one measurable place: **rhythm**.

| Philosophy | Hierarchy | Execution | Specificity | Restraint | Variety |
|---|---|---|---|---|---|
| **5** | 3 | 4 | **5** | 3 | **2** |

- **Philosophy 5** — the hardwood conceit is a real constraint that actually binds. Court
  geometry does structural work that borders and cards would otherwise do; team colours
  carry information; the palette is committed rather than applied.
- **Specificity 5** — zero invented content. Every figure is a real, sourced, derived NBA
  statistic. This is the most common AI tell and the site is clean.
- **Variety 2** — the failure. Thirteen sections run one structural rhythm (§ F-01).

**One caveat added 2026-09-26.** "No invented metrics" (Specificity 5) holds, but *verifying*
the figures during implementation found five era aggregates that were real numbers scoped to the
wrong window — Cleveland's eleven-year FT% sitting in the seven-year first stint, and three
stale Lakers figures. Nothing was fabricated; something was mislabelled by scope. Fixed as
**F-04b**, which is a data-integrity defect and outranks every design finding in this document.
A design audit cannot find this class of bug; only re-deriving a figure from its season totals
can.

---

## What passes — protect these

Recorded so a later pass does not "improve" them into regression.

| Gate | Result | Evidence |
|---|---|---|
| **46** — no invented metrics | **PASS** | 0 matches for `trusted by` / `+N% faster` / `10x` / fabricated counts across `components/` and `lib/lebron-data.ts` |
| **47** — no re-drawn UI chrome | **PASS** | 0 matches for browser-bar / phone-frame / mock-window patterns |
| **38a** — no italic headings | **PASS** | 4 italics exist (`father-and-son.tsx:105`, `shot-zones.tsx:550`, `the-block.tsx:485`, `the-ledger.tsx:303`); all are body copy or pull-quotes, none on `h1`–`h6` |
| **49** — no two-line clickable text | **PASS** | 0 real controls wrap to 2 lines at 320/375/414/768. (Compound milestone buttons in `father-and-son` are 2-line *by content*, not by wrap.) |
| **52** — section heads collapse | **PASS** | 0 multi-column heading parents at any of the four widths |
| **—** — horizontal overflow | **PASS** | `scrollWidth − clientWidth = 0` at 320 / 375 / 414 / 768 |
| **—** — nav archetype | **PASS by absence** | No nav bar at all. The season ruler is the map; the index is the footer. Sidesteps N1a, N1b and the whole floating-pill / mega-menu / chip family. |
| **—** — footer archetype | **PASS** | Statement footer ("THE WORK CONTINUES.") over a real index. Not Ft3: no social row, no copyright line, no 4-column link dump. |
| **—** — decoration restraint | **PASS** | No gradients-as-decoration, no glow, no stock photography, no custom cursor, no grain overlay. |

---

## Findings

Severity is **design impact**, not correctness.

### F-01 · Structural monotony — one rhythm, thirteen sections · **Major**

Every section opens identically: eyebrow → full-bleed huge Oswald headline → standfirst
paragraph → a 4-column band. Thirteen for thirteen, no exceptions.

The 4-up band recurs **seven** times across three components:

| Site | Component | Content |
|---|---|---|
| matrix stat tiles | `playoff-matrix.tsx:378` | LABEL / BIG NUMBER / CAPTION ×4 |
| drawer header stats | `playoff-matrix.tsx:912` | ×4 |
| era tabs | `shot-zones.tsx:156` | period / name / tagline ×4 |
| era micro-stats | `shot-zones.tsx:238` | PPG / FG% / 3P% / FT% ×4 |
| final-game line score | `the-block.tsx:172` | ×4 |
| history-nights row | `father-and-son.tsx:153` | ×5 |
| history-nights row | `father-and-son.tsx:216` | ×5 |

`playoff-matrix.tsx:587` is the 57-card grid at `xl:grid-cols-4` — a card grid, not a band,
and not counted above.

Measured section heights confirm the repetition is structural, not incidental:
`span` 752 · `hardware` 2401 · `line` 1437 · `rooms` 4245 · `father-son` 1722 ·
`ledger` 1339 · `shot-zones` 1329 · `playoff-matrix` 5516 · `era-compare` 2046 ·
`number` 900 · `shot` 1079 · `nights` 1571 · `the-block` 1314.

The one structural departure — `rooms`, the pinned scroll-linked chapters — is the best
section on the page. That is the argument for more of it.

**Fix direction.** Give the eight data-heavy sections four distinct openers, not four
distinct colour treatments. Candidate moves already latent in the content: `line` is a
single written stat line and should *read* as one line, not sit under a headline; `rooms`
already pins; `the-block` already owns a scrubber; `hardware` is a ledger and could be set
as a ruled column rather than cards.

**Acceptance.** No two consecutive sections share an opener silhouette. The 4-up band
appears at most twice in the whole page.

---

### F-02 · The eyebrow is the loudest single tell · **Major**

Nine sites: `center-court.tsx:204` · `era-compare.tsx:132,282,318,339,366` ·
`father-and-son.tsx:37` · `shot-zones.tsx:139` · `the-block.tsx:149`

Pattern is uppercase + `tracking-[0.2em]` or `tracking-widest` + wine/gold + a `·`
separator. This is the most recognisable AI typographic tic, and `AGENTS.md` §1 bans it by
name ("tracked-out all-caps eyebrows with middle dots (`A · B · C`)").

Compounding it: where it sits above a heading, the eyebrow is a **redundant label for the
section it sits in**. "THE HEAT MAP" sits directly above a heading about shot zones; it
carries no information the heading did not.

Only four of the nine are redundant. The split matters, because deleting all nine — as this
finding originally directed — strips four labels that tell the reader which metric group they
are reading, plus one functional control label:

| Site | Text | Role | Action |
|---|---|---|---|
| `era-compare.tsx:132` | `{heading} · PEAK COMPARATOR` | restates the heading | **delete** |
| `father-and-son.tsx:37` | `{heading} · 2003—2024` | restates the heading | **delete** |
| `shot-zones.tsx:139` | `{heading}` | restates the heading | **delete** |
| `the-block.tsx:149` | `{subheading}` | restates the heading | **delete** |
| `center-court.tsx:204` | `Scroll to explore` | the hero's scroll affordance | **restyle** |
| `era-compare.tsx:282` | `Scoring & Shooting Efficiency` | names the group below it | **restyle** |
| `era-compare.tsx:318` | `Playmaking & Control` | ditto | **restyle** |
| `era-compare.tsx:339` | `Rebounding & Defense` | ditto | **restyle** |
| `era-compare.tsx:366` | `Team Regular Season Record` | ditto | **restyle** |

**Fix direction.** Delete the four redundant eyebrows. Set the five that survive in the body
face at body size, sentence case, un-tracked, with no separator glyph.

**Acceptance.** 0 matches for `tracking-[0.2em]` and `tracking-widest` in `components/`. Note
that removing the utility is necessary but **not sufficient**: `Caption` resolves to `.narrow`,
which is uppercase with `0.04em` tracking, so a survivor that keeps `Caption` looks unchanged.
A surviving kicker needs a class that does not inherit `.narrow`.

---

### F-03 · Three parallel type systems, not one · **Major**

**47 raw `font-mono` utilities** bypass the designed type classes:

| File | Count |
|---|---|
| `father-and-son.tsx` | 25 |
| `era-compare.tsx` | 15 |
| `shot-zones.tsx` | 7 |

These sit directly beside `.narrow` / `.narrow-bold` in `globals.css:113-127`, which are
the *designed equivalent* — same role (label, caption, data string), different face. The
CSS comment claims the narrow cut "replaces the usual monospace"; it does not. The
monospace is used 47 times. `font-serif` was a fourth voice until removed on 2026-09-26.

**Fix direction.** Two families, full stop — Oswald (display) and Plus Jakarta Sans
(everything else). Route every one of the 47 through `.narrow` / `.narrow-bold` /
`.prose-copy`, or delete the utility where the role is decorative.

**Acceptance.** 0 matches for `font-mono` in `components/`. Every label resolves to one
of the six declared type classes.

---

### F-04 · Two different numbers for one thing, unlabelled, in one band · **Major**

`lib/lebron-data.ts` (the `mia` era object) renders `FG% 54.3%` in the stat row while the
prose in the same panel reads *"peaked at a staggering 56.5% FG and 40.6% 3PT in 2012-13."*

Both numbers are real. 54.3% is a four-season attempts-weighted aggregate; 56.5% is the
2012-13 peak. Nothing on screen says so. A reader sees one number contradicted by the sentence
beside it. This is a credibility tell independent of data quality, and `AGENTS.md` §3 makes
stat labelling a hard rule.

**Verified 2026-09-26 — the Miami figures are correct.** Both were checked against Basketball
Reference season totals, and 54.3 / 36.9 / 75.8 / 26.9 match BBR's own `MIA (4 Yrs)` row
(`.543 / .369 / .758 / 26.9`, 294 games) exactly. The 2012-13 peak in the narrative is exact
too. **The defect is the missing qualifier, not the number** — which is the opposite of what
the same verification found in three sibling eras, below.

### F-04b · Five stale era aggregates, found while verifying F-04 · **Critical, data integrity**

The four era headline figures (`ppg` / `fgPct` / `threePtPct` / `ftPct`) are supposed to be
attempts-weighted aggregates over the seasons each era's `period` names. Three of the four eras
had drifted. All five figures below are now corrected in `lib/lebron-data.ts` and locked by a
test in `tests/smoke.test.ts`.

| Era | Window | Games | Field | Was | Now |
|---|---|---|---|---|---|
| `cle1` | 2003-04 … 2009-10 | 548 | `ftPct` | 73.3 | **74.2** |
| `cle2` | 2014-15 … 2017-18 | 301 | `ftPct` | 70.8 | **71.1** |
| `lal` | 2018-19 … 2025-26 | 479 | `fgPct` | 51.8 | **51.3** |
| `lal` | " | " | `threePtPct` | 35.8 | **35.6** |
| `lal` | " | " | `ftPct` | 74.5 | **73.0** |

**How the first one was caught, and why it is a trap worth recording:** `cle1.ftPct` read
73.3, which is *exactly* Cleveland's **eleven**-year figure — both stints, 849 games. It looks
right because it is a real, authoritative number; it is just the wrong window. Summing the
seven first-stint seasons gives 74.2. The cross-check that exposes this class of error is that
`cle1 + cle2` must reconcile to BBR's `CLE (11 Yrs)` row (849 games, `.492 / .337 / .733`),
and it does once `cle1.ftPct` is 74.2. That reconciliation is now an assertion.

`AGENTS.md` §3 forbids fabricated or drifted stats. A figure that is real but scoped to the
wrong window is still a wrong figure on screen.

**Fix direction (F-04).** Qualify the aggregate in the UI — label the band as the era's
multi-season average, and make the narrative's peak explicitly a single season. Keep both
numbers; they are both true and the aggregate is the more useful one for comparing eras.

**Acceptance.** No rendered panel shows two values for the same metric without a
qualifier distinguishing them. And no era figure may be edited without re-deriving it from
season totals.

---

### F-05 · Gate 53 — in-page anchors scroll-jump · **Major, confirmed live**

`scroll-margin-top` appears **nowhere** in the codebase (0 matches in `app/globals.css` and
`components/`). `html { scroll-behavior: smooth }` (`globals.css:70`).

Confirmed in Chromium: activating a footer index link leaves `window.scrollY === 0` — the
target lands flush against the viewport top with no breathing room and no sticky header to
clear. The hero's own `#span` affordance does the same. The season ruler's 23 targets sit
directly beneath a `min-h-[92svh]` hero, so the jump is severe there.

**Fix direction.** `scroll-margin-top` on every anchor target — sections and the 23 ruler
buttons. One utility class on the section root plus one on the ruler group covers it.

**Acceptance.** Activating any of the 13 footer links or the hero affordance leaves
`scrollY > 0` and ≥ 1rem of clearance above the target heading.

---

### F-06 · Spaced em-dash attribution · **Minor**

Five rendered sites, not two:

| Site | Renders |
|---|---|
| `the-block.tsx:489` | `— MIKE BREEN, ABC SPORTS` |
| `father-and-son.tsx:109` | `— {quoteAuthor}` |
| `father-and-son.tsx:254` | `2003 — 2024` |
| `era-compare.tsx:184` | `{seasonLabel} ({city}) — {name}` inside a `<select>` |
| `era-compare.tsx:240` | same, second `<select>` |

`AGENTS.md` §1 bans "spaced-em-dash labels". This is the project's own rule, violated in
the project's own voice.

`playoff-matrix.tsx:372` has an unspaced `games—scoring`, which is outside the spaced rule and
out of scope. `father-and-son.tsx:38` carries the banned `·` middle dot inside an eyebrow and
is removed by F-02 regardless.

**Fix direction.** Drop the dash; set the attribution as a separate line in the caption
register. The two `<select>` options are the same defect in a control the reader picks from,
so they go too.

**Acceptance.** 0 rendered `— ` before an attribution or inside a `<select>` option.

---

### F-07 · Gate 48 — palette disciplined in CSS, leaky in JSX · **Minor**

Six inline hex values bypass the token layer:

`playoff-matrix.tsx:71,73,75,855` · `shot-zones.tsx:283,567`

`playoff-matrix.tsx:71,73,75` are `teamColor()` fallbacks; `shot-zones.tsx:283` is the court
`<rect>` fill; `shot-zones.tsx:567` is a zone-band swatch.

**A prior draft of this finding also named `the-rooms.tsx:81,82` as "per-team colours read
from the data module". That was a misreading** — those two hexes are inside a *code comment*
explaining why `room.paint` was rejected for contrast. The colour actually applied there is
`room.type`, read from the data module (`the-rooms.tsx:84`). The count of six was right; the
aside was not.

This matters mechanically rather than cosmetically: a guard that greps raw source text will
match hexes inside comments and fail on documentation of a value that was deliberately
rejected. A guard scoped to JSX attribute values does not see comments at all.

Per-team colours in `lib/lebron-data.ts` (`primaryColor`, `room.paint`) are data, not chrome,
and stay as they are.

**Fix direction.** Lift the six into named tokens (or read them from the data module like
`the-rooms` does).

**Acceptance.** Every colour in a component's JSX resolves to a `var(--…)` token.

---

### F-08 · `rounded` incoherence · **Minor**

| Kind | Count |
|---|---|
| bare `rounded` | 32 (31 in `playoff-matrix.tsx`, 1 in `the-ledger.tsx`) |
| `rounded-md` | 8 (all in `playoff-matrix.tsx`) |
| `rounded-[50%]` | 1 (`last-shot.tsx:388`) |
| **soft total** | **40** |
| `rounded-full` | 14 |
| `rounded-none` | 2 |

`globals.css:251` states the scrollbar thumb is *"square like everything else here"*. 14
pills and 40 soft radii argue with a court. The count matters: the original spoken audit's
"41 soft radii" was **right** (40 soft + the one `rounded-[50%]`), and the correction table
in this document was wrong to withdraw it — see §Corrections.

**Fix direction.** Commit to square. Pills survive only where they encode a round object
(the two balls, the rim target, the live-status dot). The season ruler already draws square
markers beside its round ones (`season-ruler.tsx:61`, `:298`), so squaring them makes the row
internally consistent rather than mixed.

**Acceptance.** `rounded-full` ≤ 4, all four encoding genuinely round geometry. Soft radii
→ 0.

---

### F-09 · Uniform hover-lift on the card grid · **Minor**

`playoff-matrix.tsx:610` — `whileHover={{ y: -2 }}` on all 57 series cards. Uniform
hover-lift across a card grid is a named AI tell.

**Fix direction.** Replace with a per-card affordance that carries information — e.g. the
result badge inverts, or the "INSPECT" rule extends. Pick one and apply it to all 57, but
make it mean something.

**Acceptance.** No `whileHover` / `hover:-translate-y` on a card grid.

---

### F-10 · Box-in-box density in the series card · **Minor**

A matrix card nests three frames before any content: card border → stat-box border →
three figures, inside ~300px. Combined with the badge row, the card carries six border
edges and two background fills.

**Fix direction.** Drop the stat-box border; let the figures sit on the card fill with
tabular alignment. One frame per level.

---

### F-11 · Gate 34 — partial · **Minor**

`overflow-x: clip` is declared once, at `globals.css:82`, inside the **`body`** rule. The
`html` rule (`globals.css:70-73`) sets no `overflow-x` and computes `visible`. The gate
asks for `clip` on **both**.

Currently defensive only — measured overflow is 0 at all four widths — but it is a literal
gate item and one future `min-width` on `html` re-opens it.

**Fix direction.** Add `overflow-x: clip` to `html`. Never `hidden` — that would create a
scroll container and break `position: sticky` in `the-rooms` (see the comment at
`globals.css:71`).

---

### F-12 · Gate 50 — bare `1fr` · **Nit**

`the-rooms.tsx:76` — `lg:grid-cols-[1fr_auto]`. Not image-bearing, so overflow risk is low,
but the gate asks for `minmax(0, 1fr)`.

---

### F-13 · Ghost numeral crop reads as an accident · **Nit**

The oversized `23` in `components/twenty-three.tsx` bleeds off the right edge mid-glyph.
Large ghosted numerals are themselves a familiar editorial tic; this one is cropped hard
enough that it reads as a rendering fault rather than a decision.

**Fix direction.** Either crop to a clean edge (so it reads intentional) or pull it fully
inside the frame.

---

## Corrections to the verbal audit

Three claims in the spoken audit were wrong, and **a fourth correction below was itself
wrong** — corrected here so none of them are actioned:

| Claim | Correction |
|---|---|
| "`twenty-three` is ~40% dead space" | **Withdrawn.** A leaf-element content-bounds sweep at 1440px shows trailing space of 0–13% across all 15 blocks (`span` 13% worst, `number` 10%, `rooms` 0%). That is ordinary section padding, not a layout failure. The 40% figure came from misreading a viewport cut as a section boundary. |
| "41 soft radii" | **Confirmed — and the original withdrawal of it was the error.** Measured: 32 bare `rounded` + 8 `rounded-md` = **40 soft**, plus 1 `rounded-[50%]` = 41. The accurate split is 40 soft / 14 `rounded-full` / 2 `rounded-none`, *not* the "8 soft" an earlier draft of this table claimed. That draft counted only the sized utilities and missed all 32 bare `rounded`. F-08 is five times the size that draft implied. |
| "a 23RD SEASON copy error" | **Not a defect.** Present in data as a stat label; recorded but not ranked. |
| "the era panel shows two values for one metric" | **Correct as a labelling defect, and the data underneath it was separately wrong.** See F-04. |

### Corrections to this document (2026-09-26)

Made while implementing issue #29. Each was found by measuring the source rather than
re-reading this document, and each would have produced a wrong fix if actioned as written:

| Section | Was | Actually |
|---|---|---|
| F-01 band table | 4 sites in 3 components | **7** sites (5 four-up, 2 five-up). The named "ledger tabs · club ×5 · `the-ledger.tsx`" **does not exist** — that file uses `lg:grid-cols-2`; the two 5-up bands are in `father-and-son.tsx` |
| F-02 | all 9 `tracking` sites are redundant eyebrows | only **4** are. One is the hero's functional scroll affordance; four are `era-compare` metric-group labels that carry information. Split: 4 delete, 5 restyle |
| F-06 | 2 sites | **5** rendered spaced em-dashes |
| F-07 | "8 hex values… `the-rooms:81-82` are per-team colours" | the `the-rooms.tsx` hexes are **inside a code comment**, not JSX. Six real sites. A guard must not match comment text |
| F-04 | "Both numbers are real" | Miami's four figures are real. **Three other eras were wrong** and are now corrected |

---

## Unverified — gates whose text was unavailable

Not audited. **Do not assume these pass.**

Gate **51** (`overflow-wrap: anywhere; min-width: 0` on display headers) — 0 matches for
`overflow-wrap` / `break-words` / `hyphens` anywhere in the codebase, which is *suspicious*
rather than passing. Long unbroken display strings have not been tested.

Gates **1–33, 35–45, 49, 50 (partial), 51, 52–58** — no text available.

---

## Spec reconciliations required by issue #29

Issue #29's own text is self-inconsistent in three places. Resolutions were applied during
implementation; recorded here so they are not re-litigated.

| # | Conflict | Resolution |
|---|---|---|
| R1 | Testing Decisions make "the section-height and four-item-band counts" the mechanical F-01 checks. Section height is not observable without a DOM layer, which Out of Scope explicitly forbids. | Band count becomes a source assertion. Section height is replaced by a **declared-opener adjacency** assertion: each page unit exports an `OPENER`, and no two adjacent units in `app/page.tsx` may share one. That is the acceptance condition F-01 actually states, and it *is* checkable from source. |
| R2 | User story 23 asks for a round-shape budget gate; "Which guards" lists seven guards and the round count is not among them. | The budget is a *count*, and no ESLint selector can count. It ships as a source-count assertion in the test gate, alongside the other "read the source as text" assertions. |
| R3 | Testing Decisions require the source guards to be `no-restricted-syntax`. That rule matches **AST selectors only** and cannot match a substring of a `className` value, which is what four of the five guards need. | Use esquery attribute-regex selectors, which the rule does support, e.g. `JSXAttribute[name.name='className'][value.value=/font-mono/]`. Fallback if a selector proves unreliable: a virtual local plugin declared inline in `eslint.config.mjs`. Either way — no new dependency, no new workflow, native file:line reporting. |

---

## Suggested sequencing

| Wave | Findings | Rationale |
|---|---|---|
| **0** | F-04b, plus the corrections above | Correct the record and the data before implementing against either. Five stale era aggregates are a data-integrity defect and outrank every design finding here. |
| **A** | F-01, F-02 | Rhythm and the eyebrow. These change how the page *reads*. Do them together or the intermediate state still looks templated. |
| **B** | F-03, F-04 | Type-system coherence and the stat labelling. Bounded, mechanical, independently shippable. |
| **C** | F-05, F-07, F-11 + the guards | Gate compliance, plus the mechanical enforcement so none of this returns. |
| **D** | F-06, F-08, F-09, F-10, F-12, F-13 | Polish. F-08 lands last because it changes ~50 shapes at once and should land on a page whose rhythm, type and gates are already correct. |

F-01 is the only finding that requires design decisions rather than edits, and it is the
one that matters most after F-04b. Everything in Wave C is a half-hour of work.

---

## Re-audit

**Still owed.** The mechanical proxies all moved in the intended direction, and they are the only
things that can be measured without re-running the audit:

| Property | Before | After |
|---|---|---|
| four-item band sites | 7 | 2 (`StatBand`, capped) |
| tracked all-caps eyebrow sites | 9 | 0 |
| distinct typefaces rendering | 3 (+ monospace by SVG default) | 2 |
| soft radii / `rounded-full` | 40 / 14 | 0 / 4 |
| anchor clearance on a footer link | 0 px, `scrollY` 0 | 83 px, `scrollY` 13055 |
| adjacent units sharing an opener | 13 of 13 | 0 of 13 |
| era aggregates verified against source | 0 of 16 | 16 of 16 |

None of that is a Variety or a Hierarchy score. Those are judgements about whether the page now
*reads* as made rather than generated, and only re-running the Hallmark `audit` verb on the same
six axes can say. Target: **Variety ≥ 4**, **Hierarchy ≥ 4**, **Restraint ≥ 4**, with Philosophy and
Specificity held at 5. Re-verify the gate table in §What passes — those are the regression surface,
and a shape change landing across 50 elements is exactly the kind of sweep that quietly undoes one.
