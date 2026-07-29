
import { test, expect } from "@playwright/test";

test("Logged user should add product to wishlist", async ({ page }) => {
  // Open products page
  await page.goto("/products");

  // Wait until products are loaded
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  // Click first wishlist button
  await page.getByTitle("Wishlist").first().click();

  // Wait for wishlist API
  await page.waitForLoadState("networkidle");

  // Open wishlist page
  await page.goto("/wishlist");

  // Verify wishlist page opened
  await expect(page).toHaveURL(/\/wishlist/);

  // Verify heading
  await expect(
    page.getByRole("heading", { name: /My Wishlist/i }),
  ).toBeVisible();

  // Verify at least one product exists
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  // Verify buttons
  await expect(
    page.getByRole("button", { name: /Add to Cart/i }).first(),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: /View Product/i }).first(),
  ).toBeVisible();
});