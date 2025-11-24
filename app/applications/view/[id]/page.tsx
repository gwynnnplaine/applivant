"use client";

import { useApplicationService } from "@/app/shared";
import { ApplicationDetails } from "@/app/widgets/application-details/application-details";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { APPLICATION_STATUS } from "@/entities/application-status";
import { ROUTES } from "@/lib/routes";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ViewApplicationModa() {
  const router = useRouter();
  const { id } = useParams();
  const service = useApplicationService();

  const application = useLiveQuery(
    () => db.applications.get(id as string),
    [id],
  );

  // TODO: Add error layout
  if (!application) return null;

  const handleUpdateApplication = () => {
    router.push(ROUTES.EDIT_APPLICATION(application.id));
  };

  async function handleDelete() {
    if (!application) return;

    try {
      await service.deleteJobApplication(application.id);

      router.push(ROUTES.HOME);

      toast.success("Application deleted successfully");
    } catch {
      toast.error("Failed to delete application. Please try again.");
    }
  }

  async function handleStatusChange(newStatus: APPLICATION_STATUS) {
    if (!application) return;

    try {
      await service.updateJobApplication(application.id, {
        ...application,
        status: newStatus,
      });

      toast.success("Application status updated successfully");
    } catch {
      toast.error("Failed to update application status. Please try again.");
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <ApplicationDetails
        application={application}
        onStatusChange={handleStatusChange}
      />
      <div className="flex w-full justify-between border-t border-border pt-6">
        <Button type="button" variant="destructive" onClick={handleDelete}>
          Delete Application
        </Button>
        <Button onClick={handleUpdateApplication}>Edit Application</Button>
      </div>
    </div>
  );
}
