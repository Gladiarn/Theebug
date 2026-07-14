import { describe, expect, it } from "vitest";
import { pickHigherScoreProgress } from "./progress-merge";
import type { TrackProgress } from "./progress-store";

function progress(score: number): TrackProgress {
  return { completedLevels: [1, 2], score, lastLevelIndex: 1, updatedAt: "2026-01-01T00:00:00.000Z" };
}

describe("pickHigherScoreProgress", () => {
  it("picks local when there's no existing server progress yet", () => {
    const local = progress(50);
    expect(pickHigherScoreProgress(local, undefined)).toBe(local);
  });

  it("picks local when it has a higher score", () => {
    const local = progress(100);
    const current = progress(60);
    expect(pickHigherScoreProgress(local, current)).toBe(local);
  });

  it("picks the existing server progress when it has a higher score — never regresses", () => {
    const local = progress(40);
    const current = progress(90);
    expect(pickHigherScoreProgress(local, current)).toBe(current);
  });

  it("picks the existing server progress on a tie (local must strictly exceed to win)", () => {
    const local = progress(70);
    const current = progress(70);
    expect(pickHigherScoreProgress(local, current)).toBe(current);
  });
});
