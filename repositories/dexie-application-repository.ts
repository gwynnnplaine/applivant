import { db } from "@/db";
import { JobApplication } from "@/entities/job-application";
import { IApplicationRepository } from "./application-repository.interface";

export class DexieApplicationRepository implements IApplicationRepository {
  async findAll(): Promise<JobApplication[]> {
    return db.applications.toArray();
  }

  async findById(id: string): Promise<JobApplication | undefined> {
    return db.applications.get(id);
  }

  async create(application: JobApplication): Promise<string> {
    return db.applications.add(application);
  }

  async update(
    id: string,
    application: Partial<JobApplication>,
  ): Promise<void> {
    await db.applications.update(id, application);
  }

  async delete(id: string): Promise<void> {
    await db.applications.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await db.applications.where("id").equals(id).count();
    return count > 0;
  }
}
