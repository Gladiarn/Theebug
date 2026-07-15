import type { Difficulty } from "./tracks";

// Base score per level scales with difficulty — a hard level is worth more than an easy one, not
// just "more levels of the same value" (the flat-100 formula this replaced meant every level
// scored identically regardless of how hard it actually was, which is also why players so often
// landed on identical scores). Mistake penalty and the score floor both stay proportional (10% of
// base per mistake, floor at 40% of base), so easy levels behave exactly as before this change:
// 100 base, -10/mistake, floors at 40.
const DIFFICULTY_BASE: Record<Difficulty, number> = { easy: 100, medium: 150, hard: 200 };
const MISTAKE_PENALTY_RATIO = 0.1;
const MIN_SCORE_RATIO = 0.4;

// The max a level can award (zero mistakes) — badges.ts uses this to detect a zero-mistake track
// completion without needing a separate persisted per-level mistake record.
export function getLevelMaxScore(difficulty: Difficulty): number {
  return DIFFICULTY_BASE[difficulty];
}

export function calculateLevelScore(mistakes: number, difficulty: Difficulty): number {
  const base = DIFFICULTY_BASE[difficulty];
  const floor = Math.round(base * MIN_SCORE_RATIO);
  const penalty = Math.round(base * MISTAKE_PENALTY_RATIO * mistakes);
  return Math.max(floor, base - penalty);
}
