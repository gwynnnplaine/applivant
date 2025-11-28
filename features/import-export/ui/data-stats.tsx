interface DataStatsProps {
  totalApplications: number;
}

export function DataStats({ totalApplications }: DataStatsProps) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="flex items-start gap-2">
        <div>
          <h3 className="text-lg font-semibold leading-none">
            {`Total Applications: ${totalApplications}`}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Export your data to CSV or JSON for backup, or import data from a
            previous backup.
          </p>
        </div>
      </div>
    </div>
  );
}
