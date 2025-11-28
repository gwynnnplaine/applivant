import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-3 w-3"
      onClick={onClick}
      aria-label="Dismiss import result"
    >
      <X className="h-3 w-3" />
    </Button>
  );
}
