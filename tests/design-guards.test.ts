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

import { SECTIONS } from "@/lib/data";

const ROOT = join(import.meta.dirname, "..");
const COMPONENTS = join(ROOT, "components");
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), "utf8");

const componentFiles = readdirSync(COMPONENTS)
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => ({ name: f, source: readFileSync(join(COMPONENTS, f), "utf8") }));

/**
 * The data modules, which are equally a source of rendered copy: `copy`,
 * `summary`, `note`, `signatureMoment` and the label fields all reach the page
 * verbatim. G6 originally scanned `components/**` only, so three spaced
 * em-dashes shipped in `lib/data` while the guard reported clean — a guard
 * that cannot see the copy it guards is not a guard.
 */
const DATA = join(ROOT, "lib", "data");
const dataFiles = readdirSync(DATA)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => ({ name: `lib/data/${f}`, source: readFileSync(join(DATA, f), "utf8") }));

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
 *
 * String literals are tracked, and that is load-bearing rather than tidiness.
 * The previous version decided `//` and `/*` were comments wherever they
 * appeared, so a URL, a `https://` in body copy, or a glob in a string blanked
 * the rest of the line — and everything the guards check is on the far side of
 * a string. That is a false negative through EVERY guard in this file, and it is
 * silent: the guard reports clean on a source that contains the violation.
 * Template literals are tracked too, including `${ … }` interpolations, which
 * are code again and may hold their own strings and comments.
 *
 * Known limit, stated rather than hidden: regex literals are NOT tracked, since
 * a `/` is ambiguous between division and a regex without an AST. A regex
 * containing `//` or `/*` would be read as a comment opener. There is none in
 * `components/**` today, and the failure mode is a false negative in the same
 * direction as the bug above, not a false alarm.
 */
function stripComments(source: string): string {
  const out: string[] = [];
  const n = source.length;
  let i = 0;

  /** Copy a `'…'` or `"…"` literal verbatim, honouring backslash escapes. */
  const copyQuoted = (quote: string): void => {
    out.push(quote);
    i += 1;
    while (i < n) {
      if (source[i] === "\\") {
        out.push(source[i], source[i + 1] ?? " ");
        i += 2;
        continue;
      }
      out.push(source[i]);
      if (source[i] === quote) {
        i += 1;
        return;
      }
      i += 1;
    }
  };

  /** Copy a block comment as spaces, keeping its newlines for line numbers. */
  const blankBlock = (): void => {
    out.push("  ");
    i += 2;
    while (i < n && !(source[i] === "*" && source[i + 1] === "/")) {
      out.push(source[i] === "\n" ? "\n" : " ");
      i += 1;
    }
    if (i < n) {
      out.push("  ");
      i += 2;
    }
  };

  /** Copy a line comment as spaces, stopping at the newline. */
  const blankLine = (): void => {
    while (i < n && source[i] !== "\n") {
      out.push(" ");
      i += 1;
    }
  };

  /**
   * Copy a `${ … }` interpolation as CODE: braces nest, and inside it strings
   * and comments resume, so it cannot simply be copied through as text.
   */
  const copyInterpolation = (): void => {
    out.push("${");
    i += 2;
    let depth = 1;
    while (i < n && depth > 0) {
      const c = source[i]!;
      const d = source[i + 1];
      if (c === "{") {
        depth += 1;
      } else if (c === "}") {
        depth -= 1;
      } else if (c === "/" && d === "/") {
        blankLine();
        continue;
      } else if (c === "/" && d === "*") {
        blankBlock();
        continue;
      } else if (c === '"' || c === "'") {
        copyQuoted(c);
        continue;
      } else if (c === "`") {
        copyTemplate();
        continue;
      }
      out.push(c);
      i += 1;
    }
  };

  /** Copy a `` `…` `` template literal verbatim, except for interpolations. */
  const copyTemplate = (): void => {
    out.push("`");
    i += 1;
    while (i < n) {
      if (source[i] === "\\") {
        out.push(source[i], source[i + 1] ?? " ");
        i += 2;
        continue;
      }
      if (source[i] === "`") {
        out.push("`");
        i += 1;
        return;
      }
      if (source[i] === "$" && source[i + 1] === "{") {
        copyInterpolation();
        continue;
      }
      out.push(source[i]!);
      i += 1;
    }
  };

  while (i < n) {
    const c = source[i]!;
    const d = source[i + 1];
    if (c === "/" && d === "/") {
      blankLine();
    } else if (c === "/" && d === "*") {
      blankBlock();
    } else if (c === '"' || c === "'") {
      copyQuoted(c);
    } else if (c === "`") {
      copyTemplate();
    } else {
      out.push(c);
      i += 1;
    }
  }
  return out.join("");
}

/** Component source with comments removed, memoised per file. */
const codeOf = (source: string) => stripComments(source);

