import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  APPLICATION_STATUS,
  STATUS_METADATA,
} from "@/entities/application-status";
import { cn } from "@/lib/utils";

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
  const metadata = STATUS_METADATA[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-pointer items-center rounded-full px-2 py-1 text-xs font-medium hover:opacity-80",
            "transition-colors duration-150",
            metadata.styles,
            className,
          )}
          role="status"
          title={metadata.description || "Change application status"}
          aria-label={`Application status: ${status}`}
        >
          {metadata.icon && <span className="mr-1">{metadata.icon}</span>}
          {metadata.label}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.values(APPLICATION_STATUS).map((s) => {
          const itemMetadata = STATUS_METADATA[s];
          return (
            <DropdownMenuItem
              key={s}
              onClick={() => onStatusChange?.(s)}
              title={itemMetadata.description}
            >
              {itemMetadata.icon && (
                <span className="mr-2">{itemMetadata.icon}</span>
              )}
              {itemMetadata.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
