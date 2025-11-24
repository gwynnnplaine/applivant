"use client";

import { createContext, useContext, useMemo } from "react";
import { db } from "@/db";
import { JobApplicationService } from "@/services/application-service";

interface ServiceContextType {
  applicationService: JobApplicationService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const applicationService = useMemo(
    () => new JobApplicationService(db.applications),
    [],
  );

  return (
    <ServiceContext.Provider value={{ applicationService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServices must be used within ServiceProvider");
  }
  return context;
}
