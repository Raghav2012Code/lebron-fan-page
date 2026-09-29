# Implementation plan — issue #29 (design remediation)

**Issue:** [#29 Design remediation: break the repeated section rhythm and remove the audited
anti-slop tells](https://github.com/Raghav2012Code/lebron-fan-page/issues/29)
**Evidence source:** `DESIGN-AUDIT.md` (findings F-01 … F-13) — **do not rename it to `design.md`**
(see the issue's Further Notes: that filename is a locked system for the Hallmark skill).
**Status:** planned, not started.

---

## 0. Verified baseline

Measured on `be599a8`, working tree clean. All four gates are green **before** any change, so any
red gate during execution is caused by this work and not inherited.

| Gate | Command | Baseline |
|---|---|---|
| Lint | `npm run lint` | clean, 0 errors 0 warnings |
| Types | `npm run typecheck` | clean |
| Tests | `npm test` | 56 pass / 0 fail (4 suites) |
| Build | `npm run build` | compiles, `/` prerendered static |

Re-run all four after **every** wave, not just at the end.

---

## 1. Corrections to the record — read this before editing anything

`DESIGN-AUDIT.md` is the evidence source, and five of its factual claims are wrong. Implementing
against them produces a page that does not satisfy the issue's own acceptance conditions. Wave 0
fixes the record first; everything after this section is written against the corrected record.

### 1.1 F-08's radius counts are wrong, and the audit's own "correction" is the error

`DESIGN-AUDIT.md:315` withdraws a "41 soft radii" claim and substitutes "8 soft". The
substitution is the mistake. Measured across `components/*.tsx`:

| Kind | Audit says | Actually |
|---|---|---|
| bare `rounded` | — (not counted) | **32** (31 in `playoff-matrix.tsx`, 1 in `the-ledger.tsx`) |
| `rounded-md` | 8 | 8 (all in `playoff-matrix.tsx`) |
| `rounded-[50%]` | — (not counted) | 1 (`last-shot.tsx:388`) |
| **soft total** | **8** | **40** |
| `rounded-full` | 14 | 14 ✓ |
| `rounded-none` | 2 | 2 ✓ |

So the withdrawn "41 soft radii" figure was right (40 + the one `rounded-[50%]`), and the
correction table is what introduced the error. **F-08 is roughly five times the size the audit
implies.** The budget work in Wave D is sized against 40, not 8.

### 1.2 F-01's four-item band table is incomplete and misattributes one site

Audit lists four band sites in three components. Measured, there are five four-up and two five-up:

| Site | Component:line | Audit lists it? |
|---|---|---|
| matrix stat tiles | `playoff-matrix.tsx:378` | yes |
| era tabs | `shot-zones.tsx:156` | yes |
| era micro-stats | `shot-zones.tsx:238` | yes |
| **drawer header stats** | `playoff-matrix.tsx:912` | **no** |
| **the-block line score** | `the-block.tsx:172` | **no** |
| **history-nights row** | `father-and-son.tsx:153` | **no** (listed as "ledger tabs club ×5") |
| **history-nights row** | `father-and-son.tsx:216` | **no** |
| 57-card grid at `xl:grid-cols-4` | `playoff-matrix.tsx:587` | no (a card grid, not a band) |

The audit's fourth entry, "ledger tabs · club ×5 · `the-ledger.tsx`", does not exist:
`the-ledger.tsx` uses `lg:grid-cols-2` (line 214). The 5-up bands are in `father-and-son.tsx`.
The acceptance condition "the four-item band appears at most twice in the whole page" therefore
governs **seven** sites, not four.

### 1.3 F-06 has five rendered spaced em-dashes, not two

| Site | Rendered |
|---|---|
| `the-block.tsx:489` | `— {THE_BLOCK.caller}` (named by the audit) |
| `father-and-son.tsx:109` | `— {FATHER_AND_SON.quoteAuthor}` (named by the audit) |
| `father-and-son.tsx:254` | `2003 — 2024` (not named) |
| `era-compare.tsx:184` | `{seasonLabel} ({city}) — {name}` inside a `<select>` (not named) |
| `era-compare.tsx:240` | same, second `<select>` (not named) |

`playoff-matrix.tsx:372` has an unspaced `games—scoring`, which is outside the spaced rule and
out of scope. `father-and-son.tsx:38` carries the banned `·` middle dot inside the eyebrow and is
removed by Wave A regardless.

### 1.4 F-07's aside about `the-rooms.tsx:81-82` is a misreading

Those two hex values are **inside a code comment** explaining why `room.paint` was rejected for
contrast. The colour actually applied is `room.type`, read from the data module
(`the-rooms.tsx:84`). They are not inline colours. The issue's count of **six** hardcoded palette
values is correct; the audit's aside is not.

**This matters mechanically:** a naive hex guard will match hexes inside comments and fail on
`the-rooms.tsx` documentation. The guard must skip comments (Wave C).

The six real sites: `playoff-matrix.tsx:71,73,75,855` · `shot-zones.tsx:283,567`.
`playoff-matrix.tsx:71,73,75` are `teamColor()` fallbacks; `shot-zones.tsx:283` is the court `<rect>`
fill; `shot-zones.tsx:567` is a zone-band swatch.

### 1.5 Only four of the nine "eyebrows" are redundant eyebrows

`DESIGN-AUDIT.md:122-124` calls all nine `tracking` sites redundant labels for their section, and
that is true of only four. The other five carry information:

| Site | Text | Real role | Action |
|---|---|---|---|
| `era-compare.tsx:132` | `{heading} · PEAK COMPARATOR` | restates the heading below it | **delete** |
| `father-and-son.tsx:37` | `{heading} · 2003—2024` | restates the heading below it | **delete** |
| `shot-zones.tsx:139` | `{heading}` | restates the heading below it | **delete** |
| `the-block.tsx:149` | `{subheading}` | restates the heading below it | **delete** |
| `center-court.tsx:204` | `Scroll to explore` | the hero's scroll affordance — functional | **restyle** |
| `era-compare.tsx:282` | `Scoring & Shooting Efficiency` | names the metric group below it | **restyle** |
| `era-compare.tsx:318` | `Playmaking & Control` | ditto | **restyle** |
| `era-compare.tsx:339` | `Rebounding & Defense` | ditto | **restyle** |
| `era-compare.tsx:366` | `Team Regular Season Record` | ditto | **restyle** |

Deleting all nine, as the audit directs, would strip a functional control label and four labels
that tell the reader which comparison group they are reading. The correct split is **4 deleted,
5 restyled** onto a new sentence-case kicker (§A.2).

### 1.6 The stat contradiction (F-04) — RESOLVED AGAINST THIS PLAN, see §11

`DESIGN-AUDIT.md:164-170` asserts both figures are correct and only the qualifier is missing. That
premise is load-bearing, so it was verified before anything was edited.

**The plan's suspicion was half wrong, and that is why the verification was worth doing.**
`lib/lebron-data.ts`'s `mia` era object, rendered by `shot-zones.tsx:238` beside its own narrative:

- narrative: *"peaked at a staggering 56.5% FG and 40.6% 3PT in 2012-13"* — **exactly correct**;
  those are LeBron's real 2012-13 splits.
- stat row: `fgPct: 54.3`, `threePtPct: 36.9`, `ppg: 26.9`, `ftPct: 75.8`, over `period: "2010–2014"`.

**All four Miami figures are correct.** They match Basketball Reference's own `MIA (4 Yrs)` row
(`.543 / .369 / .758 / 26.9`, 294 games) exactly. The audit's claim stands: F-04 is a missing
qualifier, not a bad number. The plan's guess that they were wrong came from averaging seasonal
*rates* instead of weighting by *attempts* — 2011-12 was a 62-game season, which moves the answer
several points.

**But the same verification found five genuinely stale figures in three sibling eras**, and
`cle1.ftPct: 73.3` is the clearest case in the repo's history: it is *exactly* Cleveland's
**eleven**-year figure (both stints, 849 games) sitting in the seven-year first stint. It looks
right because it is a real authoritative number; it is just scoped to the wrong window. Summing
the seven first-stint seasons gives 74.2, and `cle1 + cle2` then reconciles to BBR's `CLE (11 Yrs)`
row exactly — which is now an assertion.

Shipped as **F-04b**, critical, data integrity. See `DESIGN-AUDIT.md` §F-04b for the corrected
table and `tests/smoke.test.ts` for the lock.

The transferable lesson, recorded because it nearly went the other way: **a figure that is real
but scoped to the wrong window is still a wrong figure on screen**, and no amount of checking one
field in isolation will find it. Reconcile the parts against the whole.

### 1.7 Spec reconciliations required

Three places where the issue's own text is self-inconsistent. Resolutions are recorded here and
applied; flagging rather than silently choosing would stall the work.

| # | Conflict | Resolution |
|---|---|---|
| R1 | Testing Decisions say the mechanical F-01 checks are "the section-height and four-item-band counts", but section height is not observable without a DOM layer, which Out of Scope explicitly forbids. | Band count becomes a source assertion (G3). Section height is replaced by a **declared-opener adjacency** assertion over `app/page.tsx` (G4), which is the acceptance condition stated in Implementation Decisions and *is* checkable from source. |
| R2 | User story 23 asks for a round-shape budget gate; "Which guards" lists seven guards and the round count is not among them. | The budget is a *count*, and `no-restricted-syntax` cannot count. It ships as a source-count assertion in the test gate (G5), consistent with "assertions read the source as text". |
| R3 | Testing Decisions require the source guards to be `no-restricted-syntax`. `no-restricted-syntax` matches **AST selectors only** (confirmed against the ESLint v9 rule source) — it cannot match a substring of a `className` value, which is what four of the five guards need. | Use esquery attribute-regex selectors, which `no-restricted-syntax` does support, e.g. `JSXAttribute[name.name='className'][value.value=/font-mono/]`. If any selector proves unreliable in practice, fall back to a **virtual local plugin declared inline in `eslint.config.mjs`** (ESLint's documented `plugins: { local: { rules: {} } }` pattern). Either way: no new dependency, no new workflow, native file:line reporting. |

---

## 2. Wave 0 — correct the record, settle the disputed figures

Nothing else starts until this lands. Small, and it is what makes the rest safe.

### 0.1 Fix `DESIGN-AUDIT.md`

- §Corrections: reverse the F-08 radius withdrawal (§1.1). State 32 bare `rounded`, 8
  `rounded-md`, 1 `rounded-[50%]`, 40 soft total, 14 `rounded-full`, 2 `rounded-none`.
- F-01: replace the four-site band table with the seven-site table (§1.2); drop the non-existent
  `the-ledger.tsx` club band.
- F-06: five sites, not two (§1.3).
- F-07: delete the `the-rooms.tsx` aside; note that the hexes there are inside a comment and that
  the guard must skip comments (§1.4).
- F-02: split the nine sites into 5 deleted / 4 restyled (§1.5).
- F-04: replace "Both numbers are real" with the unverified premise and point at Wave 0.2 (§1.6).
- Add a line recording R1–R3 (§1.7) so the next agent does not re-derive them.

**Do not rename this file.** Add findings, do not restructure it.

### 0.2 Verify the era aggregates against Basketball Reference

Check every `ppg` / `fgPct` / `threePtPct` / `ftPct` on all four `SHOT_ZONES.eras` objects
(`lebron-data.ts:781, 887, 993, 1099`) against the seasons each `period` names, attempts-weighted.
Priority: `mia.fgPct`, `mia.threePtPct`, `cle1.ftPct`.

Record the result in the same place issue #19 recorded its verdicts, and apply the data-module
convention that an approximation carries a flag (`AGENTS.md` §3). Branch:

- fields reconcile → Wave B adds a qualifier only.
- a field is wrong → correct it, and add the qualifier. A corrected aggregate and a labelled
  aggregate are both required; the qualifier alone is not the fix.

**Do not change a figure you have not verified.** If a figure cannot be verified, flag it as
`needs-verification` and leave it alone.

### 0.3 Gates

`lint`, `typecheck`, `test`, `build` — doc and data edits must not move any of them.

---

## 3. Wave A — the eyebrow and the structural rhythm

Together, because the issue is explicit that the intermediate state of either alone still reads
as templated. This is the wave that matters; everything else is bounded.

### A.1 Delete the four redundant eyebrows

Each restates the heading immediately beneath it — delete outright:

- `era-compare.tsx:132-134` — note this also removes a `·`
- `father-and-son.tsx:37-39` — also removes a `·` and a spaced em-dash
- `shot-zones.tsx:139-141`
- `the-block.tsx:149-151`

### A.1b Restyle the five informative labels

Not deleted — restyled onto `Kicker` (§A.2):

- `center-court.tsx:204` — keep the words `Scroll to explore`
- `era-compare.tsx:282, 318, 339, 366` — the four metric-group labels

**`center-court.tsx:204` is the trap.** It uses `Caption`, which is `.narrow` — uppercase with
`0.04em` tracking. Deleting the `tracking-widest` utility satisfies the letter of the acceptance
condition and leaves the page looking identical, because `.narrow` still supplies uppercase and
tracking. Restyling to `Kicker` is what actually removes the tracked all-caps look.

### A.2 Add `Kicker` to `components/typeset.tsx`

The declared replacement for a kicker, and the thing that makes the guard meaningful:

- body face (`var(--font-text)`), body size, **sentence case**, no letter-spacing override, no
  separator glyph, `text-muted`
- must not inherit `.narrow`

Convert the five informative labels to it: `center-court.tsx:204` and `era-compare.tsx:282, 318,
339, 366`.

### A.3 Assign five opener archetypes so no two consecutive sections share one

`app/page.tsx` renders 14 top-level units: the hero, 13 sections registered in `SECTIONS`, and
the footer. Note the hero is **not** a registered section — `center-court.tsx` carries no `id`;
`id="span"` belongs to `season-ruler.tsx:112`, so the hero's scroll affordance
(`center-court.tsx:177`) jumps *past* the hero onto the ruler. Archetypes:

- **A · device bleeds** — no heading block; the mechanism is the opener
- **B · ruled ledger** — display heading on a rule; body is a ruled list, zero card frames
- **C · written line** — the heading *is* the content, set as one line at display scale, no standfirst
- **D · margin note** — heading in a narrow left margin column, body runs beside it
- **E · instrument** — dense bordered panel, controls in its top edge, no heading block

| # | Section | Component | Opener | Note |
|---|---|---|---|---|
| 1 | — (hero) | `center-court.tsx` | A | already device-led; the court is the opener. No `id`, not in `SECTIONS`. |
| 2 | `span` | `season-ruler.tsx:112` | E | it is a map and a control surface — 23 targets plus a legend. That is the instrument archetype, and giving it E also stops the two most prominent sections on the page sharing a family. |
| 3 | `hardware` | `honours-board.tsx:182` | B | **ruled ledger, not a row of cards** (issue story 4). Currently `sm:grid-cols-[minmax(5rem,8rem)_1fr]` (line 28) — already close; drop the frames. |
| 4 | `line` | `the-line.tsx:22` | C | **set as one written line, no headline above it** (issue story 3) |
| 5 | `rooms` | `the-rooms.tsx:341` | A | pinned chapters; already the best section on the page — protect it |
| 6 | `father-son` | `father-and-son.tsx:31` | D | heading to the margin; the two 5-up rows (153, 216) become a ruled timeline |
| 7 | `ledger` | `the-ledger.tsx:351` | E | controls in the top edge |
| 8 | `shot-zones` | `shot-zones.tsx:133` | A | the full-bleed heat map is the opener; the 4 era tabs (156) become a control rail inside it |
| 9 | `playoff-matrix` | `playoff-matrix.tsx:294` | E | filter rail as the top rule; no heading block |
| 10 | `era-compare` | `era-compare.tsx:126` | D | heading to the margin; the two selectors are the body |
| 11 | `number` | `twenty-three.tsx:30` | A | colossal numeral; fix F-13 here (§Wave D) |
| 12 | `shot` | `last-shot.tsx:310` | E | the mini-game is an instrument: power meter, shot state machine |
| 13 | `nights` | `four-nights.tsx:92` | B | ruled ledger of four nights |
| 14 | `the-block` | `the-block.tsx:143` | A | scrubber re-enactment leads with its device (issue story 5) |

Adjacency check, in order: `A E B C A D E A E D A E B A` — **no two consecutive entries match**,
across all 14 units. Every `id` in `SECTIONS` is accounted for exactly once, and `Baseline`
(footer, no `id`) is outside the sequence.

Five archetypes, not the four the issue names as a "working target". The issue's own binding
constraint is the acceptance condition ("no two consecutive sections share an opener silhouette"),
and 14 units with the devices this content actually has do not fit a 4-cycle without forcing a
section into a shape that misrepresents it. Reported rather than papered over.

### A.4 Cap the four-item band at two

Extract the band into a single named component so the cap is enforceable and the fix is in one
place — `StatBand` in `components/typeset.tsx`. **Survivors (2):**

1. `playoff-matrix.tsx:378` — the scoreboard tiles. The most scoreboard-like thing on the page.
2. `the-block.tsx:172` — the final game's four-line line score.

**Convert (5):**

| Site | Convert to |
|---|---|
| `playoff-matrix.tsx:912` | an inline `figure` run in the drawer header |
| `shot-zones.tsx:156` | a control rail in the instrument's top edge |
| `shot-zones.tsx:238` | a stacked figure list in the panel's left column |
| `father-and-son.tsx:153` | a ruled timeline row |
| `father-and-son.tsx:216` | a ruled timeline row |

`playoff-matrix.tsx:587` (`xl:grid-cols-4`) is the 57-card grid, not a band. Leave the track.

### A.5 Declare the opener in source

Each of the 14 units in A.3 — the hero included — exports
`export const OPENER = "device" | "ruled-ledger" | "written-line" | "margin-note" | "instrument"`.
This makes the design intent explicit, gives Wave C something to assert (G4), and costs nothing at
runtime. It asserts on the *page composition*, which is what F-01 is about — not on any
component's internals, and not on markup.

### A.6 Gates + verification

All four gates. Then, by hand in the browser at **320, 375, 414 and 768 px**:

- walk the page top to bottom; confirm no two consecutive sections share a silhouette
- count four-item bands; confirm exactly 2
- confirm no eyebrow reads as a tracked all-caps label
- confirm the pinned chapters (`rooms`) still pin and still read correctly

---

## 4. Wave B — the type system and the stat contradiction

Bounded and mechanical.

### B.1 Collapse 47 `font-mono` utilities to the declared classes

| File | Count | Target |
|---|---|---|
| `father-and-son.tsx` | 25 | `.narrow` / `.narrow-bold` for labels and data; `.prose-copy` for prose |
| `era-compare.tsx` | 15 | as above |
| `shot-zones.tsx` | 7 | as above |

Route by role, not mechanically. A stat label becomes `.narrow`; a data string becomes
`.narrow-bold`; a sentence becomes `.prose-copy`. Where the role is decorative — e.g. a purely
ornamental mono tick — delete the utility rather than replacing it. `globals.css:11-13` already
declares "There is deliberately no serif and no monospace"; after this wave that is true.

`font-serif` is already absent (0 matches) — the audit noted it was removed on 2026-09-26.

### B.2 Resolve the stat contradiction

Blocked on §0.2. Two permitted shapes, pick one and apply it to **every** era:

- **(a) qualify** — label the band as the multi-season aggregate, and make the narrative's peak
  explicit as a single season. Keeps both real figures.
- **(b) drop** — show the peak only, delete the aggregate.

The issue permits either. **(a) is the recommendation**: the aggregate is the more useful number
for a reader comparing eras, and it is already what the band is for. The fix is a visible
qualifier, not a deletion.

Whichever is chosen, also fix `era-compare.tsx:184` and `:240` while in the file (§Wave C/F-06
covers the em-dash, the qualifier is the same pass).

**Hard constraint:** no invented metric. If Wave 0.2 corrects a figure, that is a correction, not
a new number.

### B.3 Gates

All four. The data suites are the regression surface for every figure touched.

---

## 5. Wave C — the guards

Each guard a few lines. All run inside gates the repo already enforces; **no new dependency, no
new script, no new workflow.**

### 5.1 Lint gate — `eslint.config.mjs`

Five `no-restricted-syntax` entries (or the inline virtual-plugin fallback per R3), each with a
message naming the offending utility:

| # | Selector (sketch) | Forbids |
|---|---|---|
| L1 | `JSXAttribute[name.name='className'][value.value=/tracking-\[0\.2em\]\|tracking-widest/]` | the tracked-eyebrow utilities |
| L2 | `JSXAttribute[name.name='className'][value.value=/font-mono/]` | the monospace utility |
| L3 | `JSXAttribute[name.name='className'][value.value=/#[0-9a-fA-F]{3,8}\b/]` | raw hex in a component |
| L4 | `JSXAttribute[name.name='className'][value.value=/hover:-translate-y/]` + `JSXAttribute[name.name='whileHover'] > ObjectExpression > Property[key.name='y']` | the uniform card hover-lift |
| L5 | `JSXAttribute[name.name='className'][value.value=/grid-cols-\[1fr/]` | a bare flexible grid track |

Notes:

- **L3 must not match comments.** `the-rooms.tsx:81-82` is a comment (§1.4). If the selector
  matches inside comment text, the fix is a per-file `eslint-disable` **with a reason comment**,
  or a selector scoped to JSX attributes only — which is what the sketch above does, since
  `no-restricted-syntax` visits AST nodes and does not see comments at all. Comments are
  therefore safe by construction; confirm this with a deliberate test, do not assume it.
- **L5** targets `the-rooms.tsx:76` (`lg:grid-cols-[1fr_auto]`) and must not fire on
  `grid-cols-[1.3fr_1fr]` (`shot-zones.tsx:268`) or
  `sm:grid-cols-[minmax(5rem,8rem)_1fr]` (`honours-board.tsx:28`), which are already safe.
- **L4** must not fire on `back-to-top.tsx:80`
  (`group-hover:-translate-y-0.5` on an icon inside a button) — that is an icon affordance, not a
  card grid. Narrow the selector accordingly.

### 5.2 Test gate — `tests/smoke.test.ts`

Following the existing shape exactly (read source as text, assert an observable property, no
markup snapshotting, no internal-structure assertions):

| # | Assertion |
|---|---|
| G1 | `overflow-x: clip` is declared on **both** `html` and `body` in `app/globals.css`, and on neither is it `hidden` (F-11, `globals.css:71-86`) |
| G2 | scroll clearance is declared for every id in `SECTIONS` and for the season ruler's targets (F-05) |
| G3 | `StatBand` is used at most twice across `components/` (F-01, R1) |
| G4 | no two adjacent entries in `app/page.tsx`'s component order share an `OPENER` value (F-01, R1). The order is the 14 units in A.3 — the hero plus the 13 registered sections; `Baseline` is excluded. |
| G5 | `rounded-full` count is within budget, and every surviving site is listed with a reason (F-08, R2) |
| G6 | no `— ` (spaced em-dash) immediately precedes an attribution or a `<select>` option (F-06) |
| G7 | every `id` in `SECTIONS` is rendered exactly once, and every rendered section `id` is registered (F-01 refactor safety, `AGENTS.md` §3) |

**G7 is currently 1:1 and must stay that way.** Verified mapping — worth recording so the test is
written against fact, not assumption:

| `SECTIONS` id | Rendered at |
|---|---|
| `span` | `season-ruler.tsx:112` |
| `hardware` | `honours-board.tsx:182` |
| `line` | `the-line.tsx:22` |
| `rooms` | `the-rooms.tsx:341` |
| `father-son` | `father-and-son.tsx:31` |
| `ledger` | `the-ledger.tsx:351` |
| `shot-zones` | `shot-zones.tsx:133` |
| `playoff-matrix` | `playoff-matrix.tsx:294` |
| `era-compare` | `era-compare.tsx:126` |
| `number` | `twenty-three.tsx:30` |
| `shot` | `last-shot.tsx:310` |
| `nights` | `four-nights.tsx:92` |
| `the-block` | `the-block.tsx:143` |

Two traps. **The hero carries no `id`** — `center-court.tsx` is not in this table, and `Baseline`
has none either, so neither needs an exemption. And `court-shell.tsx:25` holds `id="main"`, which
is the one non-section id on the page; exclude it explicitly rather than by prefix.

A Wave A rewrite that renames or drops a section `id` fails the footer index silently — the links
still render, they just stop going anywhere. G7 is what makes that loud.

G2's shape matters. The clearance is a utility on the *target*, and `back-to-top.tsx:50` scrolls to
`#main` where clearance is not wanted. Assert clearance on the `SECTIONS` targets and the ruler,
not on every element with an id.

The existing `isLive` guards stay untouched — they are the reason the suite cannot silently test
the fixture.

### 5.3 Gates

All four, and specifically: introduce **one** deliberate violation of each guard, confirm it goes
red with the right file and line, then revert. A guard never observed failing is not a guard.

---

## 6. Wave D — polish

| Finding | Work |
|---|---|
| F-06 | drop the spaced em-dash at `the-block.tsx:489`, `father-and-son.tsx:109`, `father-and-son.tsx:254`, `era-compare.tsx:184`, `era-compare.tsx:240`; set attributions on their own line in the caption register |
| F-07 | lift the six hexes to named tokens: `playoff-matrix.tsx:71,73,75,855` · `shot-zones.tsx:283,567`. Per-team colours read from the data module stay as they are. |
| F-08 | commit to square: 40 soft radii → `rounded-none`; `rounded-full` 14 → 4, survivors named in §10 |
| F-09 | replace `playoff-matrix.tsx:610` `whileHover={{ y: -2 }}` with one affordance that means something on every card — the result badge inverts, or the INSPECT rule extends. One choice, all 57. |
| F-10 | drop the inner border at `playoff-matrix.tsx:660` (`border border-rule/50` on the stat box inside a card that already has `border`); let tabular alignment carry the figures |
| F-12 | `the-rooms.tsx:76` `lg:grid-cols-[1fr_auto]` → `lg:grid-cols-[minmax(0,1fr)_auto]` |
| F-13 | `twenty-three.tsx:37` — the numeral at `-right-[8vw]` bleeds off the right edge mid-glyph. Either crop to a clean edge or bring it fully inside. Do not leave it cropped mid-glyph. |

### F-09 detail

The card is already a `<button>` opening a dialog, so the affordance must not imply navigation.
Inverting the result badge (`playoff-matrix.tsx:637-644`) is the better choice: it is present on
every card, it means something (this series was won or lost), and it costs no layout.

### F-13 detail

`-right-[8vw]` plus `overflow-clip` on the section (line 32) crops the `23` through the middle of
the second digit. Bringing it inside risks a dead right margin; cropping to a clean edge means
choosing an offset that lands on a glyph boundary at every width, which `vw` units do not give
you. Recommended: set the offset so the numeral's right edge aligns to the container's padding
edge, computed from the same clamp, so the crop is deliberate at all four widths.

---

## 7. Preservation — the regression surface

From `DESIGN-AUDIT.md` §What passes. **None of these may be traded away.** Re-verify each at the
end of every wave, not only at the end of the work:

| Gate | Property |
|---|---|
| 46 | no invented metrics — 0 matches for fabricated figures in `components/` and `lib/` |
| 47 | no re-drawn browser or device chrome |
| 38a | no italic headings — the 4 existing italics stay body copy, never on `h1`–`h6`. The audit records them at `father-and-son:105`, `shot-zones:550`, `the-block:485`, `the-ledger:303`; **re-locate them by content after Wave A**, which edits two of those four files and will shift the line numbers. |
| 49 | no two-line clickable controls at 320/375/414/768 |
| 52 | section heads collapse — no multi-column heading parent |
| — | no horizontal overflow — `scrollWidth − clientWidth === 0` at all four widths |
| — | no nav bar — the season ruler is the map, the index is the footer |
| — | statement footer, not a link dump |
| — | no gradients-as-decoration, no glow, no stock photography, no custom cursor, no grain |

Plus the four `AGENTS.md` gates: `lint` 0/0, `typecheck`, `test`, `build` with static prerender.

And the SSR contract from `AGENTS.md` §6: counters render their final value, `data-reveal`
elements land under `prefers-reduced-motion`, scroll-gated sections keep their `<noscript>`
fallback. **A Wave A rewrite that reintroduces `initial={{ opacity: 0 }}` on a heading without
`data-reveal` silently re-breaks #22.** Check this explicitly.

---

## 8. What cannot be verified automatically

Stated plainly, per the issue's Testing Decisions:

- **F-01's silhouette claim** — "does this look templated" has no honest automated seam. G3 and G4
  assert the band cap and the declared-opener adjacency, which are the mechanical proxies. The
  silhouette itself is a 320/375/414/768 visual pass.
- **F-10 card density** and **F-13 numeral crop** — design judgements. Visual pass.
- **Section heights** — not assertable without a DOM layer, which Out of Scope forbids (R1).
- **The thirty-odd unverified Hallmark gates** — the audit could not read their definitions and
  explicitly did not assume they pass. Auditing them is separate work and is not in this plan.
- Gate 51 (`overflow-wrap: anywhere; min-width: 0` on display headers) has 0 matches anywhere,
  which the audit calls *suspicious rather than passing*. Out of scope here, but do not assume it
  passes. Long unbroken display strings remain untested.

---

## 9. Sequencing summary

| Wave | Findings | Ship independently | Gate |
|---|---|---|---|
| 0 | record corrections, era-aggregate verification | yes | all four |
| A | F-01, F-02 (+ §1.5 split) | yes | all four + 4-width visual |
| B | F-03, F-04 (blocked on 0.2) | yes | all four |
| C | F-05, F-11 + 12 guards (L1–L5, G1–G7) | yes | all four + one deliberate violation per guard |
| D | F-06, F-07, F-08, F-09, F-10, F-12, F-13 | yes | all four + 4-width visual |

All 13 findings are covered: F-01 (A), F-02 (A), F-03 (B), F-04 (B), F-05 (C), F-06 (D),
F-07 (D), F-08 (D), F-09 (D), F-10 (D), F-11 (C), F-12 (D), F-13 (D).

Each wave lands as its own commit. Waves B, C and D are independently shippable; **A is not
splittable** — half the rhythm change still reads as templated, which is the whole argument for
A being one wave.

---

## 10. F-08 decided — the square commitment, with the survivors named

The budget of **four `rounded-full`** is exactly achievable without sacrificing a single shape
that encodes a genuinely round object. Fourteen sites exist; four survive on the audit's own
rationale, and the other ten are recoverable.

**Survive (4) — the object is round:**

| Site | Why |
|---|---|
| `last-shot.tsx:409` | the ball |
| `last-shot.tsx:452` | the rim / target |
| `the-block.tsx:352` | the ball |
| `playoff-matrix.tsx:306` | the live-status dot — a status indicator is conventionally round |

**Convert to square (10):**

| Site | What it is | Why square is not a loss |
|---|---|---|
| `the-block.tsx:311, 323, 335` | the three player tokens (JR 5, Iguodala 9, LeBron 23) | numbered markers on a scouting chart. Square tokens read *better* — a numbered disc reads as a face, a square reads as a position on a floor |
| `the-block.tsx:303` | the impact shockwave ring | a square pulse reads as contact on a floor, not a bubble |
| `season-ruler.tsx:43, 57, 303, 310, 311` | the ruler's medal and MVP markers | **the ruler already draws squares beside them** — `season-ruler.tsx:61` and `:298` are `h-[9px] w-[9px] bg-wine` with no radius. Squaring the round five makes the row internally consistent instead of mixed |
| `playoff-matrix.tsx:884` | the drawer's close button | the site already commits to square here — `back-to-top.tsx:72` is `rounded-none` |

**The 40 soft radii** (§1.1: 32 bare `rounded` + 8 `rounded-md`) all become `rounded-none`. 31 of
the 32 are in `playoff-matrix.tsx` alone, where they are card frames, badge chips, and drawer
panels — none of which is a round object. `globals.css:251` already calls the scrollbar thumb
*"square like everything else here"*; after Wave D that sentence is true of the page.

**Reverting is a one-line change** if the owner prefers the ruler's markers to stay round: the
guard G5 asserts the count and the named survivor list, so relaxing it is a one-line edit to the
expected list rather than a hunt through the components. That is the point of making G5 assert a
whitelist with reasons instead of a bare number.

**Expect this to look like the biggest visual change of the whole remediation** — 50 shapes change
at once. It is the last wave for that reason: it should land on a page whose rhythm, type system
and gates are already correct, so the shape change is the only variable in review.

---

## 11. What actually shipped

Implemented in full. Four commits, each with all four gates green.

| Commit | Wave | Contents |
|---|---|---|
| `02d61c1` | 0 | five stale era aggregates corrected and locked; `DESIGN-AUDIT.md` amended with five of its own factual errors |
| `ef44cc3` | A | eyebrow deleted; five opener archetypes declared across 14 units; `StatBand` capped at 2; F-04's qualifier |
| `818bde5` | B | 35 `font-mono` routed by role, plus two third-family defects no grep could see |
| `a9b10d7` | C + D | F-05, F-06, F-07, F-08, F-09, F-10, F-11, F-12, F-13; 12 guards (L1–L5, G1–G7) |

All 13 findings closed. Twelve guards live, each one proven by injecting its violation, watching it
go red with the right message, and reverting.

### Deviations from this plan, and why

1. **Waves C and D were committed together.** A guard that fails on a finding still open is not
   landable, and the repo requires four green gates at every commit. Fixing the findings and
   arming the guards in one commit is the honest sequencing.

2. **§1.6 was wrong about Miami and right about the other three eras.** Verification showed all
   four `mia` figures are exactly correct. The plan's suspicion came from averaging seasonal rates
   instead of weighting by attempts. The corrected reasoning is in §1.6 and the five real defects
   are in `DESIGN-AUDIT.md` §F-04b.

3. **F-02 was 4 deletions, not 9.** Only four of the nine `tracking` sites were redundant labels.
   One is a functional control label and four name the metric group below them. See §1.5.

4. **Two new findings the audit could not have produced**, both found by checking *computed*
   styles rather than source, and both invisible to the audit's stated acceptance condition of
   "0 matches for `font-mono`":
   - `shot-zones.tsx` drew nine sector volume labels in the browser's default monospace via a
     `font-family="monospace"` presentation **attribute** on `<text>`. No class-name grep reaches
     it, and `font-text` on the `<svg>` root did not help because an explicit attribute beats
     inheritance.
   - `era-compare.tsx`'s entire comparison table used `font-sans`, which is Tailwind's **default
     system stack** (`-apple-system, BlinkMacSystemFont, "Segoe UI", …`), not `--font-text`.

5. **One self-inflicted defect, caught by the new guards.** The bulk regex that squared the radii
   also rewrote the English word "rounded" in a ledger sentence — in *rendered* JSX, where a reader
   would have seen "rounded-none". G5 caught it, which is the only reason it was caught before
   merge. The lesson is baked into the guard: it scans only inside quoted strings, because a
   token-shaped regex over raw text reports prose as a class.

6. **An incidental fix.** `the-line`'s career totals rendered *above* their figures. The gold rule
   and the total are siblings of the `dt`/`dd` pair, so they defaulted to `order: 0` and flex put
   them first — contradicting the component's own docstring. Pre-existing, and fixed while the
   section was being restructured.

### Verification pass — three guards were inert

Every finding above was implemented and committed before this issue was closed, but "implemented" was
taken on the strength of the plan's own claim that each guard had been "proven by injecting its
violation". Re-verifying by injection found that claim false for three of the seventeen guards, all
of the same class: a guard that reads as armed and cannot fail. `403e009` had already fixed this bug
once, for the bare-`fr` rule, and it recurred.

| Guard | The defect | Proof |
|---|---|---|
| `L4` — uniform card hover-lift | The selector read `JSXAttribute[name.name='whileHover'] Expression ObjectExpression …`. There is no `Expression` node in a JSX AST; it is `JSXExpressionContainer`. The file's own docblock says so, having made that correction for the `className` rules two paragraphs earlier. | `whileHover={{ y: -3 }}` on a real `motion.div` left lint clean. |
| `G5` — round-shape budget | Counted LINES, then (after one fix) LITERALS. `className="rounded-full rounded-full"` on one line reported a single site, so the page budget of four was a budget of four lines. | That exact string in `the-block.tsx` — a file already on the survivor list, so both other checks were satisfied — left G5 green. |
| `G2` — anchor clearance | Matched `/scroll-clearance/` as a substring, so `scroll-clearanceX` satisfied it while providing no clearance. The same substring trap `app/layout.tsx` documents for `[style*="opacity:0"]`, missed here. | Renaming the class to `scroll-clearanceX` left G2 green. |

All three are fixed and each is now proven red by the injection that used to pass it, in
`6d54174` and `957c7a7`.

**The lesson, recorded because it is the third time.** Reading a guard and concluding it is correct
is not verification; the guard and its comments can both be confidently wrong. Every guard in this
file is now either injection-proven or listed here as unproven. The other fourteen were re-checked
by injection in the same pass — `G3`, `G4`, `G6`, and lint rules `L1`, `L2`, `L3`, `L5` all go red
on their violations with a file and a line — and none of them had a defect.

### Re-audit still owed

`DESIGN-AUDIT.md` §Re-audit asks for a fresh Hallmark `audit` after the structural wave, scored on
the same six axes, target Variety ≥ 4, Hierarchy ≥ 4, Restraint ≥ 4 with Philosophy and Specificity
held at 5. **That has not been run.** The six-axis scores in the audit document are the *pre-change*
scores and are now stale. The measurable proxies moved as intended — two opener families' worth of
adjacency, seven band sites down to two, nine eyebrows to zero, three typefaces to two, 50 shapes
to 4, anchor clearance from 0px to 83px — but Variety and Hierarchy are judgements, and only the
audit can score them.
