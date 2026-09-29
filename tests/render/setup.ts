import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

/**
 * The seam issue #26 described as unreachable.
 *
 * `tests/resolver.mjs` had `.tsx` removed from its extension probe, so
 * importing a component failed as "cannot find module". That suite still runs on
 * `node:test` and still cannot do this — it has no JSX transform and no DOM.
 * This file is the render layer's half of the answer: Vitest resolves and
 * transforms `.tsx`, and jsdom supplies the document.
 */

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * `matchMedia` is read by `lib/use-reduced-motion.ts` and by Framer, and jsdom
 * does not implement it. Without this every component that asks whether motion
 * is welcome throws a `TypeError` on mount, which would make every render test
 * fail for a reason that has nothing to do with the component.
 *
 * `matches: false` is the honest default: it means "the visitor has not asked
 * for reduced motion", which is what a browser without a preference reports.
 * A test that needs the other answer sets it explicitly.
 */
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

/**
 * jsdom implements neither of these, and both are used by the page's own
 * scroll-linked sections. Returning a fixed value keeps them deterministic
 * rather than letting a component measure a viewport that does not exist.
 */
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

/**
 * `IntersectionObserver` is not optional here the way `matchMedia` is.
 *
 * Framer's `whileInView` — used by the rooms panels, the block re-enactment and
 * the ledger bars — reads it during the first commit, and jsdom has no such
 * class. Without this stub `render(<SeasonRuler />)` throws a `ReferenceError`
 * six times over and the test fails for a reason that has nothing to do with
 * the component under test.
 *
 * The callback is deliberately never fired. `whileInView` elements therefore
 * stay in their `initial` state, which is what a reader who has not scrolled
 * yet sees, and it keeps a render test from depending on scroll position. A
 * test that needs an element to have entered the viewport drives the stub's
 * `intersect()` itself.
 */
class TestIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  constructor(private readonly callback: IntersectionObserverCallback) {
    observers.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  /** Test-only: report every observed target as fully visible. */
  intersect(): void {
    this.callback(
      [],
      this as unknown as IntersectionObserver,
    );
  }
}

const observers: TestIntersectionObserver[] = [];

if (!window.IntersectionObserver) {
  window.IntersectionObserver =
    TestIntersectionObserver as unknown as typeof IntersectionObserver;
  globalThis.IntersectionObserver =
    TestIntersectionObserver as unknown as typeof IntersectionObserver;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
