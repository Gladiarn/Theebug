import type { Difficulty } from "./tracks";

// Base score per level scales with difficulty — a hard level is worth more than an easy one.
const DIFFICULTY_BASE: Record<Difficulty, number> = { easy: 100, medium: 150, hard: 200 };

// A mistake costs 10% of base; a hint costs 20% — double, since revealing the actual answer is a
// bigger shortcut than a wrong guess. Both stack, floored so a rough attempt still earns
// something, never negative.
const MISTAKE_PENALTY_RATIO = 0.1;
const HINT_PENALTY_RATIO = 0.2;
const MIN_SCORE_RATIO = 0.4;

// Speed bonus: up to +20% of base for finishing well under par, tapering linearly to +0% right at
// par, and staying at +0% (never negative) for anyone slower — taking your time never costs
// anything beyond simply not earning this bonus. Independent of mistakes/hints on purpose: speed
// and accuracy are different skills, so a fast-but-sloppy run and a slow-but-perfect run can both
// still score well through their own bonus.
const MAX_SPEED_BONUS_RATIO = 0.2;
const PAR_SECONDS: Record<Difficulty, number> = { easy: 45, medium: 90, hard: 150 };

// Streak bonus: +5% of base per consecutive *clean* (zero mistakes, zero hints) level completed
// in a row, capped at +25% (a 6-level streak). A single clean level isn't a "streak" yet — the
// bonus only starts showing up from the second consecutive one. Resets to 0 the moment a level is
// finished with any mistake or hint used.
const STREAK_BONUS_PER_LEVEL = 0.05;
const MAX_STREAK_BONUS_RATIO = 0.25;

export interface ScoreBreakdown {
  base: number;
  mistakePenalty: number;
  hintPenalty: number;
  speedBonus: number;
  streakBonus: number;
  total: number;
}

export interface ScoreInput {
  difficulty: Difficulty;
  mistakes: number;
  hintsUsed: number;
  elapsedSeconds: number;
  // The clean-completion streak count *including this level*, if this attempt was itself clean
  // (zero mistakes, zero hints) — 0 otherwise. The caller decides what counts as clean and resets
  // this to 0 the moment it isn't, since that's product logic, not scoring math.
  streak: number;
}

export function calculateLevelScore(input: ScoreInput): ScoreBreakdown {
  const { difficulty, mistakes, hintsUsed, elapsedSeconds, streak } = input;
  const base = DIFFICULTY_BASE[difficulty];
  const floor = Math.round(base * MIN_SCORE_RATIO);

  const mistakePenalty = Math.round(base * MISTAKE_PENALTY_RATIO * mistakes);
  const hintPenalty = Math.round(base * HINT_PENALTY_RATIO * hintsUsed);
  const penalized = Math.max(floor, base - mistakePenalty - hintPenalty);

  const par = PAR_SECONDS[difficulty];
  const speedRatio = Math.max(0, (par - elapsedSeconds) / par) * MAX_SPEED_BONUS_RATIO;
  const speedBonus = Math.round(base * speedRatio);

  const streakRatio = Math.min(MAX_STREAK_BONUS_RATIO, Math.max(0, streak - 1) * STREAK_BONUS_PER_LEVEL);
  const streakBonus = Math.round(base * streakRatio);

  return {
    base,
    mistakePenalty,
    hintPenalty,
    speedBonus,
    streakBonus,
    total: penalized + speedBonus + streakBonus,
  };
}
