import { useServices } from "@/app/providers/service-provider";

export function useApplicationService() {
  return useServices().applicationService;
}
