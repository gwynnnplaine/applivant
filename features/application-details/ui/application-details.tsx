import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { APPLICATION_STATUS, JobApplication } from "@/entities/application";
import { DateDisplay } from "./date-display";
import { LocationInfo, SalaryInfo } from "./info-item";
import { JobLink } from "./job-link";
import { NotesDisplay } from "./notes-display";

interface ApplicationDetailsProps {
  application: JobApplication;
  onStatusChange?: (newStatus: APPLICATION_STATUS) => void;
}

export function ApplicationDetails({
  application,
  onStatusChange,
}: ApplicationDetailsProps) {
  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            {application.company}
          </h2>
          <p className="mt-1 text-lg font-medium text-muted-foreground">
            {application.jobTitle}
          </p>
        </div>
        <ApplicationStatusBadge
          status={application.status}
          className="px-3 py-1.5 text-sm"
          onStatusChange={onStatusChange}
        />
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SalaryInfo salary={application.salary} />
        <LocationInfo location={application.location} />
        <DateDisplay
          dateAdded={application.dateAdded}
          dateModified={application.dateModified}
        />
        <JobLink url={application.jobUrl} />
      </div>

      <NotesDisplay notes={application.notes} />
    </div>
  );
}
