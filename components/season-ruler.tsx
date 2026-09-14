"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  SEASONS,
  SPAN,
  STATS_AS_OF,
  TEAM_SPANS,
  type Season,
} from "@/lib/lebron-data";
import { EASE_PAINT, EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Caption, PaintRule, RiseWords } from "@/components/typeset";

/**
 * The span. Twenty-three seasons on one line, with every championship, MVP and
 * Olympic summer marked in place.
 *
 * This replaces the scrolling marquee the site used to open with. A marquee
 * says nothing; the ruler is the argument of the whole page — the career is
 * long, and here is exactly how long — and it doubles as the map for
 * everything below it.
 */

function honoursFor(season: Season): string[] {
  const out: string[] = [];
  if (season.title) out.push("NBA champion");
  if (season.mvp) out.push("Regular-season MVP");
  if (season.olympic)
    out.push(`${season.olympic.medal} in ${season.olympic.city}`);
  if (season.milestone) out.push(season.milestone);
  return out;
}

function Marker({ season }: { season: Season }) {
  return (
    <span className="flex h-[46px] w-full flex-col items-center justify-end gap-[5px]">
      {season.olympic ? (
        <span
          aria-hidden
          className="h-[7px] w-[7px] rounded-full"
          style={{
            backgroundColor:
              season.olympic.medal === "Gold" ? "var(--gold)" : "var(--muted)",
          }}
        />
      ) : null}
      {season.mvp ? (
        <span
          aria-hidden
          className="h-[7px] w-[7px] rounded-full border-2 border-ochre"
        />
      ) : null}
      {season.title ? (
        <span aria-hidden className="h-[9px] w-[9px] bg-wine" />
      ) : null}
    </span>
  );
}

export function SeasonRuler() {
  const [index, setIndex] = React.useState(SEASONS.length - 1);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const selected = SEASONS[index];
  const honours = honoursFor(selected);

  const move = (next: number) => {
    const clamped = Math.max(0, Math.min(SEASONS.length - 1, next));
    setIndex(clamped);
    itemRefs.current[clamped]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(SEASONS.length - 1);
    }
  };

  return (
    <section
      id="span"
      aria-labelledby="span-heading"
      className="floor-deep relative px-5 py-20 sm:px-8 sm:py-24 md:px-14"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2
              id="span-heading"
              className="headline max-w-[16ch] text-wine"
              style={{ fontSize: "clamp(2rem, 5.2vw, 3.75rem)" }}
            >
              <RiseWords text={SPAN.heading} />
            </h2>
            <motion.p
              className="prose-copy mt-5 max-w-[44ch] text-[1.0625rem] text-muted"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT_SOON}
              transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.2 }}
            >
              {SPAN.copy}
            </motion.p>
          </div>

          {/* readout for the selected season */}
          <motion.div
            className="min-w-[15rem] border-l-2 border-wine pl-4 lg:max-w-xs"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT_SOON}
            transition={{ duration: 0.7, ease: EASE_SETTLE, delay: 0.35 }}
          >
            <span className="figure block text-[2.25rem] text-wine">
              {selected.label}
            </span>
            <Caption className="mt-1 block text-muted">
              {selected.team.club}
            </Caption>
            <ul className="mt-3 flex flex-col gap-1">
              {honours.length > 0 ? (
                honours.map((h) => (
                  <li key={h}>
                    <Caption bold className="text-wine">
                      {h}
                    </Caption>
                  </li>
                ))
              ) : (
                <li>
                  <Caption className="text-muted/80">
                    A season in the middle of it.
                  </Caption>
                </li>
              )}
            </ul>
          </motion.div>
        </div>

        {/* --- the ruler ------------------------------------------------- */}
        <div className="mt-14">
          <motion.div
            role="radiogroup"
            aria-label={`Seasons, ${SEASONS[0].label} to ${SEASONS[SEASONS.length - 1].label}. Choose a season to read what happened in it.`}
            onKeyDown={onKeyDown}
            className="flex w-full items-end gap-[2px] sm:gap-[3px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.035 } },
            }}
          >
            {SEASONS.map((season, i) => {
              const active = i === index;
              return (
                <motion.button
                  key={season.start}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setIndex(i)}
                  onMouseEnter={() => setIndex(i)}
                  onFocus={() => setIndex(i)}
                  aria-label={`${season.label}, ${season.team.club}${
                    honoursFor(season).length
                      ? `. ${honoursFor(season).join(". ")}`
                      : ""
                  }`}
                  className="group flex flex-1 flex-col items-center outline-offset-2"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { duration: 0.35, ease: EASE_SETTLE },
                    },
                  }}
                >
                  <Marker season={season} />
                  {/* The club colour is the data, so the selected season is
                      capped in chalk rather than the others being dimmed. */}
                  <span
                    aria-hidden
                    className="relative w-full overflow-hidden"
                    style={{ height: 78 }}
                  >
                    <motion.span
                      className="absolute inset-0 origin-bottom"
                      style={{ backgroundColor: season.team.floor }}
                      variants={{
                        hidden: { scaleY: 0 },
                        show: {
                          scaleY: 1,
                          transition: { duration: 0.55, ease: EASE_PAINT },
                        },
                      }}
                    />
                    <span
                      className={cn(
                        "absolute inset-x-0 top-0 h-[5px] bg-chalk transition-opacity duration-200",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "mt-1 w-full transition-colors",
                      active ? "h-[10px] bg-wine" : "h-[5px] bg-rule",
                    )}
                  />
                </motion.button>
              );
            })}
          </motion.div>

          <PaintRule className="mt-1" color="var(--rule-strong)" />

          {/* club spans, sized by how many seasons each one holds */}
          <div className="mt-2 flex w-full gap-[2px] sm:gap-[3px]">
            {TEAM_SPANS.map((team) => (
              <div
                key={team.id + team.from}
                className="min-w-0 pt-1"
                style={{ flexGrow: team.to - team.from + 1, flexBasis: 0 }}
              >
                <span
                  aria-hidden
                  className="block h-[3px] w-full"
                  style={{ backgroundColor: team.floor }}
                />
                <Caption bold className="mt-2 block truncate text-wine">
                  {team.city}
                </Caption>
                <Caption className="block truncate text-muted">
                  {team.from}
                  {"–"}
                  {team.to + 1}
                </Caption>
              </div>
            ))}
          </div>

          {/* legend */}
          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {SPAN.legend.map((l) => (
              <li key={l.key} className="flex items-center gap-2.5">
                {l.key === "title" ? (
                  <span aria-hidden className="h-[9px] w-[9px] bg-wine" />
                ) : null}
                {l.key === "mvp" ? (
                  <span
                    aria-hidden
                    className="h-[9px] w-[9px] rounded-full border-2 border-ochre"
                  />
                ) : null}
                {l.key === "olympic" ? (
                  <span
                    aria-hidden
                    className="h-[9px] w-[9px] rounded-full bg-gold"
                  />
                ) : null}
                <Caption className="text-muted">{l.text}</Caption>
              </li>
            ))}
            <li>
              <Caption className="text-muted/80">
                Through {STATS_AS_OF}.
              </Caption>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
