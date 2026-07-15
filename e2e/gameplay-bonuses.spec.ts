import { expect, test } from "@playwright/test";

// Regression coverage for the scoring system's newer pieces (see upgrade-plan.md): the hint
// system and the clean-completion streak bonus. Speed bonus itself is already exercised
// indirectly by level-complete.spec.ts's range assertions; this file covers the two mechanics
// that need their own dedicated scenarios.

test("using a hint highlights the correct block, clears once dropped, and costs points", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");
  await page.waitForTimeout(300);

  const hintButton = page.getByRole("button", { name: /Use a hint/ });
  await expect(hintButton).toBeVisible();
  await hintButton.click();
  await page.waitForTimeout(200);

  // Exactly one block is highlighted, and it's genuinely the correct answer for zone1
  // ("Hello World") — not just some arbitrary block.
  const highlighted = page.locator('div[class*="cursor-grab"].animate-pulse');
  await expect(highlighted).toHaveCount(1);
  await expect(highlighted).toHaveText('"Hello World"');
  await expect(page.getByRole("button", { name: "Hint (1 used)" })).toBeVisible();

  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');
  await highlighted.dragTo(zones.nth(0));
  await page.waitForTimeout(200);

  // The highlight clears once that specific zone is actually correct.
  await expect(page.locator('div[class*="cursor-grab"].animate-pulse')).toHaveCount(0);

  const blocks = page.locator('div[class*="cursor-grab"]');
  await blocks.filter({ hasText: "42" }).first().dragTo(zones.nth(1));
  const modal = page.getByLabel("Level complete");
  await modal.waitFor({ state: "visible" });
  await page.waitForTimeout(200);

  // One hint used, zero mistakes: 100 base - 20 hint penalty, plus up to +20 speed bonus — always
  // strictly less than a hint-free clean run's ceiling of 120, proving the hint genuinely cost
  // something rather than being a free reveal.
  await expect(modal.getByText("Hints used")).toBeVisible();
  const pointsText = await modal.locator(".text-accent.font-bold").first().textContent();
  const points = Number(pointsText?.replace("+", ""));
  expect(points).toBeLessThan(120);
  expect(points).toBeGreaterThanOrEqual(80);
});

test("a second consecutive clean level awards a streak bonus the first one didn't get", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");
  await page.waitForTimeout(300);

  let blocks = page.locator('div[class*="cursor-grab"]');
  let zones = page.locator('span[class*="min-w-\\[90px\\]"]');
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));

  let modal = page.getByLabel("Level complete");
  await modal.waitFor({ state: "visible" });
  await page.waitForTimeout(200);
  // First clean completion of the session: streak = 1, no streak bonus yet.
  await expect(modal.getByText("Streak bonus")).not.toBeVisible();

  await modal.getByRole("button", { name: "▶ Next Level" }).click();
  await page.waitForTimeout(400);
  await page.waitForSelector("text=Debug says");

  blocks = page.locator('div[class*="cursor-grab"]');
  zones = page.locator('span[class*="min-w-\\[90px\\]"]');
  await blocks.filter({ hasText: "a + b" }).first().dragTo(zones.nth(0));

  modal = page.getByLabel("Level complete");
  await modal.waitFor({ state: "visible" });
  await page.waitForTimeout(200);
  // Second consecutive clean completion: streak = 2, streak bonus should now show.
  await expect(modal.getByText("Streak bonus")).toBeVisible();
});
