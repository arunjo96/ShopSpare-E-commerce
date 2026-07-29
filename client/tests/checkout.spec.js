
import { test, expect } from "@playwright/test";
test("User should buy product and reach payment", async ({ page }) => {
  await page.goto("http://localhost:5173/products");

  await page.getByTestId("view-product").first().click();

  await expect(page).toHaveURL(/products\/.+/);

  await page
    .getByRole("button", {
      name: /buy now/i,
    })
    .click();

  await expect(page).toHaveURL(/checkout/);

  await page.fill('input[name="fullName"]', "Playwright User");
  await page.fill('input[name="phone"]', "9876543210");
  await page.fill('textarea[name="address"]', "123 Test Street");
  await page.fill('input[name="city"]', "Chennai");
  await page.fill('input[name="state"]', "Tamil Nadu");
  await page.fill('input[name="postalCode"]', "600001");

await page
  .getByRole("button", {
    name: "Continue",
    exact: true,
  })
  .click();
  await expect(
    page.getByRole("button", {
      name: /pay/i,
    }),
  ).toBeVisible();
});