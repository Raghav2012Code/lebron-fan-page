/**
 * Design guards.
 *
 * These assert observable properties of the SOURCE and of the STYLESHEET — that
 * a pattern is absent, that a count is within budget, that a property is
 * declared on the right element. They deliberately do not assert how a component
 * is structured internally and they do not snapshot markup, because both would
 * make these brittle against exactly the refactors the design remediation
 * performs. A guard that fails because a class was renamed for an unrelated
 * reason is a bad guard.
 *
 * The lint gate (`eslint.config.mjs`) covers the className-level tells, because
 * it can report a file and a line. This file covers what lint structurally
 * cannot see: cross-file counts, declaration order, and stylesheet properties.
 *
 * Every one of these was confirmed to FAIL when its pattern was reintroduced
 * before being left in place. A guard never observed failing is not a guard.
 */
import test from "node:test";
import assert from "node:assert";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { SECTIONS } from "@/lib/lebron-data";

const ROOT = join(import.meta.dirname, "..");
const COMPONENTS = join(ROOT, "components");
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), "utf8");

const componentFiles = readdirSync(COMPONENTS)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => ({ name: f, source: readFileSync(join(COMPONENTS, f), "utf8") }));

/**
 * Blank out comments, preserving every newline so reported line numbers stay
 * correct.
 *
 * This is not optional tidiness. The lint gate gets comment-blindness for free
 * because `no-restricted-syntax` walks the AST and comments are not nodes; this
 * gate has no AST, so a naive text scan reads this file's own prose, the
 * component JSDoc, and the comment explaining each guard — and then fails on
 * the word `rounded-full` appearing in a sentence about why `rounded-full` is
 * rare. Every pattern below is matched against stripped source.
 */
function stripComments(source: string): string {
  let out = "";
  let state: "code" | "block" | "line" = "code";
  for (let i = 0; i < source.length; ) {
    const c = source[i];
    const d = source[i + 1];
    if (state === "code") {
      if (c === "/" && d === "*") {
        state = "block";
        out += "  ";
        i += 2;
      } else if (c === "/" && d === "/") {
        state = "line";
        out += "  ";
        i += 2;
      } else {
        out += c;
        i += 1;
      }
    } else if (state === "block") {
      if (c === "*" && d === "/") {
        state = "code";
        out += "  ";
        i += 2;
      } else {
        out += c === "\n" ? "\n" : " ";
        i += 1;
      }
    } else if (c === "\n") {
      state = "code";
      out += "\n";
      i += 1;
    } else {
      out += " ";
      i += 1;
    }
  }
  return out;
}

/** Component source with comments removed, memoised per file. */
const codeOf = (source: string) => stripComments(source);

/** Every occurrence of `needle` in component CODE, as `file:line`. */
function sitesInComponents(needle: string | RegExp): string[] {
  const out: string[] = [];
  for (const { name, source } of componentFiles) {
    codeOf(source)
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (typeof needle === "string" ? line.includes(needle) : needle.test(line)) {
          out.push(`${name}:${i + 1}`);
        }
      });
  }
  return out;
}

/**
 * Like `sitesInComponents`, but only counts matches that fall inside a QUOTED
 * string — which is the only place a Tailwind class can be.
 *
 * Needed because a bare-text scan cannot tell a class from an English word. The
 * word "rounded" appears in this project's own copy ("Nothing here is rounded to
 * make it land"), so a token-shaped regex over raw text reports ordinary prose
 * as a radius violation. Scoping to string literals is what makes the guard
 * precise rather than merely strict.
 */
function classTokenSites(needle: string | RegExp): string[] {
  const out: string[] = [];
  for (const { name, source } of componentFiles) {
    codeOf(source)
      .split(/\r?\n/)
      .forEach((line, i) => {
        for (const literal of line.matchAll(/"([^"]*)"|'([^']*)'/g)) {
          const value = literal[1] ?? literal[2] ?? "";
          const hit =
            typeof needle === "string"
              ? new RegExp(`(?<![\\w-])${needle}(?![\\w-])`).test(value)
              : needle.test(value);
          if (hit) {
            out.push(`${name}:${i + 1}  ${value.trim().slice(0, 60)}`);
            return;
          }
        }
      });
  }
  return out;
}

