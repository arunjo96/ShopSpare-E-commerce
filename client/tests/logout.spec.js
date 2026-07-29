// import { test, expect } from "@playwright/test";

// test("User should logout successfully", async ({ page }) => {
//   // auth.setup already login pannidum
//   await page.goto("http://localhost:5173/");

//   // Wait for home page
//   await expect(page).not.toHaveURL(/login/);

//   // Open profile dropdown
//   await page
//     .getByRole("button", {
//       name: /profile|account|user/i,
//     })
//     .click();

//   // Logout visible check
//   const logoutBtn = page.getByRole("button", {
//     name: /logout/i,
//   });

//   await expect(logoutBtn).toBeVisible();

//   // Logout
//   await logoutBtn.click();

//   // Verify logout
//   await expect(page).toHaveURL(/login|register|\/$/);
// });

// import { test, expect } from "@playwright/test";

// test("User should logout successfully", async ({ page }) => {
//   await page.goto("/");

//   // Debug - verify logged user
//   await expect(page.getByTestId("profile-menu-button")).toBeVisible({
//     timeout: 10000,
//   });

//   // Open profile
//   await page.getByTestId("profile-menu-button").click();

//   // Logout
//   const logoutButton = page.getByRole("button", {
//     name: "Logout",
//     exact: true,
//   });

//   await expect(logoutButton).toBeVisible();

//   await logoutButton.click();

//   await expect(page).toHaveURL(/login|register|\/$/);
// });

// import { test, expect } from "@playwright/test";

// test("User should logout successfully", async ({ page }) => {
//   await page.goto("/");

//   const profile = page.getByTestId("profile-menu-button");

//   await expect(profile).toBeVisible();

//   await profile.click();

//   const logoutBtn = page.getByRole("button", {
//     name: /logout/i,
//   });

//   await expect(logoutBtn).toBeVisible();

//   await logoutBtn.click();

//   await expect(page.getByTestId("profile-menu-button")).not.toBeVisible();
// });

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