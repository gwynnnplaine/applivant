"use client";

import { useApplicationService } from "@/app/shared";
import type { JobApplicationInput } from "@/app/types/job-application-input.types";
import { ApplicationForm } from "@/app/widgets/application-form/application-form";
import toast from "react-hot-toast";

export default function NewApplicationModal() {
  const service = useApplicationService();

  async function handleSubmit(application: JobApplicationInput) {
    try {
      await service.createJobApplication(application);

      toast.success("Application added successfully");
    } catch {
      toast.error("Failed to add application. Please try again.");
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Add New Application</h1>
      <ApplicationForm onSubmit={handleSubmit} />
    </div>
  );
}
