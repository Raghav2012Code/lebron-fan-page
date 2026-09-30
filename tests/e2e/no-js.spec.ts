import { expect, test, type Page } from "@playwright/test";

/**
 * Issue #33 — the rooms section's no-JS guarantee, asserted as external
 * behavior rather than markup shape.
 *
 * What a visitor perceives, at either width, with scripting disabled:
 *
 *   - six chapters, each exactly once, in authored order;
 *   - six visible room headings (the stage overlapping six more would make
 *     twelve — this is the desktop-soup detector);
 *   - no visible buttons in the section (the stage's six nav marks are
 *     `window.scrollTo` and cannot work without JS — the tab-order check).
 *
 * The width hand-off is encoded in the first assertion: below `lg` the CSS
 * stacked branch carries the chapters, at `lg` and above the `<noscript>`
 * copy does. If either branch renders unconditionally, a width gains a
 * duplicate and `toEqual` fails on length alone.
 *
 * The last test is the JS-on smoke: the stage must still exist, the fallback
 * must stay off the page, and hydration must produce no console errors — the
 * guard against this fix "passing" by withdrawing the stage for everyone.
 */

const ROOM_LABELS = [
  "Akron, 2000-2003",
  "Cleveland, 2003-2010",
  "Miami, 2010-2014",
  "Cleveland, again, 2014-2018",
  "Los Angeles, 2018-2026",
  "National colours, 2004-2024",
];

const WIDTHS = [375, 1280];

type RoomsSnapshot = {
  chapters: string[];
  headings: number;
  buttons: number;
};

/**
 * "Painted" means what a visitor can perceive: laid out (not under a
 * `display: none`), not `visibility: hidden`, and at least 5% effective
 * opacity across the ancestor chain — so a chapter parked at Framer's
 * serialised `opacity: 0` does not count as seen, while a real 0.14 design
 * value would.
 */
function readRooms(page: Page): Promise<RoomsSnapshot> {
  return page.evaluate(() => {
    const root = document.getElementById("rooms");
    if (!root) throw new Error("#rooms section not found");

    const painted = (el: HTMLElement): boolean => {
      if (el.offsetParent === null) return false;
      let node: HTMLElement | null = el;
      let opacity = 1;
      while (node) {
        const cs = getComputedStyle(node);
        if (cs.display === "none" || cs.visibility === "hidden") return false;
        opacity *= Number(cs.opacity);
        node = node.parentElement;
      }
      return opacity > 0.05;
    };

    const visible = (selector: string): Element[] =>
      Array.from(root.querySelectorAll(selector)).filter((el) =>
        painted(el as HTMLElement),
      );

    return {
      chapters: visible("section[aria-label]").map(
        (el) => el.getAttribute("aria-label") ?? "",
      ),
      headings: visible("h3").length,
      buttons: visible("button").length,
    };
  });
}

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const width of WIDTHS) {
    test(`renders each chapter exactly once at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 812 });
      await page.goto("/");
      const rooms = await readRooms(page);
      expect(rooms.chapters, "six chapters, once each, in order").toEqual(
        ROOM_LABELS,
      );
      expect(rooms.headings, "no overlapped second set of room headings").toBe(
        6,
      );
      expect(rooms.buttons, "no inert nav marks in the tab order").toBe(0);
    });
  }
});

test.describe("with JavaScript", () => {
  test("keeps the pinned stage and leaves the fallback off the page", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.setViewportSize({ width: 1280, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const rooms = await readRooms(page);
    expect(
      rooms.buttons,
      "the stage's nav marks are rendered and interactive",
    ).toBeGreaterThanOrEqual(1);
    expect(
      rooms.chapters,
      "the <noscript> copy must not render when scripting is on",
    ).toHaveLength(0);
    expect(errors, "hydration must be clean with the <noscript> style present").toEqual(
      [],
    );
  });
});
