import { DataTable } from "@/components/ui/data-table";
import { JobApplication } from "@/entities/application";
import { getTableColumns } from "./table-columns";

interface ApplicationTableProps {
  applications: JobApplication[];
  onStatusChange?: (application: JobApplication) => void;
}

export function ApplicationTable({
  applications,
  onStatusChange,
}: ApplicationTableProps) {
  const columns = getTableColumns({ onStatusChange });

  return (
    <DataTable
      columns={columns}
      data={applications}
      enablePagination
      emptyStateText="No applications found matching your search."
    />
  );
}
