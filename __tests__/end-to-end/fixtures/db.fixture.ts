import { test as base } from "@playwright/test";
import { DatabaseManager } from "../utils/db-manager";

export const test = base.extend<{ db: DatabaseManager }>({
  db: async ({ page }, run) => {
    await run(new DatabaseManager(page));
  },
});

export { expect } from "@playwright/test";
