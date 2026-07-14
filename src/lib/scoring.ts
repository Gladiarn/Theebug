// Score awarded for completing a level: a flat 100, minus 10 per mistake, floored at 40
// so even a rough attempt still earns a meaningful reward.
export function calculateLevelScore(mistakes: number): number {
  return Math.max(40, 100 - mistakes * 10);
}
