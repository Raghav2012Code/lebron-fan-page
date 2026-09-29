import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { SeasonRuler } from "@/components/season-ruler";
import { OPENER as RULER_OPENER } from "@/components/season-ruler";

/**
 * The first test in this repo that puts a component in a DOM.
 *
 * It exists to prove the seam, not to assert much: if a `.tsx` file can be
 * imported, transformed and rendered, then everything the `node:test` suite
 * structurally could not do is now available. The meaningful assertions follow
 * in the other files here.
 */
describe("the render seam", () => {
  it("imports, transforms and renders a .tsx component", () => {
    render(<SeasonRuler />);
    // If this renders without throwing, the loader, the JSX transform and the
    // DOM all work. The specific content is season-ruler's business.
    expect(document.body.textContent).not.toBe("");
  });

  it("reads a component's exported OPENER as a value, not as source text", () => {
    // The `node:test` guards have to regex the source to learn this. Here it is
    // a real import, so a rename breaks the compiler instead of a pattern.
    expect(RULER_OPENER).toBe("instrument");
  });

  it("has a screen role to query, which means the markup is not opaque", () => {
    render(<SeasonRuler />);
    // Proves the queries the rest of this directory relies on resolve against
    // real rendered output. `radio`, not `button`: the explicit role overrides
    // the implicit one, and a screen reader announces it.
    expect(screen.getAllByRole("radio").length).toBe(23);
  });
});
