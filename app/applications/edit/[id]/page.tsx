"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";
import { Spinner } from "@/components/ui/spinner";
import { ApplicationFormContainer } from "@/app/shared/containers/application-form-container";

export default function EditApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const application = useLiveQuery(() => db.applications.get(id!), [id]);

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

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Edit Application - {application.jobTitle} at {application.company}
      </h1>
      <ApplicationFormContainer applicationId={application.id} />
    </div>
  );
}
