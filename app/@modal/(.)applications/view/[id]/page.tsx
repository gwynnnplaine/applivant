"use client";

import { ApplicationDetails } from "@/app/widgets/application-details/application-details";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams, useRouter } from "next/navigation";

export default function ViewApplicationModa() {
  const router = useRouter();
  const { id } = useParams();

  const application = useLiveQuery(
    () => db.applications.get(id as string),
    [id],
  );

  const handleClose = () => {
    router.back();
  };

  const handleUpdateApplication = () => {
    router.replace(`/applications/${id}`);
  };

  if (!application) return null;

  return (
    <Dialog onOpenChange={handleClose} open>
      <DialogContent className="min-w-[700px]">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <ApplicationDetails application={application} />
        </DialogDescription>
        <div className="flex w-full justify-between border-t border-border pt-6">
          <div className="text-xs text-muted-foreground">
            Last modified:{" "}
            {new Date(application.dateModified).toLocaleDateString()}
          </div>
          <Button onClick={handleUpdateApplication}>Edit Application</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
