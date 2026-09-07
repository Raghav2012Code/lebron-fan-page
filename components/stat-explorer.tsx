"use client";

import * as React from "react";
import { motion } from "framer-motion";

import {
  EXPLORER,
  STATS_AS_OF,
  type ExplorerEra,
  type Metric,
  type RadarAxis,
} from "@/lib/lebron-data";
import {
  DUR,
  EASE_OUT,
  fadeUp,
  makeStagger,
  VIEWPORT,
} from "@/lib/motion";
import { Counter, SectionLabel, SplitText } from "@/components/kinetic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const decimalsFor = (v: number) => (Number.isInteger(v) ? 0 : 1);

/* --------------------------------------------------------------- MetricBar */
function MetricBar({ metric }: { metric: Metric }) {
  const fill = Math.max(0, Math.min(1, metric.value / metric.max));
  return (
    <motion.div variants={fadeUp} className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="label text-paper">{metric.label}</span>
          {metric.approx ? (
            <span className="label text-[0.55rem] text-muted">APPROX</span>
          ) : null}
        </div>
        <span className="font-display text-2xl leading-none text-gold sm:text-3xl">
          <Counter
            to={metric.value}
            decimals={decimalsFor(metric.value)}
            suffix={metric.suffix ?? ""}
            duration={1.6}
          />
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden bg-hairline">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left bg-gold"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: fill }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 1.3, ease: EASE_OUT, delay: 0.1 }}
        />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------- RadarChart */
function radarPoint(value: number, i: number, count: number, r: number, c: number) {
  const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
  const radius = (value / 100) * r;
  return [c + radius * Math.cos(angle), c + radius * Math.sin(angle)] as const;
}

