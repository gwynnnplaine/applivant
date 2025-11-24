"use client";

import { DataTable } from "@/components/ui/data-table";
import { useApplications } from "@/app/shared";
import { JobApplication } from "@/entities/job-application";
import { ROUTES } from "@/lib/routes";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "./applications-table-columns";
import { EmptyApplicationState } from "./empty-applications-state";
import { TableLoadingState } from "./table-loading-state";
import { filterApplications } from "./filter-utils";
import { SEARCH_QUERY_PARAM } from "../consts";

export function ApplicationsTable() {
  const searchParams = useSearchParams();
  const query = searchParams.get(SEARCH_QUERY_PARAM) || "";
  const applications = useApplications();
  const router = useRouter();

  if (applications === undefined) {
    return <TableLoadingState />;
  }

  if (applications.length === 0) {
    return <EmptyApplicationState />;
  }

  const handleRowClick = (application: JobApplication) => {
    router.push(ROUTES.VIEW_APPLICATION(application.id));
  };

  const filteredApplications = filterApplications(applications, query);

  return (
    <DataTable
      columns={columns}
      data={filteredApplications}
      onRowClick={handleRowClick}
      enablePagination
      emptyStateText="No applications found matching your search."
    />
  );
}
