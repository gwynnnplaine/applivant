import { ImportResult } from "../../types";
import { DismissButton } from "./dismiss-button";
import { ErrorList } from "./errors-list";
import { ResultContent } from "./result-summary";
import { StatusIcon } from "./status-icon";

const CONTAINER_STYLES = {
  success:
    "rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950",
  warning:
    "rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950",
} as const;

interface ImportResultDisplayProps {
  result: ImportResult | null;
  onDismiss: () => void;
}

export function ImportResultDisplay({
  result,
  onDismiss,
}: ImportResultDisplayProps) {
  if (!result) {
    return null;
  }

  const { success, duplicates, errors } = result;
  const hasIssues = duplicates > 0 || errors.length > 0;
  const variant = hasIssues ? "warning" : "success";

  return (
    <div
      className={CONTAINER_STYLES[variant]}
      role="alert"
      aria-label="Import result"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <StatusIcon variant={variant} />
          <ResultContent
            success={success}
            duplicates={duplicates}
            hasIssues={hasIssues}
          />
          <ErrorList errors={errors} />
        </div>
        <DismissButton onClick={onDismiss} />
      </div>
    </div>
  );
}
