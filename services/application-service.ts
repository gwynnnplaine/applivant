import {
  JobApplicationInput,
  JobApplicationInputSchema,
} from "@/app/types/job-application-input.types";
import { JobApplication } from "@/entities/job-application";
import { EntityTable } from "dexie";
import {
  ApplicationValidationError,
  ApplicationNotFoundError,
  ApplicationDatabaseError,
} from "./errors";

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

    try {
      await this.#table.add(job);
      return job;
    } catch (error) {
      console.error("Failed to create application:", error);
      throw new ApplicationDatabaseError(
        "Failed to save application to database",
        "create",
      );
    }
  }

  async updateJobApplication(
    applicationId: string,
    updates: JobApplicationInput,
  ): Promise<void> {
    const validatedApplication = this.#validateJobApplication(updates);

    const existing = await this.#table.get(applicationId);

    if (!existing) {
      throw new ApplicationNotFoundError(applicationId);
    }

    try {
      await this.#table.update(applicationId, {
        ...validatedApplication,
        dateModified: new Date(),
      });
    } catch (error) {
      console.error("Failed to update application:", error);
      throw new ApplicationDatabaseError(
        "Failed to update application in database",
        "update",
      );
    }
  }

  async deleteJobApplication(applicationId: string): Promise<void> {
    const existing = await this.#table.get(applicationId);

    if (!existing) {
      throw new ApplicationNotFoundError(applicationId);
    }

    try {
      await this.#table.delete(applicationId);
    } catch (error) {
      console.error("Failed to delete application:", error);
      throw new ApplicationDatabaseError(
        "Failed to delete application from database",
        "delete",
      );
    }
  }

  #validateJobApplication(
    application: JobApplicationInput,
  ): JobApplicationInput {
    const validated = JobApplicationInputSchema.safeParse(application);

    if (!validated.success) {
      throw new ApplicationValidationError(
        validated.error.message,
        String(validated.error.issues[0]?.path[0] || ""),
      );
    }

    return validated.data;
  }
}
