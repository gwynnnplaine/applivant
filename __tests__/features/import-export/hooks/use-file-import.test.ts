import { useFileImport } from "@/features/import-export/hooks/use-file-import";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockParse = vi.fn();
const mockCreateMany = vi.fn();

vi.mock("@/features/import-export/file-parser/file-parser", () => ({
  FileParser: class {
    parse = mockParse;
  },
}));

vi.mock("@/app/providers/service-provider", () => ({
  useApplicationService: () => ({
    createMany: mockCreateMany,
  }),
}));

describe("useFileImport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParse.mockResolvedValue([]);
    mockCreateMany.mockResolvedValue({
      inserted: [],
      duplicates: 0,
      errors: [],
    });
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useFileImport());

    expect(result.current.isImporting).toBe(false);
    expect(result.current.result).toBeNull();
  });

  it("should set isImporting to true while importing", async () => {
    mockParse.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
    );

    const { result } = renderHook(() => useFileImport());
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    act(() => {
      result.current.importFile(file);
    });

    expect(result.current.isImporting).toBe(true);

    await waitFor(() => {
      expect(result.current.isImporting).toBe(false);
    });
  });

  it("should parse file and create applications", async () => {
    const parsedData = [
      { company: "Acme", jobTitle: "Dev" },
      { company: "Tech", jobTitle: "Engineer" },
    ];
    mockParse.mockResolvedValue(parsedData);
    mockCreateMany.mockResolvedValue({
      inserted: [{ id: "1" }, { id: "2" }],
      duplicates: 0,
      errors: [],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(mockParse).toHaveBeenCalledWith(file);
    expect(mockCreateMany).toHaveBeenCalledWith(parsedData);
  });

  it("should return success count in result", async () => {
    mockParse.mockResolvedValue([{ company: "Acme" }]);
    mockCreateMany.mockResolvedValue({
      inserted: [{ id: "1" }, { id: "2" }, { id: "3" }],
      duplicates: 0,
      errors: [],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(result.current.result?.success).toBe(3);
  });

  it("should return duplicates count in result", async () => {
    mockParse.mockResolvedValue([{ company: "Acme" }]);
    mockCreateMany.mockResolvedValue({
      inserted: [{ id: "1" }],
      duplicates: 2,
      errors: [],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(result.current.result?.duplicates).toBe(2);
  });

  it("should return errors in result", async () => {
    mockParse.mockResolvedValue([{ company: "Acme" }]);
    mockCreateMany.mockResolvedValue({
      inserted: [],
      duplicates: 0,
      errors: ["Invalid data at row 1", "Missing field at row 2"],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(result.current.result?.errors).toEqual([
      "Invalid data at row 1",
      "Missing field at row 2",
    ]);
  });

  it("should clear result when clearResult is called", async () => {
    mockParse.mockResolvedValue([{ company: "Acme" }]);
    mockCreateMany.mockResolvedValue({
      inserted: [{ id: "1" }],
      duplicates: 0,
      errors: [],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(result.current.result).not.toBeNull();

    act(() => {
      result.current.clearResult();
    });

    expect(result.current.result).toBeNull();
  });

  it("should clear previous result when importing new file", async () => {
    mockParse.mockResolvedValue([{ company: "Acme" }]);
    mockCreateMany.mockResolvedValue({
      inserted: [{ id: "1" }],
      duplicates: 0,
      errors: [],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File(["test"], "test.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(result.current.result).not.toBeNull();

    mockParse.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 50)),
    );

    act(() => {
      result.current.importFile(file);
    });

    expect(result.current.result).toBeNull();
    expect(result.current.isImporting).toBe(true);

    await waitFor(() => {
      expect(result.current.isImporting).toBe(false);
    });
  });

  it("should handle JSON file import", async () => {
    mockParse.mockResolvedValue([{ company: "JSON Corp" }]);
    mockCreateMany.mockResolvedValue({
      inserted: [{ id: "1" }],
      duplicates: 0,
      errors: [],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File(['[{"company":"JSON Corp"}]'], "test.json", {
      type: "application/json",
    });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(mockParse).toHaveBeenCalledWith(file);
    expect(result.current.result?.success).toBe(1);
  });

  it("should handle empty file", async () => {
    mockParse.mockResolvedValue([]);
    mockCreateMany.mockResolvedValue({
      inserted: [],
      duplicates: 0,
      errors: [],
    });

    const { result } = renderHook(() => useFileImport());
    const file = new File([""], "empty.csv", { type: "text/csv" });

    await act(async () => {
      await result.current.importFile(file);
    });

    expect(result.current.result?.success).toBe(0);
    expect(result.current.result?.duplicates).toBe(0);
    expect(result.current.result?.errors).toEqual([]);
  });
});
