export type FileFormat = "json" | "csv";

export type ImportResult = {
  success: number;
  duplicates: number;
  errors: string[];
};
