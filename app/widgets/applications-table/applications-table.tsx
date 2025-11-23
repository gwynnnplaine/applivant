"use client";

import { DataTable } from "@/components/ui/data-table";
import { Spinner } from "@/components/ui/spinner";
import { db } from "@/db";
import { JobApplication } from "@/entities/job-application";
import { ROUTES } from "@/lib/routes";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { columns } from "./applications-table-columns";
import { EmptyApplicationState } from "./empty-applications-state";

export function ApplicationsTable() {
  const searchParams = useSearchParams();
  const query = searchParams.get("search")?.toLowerCase() || "";

  const applications = useLiveQuery(() => db.applications.toArray(), []);
  const router = useRouter();

  if (applications === undefined) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Loading applications...</h1>
        <Spinner className="size-20" />
      </div>
    );
  }

  if (applications.length === 0) {
    return <EmptyApplicationState />;
  }

  function handleRowClick(application: JobApplication) {
    router.push(ROUTES.VIEW_APPLICATION(application.id));
  }

  const filtered = applications.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(query) ||
      app.company.toLowerCase().includes(query) ||
      app.status.toLowerCase().includes(query),
  );

  return (
    <DataTable
      columns={columns}
      data={filtered}
      onRowClick={handleRowClick}
      enablePagination
      emptyStateText="No applications found."
    />
  );
}
