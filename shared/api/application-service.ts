import {
  JobApplication,
  JobApplicationInput,
  JobApplicationInputSchema,
} from "@/entities/application";
import { IApplicationRepository } from "./application-repository";
import {
  ApplicationDatabaseError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from "./errors";

export class ApplicationService {
  #repository: IApplicationRepository;

  constructor(repository: IApplicationRepository) {
    this.#repository = repository;
  }

  async getAll(): Promise<JobApplication[]> {
    try {
      return await this.#repository.findAll();
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      throw new ApplicationDatabaseError(
        "Failed to fetch applications from database",
        "read",
      );
    }
  }

  async getById(id: string): Promise<JobApplication | undefined> {
    try {
      return await this.#repository.findById(id);
    } catch (error) {
      console.error("Failed to fetch application:", error);
      throw new ApplicationDatabaseError(
        "Failed to fetch application from database",
        "read",
      );
    }
  }

  async create(input: JobApplicationInput): Promise<JobApplication> {
    const validatedInput = this.#validate(input);
    const now = new Date();

    const application: JobApplication = {
      ...validatedInput,
      id: crypto.randomUUID(),
      dateAdded: now,
      dateModified: now,
    };

    try {
      await this.#repository.create(application);
      return application;
    } catch (error) {
      console.error("Failed to create application:", error);
      throw new ApplicationDatabaseError(
        "Failed to save application to database",
        "create",
      );
    }
  }

  async update(id: string, input: JobApplicationInput): Promise<void> {
    const validatedInput = this.#validate(input);

    const exists = await this.#repository.exists(id);
    if (!exists) {
      throw new ApplicationNotFoundError(id);
    }

    try {
      await this.#repository.update(id, {
        ...validatedInput,
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

  async delete(id: string): Promise<void> {
    const exists = await this.#repository.exists(id);
    if (!exists) {
      throw new ApplicationNotFoundError(id);
    }

    try {
      await this.#repository.delete(id);
    } catch (error) {
      console.error("Failed to delete application:", error);
      throw new ApplicationDatabaseError(
        "Failed to delete application from database",
        "delete",
      );
    }
  }

  #validate(input: JobApplicationInput): JobApplicationInput {
    const result = JobApplicationInputSchema.safeParse(input);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      throw new ApplicationValidationError(
        result.error.message,
        firstIssue?.path[0]?.toString(),
      );
    }

    return result.data;
  }
}
