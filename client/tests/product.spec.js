
import { test, expect } from "@playwright/test";

test("Logged user should view product details", async ({ page }) => {
  await page.goto("/products");

  // wait product cards load
  await expect(page.getByTestId("product-card").first()).toBeVisible();

  await page.getByTestId("view-product").first().click();

  await page.waitForURL(/\/products\/.+/);

  // wait product details render
  await expect(page.getByTestId("product-title")).toBeVisible({
  });

  await expect(page.getByTestId("product-details-add-cart")).toBeVisible();

  await expect(page.getByTestId("product-details-buy-now")).toBeVisible();
});