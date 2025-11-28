import { JobApplication } from "@/entities/application";

export type BulkCreateResult = {
  inserted: string[];
  duplicates: number;
  errors: string[];
};

export interface IApplicationRepository {
  findAll(): Promise<JobApplication[]>;

  findById(id: string): Promise<JobApplication | undefined>;

  create(application: JobApplication): Promise<string>;

  createMany(applications: JobApplication[]): Promise<BulkCreateResult>;

  update(id: string, application: Partial<JobApplication>): Promise<void>;

  delete(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;
}