/** Escape a literal string so it can be embedded in a `RegExp` as itself. */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
/**
 * One entry per OCCURRENCE, not per line and not per literal.
 *
 * Two narrower definitions were wrong here, and an injection found each in turn.
 * Counting LINES let `className="rounded-full rounded-full"` on one line report
 * a single site. Counting LITERALS then fixed the two-separate-strings case but
 * not this one, because both shapes sit inside the same string literal. The
 * token is counted where it actually appears — inside the class string — so a
 * single attribute holding any number of round shapes contributes that number.
 *
 * Callers that want distinct locations for a message use `classTokenSites`,
 * which de-duplicates this by `file:line`.
 */
function classTokenHits(needle: string | RegExp): string[] {
  const out: string[] = [];
  for (const { name, source } of componentFiles) {
    codeOf(source)
      .split(/\r?\n/)
      .forEach((line, i) => {
        for (const literal of line.matchAll(/"([^"]*)"|'([^']*)'/g)) {
          const value = literal[1] ?? literal[2] ?? "";
          // A global regex is required to count occurrences; a caller-supplied
          // non-global RegExp is made global here so both forms work.
          const re =
            typeof needle === "string"
              ? new RegExp(`(?<![\\w-])${escapeRegExp(needle)}(?![\\w-])`, "g")
              : new RegExp(needle.source, needle.flags.includes("g") ? needle.flags : `${needle.flags}g`);
          const count = [...value.matchAll(re)].length;
          for (let k = 0; k < count; k++) {
            out.push(`${name}:${i + 1}  ${value.trim().slice(0, 60)}`);
          }
        }
      });
  }
  return out;
}

