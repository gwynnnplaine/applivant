import {
  JobApplicationInput,
  JobApplicationInputSchema,
} from "@/app/types/job-application-input.types";
import { JobApplication } from "@/entities/job-application";
import { IApplicationRepository } from "@/repositories";
import {
  ApplicationDatabaseError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from "./errors";

export class JobApplicationService {
  #repository: IApplicationRepository;

  constructor(repository: IApplicationRepository) {
    this.#repository = repository;
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
      await this.#repository.create(job);
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

    const exists = await this.#repository.exists(applicationId);

    if (!exists) {
      throw new ApplicationNotFoundError(applicationId);
    }

    try {
      await this.#repository.update(applicationId, {
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
    const exists = await this.#repository.exists(applicationId);

    if (!exists) {
      throw new ApplicationNotFoundError(applicationId);
    }

    try {
      await this.#repository.delete(applicationId);
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
