import { JobApplication } from "@/entities/job-application";

export function useCsvExport(applications: JobApplication[]) {
  const handleExport = () => {
    const csv = [
      ["Company", "Job Title", "Status", "Date Added", "Job URL"],
      ...applications.map((app) => [
        app.company,
        app.jobTitle,
        app.status,
        app.dateAdded,
        app.jobUrl,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `applivant-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { handleExport };
}
