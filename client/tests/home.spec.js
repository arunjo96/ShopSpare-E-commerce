import { test, expect } from "@playwright/test";

test("Home page should load successfully", async ({ page }) => {
  await page.goto("http://localhost:5173");


  await expect(page).toHaveURL("http://localhost:5173/");

  await expect(page.locator("body")).toBeVisible();
});
