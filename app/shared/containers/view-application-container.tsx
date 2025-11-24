"use client";

import { useApplication, useApplicationService } from "@/app/shared";
import { ApplicationDetails } from "@/app/widgets/application-details/application-details";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { APPLICATION_STATUS } from "@/entities/application-status";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ViewApplicationContainerProps {
  applicationId: string;
}

export function ViewApplicationContainer({
  applicationId,
}: ViewApplicationContainerProps) {
  const router = useRouter();
  const service = useApplicationService();
  const application = useApplication(applicationId);

  const deleteDialog = useConfirmDialog({
    title: "Delete Application?",
    description:
      "This will permanently delete this application. This action cannot be undone.",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    variant: "destructive",
  });

  if (application === undefined) {
    return null;
  }

  if (!application) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="text-center text-destructive">
          Application not found
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(ROUTES.EDIT_APPLICATION(application.id));
  };

  const handleDeleteClick = () => {
    deleteDialog.openDialog();
  };

  const handleDeleteConfirm = async () => {
    try {
      await service.deleteJobApplication(application.id);
      router.push(ROUTES.HOME);
      toast.success("Application deleted successfully");
    } catch {
      toast.error("Failed to delete application. Please try again.");
    }
  };

  const handleStatusChange = async (newStatus: APPLICATION_STATUS) => {
    try {
      await service.updateJobApplication(application.id, {
        ...application,
        status: newStatus,
      });
      toast.success("Application status updated successfully");
    } catch {
      toast.error("Failed to update application status. Please try again.");
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <ApplicationDetails
        application={application}
        onStatusChange={handleStatusChange}
      />
      <div className="flex w-full justify-between border-t border-border pt-6">
        <Button type="button" variant="destructive" onClick={handleDeleteClick}>
          Delete Application
        </Button>
        <Button onClick={handleEdit}>Edit Application</Button>
      </div>
      <ConfirmDialog
        {...deleteDialog.dialogProps}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
