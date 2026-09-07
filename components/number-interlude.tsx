"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { NUMBER_SECTION } from "@/lib/lebron-data";
import { EASE_OUT } from "@/lib/motion";

function CircularText({ text }: { text: string }) {
  const ring = text.repeat(2);
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="h-32 w-32 sm:h-44 sm:w-44"
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: 26 }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <defs>
        <path
          id="ring-path"
          d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0"
          fill="none"
        />
      </defs>
      <text
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          letterSpacing: "0.32em",
          fill: "var(--ink)",
          textTransform: "uppercase",
        }}
      >
        <textPath href="#ring-path" startOffset="0">
          {ring}
        </textPath>
      </text>
      {/* center dot */}
      <circle cx="100" cy="100" r="4" fill="var(--ink)" />
    </motion.svg>
  );
}

export function NumberInterlude() {
  const ref = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const tracking = useTransform(scrollYProgress, [0, 1], ["-0.01em", "0.06em"]);
  const numeralY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const numeralOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.08, 0.16, 0.08]);
  const wordX = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={ref}
      id="number"
      aria-labelledby="number-heading"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-clip bg-gold-bright px-5 py-14 text-ink sm:px-8 sm:py-16 md:px-12"
    >
      {/* giant ghost numeral */}
      <motion.span
        aria-hidden
        className="font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none leading-none text-ink"
        style={{ y: numeralY, opacity: numeralOpacity, fontSize: "clamp(26rem, 70vw, 60rem)" }}
      >
        {NUMBER_SECTION.numeral}
      </motion.span>

      {/* top row */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.28em] text-ink">
            04 — THE NUMBER
          </span>
          <span className="hidden h-px w-24 bg-ink/40 sm:block" />
        </div>
        <CircularText text={NUMBER_SECTION.ring} />
      </div>

      {/* headline */}
      <h2 id="number-heading" className="relative z-10 my-8">
        <span className="sr-only">Twenty-three</span>
        <motion.span
          aria-hidden
          className="font-display block leading-[0.82]"
          style={{ letterSpacing: tracking, x: wordX, fontSize: "clamp(4.5rem, 24vw, 22rem)" }}
        >
          {/* Observer sits on the unclipped mask wrapper; the child animates
              via variants so the clip never suppresses the trigger. */}
          <motion.span
            className="block overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: {} }}
          >
            <motion.span
              className="block will-change-transform"
              variants={{
                hidden: { y: "110%" },
                show: { y: "0%", transition: { duration: 0.9, ease: EASE_OUT } },
              }}
            >
              TWENTY
            </motion.span>
          </motion.span>
          <motion.span
            className="block overflow-hidden"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: {} }}
          >
            <motion.span
              className="type-outline block will-change-transform"
              style={{
                ["--stroke-c" as string]: "var(--ink)",
                ["--stroke-w" as string]: "clamp(1px,0.35vw,3px)",
              }}
              variants={{
                hidden: { y: "110%" },
                show: {
                  y: "0%",
                  transition: { duration: 0.9, ease: EASE_OUT, delay: 0.12 },
                },
              }}
            >
              THREE
            </motion.span>
          </motion.span>
        </motion.span>
      </h2>

      {/* bottom paragraphs */}
      <div className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
        {NUMBER_SECTION.paragraphs.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.1 }}
          >
            <div className="mb-3 h-px w-full bg-ink/30" />
            <p className="max-w-md text-sm leading-relaxed text-ink/80 sm:text-base">
              {p}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
