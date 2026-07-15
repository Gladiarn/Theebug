import { expect, test } from "@playwright/test";

// Regression coverage for a real bug found while building the difficulty-weighted scoring system
// (see upgrade-plan.md item #19): dropBlock's completion branch used to unconditionally add
// levelScore to the running total, so replaying an already-completed level via Sidebar inflated
// the track's score without bound. Fixed by deriving score/totalTimeMs from a per-level
// best-score/fastest-time map instead of incrementing a running total directly.

async function readTrackProgress(page: import("@playwright/test").Page, trackId: string) {
  return page.evaluate((tid) => {
    const raw = localStorage.getItem("codecanvas:progress:v1");
    const all = raw ? JSON.parse(raw) : {};
    return all[tid] ?? null;
  }, trackId);
}

test("replaying an already-completed level with a worse attempt does not inflate the score", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");
  await page.waitForTimeout(300);

  const blocks = page.locator('div[class*="cursor-grab"]');
  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');

  // Clean first attempt: +100.
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));
  await page.getByLabel("Level complete").waitFor({ state: "visible" });
  await page.waitForTimeout(200);

  let progress = await readTrackProgress(page, "javascript");
  expect(progress.score).toBe(100);

  // Replay the same level with 2 deliberate mistakes (a worse attempt, worth only 80).
  await page.getByLabel("Level complete").getByRole("button", { name: "Review level" }).click();
  await page.waitForTimeout(200);
  await page.goto("/play/javascript/1");
  await page.waitForTimeout(300);

  await blocks.nth(2).dragTo(zones.nth(0));
  await blocks.nth(3).dragTo(zones.nth(0));
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));
  await page.getByLabel("Level complete").waitFor({ state: "visible" });
  await page.waitForTimeout(200);

  progress = await readTrackProgress(page, "javascript");
  // The bug this guards against would make this 180 (100 + 80), not 100.
  expect(progress.score).toBe(100);
});

test("replaying an already-completed level with a better attempt does improve the score", async ({ page }) => {
  await page.goto("/play/javascript/1");
  await page.waitForSelector("text=Debug says");
  await page.waitForTimeout(300);

  const blocks = page.locator('div[class*="cursor-grab"]');
  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');

  // First attempt with one mistake: +90.
  await blocks.nth(2).dragTo(zones.nth(0));
  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));
  await page.getByLabel("Level complete").waitFor({ state: "visible" });
  await page.waitForTimeout(200);

  let progress = await readTrackProgress(page, "javascript");
  expect(progress.score).toBe(90);

  // Replay cleanly — a genuinely better attempt should raise the stored score to 100.
  await page.getByLabel("Level complete").getByRole("button", { name: "Review level" }).click();
  await page.waitForTimeout(200);
  await page.goto("/play/javascript/1");
  await page.waitForTimeout(300);

  await blocks.nth(0).dragTo(zones.nth(0));
  await blocks.nth(1).dragTo(zones.nth(1));
  await page.getByLabel("Level complete").waitFor({ state: "visible" });
  await page.waitForTimeout(200);

  progress = await readTrackProgress(page, "javascript");
  expect(progress.score).toBe(100);
});
