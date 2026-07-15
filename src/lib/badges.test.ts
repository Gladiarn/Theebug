import { describe, expect, it } from "vitest";
import { computeBadges } from "./badges";
import type { LevelStatsMap, ProgressMap } from "./progress-store";
import type { Track } from "./tracks";

function track(id: string, levelCount: number): Track {
  return {
    id,
    title: id.toUpperCase(),
    description: "",
    color: "#000",
    levels: Array.from({ length: levelCount }, (_, i) => ({
      id: i + 1,
      title: `Level ${i + 1}`,
      filename: `l${i + 1}.js`,
      difficulty: "easy" as const,
      objective: "",
      preview: [],
      codeLines: [],
      zones: [],
      blocks: [],
      wormIntro: "",
      wormCorrectAll: "",
      concept: { summary: "", details: [] },
    })),
  };
}

// Builds a levelStats map where every id in `perfectIds` is flagged perfect and every other
// completed level (1..levelCount) is not — score/timeMs values don't matter for badge logic.
function levelStats(levelCount: number, perfectIds: number[]): LevelStatsMap {
  return Object.fromEntries(
    Array.from({ length: levelCount }, (_, i) => i + 1).map((id) => [
      id,
      { score: 100, timeMs: 1000, perfect: perfectIds.includes(id) },
    ]),
  );
}

const updatedAt = "2026-01-01T00:00:00.000Z";

describe("computeBadges", () => {
  it("awards nothing for a user with no progress", () => {
    expect(computeBadges({}, [track("js", 5)])).toEqual([]);
  });

  it("awards Getting Started after any single completed level", () => {
    const progress: ProgressMap = { js: { completedLevels: [1], score: 100, lastLevelIndex: 0, updatedAt } };
    const badges = computeBadges(progress, [track("js", 5)]);
    expect(badges.map((b) => b.id)).toContain("getting-started");
    expect(badges.map((b) => b.id)).not.toContain("polyglot");
  });

  it("awards Polyglot once 2+ tracks have any progress", () => {
    const progress: ProgressMap = {
      js: { completedLevels: [1], score: 100, lastLevelIndex: 0, updatedAt },
      python: { completedLevels: [1], score: 100, lastLevelIndex: 0, updatedAt },
    };
    const badges = computeBadges(progress, [track("js", 5), track("python", 5)]);
    expect(badges.map((b) => b.id)).toContain("polyglot");
  });

  it("awards track-complete when every level is done, without perfectionist if any level wasn't clean", () => {
    const progress: ProgressMap = {
      js: {
        completedLevels: [1, 2, 3],
        score: 250,
        lastLevelIndex: 2,
        updatedAt,
        levelStats: levelStats(3, [1, 2]), // level 3 was never completed with zero mistakes/hints
      },
    };
    const badges = computeBadges(progress, [track("js", 3)]);
    expect(badges.map((b) => b.id)).toContain("complete-js");
    expect(badges.map((b) => b.id)).not.toContain("perfect-js");
  });

  it("awards perfectionist only when every level's levelStats is flagged perfect", () => {
    const progress: ProgressMap = {
      js: {
        completedLevels: [1, 2, 3],
        score: 300,
        lastLevelIndex: 2,
        updatedAt,
        levelStats: levelStats(3, [1, 2, 3]),
      },
    };
    const badges = computeBadges(progress, [track("js", 3)]);
    expect(badges.map((b) => b.id)).toContain("complete-js");
    expect(badges.map((b) => b.id)).toContain("perfect-js");
  });

  it("does not award perfectionist when levelStats is missing entirely (progress saved before it existed)", () => {
    const progress: ProgressMap = {
      js: { completedLevels: [1, 2, 3], score: 300, lastLevelIndex: 2, updatedAt },
    };
    const badges = computeBadges(progress, [track("js", 3)]);
    expect(badges.map((b) => b.id)).toContain("complete-js");
    expect(badges.map((b) => b.id)).not.toContain("perfect-js");
  });

  it("awards halfway-there for partial progress past 50%, not track-complete", () => {
    const progress: ProgressMap = {
      js: { completedLevels: [1, 2, 3], score: 300, lastLevelIndex: 2, updatedAt },
    };
    const badges = computeBadges(progress, [track("js", 5)]);
    expect(badges.map((b) => b.id)).toContain("halfway-js");
    expect(badges.map((b) => b.id)).not.toContain("complete-js");
  });
});
