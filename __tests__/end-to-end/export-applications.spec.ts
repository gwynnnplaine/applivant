import { expect, test } from "@/__tests__/end-to-end/fixtures/db.fixture";
import { JobApplicationSchema } from "@/entities/application";
import Papa from "papaparse";
import { zocker } from "zocker";
import { ImportExportModal } from "./utils/import-export-modal";

test.describe("Export Job Applications", () => {
  let mockData: any[];
  const COMPANY_OVERRIDE = "ExportCorp International";
  const JOB_TITLE_OVERRIDE = "Senior Export Manager";

  test.beforeEach(async ({ page, db }) => {
    mockData = zocker(JobApplicationSchema).generateMany(4);

    mockData[2]!.company = COMPANY_OVERRIDE;
    mockData[0]!.jobTitle = JOB_TITLE_OVERRIDE;

    await db.seed(mockData);
    await page.goto("/");
  });

  test("should export applications to a JSON file", async ({ page }) => {
    const modal = new ImportExportModal(page);
    await modal.open();
    await modal.selectFileFormat("json");

    const download = await modal.exportFile();
    expect(download.suggestedFilename()).toContain(".json");

    const stream = await download.createReadStream();
    const content = await streamToString(stream);
    const json = JSON.parse(content);

    expect(json).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ company: COMPANY_OVERRIDE }),
        expect.objectContaining({ jobTitle: JOB_TITLE_OVERRIDE }),
      ]),
    );
    expect(json).toHaveLength(mockData.length);
  });

  test("should export applications to a CSV file", async ({ page }) => {
    const modal = new ImportExportModal(page);
    await modal.open();
    await modal.selectFileFormat("csv");

    const download = await modal.exportFile();
    expect(download.suggestedFilename()).toContain(".csv");

    const stream = await download.createReadStream();
    const content = await streamToString(stream);

    const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });

    expect(parsed.data).toHaveLength(mockData.length);

    expect(parsed.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ Company: COMPANY_OVERRIDE }),
        expect.objectContaining({ "Job Title": JOB_TITLE_OVERRIDE }),
      ]),
    );
  });
});

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}
