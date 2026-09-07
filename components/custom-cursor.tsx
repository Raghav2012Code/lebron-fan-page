"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

/** Subscribe to a media query without setState-in-effect. */
function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (cb: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Desktop-only decorative cursor. Purely presentational — the interface is
 * fully usable without it. Auto-disables on touch / small screens / reduced
 * motion, and re-checks on resize + media changes.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery(
    "(pointer: fine) and (hover: hover) and (min-width: 1024px)",
  );
  const active = !reduce && isDesktop;
  const [hovering, setHovering] = React.useState(false);
  const [label, setLabel] = React.useState<string>("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.5 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40, mass: 0.3 });

  React.useEffect(() => {
    if (!active) {
      document.documentElement.removeAttribute("data-custom-cursor");
      return;
    }
    document.documentElement.setAttribute("data-custom-cursor", "true");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      const hit = target?.closest?.(
        "[data-cursor], a, button, [role='tab'], input, label",
      );
      if (hit) {
        setHovering(true);
        setLabel(hit.getAttribute("data-cursor") ?? "");
      } else {
        setHovering(false);
        setLabel("");
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeAttribute("data-custom-cursor");
    };
  }, [active, x, y]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] hidden lg:block">
      {/* Gold ring */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-gold"
          animate={{
            width: hovering ? 56 : 34,
            height: hovering ? 56 : 34,
            opacity: hovering ? 1 : 0.8,
            borderColor: hovering ? "var(--gold-bright)" : "var(--gold)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        />
      </motion.div>

      {/* Red center dot */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: dotX, y: dotY }}
      >
        <div className="h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red" />
      </motion.div>

      {/* Optional label */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY }}
      >
        <AnimatePresence>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.18 }}
              className="absolute left-6 top-4 whitespace-nowrap bg-gold px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.2em] text-ink"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
