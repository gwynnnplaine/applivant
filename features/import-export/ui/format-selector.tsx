import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileFormat } from "../types";

interface FormatSelectorProps {
  value: FileFormat;
  onChange: (value: FileFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const handleSelectChange = (v: string) => {
    onChange(v as FileFormat);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-base font-bold">Format:</span>
      <Select value={value} onValueChange={handleSelectChange}>
        <SelectTrigger aria-label="Select export format">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="json">JSON</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
