"use client";

import { useApplication } from "@/app/shared";
import { ApplicationFormContainer } from "@/app/shared/containers/application-form-container";
import { Spinner } from "@/components/ui/spinner";
import { useParams, useRouter } from "next/navigation";

export default function EditApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const application = useApplication(id!);

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

  const handleOnSuccess = () => {
    router.back();
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">
        Edit Application - {application.jobTitle} at {application.company}
      </h1>
      <ApplicationFormContainer
        application={application}
        onSuccess={handleOnSuccess}
      />
    </div>
  );
}
