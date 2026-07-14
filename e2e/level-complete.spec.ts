import { expect, test } from "@playwright/test";

// Covers the core gameplay loop manually verified ad hoc throughout this session's build:
// drag the correct blocks, see the reward modal with correct content, advance to the next level.
// Uses real HTML5 drag events (dragTo), not click simulation — the game's react-dnd-html5-backend
// needs actual native drag events.

test("completing a level shows the reward modal and Next Level advances", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");

  const blocks = page.locator('div[class*="cursor-grab"]');
  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');

  // Lesson 1: zone1 = message ("Hello World"), zone2 = count (42)
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));

  const modal = page.getByLabel("Level complete");
  await expect(modal).toBeVisible();
  await expect(modal.getByText("Level Complete!")).toBeVisible();
  await expect(modal.getByText("What you just learned")).toBeVisible();
  // Zero mistakes on a clean run should award the full 100 points and 3 stars.
  await expect(modal.getByText("+100")).toBeVisible();

  await modal.getByRole("button", { name: "▶ Next Level" }).click();
  await expect(page).toHaveURL(/\/play\/javascript\/2/);
  await expect(modal).not.toBeVisible();
});

test("a wrong drop reduces the awarded score and star rating", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");

  const blocks = page.locator('div[class*="cursor-grab"]');
  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');

  // Deliberate mistake: drop "true" (b3) into zone1 first, then the correct answers.
  await blocks.nth(2).dragTo(zones.nth(0));
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));

  const modal = page.getByLabel("Level complete");
  await expect(modal).toBeVisible();
  await expect(modal.getByText("+90")).toBeVisible();
  await expect(modal.getByText("1", { exact: true })).toBeVisible();
});

test("not-found page renders the mascot for an unknown route", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  await expect(page.getByText("Debug couldn't find that page")).toBeVisible();
});
