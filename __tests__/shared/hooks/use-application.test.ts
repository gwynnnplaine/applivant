import { generateMockApplication } from "@/__tests__/helpers/mocks";
import { useApplication } from "@/shared/hooks/use-application";
import { renderHook } from "@testing-library/react";
import { useLiveQuery } from "dexie-react-hooks";
import { describe, expect, test, vi } from "vitest";

vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: vi.fn(),
}));

const mockFindById = vi.fn();

vi.mock("@/shared/api", () => ({
  DexieApplicationRepository: class {
    findById = mockFindById;
  },
}));

describe("useApplication", () => {
  test("should return undefined when loading", () => {
    vi.mocked(useLiveQuery).mockReturnValue(undefined);

    const { result } = renderHook(() => useApplication("test-id"));

    expect(result.current).toBeUndefined();
  });

  test("should return null when application not found", () => {
    vi.mocked(useLiveQuery).mockReturnValue(null);

    const { result } = renderHook(() => useApplication("non-existent-id"));

    expect(result.current).toBeNull();
  });

  test("should return application when found", () => {
    const mockApplication = generateMockApplication();
    vi.mocked(useLiveQuery).mockReturnValue(mockApplication);

    const { result } = renderHook(() => useApplication(mockApplication.id));

    expect(result.current).toEqual(mockApplication);
  });

  test("should call useLiveQuery with query function that calls repository.findById", () => {
    const mockApplication = generateMockApplication();
    mockFindById.mockResolvedValue(mockApplication);

    vi.mocked(useLiveQuery).mockImplementation((queryFn) => {
      queryFn();
      return mockApplication;
    });

    renderHook(() => useApplication("test-id"));

    expect(mockFindById).toHaveBeenCalledWith("test-id");
  });
});
