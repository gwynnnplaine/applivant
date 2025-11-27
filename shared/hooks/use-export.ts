import { JobApplication } from "@/entities/application";

const CSV_HEADERS = ["Company", "Job Title", "Status", "Date Added", "Job URL"];

type ExportFormat = "csv" | "json";

export function useExport(
  applications: JobApplication[],
  format: ExportFormat = "csv",
) {
  const handleExport = () => {
    const { blob, extension } = getBlobWithExtension(applications, format);
    const url = URL.createObjectURL(blob);
    const linkTag = document.createElement("a");
    linkTag.href = url;
    linkTag.download = `applivant-applications-${new Date().toISOString().slice(0, 10)}.${extension}`;
    linkTag.click();
    URL.revokeObjectURL(url);
  };

  return { handleExport };
}

function getBlobWithExtension(
  applications: JobApplication[],
  format: ExportFormat,
) {
  if (format === "json") {
    return createJSONBlob(applications);
  }
  return createCSVBlob(applications);
}

function createJSONBlob(applications: JobApplication[]) {
  const json = JSON.stringify(applications, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  return {
    blob,
    extension: "json",
  };
}

function createCSVBlob(applications: JobApplication[]) {
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
  return {
    blob,
    extension: "csv",
  };
}
