import { JobApplicationSchema } from "@/entities/application";
import { describe, expect, test } from "vitest";
import { zocker } from "zocker";
import { IApplicationRepository } from "./application-repository";
import { ApplicationService } from "./application-service";
const MOCK_REPOSITORY: IApplicationRepository = {
  findAll: async () => {
    return [];
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findById: async (id: string) => {
    return "";
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: async (application) => {
    return "";
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update: async (id: string, application) => {
    return;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete: async (id: string) => {
    return;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exists: async (id: string) => {
    return false;
  },
};

describe("Application service", () => {
  test("should return list of applications", async () => {
    const service = new ApplicationService({
      ...MOCK_REPOSITORY,
      findAll: async () => zocker(JobApplicationSchema).generateMany(2),
    });
    const applications = await service.getAll();

    expect(applications).toHaveLength(2);
  });
});
