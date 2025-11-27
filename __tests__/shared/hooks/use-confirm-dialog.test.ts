import { useConfirmDialog } from "@/shared/hooks/use-confirm-dialog";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("useConfirmDialog", () => {
  const defaultOptions = {
    title: "Confirm Action",
    description: "Are you sure you want to proceed?",
  };

  describe("initial state", () => {
    test("should be closed by default", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      expect(result.current.isOpen).toBe(false);
    });

    test("should return dialogProps with open set to false", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      expect(result.current.dialogProps.open).toBe(false);
    });
  });

  describe("openDialog", () => {
    test("should set isOpen to true", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      act(() => {
        result.current.openDialog();
      });

      expect(result.current.isOpen).toBe(true);
    });

    test("should update dialogProps.open to true", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      act(() => {
        result.current.openDialog();
      });

      expect(result.current.dialogProps.open).toBe(true);
    });
  });

  describe("closeDialog", () => {
    test("should set isOpen to false", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      act(() => {
        result.current.openDialog();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.closeDialog();
      });
      expect(result.current.isOpen).toBe(false);
    });

    test("should update dialogProps.open to false", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      act(() => {
        result.current.openDialog();
      });

      act(() => {
        result.current.closeDialog();
      });

      expect(result.current.dialogProps.open).toBe(false);
    });
  });

  describe("onOpenChange", () => {
    test("should open dialog when called with true", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      act(() => {
        result.current.dialogProps.onOpenChange(true);
      });

      expect(result.current.isOpen).toBe(true);
    });

    test("should close dialog when called with false", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      act(() => {
        result.current.openDialog();
      });

      act(() => {
        result.current.dialogProps.onOpenChange(false);
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("dialogProps", () => {
    test("should include title from options", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      expect(result.current.dialogProps.title).toBe("Confirm Action");
    });

    test("should include description from options", () => {
      const { result } = renderHook(() => useConfirmDialog(defaultOptions));

      expect(result.current.dialogProps.description).toBe(
        "Are you sure you want to proceed?",
      );
    });

    test("should include confirmLabel when provided", () => {
      const options = {
        ...defaultOptions,
        confirmLabel: "Yes, Delete",
      };
      const { result } = renderHook(() => useConfirmDialog(options));

      expect(result.current.dialogProps.confirmLabel).toBe("Yes, Delete");
    });

    test("should include cancelLabel when provided", () => {
      const options = {
        ...defaultOptions,
        cancelLabel: "No, Keep It",
      };
      const { result } = renderHook(() => useConfirmDialog(options));

      expect(result.current.dialogProps.cancelLabel).toBe("No, Keep It");
    });

    test("should include variant when provided", () => {
      const options = {
        ...defaultOptions,
        variant: "destructive" as const,
      };
      const { result } = renderHook(() => useConfirmDialog(options));

      expect(result.current.dialogProps.variant).toBe("destructive");
    });

    test("should include all options with all fields provided", () => {
      const options = {
        title: "Delete Item",
        description: "This action cannot be undone.",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        variant: "destructive" as const,
      };
      const { result } = renderHook(() => useConfirmDialog(options));

      expect(result.current.dialogProps).toMatchObject({
        title: "Delete Item",
        description: "This action cannot be undone.",
        confirmLabel: "Delete",
        cancelLabel: "Cancel",
        variant: "destructive",
        open: false,
      });
      expect(result.current.dialogProps.onOpenChange).toBeTypeOf("function");
    });
  });

  describe("function stability", () => {
    test("openDialog should be stable across rerenders", () => {
      const { result, rerender } = renderHook(() =>
        useConfirmDialog(defaultOptions),
      );

      const firstOpenDialog = result.current.openDialog;
      rerender();
      const secondOpenDialog = result.current.openDialog;

      expect(firstOpenDialog).toBe(secondOpenDialog);
    });

    test("closeDialog should be stable across rerenders", () => {
      const { result, rerender } = renderHook(() =>
        useConfirmDialog(defaultOptions),
      );

      const firstCloseDialog = result.current.closeDialog;
      rerender();
      const secondCloseDialog = result.current.closeDialog;

      expect(firstCloseDialog).toBe(secondCloseDialog);
    });
  });
});
