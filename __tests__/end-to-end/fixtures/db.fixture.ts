import { test as base } from "@playwright/test";
import { PlaywrightIndexedDB } from "playwright-indexeddb";

const DATABASE_NAME = "applivant-db";
const STORE_NAME = "applications";

type TestFixtures = {
  testDb: PlaywrightIndexedDB;
};

export const test = base.extend<TestFixtures>({
  testDb: async ({ page }, use) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.evaluate(
      ({ dbName, storeName }) => {
        return new Promise<void>((resolve, reject) => {
          const closeDatabases = () => {
            return new Promise<void>((res) => {
              if (indexedDB.databases) {
                indexedDB.databases().then(() => {
                  res();
                });
              } else {
                setTimeout(res, 100);
              }
            });
          };

          closeDatabases().then(() => {
            const deleteReq = indexedDB.deleteDatabase(dbName);

            deleteReq.onblocked = () => {};

            deleteReq.onsuccess = deleteReq.onerror = () => {
              const openReq = indexedDB.open(dbName, 1);

              openReq.onerror = () =>
                reject(new Error("Failed to open database"));

              openReq.onupgradeneeded = (event) => {
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const db = (event.target as any).result;
                const store = db.createObjectStore(storeName, {
                  keyPath: "id",
                });

                store.createIndex("company", "company", { unique: false });
                store.createIndex("jobTitle", "jobTitle", { unique: false });
                store.createIndex("company+jobTitle", ["company", "jobTitle"], {
                  unique: true,
                });
              };

              openReq.onsuccess = () => {
                openReq.result.close();
                resolve();
              };
            };
          });
        });
      },
      { dbName: DATABASE_NAME, storeName: STORE_NAME },
    );

    const db = new PlaywrightIndexedDB(page, {
      dbName: DATABASE_NAME,
      storeName: STORE_NAME,
      version: 1,
    });

    // ???? React Hook "use" is called in function "testDb"
    //eslint-disable-next-line react-hooks/rules-of-hooks
    await use(db);

    await page
      .evaluate((dbName) => {
        indexedDB.deleteDatabase(dbName);
      }, DATABASE_NAME)
      .catch(() => {});
  },
});

export { expect } from "@playwright/test";
