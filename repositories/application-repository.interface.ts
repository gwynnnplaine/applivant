import { JobApplication } from "@/entities/job-application";

export interface IApplicationRepository {
  findAll(): Promise<JobApplication[]>;

  findById(id: string): Promise<JobApplication | undefined>;

  create(application: JobApplication): Promise<string>;

  update(id: string, application: Partial<JobApplication>): Promise<void>;

  delete(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;
}
