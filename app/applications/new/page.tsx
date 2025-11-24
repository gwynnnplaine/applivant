"use client";

import { ApplicationFormContainer } from "@/app/shared/containers/application-form-container";

export default function NewApplicationPage() {
  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-6 text-2xl font-bold">Add New Application</h1>
      <ApplicationFormContainer />
    </div>
  );
}
