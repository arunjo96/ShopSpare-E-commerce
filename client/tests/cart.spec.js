
import { test, expect } from "@playwright/test";

test("Logged user should add product to cart", async ({ page }) => {
  // Open products page
  await page.goto("/products");

  // Wait for products to load
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  // Open first product
  await page.getByTestId("view-product").first().click();

  // Wait for product details page
  await page.waitForURL(/\/products\/.+/);

  // Verify Add to Cart button
  await expect(page.getByTestId("product-details-add-cart")).toBeVisible();

  // Add to cart
  await page.getByTestId("product-details-add-cart").click();

  // Verify success toast
  await expect(page.getByText(/added to cart/i)).toBeVisible();
});
