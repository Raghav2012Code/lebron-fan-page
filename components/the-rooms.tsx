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

import { ROOMS, ROOMS_INTRO, type Room } from "@/lib/lebron-data";
import { EASE_SETTLE, VIEWPORT_SOON } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { Caption, RiseWords } from "@/components/typeset";

const N = ROOMS.length;
const PINNED_HEIGHT = "420vh";
const REST_RATIO = 0.35;

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
  const seg = 1 / (N - 1);
  const center = i * seg;
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
      className="absolute inset-0 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]"
      style={{ opacity, color: room.type }}
    >
      <motion.div className="max-w-2xl" style={{ x }}>
        <Caption bold style={{ color: room.paint }}>
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
  // clubs' colours for half the section.
  const seg = 1 / (N - 1);
  const stops = ROOMS.flatMap((_, i) => [
    i * seg - seg * REST_RATIO,
    i * seg + seg * REST_RATIO,
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
    const idx = Math.max(0, Math.min(N - 1, Math.round(v * (N - 1))));
    setActive((p) => (p === idx ? p : idx));
  });

  const goTo = React.useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const dist = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (N - 1)) * dist, behavior: "smooth" });
  }, []);

  return (
    <div ref={ref} style={{ height: PINNED_HEIGHT }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ backgroundColor: floor }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-8 md:px-14">
          <div className="relative h-[64vh] overflow-hidden">
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
                <Caption
                  className="truncate transition-opacity"
                  style={{
                    color: ROOMS[active].dim,
                    opacity: i === active ? 1 : 0.55,
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

export function TheRooms() {
  const reduce = usePrefersReducedMotion();

  return (
    <section id="rooms" aria-labelledby="rooms-heading" className="relative">
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
    </section>
  );
}
