"use client";

import * as React from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { ERAS, type Era } from "@/lib/lebron-data";
import { EASE_OUT, fadeUp, VIEWPORT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { SectionLabel, SplitText } from "@/components/kinetic";

const pad = (n: number) => String(n).padStart(2, "0");
const N = ERAS.length;

/* ------------------------------------------------------------------ EraPanel
 * Right-hand detail panel. Panels are stacked absolutely and cross-fade with
 * vertical movement as the shared scroll progress advances.
 */
function EraPanel({
  era,
  i,
  progress,
  active,
}: {
  era: Era;
  i: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const seg = 1 / (N - 1);
  const center = i / (N - 1);
  const range = [center - seg, center, center + seg];

  const opacity = useTransform(progress, range, [0, 1, 0]);
  const y = useTransform(progress, range, ["55%", "0%", "-55%"]);
  const scale = useTransform(progress, range, [0.94, 1, 0.94]);
  const ghostY = useTransform(progress, range, [90, 0, -90]);

  return (
    <motion.div
      aria-hidden={!active}
      className="absolute inset-0 flex flex-col justify-center"
      style={{ opacity, y, scale, color: era.text }}
    >
      <motion.span
        aria-hidden
        className="font-display pointer-events-none absolute right-0 top-6 select-none leading-none"
        style={{
          y: ghostY,
          color: era.accent,
          opacity: 0.1,
          fontSize: "clamp(9rem, 22vw, 18rem)",
        }}
      >
        {era.ghost}
      </motion.span>

      <div className="relative z-10 max-w-xl">
        <span className="label" style={{ color: era.accent }}>
          {era.years} · {era.place} · {era.jersey}
        </span>
        <h3
          className="mt-4 font-display leading-[0.88]"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
        >
          {era.name}
        </h3>

        <div className="mt-7 flex items-baseline gap-3">
          <span
            className="font-display leading-none"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: era.accent }}
          >
            {era.stat}
          </span>
          <span className="label max-w-[8rem]" style={{ opacity: 0.85 }}>
            {era.statLabel}
          </span>
        </div>

        <div className="mt-7 flex gap-3">
          <span
            aria-hidden
            className="mt-1.5 h-2 w-2 shrink-0"
            style={{ backgroundColor: era.accent }}
          />
          <p className="max-w-md text-base leading-relaxed" style={{ opacity: 0.85 }}>
            {era.copy}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- TimelineNode */
function TimelineNode({
  era,
  i,
  active,
  onSelect,
}: {
  era: Era;
  i: number;
  active: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(i)}
        data-cursor="VIEW"
        aria-current={active ? "true" : undefined}
        className="group flex w-full items-start gap-4 py-1 text-left"
      >
        <span
          aria-hidden
          className={cn(
            "mt-[6px] h-2.5 w-2.5 shrink-0 rounded-full border transition-colors duration-300",
            active
              ? "border-gold bg-gold"
              : "border-hairline-strong bg-ink group-hover:border-paper",
          )}
        />
        <span className="flex flex-col">
          <span
            className={cn(
              "font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors",
              active ? "text-gold" : "text-muted",
            )}
          >
            {era.index} · {era.years}
          </span>
          <span
            className={cn(
              "font-display text-lg leading-tight transition-colors sm:text-xl",
              active ? "text-paper" : "text-muted group-hover:text-paper/80",
            )}
          >
            {era.name}
          </span>
        </span>
      </button>
    </li>
  );
}

/* ------------------------------------------------------------ StickyTimeline */
function StickyTimeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  });

  const stops = ERAS.map((_, i) => i / (N - 1));
  const bg = useTransform(progress, stops, ERAS.map((e) => e.bg));
  const accent = useTransform(progress, stops, ERAS.map((e) => e.accent));
  const railTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  const [active, setActive] = React.useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    const idx = Math.max(0, Math.min(N - 1, Math.round(v * (N - 1))));
    setActive((p) => (p === idx ? p : idx));
  });

  const goTo = React.useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const dist = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (N - 1)) * dist, behavior: "smooth" });
  }, []);

  return (
    <div ref={ref} style={{ height: `${N * 100}vh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ backgroundColor: bg }} />

        {/* active counter, top-right */}
        <div className="absolute right-8 top-8 z-20 flex items-baseline gap-1 md:right-12">
          <motion.span
            className="font-display text-2xl leading-none"
            style={{ color: accent }}
          >
            {pad(active + 1)}
          </motion.span>
          <span className="font-mono text-xs tracking-[0.2em] text-muted">
            / {pad(N)}
          </span>
        </div>

        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-[minmax(15rem,32%)_1fr] items-center gap-10 px-6 sm:px-12 md:px-20">
          {/* LEFT — persistent timeline index */}
          <nav aria-label="Eras timeline" className="flex flex-col">
            <span className="label mb-8 text-gold">SELECT AN ERA</span>
            <div className="relative pl-1">
              <div className="absolute left-[4px] top-2 bottom-2 w-px bg-hairline-strong" />
              <motion.span
                aria-hidden
                className="absolute left-[1px] h-2 w-2 rounded-full"
                style={{ top: railTop, backgroundColor: accent }}
              />
              <ul className="flex flex-col gap-6">
                {ERAS.map((era, i) => (
                  <TimelineNode
                    key={era.id}
                    era={era}
                    i={i}
                    active={i === active}
                    onSelect={goTo}
                  />
                ))}
              </ul>
            </div>
          </nav>

          {/* RIGHT — vertically transitioning detail */}
          <div className="relative h-[60vh]">
            {ERAS.map((era, i) => (
              <EraPanel
                key={era.id}
                era={era}
                i={i}
                progress={progress}
                active={i === active}
              />
            ))}
          </div>
        </div>

        <div className="sr-only" aria-live="polite">
          {ERAS[active].name}, {ERAS[active].years}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- Stacked
 * Mobile / reduced-motion fallback — vertically stacked chapters.
 */
function StackedChapter({ era }: { era: Era }) {
  return (
    <motion.section
      aria-label={`${era.name}, ${era.years}, ${era.place}`}
      className="relative flex min-h-[80svh] flex-col justify-center overflow-hidden px-5 py-16 sm:px-8"
      style={{ backgroundColor: era.bg, color: era.text }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none leading-none"
        style={{ color: era.accent, opacity: 0.08, fontSize: "clamp(12rem, 55vw, 22rem)" }}
      >
        {era.ghost}
      </span>

      <motion.div variants={fadeUp} className="relative z-10 mb-4">
        <span className="label" style={{ color: era.accent }}>
          {era.index} · {era.years} · {era.place} · {era.jersey}
        </span>
      </motion.div>

      <h3
        className="relative z-10 mb-5 font-display leading-[0.9]"
        style={{ fontSize: "clamp(2.25rem, 11vw, 3.75rem)" }}
      >
        <SplitText text={era.name} />
      </h3>

      <motion.div variants={fadeUp} className="relative z-10 mb-5 flex items-baseline gap-3">
        <span
          className="font-display leading-none"
          style={{ fontSize: "clamp(2.5rem, 13vw, 4rem)", color: era.accent }}
        >
          {era.stat}
        </span>
        <span className="label max-w-[7rem]" style={{ opacity: 0.85 }}>
          {era.statLabel}
        </span>
      </motion.div>

      <motion.div variants={fadeUp} className="relative z-10 flex gap-3">
        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0" style={{ backgroundColor: era.accent }} />
        <p className="max-w-lg text-base leading-relaxed" style={{ opacity: 0.85 }}>
          {era.copy}
        </p>
      </motion.div>
    </motion.section>
  );
}

/* --------------------------------------------------------------------- Root */
export function ErasTunnel() {
  const reduce = usePrefersReducedMotion();

  return (
    <section id="eras" aria-labelledby="eras-heading" className="relative bg-ink">
      <div className="px-5 py-20 sm:px-8 sm:py-24 md:px-12">
        <SectionLabel className="mb-10">02 — THE ERAS</SectionLabel>
        <h2
          id="eras-heading"
          className="max-w-4xl font-display leading-[0.86]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          <SplitText text="SIX CHAPTERS," className="text-paper" />
          <br />
          <SplitText
            text="ONE PURSUIT"
            className="type-outline [--stroke-c:var(--gold)] [--stroke-w:1.5px]"
            delay={0.1}
          />
        </h2>
        <motion.p
          className="mt-6 max-w-md text-sm text-muted"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          From an Akron gym to three franchises and two decades in national
          colours — walk the index, or let it scroll.
        </motion.p>
      </div>

      {reduce ? (
        <div>
          {ERAS.map((era) => (
            <StackedChapter key={era.id} era={era} />
          ))}
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <StickyTimeline />
          </div>
          <div className="lg:hidden">
            {ERAS.map((era) => (
              <StackedChapter key={era.id} era={era} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
