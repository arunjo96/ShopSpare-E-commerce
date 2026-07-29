import { test, expect } from "@playwright/test";

test("Logged user should view order history", async ({ page }) => {
  // Open Orders page
  await page.goto("/orders");

  // Wait until page loads
  await page.waitForLoadState("networkidle");

  // Verify URL
  await expect(page).toHaveURL(/\/orders/);

  // Verify heading
  await expect(page.getByRole("heading", { name: /My Orders/i })).toBeVisible();

  // Check whether orders exist
  const orderRows = page.locator("table tbody tr");

  if ((await orderRows.count()) > 0) {
    // Table should be visible
    await expect(page.locator("table")).toBeVisible();

    // Verify column headers
    await expect(
      page.getByRole("columnheader", { name: /Order ID/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", { name: /Product/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", { name: /Date/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", { name: /Total/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", { name: /Status/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", { name: /Payment/i }),
    ).toBeVisible();

    // Verify View button exists
    await expect(
      page.getByRole("button", { name: /^View$/i }).first(),
    ).toBeVisible();
  } else {
    // Empty state
    await expect(page.getByText(/No Orders Yet/i)).toBeVisible();

    await expect(
      page.getByText(/Your purchased products will appear here./i),
    ).toBeVisible();
  }
});
