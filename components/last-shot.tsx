"use client";

import * as React from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

import { SHOT } from "@/lib/lebron-data";
import { EASE_PAINT, EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { Caption, PaintRule, RiseWords } from "@/components/typeset";
import { SoundToggle } from "@/components/sound-toggle";
import { useSound } from "@/components/sound-provider";

/* Court coordinate model, in percentages of the court box. */
const ORIGIN = { x: 50, y: 90 };
const HOOP = { x: 50, y: 22 };
const BAND = { center: 74, half: 11 }; // sweet-spot power window (63-85)
const AIM_TOL = 0.42; // |aim| within this counts as on-target
const STORAGE_KEY = "king23:shot";
const BEST_EVENT = "king23:shot-best";

type Phase = "ready" | "flying";

/* Persisted personal best, read SSR-safe via useSyncExternalStore. */
function readBest() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as { best?: number };
    return typeof parsed.best === "number" ? parsed.best : 0;
  } catch {
    return 0;
  }
}
function subscribeBest(cb: () => void) {
  window.addEventListener(BEST_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(BEST_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

function Readout({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Caption className="text-muted">{label}</Caption>
      <div className="relative h-12 w-full overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_SETTLE }}
            className={cn(
              "figure absolute inset-0 flex items-center text-[2.5rem] sm:text-[3rem]",
              accent ? "text-leather" : "text-wine",
            )}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function LastShot() {
  const reduce = useReducedMotion();
  // Structural branching needs the SSR-safe hook: framer's own reads the
  // media query during the first client render, which would render a
  // different tree than the server did.
  const reduceLayout = usePrefersReducedMotion();
  const { play } = useSound();

  const [phase, setPhase] = React.useState<Phase>("ready");
  const phaseRef = React.useRef<Phase>("ready");
  const setPhaseSync = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  // Session counters live in refs; a small display state drives the animated
  // readouts. Personal best is external (localStorage) state.
  const scoreRef = React.useRef(0);
  const streakRef = React.useRef(0);
  const attemptsRef = React.useRef(0);
  const [display, setDisplay] = React.useState({ score: 0, streak: 0 });
  const best = React.useSyncExternalStore(subscribeBest, readBest, () => 0);

  const [result, setResult] = React.useState<
    { made: boolean; label: string; id: number } | null
  >(null);
  const [announce, setAnnounce] = React.useState("");

  const courtRef = React.useRef<HTMLDivElement>(null);
  const timers = React.useRef<number[]>([]);
  const resultTimer = React.useRef<number | null>(null);

  // Motion values
  const power = useMotionValue(0);
  const dir = React.useRef(1);
  const aim = useMotionValue(0);
  const ballX = useMotionValue(ORIGIN.x);
  const ballY = useMotionValue(ORIGIN.y);
  const ballRotate = useMotionValue(0);
  const ballScale = useMotionValue(1);

  const markerBottom = useTransform(power, (v) => `${v}%`);
  const aimLeft = useTransform(aim, (v) => `${50 + v * 34}%`);
  const ballLeft = useTransform(ballX, (v) => `${v}%`);
  const ballTop = useTransform(ballY, (v) => `${v}%`);

  React.useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  // Oscillate the power meter while ready
  useAnimationFrame((_, delta) => {
    if (phaseRef.current !== "ready") return;
    const speed = 0.075; // %/ms
    let v = power.get() + dir.current * speed * delta;
    if (v >= 100) {
      v = 100;
      dir.current = -1;
    } else if (v <= 0) {
      v = 0;
      dir.current = 1;
    }
    power.set(v);
  });

  const finish = React.useCallback(
    (made: boolean, label: string) => {
      attemptsRef.current += 1;
      if (made) {
        scoreRef.current += 1;
        streakRef.current += 1;
      } else {
        streakRef.current = 0;
      }
      const score = scoreRef.current;
      const streak = streakRef.current;
      const shotId = attemptsRef.current;

      // persist a new personal best
      if (streak > readBest()) {
        try {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ best: streak }),
          );
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new Event(BEST_EVENT));
      }

      setDisplay({ score, streak });
      setResult({ made, label, id: shotId });
      setAnnounce(
        made
          ? `${label}. Score ${score}, streak ${streak}.`
          : `${label}. Streak reset. Score ${score}.`,
      );

      if (made) {
        animate(ballScale, [1, 1.18, 1], { duration: 0.5, ease: EASE_SETTLE });
        play(streak % 3 === 0 ? "streak" : "made");
      } else {
        play("miss");
      }

      const t1 = window.setTimeout(() => {
        ballX.set(ORIGIN.x);
        ballY.set(ORIGIN.y);
        ballRotate.set(0);
        setPhaseSync("ready");
      }, 900);

      // A previous shot's own result-clear timer would otherwise fire on
      // this shot's schedule and wipe its result early (reachable once
      // "ready" returns at 900ms, well before the prior 1500ms clear
      // fires). Cancel it and only clear if the id still matches this shot.
      if (resultTimer.current !== null) window.clearTimeout(resultTimer.current);
      const t2 = window.setTimeout(() => {
        setResult((r) => (r?.id === shotId ? null : r));
      }, 1500);
      resultTimer.current = t2;
      timers.current.push(t1, t2);
    },
    [ballRotate, ballScale, ballX, ballY, play],
  );

  const shoot = React.useCallback(() => {
    if (phaseRef.current !== "ready") return;
    const p = power.get();
    const a = aim.get();
    const powerGood = Math.abs(p - BAND.center) <= BAND.half;
    const aimGood = Math.abs(a) <= AIM_TOL;
    const made = powerGood && aimGood;

    let label: string;
    if (made) label = (streakRef.current + 1) % 3 === 0 ? "On fire" : "Bucket";
    else if (!aimGood) label = a < 0 ? "Off left" : "Off right";
    else if (p < BAND.center) label = "Short";
    else label = "Long";

    setPhaseSync("flying");
    const dur = reduce ? 0.35 : 0.9;

    if (made) {
      animate(ballX, [ORIGIN.x, HOOP.x + a * 6, HOOP.x], {
        duration: dur,
        ease: "easeOut",
      });
      animate(ballY, [ORIGIN.y, 6, HOOP.y], {
        duration: dur,
        times: [0, 0.55, 1],
        ease: "easeOut",
        onComplete: () => finish(true, label),
      });
    } else {
      let mx: number;
      let my: number;
      if (!aimGood) {
        mx = HOOP.x + a * 34;
        my = HOOP.y + 8;
      } else if (p < BAND.center) {
        mx = HOOP.x + a * 8;
        my = 48;
      } else {
        mx = HOOP.x + a * 8;
        my = 42;
      }
      animate(ballX, [ORIGIN.x, (ORIGIN.x + mx) / 2 + a * 10, mx], {
        duration: dur,
        ease: "easeOut",
      });
      animate(ballY, [ORIGIN.y, 8, my], {
        duration: dur,
        times: [0, 0.5, 1],
        ease: "easeOut",
        onComplete: () => finish(false, label),
      });
    }
    if (!reduce) {
      animate(ballRotate, ballRotate.get() + 720, {
        duration: dur,
        ease: "linear",
      });
    }
  }, [aim, ballRotate, ballX, ballY, finish, power, reduce]);

  const handlePointer = (e: React.PointerEvent) => {
    const el = courtRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    aim.set(Math.max(-1, Math.min(1, (rel - 0.5) * 2)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      aim.set(Math.max(-1, aim.get() - 0.12));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      aim.set(Math.min(1, aim.get() + 0.12));
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      shoot();
    }
  };

  return (
    <section
      id="shot"
      aria-labelledby="shot-heading"
      className="floor relative px-5 py-20 sm:px-8 sm:py-28 md:px-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2
            id="shot-heading"
            className="monument max-w-[12ch] text-wine"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            <RiseWords text={SHOT.heading} />
          </h2>
          <SoundToggle />
        </div>

        <motion.p
          className="prose-copy mt-6 max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT_SOON}
          transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.2 }}
        >
          {SHOT.copy}
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.45fr_1fr]">
          {/* THE COURT — chalk lines on painted floor. Revealed by pulling a
              maple cover off it rather than by transforming the panel itself,
              so the court markings never distort and the panel is the right
              size for pointer maths from the first frame. */}
          <div
            ref={courtRef}
            role="group"
            aria-label="Shot challenge court. Use left and right arrows to aim, space or enter to shoot."
            tabIndex={0}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onClick={() => shoot()}
            onKeyDown={handleKeyDown}
            className="on-paint relative aspect-[4/5] w-full select-none overflow-hidden bg-wine outline-offset-4 sm:aspect-[5/4]"
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {/* floor, key markings and the arc, seen from the wing */}
              <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(251,247,239,0.5)" strokeWidth="0.5" />
              <line x1="0" y1="96" x2="100" y2="96" stroke="rgba(251,247,239,0.32)" strokeWidth="0.3" />
              <ellipse cx="50" cy="90" rx="30" ry="6" fill="none" stroke="rgba(251,247,239,0.42)" strokeWidth="0.4" />
              <ellipse cx="50" cy="90" rx="13" ry="2.6" fill="none" stroke="rgba(251,247,239,0.42)" strokeWidth="0.4" />
              <line x1="50" y1="90" x2="50" y2="96" stroke="rgba(251,247,239,0.32)" strokeWidth="0.3" />
            </svg>

            {/* backboard, rim and net */}
            <div className="pointer-events-none absolute left-1/2 top-[14%] -translate-x-1/2">
              <div
                className="mx-auto h-10 w-24 border sm:h-12 sm:w-28"
                style={{ borderColor: "rgba(251,247,239,0.45)" }}
              />
              <div
                className="mx-auto -mt-1 h-3 w-8 border-x border-b"
                style={{ borderColor: "var(--gold)" }}
                aria-hidden
              />
              <motion.div
                aria-hidden
                className="mx-auto h-4 w-8 origin-top"
                style={{
                  background:
                    "repeating-linear-gradient(rgba(251,247,239,0.45) 0 1px, transparent 1px 3px)",
                }}
                animate={result?.made ? { scaleY: [1, 1.4, 1], skewX: [0, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
              />
              <div
                className="mx-auto -mt-4 h-2 w-9 rounded-[50%] border-2"
                style={{ borderColor: "var(--gold)" }}
              />
            </div>

            {/* aim line */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-[8%] w-px"
              style={{
                left: aimLeft,
                height: "62%",
                background:
                  "repeating-linear-gradient(to top, rgba(251,247,239,0.5) 0 4px, transparent 4px 9px)",
                transform: "translateX(-50%)",
              }}
            />

            {/* the ball */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute z-10 flex h-9 w-9 items-center justify-center rounded-full bg-leather sm:h-10 sm:w-10"
              style={{
                left: ballLeft,
                top: ballTop,
                x: "-50%",
                y: "-50%",
                rotate: ballRotate,
                scale: ballScale,
                boxShadow: "inset 0 0 0 2px rgba(56,12,22,0.55)",
              }}
            >
              <span className="block h-full w-px bg-wine-deep/70" />
              <span className="absolute h-px w-full bg-wine-deep/70" />
            </motion.div>

            {/* result, called out in chalk */}
            <AnimatePresence>
              {result ? (
                <motion.div
                  key={`flash-${result.id}`}
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.08 }}
                  transition={{ duration: 0.3, ease: EASE_SETTLE }}
                  className="pointer-events-none absolute inset-x-0 top-[40%] flex justify-center"
                >
                  <span
                    className={cn(
                      "headline text-[2.25rem] sm:text-[3rem]",
                      result.made ? "text-gold" : "text-chalk/70",
                    )}
                  >
                    {result.label}
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* made ring */}
            <AnimatePresence>
              {result?.made ? (
                <motion.div
                  key={`ring-${result.id}`}
                  className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
                  initial={{ width: 10, height: 10, opacity: 0.9 }}
                  animate={{ width: 170, height: 170, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_SETTLE }}
                />
              ) : null}
            </AnimatePresence>

            {/* The cover, pulled off to the right. Not rendered at all under
                reduced motion: a cover that depends on an animation running
                is a cover that can leave the court hidden. */}
            {reduceLayout ? null : (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 origin-right bg-maple"
                initial={{ scaleX: 1 }}
                whileInView={{ scaleX: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.95, ease: EASE_PAINT }}
              />
            )}
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col gap-9">
            <div>
              <PaintRule color="var(--rule-strong)" />
              <div className="grid grid-cols-3 gap-4 pt-4">
                <Readout label="Score" value={display.score} accent />
                <Readout label="Streak" value={display.streak} />
                <Readout label="Best streak" value={best} />
              </div>
            </div>

            <div className="flex items-stretch gap-6">
              {/* the release gauge */}
              <div
                className="relative h-56 w-9 shrink-0 overflow-hidden bg-maple-deep"
                aria-hidden
              >
                <div
                  className="absolute inset-x-0 bg-gold"
                  style={{
                    bottom: `${BAND.center - BAND.half}%`,
                    height: `${BAND.half * 2}%`,
                  }}
                />
                <motion.div
                  className="absolute inset-x-0 h-[3px] bg-wine"
                  style={{ bottom: markerBottom }}
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-5">
                <div>
                  <Caption bold className="text-wine">
                    Release
                  </Caption>
                  <p className="prose-copy mt-2 text-[0.9375rem] text-muted">
                    Let it go inside the gold. Too low and it falls short, too
                    high and it runs long.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => shoot()}
                  disabled={phase !== "ready"}
                  className="narrow-bold h-16 w-full bg-wine text-[1rem] text-chalk outline-offset-4 transition-colors hover:bg-wine-deep disabled:opacity-45"
                >
                  {phase === "ready" ? "Shoot" : "In the air"}
                </button>
              </div>
            </div>

            <div>
              <PaintRule />
              <dl className="flex flex-col gap-2 pt-4">
                {SHOT.keys.map((k) => (
                  <div key={k.key} className="flex items-baseline gap-4">
                    <dt className="w-[12rem] shrink-0">
                      <Caption className="text-muted">{k.key}</Caption>
                    </dt>
                    <dd>
                      <Caption bold className="text-wine">
                        {k.does}
                      </Caption>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {announce}
        </p>
      </div>
    </section>
  );
}
