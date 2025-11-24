import { JobApplication } from "@/entities/job-application";

export function filterApplications(
  applications: JobApplication[],
  query: string,
): JobApplication[] {
  if (!query) return applications;

  const lowerQuery = query.toLowerCase();
  return applications.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(lowerQuery) ||
      app.company.toLowerCase().includes(lowerQuery) ||
      app.status.toLowerCase().includes(lowerQuery),
  );
}
