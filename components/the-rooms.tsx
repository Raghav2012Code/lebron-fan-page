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

import { ROOMS, ROOMS_INTRO, type Room } from "@/lib/data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Caption, RiseWords, type Opener } from "@/components/typeset";

const N = ROOMS.length;
const PINNED_HEIGHT = "420vh";
const REST_RATIO = 0.35;

/**
 * Where room `i` sits along the pinned scroll, as a fraction of 0 to 1.
 *
 * ONE definition, because the section had two and they disagreed across a fifth
 * of it. `RoomPanel` placed each panel at `(i + 0.5) / N` — deliberately 1/N
 * rather than 1/(N-1), so every chapter gets an equal share of the pin and the
 * first one's fade-in range is not entirely below zero — while `PinnedRooms`
 * derived the floor colour, the PAINT, the active index and `goTo` from
 * `i / (N-1)`.
 *
 * With N = 6, panel 0 rests across progress [0, 0.167] but `active` flips to 1 at
 * 0.1, so for that stretch the Akron panel is at full opacity while the nav
 * underline, the label colour and the `aria-live` region all name Cleveland.
 * `round(v * (N-1))` becomes `round(v * N - 0.5)`, which is the same rounding
 * against the centres the panels are actually drawn at.
 */
const roomSeg = 1 / N;
const roomCenter = (i: number) => (i + 0.5) * roomSeg;

/**
 * The rooms he has played in.
 *
 * A pinned sequence where the floor itself changes colour, because each room
 * had one: Cavaliers wine, Heat red, the gold of the 2016 banner, Lakers
 * purple, USA navy. Colour is doing the work of a label. The jersey number
 * sits alongside, because it is the one thing that actually changed shirt to
 * shirt, and the panels move horizontally so the section never repeats the
 * vertical fade every other section would use.
 */

