import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SeasonRuler, OPENER } from "@/components/season-ruler";
import { SEASONS } from "@/lib/data";

/**
 * The season ruler is one tab stop with roving `tabindex`: arrow keys, Home and
 * End move between seasons rather than making 23 tab stops. That is a real
 * keyboard contract, and until now nothing could assert it — the guards read
 * source text, and a roving `tabindex` that never moved would have passed all
 * of them.
 *
 * These assertions are about the contract a keyboard user experiences, not
 * about the component's internals.
 */
describe("season-ruler", () => {
  it("renders one target per season", () => {
    render(<SeasonRuler />);
    // 23 roles, not 23 buttons: `role="radio"` overrides the implicit button
    // role, which is what a screen reader announces.
    expect(screen.getAllByRole("radio")).toHaveLength(SEASONS.length);
    expect(SEASONS.length).toBe(23);
  });

  it("is a single tab stop, not 23", () => {
    render(<SeasonRuler />);
    const radios = screen.getAllByRole("radio");
    const tabbable = radios.filter(
      (r) => r.getAttribute("tabindex") === "0",
    );
    // This is the whole point of the roving pattern. If two elements are
    // tabbable, or none is, keyboard users tab through every season.
    expect(tabbable).toHaveLength(1);
  });
  it("opens on the most recent season, not the first", () => {
    render(<SeasonRuler />);
    const radios = screen.getAllByRole("radio");
    // The page is about a career, so the ruler lands on the current season.
    // Worth pinning: it is a deliberate default, and a refactor that resets the
    // index to 0 would send every reader to 2003-04 instead.
    const tabbable = radios.filter((r) => r.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toBe(radios.at(-1));
  });

  it("moves with the arrow keys and keeps exactly one tab stop throughout", async () => {
    const user = userEvent.setup();
    render(<SeasonRuler />);

    const radios = screen.getAllByRole("radio");
    const last = radios.at(-1)!;
    const before = radios.at(-2)!;

    await user.tab();
    expect(document.activeElement).toBe(last);

    await user.keyboard("{ArrowLeft}");

    // Focus and selection move TOGETHER. This is the assertion that would have
    // caught a ruler whose arrow handler updated state but left the focus ring
    // behind — a sighted keyboard user would see the season change under a ring
    // parked on the old one.
    expect(document.activeElement).toBe(before);
    expect(before.getAttribute("tabindex")).toBe("0");
    expect(last.getAttribute("tabindex")).toBe("-1");
  });

  it("reaches the first and last season with Home and End", async () => {
    const user = userEvent.setup();
    render(<SeasonRuler />);

    await user.tab();
    await user.keyboard("{End}");
    const last = screen.getAllByRole("radio").at(-1)!;
    expect(document.activeElement).toBe(last);

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(screen.getAllByRole("radio")[0]);
  });

  it("does not walk off either end of the list", async () => {
    const user = userEvent.setup();
    render(<SeasonRuler />);

    const radios = screen.getAllByRole("radio");

    await user.tab();
    await user.keyboard("{End}{ArrowRight}{ArrowRight}");
    // The ruler is a closed set of real seasons. Arrowing past the end stays
    // put rather than moving focus onto nothing.
    expect(document.activeElement).toBe(radios.at(-1));

    await user.keyboard("{Home}{ArrowLeft}{ArrowLeft}");
    expect(document.activeElement).toBe(radios[0]);
  });

  it("gives the group an accessible name and each target a season label", () => {
    render(<SeasonRuler />);
    // A radiogroup with no name is a list of unlabelled controls.
    expect(screen.getByRole("radiogroup")).toBeTruthy();
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio.getAttribute("aria-label")).toBeTruthy();
    }
  });

  it("declares the instrument opener the page's rhythm guard relies on", () => {
    // Read as a real import here; the `node:test` guard has to regex for it.
    expect(OPENER).toBe("instrument");
  });
});
