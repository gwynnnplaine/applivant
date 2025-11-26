import { JobApplication } from "@/entities/application";

const CSV_HEADERS = ["Company", "Job Title", "Status", "Date Added", "Job URL"];

export function useCsvExport(applications: JobApplication[]) {
  const handleExport = () => {
    const csv = [
      CSV_HEADERS,
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
