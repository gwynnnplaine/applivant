import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Upload } from "lucide-react";
import { FileFormat } from "../types";

interface ImportCardProps {
  onFileSelect: (file: File) => void;
  format: FileFormat;
  isLoading?: boolean;
}

export function ImportCard({
  onFileSelect,
  format,
  isLoading = false,
}: ImportCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    onFileSelect(file);
  };

  const acceptTypes = format === "json" ? ".json" : ".csv";
  const formatLabel = format.toUpperCase();

  return (
    <label
      htmlFor="import-file"
      className={`flex h-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card transition-colors ${
        isLoading
          ? "cursor-wait opacity-50"
          : "cursor-pointer hover:bg-muted/50"
      }`}
    >
      {isLoading ? (
        <>
          <Spinner className="h-6 w-6" />
          <span className="text-sm text-muted-foreground">Importing...</span>
        </>
      ) : (
        <>
          <Upload className="h-3 w-3 text-muted-foreground" />
          <div className="flex flex-col text-sm font-medium text-foreground">
            Import {formatLabel}
            <span className="text-xs text-muted-foreground">
              Click to upload
            </span>
          </div>
        </>
      )}
      <Input
        id="import-file"
        type="file"
        accept={acceptTypes}
        aria-label="Import your application data"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </label>
  );
}
