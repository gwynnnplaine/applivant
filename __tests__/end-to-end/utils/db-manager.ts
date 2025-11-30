import { APPLICATIONS_STORE_NAME, DATABASE_NAME } from "@/db/consts";
import { type Page } from "@playwright/test";
import { seedBrowserDB, SeedParams } from "./db-scripts";

export class DatabaseManager {
  #dbName = DATABASE_NAME;
  #storeName = APPLICATIONS_STORE_NAME;

  readonly #page: Page;

  constructor(page: Page) {
    this.#page = page;
  }

  /**
   * Seeds the database and reloads the page to reflect changes.
   */
  async seed(data: unknown[]) {
    if (this.#page.url() === "about:blank") {
      await this.#page.goto("/");
    }
    await this.#page.evaluate(seedBrowserDB, this.#getSeedParams(data));

    await this.#page.reload();
    await this.#page.waitForLoadState("domcontentloaded");
  }

  async clear() {
    await this.seed([]);
  }

  #getSeedParams(data: unknown[]): SeedParams {
    return {
      data,
      dbName: this.#dbName,
      storeName: this.#storeName,
    };
  }
}
