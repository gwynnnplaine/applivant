"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImportExportButtonProps {
  onClick: () => void;
}

export function ImportExportButton({ onClick }: ImportExportButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      aria-label="Import or export data"
    >
      <Upload className="h-4 w-4" />
    </Button>
  );
}
