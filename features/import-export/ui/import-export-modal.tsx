"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApplications, useExport } from "@/shared/hooks";
import { DataStats } from "./data-stats";
import { ExportCard } from "./export-card";
import { ImportCard } from "./import-card";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const applications = useApplications();
  const { handleExport } = useExport(applications ?? [], "csv");

  const totalApplications = applications?.length ?? 0;

  const handleFileSelect = (file: File) => {
    // TODO: Implement import functionality
    console.warn("Import file selected:", file.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import / Export Data</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="space-y-6">
            <DataStats totalApplications={totalApplications} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ImportCard onFileSelect={handleFileSelect} />
              <ExportCard onExport={handleExport} />
            </div>

            <div className="flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
