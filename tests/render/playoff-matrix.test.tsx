import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PlayoffMatrix, OPENER } from "@/components/playoff-matrix";
import { PLAYOFF_SERIES } from "@/lib/data";

/**
 * The playoff matrix is the densest section on the page: 57 series, five round
 * filters, a franchise view, and a drawer that opens per card. It is also where
 * the worst historical bug lived — `0bb9be0`, where the drawer's focus effect
 * keyed on `inspectSeries`, so its CLOSE branch ran on mount and the page
 * scrolled itself 16,372px and stole focus on every load.
 *
 * That bug is exactly the class no source-text guard can catch, and it is
 * pinned below: a render that never opens a drawer must leave the scroll
 * position and focus alone.
 *
 * Cards are counted by `[aria-expanded]` rather than by "all buttons minus the
 * tabs". That arithmetic was wrong on the first attempt — the section also
 * carries two view tabs and a sort control — and a test that has to subtract a
 * guessed constant is one edit away from passing vacuously. The selector is by
 * attribute rather than by tag because a card is a `div` with `role="button"`.
 */
const seriesCards = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[aria-expanded]"),
  );

describe("playoff-matrix", () => {
  it("shows every series before any filter is applied", () => {
    render(<PlayoffMatrix />);
    expect(PLAYOFF_SERIES).toHaveLength(57);
    expect(seriesCards()).toHaveLength(57);
  });

  it("filters the cards by round and agrees with the count it reports", async () => {
    const user = userEvent.setup();
    render(<PlayoffMatrix />);

    // The tab's own accessible name carries the count it selects, so the number
    // on the tab and the number of rendered cards are the same claim. A filter
    // that updated the badge but not the grid would read as a data lie.
    //
    // Matched on the NBA Finals tab specifically, not `/finals/i` — which also
    // matches "Conference Semi**finals**" and picked the wrong tab on the first
    // attempt.
    const finalsTab = screen
      .getAllByRole("tab")
      .find((t) => (t.textContent ?? "").startsWith("NBA Finals"))!;
    const declared = Number(finalsTab.textContent?.match(/\((\d+)\)/)?.[1]);
    expect(declared).toBe(10);

    await user.click(finalsTab);

    const selected = screen
      .getAllByRole("tab")
      .filter((t) => t.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
    expect(selected[0]).toBe(finalsTab);

    expect(seriesCards()).toHaveLength(declared);
    expect(declared).toBeLessThan(57);
  });

  it("opens a drawer, and closes it again on Escape", async () => {
    const user = userEvent.setup();
    render(<PlayoffMatrix />);

    // The drawer must not exist in the DOM until it is asked for.
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(seriesCards()[0]);

    const dialog = await screen.findByRole("dialog");
    expect(
      dialog.getAttribute("aria-label") ||
        dialog.getAttribute("aria-labelledby"),
    ).toBeTruthy();

    // Exactly one control reports itself expanded. `455fea3` fixed a bug where
    // two elements could claim the same series.
    expect(document.querySelectorAll('[aria-expanded="true"]')).toHaveLength(1);

    await user.keyboard("{Escape}");
    await waitForGone(() => screen.queryByRole("dialog"));
    // Closing returns every card to collapsed.
    expect(document.querySelectorAll('[aria-expanded="true"]')).toHaveLength(0);
  });

  it("focuses nothing and opens nothing as a side effect of rendering", () => {
    // The intent is a regression guard for `0bb9be0`, where the drawer's focus
    // effect ran its CLOSE branch on mount, focused a `tabIndex={-1}` section,
    // and the page scrolled itself 16,372px and stole focus on every load.
    //
    // **What this does and does not prove.** The invariant below — a render
    // focuses nothing — is correct and worth pinning. It is NOT a demonstrated
    // guard for that bug: removing both guards in the effect
    // (`!inspectSeries` and `!hasOpenedRef.current`) still leaves this test
    // green, because the restore path resolves through
    // `lastActiveElementRef.current`, which is null on a fresh mount. The
    // scroll half of the original defect cannot be reproduced here at all,
    // since jsdom does not scroll when `focus()` is called.
    //
    // So: the real guard for `0bb9be0` remains the two guards in the component,
    // and this asserts the surrounding invariant rather than claiming credit
    // for the fix.
    render(<PlayoffMatrix />);

    // Nothing may be focused as a side effect of merely rendering.
    expect(document.activeElement).toBe(document.body);

    // And no card may claim to be open.
    expect(document.querySelectorAll('[aria-expanded="true"]')).toHaveLength(0);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("names its opener for the page rhythm", () => {
    expect(OPENER).toBe("instrument");
  });
});

/** Poll until a query returns null, so the test is not timing-dependent. */
async function waitForGone(query: () => unknown, tries = 60): Promise<void> {
  for (let i = 0; i < tries; i++) {
    if (query() === null) return;
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error("the drawer was still open after Escape");
}
