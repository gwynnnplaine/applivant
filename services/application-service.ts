import {
  JobApplication,
  JobApplicationInput,
  JobApplicationSchema,
} from "@/entities/job-application";
import { Table } from "dexie";

export class JobApplicationService {
  #table: Table<JobApplication, string>;

  constructor(table: Table<JobApplication, string>) {
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

  #validateJobApplication(application: JobApplicationInput): JobApplication {
    const validated = JobApplicationSchema.safeParse(application);

    if (!validated.success) {
      throw new Error("Invalid job application data");
    }

    return validated.data;
  }
}
