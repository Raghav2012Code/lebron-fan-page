"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { FOOTER, STATS_AS_OF, SECTIONS } from "@/lib/lebron-data";
import { fadeUp, makeStagger, VIEWPORT } from "@/lib/motion";
import { MaskReveal } from "@/components/kinetic";

export function SiteFooter() {
  return (
    <footer className="relative overflow-clip border-t border-hairline bg-ink px-5 pb-10 pt-24 sm:px-8 md:px-12">
      {/* huge low-opacity numeral */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 select-none leading-none text-paper/[0.03]"
        style={{ fontSize: "clamp(18rem, 55vw, 44rem)" }}
      >
        {FOOTER.ghost}
      </span>

      <motion.div
        className="relative z-10 mx-auto max-w-7xl"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={makeStagger(0.1)}
      >
        {/* section index */}
        <motion.nav
          variants={fadeUp}
          aria-label="Sections"
          className="mb-16 flex flex-wrap gap-x-8 gap-y-3 border-b border-hairline pb-8"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-cursor="JUMP"
              className="label text-muted transition-colors hover:text-gold"
            >
              {s.label}
            </a>
          ))}
        </motion.nav>

        <motion.h2
          variants={fadeUp}
          className="mb-10 font-display leading-[0.86] text-paper"
          style={{ fontSize: "clamp(3rem, 12vw, 11rem)" }}
        >
          <MaskReveal>{FOOTER.closing}</MaskReveal>
        </motion.h2>

        <div className="grid grid-cols-1 gap-8 border-t border-hairline pt-8 md:grid-cols-3">
          <motion.div variants={fadeUp} className="flex flex-col gap-3">
            <span className="label text-gold">{FOOTER.disclaimerTitle}</span>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {FOOTER.disclaimer}
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-2">
            {FOOTER.credits.map((c) => (
              <span key={c} className="label text-muted">
                {c}
              </span>
            ))}
            <span className="label text-muted">STATS AS OF — {STATS_AS_OF}</span>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-2 md:items-end">
            <span className="label text-paper">THE KING · №23</span>
            <span className="label text-muted">AKRON, OHIO · BORN 1984</span>
            <span className="label text-muted">
              © {new Date().getFullYear()} — FAN TRIBUTE
            </span>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}
