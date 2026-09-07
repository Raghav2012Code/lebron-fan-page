"use client";

import * as React from "react";

/**
 * Lightweight, opt-in sound. Off by default, never autoplays, preference
 * persisted to localStorage and read via useSyncExternalStore (SSR-safe, no
 * hydration mismatch). Sounds are generated with the Web Audio API so there
 * are no audio assets to load. Exposes an imperative `play()` used by the shot
 * challenge for interaction feedback.
 */

type Tone = "made" | "miss" | "click" | "streak";

interface SoundCtx {
  enabled: boolean;
  toggle: () => void;
  play: (tone: Tone) => void;
}

const Ctx = React.createContext<SoundCtx | null>(null);
const STORAGE_KEY = "king23:sound";
const SOUND_EVENT = "king23:sound-change";

function readEnabled() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(SOUND_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(SOUND_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const enabled = React.useSyncExternalStore(
    subscribe,
    readEnabled,
    () => false,
  );
  const audioRef = React.useRef<AudioContext | null>(null);

  const ensureCtx = React.useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) {
      const Ac =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (Ac) audioRef.current = new Ac();
    }
    return audioRef.current;
  }, []);

  const toggle = React.useCallback(() => {
    const next = !readEnabled();
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(SOUND_EVENT));
    if (next) {
      const ctx = ensureCtx();
      if (ctx?.state === "suspended") void ctx.resume();
    }
  }, [ensureCtx]);

  const play = React.useCallback(
    (tone: Tone) => {
      if (!enabled) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") void ctx.resume();

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.connect(ctx.destination);

      const spec: Record<
        Tone,
        { freqs: number[]; type: OscillatorType; dur: number; gain: number }
      > = {
        made: { freqs: [523.25, 783.99, 1046.5], type: "triangle", dur: 0.5, gain: 0.14 },
        streak: { freqs: [659.25, 987.77, 1318.5], type: "triangle", dur: 0.6, gain: 0.16 },
        miss: { freqs: [180, 120], type: "sawtooth", dur: 0.28, gain: 0.1 },
        click: { freqs: [880], type: "sine", dur: 0.08, gain: 0.06 },
      };

      const { freqs, type, dur, gain } = spec[tone];
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(gain, now + 0.02);
      master.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        const t = now + i * (dur / (freqs.length + 1));
        osc.frequency.setValueAtTime(f, t);
        osc.connect(master);
        osc.start(t);
        osc.stop(now + dur);
      });
    },
    [enabled, ensureCtx],
  );

  const value = React.useMemo(
    () => ({ enabled, toggle, play }),
    [enabled, toggle, play],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSound(): SoundCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) {
    return { enabled: false, toggle: () => {}, play: () => {} };
  }
  return ctx;
}