/** `classTokenHits`, de-duplicated to one entry per `file:line` for reporting. */
function classTokenSites(needle: string | RegExp): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const hit of classTokenHits(needle)) {
    const key = hit.split("  ")[0];
    if (!seen.has(key)) {
      seen.add(key);
      out.push(hit);
    }
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
    // Through `codeOf`: a comment naming the id within eight lines of an
    // anchor used to satisfy the scan, so this guard was the one place a
    // prose mention could stand in for a real declaration. Injection-proven:
    // planting `// id="span" className="scroll-clearance"` in `baseline.tsx`
    // while stripping the real token from `season-ruler.tsx` still reports
    // `season-ruler.tsx:147`, which the pre-`codeOf` form could not.
    const owner = componentFiles.find(({ source }) =>
      new RegExp(`id="${id}"`).test(codeOf(source)),
    );
    assert.ok(owner, `no component renders id="${id}"`);

    // The clearance class has to be on the element that CARRIES the id, since
    // that is what the browser scrolls.
    const lines = codeOf(owner.source).split(/\r?\n/);
    const idx = lines.findIndex((l) => l.includes(`id="${id}"`));
    const element =
      lines[idx].includes("className")
        ? lines[idx]
        : lines.slice(idx, idx + 8).join(" ");
    // A whitespace-delimited token, not a substring. A bare `/scroll-clearance/`
    // also matches `scroll-clearance-2` or `scroll-clearance-x`, which is the
    // same trap `app/layout.tsx` documents for `[style*="opacity:0"]`: a
    // lookalike satisfies the guard while providing no clearance at all. Proved
    // by renaming the class to `scroll-clearanceX`, which passed the substring
    // form.
    assert.match(
      element,
      /(?<=[\s"])scroll-clearance(?=\s|")/,
      `#${id} (${owner.name}:${idx + 1}) is an anchor target but does not carry ` +
        `\`scroll-clearance\`, so it lands flush against the viewport top (F-05)`,
    );
  }

  // The season ruler's 23 targets are focusable and sit beneath a tall hero, so
  // arrowing onto one scrolls it into view with the same problem. Anchored on
  // the opening quote and the group that follows it, for the same reason.
  const ruler = componentFiles.find(({ name }) => name === "season-ruler.tsx");
  assert.ok(ruler);
  assert.match(
    codeOf(ruler.source),
    /className="scroll-clearance(?=\s) group flex min-w-\[24px\]/,
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
  // "At most twice", not "exactly twice". The spec caps the band; it does not
  // require both uses. Asserting equality turned a valid page with one band
  // into a guard failure. Injection-proven: appending a third `<StatBand`
  // occurrence to `era-compare.tsx` reports `Found 3` and the three sites.
  assert.ok(
    uses.length <= 2,
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
    // Occurrences, not lines. Counting lines let a single class attribute
    // holding several round shapes pass the page budget of four.
    const uses = classTokenHits("rounded-full").filter((s) => s.startsWith(name));
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

  const total = classTokenHits("rounded-full").length;
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
 * Scoped to quoted strings in components and in `lib/data`, with comments
 * removed. Comments legitimately use an em-dash as punctuation, and the
 * `playoff-matrix` "302 games—scoring" is unspaced, so neither is a violation
 * of this rule.
 * ======================================================================== */

test("design guard G6 - no spaced em-dash in rendered copy", () => {
  const EM = "\u2014";
  const offenders: string[] = [];

  for (const { name, source } of [...componentFiles, ...dataFiles]) {
    // Join the physical lines first. A multiline string can carry the em-dash
    // at the end of one line and the space at the start of the next, which a
    // per-line scan cannot see.
    const normalized = codeOf(source).replace(/\r?\n/g, " ");
    // `/g`, not a bare `exec`. A bare `exec` reports ONE offender per file, so
    // the count in the failure message was a floor rather than a total, and a
    // second violation in a file that already had one was invisible. Every
    // offender is reported, so a fix cannot be made to look complete by
    // clearing the first hit.
    const re = new RegExp(`${EM}\\s`, "g");
    for (let m = re.exec(normalized); m !== null; m = re.exec(normalized)) {
      const at = m.index;
      offenders.push(
        `${name}  ...${normalized.slice(Math.max(0, at - 20), at + 40)}`,
      );
    }
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

/* ==========================================================================
 * G8 — no CLASS rule in globals.css may sit outside @layer.
 *
 * The largest defect this suite could not see. `.monument`, `.headline`,
 * `.figure`, `.narrow`, `.narrow-bold` and `.prose-copy` were written at the top
 * level of the stylesheet. In Tailwind v4 an unlayered author declaration beats
 * a layered one REGARDLESS OF SPECIFICITY, so every utility touching a property
 * these classes also set was silently discarded. Measured at 1440px:
 *
 *   prose-copy max-w-[46ch]  computed 749.568px  (its own 64ch, not 46ch)
 *   prose-copy leading-relaxed computed 26.88px   (1.68, not 1.625)
 *   figure leading-none      computed 14.08px    (.figure's 0.88)
 *   narrow tracking-wider    computed 0.64px     (.narrow's 0.04em)
 *
 * and on the live page an authored `max-w-[46ch]` rendered at 843px. Lint, tsc,
 * the text-scanning guards and the build were all green throughout, because none
 * of them resolve a cascade. This guard reads the cascade-relevant fact instead.
 *
 * The invariant is the NEGATIVE one — no bare class selector may be unlayered —
 * rather than "these seven are layered", because the negative form also catches
 * the next class someone adds without thinking about it.
 *
 * Element and pseudo-element selectors are deliberately out of scope. `html` and
 * `body` cannot conflict with a utility: a class on a descendant always beats an
 * inherited value, whatever the layer. `:root :focus-visible` is unlayered ON
 * PURPOSE — the utilities must lose to it — and starts with `:root`, not a
 * class, so it never matches. What this forbids is specifically "a class whose
 * Tailwind utilities cannot override".
 * ======================================================================== */

test("design guard G8 - no class rule in globals.css is unlayered", () => {
  const css = stripComments(read("app", "globals.css"));

  /**
   * Selectors of style rules that are not inside an `@layer`.
   *
   * `@media` and `@supports` do NOT create a layer, so a class inside either is
   * still unlayered and still wins over utilities — which is why the one entry in
   * the allow-list below is a class inside `@media`.
   */
  function unlayeredClassSelectors(source: string): string[] {
    const found: string[] = [];
    const inLayer: boolean[] = [];
    let prelude = "";
    for (let i = 0; i < source.length; i += 1) {
      const c = source[i];
      if (c === "{") {
        const p = prelude.trim();
        const isAtRule = p.startsWith("@");
        const enclosedByLayer = inLayer.some(Boolean);
        inLayer.push(isAtRule && p.startsWith("@layer"));
        if (!isAtRule && !enclosedByLayer) {
          for (const sel of p.split(",")) {
            if (sel.trim().startsWith(".")) found.push(sel.trim());
          }
        }
        prelude = "";
      } else if (c === "}") {
        inLayer.pop();
        prelude = "";
      } else if (c === ";") {
        // A declaration terminator, NOT a block terminator. It must not pop:
        // `color-scheme: light;` inside `:root` would otherwise pop `:root`
        // itself, and the next `}` would eat the enclosing `@layer`, making
        // every rule after it look unlayered. `;` only ends the prelude of a
        // bodiless at-rule such as `@import "tailwindcss";`, which pushed
        // nothing, so clearing is the whole job.
        prelude = "";
      } else {
        prelude += c;
      }
    }
    return found;
  }

  // Each exception is a decision, and the reason is part of the entry, so a
  // reader can tell a deliberate override from an oversight.
  const ALLOWED: Record<string, string> = {
    ".skip-link":
      "inside @media (prefers-reduced-motion: reduce) and !important, so it " +
      "has to beat the layered base rule. `!important` outranks layers anyway, " +
      "so this is safe to leave unlayered.",
  };

  const offenders = unlayeredClassSelectors(css).filter((s) => !(s in ALLOWED));

  assert.deepStrictEqual(
    offenders,
    [],
    `these class rules sit outside @layer, so Tailwind utilities cannot ` +
      `override them (globals.css): ${offenders.join(" | ")}. Put the rule in ` +
      `@layer components so the class is a DEFAULT a call site can override — ` +
      `or, if the utilities must lose to it as the focus ring does, add it to ` +
      `G8's ALLOWED map with the reason.`,
  );

  // An allow-list that nobody prunes becomes a place exceptions go to die. If a
  // listed selector is no longer unlayered, it is dead weight and is reported.
  const stillUnlayered = new Set(unlayeredClassSelectors(css));
  const stale = Object.keys(ALLOWED).filter((s) => !stillUnlayered.has(s));
  assert.deepStrictEqual(
    stale,
    [],
    `G8's ALLOWED map lists ${stale.join(", ")}, which is no longer an ` +
      `unlayered class rule. Delete the entry.`,
  );
});

/* ==========================================================================
 * G9 — the no-JS fallback exists, and its selectors are anchored.
 *
 * Framer serialises every `initial` variant state into the server HTML as an
 * inline `style` (and `pathLength` animations as `stroke-dasharray="0 1"`). With
 * JS on, hydration animates it away. With JS off nothing does, so the hidden
 * state is the resting state. Measured with `javaScriptEnabled: false` before
 * `app/layout.tsx` grew its `<noscript>` block: 175 elements at `opacity: 0`,
 * 62 letters parked at `translateY(112%)`, 55 rules and panels at `scale(0)`,
 * the hero at 0% visible, and roughly 27,000 characters in the document of which
 * essentially none were painted. `AGENTS.md` §6 promises the opposite.
 *
 * The existing `[data-reveal]` override cannot cover this, and that is the
 * non-obvious part: it lives INSIDE `@media (prefers-reduced-motion: reduce)`,
 * and a visitor with JS blocked is not necessarily in that media query. So the
 * documented remedy structurally cannot reach the failure it was written for,
 * and the guarantee needs a mechanism that does.
 *
 * These assertions are about the SHAPE of the block, not its exhaustiveness —
 * whether every future `initial` is covered is not knowable from source, and
 * pretending otherwise would be a guard that cries wolf. What is knowable, and
 * what actually broke on the first attempt, is the anchoring: a bare
 * `[style*="opacity:0"]` also matches `opacity:0.72`, `0.45`, `0.3` and `0.14`,
 * which are four real design values on this page.
 * ======================================================================== */

test("design guard G9 - the no-JS fallback is present and safely anchored", () => {
  const layout = codeOf(read("app", "layout.tsx"));

  assert.match(
    layout,
    /<noscript/,
    "app/layout.tsx must render a <noscript> block. Framer's SSR'd `initial` " +
      "states are never cleared without JS, so without this the page is blank.",
  );

  const css = layout.slice(layout.indexOf("NO_SCRIPT_CSS"));

  // 1. All three mechanisms present.
  assert.match(
    css,
    /\[style="opacity:0"\]/,
    "the fallback must match a whole-value style of `opacity:0`",
  );
  assert.match(
    css,
    /\[style\*="transform:"\]/,
    "the fallback must neutralise Framer's inline entrance transforms",
  );
  assert.match(
    css,
    /\[stroke-dasharray="0 1"\]/,
    "the fallback must redraw the court's pathLength-animated strokes, which " +
      "SSR as a zero-length dash",
  );

  // 2. The anchoring. `opacity:0` is a substring of every real design opacity
  //    on this page, so an unanchored selector silently flattens four of them.
  assert.ok(
    !/\[style\*="opacity:0"\]/.test(css),
    'the fallback must not use a bare [style*="opacity:0"] selector: that ' +
      "substring is present in `opacity:0.72`, `0.45`, `0.3` and `0.14`, which " +
      "are real design values. Anchor on a declaration boundary instead.",
  );
  for (const boundary of ['[style$="opacity:0"]', '[style*="opacity:0;"]']) {
    assert.ok(
      css.includes(boundary),
      `the fallback is missing ${boundary}. The built HTML puts \`opacity:0\` in ` +
        `four positions — whole value, end of value, after a semicolon, and ` +
        `between two — and the room panels' \`color:#231508;opacity:0\` has no ` +
        `trailing semicolon, so the end-of-value case is not optional.`,
    );
  }

  // 3. Order. The centring transforms are re-asserted AFTER the general rule; at
  //    equal specificity and equal `!important`, the later declaration wins, so
  //    reversing these two throws two absolutely positioned elements to their
  //    container's top-left corner.
  const general = css.indexOf('[style*="transform:"]');
  assert.ok(general > -1, "expected the general transform rule");
  for (const centring of ['translateX(-50%) translateY(-50%)', 'translateX(-50%)']) {
    const at = css.indexOf(`[style*="${centring}"]`);
    assert.ok(
      at > general,
      `the \`${centring}\` re-assertion must come AFTER the general transform ` +
        `rule in NO_SCRIPT_CSS, or the general rule flattens the centring it ` +
        `exists to protect.`,
    );
  }

  // 4. The court's genuine dashes must not be caught. `stroke-dasharray` values
  //    of `2 3` and `4 4` are drawn geometry; only `0 1` is an animation state.
  const dash = layout.match(/\[stroke-dasharray="[^"]*"\]/g) ?? [];
  assert.deepStrictEqual(
    dash,
    ['[stroke-dasharray="0 1"]'],
    `the fallback must match exactly \`stroke-dasharray="0 1"\`. The page also ` +
      `draws dashed lines at "2 3" and "4 4", which are geometry rather than ` +
      `animation and must survive with JS off. Found: ${dash.join(", ")}`,
  );
});

/* ==========================================================================
 * G10 — no hand-typed figure survives as literal JSX text in the matrix.
 *
 * `playoff-matrix.tsx` computed a `career` memo whose comment read "derived from
 * the ledger so the tiles cannot drift from it" — and then, a hundred lines
 * later, hand-typed all of it into prose: the standfirst's eight figures, both
 * view-toggle labels, the "of 57 series" counter, the franchise-view heading and
 * its summary, and the five round tabs' ten records and counts. Eighteen figures,
 * eighteen places to be wrong, and no gate that could see any of it because the
 * test suite only reads the data module.
 *
 * Every one of them was checked to be CORRECT when derived — 42-15, 302, 8,521,
 * 25, 23, and all five tab records and counts reproduce exactly. The defect was
 * never a wrong number; it was that the number had a second home, which is a
 * latent wrong number rather than an actual one.
 *
 * The invariant is scoped to this one file on purpose. A page-wide version would
 * need an allow-list of every stat abbreviation in the project's copy, and a
 * guard with a hundred exceptions is a guard nobody reads.
 *
 * Numbered G10 because G8 was taken by the unlayered-class guard, which is a
 * different property of a different file. The plan called this G8 before either
 * existed.
 * ======================================================================== */

test("design guard G10 - no hand-typed figure in the playoff matrix's JSX text", () => {
  const file = "playoff-matrix";
  const raw = codeOf(read("components", `${file}.tsx`));
  const source = raw
    // Drop string and template literals, so a digit inside `className="min-w-[120px]"`
    // or a data string like `"1st Round"` cannot be mistaken for rendered copy.
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/`(?:[^`\\]|\\.)*`/g, "``");

  /**
   * Literal fragments of JSX text.
   *
   * Four things make this usable on raw source rather than an AST, and each was a
   * bug in an earlier version of this guard. It reported green while a hand-typed
   * `Series Ledger (57)` sat in the file, and then green again while `302` and
   * `25` did, so both are worth stating.
   *
   * 1. The opening `>` must not be preceded by `=` or `-`, which excludes `=>`
   *    and `->`. Without it, every arrow function contributes a run shaped like
   *    text — one of which is a 90-character line of `useState` declarations.
   * 2. A run may not span a `<` or `>`, so it cannot cross a tag boundary.
   * 3. Each run is then SPLIT on its interpolations, and every literal fragment
   *    between them is checked separately. This is the part the earlier versions
   *    got wrong: they treated a run containing a `{` as uncheckable, so any prose
   *    that mixed a hand-typed digit with a derived one nearby — which is the
   *    standfirst's entire shape — was skipped. `{" "}` is an interpolation too,
   *    and it appears between nearly every clause.
   * 4. Fragments may not contain `=`, `;`, `&` or `|`, which are code punctuation
   *    prose does not contain. Parentheses ARE allowed, because figures arrive in
   *    them and excluding them hid exactly what this guard exists to find.
   */
  const JSX_TEXT = /(?<![-=])>([^<>]*?)(?=<[A-Za-z/])/g;
  const isLiteralText = (t: string) => !/[<>=;&|]/.test(t);

  // Legitimate digit-bearing copy. A stat's name, not its value.
  const ALLOWED: Record<string, string> = {
    "3PT Percentage": "the stat's name. The abbreviation carries meaning no " +
      "spelled-out label would; the VALUE beside it is interpolated.",
  };

  const fragments = [...source.matchAll(JSX_TEXT)]
    .flatMap((m) => m[1].split(/\{[^{}]*\}/g))
    .map((t) => t.trim().replace(/\s+/g, " "))
    .filter((t) => t.length > 0);

  const offenders = [
    ...new Set(
      fragments.filter(
        (t) => isLiteralText(t) && /\d/.test(t) && !(t in ALLOWED),
      ),
    ),
  ];

  assert.deepStrictEqual(
    offenders,
    [],
    `${file}.tsx renders these figures as literal text: ${offenders.join(" | ")}. ` +
      `Every figure on this page must be interpolated from the \`career\` memo (or ` +
      `from SEASONS / FRANCHISE_BREAKDOWN), so a data change moves the prose and ` +
      `the tiles together. A figure is correct here today — all eighteen were ` +
      `verified against the derived values — but a second home for a number is a ` +
      `wrong number waiting for the next data change. If the text is a stat NAME ` +
      `rather than its value, add it to ALLOWED with the reason.`,
  );

  const stale = Object.keys(ALLOWED).filter((k) => !fragments.includes(k));
  assert.deepStrictEqual(
    stale,
    [],
    `G10's ALLOWED map lists ${stale.join(", ")}, which is no longer literal JSX ` +
      `text in ${file}.tsx. Delete the entry.`,
  );

  // The round tabs' record and count are JSX-invisible — they are a data table at
  // module scope — so the text scan above cannot see them, and ten hand-typed
  // figures lived there unnoticed. Asserted separately, against the source with
  // its strings intact so the failure names the literal that was typed.
  assert.ok(
    !/record:\s*"/.test(raw) && !/\bcount:\s*\d/.test(raw),
    `${file}.tsx must not hand-type a round tab's \`record\` or \`count\`. Both ` +
      `are computed from PLAYOFF_SERIES through \`matchesFilters\`, so a tab ` +
      `cannot advertise a figure the grid will not deliver. Found a literal: ` +
      `${(raw.match(/record:\s*"[^"]*"|\bcount:\s*\d+/) || ["(none)"])[0]}`,
  );
});

/* ==========================================================================
 * G11 — Tailwind's content detection is scoped, and no banned utility is a
 *       candidate anywhere the scanner reads.
 *
 * Left automatic, Tailwind v4 scans the project from the stylesheet's directory
 * upward, which includes every Markdown file, the ESLint config and this suite.
 * All of those contain the literal strings of the utilities the design system
 * bans, so Tailwind generated them. Measured in the production bundle before
 * this guard existed: twelve banned utilities in 59 KB of CSS, and not one
 * component using any of them.
 *
 * Two of the audit's supporting claims were wrong and are corrected here rather
 * than repeated. `.font-sans` does NOT resolve against an empty custom property;
 * it resolves against Tailwind's default system stack
 * (`-apple-system, BlinkMacSystemFont, "Segoe UI", ...`), which is worse, because
 * that is exactly the third family AGENTS.md §2 forbids. And the components DO
 * contain the tokens — four times — all inside comments explaining why they are
 * banned.
 *
 * That last point is the finding. Tailwind's candidate scanner does not skip
 * comments, and it does not know English, so a comment warning against a banned
 * utility is sufficient to SHIP it. Three were reworded for that reason. The
 * assertion below is what stops the fourth being joined by a fifth.
 *
 * `globals.css` itself is deliberately not a scanned source, which is why the
 * `app` directive is scoped to `*.tsx`; see the `source(none)` block at the top
 * of that file.
 * ======================================================================== */

test("design guard G11 - Tailwind sources are scoped and carry no banned candidate", () => {
  const css = read("app", "globals.css");

  // 1. The scoping itself.
  assert.match(
    css,
    /@import\s+"tailwindcss"\s+source\(none\)/,
    'globals.css must import tailwind with `source(none)`, or automatic ' +
      "detection scans the Markdown, the lint config and the guards — all of " +
      "which contain the banned utilities as literal strings.",
  );
  for (const dir of ['@source "../components"', '@source "../lib"']) {
    assert.ok(
      css.includes(dir),
      `globals.css is missing ${dir}. A new file in that directory must be ` +
        `picked up without editing this list.`,
    );
  }
  assert.ok(
    css.includes('@source "../app/**/*.tsx"'),
    'the app source must be scoped to `*.tsx`. Scoping it to the directory ' +
      "includes globals.css itself, whose comment lists the banned utilities — " +
      "measured: that alone accounted for four of them.",
  );

  // 2. No banned utility may be a CANDIDATE in a scanned file. Mirrors the way
  //    Tailwind extracts: a bare token, not part of a longer class name.
  const BANNED = [
    "rounded",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
    "font-mono",
    "font-serif",
    "font-sans",
    "tracking-widest",
    "tracking-[0.2em]",
  ];

  /** Files Tailwind is told to read. `globals.css` is excluded, by design. */
  const scanned = [
    ...readdirSync(COMPONENTS)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => `components/${f}`),
    ...readdirSync(join(ROOT, "app"))
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => `app/${f}`),
  ];

  /**
   * Occurrences that are genuinely unavoidable, each with the reason.
   *
   * The one entry is the English word "rounded" in the ledger's rendered copy —
   * "Nothing here is rounded to make it land". Tailwind extracts it as a
   * candidate and emits a 33-byte `.rounded` rule that nothing can use, because
   * the lint gate bans `rounded` in any className. Rewriting a good sentence for
   * a CSS scanner is the wrong trade, so the dead rule is accepted and recorded
   * here instead. Everything else must be reworded.
   */
  const ACCEPTED: Record<string, string> = {
    "components/the-ledger.tsx:157":
      "the rendered sentence \"Nothing here is rounded to make it land\". " +
      "Reader-facing copy; the emitted rule is unreachable because lint bans " +
      "the class. Rewriting prose to satisfy a scanner is the wrong trade.",
  };

  const found: string[] = [];
  for (const rel of scanned) {
    readFileSync(join(ROOT, rel), "utf8")
      .split(/\r?\n/)
      .forEach((line, i) => {
        for (const token of BANNED) {
          const escaped = token.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
          // A candidate: the token standing alone, not part of a longer name.
          const re = new RegExp(
            `(^|[\\s"'\`\\[(,])${escaped}(?![\\w\\-])`,
          );
          if (re.test(line)) {
            // Forward slashes regardless of platform: the ACCEPTED keys below
            // are written that way, and `join` emits `\` on Windows, which
            // silently stopped the exception from ever matching.
            const where = `${rel.split("\\").join("/")}:${i + 1}`;
            if (!(where in ACCEPTED)) {
              found.push(
                `${where}  [${token}]  ${line.trim().slice(0, 60)}`,
              );
            }
          }
        }
      });
  }

  assert.deepStrictEqual(
    found,
    [],
    `these banned utilities survive as Tailwind candidates, so the build ships\n` +
      `them: ${found.join("\n  ")}\n  Tailwind's scanner reads comments and ` +
      `does not know English, so a comment warning against a utility is enough ` +
      `to generate it. Name the utility descriptively instead.`,
  );

  const stale = Object.keys(ACCEPTED).filter((k) => {
    const at = k.lastIndexOf(":");
    const file = k.slice(0, at);
    const line = readFileSync(join(ROOT, ...file.split("/")), "utf8").split(
      /\r?\n/,
    )[Number(k.slice(at + 1)) - 1];
    return !/(^|[\s"'`[(,])rounded(?![\w-])/.test(line ?? "");
  });
  assert.deepStrictEqual(
    stale,
    [],
    `G11's ACCEPTED map lists ${stale.join(", ")}, which no longer contains the ` +
      `word. Delete the entry — and if the copy was reworded, the dead CSS rule ` +
      `goes with it.`,
  );
});

/* ==========================================================================
 * G12 — no middle-dot separator in rendered copy.
 *
 * AGENTS.md §1 bans "tracked-out all-caps eyebrows with middle dots (`A · B ·
 * C`)", and two lint rules police the TRACKING half: `tracking-[0.2em]` and
 * `tracking-widest` are errors. The DOT half had no enforcement at all, and the
 * tell survived it — because the eyebrows it describes are set in `.narrow`,
 * which is uppercase with `0.04em` tracking. The lint rules cannot see them,
 * which is the same shape as the bare-`fr` rule that matched a string occurring
 * zero times: the half that was policed was the half that was easy to police.
 *
 * Ten sites were live. Two era-comparison kickers, the shot-zone era label, two
 * father-and-son kickers, the Scorer's Table banner, three playoff-matrix band
 * captions, the franchise summary, and — the one worth recording — a lone `·`
 * sitting inside a `gap-3` flex row in father-and-son, so the glyph was inside
 * the gap the flex had already made and read as a stray character rather than a
 * separator. That one is deleted rather than replaced, because the gap was
 * already doing the work the glyph claimed to do.
 *
 * Comments are stripped before the scan, for the reason G10 and G11 both
 * needed to do it: this repository's own copy discusses the tell at length, and
 * a text scan that does not strip comments reports a guard describing a design
 * rule as a violation of it.
 *
 * One entry survives. It is a data string rather than a label — the drawer's
 * `3 stl · 1 blk` readout, in the body face and untracked, where the dot is
 * joining two figures in a cell too narrow to hold them on two lines. AGENTS.md
 * §2 explicitly protects "a data string inside a sentence".
 * ======================================================================== */

test("design guard G12 - no middle-dot separator in rendered copy", () => {
  const SEPARATOR = /[·•]/;

  /**
   * The one site where the dot is a data separator rather than a label, keyed by
   * file and then by a DISTINCTIVE SUBSTRING of the offending line.
   *
   * The first version of this guard keyed the exception by FILE alone, so
   * exempting that one line silently exempted all of `playoff-matrix.tsx` — and
   * re-adding a middle dot to a StatBand caption or to the franchise summary
   * inside it passed. A per-file allow-list is an off switch wearing a
   * footnote. G10 and G11 already key per site, for the same reason.
   *
   * Substring rather than line number, because a line number is invalidated by
   * any edit above it and would then exempt the wrong line.
   */
  const ACCEPTED: Record<string, Record<string, string>> = {
    "playoff-matrix.tsx": {
      "boxScoreTotals?.stl} stl ·":
        "the drawer's compact `3 stl · 1 blk` readout. A data string in the " +
        "body face and untracked, joining two figures in a cell too narrow to " +
        "hold them on two lines. AGENTS.md §2 protects a data string.",
    },
  };

  /** Attribute values and comments are out of scope. */
  const isRendered = (line: string) =>
    !/=\s*`[^`]*$|=\s*"[^"]*$|=\s*'[^']*$/.test(line);

  const offenders: string[] = [];
  for (const { name, source } of componentFiles) {
    const allowed = ACCEPTED[name] ?? {};
    codeOf(source)
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (!isRendered(line) || !SEPARATOR.test(line)) return;
        const trimmed = line.trim();
        const hit = Object.keys(allowed).find((k) => trimmed.includes(k));
        if (hit) return;
        offenders.push(`${name}:${i + 1}  ${trimmed.slice(0, 62)}`);
      });
  }

  assert.deepStrictEqual(
    offenders,
    [],
    `a middle-dot separator is back in rendered copy: ${offenders.join(" | ")}. ` +
      `AGENTS.md §1 bans it, and because these labels are set in \`.narrow\` ` +
      `(uppercase, 0.04em) the two tracking lint rules cannot see them. Use a ` +
      `comma, or let a flex gap do the separating.`,
  );

  const stale: string[] = [];
  for (const [name, entries] of Object.entries(ACCEPTED)) {
    const file = componentFiles.find((f) => f.name === name);
    if (!file) {
      stale.push(`${name} (no such component)`);
      continue;
    }
    const rendered = codeOf(file.source)
      .split(/\r?\n/)
      .filter(isRendered);
    for (const key of Object.keys(entries)) {
      if (!rendered.some((line) => line.includes(key))) {
        stale.push(`${name} [${key}]`);
      }
    }
  }
  assert.deepStrictEqual(
    stale,
    [],
    `G12's ACCEPTED map lists ${stale.join(", ")}, which no longer matches a ` +
      `separator glyph in rendered copy. Delete the entry.`,
  );
});