function RadarChart({ data, label }: { data: RadarAxis[]; label: string }) {
  const size = 320;
  const c = size / 2;
  const r = size / 2 - 62;
  const count = data.length;

  const dataPath =
    data
      .map((d, i) => {
        const [x, y] = radarPoint(d.value, i, count, r, c);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ") + " Z";

  const rings = [25, 50, 75, 100];

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="mx-auto h-auto w-full max-w-[360px]"
        role="img"
        aria-label={`${label} editorial index. ${data
          .map((d) => `${d.axis}: ${d.value} of 100`)
          .join(". ")}.`}
      >
        {/* grid rings */}
        {rings.map((ring, ri) => {
          const pts = data
            .map((_, i) => {
              const [x, y] = radarPoint(ring, i, count, r, c);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
          return (
            <motion.polygon
              key={ring}
              points={pts}
              fill="none"
              stroke="var(--hairline)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.05 * ri }}
            />
          );
        })}

        {/* spokes + labels */}
        {data.map((d, i) => {
          const [x, y] = radarPoint(100, i, count, r, c);
          const [lx, ly] = radarPoint(122, i, count, r, c);
          return (
            <g key={d.axis}>
              <line
                x1={c}
                y1={c}
                x2={x}
                y2={y}
                stroke="var(--hairline)"
                strokeWidth="1"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                }}
              >
                {d.axis}
              </text>
            </g>
          );
        })}

        {/* data shape */}
        <motion.path
          d={dataPath}
          fill="var(--gold)"
          fillOpacity={0.12}
          stroke="var(--gold)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{
            pathLength: { duration: 1.4, ease: EASE_OUT },
            opacity: { duration: 0.3 },
          }}
        />

        {/* vertices */}
        {data.map((d, i) => {
          const [x, y] = radarPoint(d.value, i, count, r, c);
          return (
            <motion.circle
              key={d.axis}
              cx={x}
              cy={y}
              r={3}
              fill="var(--gold-bright)"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, delay: 0.9 + i * 0.06, ease: EASE_OUT }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------ ExplorerPanel */
function ExplorerPanel({ era }: { era: ExplorerEra }) {
  return (
    <motion.div
      variants={makeStagger(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.15 }}
      className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-2"
    >
      {/* left: metadata + metrics + running total */}
      <div className="flex flex-col gap-8">
        <motion.div variants={fadeUp} className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-4xl leading-none text-paper sm:text-5xl">
            {era.full}
          </h3>
          <span className="label text-gold">{era.years}</span>
        </motion.div>

        <div className="flex flex-col gap-6">
          {era.metrics.map((m) => (
            <MetricBar key={m.label} metric={m} />
          ))}
        </div>

        {/* running total */}
        <motion.div
          variants={fadeUp}
          className="mt-2 border border-hairline bg-ink/40 p-6"
        >
          <span className="label text-muted">{era.running.label}</span>
          <div className="mt-2 font-display leading-none text-gold-bright" style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)" }}>
            <Counter
              to={era.running.value}
              suffix={era.running.suffix ?? ""}
              duration={2}
            />
          </div>
        </motion.div>
      </div>

      {/* right: radar + achievements */}
      <div className="flex flex-col gap-8">
        <motion.div variants={fadeUp}>
          <div className="mb-3 flex items-center justify-between">
            <span className="label text-paper">EDITORIAL INDEX</span>
            <span className="label text-[0.55rem] text-muted">
              INTERPRETIVE · / 100
            </span>
          </div>
          <RadarChart data={era.radar} label={era.full} />
        </motion.div>

        <motion.ul variants={makeStagger(0.06)} className="flex flex-col">
          {era.achievements.map((a) => (
            <motion.li
              key={a}
              variants={fadeUp}
              className="flex items-center gap-3 border-b border-hairline py-3 last:border-b-0"
            >
              <span className="h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-paper">
                {a}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p variants={fadeUp} className="text-sm italic text-muted">
          {era.note}
        </motion.p>
      </div>

      {/* accessible data table alternative — wrapped in an sr-only container so
          the table (which sizes to its content and can't shrink to sr-only's
          1px) is clipped instead of expanding the page width. */}
      <div className="sr-only">
        <table>
          <caption>
            {era.full} ({era.years}) — key figures and editorial index
          </caption>
          <tbody>
          {era.metrics.map((m) => (
            <tr key={m.label}>
              <th scope="row">{m.label}</th>
              <td>
                {m.value}
                {m.suffix ?? ""}
                {m.approx ? " (approximate)" : ""}
              </td>
            </tr>
          ))}
          <tr>
            <th scope="row">{era.running.label}</th>
            <td>
              {era.running.value}
              {era.running.suffix ?? ""}
            </td>
          </tr>
          {era.radar.map((d) => (
            <tr key={d.axis}>
              <th scope="row">{d.axis} index</th>
              <td>{d.value} of 100</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* --------------------------------------------------------------------- Root */
export function StatExplorer() {
  const [active, setActive] = React.useState(EXPLORER[0].id);

  return (
    <section
      id="explorer"
      aria-labelledby="explorer-heading"
      className="relative border-t border-hairline bg-ink px-5 py-20 sm:px-8 sm:py-28 md:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <SectionLabel className="mb-10">03 — STAT EXPLORER</SectionLabel>
        <h2
          id="explorer-heading"
          className="mb-4 max-w-4xl font-display leading-[0.86]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
        >
          <SplitText text="EVERY CHAPTER," className="text-paper" />
          <br />
          <SplitText text="MEASURED" className="type-outline [--stroke-c:var(--gold)] [--stroke-w:1.5px]" delay={0.1} />
        </h2>
        <motion.p
          className="mb-12 max-w-lg text-sm text-muted"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          transition={{ duration: DUR.base, ease: EASE_OUT }}
        >
          Verified figures where they exist, rounded and marked where they are
          approximate. Select an era to redraw the record. As of {STATS_AS_OF}.
        </motion.p>

        <Tabs value={active} onValueChange={setActive}>
          <TabsList className="mb-12">
            {EXPLORER.map((e) => (
              <TabsTrigger key={e.id} value={e.id} className="relative">
                {active === e.id ? (
                  <motion.span
                    layoutId="explorer-pill"
                    className="absolute inset-0 bg-gold"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{e.tab}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {EXPLORER.map((e) => (
            <TabsContent key={e.id} value={e.id}>
              <ExplorerPanel era={e} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
