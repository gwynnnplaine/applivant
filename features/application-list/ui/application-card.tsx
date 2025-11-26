import { ApplicationStatusBadge } from "@/components/ui/application-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APPLICATION_STATUS, JobApplication } from "@/entities/application";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  application: JobApplication;
  onClick?: (application: JobApplication) => void;
}

export function ApplicationCard({
  application,
  onClick,
}: ApplicationCardProps) {
  function handleStatusClick(status: APPLICATION_STATUS) {
    onClick?.({
      ...application,
      status,
    });
  }

  return (
    <Card
      className={cn(
        "w-full rounded-lg border border-border bg-card p-0 text-left shadow-sm transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary",
        onClick && "cursor-pointer hover:bg-muted",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            <h3 className="font-semibold text-foreground">
              {application.company}
            </h3>
            <p className="text-sm text-muted-foreground">
              {application.jobTitle}
            </p>
          </CardTitle>
          <ApplicationStatusBadge
            status={application.status}
            onStatusChange={handleStatusClick}
          />
        </div>
      </CardHeader>
      <CardContent className="mt-4 text-xs text-muted-foreground">
        Added: {application.dateAdded.toLocaleDateString()}
      </CardContent>
    </Card>
  );
}
