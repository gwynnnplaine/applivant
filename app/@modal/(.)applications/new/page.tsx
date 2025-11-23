"use client";

import { useApplicationService } from "@/app/shared";
import type { JobApplicationInput } from "@/app/types/job-application-input.types";
import { ApplicationForm } from "@/app/widgets/application-form/application-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewApplicationModal() {
  const router = useRouter();
  const service = useApplicationService();

  const handleClose = () => {
    router.back();
  };

  async function handleSubmit(application: JobApplicationInput) {
    try {
      await service.createJobApplication(application);

      toast.success("Application added successfully");

      handleClose();
    } catch {
      toast.error("Failed to add application. Please try again.");
    }
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
        </DialogHeader>
        <ApplicationForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
