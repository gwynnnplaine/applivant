import type { JobApplication } from "@/entities/job-application"
import Dexie, { EntityTable } from "dexie"
import { DATABASE_NAME, DATABASE_VERSION } from "./consts"

const db = new Dexie(DATABASE_NAME) as Dexie & {
    applications: EntityTable<JobApplication, "id">
}

db.version(DATABASE_VERSION).stores({
    applications: "++id, jobLink",
})

export { db }
