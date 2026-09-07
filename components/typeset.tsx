"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

import { cn } from "@/lib/utils";
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
  duration = 1.8,
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
  const reduce = useReducedMotion();
  const started = React.useRef(false);
  const controlsRef = React.useRef<{ stop: () => void } | null>(null);
  const countKey = `${to}:${from}:${duration}:${decimals}`;
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
      duration,
      ease: EASE_SETTLE,
      onUpdate: (v) => {
        node.textContent = formatNumber(v, decimals);
      },
    });
    controlsRef.current = controls;
    return () => controls.stop();
  }, [inView, to, from, duration, decimals, reduce, countKey]);

  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>{formatNumber(from, decimals)}</span>
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
    <span aria-hidden className={cn("inline-flex", className)} style={style}>
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
