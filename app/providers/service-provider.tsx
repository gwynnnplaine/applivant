"use client";

import { ApplicationService, DexieApplicationRepository } from "@/shared/api";
import { createContext, useContext, useMemo } from "react";

interface ServiceContextType {
  applicationService: ApplicationService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const applicationService = useMemo(() => {
    const repository = new DexieApplicationRepository();
    return new ApplicationService(repository);
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

export function useApplicationService() {
  return useServices().applicationService;
}
