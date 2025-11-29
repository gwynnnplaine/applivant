import { expect, test } from "@/__tests__/end-to-end/fixtures/db.fixture";
import { JobApplicationSchema } from "@/entities/application";
import { zocker } from "zocker";

// E2E: Critical user flow - Add → View → Edit → Delete
// E2E: Import CSV → Verify → Export JSON
// E2E: Search and filter functionality
// E2E: Dark mode toggle and persistence

test("Create new job application", async ({ page, testDb }) => {
  const application = zocker(JobApplicationSchema).generate();
  await testDb.putItem(application);

  const items = await testDb.getAllItems();
  expect(items).toHaveLength(1);

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.getByText(application.company)).toBeVisible();
  await expect(page.getByText(application.jobTitle)).toBeVisible();
});
