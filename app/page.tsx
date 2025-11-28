"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { ApplicationList } from "@/features/application-list";
import { useApplicationService } from "./providers/service-provider";

export default function Home() {
  const service = useApplicationService();

  return (
    <div className="flex flex-1 flex-col rounded-lg border bg-card px-2 py-4 text-center">
      <ErrorBoundary fallback={<FallbackComponent />}>
        <ApplicationList service={service} />
      </ErrorBoundary>
    </div>
  );
}

function FallbackComponent() {
  return (
    <div className="p-8 text-destructive">
      Failed to load applications table
    </div>
  );
}
