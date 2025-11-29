import { useSearch } from "@/shared/hooks/use-search";
import { renderHook, act } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, test } from "vitest";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
);

describe("useSearch", () => {
  test("should return empty query by default", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.query).toBe("");
  });

  test("should read initial value from params", () => {
    const { result } = renderHook(() => useSearch(), {
      wrapper: ({ children }) => (
        <NuqsTestingAdapter searchParams={{ q: "initial" }}>
          {children}
        </NuqsTestingAdapter>
      ),
    });

    expect(result.current.query).toBe("initial");
  });

  test("should use custom param name", () => {
    const { result } = renderHook(() => useSearch("search"), {
      wrapper: ({ children }) => (
        <NuqsTestingAdapter searchParams={{ search: "custom" }}>
          {children}
        </NuqsTestingAdapter>
      ),
    });

    expect(result.current.query).toBe("custom");
  });

  test("should update query", async () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    await act(() => result.current.setQuery("new value"));

    expect(result.current.query).toBe("new value");
  });
});
