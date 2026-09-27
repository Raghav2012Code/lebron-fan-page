"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import {
  DUR,
  EASE_PAINT,
  EASE_SETTLE,
  rise,
  riseChar,
  VIEWPORT,
} from "@/lib/motion";

/* -------------------------------------------------------------------------
 * Counter — counts up once, when scrolled into view, driven by a Framer
 * animation writing straight to the DOM node (no per-frame React state).
 * ---------------------------------------------------------------------- */

function formatNumber(value: number, decimals: number): string {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart ? `${grouped}.${decPart}` : grouped;
}

export function Counter({
  to,
  from = 0,
  duration,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  /* The repo's `usePrefersReducedMotion`, NOT Framer's `useReducedMotion`.
     Framer's is a one-shot read, not a subscription — its own source carries a
     TODO about it — so the value is frozen at first render and never re-renders
     the component. That made the `reduce` dep below inert, which in turn made
     the mid-count branch unreachable: it could only ever be taken if the
     preference was already set at first paint, so the comment promising to
     handle a preference "flipped on while counting" described behaviour that
     could not happen. This hook is a `useSyncExternalStore` over `matchMedia`,
     so the flip is real. `center-court`, `the-rooms` and `last-shot` already
     used it. */
  const reduce = usePrefersReducedMotion();
  const started = React.useRef(false);
  const controlsRef = React.useRef<{ stop: () => void } | null>(null);

  // Small integer targets (<= 10) scale to snappy 0.6s–0.8s so counting
  // to 3 or 4 feels crisp instead of sluggish.
  const animDuration =
    duration ??
    (to <= 10 ? Math.max(0.6, Math.min(0.8, 0.5 + to * 0.05)) : 1.8);

  const countKey = `${to}:${from}:${animDuration}:${decimals}`;
  const countKeyRef = React.useRef(countKey);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    if (countKeyRef.current !== countKey) {
      // to/from/duration/decimals changed: this is effectively a new count,
      // not a continuation, so allow it to (re)start instead of staying
      // frozen at the previous target's value.
      countKeyRef.current = countKey;
      started.current = false;
    }

    if (reduce) {
      // Finalize immediately, even mid-count: stop any running animation
      // (e.g. reduced-motion preference flipped on while counting) so the
      // node never gets stuck at an intermediate value.
      controlsRef.current?.stop();
      controlsRef.current = null;
      node.textContent = formatNumber(to, decimals);
      started.current = true;
      return;
    }

    if (started.current) return;
    started.current = true;

    const controls = animate(from, to, {
      duration: animDuration,
      ease: EASE_SETTLE,
      onUpdate: (v) => {
        node.textContent = formatNumber(v, decimals);
      },
      // Without this an interrupted count freezes on whatever intermediate
      // value it had reached and the cleanup below retains it, so the figure
      // stays wrong permanently rather than merely un-animated.
      onComplete: () => {
        node.textContent = formatNumber(to, decimals);
      },
    });
    controlsRef.current = controls;
    return () => {
      controls.stop();
      // Guarantee the final value survives any stop, mid-flight or not.
      if (node.isConnected) node.textContent = formatNumber(to, decimals);
    };
  }, [inView, to, from, animDuration, decimals, reduce, countKey]);

  return (
    <span className={cn(className)}>
      {prefix}
      {/* The server has no IntersectionObserver and no animation clock, so
          the value it can honestly render is the FINAL one. Seeding this with
          `from` shipped every statistic on the page as a literal 0 to any
          client without JS. The count still animates from `from` once
          hydrated, because the effect writes to this same node. */}
      <span ref={ref}>{formatNumber(to, decimals)}</span>
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * RiseLine — a single line of lettering coming up out of the boards inside a
 * mask. The observer sits on the unclipped wrapper: watching the clipped
 * child would report ~0 intersection (it starts translated out of the mask)
 * and the reveal would never fire.
 * ---------------------------------------------------------------------- */

export function RiseLine({
  children,
  className,
  delay = 0,
  once = true,
  as = "span",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  as?: "span" | "div";
}) {
  const Wrapper = as === "div" ? motion.div : motion.span;
  return (
    <Wrapper
      data-reveal=""
      className={cn("inline-flex overflow-hidden", className)}
      style={{ paddingBottom: "0.1em" }}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.35 }}
      variants={{ hidden: {}, show: {} }}
    >
      <motion.span
        className="inline-block will-change-transform"
        variants={rise}
        transition={{ duration: DUR.slow, ease: EASE_SETTLE, delay }}
      >
        {children}
      </motion.span>
    </Wrapper>
  );
}

