import { JobApplication } from "@/entities/application";
import { ApplicationCard } from "./application-card";

interface ApplicationGridProps {
  applications: JobApplication[];
  onStatusClick?: (application: JobApplication) => void;
}

export function ApplicationGrid({
  applications,
  onStatusClick,
}: ApplicationGridProps) {
  if (applications.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center text-muted-foreground">
        No applications found matching your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          application={application}
          onClick={onStatusClick}
        />
      ))}
    </div>
  );
}