/* ==========================================================================
 * G1 — the horizontal-overflow clip is on BOTH root elements, and is `clip`.
 *
 * Gate 34 asks for it on both. It was declared on `body` alone, leaving `html`
 * computing `visible`. Measured overflow is 0 at every width, so this is
 * defensive — but it is a literal gate item and one future `min-width` on `html`
 * re-opens it.
 *
 * The `never hidden` half is the load-bearing part. `overflow: hidden` would
 * make `html` a scroll container, which silently breaks `position: sticky` in
 * the pinned chapters — the stylesheet says so at both declarations, and a guard
 * is cheaper than discovering it from a broken pin.
 * ======================================================================== */

test("design guard G1 - overflow-x: clip on both root elements, never hidden", () => {
  const css = read("app", "globals.css");

  const ruleFor = (selector: string): string => {
    // Match the selector's block, allowing for nested braces is unnecessary
    // here: neither `html` nor `body` has one.
    const m = css.match(new RegExp(`(^|\\})\\s*${selector}\\s*\\{([^}]*)\\}`, "m"));
    assert.ok(m, `globals.css has no \`${selector}\` rule`);
    return m[2];
  };

  for (const selector of ["html", "body"]) {
    const block = ruleFor(selector);
    assert.match(
      block,
      /overflow-x\s*:\s*clip\s*;/,
      `${selector} must clip horizontal overflow. \`clip\`, not \`hidden\`: hidden ` +
        `creates a scroll container and breaks the sticky pinning in the-rooms.`,
    );
    assert.doesNotMatch(
      block,
      /overflow-x\s*:\s*hidden/,
      `${selector} must never use overflow-x: hidden — it breaks position: sticky`,
    );
  }
});

/* ==========================================================================
 * G2 — every in-page anchor target declares scroll clearance.
 *
 * `scroll-margin-top` appeared nowhere in the codebase, so all 13 footer index
 * links and the hero's own "scroll to explore" affordance landed their target
 * flush against the top of the viewport, with no sticky header to clear.
 * Confirmed live at the time: activating a footer link left scrollY === 0.
 *
 * Asserted against `SECTIONS` rather than against every element with an id,
 * because `back-to-top` deliberately scrolls to `#main` in order to put the
 * reader at the TOP of the page, where clearance would be exactly wrong.
 * ======================================================================== */

test("design guard G2 - every section anchor target declares scroll clearance", () => {
  const css = read("app", "globals.css");
  assert.match(
    css,
    /\.scroll-clearance\s*\{[^}]*scroll-margin-top\s*:\s*[\d.]+rem/,
    "globals.css must define .scroll-clearance with a scroll-margin-top",
  );

  for (const { id } of SECTIONS) {
    const owner = componentFiles.find(({ source }) =>
      new RegExp(`id="${id}"`).test(source),
    );
    assert.ok(owner, `no component renders id="${id}"`);

    // The clearance class has to be on the element that CARRIES the id, since
    // that is what the browser scrolls.
    const lines = owner.source.split(/\r?\n/);
    const idx = lines.findIndex((l) => l.includes(`id="${id}"`));
    const element =
      lines[idx].includes("className")
        ? lines[idx]
        : lines.slice(idx, idx + 8).join(" ");
    assert.match(
      element,
      /scroll-clearance/,
      `#${id} (${owner.name}:${idx + 1}) is an anchor target but does not carry ` +
        `\`scroll-clearance\`, so it lands flush against the viewport top (F-05)`,
    );
  }

  // The season ruler's 23 targets are focusable and sit beneath a tall hero, so
  // arrowing onto one scrolls it into view with the same problem.
  const ruler = componentFiles.find(({ name }) => name === "season-ruler.tsx");
  assert.ok(ruler);
  assert.match(
    ruler.source,
    /className="scroll-clearance group flex min-w-\[24px\]/,
    "the season ruler's targets must carry scroll-clearance (F-05)",
  );
});

/* ==========================================================================
 * G3 — the four-item band appears at most twice on the whole page.
 *
 * It was inline at SEVEN sites, which is how a page ends up with the same
 * container for everything. It is now one component, so the cap is countable.
 * ======================================================================== */

