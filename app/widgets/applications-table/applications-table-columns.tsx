import { ApplicationStatusBadge } from "@/app/widgets/application-status-badge/application-status-badge";
import { APPLICATION_STATUS } from "@/entities/application-status";
import { JobApplication } from "@/entities/job-application";
import { type ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<JobApplication>[] = [
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
    meta: {
      className: "text-left",
    },
    cell: ({ getValue }) => {
      const status = getValue<APPLICATION_STATUS>();

      return <ApplicationStatusBadge status={status} />;
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
    meta: {
      className: "text-left",
    },
    cell: ({ getValue }) => {
      const date = getValue<Date>();
      return date.toLocaleDateString();
    },
  },
];
