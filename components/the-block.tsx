"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { THE_BLOCK, type BlockKeyframe } from "@/lib/lebron-data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Caption, PaintRule, RiseWords } from "@/components/typeset";

/**
 * Interpolate linear progress between two keyframes based on current time t.
 */
function interpolate(
  t: number,
  kfs: readonly BlockKeyframe[],
) {
  if (t <= kfs[0].time) {
    return {
      lebron: kfs[0].lebron,
      iguodala: kfs[0].iguodala,
      jrSmith: kfs[0].jrSmith,
      ball: kfs[0].ball,
      keyframe: kfs[0],
    };
  }
  if (t >= kfs[kfs.length - 1].time) {
    const last = kfs[kfs.length - 1];
    return {
      lebron: last.lebron,
      iguodala: last.iguodala,
      jrSmith: last.jrSmith,
      ball: last.ball,
      keyframe: last,
    };
  }

  // Find surrounding keyframes
  let idx = 0;
  while (idx < kfs.length - 1 && kfs[idx + 1].time < t) {
    idx++;
  }
  const k0 = kfs[idx];
  const k1 = kfs[idx + 1];
  const ratio = (t - k0.time) / (k1.time - k0.time);

  return {
    lebron: {
      x: k0.lebron.x + (k1.lebron.x - k0.lebron.x) * ratio,
      y: k0.lebron.y + (k1.lebron.y - k0.lebron.y) * ratio,
      elevation:
        k0.lebron.elevation +
        (k1.lebron.elevation - k0.lebron.elevation) * ratio,
    },
    iguodala: {
      x: k0.iguodala.x + (k1.iguodala.x - k0.iguodala.x) * ratio,
      y: k0.iguodala.y + (k1.iguodala.y - k0.iguodala.y) * ratio,
    },
    jrSmith: {
      x: k0.jrSmith.x + (k1.jrSmith.x - k0.jrSmith.x) * ratio,
      y: k0.jrSmith.y + (k1.jrSmith.y - k0.jrSmith.y) * ratio,
    },
    ball: {
      x: k0.ball.x + (k1.ball.x - k0.ball.x) * ratio,
      y: k0.ball.y + (k1.ball.y - k0.ball.y) * ratio,
    },
    keyframe: ratio >= 0.5 ? k1 : k0,
  };
}

