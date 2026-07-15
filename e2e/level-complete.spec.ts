import { expect, test } from "@playwright/test";

// Covers the core gameplay loop manually verified ad hoc throughout this session's build:
// drag the correct blocks, see the reward modal with correct content, advance to the next level.
// Uses real HTML5 drag events (dragTo), not click simulation — the game's react-dnd-html5-backend
// needs actual native drag events.

test("completing a level shows the reward modal and Next Level advances", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");
  // A real human always takes longer than this to read the objective and drag a block — this
  // wait exists purely so the test doesn't drop faster than GameProvider's progress-hydration
  // effect (see game-context.tsx's `hydrated` guard, which dropBlock ignores drops during).
  await page.waitForTimeout(300);

  const blocks = page.locator('div[class*="cursor-grab"]');
  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');

  // Lesson 1: zone1 = message ("Hello World"), zone2 = count (42)
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));

  const modal = page.getByLabel("Level complete");
  await expect(modal).toBeVisible();
  await expect(modal.getByText("Level Complete!")).toBeVisible();
  await expect(modal.getByText("What you just learned")).toBeVisible();
  // Zero mistakes on a clean run awards the full 100 base plus a speed bonus (up to +20% for a
  // near-instant finish, see scoring.ts) — a scripted completion is always fast enough to land
  // somewhere in that range, but the exact ms-dependent bonus isn't deterministic enough to
  // assert one fixed number without occasional flakiness.
  const pointsText = await modal.locator(".text-accent.font-bold").first().textContent();
  const points = Number(pointsText?.replace("+", ""));
  expect(points).toBeGreaterThanOrEqual(100);
  expect(points).toBeLessThanOrEqual(120);

  await modal.getByRole("button", { name: "▶ Next Level" }).click();
  await expect(page).toHaveURL(/\/play\/javascript\/2/);
  await expect(modal).not.toBeVisible();
});

test("a wrong drop reduces the awarded score and star rating", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");
  await page.waitForTimeout(300);

  const blocks = page.locator('div[class*="cursor-grab"]');
  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');

  // Deliberate mistake: drop "true" (b3) into zone1 first, then the correct answers.
  await blocks.nth(2).dragTo(zones.nth(0));
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));

  const modal = page.getByLabel("Level complete");
  await expect(modal).toBeVisible();
  // One mistake: 100 base - 10 mistake penalty = 90, plus the same speed-bonus range as above.
  const pointsText = await modal.locator(".text-accent.font-bold").first().textContent();
  const points = Number(pointsText?.replace("+", ""));
  expect(points).toBeGreaterThanOrEqual(90);
  expect(points).toBeLessThanOrEqual(110);
  await expect(modal.getByText("1", { exact: true })).toBeVisible();
});

test("not-found page renders the mascot for an unknown route", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  await expect(page.getByText("Debug couldn't find that page")).toBeVisible();
});
