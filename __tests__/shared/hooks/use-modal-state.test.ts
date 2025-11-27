import { useModalState } from "@/shared/hooks/use-modal-state";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("useModalState", () => {
  test("should be closed by default", () => {
    const { result } = renderHook(() => useModalState());

    expect(result.current.isOpen).toBe(false);
  });

  test("should respect initial state", () => {
    const { result } = renderHook(() => useModalState(true));

    expect(result.current.isOpen).toBe(true);
  });

  test("should open modal", () => {
    const { result } = renderHook(() => useModalState());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isOpen).toBe(true);
  });

  test("should close modal", () => {
    const { result } = renderHook(() => useModalState(true));

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
  });
});
