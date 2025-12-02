export type SeedParams = {
  data: unknown[];
  dbName: string;
  storeName: string;
};

/**
 * This function runs entirely in the browser context.
 * It cannot use any Node.js variables unless passed in via params.
 */
export async function seedBrowserDB({ data, dbName, storeName }: SeedParams) {
  const promote = <T>(request: IDBRequest<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // We need to wait until the Dexie/App has created the DB schema
  const MAX_RETRY_ATTEMPTS = 50;
  let attempts = 0;
  while (true) {
    if (attempts > MAX_RETRY_ATTEMPTS)
      throw new Error(`DB Timeout: Store '${storeName}' not found.`);

    try {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open(dbName);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => {
          e.preventDefault();
          reject(req.error);
        };
      });

      const exists = db.objectStoreNames.contains(storeName);
      db.close();
      if (exists) break;
    } catch (e) {
      throw new Error(`DB Error: ${(e as Error).message}`);
    }

    await wait(100);
    attempts++;
  }

  const request = indexedDB.open(dbName);
  const db = await promote(request);
  const tx = db.transaction([storeName], "readwrite");
  const store = tx.objectStore(storeName);

  store.clear();
  data.forEach((item) => store.add(item));

  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}
