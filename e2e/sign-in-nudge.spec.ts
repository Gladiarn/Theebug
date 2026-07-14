import { expect, test } from "@playwright/test";

// Anonymous progress only lives in localStorage — after enough levels are completed without
// signing in, a dismissible nudge should appear suggesting sign-in, and stay dismissed once closed.

async function completeLevel(page: import("@playwright/test").Page, trackId: string, levelId: number, correctIdxs: number[]) {
  await page.goto(`/play/${trackId}/${levelId}`);
  await page.waitForSelector("text=Debug says");
  // A real human always takes longer than this to read the objective and drag a block — this
  // wait exists purely so the test doesn't complete a level faster than GameProvider's
  // progress-hydration effect (see game-context.tsx's `hydrated` guard), which dropBlock now
  // ignores drops during anyway. Without this, an E2E test caught a real bug: completing a
  // level before hydration finishes used to save over (not merge with) earlier progress.
  await page.waitForTimeout(150);
  const blocks = page.locator('div[class*="cursor-grab"]');
  const zones = page.locator('span[class*="min-w-\\[90px\\]"]');
  for (let i = 0; i < correctIdxs.length; i++) {
    await blocks.nth(correctIdxs[i]).dragTo(zones.nth(i));
  }
  await expect(page.getByLabel("Level complete")).toBeVisible();
}

test("shows after 3 anonymous level completions and stays dismissed", async ({ page }) => {
  await completeLevel(page, "javascript", 1, [0, 1]);
  await completeLevel(page, "javascript", 2, [0]);
  await completeLevel(page, "javascript", 3, [0]);

  await page.getByLabel("Level complete").getByRole("button", { name: "Review level" }).click();

  const nudge = page.getByText("Don't lose your progress!");
  await expect(nudge).toBeVisible();

  await page.getByLabel("Dismiss").click();
  await expect(nudge).not.toBeVisible();

  await page.reload();
  await expect(nudge).not.toBeVisible();
});
