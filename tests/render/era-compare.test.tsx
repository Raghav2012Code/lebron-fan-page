import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import { MetricRow } from "@/components/era-compare";

/**
 * `MetricRow`'s three winner branches were only ever reached through a mounted
 * `EraCompare`, where the live data does not exercise a tie and the zero/zero
 * case never occurs. Rendered directly, each branch is its own assertion — and
 * the zero sum is the one that used to divide `0 / 0` into a `NaN%` meter.
 */
const arrowAt = (html: string) => html.indexOf("▲");
const labelAt = (html: string) => html.indexOf(">X<");

describe("era-compare MetricRow", () => {
  it("marks the A side when A is higher", () => {
    const { container } = render(<MetricRow label="X" valA={10} valB={5} />);
    expect(container.textContent).toContain("higher by 5");
    expect(arrowAt(container.innerHTML)).toBeGreaterThanOrEqual(0);
    expect(arrowAt(container.innerHTML)).toBeLessThan(labelAt(container.innerHTML));
  });

  it("marks the B side when B is higher", () => {
    const { container } = render(<MetricRow label="X" valA={5} valB={10} />);
    expect(container.textContent).toContain("higher by 5");
    expect(arrowAt(container.innerHTML)).toBeGreaterThan(labelAt(container.innerHTML));
  });

  it("marks neither side on a tie", () => {
    const { container } = render(<MetricRow label="X" valA={5} valB={5} />);
    expect(container.textContent).toContain(", tied");
    expect(container.innerHTML).not.toContain("▲");
    expect(container.textContent).not.toContain("higher by");
  });

  it("renders a 50/50 meter and no NaN when both values are zero", () => {
    const { container } = render(<MetricRow label="X" valA={0} valB={0} />);
    expect(container.innerHTML).not.toContain("NaN");
    expect(container.textContent).toContain(", tied");
  });
});
