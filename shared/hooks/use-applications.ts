import { JobApplication } from "@/entities/application";
import { DexieApplicationRepository } from "@/shared/api";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

export function useApplications(): JobApplication[] | undefined {
  const repository = useMemo(() => new DexieApplicationRepository(), []);

  return useLiveQuery(() => repository.findAll(), [repository]);
}
