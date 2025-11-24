import { FileJson } from "lucide-react";

interface DataStatsProps {
  totalApplications: number;
}

export function DataStats({ totalApplications }: DataStatsProps) {
  const pluralized = totalApplications === 1 ? "application" : "applications";

  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="flex items-start gap-3">
        <FileJson className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Data Management
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Export your {totalApplications} {pluralized} to JSON for backup, or
            import data from a previous backup.
          </p>
        </div>
      </div>
    </div>
  );
}
