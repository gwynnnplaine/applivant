import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APPLICATION_STATUS } from "@/entities/application-status";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<APPLICATION_STATUS, string> = {
  Saved: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Screening:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  Interview:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Offer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Accepted: "bg-green-600 text-white dark:bg-green-600 dark:text-white",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

interface ApplicationStatusBadgeProps {
  status: APPLICATION_STATUS;
  className?: string;
  onStatusChange?: (newStatus: APPLICATION_STATUS) => void;
}

export function ApplicationStatusBadge({
  status,
  className,
  onStatusChange,
}: ApplicationStatusBadgeProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-pointer items-center rounded-full px-2 py-1 text-xs font-medium hover:opacity-80",
            "transition-colors duration-150",
            STATUS_STYLES[status],
            className,
          )}
          role="status"
          title="Change application status"
          aria-label={`Application status: ${status}`}
        >
          {status}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.values(APPLICATION_STATUS).map((s) => (
          <DropdownMenuItem
            key={s}
            onClick={() => onStatusChange && onStatusChange(s)}
          >
            {s}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
