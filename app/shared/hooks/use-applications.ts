import { JobApplication } from "@/entities/job-application";
import { DexieApplicationRepository } from "@/repositories";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

export function useApplications(): JobApplication[] | undefined {
  const repository = useMemo(() => new DexieApplicationRepository(), []);

  return useLiveQuery(() => repository.findAll(), [repository]);
}
