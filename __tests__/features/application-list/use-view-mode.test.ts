import { useViewMode } from "@/features/application-list/model/use-view-mode";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("useViewMode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it("should return table as default view mode", () => {
    const { result } = renderHook(() => useViewMode());

    expect(result.current.viewMode).toBe("table");
  });

  it("should return grid when view param is grid", () => {
    mockSearchParams = new URLSearchParams("view=grid");

    const { result } = renderHook(() => useViewMode());

    expect(result.current.viewMode).toBe("grid");
  });

  it("should return table when view param is table", () => {
    mockSearchParams = new URLSearchParams("view=table");

    const { result } = renderHook(() => useViewMode());

    expect(result.current.viewMode).toBe("table");
  });

  it("should return table for invalid view param", () => {
    mockSearchParams = new URLSearchParams("view=invalid");

    const { result } = renderHook(() => useViewMode());

    expect(result.current.viewMode).toBe("table");
  });

  it("should navigate with view=grid when setting grid mode", () => {
    const { result } = renderHook(() => useViewMode());

    act(() => {
      result.current.setViewMode("grid");
    });

    expect(mockPush).toHaveBeenCalledWith("/?view=grid", { scroll: false });
  });

  it("should remove view param when setting table mode", () => {
    mockSearchParams = new URLSearchParams("view=grid");

    const { result } = renderHook(() => useViewMode());

    act(() => {
      result.current.setViewMode("table");
    });

    expect(mockPush).toHaveBeenCalledWith("/", { scroll: false });
  });

  it("should preserve other search params when changing view mode", () => {
    mockSearchParams = new URLSearchParams("search=test&other=value");

    const { result } = renderHook(() => useViewMode());

    act(() => {
      result.current.setViewMode("grid");
    });

    expect(mockPush).toHaveBeenCalledWith(
      "/?search=test&other=value&view=grid",
      { scroll: false },
    );
  });
});
