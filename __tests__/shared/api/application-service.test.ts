import {
  applicationZocker,
  generateMockApplicationInput,
  suppressConsoleError,
} from "@/__tests__/helpers/mocks";
import { JobApplicationInput } from "@/entities/application";
import { IApplicationRepository } from "@/shared/api/application-repository";
import { ApplicationService } from "@/shared/api/application-service";
import {
  ApplicationDatabaseError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from "@/shared/api/errors";
import { beforeEach, describe, expect, test, vi } from "vitest";

const createMockRepository = (): IApplicationRepository => ({
  findAll: vi.fn().mockResolvedValue([]),
  findById: vi.fn().mockResolvedValue(undefined),
  create: vi.fn().mockResolvedValue(""),
  update: vi.fn().mockResolvedValue(undefined),
  delete: vi.fn().mockResolvedValue(undefined),
  exists: vi.fn().mockResolvedValue(false),
});

describe("ApplicationService", () => {
  let mockRepository: IApplicationRepository;
  let service: ApplicationService;

  beforeEach(() => {
    mockRepository = createMockRepository();
    service = new ApplicationService(mockRepository);
  });

  describe("getAll", () => {
    test("should return applications from repository", async () => {
      const mockApplications = applicationZocker.generateMany(2);
      vi.mocked(mockRepository.findAll).mockResolvedValue(mockApplications);

      const applications = await service.getAll();

      expect(applications).toEqual(mockApplications);
      expect(mockRepository.findAll).toHaveBeenCalledOnce();
    });

    test("should throw ApplicationDatabaseError when repository fails", async () => {
      vi.mocked(mockRepository.findAll).mockRejectedValue(new Error());

      await suppressConsoleError(async () => {
        await expect(service.getAll()).rejects.toThrow(
          ApplicationDatabaseError,
        );
      });
    });
  });

  describe("getById", () => {
    test("should return application when found", async () => {
      const mockApplication = applicationZocker.generate();
      vi.mocked(mockRepository.findById).mockResolvedValue(mockApplication);

      const application = await service.getById(mockApplication.id);

      expect(application).toEqual(mockApplication);
      expect(mockRepository.findById).toHaveBeenCalledWith(mockApplication.id);
    });

    test("should return undefined when not found", async () => {
      const application = await service.getById("non-existent");

      expect(application).toBeUndefined();
    });

    test("should throw ApplicationDatabaseError when repository fails", async () => {
      vi.mocked(mockRepository.findById).mockRejectedValue(new Error());

      await suppressConsoleError(async () => {
        await expect(service.getById("id")).rejects.toThrow(
          ApplicationDatabaseError,
        );
      });
    });
  });

  describe("create", () => {
    test("should create application with generated id and timestamps", async () => {
      const input = generateMockApplicationInput();
      const beforeCreate = new Date();

      const result = await service.create(input);

      expect(result.id).toBeDefined();
      expect(result.company).toBe(input.company);
      expect(result.dateAdded.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime(),
      );
      expect(result.dateAdded.getTime()).toBe(result.dateModified.getTime());
      expect(mockRepository.create).toHaveBeenCalledOnce();
    });

    test("should throw ApplicationValidationError for invalid input", async () => {
      await expect(service.create({} as JobApplicationInput)).rejects.toThrow(
        ApplicationValidationError,
      );
    });

    test("should throw ApplicationDatabaseError when repository fails", async () => {
      vi.mocked(mockRepository.create).mockRejectedValue(new Error());

      await suppressConsoleError(async () => {
        await expect(
          service.create(generateMockApplicationInput()),
        ).rejects.toThrow(ApplicationDatabaseError);
      });
    });
  });

  describe("update", () => {
    test("should update existing application with new dateModified", async () => {
      const id = "existing-id";
      const input = generateMockApplicationInput();
      vi.mocked(mockRepository.exists).mockResolvedValue(true);

      await service.update(id, input);

      expect(mockRepository.update).toHaveBeenCalledWith(
        id,
        expect.objectContaining({
          ...input,
          dateModified: expect.any(Date),
        }),
      );
    });

    test("should throw ApplicationNotFoundError when application does not exist", async () => {
      vi.mocked(mockRepository.exists).mockResolvedValue(false);

      await expect(
        service.update("non-existent", generateMockApplicationInput()),
      ).rejects.toThrow(ApplicationNotFoundError);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    test("should throw ApplicationValidationError for invalid input", async () => {
      await expect(
        service.update("id", {} as JobApplicationInput),
      ).rejects.toThrow(ApplicationValidationError);
      expect(mockRepository.exists).not.toHaveBeenCalled();
    });

    test("should throw ApplicationDatabaseError when repository fails", async () => {
      vi.mocked(mockRepository.exists).mockResolvedValue(true);
      vi.mocked(mockRepository.update).mockRejectedValue(new Error());

      await suppressConsoleError(async () => {
        await expect(
          service.update("id", generateMockApplicationInput()),
        ).rejects.toThrow(ApplicationDatabaseError);
      });
    });
  });

  describe("delete", () => {
    test("should delete existing application", async () => {
      const id = "existing-id";
      vi.mocked(mockRepository.exists).mockResolvedValue(true);

      await service.delete(id);

      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    test("should throw ApplicationNotFoundError when application does not exist", async () => {
      vi.mocked(mockRepository.exists).mockResolvedValue(false);

      await expect(service.delete("non-existent")).rejects.toThrow(
        ApplicationNotFoundError,
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    test("should throw ApplicationDatabaseError when repository fails", async () => {
      vi.mocked(mockRepository.exists).mockResolvedValue(true);
      vi.mocked(mockRepository.delete).mockRejectedValue(new Error());

      await suppressConsoleError(async () => {
        await expect(service.delete("id")).rejects.toThrow(
          ApplicationDatabaseError,
        );
      });
    });
  });
});
