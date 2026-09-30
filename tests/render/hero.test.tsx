import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { CenterCourt, OPENER } from "@/components/center-court";
import { CourtDiagram, COURT_PAINT_ASPECT } from "@/components/court-diagram";
import { CourtShell } from "@/components/court-shell";
import { BackToTop } from "@/components/back-to-top";

/**
 * The four components the render layer never touched.
 *
 * `court-diagram`, `center-court`, `court-shell` and `back-to-top` had zero
 * imports from any test. That is the gap the render layer exists to close: a
 * component that throws on mount, or starts depending on a browser API jsdom
 * lacks, fails here with a real stack rather than only in a browser. These are
 * mount-and-assert-something tests, not behavioural ones — the point is that
 * the hero and the shell are exercised at all.
 */
describe("hero and shell", () => {
  it("renders the painted hero name over the court", () => {
    const { container } = render(<CenterCourt />);
    expect(container.textContent).toContain("LEBRON");
    expect(container.textContent).toContain("JAMES");
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("declares the device opener the page rhythm guard relies on", () => {
    expect(OPENER).toBe("device");
  });

  it("draws the half-court and exports a real aspect ratio", () => {
    const { container } = render(<CourtDiagram />);
    expect(container.querySelector("svg")).toBeTruthy();
    // `500 / 304`: 500 units wide, 470 deep minus the 166-unit top cut.
    expect(COURT_PAINT_ASPECT).toBe("500 / 304");
  });

  it("mounts the shell's main landmark as the skip target", () => {
    const { container } = render(
      <CourtShell>
        <p>child</p>
      </CourtShell>,
    );
    const main = container.querySelector("main#main");
    expect(main).toBeTruthy();
    expect(main?.getAttribute("tabindex")).toBe("-1");
    expect(main?.textContent).toContain("child");
  });

  it("renders no back-to-top control before the reader has scrolled", () => {
    // jsdom reports `window.scrollY === 0`, and the control only appears past
    // 600px. Asserting the resting state is the honest thing this layer can do.
    render(<BackToTop />);
    expect(screen.queryByRole("button", { name: "Back to top" })).toBeNull();
  });
});
