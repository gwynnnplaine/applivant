"use client";

import { useApplicationService } from "@/app/providers/service-provider";
import { JobApplicationInput } from "@/entities/application";
import { ApplicationForm } from "@/features/application-form";
import { ROUTES } from "@/lib/routes";
import {
  ApplicationDatabaseError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from "@/shared/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewApplicationPage() {
  const router = useRouter();
  const service = useApplicationService();

  const handleSubmit = async (data: JobApplicationInput) => {
    try {
      await service.create(data);
      toast.success("Application added successfully");
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
      toast.error("Failed to add application. Please try again.");
    }
    console.error("Form submission error:", error);
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Add New Application</h1>
      <ApplicationForm onSubmit={handleSubmit} />
    </div>
  );
}
