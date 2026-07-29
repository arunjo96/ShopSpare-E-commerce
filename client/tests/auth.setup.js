// import { test as setup, expect } from "@playwright/test";

// setup("authenticate", async ({ page }) => {
//   await page.goto("http://localhost:5173/login");

//   await page.fill('input[name="email"]', "arunjo9601@gmail.com");
//   await page.fill('input[name="password"]', "password");

//   await page.getByRole("button", { name: /login/i }).click();

//   await expect(page).toHaveURL("http://localhost:5173/");

//   await page.context().storageState({ path: "playwright/.auth/user.json" });
// });

// import { test as setup, expect } from "@playwright/test";

// setup("authenticate", async ({ page }) => {
//   await page.goto("/login");

//   await page.fill('input[name="email"]', "arunjo9601@gmail.com");

//   await page.fill('input[name="password"]', "password");

//   await page.getByRole("button", { name: /login/i }).click();

//   await page.waitForURL("/");

//   await expect(page.getByTestId("product-card").first()).toBeVisible();

//   await page.context().storageState({
//     path: "playwright/.auth/user.json",
//   });
// });

// import { test as setup, expect } from "@playwright/test";

// setup("authenticate", async ({ page }) => {
//   await page.goto("/login");

//   await expect(page.locator('input[name="email"]')).toBeVisible();

//   await page.fill('input[name="email"]', "arunjo9601@gmail.com");
//   await page.fill('input[name="password"]', "password");

//   await page.getByRole("button", { name: /login/i }).click();

//   await expect(page).toHaveURL("/");

//   await page.context().storageState({
//     path: "playwright/.auth/user.json",
//   });
// });

// import { test as setup, expect } from "@playwright/test";

// setup("authenticate", async ({ page }) => {
//   await page.goto("/login");

//   await page.fill('input[name="email"]', "arunjo9601@gmail.com");

//   await page.fill('input[name="password"]', "password");

//   await page
//     .getByRole("button", {
//       name: /login/i,
//     })
//     .click();

//   await expect(page).toHaveURL("/");

//   // wait redux auth restore
//   await expect(page.locator('[data-testid="profile-menu-button"]')).toBeVisible(
//     {
//       timeout: 10000,
//     },
//   );

//   await page.context().storageState({
//     path: "playwright/.auth/user.json",
//   });
// });

// import { test as setup, expect } from "@playwright/test";

// setup("authenticate", async ({ page }) => {
//   // Open login page
//   await page.goto("/login");

//   // Verify login page loaded
//   await expect(page.locator('input[name="email"]')).toBeVisible();

//   // Enter credentials
//   await page.fill('input[name="email"]', "arunjo9601@gmail.com");

//   await page.fill('input[name="password"]', "password");

//   // Login
//   await page
//     .getByRole("button", {
//       name: /login/i,
//     })
//     .click();

//   // Wait home redirect
//   await expect(page).not.toHaveURL(/login/);

//   // Important: wait auth restore
//   await page.reload();

//   // Confirm logged user
//   await expect(page.getByTestId("profile-menu-button")).toBeVisible({
//     timeout: 15000,
//   });

//   // Save cookies + storage
//   await page.context().storageState({
//     path: "playwright/.auth/user.json",
//   });
// });

import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page.fill('input[name="email"]', "arunjo9601@gmail.com");

  await page.fill('input[name="password"]', "password");

  await page
    .getByRole("button", {
      name: /login/i,
    })
    .click();

  await expect(page).not.toHaveURL(/login/);

  // wait refresh token
  await page.waitForTimeout(3000);

  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});