"use client";

import { DexieApplicationRepository } from "@/repositories";
import { JobApplicationService } from "@/services/application-service";
import { createContext, useContext, useMemo } from "react";

interface ServiceContextType {
  applicationService: JobApplicationService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const applicationService = useMemo(() => {
    const repository = new DexieApplicationRepository();
    return new JobApplicationService(repository);
  }, []);

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
