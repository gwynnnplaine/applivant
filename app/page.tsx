"use client";
import { ErrorBoundary } from "@/components/error-boundary";
import { ApplicationsTable } from "./widgets";

export default function Home() {
  return (
    <div className="flex h-screen flex-col rounded-lg border bg-card px-2 py-4 text-center">
      <ErrorBoundary fallback={<FallbackComponent />}>
        <ApplicationsTable />
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
