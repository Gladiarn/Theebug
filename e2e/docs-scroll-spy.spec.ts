import { expect, test } from "@playwright/test";

// Regression coverage for a scroll-spy bug: clicking a sidebar section link would sometimes
// leave the *previous* section marked active instead of the clicked one, and scrolling up after
// a click could skip a section entirely. Root cause was comparing IntersectionObserver's cached
// per-entry `boundingClientRect` snapshots (frozen at whatever moment that entry last fired)
// against each other — stale-vs-fresh geometry from different callback times. Fixed by always
// re-measuring live geometry at decision time instead of trusting cached entry rects.

function activeLabel(page: import("@playwright/test").Page) {
  return page.evaluate(() => document.querySelector("nav a.text-accent")?.textContent ?? null);
}

test("clicking every docs sidebar link activates that exact section", async ({ page }) => {
  await page.goto("/docs/javascript");
  await page.waitForSelector("text=Error Handling");

  const labels = await page.locator("nav a").allTextContents();
  expect(labels.length).toBeGreaterThan(5);

  for (const label of labels) {
    await page.getByRole("link", { name: label, exact: true }).click();
    await expect(page.locator("nav a.text-accent")).toHaveText(label);
  }
});

test("scrolling up after a click still activates sections in between, not just the endpoints", async ({ page }) => {
  await page.goto("/docs/javascript");
  await page.waitForSelector("text=Error Handling");

  await page.getByRole("link", { name: "Array Methods: map, filter, reduce" }).click();
  await page.getByRole("link", { name: "Conditionals", exact: true }).click();
  await expect(page.locator("nav a.text-accent")).toHaveText("Conditionals");

  const seen = new Set<string>();
  for (let i = 0; i < 15; i++) {
    await page.evaluate(() => {
      document.querySelectorAll(".overflow-y-auto")[1]?.scrollBy(0, -100);
    });
    await page.waitForTimeout(100);
    const label = await activeLabel(page);
    if (label) seen.add(label);
  }

  expect(seen.has("Objects")).toBe(true);
});

test("reaching the bottom via small incremental scroll steps activates the last section", async ({ page }) => {
  // Shorter docs pages (baseline-depth reference content, few sections) can hit max scroll
  // before the last section's top ever reaches the detection band. IntersectionObserver also
  // only calls back on a threshold *crossing* — settling at the exact bottom via several small
  // steps can arrive without any further crossing firing on the final step, leaving stale
  // state. Both needed a fix: an explicit "at max scroll -> last section active" rule, plus a
  // scroll-event listener as a backstop so recompute isn't solely dependent on
  // IntersectionObserver firing. Uses /docs/css (still baseline-depth, few short sections) —
  // not hardcoded to a specific section title, since docs content grows over time.
  await page.goto("/docs/css");
  await page.waitForSelector("nav a");
  const lastLabel = (await page.locator("nav a").allTextContents()).at(-1);
  if (!lastLabel) throw new Error("no sidebar links found");

  const maxScroll = await page.evaluate(() => {
    const el = document.querySelectorAll(".overflow-y-auto")[1];
    return el.scrollHeight - el.clientHeight;
  });

  for (let i = 1; i <= 20; i++) {
    await page.evaluate((pos) => {
      document.querySelectorAll(".overflow-y-auto")[1].scrollTop = pos;
    }, Math.round((maxScroll * i) / 20));
    await page.waitForTimeout(60);
  }

  await expect(page.locator("nav a.text-accent")).toHaveText(lastLabel);
});
