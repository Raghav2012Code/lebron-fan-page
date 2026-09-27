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

## 7. Reserved — the four pending audits

Four specialist audits were launched and had not reported when this plan was written:

| Audit | Owns | Likely to change this plan |
|---|---|---|
| Data integrity | `lib/lebron-data.ts` | **B2's precondition.** Also owns prose-vs-field number checks across all 4 eras, the honours array, and the series/triple-double/buzzer-beater datasets. Could add findings above B1 in severity. |
| React lifecycle | `components/**`, `lib/motion.ts` | Overlaps B4. Owns the setState-after-unmount lead, `useSyncExternalStore` caching in `back-to-top`, and Framer variant propagation. |
| A11y / SSR | whole page in Chromium | Owns the playoff-matrix **dialog** semantics — focus trap, `aria-modal`, Escape, focus return. My build-output check confirmed the SSR *figure* contract but not the dialog. |
| Code quality | whole repo | Overlaps B6. Owns comment-accuracy across the comment-heavy files, `AGENTS.md` compliance, TS strictness, and `next.config`/`tsconfig` review. |

**Integration rule when they land:** each new finding gets a severity, a wave slot, and the same
treatment — file:line, the command that produced it, a fix, and a verification. Any finding that
contradicts something above wins, and this document is amended rather than rewritten, so the
reasoning stays auditable. Nothing gets actioned on a subagent's say-so alone: every claim gets
re-verified against the source before it enters a commit, because two of my own candidates this
round were false alarms and the cost of acting on one would have been a "fix" to correct code.

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
- **Not** "fixing" `reb: 6, ast: 9` in the debut box score, or the `layout.tsx` title. Both were
  checked against source and are correct; the first looked wrong only because the widely-reported
  narrative orders those two stats the other way round.
