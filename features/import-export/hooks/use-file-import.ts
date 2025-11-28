import { useApplicationService } from "@/app/providers/service-provider";
import { JobApplicationInputSchema } from "@/entities/application";
import { useState } from "react";
import { FileParser } from "../file-parser/file-parser";
import { ImportResult } from "../types";

type FileImportState = {
  isImporting: boolean;
  result: ImportResult | null;
};

export function useFileImport() {
  const [state, setState] = useState<FileImportState>({
    isImporting: false,
    result: null,
  });

  const service = useApplicationService();

  const importFile = async (file: File) => {
    setState({ isImporting: true, result: null });

    const parser = new FileParser(JobApplicationInputSchema);
    const parsed = await parser.parse(file);
    const bulkResult = await service.createMany(parsed);

    setState({
      isImporting: false,
      result: {
        success: bulkResult.inserted.length,
        duplicates: bulkResult.duplicates,
        errors: bulkResult.errors,
      },
    });
  };

  const clearResult = () => {
    setState((prev) => ({ ...prev, result: null }));
  };

  return {
    isImporting: state.isImporting,
    result: state.result,
    importFile,
    clearResult,
  };
}
