"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useApplications, useLocalStorage } from "@/shared/hooks";
import { useExport } from "../hooks/use-export";
import { useFileImport } from "../hooks/use-file-import";
import { FileFormat } from "../types";
import { DataStats } from "./data-stats";
import { ExportCard } from "./export-card";
import { FormatSelector } from "./format-selector";
import { ImportCard } from "./import-card";
import { ImportExportModalHeader } from "./import-export-modal-header";
import { ImportResultDisplay } from "./import-result-display/import-result-display";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const [format, setFormat] = useLocalStorage<FileFormat>(
    "preferredExportFormat",
    "csv",
  );

  const applications = useApplications();
  const { handleExport } = useExport(applications ?? []);
  const { isImporting, result, importFile, clearResult } = useFileImport();

  const handleClose = () => {
    clearResult();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <ImportExportModalHeader />
        <DialogDescription asChild>
          <div className="space-y-6">
            <DataStats totalApplications={applications?.length ?? 0} />
            <ImportResultDisplay result={result} onDismiss={clearResult} />
            <FormatSelector value={format} onChange={setFormat} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ImportCard
                format={format}
                isLoading={isImporting}
                onFileSelect={importFile}
              />
              <ExportCard format={format} onExport={handleExport} />
            </div>
            <footer className="flex justify-end">
              <Button
                variant="secondary"
                aria-label="Close import-export dialog"
                onClick={handleClose}
              >
                Close
              </Button>
            </footer>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
