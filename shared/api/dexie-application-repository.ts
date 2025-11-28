import { db } from "@/db";
import { JobApplication } from "@/entities/application";
import { Dexie } from "dexie";
import {
  BulkCreateResult,
  IApplicationRepository,
} from "./application-repository";

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

  async createMany(applications: JobApplication[]): Promise<BulkCreateResult> {
    const total = applications.length;

    try {
      const inserted = await db.applications.bulkAdd(applications, {
        allKeys: true,
      });
      return { inserted, duplicates: 0, errors: [] };
    } catch (error) {
      if (error instanceof Dexie.BulkError) {
        const duplicates = error.failures.filter(
          (e) => e.name === "ConstraintError",
        ).length;
        const otherErrors = error.failures
          .filter((e) => e.name !== "ConstraintError")
          .map((e) => e.message);

        const inserted = Array(total - error.failures.length).fill(
          "",
        ) as string[];

        return { inserted, duplicates, errors: otherErrors };
      }
      throw error;
    }
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