function RoomPanel({
  room,
  i,
  progress,
  active,
}: {
  room: Room;
  i: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  // Rooms slide past one another instead of cross-fading. Two panels of
  // running text dissolved through each other were unreadable for the whole
  // middle of every transition. Here each panel sits still and legible for
  // most of its stretch, then leaves sideways while the floor is repainted
  // and the next one arrives — so nothing is ever read through anything else.
  // `seg` is 1/N, not 1/(N-1), so every chapter gets an EQUAL share of the
  // pin. With 1/(N-1) the first chapter's window was centred on progress 0 —
  // the first reachable value — which put its entire fade-IN range below 0
  // (unreachable, so Akron never slid in) and gave it half the scroll
  // distance of every other chapter. The last chapter's exit range is
  // likewise allowed to run past 1, which is unreachable by design.
  const seg = roomSeg;
  const center = roomCenter(i);
  const range = [
    center - seg * 0.5,
    center - seg * REST_RATIO,
    center + seg * REST_RATIO,
    center + seg * 0.5,
  ];

  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const x = useTransform(progress, range, ["105%", "0%", "0%", "-105%"]);
  const numeralX = useTransform(progress, range, [
    "150%",
    "0%",
    "0%",
    "-150%",
  ]);

  return (
    <motion.div
      aria-hidden={!active}
      className="absolute inset-0 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]"
      style={{ opacity, color: room.type }}
    >
      <motion.div className="max-w-2xl" style={{ x }}>
        {/* Uses `room.type` (the chalk/white text token) rather than
            `room.paint`: Miami's paint (#E8761E) measured 3.58:1 on its own
            #7A1810 floor, below the 4.5:1 that 13px bold text requires. The
            years label is small, so it takes the high-contrast token. */}
        <Caption bold style={{ color: room.type }}>
          {room.years}
        </Caption>
        <h3
          className="monument mt-3"
          style={{ fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)" }}
        >
          {room.name}
        </h3>
        <Caption className="mt-4 block" style={{ color: room.dim }}>
          {room.venue}
        </Caption>

        <div className="mt-9 flex items-baseline gap-4">
          <span
            className="figure"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4rem)", color: room.paint }}
          >
            {room.stat}
          </span>
          <Caption bold className="max-w-[10rem]">
            {room.statLabel}
          </Caption>
        </div>

        <p
          className="prose-copy mt-8 max-w-[52ch] text-[1.0625rem]"
          style={{ color: room.dim }}
        >
          {room.copy}
        </p>
      </motion.div>

      {/* the shirt he was actually wearing in this room */}
      <motion.div
        className="hidden flex-col items-end lg:flex"
        style={{ x: numeralX }}
      >
        <Caption style={{ color: room.dim }}>Wearing</Caption>
        <span
          className="figure leading-none"
          style={{ fontSize: "clamp(7rem, 15vw, 14rem)", color: room.paint }}
        >
          {room.jersey}
        </span>
      </motion.div>
    </motion.div>
  );
}

function PinnedRooms() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 24,
    mass: 0.35,
  });

  // Each room's colour is held flat while you are in it and repainted
  // quickly at the handover, so the floor is never a muddy blend of two
  // clubs' colours for half the section. Centred on `roomCenter`, the same
  // place `RoomPanel` draws the chapter — previously this used 1/(N-1) while
  // the panels used 1/N, so the floor changed hands while the previous
  // chapter was still fully on screen.
  const seg = roomSeg;
  const stops = ROOMS.flatMap((_, i) => [
    roomCenter(i) - seg * REST_RATIO,
    roomCenter(i) + seg * REST_RATIO,
  ]);
  const floor = useTransform(
    progress,
    stops,
    ROOMS.flatMap((r) => [r.floor, r.floor]),
  );
  const paint = useTransform(
    progress,
    stops,
    ROOMS.flatMap((r) => [r.paint, r.paint]),
  );

  const [active, setActive] = React.useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    // Rounding against the panel CENTRES, not against i/(N-1). See `roomCenter`.
    const idx = Math.max(0, Math.min(N - 1, Math.round(v * N - 0.5)));
    setActive((p) => (p === idx ? p : idx));
  });

  const goTo = React.useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const dist = el.offsetHeight - window.innerHeight;
    // To the room's centre, not to i/(N-1) — otherwise clicking the first nav
    // item scrolls past it and lands on the second.
    window.scrollTo({ top: top + roomCenter(i) * dist, behavior: "smooth" });
  }, []);

  return (
    <div ref={ref} style={{ height: PINNED_HEIGHT }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: floor }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-8 md:px-14">
          {/* Was a hard `h-[64vh] overflow-hidden`, which silently destroyed
              body copy on any viewport shorter than ~714px — including the
              ~660-700px a 1366x768 laptop actually has after browser chrome.
              Content height is driven by `vw` clamps, not by viewport height,
              so a fixed vh box cannot contain it. `min-h` + overflow-y lets
              the panel scroll instead of truncating mid-sentence. */}
          <div className="relative max-h-[86vh] min-h-[64vh] overflow-y-auto overscroll-contain">
            {ROOMS.map((room, i) => (
              <RoomPanel
                key={room.id}
                room={room}
                i={i}
                progress={progress}
                active={i === active}
              />
            ))}
          </div>
        </div>

        {/* six marks along the baseline, one per room */}
        <nav
          aria-label="Rooms"
          className="absolute inset-x-0 bottom-8 z-20 mx-auto flex max-w-6xl gap-2 px-5 sm:px-8 md:px-14"
        >
          {ROOMS.map((room, i) => (
            <button
              key={room.id}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === active ? "true" : undefined}
              className="group flex flex-1 flex-col gap-2 pt-3 text-left outline-offset-4"
            >
              <motion.span
                aria-hidden
                className="h-[3px] w-full transition-opacity"
                style={{
                  backgroundColor: paint,
                  opacity: i === active ? 1 : 0.3,
                }}
              />
              <span className="hidden sm:block">
                {/* Stacking a 0.72-alpha `dim` colour with a further
                    `opacity: 0.55` gave an effective alpha of ~0.40 and
                    measured 2.33-3.37:1 on every floor — below AA for 13px.
                    The full-opacity token carries the de-emphasis instead. */}
                <Caption
                  className="truncate transition-opacity"
                  style={{
                    color: ROOMS[active].type,
                    opacity: i === active ? 1 : 0.72,
                  }}
                >
                  {room.name}
                </Caption>
              </span>
            </button>
          ))}
        </nav>

        <p className="sr-only" aria-live="polite">
          {ROOMS[active].name}, {ROOMS[active].years}
        </p>
      </div>
    </div>
  );
}

