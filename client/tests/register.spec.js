import { test, expect } from "@playwright/test";

test("User should register successfully", async ({ page }) => {
  // Open register page
  await page.goto("http://localhost:5173/register");

  await expect(page).toHaveURL(/register/);

  // Fill registration form
  await page.fill('input[name="name"]', "Playwright User");

  await page.fill('input[name="email"]', `test${Date.now()}@gmail.com`);

  await page.fill('input[name="password"]', "Test@12345");

  await page.click('button[type="submit"]');

  await expect(page).not.toHaveURL(/register/);
});