test("design guard G3 - the four-item band is used at most twice", () => {
  const uses = sitesInComponents("<StatBand");
  assert.strictEqual(
    uses.length,
    2,
    `StatBand must be used at most twice on the page (F-01). Found ${uses.length}: ` +
      `${uses.join(", ")}. Spend the two on the scoreboard tiles and the block's ` +
      `telemetry; anything else wants a different container.`,
  );
});

/* ==========================================================================
 * G4 — no two adjacent page units declare the same opener.
 *
 * Silhouette is not machine-checkable, so each unit DECLARES its opener and this
 * asserts the acceptance condition F-01 actually states. It reads the
 * composition root's order, so reordering the page without reconsidering the
 * rhythm fails here.
 *
 * This is the mechanical replacement for the issue's "section-height" check,
 * which is not observable without a DOM layer the issue explicitly excludes.
 * ======================================================================== */

test("design guard G4 - no two adjacent page units share an opener", () => {
  const page = read("app", "page.tsx");

  // The rendered order, in the order it appears in the composition root.
  const rendered = [...page.matchAll(/<([A-Z][A-Za-z]+)\s*\/>/g)].map((m) => m[1]);
  assert.ok(
    rendered.length >= 15,
    `expected the hero, 13 sections and the footer in app/page.tsx, found ${rendered.length}`,
  );

  // Baseline is the statement footer, not a section: it carries no anchor id and
  // is not in SECTIONS, so it is excluded from the rhythm rather than asserted
  // absent. If it ever grew an id, G7 would catch that.
  const order = rendered.filter((name) => name !== "Baseline");
  assert.strictEqual(
    order.length,
    14,
    `expected 14 top-level units (hero + 13 sections), found ${order.length}: ${order.join(", ")}`,
  );

  const openerOf = (component: string): string => {
    const owner = componentFiles.find(
      ({ source }) =>
        new RegExp(`export function ${component}\\(`).test(source) &&
        /export const OPENER: Opener = "([a-z-]+)"/.test(source),
    );
    assert.ok(owner, `no component exports both an OPENER and ${component}()`);
    const m = owner.source.match(/export const OPENER: Opener = "([a-z-]+)"/);
    assert.ok(m, `${owner.name} declares no OPENER`);
    return m[1];
  };

  const sequence = order.map(openerOf);

  // Every declared value must be one of the five archetypes. `tsc` already
  // enforces that via the `Opener` union, so this is belt and braces — but it
  // fails with a message naming the offending section, where the compiler's
  // would name a type, and it still holds if a declaration is ever loosened to
  // `string`. The list is duplicated from the union in `components/typeset.tsx`
  // deliberately: that module is a `.tsx` and this suite cannot import one, and
  // the same five are already spelled out in `AGENTS.md` §1 and in the header
  // comment above. Keep the three in step.
  const KNOWN_OPENERS = [
    "device",
    "ruled-ledger",
    "written-line",
    "margin-note",
    "instrument",
  ];
  for (const [i, opener] of sequence.entries()) {
    assert.ok(
      KNOWN_OPENERS.includes(opener),
      `${order[i]} declares OPENER "${opener}", which is not one of the five ` +
        `archetypes (${KNOWN_OPENERS.join(", ")}). If a sixth is genuinely needed, ` +
        `add it to the Opener union in typeset.tsx, to AGENTS.md §1, and here.`,
    );
  }

  for (let i = 1; i < sequence.length; i++) {
    assert.notStrictEqual(
      sequence[i],
      sequence[i - 1],
      `${order[i - 1]} and ${order[i]} (positions ${i} and ${i + 1}) both open with ` +
        `"${sequence[i]}". Two adjacent sections sharing an opener is the F-01 ` +
        `failure the reader perceives before any individual element.`,
    );
  }
});

/* ==========================================================================
 * G5 — the round-shape budget, with the survivors named.
 *
 * The design commits to square: globals.css calls the scrollbar thumb "square
 * like everything else here". 14 rounded-full shapes and 40 soft radii argued
 * with that. The four that remain each encode a genuinely round object, and
 * asserting the LIST rather than a bare number means relaxing the budget later
 * is a one-line edit instead of a hunt.
 * ======================================================================== */

