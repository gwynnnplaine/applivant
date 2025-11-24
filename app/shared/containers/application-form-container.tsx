"use client";

import { useApplicationService } from "../hooks/use-application-service";
import { JobApplicationInput } from "@/app/types/job-application-input.types";
import { ApplicationForm } from "@/app/widgets/application-form/application-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ROUTES } from "@/lib/routes";
import {
  ApplicationValidationError,
  ApplicationNotFoundError,
  ApplicationDatabaseError,
} from "@/services/errors";

interface ApplicationFormContainerProps {
  applicationId?: string;
  onSuccess?: () => void;
}

export function ApplicationFormContainer({
  applicationId,
  onSuccess,
}: ApplicationFormContainerProps) {
  const router = useRouter();
  const service = useApplicationService();
  const isEditing = Boolean(applicationId);

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

  const handleDelete = async () => {
    if (!isEditing || !applicationId) return;

    const confirmed = confirm(
      "Are you sure you want to delete this application?",
    );
    if (!confirmed) return;

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
    <ApplicationForm
      onSubmit={handleSubmit}
      onDelete={isEditing ? handleDelete : undefined}
    />
  );
}
