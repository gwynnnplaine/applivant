"use client";

import { useApplicationService } from "@/app/shared";
import { JobApplicationInput } from "@/app/types/job-application-input.types";
import { ApplicationForm } from "@/app/widgets/application-form/application-form";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db";
import { ROUTES } from "@/lib/routes";
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

  async function handleSubmit(updatedApplication: JobApplicationInput) {
    if (!application) return;

    try {
      await service.updateJobApplication(application.id, updatedApplication);

      toast.success("Application updated successfully");

      router.back();
    } catch {
      toast.error("Failed to update application. Please try again.");
    }
  }

  async function handleDelete() {
    if (!application) return;

    try {
      await service.deleteJobApplication(application.id);

      toast.success("Application deleted successfully");

      router.push(ROUTES.HOME);
    } catch {
      toast.error("Failed to delete application. Please try again.");
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      {isLoading ? (
        <Spinner className="mx-auto size-20" />
      ) : (
        <div>
          <h1 className="mb-6 text-2xl font-bold">
            Edit Application - {application?.jobTitle} at {application?.company}
          </h1>
          <ApplicationForm
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            defaultValues={application}
          />
        </div>
      )}
    </div>
  );
}
