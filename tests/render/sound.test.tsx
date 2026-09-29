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
});
