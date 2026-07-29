

import { test, expect } from "@playwright/test";

test("User should logout successfully", async ({ page }) => {
  await page.goto("/");

  // Wait for auth restore
  await page.waitForLoadState("networkidle");

  const profileBtn = page.getByTestId("profile-menu-button");

  await expect(profileBtn).toBeVisible({
    timeout: 15000,
  });

  await profileBtn.click();

  const logoutBtn = page.getByRole("button", {
    name: "Logout",
    exact: true,
  });

  await expect(logoutBtn).toBeVisible();

  await logoutBtn.click();

  await expect(page).toHaveURL(/login|register|\/$/);
});