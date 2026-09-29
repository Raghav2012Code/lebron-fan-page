import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { SECTIONS, CAREER, SEASONS } from "@/lib/data";
import { SeasonRuler } from "@/components/season-ruler";
import { HonoursBoard } from "@/components/honours-board";
import { TheLine } from "@/components/the-line";
import { TheRooms } from "@/components/the-rooms";
import { FatherAndSon } from "@/components/father-and-son";
import { TheLedger } from "@/components/the-ledger";
import { ShotZones } from "@/components/shot-zones";
import { PlayoffMatrix } from "@/components/playoff-matrix";
import { EraCompare } from "@/components/era-compare";
import { TwentyThree } from "@/components/twenty-three";
import { LastShot } from "@/components/last-shot";
import { FourNights } from "@/components/four-nights";
import { TheBlock } from "@/components/the-block";

/**
 * Every registered section, rendered.
 *
 * `SECTIONS` is the navigation registry, and `G7` asserts by reading source
 * that each registered id is rendered exactly once. That guard cannot tell
 * whether the component renders *at all* — a section that throws on mount still
 * has its `id` in the source text, so `G7` stays green. This file closes that
 * gap for thirteen of the sixteen sections, by mounting each one.
 *
 * The value of this file is mostly at the moment a refactor lands: a component
 * that starts depending on a browser API jsdom lacks, or a prop that becomes
 * required, fails here with a real stack rather than in a browser.
 */
const SECTIONS_RENDERABLE: [string, () => React.JSX.Element][] = [
  ["span", () => <SeasonRuler />],
  ["hardware", () => <HonoursBoard />],
  ["line", () => <TheLine />],
  ["rooms", () => <TheRooms />],
  ["father-son", () => <FatherAndSon />],
  ["ledger", () => <TheLedger />],
  ["shot-zones", () => <ShotZones />],
  ["playoff-matrix", () => <PlayoffMatrix />],
  ["era-compare", () => <EraCompare />],
  ["number", () => <TwentyThree />],
  ["shot", () => <LastShot />],
  ["nights", () => <FourNights />],
  ["the-block", () => <TheBlock />],
];

describe("every registered section", () => {
  it("covers every id in the navigation registry", () => {
    // If a section is added to `SECTIONS` and not listed here, this fails. That
    // is the point: a new section is not covered until someone says so.
    const covered = SECTIONS_RENDERABLE.map(([id]) => id).sort();
    const registered = SECTIONS.map((s) => s.id).sort();
    expect(covered).toEqual(registered);
  });

  for (const [id, Component] of SECTIONS_RENDERABLE) {
    it(`mounts #${id} and renders it exactly once`, () => {
      const { container } = render(<Component />);
      const matches = container.querySelectorAll(`#${CSS.escape(id)}`);
      expect(matches).toHaveLength(1);
    });

    it(`gives #${id} its scroll clearance at runtime, not just in source`, () => {
      // `G2` asserts the class name is present in the source text. This asserts
      // the class is actually on the element the browser would scroll to. A
      // section that moved its id onto a child would pass G2 and fail here.
      const { container } = render(<Component />);
      const target = container.querySelector(`#${CSS.escape(id)}`)!;
      const classes = (target.className ?? "").split(/\s+/);
      expect(classes).toContain("scroll-clearance");
    });
  }

  it("renders a heading for every section, so the page has a navigable outline", () => {
    for (const [id, Component] of SECTIONS_RENDERABLE) {
      const { unmount } = render(<Component />);
      const headings = screen.queryAllByRole("heading");
      expect(
        headings.length,
        `#${id} rendered no heading at all, so it is invisible in a heading list`,
      ).toBeGreaterThan(0);
      unmount();
    }
  });
});

/**
 * A page-wide invariant that is cheap here and impossible in the source guards:
 * the career figures the page draws are the ones in the data module.
 */
describe("page figures", () => {
  it("renders the career points the data module declares", () => {
    const { container } = render(<TheLine />);
    // 43,440 with the thousands separator the page uses, not 43440.
    expect(container.textContent).toContain(
      CAREER.headline[0].total.toLocaleString("en-US"),
    );
  });

  it("renders 23 seasons on the ruler", () => {
    render(<SeasonRuler />);
    expect(SEASONS).toHaveLength(23);
  });
});
