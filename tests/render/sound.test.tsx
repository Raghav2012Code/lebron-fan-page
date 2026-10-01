import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Sound is opt-in, off by default, and persisted. The provider is the only
 * place a Web Audio context is ever constructed, and jsdom has no
 * implementation of the Web Audio API at all — so this suite is as much a check
 * that the page survives without audio as it is a check of the toggle.
 *
 * **Why every test loads the provider dynamically.**
 *
 * `components/sound-provider.tsx` keeps the preference in a MODULE-LEVEL
 * `sessionValue`, deliberately: memory is the source of truth for the session
 * and `localStorage` is only a mirror, so a blocked write cannot make the
 * toggle a silent no-op (`e954be8`). That is correct for a page with one
 * document and it is hostile to a test file, because the value outlives every
 * render and every `cleanup()`. A suite that renders the provider once per test
 * therefore inherits whatever the previous test decided — the first version of
 * this file failed three tests that way, including one that looked like the
 * component ignoring `localStorage`.
 *
 * `vi.resetModules()` per test gives each one a fresh module registry, so
 * "a fresh page load" is actually testable here.
 */
async function mountSound() {
  vi.resetModules();
  const [{ SoundProvider }, { SoundToggle }] = await Promise.all([
    import("@/components/sound-provider"),
    import("@/components/sound-toggle"),
  ]);
  return render(
    <SoundProvider>
      <SoundToggle />
    </SoundProvider>,
  );
}

const STORAGE_KEY = "king23:sound";
const toggle = () => screen.getByRole("button");
const pressed = () => toggle().getAttribute("aria-pressed");

describe("sound", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("is off by default and says so", async () => {
    await mountSound();
    // `aria-pressed` is the whole contract: a screen reader announces the
    // state rather than relying on the label text changing.
    expect(pressed()).toBe("false");
    expect(toggle().textContent).toMatch(/sound off/i);
  });

  it("flips to on, and the label follows the state", async () => {
    const user = userEvent.setup();
    await mountSound();
    await user.click(toggle());
    expect(pressed()).toBe("true");
    expect(toggle().textContent).toMatch(/sound on/i);
  });

  it("reads the persisted preference on a fresh load", async () => {
    // A visitor who turned sound on yesterday gets sound today. This is only
    // observable with a fresh module registry, because `sessionValue` is
    // consulted first for the rest of the session.
    window.localStorage.setItem(STORAGE_KEY, "on");
    await mountSound();
    expect(pressed()).toBe("true");
  });

  it("stays off when the stored preference is off", async () => {
    window.localStorage.setItem(STORAGE_KEY, "off");
    await mountSound();
    expect(pressed()).toBe("false");
  });

  it("keeps working when the write to localStorage throws", async () => {
    // Safari private mode and storage-blocked-by-policy both do this, and the
    // original bug was that the toggle became a permanent silent no-op. The
    // in-memory value is the source of truth precisely so this passes.
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new DOMException("QuotaExceededError");
    };
    try {
      const user = userEvent.setup();
      await mountSound();
      await user.click(toggle());
      expect(pressed()).toBe("true");
    } finally {
      Storage.prototype.setItem = original;
    }
  });

  it("mirrors a change made in another tab", async () => {
    // `useSyncExternalStore` over a `storage` event, so two tabs cannot
    // disagree. `e954be8` found this listener dead; this keeps it live.
    await mountSound();
    expect(pressed()).toBe("false");

    await act(async () => {
      window.localStorage.setItem(STORAGE_KEY, "on");
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
    });
    expect(pressed()).toBe("true");
  });

  it("ignores a storage event for some other key", async () => {
    await mountSound();
    await act(async () => {
      window.localStorage.setItem("something-else", "on");
      window.dispatchEvent(
        new StorageEvent("storage", { key: "something-else" }),
      );
    });
    // A cross-tab event about an unrelated key must not switch sound on.
    expect(pressed()).toBe("false");
  });

  it("removes its storage listener on unmount", async () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = await mountSound();
    unmount();
    // A listener left behind on a single-page app outlives the section.
    expect(remove).toHaveBeenCalled();
  });

  it("never builds an AudioContext before the visitor asks for sound", async () => {
    let constructed = 0;
    const original = globalThis.AudioContext;
    class Counting {
      constructor() {
        constructed++;
      }
    }
    (globalThis as unknown as { AudioContext: unknown }).AudioContext = Counting;
    try {
      await mountSound();
      // Opt-in means opt-in: nothing before the gesture, because a browser
      // blocks a context created without one and the visitor never asked.
      expect(constructed).toBe(0);
    } finally {
      (globalThis as unknown as { AudioContext: unknown }).AudioContext =
        original;
    }
  });

  it("survives a click with no Web Audio implementation at all", async () => {
    // The strongest form of the guarantee, and the state jsdom is in by
    // default: a component that assumed audio existed would fail here and
    // nowhere else.
    const original = globalThis.AudioContext;
    delete (globalThis as unknown as { AudioContext?: unknown }).AudioContext;
    try {
      const user = userEvent.setup();
      await mountSound();
      await user.click(toggle());
      // The toggle must respond even though it can make no sound.
      expect(pressed()).toBe("true");
    } finally {
      (globalThis as unknown as { AudioContext?: unknown }).AudioContext =
        original;
    }
  });
  /**
   * Mount the toggle with `prefers-reduced-motion` forced on or off, click it
   * so sound is ON, and report what the bars are.
   *
   * The equalizer bars animate `height` on `repeat: Infinity`, which is a
   * JavaScript loop. Framer's `reducedMotion="user"` only snaps transform and
   * layout keys, and globals.css's `[data-reveal-loop]` rule reaches CSS
   * animations only, so neither existing mechanism could stop these. The
   * component has to branch itself, the way `center-court` does.
   *
   * A rendered height cannot tell an animated bar from a static one: both are a
   * span carrying a `height` style. The bars therefore carry `data-reveal-loop`,
   * the attribute globals.css already uses to mark a Framer repeat loop, and
   * that is what this counts.
   *
   * One render per test, because `getByRole("button")` cannot tell two of them
   * apart and the provider's module-level state is reset per mount anyway.
   */
  async function barsWithPreference(reduce: boolean) {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: reduce && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;
    try {
      const user = userEvent.setup();
      const { container } = await mountSound();
      await user.click(toggle());
      expect(pressed(), "sound must be on for this to mean anything").toBe(
        "true",
      );
      return {
        loops: container.querySelectorAll("[data-reveal-loop]").length,
        bars: container.querySelectorAll("button span span").length,
      };
    } finally {
      window.matchMedia = original;
    }
  }

  it("marks the equalizer bars as an infinite loop when motion is welcome", async () => {
    const animating = await barsWithPreference(false);
    expect(animating.bars, "three bars are drawn").toBe(3);
    expect(
      animating.loops,
      "with motion welcome the bars are the Framer loop, and are marked as one",
    ).toBe(3);
  });

  it("does not pulse forever when the visitor asked for reduced motion", async () => {
    const reduced = await barsWithPreference(true);
    expect(reduced.bars, "the bars are still drawn, just not animated").toBe(3);
    expect(
      reduced.loops,
      "under reduced motion no bar may run the infinite loop",
    ).toBe(0);
  });
});