export function TheBlock() {
  const [time, setTime] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const requestRef = React.useRef<number | null>(null);
  const prevTimeRef = React.useRef<number | null>(null);

  const keyframes = THE_BLOCK.keyframes;
  const current = interpolate(time, keyframes);

  // Animation loop for playback
  React.useEffect(() => {
    if (!playing) {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      prevTimeRef.current = null;
      return;
    }

    const animate = (now: number) => {
      if (prevTimeRef.current !== null) {
        const deltaSec = (now - prevTimeRef.current) / 1000;
        setTime((prev) => {
          const next = prev + deltaSec * 0.75; // 0.75x speed for cinematic clarity
          if (next >= THE_BLOCK.duration) {
            setPlaying(false);
            return THE_BLOCK.duration;
          }
          return next;
        });
      }
      prevTimeRef.current = now;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [playing]);

  const togglePlay = () => {
    if (time >= THE_BLOCK.duration) {
      setTime(0);
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
  };

  const isImpact = time >= 2.72;

  return (
    <section
      id="the-block"
      aria-labelledby="the-block-heading"
      className="on-paint relative bg-wine px-5 py-20 text-chalk sm:px-8 sm:py-28 md:px-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4">
          <Caption bold className="text-gold tracking-widest uppercase">
            {THE_BLOCK.subheading}
          </Caption>
          <h2
            id="the-block-heading"
            className="monument text-chalk"
            style={{ fontSize: "clamp(3rem, 11vw, 8rem)" }}
          >
            <RiseWords text={THE_BLOCK.heading} />
          </h2>
          <motion.p
            className="prose-copy max-w-[48ch] text-[1.0625rem] sm:text-lg"
            style={{ color: "var(--chalk-dim)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_SOON}
            transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.2 }}
          >
            {THE_BLOCK.copy}
          </motion.p>
        </div>

        {/* --- Telemetry Banner --- */}
        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-rule-chalk py-6 sm:grid-cols-4">
          {THE_BLOCK.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="figure text-[2.25rem] text-gold sm:text-[3rem]">
                {s.value}
              </span>
              <Caption style={{ color: "var(--chalk-dim)" }}>
                {s.label}
              </Caption>
            </div>
          ))}
        </div>

        {/* --- Interactive Court & Controls Grid --- */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* THE COURT SCHEMATIC */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-wine-deep border border-rule-chalk shadow-inner sm:aspect-[1/1]">
            <svg
              className="absolute inset-0 h-full w-full select-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Court Boundary Lines */}
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill="none"
                stroke="rgba(251,247,239,0.25)"
                strokeWidth="1"
              />
              {/* Half-court line */}
              <line
                x1="0"
                y1="4"
                x2="100"
                y2="4"
                stroke="rgba(251,247,239,0.35)"
                strokeWidth="0.75"
              />
              {/* Center Circle */}
              <path
                d="M 40 4 A 10 10 0 0 0 60 4"
                fill="none"
                stroke="rgba(251,247,239,0.25)"
                strokeWidth="0.6"
              />

              {/* Painted Key */}
              <rect
                x="34"
                y="66"
                width="32"
                height="26"
                fill="rgba(90,22,38,0.4)"
                stroke="rgba(251,247,239,0.35)"
                strokeWidth="0.75"
              />
              {/* Free-throw circle */}
              <circle
                cx="50"
                cy="66"
                r="12"
                fill="none"
                stroke="rgba(251,247,239,0.3)"
                strokeWidth="0.6"
              />

              {/* Three-Point Line */}
              <path
                d="M 8 92 L 8 68 A 42 42 0 0 1 92 68 L 92 92"
                fill="none"
                stroke="rgba(251,247,239,0.35)"
                strokeWidth="0.75"
              />

              {/* Backboard & Rim */}
              <line
                x1="44"
                y1="89"
                x2="56"
                y2="89"
                stroke="var(--chalk)"
                strokeWidth="1.5"
              />
              <circle
                cx="50"
                cy="86.5"
                r="3"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="1"
              />

              {/* Sprint Trajectory Trails */}
              {/* LeBron's Trail */}
              <path
                d="M 38 8 Q 44 48 50 87.5"
                fill="none"
                stroke="var(--gold)"
                strokeWidth="1.2"
                strokeDasharray="2 3"
                opacity="0.65"
              />
              {/* Iguodala's Trail */}
              <path
                d="M 42 16 Q 46 56 49 87.5"
                fill="none"
                stroke="rgba(251,247,239,0.4)"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.5"
              />
            </svg>

            {/* Impact Shockwave Ring on Backboard */}
            <AnimatePresence>
              {isImpact && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 2.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="pointer-events-none absolute left-[50%] top-[87.5%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold"
                />
              )}
            </AnimatePresence>

            {/* --- Player Tokens on Floor --- */}
            {/* JR Smith (No. 5) */}
            <div
              className="pointer-events-none absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-chalk/40 bg-wine/90 text-[0.6875rem] font-bold text-chalk transition-transform"
              style={{
                left: `${current.jrSmith.x}%`,
                top: `${current.jrSmith.y}%`,
              }}
              title="JR Smith (Contesting)"
            >
              5
            </div>

            {/* Andre Iguodala (No. 9) */}
            <div
              className="pointer-events-none absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-chalk/60 bg-wine-deep text-[0.75rem] font-bold text-chalk/90 transition-transform"
              style={{
                left: `${current.iguodala.x}%`,
                top: `${current.iguodala.y}%`,
              }}
              title="Andre Iguodala (Transition Layup)"
            >
              9
            </div>

            {/* LeBron James (No. 23) — Scales up slightly with elevation */}
            <motion.div
              className="pointer-events-none absolute z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-wine text-[0.8125rem] font-black text-gold shadow-lg"
              style={{
                left: `${current.lebron.x}%`,
                top: `${current.lebron.y}%`,
                scale: 1 + current.lebron.elevation * 0.12,
                boxShadow:
                  current.lebron.elevation > 0
                    ? `0 ${current.lebron.elevation * 6}px 14px rgba(0,0,0,0.6)`
                    : "none",
              }}
              title="LeBron James (Chase-down sprint)"
            >
              23
            </motion.div>

            {/* The Ball */}
            <div
              className="pointer-events-none absolute z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-leather shadow-sm"
              style={{
                left: `${current.ball.x}%`,
                top: `${current.ball.y}%`,
              }}
            />

            {/* Rejection Stamp at t = 2.8s */}
            <AnimatePresence>
              {isImpact && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4"
                >
                  <span className="monument bg-gold px-4 py-1.5 text-center text-[1.25rem] text-wine-deep shadow-xl sm:text-[1.75rem]">
                    BLOCKED BY JAMES!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CONTROLS & TELEMETRY HUD */}
          <div className="flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              <PaintRule color="var(--rule-chalk)" />

              {/* Scrubber Controls */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Caption bold className="text-gold uppercase tracking-wider">
                    Chalkboard Playback
                  </Caption>
                  <span className="figure text-[1.5rem] text-chalk">
                    {time.toFixed(2)}s / {THE_BLOCK.duration.toFixed(2)}s
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={THE_BLOCK.duration}
                  step="0.02"
                  value={time}
                  onChange={(e) => {
                    setPlaying(false);
                    setTime(parseFloat(e.target.value));
                  }}
                  aria-label="Play timeline scrubber"
                  className="h-2 w-full cursor-pointer accent-gold outline-none"
                />

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="narrow-bold flex items-center gap-2 border border-gold bg-wine px-4 py-2 text-[0.875rem] text-gold transition-colors hover:bg-gold hover:text-wine-deep"
                  >
                    {playing
                      ? "Pause"
                      : time >= THE_BLOCK.duration
                      ? "Replay"
                      : "Play Reenactment"}
                  </button>

                  {keyframes.map((k) => (
                    <button
                      key={k.time}
                      type="button"
                      onClick={() => {
                        setPlaying(false);
                        setTime(k.time);
                      }}
                      className={cn(
                        "narrow border px-2.5 py-1.5 text-[0.75rem] transition-colors",
                        Math.abs(time - k.time) < 0.2
                          ? "border-gold bg-gold/20 text-gold"
                          : "border-rule-chalk text-chalk/70 hover:text-chalk",
                      )}
                    >
                      {k.time.toFixed(1)}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Telemetry Meters */}
              <div className="grid grid-cols-3 gap-4 border-t border-rule-chalk pt-5">
                <div className="flex flex-col gap-1">
                  <Caption style={{ color: "var(--chalk-dim)" }}>
                    Sprint Speed
                  </Caption>
                  <span className="figure text-[1.75rem] text-chalk">
                    {current.keyframe.telemetry.speed}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <Caption style={{ color: "var(--chalk-dim)" }}>
                    Distance To Glass
                  </Caption>
                  <span className="figure text-[1.75rem] text-chalk">
                    {current.keyframe.telemetry.distance}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <Caption style={{ color: "var(--chalk-dim)" }}>
                    Elevation
                  </Caption>
                  <span className="figure text-[1.75rem] text-gold">
                    {current.keyframe.telemetry.elevation}
                  </span>
                </div>
              </div>

              {/* Annotation Log */}
              <div className="min-h-[5rem] rounded-none border-l-2 border-gold pl-4 pt-1">
                <Caption bold className="text-gold">
                  Momentum
                </Caption>
                <p
                  className="prose-copy mt-1 text-[0.9375rem]"
                  style={{ color: "var(--chalk-dim)" }}
                >
                  {current.keyframe.annotation}
                </p>
              </div>
            </div>

            {/* Historic Commentary Quote */}
            <div className="border-t border-rule-chalk pt-6">
              <blockquote className="prose-copy italic text-[1.0625rem] text-chalk">
                {THE_BLOCK.quote}
              </blockquote>
              <Caption className="mt-3 block text-gold">
                — {THE_BLOCK.caller}
              </Caption>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
