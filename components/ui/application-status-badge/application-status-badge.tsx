import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APPLICATION_STATUS } from "@/entities/application";
import { cn } from "@/lib/utils";
import { STATUS_CONFIG } from "./application-status-config";

interface StatusBadgeProps {
  status: APPLICATION_STATUS;
  className?: string;
  onStatusChange?: (newStatus: APPLICATION_STATUS) => void;
}

export function ApplicationStatusBadge({
  status,
  className,
  onStatusChange,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-pointer items-center rounded-full px-2 py-1 text-xs font-medium",
            "transition-colors duration-150 hover:opacity-80",
            config.styles,
            className,
          )}
          role="status"
          title={config.description}
          aria-label={`Application status: ${config.label}`}
        >
          {config.label}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.values(APPLICATION_STATUS).map((statusValue) => {
          const itemConfig = STATUS_CONFIG[statusValue];
          return (
            <DropdownMenuItem
              key={statusValue}
              onClick={() => onStatusChange?.(statusValue)}
              title={itemConfig.description}
            >
              {itemConfig.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
