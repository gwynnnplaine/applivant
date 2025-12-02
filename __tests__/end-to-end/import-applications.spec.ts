import { expect, test } from "@/__tests__/end-to-end/fixtures/db.fixture";
import { JobApplication, JobApplicationSchema } from "@/entities/application";
import Papa from "papaparse";
import { zocker } from "zocker";
import { ImportExportModal } from "./utils/import-export-modal";
import { Page } from "@playwright/test";

test.describe("Import Job Applications", () => {
  test.beforeEach(async ({ page, db }) => {
    await db.clear();
    await page.goto("/");
  });

  test("should parse and import a JSON file", async ({ page }) => {
    const mockData = zocker(JobApplicationSchema).generateMany(3);
    const fileContent = JSON.stringify(mockData);

    const importModal = new ImportExportModal(page);
    await importModal.open();

    await importModal.uploadFile({
      name: "data.json",
      mimeType: "application/json",
      buffer: Buffer.from(fileContent),
    });

    await importModal.expectSuccess();
    await importModal.close();

    await verifyApplicationsVisible(page, [mockData[0]!, mockData[2]!]);
  });

  test("should parse and import a CSV file", async ({ page }) => {
    const mockData = zocker(JobApplicationSchema).generateMany(5);
    const trickyApp = mockData[1]!;
    trickyApp.company = "Smith, Jones & Co.";
    trickyApp.notes = "Line 1\nLine 2";

    const csvContent = Papa.unparse(JSON.parse(JSON.stringify(mockData)));

    const importModal = new ImportExportModal(page);
    await importModal.open();

    await importModal.uploadFile({
      name: "complex.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(csvContent),
    });

    await importModal.expectSuccess();
    await importModal.close();

    await verifyApplicationsVisible(page, [trickyApp, mockData[3]!]);
  });
});

async function verifyApplicationsVisible(page: Page, apps: JobApplication[]) {
  for (const app of apps) {
    const row = page.getByRole("row").filter({ hasText: app.company });
    await expect(row.getByText(app.jobTitle)).toBeVisible();
  }
}
