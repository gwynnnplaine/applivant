interface ResultContentProps {
  success: number;
  duplicates: number;
  hasIssues: boolean;
}

export function ResultContent({
  success,
  duplicates,
  hasIssues,
}: ResultContentProps) {
  const title = hasIssues
    ? "Import completed with issues"
    : "Import successful!";
  const summary = buildSummary(success, duplicates);

  return (
    <div>
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{summary}</p>
    </div>
  );
}

function buildSummary(success: number, duplicates: number): string {
  const parts: string[] = [];

  if (success > 0) {
    parts.push(`${success} application${success !== 1 ? "s" : ""} imported`);
  }

  if (duplicates > 0) {
    parts.push(`${duplicates} duplicate${duplicates !== 1 ? "s" : ""} skipped`);
  }

  if (parts.length === 0) {
    return "No applications imported";
  }

  return parts.join(", ");
}
