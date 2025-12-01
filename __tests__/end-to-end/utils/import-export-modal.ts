import { FileFormat } from "@/features/import-export/types";
import { Download, type Locator, type Page, expect } from "@playwright/test";

export class ImportExportModal {
  readonly page: Page;
  readonly triggerButton: Locator;
  readonly uploadButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.triggerButton = page.getByRole("button", { name: /import/i });
    this.uploadButton = page.getByText("Click to upload");
    this.closeButton = page.getByRole("button", {
      name: "Close import-export dialog",
    });
  }

  async open() {
    await this.triggerButton.click();
  }

  async selectFileFormat(format: FileFormat) {
    await this.page
      .getByRole("combobox", { name: "Select export format" })
      .click();

    await this.page.getByRole("option", { name: format.toUpperCase() }).click();
  }

  async uploadFile(payload: {
    name: string;
    mimeType: string;
    buffer: Buffer;
  }) {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.uploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(payload);
  }

  async exportFile(): Promise<Download> {
    const downloadPromise = this.page.waitForEvent("download");

    await this.page
      .getByRole("button", { name: "Export your application data" })
      .click();

    return downloadPromise;
  }

  async expectSuccess() {
    await expect(this.page.getByText("Import successful!")).toBeVisible();
  }

  async close() {
    await this.closeButton.click();
  }
}
