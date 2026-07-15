import { describe, expect, it } from "vitest";
import { calculateLevelScore, getLevelMaxScore } from "./scoring";

describe("calculateLevelScore", () => {
  it("awards the full base score for a perfect run, per difficulty", () => {
    expect(calculateLevelScore(0, "easy")).toBe(100);
    expect(calculateLevelScore(0, "medium")).toBe(150);
    expect(calculateLevelScore(0, "hard")).toBe(200);
  });

  it("deducts 10% of base per mistake", () => {
    expect(calculateLevelScore(1, "easy")).toBe(90);
    expect(calculateLevelScore(3, "easy")).toBe(70);
    expect(calculateLevelScore(1, "medium")).toBe(135);
    expect(calculateLevelScore(1, "hard")).toBe(180);
  });

  it("floors at 40% of base no matter how many mistakes", () => {
    expect(calculateLevelScore(6, "easy")).toBe(40);
    expect(calculateLevelScore(20, "easy")).toBe(40);
    expect(calculateLevelScore(6, "medium")).toBe(60);
    expect(calculateLevelScore(6, "hard")).toBe(80);
  });

  it("never returns less than the floor", () => {
    expect(calculateLevelScore(1000, "easy")).toBeGreaterThanOrEqual(40);
    expect(calculateLevelScore(1000, "hard")).toBeGreaterThanOrEqual(80);
  });
});

describe("getLevelMaxScore", () => {
  it("returns the difficulty's base score", () => {
    expect(getLevelMaxScore("easy")).toBe(100);
    expect(getLevelMaxScore("medium")).toBe(150);
    expect(getLevelMaxScore("hard")).toBe(200);
  });
});
