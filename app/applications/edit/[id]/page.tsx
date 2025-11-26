"use client";

import { useApplicationService } from "@/app/providers/service-provider";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Spinner } from "@/components/ui/spinner";
import { JobApplicationInput } from "@/entities/application";
import { ApplicationForm } from "@/features/application-form";
import { ROUTES } from "@/lib/routes";
import {
  ApplicationDatabaseError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from "@/shared/api";
import { useApplication, useConfirmDialog } from "@/shared/hooks";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const service = useApplicationService();
  const application = useApplication(id);

  const deleteDialog = useConfirmDialog({
    title: "Delete Application?",
    description:
      "This will permanently delete this application. This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    variant: "destructive",
  });

  if (application === undefined) {
    return <Spinner className="mx-auto mt-20 size-20" />;
  }

  if (!application) {
    return (
      <div className="container max-w-2xl py-8 text-center">
        <div className="text-destructive">Application not found</div>
      </div>
    );
  }

  const handleSubmit = async (data: JobApplicationInput) => {
    try {
      await service.update(id, data);
      toast.success("Application updated successfully");
      router.back();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteClick = () => {
    deleteDialog.openDialog();
  };

  const handleDeleteConfirm = async () => {
    try {
      await service.delete(id);
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
      toast.error("Failed to update application. Please try again.");
    }
    console.error("Form submission error:", error);
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Edit Application - {application.jobTitle} at {application.company}
      </h1>
      <ApplicationForm
        defaultValues={application}
        onSubmit={handleSubmit}
        onDelete={handleDeleteClick}
      />
      <ConfirmDialog
        {...deleteDialog.dialogProps}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
