import { db } from "@/db";
import { JobApplicationService } from "@/services/application-service";
import { useMemo } from "react";

export function useApplicationService() {
  const service = useMemo(() => new JobApplicationService(db.applications), []);
  return service;
}
