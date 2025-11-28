import {
  generateMockApplication,
  readBlobAsText,
} from "@/__tests__/helpers/mocks";
import { useExport } from "@/features/import-export/hooks/use-export";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("useExport", () => {
  const mockCreateObjectURL = vi.fn().mockReturnValue("blob:url");
  const mockRevokeObjectURL = vi.fn();
  const mockClick = vi.fn();

  const originalCreateElement = document.createElement.bind(document);

  beforeEach(() => {
    vi.clearAllMocks();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    document.createElement = ((tag: string) => {
      const el = originalCreateElement(tag) as HTMLAnchorElement;
      if (tag === "a") {
        el.href = "";
        el.click = mockClick;
      }
      return el as unknown as HTMLAnchorElement;
    }) as typeof document.createElement;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  describe("csv format", () => {
    test("should export applications as CSV", () => {
      const applications = [generateMockApplication()];
      const { result } = renderHook(() => useExport(applications, "csv"));

      act(() => {
        result.current.handleExport();
      });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      const blob = mockCreateObjectURL.mock.calls[0]![0] as Blob;
      expect(blob.type).toBe("text/csv");
    });

    test("should include headers in CSV", async () => {
      const applications = [generateMockApplication()];
      const { result } = renderHook(() => useExport(applications, "csv"));

      act(() => {
        result.current.handleExport();
      });

      const blob = mockCreateObjectURL.mock.calls[0]![0] as Blob;
      const text = await readBlobAsText(blob);
      expect(text).toContain("Company");
      expect(text).toContain("Job Title");
      expect(text).toContain("Status");
    });

    test("should include application data in CSV", async () => {
      const applications = [
        generateMockApplication({
          company: "Acme Corp",
          jobTitle: "Developer",
        }),
      ];
      const { result } = renderHook(() => useExport(applications, "csv"));

      act(() => {
        result.current.handleExport();
      });

      const blob = mockCreateObjectURL.mock.calls[0]![0] as Blob;
      const text = await readBlobAsText(blob);
      expect(text).toContain("Acme Corp");
      expect(text).toContain("Developer");
    });

    test("should trigger download with csv extension", () => {
      const applications = [generateMockApplication()];
      const { result } = renderHook(() => useExport(applications, "csv"));

      act(() => {
        result.current.handleExport();
      });

      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe("json format", () => {
    test("should export applications as JSON", () => {
      const applications = [generateMockApplication()];
      const { result } = renderHook(() => useExport(applications, "json"));

      act(() => {
        result.current.handleExport();
      });

      expect(mockCreateObjectURL).toHaveBeenCalled();
      const blob = mockCreateObjectURL.mock.calls[0]![0] as Blob;
      expect(blob.type).toBe("application/json");
    });

    test("should include application data in JSON", async () => {
      const app = generateMockApplication({
        company: "JSON Corp",
        jobTitle: "Architect",
      });
      const applications = [app];
      const { result } = renderHook(() => useExport(applications, "json"));

      act(() => {
        result.current.handleExport();
      });

      const blob = mockCreateObjectURL.mock.calls[0]![0] as Blob;
      const text = await readBlobAsText(blob);
      const parsed = JSON.parse(text);
      expect(parsed[0].company).toBe("JSON Corp");
      expect(parsed[0].jobTitle).toBe("Architect");
    });

    test("should export valid JSON array", async () => {
      const applications = [
        generateMockApplication(),
        generateMockApplication(),
      ];
      const { result } = renderHook(() => useExport(applications, "json"));

      act(() => {
        result.current.handleExport();
      });

      const blob = mockCreateObjectURL.mock.calls[0]![0] as Blob;
      const text = await readBlobAsText(blob);
      const parsed = JSON.parse(text);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed).toHaveLength(2);
    });
  });

  describe("default format", () => {
    test("should default to csv when no format specified", () => {
      const applications = [generateMockApplication()];
      const { result } = renderHook(() => useExport(applications));

      act(() => {
        result.current.handleExport();
      });

      const blob = mockCreateObjectURL.mock.calls[0]![0] as Blob;
      expect(blob.type).toBe("text/csv");
    });
  });

  test("should cleanup blob URL after download", () => {
    const applications = [generateMockApplication()];
    const { result } = renderHook(() => useExport(applications, "csv"));

    act(() => {
      result.current.handleExport();
    });

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:url");
  });

  test("should handle empty applications array", () => {
    const { result } = renderHook(() => useExport([], "csv"));

    act(() => {
      result.current.handleExport();
    });

    expect(mockCreateObjectURL).toHaveBeenCalled();
  });
});
