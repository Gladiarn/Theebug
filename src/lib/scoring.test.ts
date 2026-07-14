import { describe, expect, it } from "vitest";
import { calculateLevelScore } from "./scoring";

describe("calculateLevelScore", () => {
  it("awards 100 for a perfect run", () => {
    expect(calculateLevelScore(0)).toBe(100);
  });

  it("deducts 10 per mistake", () => {
    expect(calculateLevelScore(1)).toBe(90);
    expect(calculateLevelScore(3)).toBe(70);
  });

  it("floors at 40 no matter how many mistakes", () => {
    expect(calculateLevelScore(6)).toBe(40);
    expect(calculateLevelScore(20)).toBe(40);
  });

  it("never returns a negative score", () => {
    expect(calculateLevelScore(1000)).toBeGreaterThanOrEqual(40);
  });
});
