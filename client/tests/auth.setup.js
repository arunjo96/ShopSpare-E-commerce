

import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("example@gmail.com").fill("your-email@gmail.com");

  await page.getByPlaceholder("Enter password").fill("Test@12345");
await page.getByTestId("login-button").click();


  await expect(page).not.toHaveURL(/login/);

  await expect(page.getByTestId("profile-menu-button")).toBeVisible({
    timeout: 15000,
  });

  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});
