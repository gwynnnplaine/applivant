import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileJson } from "lucide-react";

export function ImportExportModalHeader() {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <FileJson className="size-4 text-primary" />
        <span className="text-lg font-semibold">Import / Export Data</span>
      </DialogTitle>
    </DialogHeader>
  );
}
