import { describe, expect, it } from "vitest";
import { calculateLevelScore } from "./scoring";

// PAR_SECONDS internals: easy=45, medium=90, hard=150. Using elapsedSeconds at exactly par with
// streak=1 isolates the base/mistake/hint math from the speed and streak bonuses (both resolve
// to 0 at those values), so most tests below deliberately hold those two constant.
const AT_PAR_EASY = { elapsedSeconds: 45, streak: 1 };

describe("calculateLevelScore", () => {
  it("awards the full base score with no bonuses for a perfect, at-par run", () => {
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, ...AT_PAR_EASY }).total).toBe(100);
    expect(
      calculateLevelScore({ difficulty: "medium", mistakes: 0, hintsUsed: 0, elapsedSeconds: 90, streak: 1 }).total,
    ).toBe(150);
    expect(
      calculateLevelScore({ difficulty: "hard", mistakes: 0, hintsUsed: 0, elapsedSeconds: 150, streak: 1 }).total,
    ).toBe(200);
  });

  it("deducts 10% of base per mistake", () => {
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 1, hintsUsed: 0, ...AT_PAR_EASY }).total).toBe(90);
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 3, hintsUsed: 0, ...AT_PAR_EASY }).total).toBe(70);
  });

  it("deducts 20% of base per hint used — double a mistake's penalty", () => {
    const result = calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 1, ...AT_PAR_EASY });
    expect(result.hintPenalty).toBe(20);
    expect(result.total).toBe(80);
  });

  it("floors the penalized portion at 40% of base no matter how many mistakes/hints", () => {
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 6, hintsUsed: 0, ...AT_PAR_EASY }).total).toBe(40);
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 20, hintsUsed: 5, ...AT_PAR_EASY }).total).toBe(40);
    expect(calculateLevelScore({ difficulty: "hard", mistakes: 20, hintsUsed: 0, elapsedSeconds: 150, streak: 1 }).total).toBe(80);
  });

  it("awards up to +20% of base for finishing well under par, tapering to +0% at par", () => {
    const instant = calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 0, streak: 1 });
    expect(instant.speedBonus).toBe(20); // 20% of 100
    expect(instant.total).toBe(120);

    const halfway = calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 22.5, streak: 1 });
    expect(halfway.speedBonus).toBe(10); // half of the max bonus, halfway to par

    const atPar = calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 45, streak: 1 });
    expect(atPar.speedBonus).toBe(0);
  });

  it("never awards a negative speed bonus for going past par — slow is never punished", () => {
    const result = calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 500, streak: 1 });
    expect(result.speedBonus).toBe(0);
    expect(result.total).toBe(100);
  });

  it("awards no streak bonus for a single clean level, then +5% per consecutive one, capped at +25%", () => {
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 45, streak: 1 }).streakBonus).toBe(0);
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 45, streak: 2 }).streakBonus).toBe(5);
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 45, streak: 6 }).streakBonus).toBe(25);
    expect(calculateLevelScore({ difficulty: "easy", mistakes: 0, hintsUsed: 0, elapsedSeconds: 45, streak: 20 }).streakBonus).toBe(25);
  });

  it("combines every component correctly in the total", () => {
    // Hard level, 1 mistake, instant finish, streak of 3.
    const result = calculateLevelScore({ difficulty: "hard", mistakes: 1, hintsUsed: 0, elapsedSeconds: 0, streak: 3 });
    expect(result.base).toBe(200);
    expect(result.mistakePenalty).toBe(20);
    expect(result.speedBonus).toBe(40); // 20% of 200
    expect(result.streakBonus).toBe(20); // 10% of 200 (streak 3 → (3-1)*5% = 10%)
    expect(result.total).toBe(200 - 20 + 40 + 20);
  });
});
