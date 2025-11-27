import { useSearch } from "@/shared/hooks/use-search";
import { act, renderHook } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe("useSearch", () => {
  const mockPush = vi.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as never);
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as never);
  });

  test("should return empty query when param is not set", () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.query).toBe("");
  });

  test("should return query from search params", () => {
    const params = new URLSearchParams("q=test");
    vi.mocked(useSearchParams).mockReturnValue(params as never);

    const { result } = renderHook(() => useSearch());

    expect(result.current.query).toBe("test");
  });

  test("should use custom param name", () => {
    const params = new URLSearchParams("search=custom");
    vi.mocked(useSearchParams).mockReturnValue(params as never);

    const { result } = renderHook(() => useSearch("search"));

    expect(result.current.query).toBe("custom");
  });

  test("should set query and navigate", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("new search");
    });

    expect(mockPush).toHaveBeenCalledWith("/?q=new+search");
  });

  test("should delete param and navigate to root when query is empty", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("");
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("should delete param when query is whitespace only", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("   ");
    });

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("should preserve other params when setting query", () => {
    const params = new URLSearchParams("other=value");
    vi.mocked(useSearchParams).mockReturnValue(params as never);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("test");
    });

    expect(mockPush).toHaveBeenCalledWith("/?other=value&q=test");
  });

  test("should preserve other params when clearing query", () => {
    const params = new URLSearchParams("q=old&other=value");
    vi.mocked(useSearchParams).mockReturnValue(params as never);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery("");
    });

    expect(mockPush).toHaveBeenCalledWith("/?other=value");
  });
});
