"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useApplications } from "@/app/shared";
import { useCsvExport } from "@/hooks/use-csv-upload";
import { ImportCard } from "./import-card";
import { ExportCard } from "./export-card";
import { DataStats } from "./data-stats";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportExportModal({ isOpen, onClose }: ImportExportModalProps) {
  const applications = useApplications();
  const { handleExport } = useCsvExport(applications || []);

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
        <DialogDescription>
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
