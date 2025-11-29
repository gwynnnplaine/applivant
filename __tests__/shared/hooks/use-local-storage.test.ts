import { useLocalStorage } from "@/shared/hooks";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("should return initial value if localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("test-key", "test-value"),
    );

    const localStorageState = result.current[0];

    expect(localStorageState).toBe("test-value");
  });

  test("should return stored value from localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "test-value"),
    );

    const localStorageState = result.current[0];

    expect(localStorageState).toBe("stored-value");
  });
  test("should return initial value if passed invalid JSON in localStorage", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    window.localStorage.setItem("test-key", "invalid-json");

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "test-value"),
    );

    const localStorageState = result.current[0];

    expect(localStorageState).toBe("test-value");

    vi.restoreAllMocks();
  });

  test("should correctly set value in localStorage (function)", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", 0));

    const [, setValue] = result.current;

    setValue((prev) => prev + 1);

    const localStorageState = JSON.parse(
      window.localStorage.getItem("test-key") as string,
    );

    expect(localStorageState).toBe(1);
  });

  test("should correctly set value in localStorage (direct)", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    const [, setValue] = result.current;

    setValue("new-value");

    const localStorageState = JSON.parse(
      window.localStorage.getItem("test-key") as string,
    );

    expect(localStorageState).toBe("new-value");
  });
  test("should keep previous value when localStorage.setItem throws", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const [, setValue] = result.current;

    setValue("new-value");

    expect(result.current[0]).toBe("initial");

    vi.restoreAllMocks();
  });

  test("should remove value from localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("test-key", "initial-value"),
    );

    expect(result.current[0]).toBe("stored-value");

    act(() => {
      result.current[2]();
    });

    const [state] = result.current;

    const localStorageState = window.localStorage.getItem("test-key");

    expect(localStorageState).toBeNull();

    expect(state).toBe("initial-value");
  });
});
