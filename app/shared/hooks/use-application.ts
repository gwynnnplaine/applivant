import { JobApplication } from "@/entities/job-application";
import { DexieApplicationRepository } from "@/repositories";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

export function useApplication(id: string): JobApplication | undefined {
  const repository = useMemo(() => new DexieApplicationRepository(), []);

  return useLiveQuery(() => repository.findById(id), [id, repository]);
}
