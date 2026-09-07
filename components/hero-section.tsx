"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { HERO, MASTHEAD } from "@/lib/lebron-data";
import { EASE_OUT } from "@/lib/motion";
import { SoundToggle } from "@/components/sound-toggle";

/* Center-out staggered mask reveal for the primary word. */
function CenterOutWord({
  word,
  className,
  baseDelay,
  style,
}: {
  word: string;
  className?: string;
  baseDelay: number;
  style?: React.CSSProperties;
}) {
  const letters = Array.from(word);
  const mid = (letters.length - 1) / 2;
  return (
    <span aria-hidden className={className} style={style}>
      {letters.map((c, i) => (
        <span key={i} className="inline-flex overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.8,
              ease: EASE_OUT,
              delay: baseDelay + Math.abs(i - mid) * 0.06,
            }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function HeroSection() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const courtY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const courtScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const nameSize = { fontSize: "clamp(3rem, 15vw, 13rem)", lineHeight: 0.86 };

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-clip px-5 py-16 text-center"
    >
      {/* basketball-court geometry, drawn in */}
      <motion.svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        style={{ y: courtY, scale: courtScale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <motion.circle
          cx="500"
          cy="500"
          r="300"
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.28"
          strokeWidth="1.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, ease: EASE_OUT, delay: 0.3 }}
        />
        <motion.circle
          cx="500"
          cy="500"
          r="140"
          fill="none"
          stroke="var(--hairline-strong)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: EASE_OUT, delay: 0.5 }}
        />
        <motion.path
          d="M 60 940 A 700 700 0 0 1 940 940"
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: EASE_OUT, delay: 0.7 }}
        />
        <motion.line
          x1="0"
          y1="500"
          x2="1000"
          y2="500"
          stroke="var(--hairline)"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.9 }}
        />
      </motion.svg>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        style={{ y: contentY, opacity: contentOpacity, scale: contentScale }}
      >
        {/* eyebrow */}
        <motion.span
          className="label text-muted"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
        >
          {MASTHEAD.tributeLabel}
        </motion.span>

        <motion.span
          className="label mt-3 text-gold"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.3 }}
        >
          {MASTHEAD.place} · {MASTHEAD.born} · {MASTHEAD.number}
        </motion.span>

        {/* name monument */}
        <h1
          id="hero-title"
          aria-label="LeBron James"
          className="mt-5 flex flex-col items-center"
        >
          <CenterOutWord
            word={HERO.first}
            baseDelay={0.7}
            className="font-display flex justify-center text-paper"
            style={nameSize}
          />
          <span className="inline-flex overflow-hidden align-bottom">
            <motion.span
              aria-hidden
              className="font-display inline-block text-paper"
              style={nameSize}
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.15 }}
            >
              {HERO.last}
            </motion.span>
          </span>
        </h1>

        {/* drawn rule */}
        <motion.span
          aria-hidden
          className="mt-8 h-px w-[min(78vw,32rem)] origin-center bg-gold/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 1.5 }}
        />

        {/* tagline */}
        <motion.p
          className="mt-7 max-w-xl text-sm leading-relaxed text-muted sm:text-base"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 1.7 }}
        >
          {HERO.copy}
        </motion.p>

        {/* stat rail */}
        <motion.div
          className="mt-9 flex items-stretch gap-6 sm:gap-10"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 1.9 } } }}
        >
          {HERO.stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 ? (
                <motion.span
                  aria-hidden
                  className="w-px origin-top self-stretch bg-hairline-strong"
                  variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.5, ease: EASE_OUT } } }}
                />
              ) : null}
              <motion.div
                className="flex flex-col items-center gap-1"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
                }}
              >
                <span className="font-display text-3xl leading-none text-gold sm:text-4xl">
                  {s.value}
                </span>
                <span className="label text-muted">{s.label}</span>
              </motion.div>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.4 }}
      >
        <span className="label text-muted">{HERO.scrollCaption}</span>
        <motion.span
          aria-hidden
          className="block h-6 w-px bg-gold"
          animate={{ scaleY: [0.3, 1, 0.3], transformOrigin: ["top", "top", "top"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* sound control */}
      <motion.div
        className="absolute bottom-6 right-5 sm:right-8 md:right-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 2.5 }}
      >
        <SoundToggle />
      </motion.div>
    </section>
  );
}
