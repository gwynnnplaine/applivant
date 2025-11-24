"use client";

import { JobApplicationInput } from "@/app/types/job-application-input.types";
import { ApplicationForm } from "@/app/widgets/application-form/application-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { JobApplication } from "@/entities/job-application";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { ROUTES } from "@/lib/routes";
import {
  ApplicationDatabaseError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from "@/services/errors";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useApplicationService } from "../hooks/use-application-service";

interface ApplicationFormContainerProps {
  application?: JobApplication;
  onSuccess?: () => void;
}

export function ApplicationFormContainer({
  application,
  onSuccess,
}: ApplicationFormContainerProps) {
  const router = useRouter();
  const service = useApplicationService();
  const applicationId = application?.id;
  const isEditing = Boolean(applicationId);

  const deleteDialog = useConfirmDialog({
    title: "Delete Application?",
    description:
      "This will permanently delete this application. This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    variant: "destructive",
  });

  const handleSubmit = async (data: JobApplicationInput) => {
    try {
      if (isEditing) {
        await service.updateJobApplication(applicationId!, data);
        toast.success("Application updated successfully");
      } else {
        await service.createJobApplication(data);
        toast.success("Application added successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteClick = () => {
    if (!isEditing || !applicationId) return;
    deleteDialog.openDialog();
  };

  const handleDeleteConfirm = async () => {
    if (!applicationId) return;

    try {
      await service.deleteJobApplication(applicationId);
      toast.success("Application deleted successfully");
      router.push(ROUTES.HOME);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof ApplicationValidationError) {
      toast.error(
        `Validation error${error.field ? ` in ${error.field}` : ""}: ${error.message}`,
      );
    } else if (error instanceof ApplicationNotFoundError) {
      toast.error("Application not found");
    } else if (error instanceof ApplicationDatabaseError) {
      toast.error(`Database error: ${error.message}`);
    } else {
      toast.error(
        `Failed to ${isEditing ? "update" : "add"} application. Please try again.`,
      );
    }
    console.error("Form submission error:", error);
  };

  return (
    <>
      <ApplicationForm
        onSubmit={handleSubmit}
        defaultValues={application}
        onDelete={isEditing ? handleDeleteClick : undefined}
      />
      <ConfirmDialog
        {...deleteDialog.dialogProps}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
