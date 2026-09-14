import test from "node:test";
import assert from "node:assert";
import { SEASONS, SECTIONS } from "@/lib/lebron-data";

test("smoke test - imports lebron-data via path alias", () => {
  assert.strictEqual(SEASONS.length, 23);
  assert.ok(SECTIONS.length > 0);
});

