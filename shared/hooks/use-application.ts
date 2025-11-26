import { JobApplication } from "@/entities/application";
import { DexieApplicationRepository } from "@/shared/api";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

export function useApplication(id: string): JobApplication | null | undefined {
  const repository = useMemo(() => new DexieApplicationRepository(), []);

  return useLiveQuery(() => repository.findById(id), [id, repository]);
}
