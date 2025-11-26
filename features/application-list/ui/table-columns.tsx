import { ApplicationStatusBadge } from "@/components/ui/application-status-badge/";
import { APPLICATION_STATUS, JobApplication } from "@/entities/application";
import { type ColumnDef } from "@tanstack/react-table";

interface GetColumnsOptions {
  onStatusChange?: (application: JobApplication) => void;
}

export function getTableColumns(
  options: GetColumnsOptions = {},
): ColumnDef<JobApplication>[] {
  const { onStatusChange } = options;

  return [
    {
      accessorKey: "company",
      header: "Company",
      enableSorting: true,
      meta: {
        className: "text-left",
      },
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
      meta: {
        className: "text-left",
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      meta: {
        className: "text-left",
      },
      cell: ({ getValue, row }) => {
        const status = getValue<APPLICATION_STATUS>();

        const handleStatusChange = (newStatus: APPLICATION_STATUS) => {
          onStatusChange?.({
            ...row.original,
            status: newStatus,
          });
        };

        return (
          <ApplicationStatusBadge
            status={status}
            onStatusChange={handleStatusChange}
          />
        );
      },
    },
    {
      accessorKey: "jobType",
      header: "Job Type",
      meta: {
        className: "text-left",
      },
    },
    {
      accessorKey: "salary",
      header: "Salary",
      meta: {
        className: "text-left",
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      meta: {
        className: "text-left",
      },
    },
    {
      accessorKey: "dateAdded",
      header: "Date Added",
      enableSorting: true,
      meta: {
        className: "text-left",
      },
      cell: ({ getValue }) => {
        const date = getValue<Date>();
        return date.toLocaleDateString();
      },
    },
  ];
}
