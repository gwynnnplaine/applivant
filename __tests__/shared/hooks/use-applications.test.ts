import { generateMockApplications } from "@/__tests__/helpers/mocks";
import { useApplications } from "@/shared/hooks/use-applications";
import { renderHook } from "@testing-library/react";
import { useLiveQuery } from "dexie-react-hooks";
import { describe, expect, test, vi } from "vitest";

vi.mock("dexie-react-hooks", () => ({
  useLiveQuery: vi.fn(),
}));

const mockFindAll = vi.fn();

vi.mock("@/shared/api", () => ({
  DexieApplicationRepository: class {
    findAll = mockFindAll;
  },
}));

describe("useApplications", () => {
  test("should return undefined when loading", () => {
    vi.mocked(useLiveQuery).mockReturnValue(undefined);

    const { result } = renderHook(() => useApplications());

    expect(result.current).toBeUndefined();
  });

  test("should return empty array when no applications", () => {
    vi.mocked(useLiveQuery).mockReturnValue([]);

    const { result } = renderHook(() => useApplications());

    expect(result.current).toEqual([]);
  });

  test("should return applications from repository", () => {
    const mockApplications = generateMockApplications(3);
    vi.mocked(useLiveQuery).mockReturnValue(mockApplications);

    const { result } = renderHook(() => useApplications());

    expect(result.current).toEqual(mockApplications);
  });

  test("should call useLiveQuery with query function that calls repository.findAll", () => {
    const mockApplications = generateMockApplications(2);
    mockFindAll.mockResolvedValue(mockApplications);

    vi.mocked(useLiveQuery).mockImplementation((queryFn) => {
      queryFn();
      return mockApplications;
    });

    renderHook(() => useApplications());

    expect(mockFindAll).toHaveBeenCalled();
  });
});
