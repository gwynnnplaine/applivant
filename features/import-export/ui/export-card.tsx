import { Download } from "lucide-react";

interface ExportCardProps {
  onExport: () => void;
}

export function ExportCard({ onExport }: ExportCardProps) {
  return (
    <button
      onClick={onExport}
      className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-border bg-card transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <Download className="mb-2 h-3 w-3 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">Export Data</span>
      <span className="text-xs text-muted-foreground">Download JSON</span>
    </button>
  );
}
