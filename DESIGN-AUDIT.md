# Design Audit Spec — "The King" (LeBron fan tribute)

**Type:** design audit punch list · **Status:** open · **Date:** 2026-09-26
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

The 4-up band recurs **four separate times** in three components:

| Site | Component | Content |
|---|---|---|
| matrix stat tiles | `playoff-matrix.tsx` | LABEL / BIG NUMBER / CAPTION ×4 |
| era tabs | `shot-zones.tsx` | period / name / tagline ×4 |
| era micro-stats | `shot-zones.tsx` | PPG / FG% / 3P% / FT% ×4 |
| ledger tabs | `the-ledger.tsx` | club ×5 |

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

Nine sites: `center-court.tsx:194` · `era-compare.tsx:132,282,318,339,366` ·
`father-and-son.tsx:37` · `shot-zones.tsx:139` · `the-block.tsx:149`

Pattern is uppercase + `tracking-[0.2em]` or `tracking-widest` + wine/gold + a `·`
separator. This is the most recognisable AI typographic tic, and `AGENTS.md` §1 bans it by
name ("tracked-out all-caps eyebrows with middle dots (`A · B · C`)").

Compounding it: the eyebrows are **redundant labels for the section they sit in**.
"THE HEAT MAP" sits directly above a heading about shot zones; it carries no information
the heading did not.

**Fix direction.** Delete the eyebrows outright. Where a section genuinely needs a
kicker, set it in the body face at body size, sentence case, un-tracked, no separator.

**Acceptance.** 0 matches for `tracking-[0.2em]` and `tracking-widest` in `components/`.

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

`lib/lebron-data.ts:893` — the Miami era renders `FG% 54.3%` in the stat row while the
prose in the same panel reads *"peaked at a staggering 56.5% FG and 40.6% 3PT in
2012-13."*

Both numbers are real. 54.3% is a four-season aggregate; 56.5% is the 2012-13 peak. Nothing
on screen says so. A reader sees one number contradicted by the sentence beside it.

This is a credibility tell independent of data quality, and `AGENTS.md` §3 makes stat
labelling a hard rule.

**Fix direction.** Qualify the aggregate in the UI ("4-season avg") or drop it and show the
peak. Do not ship both bare.

**Acceptance.** No rendered panel shows two values for the same metric without a
qualifier distinguishing them.

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

`the-block.tsx:489` — `- {THE_BLOCK.caller}` (renders "— MIKE BREEN, ABC SPORTS")
`father-and-son.tsx:109` — `- {FATHER_AND_SON.quoteAuthor}`

`AGENTS.md` §1 bans "spaced-em-dash labels". This is the project's own rule, violated in
the project's own voice.

**Fix direction.** Drop the dash; set the attribution as a separate line in the caption
register.

**Acceptance.** 0 rendered `— ` before an attribution.

---

### F-07 · Gate 48 — palette disciplined in CSS, leaky in JSX · **Minor**

Eight inline hex values bypass the token layer:

`playoff-matrix.tsx:71,73,75,855` · `shot-zones.tsx:283,567` · `the-rooms.tsx:81,82`

`the-rooms:81-82` are arguably legitimate — those are per-team colours read from the data
module. The other six are hardcoded palette values that will drift from `globals.css`.

**Fix direction.** Lift the six into named tokens (or read them from the data module like
`the-rooms` does).

**Acceptance.** Every colour in `components/` resolves to a `var(--…)` token.

---

### F-08 · `rounded` incoherence · **Minor**

| Kind | Count |
|---|---|
| soft (`rounded-sm/md/lg/xl/2xl`) | 8 |
| `rounded-full` | 14 |
| `rounded-none` | 2 |

`globals.css:251` states the scrollbar thumb is *"square like everything else here"*. 14
pills and 8 soft cards argue with a court.

**Fix direction.** Commit to square. Pills survive only where they encode a round object
(the sound-toggle dot, the MVP ring marker).

**Acceptance.** `rounded-full` ≤ 4, all encoding genuinely round geometry.

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

Three claims in the spoken audit were wrong. Corrected here so they are not actioned:

| Claim | Correction |
|---|---|
| "`twenty-three` is ~40% dead space" | **Withdrawn.** A leaf-element content-bounds sweep at 1440px shows trailing space of 0–13% across all 15 blocks (`span` 13% worst, `number` 10%, `rooms` 0%). That is ordinary section padding, not a layout failure. The 40% figure came from misreading a viewport cut as a section boundary. |
| "41 soft radii" | **Corrected.** Accurate split is 8 soft / 14 `rounded-full` / 2 `rounded-none`. The original count double-counted `rounded-full` and `rounded-none`. |
| "a 23RD SEASON copy error" | **Not a defect.** Present in data as a stat label; recorded but not ranked. |

---

## Unverified — gates whose text was unavailable

Not audited. **Do not assume these pass.**

Gate **51** (`overflow-wrap: anywhere; min-width: 0` on display headers) — 0 matches for
`overflow-wrap` / `break-words` / `hyphens` anywhere in the codebase, which is *suspicious*
rather than passing. Long unbroken display strings have not been tested.

Gates **1–33, 35–45, 49, 50 (partial), 51, 52–58** — no text available.

---

## Suggested sequencing

| Wave | Findings | Rationale |
|---|---|---|
| **A** | F-01, F-02 | Rhythm and the eyebrow. These change how the page *reads*. Do them together or the intermediate state still looks templated. |
| **B** | F-03, F-04 | Type-system coherence and the stat contradiction. Bounded, mechanical, independently shippable. |
| **C** | F-05, F-06, F-07, F-11 | Gate compliance. Each is a few lines; together they close every gate this audit could measure. |
| **D** | F-08, F-09, F-10, F-12, F-13 | Polish. |

F-01 is the only finding that requires design decisions rather than edits, and it is the
one that matters. Everything in Wave C is a half-hour of work.

---

## Re-audit

Re-run the Hallmark `audit` verb after Wave A lands and compare the six axes. Target:
**Variety ≥ 4**, **Hierarchy ≥ 4**, **Restraint ≥ 4**, with Philosophy and Specificity held
at 5. Re-verify the gate table in §4 — those passes are the regression surface.
