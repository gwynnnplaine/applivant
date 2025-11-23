"use client";

import { useApplicationService } from "@/app/shared";
import { JobApplicationInput } from "@/app/types/job-application-input.types";
import { ApplicationForm } from "@/app/widgets/application-form/application-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditApplicationModal() {
  const router = useRouter();
  const { id } = useParams();
  const service = useApplicationService();

  const application = useLiveQuery(
    () => db.applications.get(id as string),
    [id],
  );

  const isLoading = application === undefined;

  const handleClose = () => {
    router.back();
  };

  async function handleSubmit(updatedApplication: JobApplicationInput) {
    if (!application) return;

    try {
      await service.updateJobApplication(application.id, updatedApplication);

      toast.success("Application updated successfully");

      handleClose();
    } catch {
      toast.error("Failed to update application. Please try again.");
    }
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="min-h-[640px]">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <Spinner className="mx-auto size-20" />
        ) : (
          <ApplicationForm
            onSubmit={handleSubmit}
            defaultValues={application}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
