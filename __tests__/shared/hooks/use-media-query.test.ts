import {
  useIsDesktop,
  useIsMdOrLarger,
  useIsMobile,
  useIsTablet,
  useMediaQuery,
} from "@/shared/hooks/use-media-query";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

const createMatchMedia = (matches: boolean) => {
  const listeners: Array<() => void> = [];
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, cb: () => void) => listeners.push(cb),
    removeEventListener: (_: string, cb: () => void) => {
      const index = listeners.indexOf(cb);
      if (index > -1) listeners.splice(index, 1);
    },
    dispatchChange: (newMatches: boolean) => {
      Object.defineProperty(window.matchMedia(query), "matches", {
        value: newMatches,
        writable: true,
      });
      listeners.forEach((cb) => cb());
    },
  }));
};

describe("useMediaQuery", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test("should return true when media query matches", () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(true);
  });

  test("should return false when media query does not match", () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toBe(false);
  });

  test("should call matchMedia with correct query", () => {
    const mockMatchMedia = createMatchMedia(false);
    window.matchMedia = mockMatchMedia;

    renderHook(() => useMediaQuery("(min-width: 1024px)"));

    expect(mockMatchMedia).toHaveBeenCalledWith("(min-width: 1024px)");
  });
});

describe("useIsMobile", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test("should return true when screen is smaller than 768px", () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  test("should return false when screen is 768px or larger", () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });
});

describe("useIsTablet", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test("should return true when screen is between 768px and 1024px", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === "(min-width: 768px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(true);
  });

  test("should return false when screen is smaller than 768px", () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(false);
  });

  test("should return false when screen is 1024px or larger", () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(false);
  });
});

describe("useIsDesktop", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test("should return true when screen is 1024px or larger", () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(true);
  });

  test("should return false when screen is smaller than 1024px", () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useIsDesktop());

    expect(result.current).toBe(false);
  });
});

describe("useIsMdOrLarger", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  test("should return true when screen is 768px or larger", () => {
    window.matchMedia = createMatchMedia(true);

    const { result } = renderHook(() => useIsMdOrLarger());

    expect(result.current).toBe(true);
  });

  test("should return false when screen is smaller than 768px", () => {
    window.matchMedia = createMatchMedia(false);

    const { result } = renderHook(() => useIsMdOrLarger());

    expect(result.current).toBe(false);
  });
});
