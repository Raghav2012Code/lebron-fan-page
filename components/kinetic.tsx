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
  charClip,
  DUR,
  EASE_OUT,
  maskUp,
  staggerFast,
  VIEWPORT,
  wordUp,
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
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = formatNumber(v, decimals);
      },
    });
    controlsRef.current = controls;
    return () => controls.stop();
  }, [inView, to, from, duration, decimals, reduce, countKey]);

  return (
    <span className={cn("tnum", className)}>
      {prefix}
      <span ref={ref}>{formatNumber(from, decimals)}</span>
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------
 * SplitText — masked word/character reveal. Accessible: the animated pieces
 * are aria-hidden and a visually-hidden sibling exposes the real string,
 * since aria-label support on a plain span/div isn't reliable across
 * screen readers.
 * ---------------------------------------------------------------------- */

export function SplitText({
  text,
  mode = "word",
  className,
  stagger,
  delay = 0,
  as = "span",
  once = true,
}: {
  text: string;
  mode?: "word" | "char";
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "span" | "div";
  once?: boolean;
}) {
  const tokens =
    mode === "word" ? text.split(" ") : Array.from(text);
  const itemVariant: Variants = mode === "word" ? wordUp : charClip;
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger ?? (mode === "word" ? 0.09 : 0.035),
        delayChildren: delay,
      },
    },
  };

  const Wrapper = as === "div" ? motion.div : motion.span;

  return (
    <>
      <span className="sr-only">{text}</span>
      <Wrapper
        aria-hidden
        className={cn("inline-flex flex-wrap", className)}
        style={{ perspective: 600 }}
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.4 }}
      >
        {tokens.map((token, i) => (
          <span
            key={`${token}-${i}`}
            aria-hidden
            className="inline-flex overflow-hidden"
            style={{ paddingBottom: "0.08em" }}
          >
            <motion.span
              className="inline-block will-change-transform"
              variants={itemVariant}
            >
              {token === " " ? " " : token}
            </motion.span>
            {mode === "word" && i < tokens.length - 1 ? (
              <span className="inline-block">{" "}</span>
            ) : null}
          </span>
        ))}
      </Wrapper>
    </>
  );
}

/* -------------------------------------------------------------------------
 * MaskReveal — single masked line for a block of children.
 * ---------------------------------------------------------------------- */

export function MaskReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  // The observer must sit on the *unclipped* wrapper — observing the clipped
  // child would report ~0 intersection (it starts translated out of the mask)
  // and the reveal would never fire.
  return (
    <motion.span
      className={cn("inline-flex overflow-hidden", className)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: {} }}
    >
      <motion.span
        className="inline-block will-change-transform"
        variants={maskUp}
        transition={{ duration: DUR.slow, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

/* -------------------------------------------------------------------------
 * SectionLabel — the mono "01 — HONOURS & RECORDS" tag with a drawn rule.
 * ---------------------------------------------------------------------- */

export function SectionLabel({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  return (
    <motion.div
      className={cn(
        "flex items-center gap-4",
        align === "right" && "flex-row-reverse",
        className,
      )}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={staggerFast}
    >
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 8 },
          show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_OUT } },
        }}
        className="label whitespace-nowrap text-gold"
      >
        {children}
      </motion.span>
      <motion.span
        className="h-px flex-1 origin-left bg-hairline"
        variants={{
          hidden: { scaleX: 0 },
          show: {
            scaleX: 1,
            transition: { duration: DUR.slow, ease: EASE_OUT },
          },
        }}
        style={{ transformOrigin: align === "right" ? "right" : "left" }}
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
 * GhostNumeral — oversized outlined figure sitting behind content.
 * ---------------------------------------------------------------------- */

export function GhostNumeral({
  children,
  className,
  strokeColor = "var(--hairline-strong)",
}: {
  children: React.ReactNode;
  className?: string;
  strokeColor?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "font-display type-outline pointer-events-none select-none leading-none",
        className,
      )}
      style={{ ["--stroke-c" as string]: strokeColor, ["--stroke-w" as string]: "2px" }}
    >
      {children}
    </span>
  );
}