/** Stacked fallback for narrow screens and reduced motion. */
function StackedRoom({ room }: { room: Room }) {
  return (
    <motion.section
      aria-label={`${room.name}, ${room.years}`}
      className="relative flex min-h-[82svh] flex-col justify-center px-5 py-16 sm:px-8"
      style={{ backgroundColor: room.floor, color: room.type }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -20 },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: EASE_SETTLE },
          },
        }}
        className="flex items-baseline justify-between gap-4"
      >
        <Caption bold style={{ color: room.paint }}>
          {room.years}
        </Caption>
        <span
          className="figure leading-none"
          style={{ fontSize: "clamp(3rem, 16vw, 6rem)", color: room.paint }}
        >
          {room.jersey}
        </span>
      </motion.div>

      <motion.h3
        className="monument mt-2"
        style={{ fontSize: "clamp(2.25rem, 11vw, 4rem)" }}
        variants={{
          hidden: { opacity: 0, x: -20 },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.65, ease: EASE_SETTLE },
          },
        }}
      >
        {room.name}
      </motion.h3>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { duration: 0.7 } },
        }}
      >
        <Caption className="mt-3 block" style={{ color: room.dim }}>
          {room.venue}
        </Caption>

        <div className="mt-7 flex items-baseline gap-4">
          <span
            className="figure"
            style={{ fontSize: "clamp(2.25rem, 10vw, 3.25rem)", color: room.paint }}
          >
            {room.stat}
          </span>
          <Caption bold className="max-w-[9rem]">
            {room.statLabel}
          </Caption>
        </div>

        <p
          className="prose-copy mt-7 max-w-[48ch] text-[1.0625rem]"
          style={{ color: room.dim }}
        >
          {room.copy}
        </p>
      </motion.div>
    </motion.section>
  );
}

/**
 * Opener: `device` -- Pinned scroll-linked chapters. Already the one structural departure on the page, and protected as such.
 *
 * Declared, not inferred: the test gate reads these in `app/page.tsx` order and fails if
 * two adjacent units share one. See `Opener` in typeset.tsx and DESIGN-AUDIT.md F-01.
 */
export const OPENER: Opener = "device";

export function TheRooms() {
  const reduce = usePrefersReducedMotion();

  return (
    <section id="rooms" aria-labelledby="rooms-heading" className="scroll-clearance relative">
      <div className="floor px-5 py-20 sm:px-8 sm:py-24 md:px-14">
        <div className="mx-auto max-w-6xl">
          <h2
            id="rooms-heading"
            className="monument max-w-[14ch] text-wine"
            style={{ fontSize: "clamp(2.5rem, 8vw, 6rem)" }}
          >
            <RiseWords text={ROOMS_INTRO.heading} />
          </h2>
          <motion.p
            className="prose-copy mt-6 max-w-[46ch] text-[1.0625rem] text-muted sm:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_SOON}
            transition={{ duration: 0.8, ease: EASE_SETTLE, delay: 0.25 }}
          >
            {ROOMS_INTRO.copy}
          </motion.p>
        </div>
      </div>

      {reduce ? (
        <div>
          {ROOMS.map((room) => (
            <StackedRoom key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <>
          {/* Both branches stay in the DOM. The stacked copy used to be the only
              one rendered at desktop, so at desktop Framer had serialised the
              five other pinned panels as `opacity: 0` and a visitor without JS
              got one of six chapters and no way to reach the rest. Both copies
              are now always present and the <noscript> below carries all six.

              There is deliberately NO `aria-hidden` on either branch, and there
              used to be one on the pinned wrapper — which is the branch that is
              VISIBLE at desktop, holding the six room buttons. So at `lg` and
              above the page was showing six focusable controls that were hidden
              from the accessibility tree: a keyboard user tabbed into buttons
              announced as nothing (WCAG 4.1.2, `aria-hidden-focus`). It cannot
              simply be swapped for `inert` either, because the element was
              marked hidden by mistake rather than deliberately.

              Neither branch needs the attribute. `hidden` / `lg:hidden` is
              `display: none`, which already removes a subtree from the tab order
              and the accessibility tree, so the attribute was only ever
              reachable-as-a-mistake. */}
          <div className="hidden lg:block">
            <PinnedRooms />
          </div>
          <div className="lg:hidden">
            {ROOMS.map((room) => (
              <StackedRoom key={room.id} room={room} />
            ))}
          </div>
        </>
      )}
      <noscript>
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:px-14">
          {ROOMS.map((room) => (
            <StackedRoom key={room.id} room={room} />
          ))}
        </div>
      </noscript>
    </section>
  );
}
