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

/**
 * In-memory mirror of the preference, consulted first. Previously the
 * enabled state lived ONLY in localStorage, so if the write threw (Safari
 * private mode, storage blocked by policy) the catch swallowed it,
 * `readEnabled()` kept returning the old value, and the toggle became a
 * permanent silent no-op with no error and no fallback. Now storage is a
 * mirror for cross-session persistence and memory is the source of truth for
 * the session. `null` means "nothing chosen yet", so a fresh page load still
 * reads the persisted value.
 */
let sessionValue: boolean | null = null;

function readEnabled() {
  if (sessionValue !== null) return sessionValue;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function writeEnabled(next: boolean) {
  sessionValue = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* storage unavailable; the in-memory value still drives this session */
  }
  window.dispatchEvent(new Event(SOUND_EVENT));
}

/**
 * Adopt a value written by ANOTHER tab.
 *
 * Without this the `storage` listener below is dead code after the first local
 * write. `readEnabled` short-circuits on `sessionValue`, so once the reader has
 * toggled the switch in this tab it never touches `localStorage` again: the
 * cross-tab event fires the subscriber, `getSnapshot` returns an identical
 * boolean, and React bails on `Object.is` without re-rendering. Two tabs, sound
 * on in one and off in the other, and the first tab's switch still reads "on".
 *
 * A `key` of null means the whole store was cleared, which reads as off. Any
 * other key is somebody else's business.
 */
function adoptStorageEvent(e: StorageEvent) {
  if (e.key !== null && e.key !== STORAGE_KEY) return;
  try {
    sessionValue = window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    /* storage unavailable; the in-memory value still drives this session */
  }
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    adoptStorageEvent(e);
    cb();
  };
  window.addEventListener(SOUND_EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(SOUND_EVENT, cb);
    window.removeEventListener("storage", onStorage);
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

  // The context outlived the provider: nothing ever called `close()`, and
  // toggling sound OFF left it in `state: "running"` for the rest of the
  // session, keeping Chrome's audio-active indicator lit. The ref is read
  // INSIDE the cleanup, not captured at setup — the context is created
  // lazily on the first toggle, so it is still null when this effect runs.
  React.useEffect(() => {
    return () => {
      const ctx = audioRef.current;
      if (ctx && ctx.state !== "closed") void ctx.close();
    };
  }, []);

  const toggle = React.useCallback(() => {
    const next = !readEnabled();
    writeEnabled(next);
    if (next) {
      const ctx = ensureCtx();
      if (ctx?.state === "suspended") void ctx.resume();
    } else if (audioRef.current?.state === "running") {
      void audioRef.current.suspend();
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

/** Stable no-op fallback, hoisted so it is not a fresh object every render
 *  for any consumer that ends up outside the provider. */
const SILENT: SoundCtx = { enabled: false, toggle: () => {}, play: () => {} };

export function useSound(): SoundCtx {
  return React.useContext(Ctx) ?? SILENT;
}
