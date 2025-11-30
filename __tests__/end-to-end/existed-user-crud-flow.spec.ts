import { expect, test } from "@/__tests__/end-to-end/fixtures/db.fixture";
import {
  APPLICATION_STATUS,
  JobApplicationSchema,
} from "@/entities/application";
import { zocker } from "zocker";

test.describe("Job Applications (already used an app)", () => {
  const applications = zocker(JobApplicationSchema).generateMany(5);

  test.beforeEach(async ({ db }) => {
    await db.clear();

    await db.seed(applications);
  });

  test("should display the seeded job application", async ({ page }) => {
    const targetApp = applications[0]!;

    await expect(page.getByText(targetApp.company)).toBeVisible();
    await expect(page.getByText(targetApp.jobTitle)).toBeVisible();
  });

  test("should update application status when user click on the table", async ({
    page,
  }) => {
    const targetApp = applications[0]!;

    const appRow = page.getByRole("row").filter({
      hasText: targetApp.jobTitle,
    });

    await appRow.getByText(targetApp.status).click();

    const oldStatus = targetApp.status;
    const newStatus: APPLICATION_STATUS = "Offer";

    await page.getByRole("menuitem", { name: newStatus }).click();

    await page.reload();

    await expect(appRow).toBeVisible();
    await expect(appRow.getByText(newStatus)).toBeVisible();
    await expect(appRow.getByText(oldStatus)).not.toBeVisible();
  });

  test("should update application on the edit page", async ({ page }) => {
    const targetApp = applications[0]!;

    const appRow = page.getByRole("row").filter({
      hasText: targetApp.company,
    });

    await appRow.getByText(targetApp.jobTitle).click();

    await page.getByRole("button", { name: /edit application/i }).click();

    const newJobTitle = `Senior ${targetApp.jobTitle}`;

    await page.getByRole("textbox", { name: /job title/i }).fill(newJobTitle);

    await page.getByRole("button", { name: /submit application/i }).click();

    await expect(
      page.getByText("Application updated successfully"),
    ).toBeVisible();

    await page.goto("/");

    const updatedAppRow = page.getByRole("row").filter({
      hasText: targetApp.company,
    });

    await expect(updatedAppRow.getByText(newJobTitle)).toBeVisible();
    await expect(
      updatedAppRow.getByText(targetApp.jobTitle, {
        exact: true,
      }),
    ).not.toBeVisible();
  });

  test("should delete application", async ({ page }) => {
    const targetApp = applications[0]!;

    await page.getByText(targetApp.company).click();

    await page.getByRole("button", { name: /delete application/i }).click();

    await page.getByText("Delete application?").waitFor();

    await page.getByRole("button", { name: /^delete$/i }).click();

    await expect(
      page.getByText("Application deleted successfully"),
    ).toBeVisible();

    await page.reload();

    await expect(page.getByText(targetApp.company)).not.toBeVisible();
  });
});
