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

import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionLabel, SplitText } from "@/components/kinetic";
import { useSound } from "@/components/sound-provider";

/* Court coordinate model, in percentages of the court box. */
const ORIGIN = { x: 50, y: 90 };
const HOOP = { x: 50, y: 22 };
const BAND = { center: 74, half: 11 }; // sweet-spot power window (63–85)
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

function StatReadout({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="label text-muted">{label}</span>
      <div className="relative h-12 w-full overflow-hidden text-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className={cn(
              "font-display absolute inset-0 flex items-center justify-center text-4xl leading-none tnum sm:text-5xl",
              accent ? "text-gold-bright" : "text-paper",
            )}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ShotChallenge() {
  const reduce = useReducedMotion();
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
        animate(ballScale, [1, 1.18, 1], { duration: 0.5, ease: EASE_OUT });
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
    if (made) label = (streakRef.current + 1) % 3 === 0 ? "ON FIRE" : "BUCKET";
    else if (!aimGood) label = a < 0 ? "OFF LEFT" : "OFF RIGHT";
    else if (p < BAND.center) label = "SHORT";
    else label = "LONG";

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
      id="challenge"
      aria-labelledby="challenge-heading"
      className="relative border-t border-hairline bg-ink px-5 py-20 sm:px-8 sm:py-28 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel className="mb-10">05 — INTERACTIVE</SectionLabel>
        <h2
          id="challenge-heading"
          className="mb-4 max-w-4xl font-display leading-[0.86]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          <SplitText text="TAKE THE" className="text-paper" />{" "}
          <SplitText
            text="LAST SHOT"
            className="type-outline [--stroke-c:var(--red)] [--stroke-w:1.5px]"
            delay={0.1}
          />
        </h2>
        <p className="mb-12 max-w-lg text-sm text-muted">
          Time the meter into the gold band and keep your aim centred. Three in
          a row and you are on fire.
        </p>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* COURT */}
          <div
            ref={courtRef}
            role="group"
            aria-label="Shot challenge court. Use left and right arrows to aim, space or enter to shoot."
            tabIndex={0}
            onPointerMove={handlePointer}
            onPointerDown={handlePointer}
            onClick={() => shoot()}
            onKeyDown={handleKeyDown}
            className="relative aspect-[4/5] w-full select-none overflow-hidden border border-hairline bg-wine/20 outline-offset-4 sm:aspect-[5/4]"
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line x1="0" y1="90" x2="100" y2="90" stroke="var(--hairline)" strokeWidth="0.4" />
              <ellipse cx="50" cy="90" rx="30" ry="6" fill="none" stroke="var(--hairline)" strokeWidth="0.4" />
              <line x1="50" y1="90" x2="50" y2="96" stroke="var(--hairline)" strokeWidth="0.4" />
            </svg>

            {/* backboard + rim + net */}
            <div className="pointer-events-none absolute left-1/2 top-[14%] -translate-x-1/2">
              <div className="mx-auto h-10 w-24 border border-hairline-strong sm:h-12 sm:w-28" />
              <div className="mx-auto -mt-1 h-3 w-8 border-x border-b border-gold" aria-hidden />
              <motion.div
                aria-hidden
                className="mx-auto h-4 w-8 origin-top"
                style={{
                  background:
                    "repeating-linear-gradient(var(--hairline) 0 1px, transparent 1px 3px)",
                }}
                animate={result?.made ? { scaleY: [1, 1.4, 1], skewX: [0, 4, 0] } : {}}
                transition={{ duration: 0.5 }}
              />
              <div className="mx-auto -mt-4 h-2 w-9 rounded-[50%] border-2 border-gold" />
            </div>

            {/* aim indicator */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-[8%] w-px"
              style={{
                left: aimLeft,
                height: "62%",
                background:
                  "repeating-linear-gradient(to top, var(--hairline-strong) 0 4px, transparent 4px 9px)",
                transform: "translateX(-50%)",
              }}
            />

            {/* ball */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-orange sm:h-10 sm:w-10"
              style={{
                left: ballLeft,
                top: ballTop,
                x: "-50%",
                y: "-50%",
                rotate: ballRotate,
                scale: ballScale,
              }}
            >
              <span className="block h-full w-px bg-ink/70" />
              <span className="absolute h-px w-full bg-ink/70" />
            </motion.div>

            {/* result flash */}
            <AnimatePresence>
              {result ? (
                <motion.div
                  key={`flash-${result.id}`}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                  className="pointer-events-none absolute inset-x-0 top-[40%] flex justify-center"
                >
                  <span
                    className={cn(
                      "font-display text-4xl uppercase tracking-tight sm:text-5xl",
                      result.made ? "text-gold-bright" : "text-red",
                    )}
                  >
                    {result.label}
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* made celebration ring */}
            <AnimatePresence>
              {result?.made ? (
                <motion.div
                  key={`ring-${result.id}`}
                  className="pointer-events-none absolute left-1/2 top-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-bright"
                  initial={{ width: 10, height: 10, opacity: 0.9 }}
                  animate={{ width: 160, height: 160, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE_OUT }}
                />
              ) : null}
            </AnimatePresence>
          </div>

          {/* CONTROLS */}
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-3 gap-3 border border-hairline p-5">
              <StatReadout label="SCORE" value={display.score} accent />
              <StatReadout label="STREAK" value={display.streak} />
              <StatReadout label="BEST" value={best} />
            </div>

            <div className="flex items-stretch gap-6">
              <div
                className="relative h-56 w-8 shrink-0 overflow-hidden border border-hairline bg-ink"
                aria-hidden
              >
                <div
                  className="absolute inset-x-0 border-y border-gold/50 bg-gold/15"
                  style={{
                    bottom: `${BAND.center - BAND.half}%`,
                    height: `${BAND.half * 2}%`,
                  }}
                />
                <motion.div
                  className="absolute inset-x-0 h-[3px] bg-gold-bright"
                  style={{ bottom: markerBottom }}
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <span className="label text-muted">POWER METER</span>
                  <p className="mt-2 text-sm text-muted">
                    Release inside the gold band. Too low falls short, too high
                    runs long.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => shoot()}
                  data-cursor="SHOOT"
                  disabled={phase !== "ready"}
                  className="h-16 w-full border border-gold bg-gold font-mono text-sm uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-bright disabled:opacity-40"
                >
                  {phase === "ready" ? "Shoot" : "…"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4">
              <span className="label text-muted">SPACE / ENTER — SHOOT</span>
              <span className="label text-muted">← → — AIM</span>
              <span className="label text-muted">CLICK / TAP — SHOOT</span>
            </div>
          </div>
        </div>

        <div aria-live="polite" className="sr-only">
          {announce}
        </div>
      </div>
    </section>
  );
}
