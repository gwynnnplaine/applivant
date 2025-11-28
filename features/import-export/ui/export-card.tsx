import { Download } from "lucide-react";
import { FileFormat } from "../types";

interface ExportCardProps {
  onExport: (format: FileFormat) => void;
  format: FileFormat;
}

export function ExportCard({ onExport, format }: ExportCardProps) {
  const handleButtonClick = () => {
    onExport(format);
  };

  return (
    <button
      onClick={handleButtonClick}
      aria-label="Export your application data"
      className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card transition-colors hover:bg-muted/50"
    >
      <Download className="h-3 w-3 text-muted-foreground" />
      <div className="flex flex-col text-sm font-medium text-foreground">
        Export {format.toUpperCase()}
        <span className="text-xs text-muted-foreground">Click to download</span>
      </div>
    </button>
  );
}
