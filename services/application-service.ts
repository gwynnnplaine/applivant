import {
  JobApplication,
  JobApplicationInput,
  JobApplicationInputSchema,
} from "@/entities/job-application";
import { EntityTable } from "dexie";

export class JobApplicationService {
  #table: EntityTable<JobApplication, "id">;

  constructor(table: EntityTable<JobApplication, "id">) {
    this.#table = table;
  }

  async createJobApplication(
    application: JobApplicationInput,
  ): Promise<JobApplication> {
    const validatedApplication = this.#validateJobApplication(application);

    const currentDate = new Date();

    const job: JobApplication = {
      ...validatedApplication,
      id: crypto.randomUUID(),
      dateAdded: currentDate,
      dateModified: currentDate,
    };

    await this.#table.add(job);

    return job;
  }

  async updateJobApplication(
    applicationId: string,
    updates: JobApplicationInput,
  ): Promise<void> {
    const validatedApplication = this.#validateJobApplication(updates);

    const existing = await this.#table.get(applicationId);

    if (!existing) {
      throw new Error("Job application not found");
    }

    await this.#table.update(applicationId, {
      ...validatedApplication,
      dateModified: new Date(),
    });
  }

  async deleteJobApplication(applicationId: string): Promise<void> {
    await this.#table.delete(applicationId);
  }

  #validateJobApplication(
    application: JobApplicationInput,
  ): JobApplicationInput {
    const validated = JobApplicationInputSchema.safeParse(application);

    if (!validated.success) {
      throw new Error(
        "Invalid job application data: " + validated.error.message,
      );
    }

    return validated.data;
  }
}
