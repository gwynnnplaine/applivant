import { JobApplicationSchema } from "@/entities/application";
import { zocker } from "zocker";
import { expect, test } from "./fixtures/db.fixture";

test.describe("Job Applications (first time user)", () => {
  const applications = zocker(JobApplicationSchema).generateMany(2);
  const app1 = applications[0]!;
  const app2 = applications[1]!;

  test.beforeEach(async ({ db }) => {
    await db.clear();
  });

  test("User can create, update, and delete applications", async ({ page }) => {
    await page.goto("/");

    await test.step("1. Create two new applications", async () => {
      for (const app of [app1, app2]) {
        if (app === app1) {
          await page
            .getByRole("link", { name: "Add Your First Application" })
            .click();
        } else {
          page.getByRole("button", { name: "Add new application" }).click();
        }

        await page.getByLabel("Company").fill(app.company);
        await page.getByLabel("Job Title").fill(app.jobTitle);
        await page.getByLabel("Status").click();
        await page.getByRole("option", { name: app.status }).click();

        await page.getByRole("button", { name: "Submit Application" }).click();

        // Verify it appears in the list
        await expect(page.getByText(app.company)).toBeVisible();
      }
    });

    // We need this for a 3rd step also
    const newJobTitle = `Lead ${app1.jobTitle}`;

    await test.step("2. Update the first application", async () => {
      const row = page.getByRole("row").filter({
        hasText: app1.company,
      });

      await row.getByText(app1.jobTitle).click();

      await page.getByRole("button", { name: /edit application/i }).click();

      await page.getByRole("textbox", { name: /job title/i }).fill(newJobTitle);

      await page.getByRole("button", { name: /submit application/i }).click();

      await expect(
        page.getByText("Application updated successfully"),
      ).toBeVisible();

      await page.goto("/");

      const updatedRow = page.getByRole("row").filter({
        hasText: app1.company,
      });

      await expect(updatedRow.getByText(newJobTitle)).toBeVisible();
      await expect(
        updatedRow.getByText(app1.jobTitle, {
          exact: true,
        }),
      ).not.toBeVisible();
    });

    await test.step("3. Delete both applications", async () => {
      const targets = [
        { company: app1.company, title: newJobTitle },
        { company: app2.company, title: app2.jobTitle },
      ];

      for (const target of targets) {
        await page.getByText(target.title).click();

        await page.getByRole("button", { name: /delete application/i }).click();

        await page.getByText("Delete application?").waitFor();
        await page.getByRole("button", { name: /^delete$/i }).click();

        await expect(
          page.getByText("Application deleted successfully"),
        ).toBeVisible();

        await page.goto("/");

        await expect(page.getByText(target.company)).not.toBeVisible();
      }
    });

    await test.step("4. Verify empty state is shown", async () => {
      await expect(page.getByText("Your data stays local")).toBeVisible();
    });
  });
});
