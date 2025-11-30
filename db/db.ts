import type { JobApplication } from "@/entities/application";
import Dexie, { EntityTable } from "dexie";
import {
  APPLICATIONS_STORE_NAME,
  DATABASE_NAME,
  DATABASE_VERSION,
} from "./consts";

const db = new Dexie(DATABASE_NAME) as Dexie & {
  [APPLICATIONS_STORE_NAME]: EntityTable<JobApplication, "id">;
};

db.version(DATABASE_VERSION).stores({
  [APPLICATIONS_STORE_NAME]: "id, company, jobTitle, &[company+jobTitle]",
});

export { db };
