
import { test, expect } from "@playwright/test";

test("User should logout successfully", async ({ page }) => {
  await page.goto("/");

  // wait auth restore
  await page.waitForLoadState("networkidle");

  const profile = page.getByTestId("profile-menu-button");

  await expect(profile).toBeVisible({
    timeout: 15000,
  });

  await profile.click();

  const logoutBtn = page.getByRole("button", {
    name: /logout/i,
  });

  await expect(logoutBtn).toBeVisible();

  await logoutBtn.click();

  await expect(profile).not.toBeVisible({
    timeout: 10000,
  });
});