/* ==========================================================================
 * G13 - every no-JS cover is opted out of NO_SCRIPT_CSS.
 *
 * The shot challenge retracts an opaque maple sheet off its half-court:
 * `initial={{ scaleX: 1 }}` and `whileInView={{ scaleX: 0 }}`. AGENTS.md §6's
 * fallback cannot neutralise it, because Framer serialises `scaleX: 1` as
 * `transform:none` and the general transform rule has nothing to flatten. For
 * an opaque overlay the untransformed state IS the covered state, so with
 * scripting disabled the court rendered as a blank maple rectangle.
 *
 * The remedy is an opt-in `data-cover` attribute plus one rule in
 * `NO_SCRIPT_CSS`. That makes the invariant hand-maintained, which §6 calls
 * out as the thing not to do, so it is pinned here from two ends: the rule has
 * to exist, and every element carrying the attribute has to actually be an
 * animation-driven cover rather than an incidental match.
 * ======================================================================== */

test("design guard G13 - no-JS covers are opted out, and the opt-out rule exists", () => {
  const layout = codeOf(read("app", "layout.tsx"));
  const css = layout.slice(layout.indexOf("NO_SCRIPT_CSS"));

  const users = componentFiles.filter((f) => /data-cover/.test(codeOf(f.source)));

  assert.ok(
    users.length > 0,
    "no component carries `data-cover`, so this guard is measuring nothing. " +
      "The shot challenge's cover is the element that needs it; if it has gone, " +
      "delete this guard rather than leave it green on an empty set.",
  );

  assert.match(
    css,
    /\[data-cover\]\s*\{\s*display:\s*none\s*!important;?\s*\}/,
    "NO_SCRIPT_CSS must remove `data-cover` elements outright. Neutralising " +
      "the animation cannot help an element that only the animation removes.",
  );

  for (const { name, source } of users) {
    const code = codeOf(source);
    for (const attr of code.match(/data-cover/g) ?? []) {
      assert.ok(
        attr === "data-cover",
        `${name} uses data-cover; the attribute takes no value.`,
      );
    }
    assert.match(
      code,
      /data-cover=""[\s\S]{0,400}?initial=\{\{/,
      `${name} marks an element \`data-cover\` but no nearby \`initial={{ … }}\` ` +
        "animates it away. An element that is removed by the no-JS rule and " +
        "stays put with JS on would be a new hole, not a fixed one.",
    );
  }
});
