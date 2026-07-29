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

//   await expect(page).not.toHaveURL(/login/);

//   // wait refresh token
//   await page.waitForTimeout(3000);

//   await page.context().storageState({
//     path: "playwright/.auth/user.json",
//   });
// });

import { test as setup, expect } from "@playwright/test";

// setup("authenticate", async ({ page }) => {
//   await page.goto("/login");

//   await page.fill('input[name="email"]', "arunjo9601@gmail.com");

//   await page.fill('input[name="password"]', "password");

//   await page
//     .getByRole("button", {
//       name: /login/i,
//     })
//     .click();

//   // wait for login complete
//   await expect(page).not.toHaveURL(/login/);

//   // verify authenticated UI
//   await expect(page.getByTestId("profile-menu-button")).toBeVisible({
//     timeout: 15000,
//   });

//   await page.context().storageState({
//     path: "playwright/.auth/user.json",
//   });
// });

setup("authenticate", async ({ page }) => {
  await page.goto("/login");

  await page.getByPlaceholder("example@gmail.com").fill("arunjo9601@gmail.com");

  await page.getByPlaceholder("Enter password").fill("password");
await page.getByTestId("login-button").click();
  // await page
  //   .getByRole("button", {
  //     name: /login/i,
  //   })
  //   .click();

  await expect(page).not.toHaveURL(/login/);

  await expect(page.getByTestId("profile-menu-button")).toBeVisible({
    timeout: 15000,
  });

  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});

// setup("authenticate", async ({ page }) => {
//   await page.goto("/login");

//   await page.getByTestId("email-input").fill("arunjo9601@gmail.com");

//   await page.getByTestId("password-input").fill("password");

//   await page.getByTestId("login-button").click();

//   // Wait for login success
//   await expect(
//     page.getByRole("button", {
//       name: "Open profile menu",
//     }),
//   ).toBeVisible({
//     timeout: 30000,
//   });

//   await page.context().storageState({
//     path: "playwright/.auth/user.json",
//   });
// });