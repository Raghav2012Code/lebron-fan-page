import { describe, it, expect } from "vitest";

import { interpolate } from "@/components/the-block";
import { THE_BLOCK } from "@/lib/data";

/**
 * `interpolate` was only ever observed through a mounted `TheBlock` at
 * `time = 0`, which is the below-first clamp and nothing else. These tests
 * drive each branch directly, including the above-last clamp and the linear
 * segment, neither of which a resting render reaches.
 */
const kfs = THE_BLOCK.keyframes;

describe("the-block interpolate", () => {
  it("clamps to the first keyframe below the start", () => {
    const r = interpolate(-99, kfs);
    expect(r.keyframe).toBe(kfs[0]);
    expect(r.lebron.x).toBe(kfs[0].lebron.x);
    expect(r.iguodala.y).toBe(kfs[0].iguodala.y);
  });

  it("clamps to the last keyframe past the end", () => {
    const last = kfs[kfs.length - 1];
    const r = interpolate(999, kfs);
    expect(r.keyframe).toBe(last);
    expect(r.lebron.x).toBe(last.lebron.x);
    expect(r.ball.y).toBe(last.ball.y);
  });

  it("interpolates linearly between two keyframes", () => {
    const k0 = kfs[0];
    const k1 = kfs[1];
    const t = (k0.time + k1.time) / 2;
    const r = interpolate(t, kfs);
    expect(r.lebron.x).toBeCloseTo((k0.lebron.x + k1.lebron.x) / 2);
    expect(r.lebron.elevation).toBeCloseTo(
      (k0.lebron.elevation + k1.lebron.elevation) / 2,
    );
    expect(r.iguodala.y).toBeCloseTo((k0.iguodala.y + k1.iguodala.y) / 2);
  });

  it("picks the nearer keyframe for the annotation", () => {
    const k0 = kfs[0];
    const k1 = kfs[1];
    const span = k1.time - k0.time;
    expect(interpolate(k0.time + span * 0.25, kfs).keyframe).toBe(k0);
    expect(interpolate(k0.time + span * 0.75, kfs).keyframe).toBe(k1);
  });
});