/* -------------------------------------------------------------------------
 * RiseWords — word-by-word masked reveal for headlines. The animated pieces
 * are aria-hidden and a visually-hidden sibling carries the real string,
 * since aria-label on a plain span is not reliably announced.
 * ---------------------------------------------------------------------- */

export function RiseWords({
  text,
  className,
  stagger = 0.07,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
}) {
  const words = text.split(" ");
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        data-reveal=""
        className={cn("inline-flex flex-wrap", className)}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.35 }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex overflow-hidden"
            style={{ paddingBottom: "0.1em" }}
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={rise}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? (
              <span className="inline-block">&nbsp;</span>
            ) : null}
          </span>
        ))}
      </motion.span>
    </>
  );
}

/* -------------------------------------------------------------------------
 * PaintedName — letter-by-letter reveal used once, in the hero. Letters are
 * laid down left to right like a roller passing over the boards.
 * ---------------------------------------------------------------------- */

export function PaintedName({
  word,
  className,
  baseDelay = 0,
  perLetter = 0.045,
  style,
}: {
  word: string;
  className?: string;
  baseDelay?: number;
  perLetter?: number;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden
      data-reveal=""
      className={cn("inline-flex", className)}
      style={style}
    >
      {Array.from(word).map((c, i) => (
        <span
          key={i}
          className="inline-flex overflow-hidden"
          style={{ paddingBottom: "0.08em" }}
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={riseChar}
            transition={{
              duration: 0.8,
              ease: EASE_SETTLE,
              delay: baseDelay + i * perLetter,
            }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * PaintRule — a painted line laid down from one edge. The site's only
 * repeated decorative element, and it always separates two real things.
 * ---------------------------------------------------------------------- */

export function PaintRule({
  className,
  color = "var(--rule)",
  thickness = 1,
  from = "left",
  delay = 0,
  once = true,
}: {
  className?: string;
  color?: string;
  thickness?: number;
  from?: "left" | "right";
  delay?: number;
  once?: boolean;
}) {
  return (
    <motion.span
      aria-hidden
      data-reveal=""
      className={cn("block w-full", className)}
      style={{
        height: thickness,
        backgroundColor: color,
        transformOrigin: from,
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once, amount: 0.6 }}
      transition={{ duration: 1.1, ease: EASE_PAINT, delay }}
    />
  );
}

/* -------------------------------------------------------------------------
 * Caption — the narrow cut, used for every label and data string on the site
 * in place of the tracked-out monospace this design started from.
 * ---------------------------------------------------------------------- */

export function Caption({
  children,
  className,
  style,
  bold = false,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  bold?: boolean;
  as?: "span" | "div" | "p" | "dt" | "dd";
}) {
  return (
    <Tag
      className={cn(
        bold ? "narrow-bold" : "narrow",
        "text-[0.8125rem] leading-snug",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * Opener — the shape a section opens with.
 *
 * The page originally ran one structural rhythm thirteen times: eyebrow, huge
 * condensed headline, standfirst, four-item band. A reader could predict every
 * remaining section from the one before it, which is the single largest reason
 * the page read as generated (DESIGN-AUDIT.md F-01).
 *
 * Each top-level unit therefore declares which of five openers it uses, and the
 * test gate asserts that no two ADJACENT units in `app/page.tsx` declare the
 * same one. Silhouette is not machine-checkable, so the declared value is the
 * honest proxy: it forces the intent to be written down, and reordering the page
 * without reconsidering the rhythm fails the gate.
 *
 *   device       — no heading block; the mechanism IS the opener (the court,
 *                  the pinned chapters, the colossal numeral, the scrubber)
 *   ruled-ledger — display heading on a rule; body is a ruled list, no frames
 *   written-line — the heading IS the content, one line at display scale
 *   margin-note  — heading in a narrow left column, body running beside it
 *   instrument   — dense bordered panel, controls in its top edge, no heading
 * ------------------------------------------------------------------------ */

export type Opener =
  | "device"
  | "ruled-ledger"
  | "written-line"
  | "margin-note"
  | "instrument";

/* There is deliberately no `OPENERS` runtime array alongside this union. It was
   exported when the archetypes were introduced and consumed by nothing; the
   one place that needs the list at runtime is guard G4 in
   `tests/design-guards.test.ts`, which cannot import a `.tsx` and therefore
   spells the five out itself, next to the assertion that uses them. A const
   array here would be a third copy of the same list with no reader. */

/* -------------------------------------------------------------------------
 * Kicker — the replacement for the tracked all-caps eyebrow.
 *
 * `AGENTS.md` §1 bans "tracked-out all-caps eyebrows with middle dots". The
 * eyebrow pattern was nine sites; four were redundant labels for the heading
 * beneath them and were deleted, and five carry real information (the hero's
 * scroll affordance, and era-compare's four metric-group labels).
 *
 * This is what those five use. It is deliberately NOT built on `.narrow`:
 * `.narrow` is uppercase with 0.04em tracking, so a "restyled" kicker that kept
 * it would satisfy a grep for the tracking utilities while looking exactly the
 * same on screen. Body face, body size, sentence case, no tracking override, no
 * separator glyph.
 * ------------------------------------------------------------------------ */

export function Kicker({
  children,
  className,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  return (
    <Tag className={cn("text-[0.9375rem] leading-snug text-muted", className)}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * StatBand — the four-item band, as one component.
 *
 * This existed inline at seven sites, which is how a page ends up with the same
 * container for everything (F-01). Extracting it makes the cap mechanical: the
 * test gate asserts `<StatBand` appears at most twice on the page, so the band
 * can no longer quietly become the default container for a new section.
 *
 * Two presentations, because the two surviving uses genuinely differ:
 *   framed — each item is an inset panel. The scoreboard read.
 *   ruled  — one hairline top and bottom, items divided by verticals. The
 *            line-score read, on a painted ground where frames would fight it.
 * ------------------------------------------------------------------------ */

/**
 * One item in a `StatBand`.
 *
 * Only the fields a call site actually passes are here. `valueClassName`,
 * `captionClassName` and `itemClassName` existed when this was written and were
 * never used at either of the two call sites, so they were removed rather than
 * left as an API nobody exercises. `labelClassName` earns its place: the block's
 * telemetry sits on paint and needs a chalk token its parent cannot supply.
 *
 * Adding a field here is a claim that something needs it. If nothing does, it is
 * a second way to say the same thing, and the next reader cannot tell which is
 * authoritative.
 */
export interface StatBandItem {
  label: string;
  value: React.ReactNode;
  caption?: React.ReactNode;
  /** `gold` for a figure that is a highlight rather than a total. */
  tone?: "wine" | "gold";
  /** Overrides the item's label colour, e.g. to a chalk token on paint. */
  labelClassName?: string;
}

export function StatBand({
  items,
  variant = "framed",
  className,
  itemClassName,
}: {
  items: readonly StatBandItem[];
  variant?: "framed" | "ruled";
  className?: string;
  itemClassName?: string;
}) {
  if (variant === "ruled") {
    return (
      <div
        className={cn(
          "grid grid-cols-2 gap-x-6 gap-y-8 border-y border-rule-chalk py-6 sm:grid-cols-4",
          className,
        )}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className={cn("flex flex-col gap-1", itemClassName)}
          >
            <span
              className={cn(
                "figure text-[2.25rem] sm:text-[3rem]",
                item.tone === "gold" ? "text-gold" : "text-wine",
              )}
            >
              {item.value}
            </span>
            <Caption className={item.labelClassName}>{item.label}</Caption>
            {item.caption ? (
              <Caption className="mt-0.5">{item.caption}</Caption>
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4",
        className,
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "rounded-none border border-rule bg-maple-deep/40 p-4 backdrop-blur-xs",
            itemClassName,
          )}
        >
          <Caption bold className={cn("block text-muted", item.labelClassName)}>
            {item.label}
          </Caption>
          <div
            className={cn(
              "figure mt-1 text-2xl text-wine sm:text-3xl lg:text-4xl",
              item.tone === "gold" && "text-gold",
            )}
          >
            {item.value}
          </div>
          {item.caption ? (
            <Caption className="mt-1 block text-muted">{item.caption}</Caption>
          ) : null}
        </div>
      ))}
    </div>
  );
}
