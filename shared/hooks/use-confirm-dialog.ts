import { useCallback, useState } from "react";

interface UseConfirmDialogOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
}

interface UseConfirmDialogReturn {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  dialogProps: UseConfirmDialogOptions & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  };
}

export function useConfirmDialog(
  options: UseConfirmDialogOptions,
): UseConfirmDialogReturn {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    openDialog,
    closeDialog,
    dialogProps: {
      ...options,
      open: isOpen,
      onOpenChange: setIsOpen,
    },
  };
}
