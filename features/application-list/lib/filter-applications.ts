import { JobApplication } from "@/entities/application";

export function filterApplications(
  applications: JobApplication[],
  query: string,
): JobApplication[] {
  if (!query.trim()) {
    return applications;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return applications.filter((application) => {
    const searchableFields = [
      application.company,
      application.jobTitle,
      application.status,
      application.jobType,
      application.salary,
      application.location,
      application.notes,
    ];

    return searchableFields.some(
      (field) => field && field.toLowerCase().includes(normalizedQuery),
    );
  });
}
