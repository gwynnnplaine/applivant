"use client";

import { JobApplication } from "@/entities/application";
import { ApplicationService } from "@/shared/api";
import { useApplications, useIsMdOrLarger } from "@/shared/hooks";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { filterApplications } from "../lib/filter-applications";
import { useViewMode } from "../model/use-view-mode";
import { ApplicationGrid } from "./application-grid";
import { ApplicationTable } from "./application-table";
import { EmptyState } from "./empty-state";
import { LoadingState } from "./loading-state";
import { ViewToggle } from "./view-toggle";

const SEARCH_QUERY_PARAM = "search";

interface ApplicationListProps {
  service: ApplicationService;
}

export function ApplicationList({ service }: ApplicationListProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get(SEARCH_QUERY_PARAM) ?? "";
  const applications = useApplications();
  const isMdOrLarger = useIsMdOrLarger();
  const { viewMode, setViewMode } = useViewMode();

  // On mobile, always show grid; on desktop, use user preference
  const effectiveViewMode = isMdOrLarger ? viewMode : "grid";

  const filteredApplications = useMemo(
    () => filterApplications(applications ?? [], query),
    [applications, query],
  );

  const handleStatusChange = async (application: JobApplication) => {
    await service.update(application.id, application);
  };

  if (applications === undefined) {
    return <LoadingState />;
  }

  if (applications.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden items-center justify-end md:flex">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {effectiveViewMode === "table" ? (
        <ApplicationTable
          applications={filteredApplications}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <ApplicationGrid
          applications={filteredApplications}
          onApplicationClick={handleStatusChange}
        />
      )}
    </div>
  );
}
