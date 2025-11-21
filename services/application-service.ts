import {
  JobApplication,
  JobApplicationInput,
  JobApplicationSchema,
} from "@/entities/job-application"
import { Table } from "dexie"

export class JobApplicationService {
  #table: Table<JobApplication, string>

  constructor(table: Table<JobApplication, string>) {
    this.#table = table
  }

  async create(application: JobApplicationInput): Promise<JobApplication> {
    const validatedApplication = this.#validateJobApplication(application)

    const currentDate = new Date()

    const job: JobApplication = {
      ...application,
      id: crypto.randomUUID(),
      dateAdded: currentDate,
      dateModified: currentDate,
    }

    await this.#table.add(job)

    return job
  }

  async update(
    id: string,
    updates: Partial<JobApplicationInput>
  ): Promise<void> {
    const existing = await this.#table.get(id)
    if (!existing) {
      throw new Error("Job application not found")
    }

    await this.#table.update(id, {
      ...updates,
      dateModified: new Date(),
    })
  }

  #validateJobApplication(application: JobApplicationInput): JobApplication {
    const validated = JobApplicationSchema.safeParse(application)

    if (!validated.success) {
      throw new Error("Invalid job application data")
    }

    return validated.data
  }
}
