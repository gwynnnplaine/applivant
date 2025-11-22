"use client";

import { useRouter, useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddApplicationForm } from "@/app/widgets/add-application-form/add-application-form";
import { useApplicationService } from "@/app/shared";
import { JobApplicationInput } from "@/entities/job-application";

export default function EditApplicationModal() {
  const router = useRouter();
  const { id } = useParams();
  const service = useApplicationService();

  const application = useLiveQuery(
    () => db.applications.get(id as string),
    [id],
  );

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = (data: JobApplicationInput) => {
    if (!application) return;
    service.updateJobApplication(application.id, data);
    handleClose();
  };

  if (!application) return <div>Loading...</div>;

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
        </DialogHeader>
        <AddApplicationForm
          onSubmit={handleSubmit}
          defaultValues={application}
        />
      </DialogContent>
    </Dialog>
  );
}
