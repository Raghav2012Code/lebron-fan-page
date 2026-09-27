import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Design tells, enforced.
 *
 * Every rule here is a pattern `AGENTS.md` §1 bans by name but nothing stopped.
 * They are `no-restricted-syntax` entries rather than a plugin: that rule takes
 * esquery AST selectors, and esquery's attribute selectors accept a regex, which
 * is the only way to match a substring of a `className` value. A custom rule
 * would be needed if these had to inspect anything beyond a literal string.
 *
 * Three properties are deliberate:
 *
 *   - They visit AST nodes, so they never see COMMENTS. `the-rooms.tsx:81-82`
 *     documents two rejected hex values in a comment explaining a contrast
 *     decision; a text grep would fail on that documentation forever.
 *   - Each reports the offending node, so a failure names a file and line
 *     instead of one aggregate count.
 *   - Every className rule is emitted TWICE: once for a bare string attribute,
 *     and once for a string literal nested anywhere inside a `className={...}`
 *     expression. The second selector is not redundant. Most of this codebase
 *     composes class names through `cn("base", active && "conditional")`, where
 *     the attribute's own value is a CallExpression and never a string, so a
 *     `value.value` selector alone matched the bare cases and silently passed
 *     every composed one -- which is most of them.
 *
 * The `className` selectors are anchored so they cannot fire on a lookalike.
 * The `fr` rule is the one that needed real care, and its previous form was
 * inert: it matched `/grid-cols-\[1fr/`, a string that occurs ZERO times in the
 * repository, so it could never fire on anything while AGENTS.md §1 documented
 * it as enforced. Its justifying comment here also claimed that
 * `grid-cols-[1.3fr_1fr]` "is already safe", which is false -- an `fr` track has
 * an automatic minimum of `min-content`, so `1.3fr` can be forced just as open as
 * `1fr` by a long unbroken string. The rule now matches a bare `fr` token
 * anywhere in a track list, and is careful in one direction only: an `fr` that is
 * the max of a `minmax(...)` is followed by `)`, not by `_`, a space or `]`, so
 * `minmax(0,1fr)_auto` is correctly left alone. `minmax(9rem,14rem)_1fr` is NOT
 * left alone -- the minmax is on the other track, and the bare one still has its
 * min-content floor.
 */

/** A className attribute holding a bare string literal. */
const literalClassName = (pattern) =>
  `JSXAttribute[name.name='className'][value.value=${pattern}]`;

/**
 * Any string literal inside a className expression, however deeply composed.
 *
 * `JSXExpressionContainer`, not `Expression`: there is no `Expression` node in a
 * JSX AST. `className="x"` parses to a Literal directly on the attribute, while
 * `className={...}` parses to a JSXExpressionContainer wrapping the expression,
 * so the first selector covers the bare case and this one the composed case.
 */
const composedClassName = (pattern) =>
  `JSXAttribute[name.name='className'] JSXExpressionContainer Literal[value=${pattern}]`;

const classNameHas = (pattern, message) => [
  { selector: literalClassName(pattern), message },
  { selector: composedClassName(pattern), message },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Only the components directory is subject to the design rules: these are
    // UI tells, and the data module legitimately holds raw hex per-team colours
    // and does not carry className at all.
    files: ["components/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...classNameHas(
          "/(^|\\s)tracking-\\[0\\.2em\\](\\s|$)/",
          "AGENTS.md §1 bans tracked-out all-caps eyebrows. Use the `Kicker` component, which is sentence case and untracked. If this is a data label, use `.narrow` via `Caption`.",
        ),
        ...classNameHas(
          "/(^|\\s)tracking-widest(\\s|$)/",
          "AGENTS.md §1 bans tracked-out all-caps eyebrows. Use the `Kicker` component for a kicker, or `.narrow` via `Caption` for a data label.",
        ),
        ...classNameHas(
          "/(^|\\s)font-mono(\\s|$)/",
          "globals.css declares two families and no monospace. Use `.narrow` / `.narrow-bold` for a label or data string, `.prose-copy` for prose, or `font-text` for inline body copy.",
        ),
        ...classNameHas(
          "/#[0-9a-fA-F]{3,8}/",
          "Raw hex in a component bypasses the token layer and will drift from globals.css. Use a named token (bg-wine, text-leather, ...) or a var(--…) reference. Per-team colours belong in the data module.",
        ),
        // The card grid's uniform hover-lift. `back-to-top.tsx` moves an ICON on
        // group-hover, which is an affordance rather than decoration, and is
        // deliberately not matched: it is not a card and does not lift one.
        {
          selector:
            "JSXAttribute[name.name='whileHover'] Expression ObjectExpression Property[key.name='y']",
          message:
            "A uniform vertical hover-lift across a card grid is a named AI tell (DESIGN-AUDIT.md F-09). Use an affordance that carries information about that card, such as inverting the result badge, rather than moving it.",
        },
        ...classNameHas(
          // A bare `fr` token: the character after the unit must be `_`, a space
          // or the closing bracket. Inside `minmax(...)` the `fr` is followed by
          // `)`, which is what keeps the safe form out of the match.
          "/grid-cols-\\[[^\\]]*fr(?=[\\s_\\]])/",
          "A bare flexible grid track has an automatic min-content minimum, so a long unbroken string can force it open. Use minmax(0,1fr) so the track can shrink (DESIGN-AUDIT.md F-12). Every bare `fr` in the list needs it, not only a leading one.",
        ),
      ],
    },
  },
]);

export default eslintConfig;
