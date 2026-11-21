import { test, expect } from "@playwright/test";

test("E1: the preview document presents Robey Voice identity", async ({
  page,
}) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Robey Voice/);
});
