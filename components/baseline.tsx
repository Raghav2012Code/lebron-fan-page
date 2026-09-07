"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { BASELINE, SECTIONS, STATS_AS_OF } from "@/lib/lebron-data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { Caption, PaintRule, RiseLine } from "@/components/typeset";

/**
 * The baseline. The page ends where the floor does: one painted line, the
 * index, and the small print. No giant ghost numeral behind it — that belongs
 * to the twenty-three section, and repeating it would cheapen both.
 */
export function Baseline() {
  return (
    <footer className="on-paint relative bg-wine-deep px-5 pb-12 pt-20 text-chalk sm:px-8 sm:pt-24 md:px-14">
      <div className="mx-auto max-w-6xl">
        <h2
          className="monument text-chalk"
          style={{ fontSize: "clamp(2.5rem, 10vw, 8rem)" }}
        >
          <RiseLine>{BASELINE.closing}</RiseLine>
        </h2>

        <div className="mt-16">
          <PaintRule color="var(--rule-chalk)" />
          <motion.nav
            aria-label="Sections"
            className="flex flex-wrap gap-x-8 gap-y-2 pt-6"
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT_SOON}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {SECTIONS.map((s) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                className="narrow-bold text-[0.875rem] text-chalk/70 outline-offset-4 transition-colors hover:text-gold"
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.45, ease: EASE_SETTLE },
                  },
                }}
              >
                {s.label}
              </motion.a>
            ))}
          </motion.nav>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-rule-chalk pt-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Caption bold className="text-gold">
              {BASELINE.disclaimerTitle}
            </Caption>
            <p
              className="prose-copy max-w-[42ch] text-[0.9375rem]"
              style={{ color: "var(--chalk-dim)" }}
            >
              {BASELINE.disclaimer}
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {BASELINE.credits.map((c) => (
              <li key={c}>
                <Caption style={{ color: "var(--chalk-dim)" }}>{c}</Caption>
              </li>
            ))}
            <li>
              <Caption style={{ color: "var(--chalk-dim)" }}>
                Figures as of {STATS_AS_OF}
              </Caption>
            </li>
          </ul>

          <ul className="flex flex-col gap-2 md:items-end">
            {BASELINE.identity.map((line) => (
              <li key={line}>
                <Caption className="text-chalk">{line}</Caption>
              </li>
            ))}
            <li>
              <Caption style={{ color: "var(--chalk-dim)" }}>
                {new Date().getFullYear()}, a fan tribute
              </Caption>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
