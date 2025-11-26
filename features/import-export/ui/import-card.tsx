import { Upload } from "lucide-react";

interface ImportCardProps {
  onFileSelect: (file: File) => void;
}

export function ImportCard({ onFileSelect }: ImportCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <label
      htmlFor="import-file"
      className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card transition-colors hover:bg-muted/50"
    >
      <Upload className="mb-2 h-3 w-3 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">Import JSON</span>
      <span className="text-xs text-muted-foreground">Click to upload</span>
      <input
        id="import-file"
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
  );
}
