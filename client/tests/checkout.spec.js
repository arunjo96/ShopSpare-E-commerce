// import { test, expect } from "@playwright/test";

// test.describe("Checkout Flow", () => {
//   test("User should complete checkout flow using cart", async ({ page }) => {
//     // Go products
//     await page.goto("/products");

//     // Add first product to cart
//     const productCard = page.locator('[data-testid="product-card"]').first();

//     await expect(productCard).toBeVisible();

//     await productCard.getByTitle("Add to Cart").click();

//     // Open cart
//     await page.goto("/cart");

//     // If cart page not available, open drawer through header
//     await page.waitForTimeout(2000);

//     // Navigate checkout directly
//     await page.goto("/checkout");

//     // Verify checkout page
//     await expect(page).toHaveURL(/checkout/);

//     // Shipping form
//     await page.fill('input[name="fullName"]', "Playwright User");

//     await page.fill('input[name="phone"]', "9876543210");

//     await page.fill('textarea[name="address"]', "123 Test Street");

//     await page.fill('input[name="city"]', "Chennai");

//     await page.fill('input[name="state"]', "Tamil Nadu");

//     await page.fill('input[name="postalCode"]', "600001");

//       await expect(
//         page.getByRole("button", {
//           name: "Continue",
//           exact: true,
//         }),
//       ).toBeVisible();

//     // Continue button
//  await page
//    .getByRole("button", {
//      name: "Continue",
//      exact: true,
//    })
//    .click();

//     // Payment step visible
//     await expect(
//       page.getByRole("button", {
//         name: /pay/i,
//       }),
//     ).toBeVisible();
//   });

//   test("User should reach checkout using Buy Now", async ({ page }) => {
//     await page.goto("/products");

//     const productCard = page.locator('[data-testid="product-card"]').first();

//     await productCard.getByTestId("view-product").click();

//     await expect(page).toHaveURL(/products/);

//     // Buy Now
//     await page.getByTestId("product-details-buy-now").click();

//     // Checkout page
//     await expect(page).toHaveURL(/checkout/);

//     await expect(page.getByText("Shipping Address")).toBeVisible();
//   });
// });

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