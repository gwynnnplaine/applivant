import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";
import { ViewMode } from "../model/use-view-mode";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({
  viewMode,
  onViewModeChange,
  className,
}: ViewToggleProps) {
  return (
    <div
      className={cn("flex items-center gap-1 rounded-md border p-1", className)}
    >
      <Button
        variant={viewMode === "table" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("table")}
        aria-label="Table view"
        title="Table view"
        className="h-7 w-7 p-0"
      >
        <List className="h-2 w-2" />
      </Button>
      <Button
        variant={viewMode === "grid" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("grid")}
        aria-label="Grid view"
        title="Grid view"
        className="h-7 w-7 p-0"
      >
        <LayoutGrid className="h-2 w-2" />
      </Button>
    </div>
  );
}
