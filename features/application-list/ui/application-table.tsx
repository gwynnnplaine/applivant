import { DataTable } from "@/components/ui/data-table";
import { JobApplication } from "@/entities/application";
import { ROUTES } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { getTableColumns } from "./table-columns";

interface ApplicationTableProps {
  applications: JobApplication[];
  onStatusChange?: (application: JobApplication) => void;
}

export function ApplicationTable({
  applications,
  onStatusChange,
}: ApplicationTableProps) {
  const router = useRouter();
  const columns = getTableColumns({ onStatusChange });

  const handleRowClick = (application: JobApplication) => {
    router.push(ROUTES.VIEW_APPLICATION(application.id));
  };

  return (
    <DataTable
      columns={columns}
      data={applications}
      onRowClick={handleRowClick}
      enablePagination
      emptyStateText="No applications found matching your search."
    />
  );
}