test("design guard G5 - round shapes are within budget and every survivor is named", () => {
  const SURVIVORS: Record<string, string> = {
    "last-shot.tsx": "the ball, and the made-shot ring — a ball is round",
    "playoff-matrix.tsx": "the live-status dot — a status indicator is round",
    "the-block.tsx": "the ball on the chase-down",
  };

  for (const { name } of componentFiles) {
    const uses = classTokenSites("rounded-full").filter((s) => s.startsWith(name));
    assert.ok(
      uses.length <= 2,
      `${name} has ${uses.length} rounded-full shapes. The whole page is allowed ` +
        `four, and they are the two balls, the made-shot ring and the live-status ` +
        `dot. A square commitment cannot be enforced from one file.`,
    );
    if (uses.length > 0) {
      assert.ok(
        SURVIVORS[name],
        `${name} uses rounded-full but is not on the survivor list. Add it to ` +
          `G5 with the reason it encodes a round object, or square it.`,
      );
    }
  }

  const total = classTokenSites("rounded-full").length;
  assert.strictEqual(
    total,
    4,
    `expected exactly 4 rounded-full shapes on the page, found ${total}`,
  );

  // The rest of the vocabulary is square. `rounded-none` is the explicit
  // statement; a bare `rounded` and the sized utilities are the things that must
  // not come back. Scoped to quoted strings, so the project's own copy — which
  // uses the English word "rounded" — is not mistaken for a radius.
  for (const soft of [
    "rounded",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
  ]) {
    const sites = classTokenSites(soft);
    assert.deepStrictEqual(
      sites,
      [],
      `soft radii are back; the design is square (F-08). Found at ${sites.join(", ")}`,
    );
  }
});

/* ==========================================================================
 * G6 — no spaced em-dash before an attribution or inside a select option.
 *
 * AGENTS.md §1 bans spaced-em-dash labels. There were five, not the two the
 * audit listed: two attributions, a year range, and the two <select> options in
 * the era comparator — the last two are the same defect in a control the reader
 * picks from.
 *
 * Scoped to JSX text and attributes. Comments legitimately use an em-dash as
 * punctuation, and the `playoff-matrix` "302 games—scoring" is unspaced, so
 * neither is a violation of this rule.
 * ======================================================================== */

test("design guard G6 - no spaced em-dash in rendered copy", () => {
  const EM = "\u2014";
  const offenders: string[] = [];

  for (const { name, source } of componentFiles) {
    codeOf(source)
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (line.includes(EM) && new RegExp(`${EM}\\s`).test(line)) {
          offenders.push(`${name}:${i + 1}  ${line.trim().slice(0, 60)}`);
        }
      });
  }

  assert.deepStrictEqual(
    offenders,
    [],
    `a spaced em-dash is back in rendered copy (F-06): ${offenders.join(" | ")}`,
  );
});

/* ==========================================================================
 * G7 — the navigation registry and the rendered sections still agree.
 *
 * AGENTS.md §3: any top-level section shown on the page must have its anchor id
 * registered in SECTIONS, and unregistered anchors must not be added for
 * unimplemented milestones. The Wave A rewrite moved a lot of markup; a renamed
 * or dropped section id would fail the footer index silently — the links would
 * still render, they would just stop going anywhere.
 * ======================================================================== */

test("design guard G7 - every registered section id is rendered exactly once", () => {
  const registered = SECTIONS.map((s) => s.id);
  assert.strictEqual(registered.length, 13, "SECTIONS should hold 13 sections");

  for (const id of registered) {
    const owners = componentFiles.filter(({ source }) =>
      new RegExp(`id="${id}"`).test(source),
    );
    assert.strictEqual(
      owners.length,
      1,
      `id="${id}" is registered in SECTIONS but rendered ${owners.length} times ` +
        `(${owners.map((o) => o.name).join(", ") || "nowhere"}). Exactly one owner, ` +
        `or the footer index links ambiguously.`,
    );
  }

  // The hero and the footer carry no section id, so neither needs an exemption —
  // but if either ever gains one, this fails and the list below must say so.
  const registeredIds: readonly string[] = SECTIONS.map((s) => s.id);
  for (const { name, source } of componentFiles) {
    for (const m of codeOf(source).matchAll(/<section[^>]*\sid="([a-z-]+)"/g)) {
      assert.ok(
        registeredIds.includes(m[1]),
        `${name} renders a section with id="${m[1]}", which is not in SECTIONS. ` +
          `AGENTS.md §3 requires registering it, or removing the anchor.`,
      );
    }
  }
});
