import { JobApplication, JobApplicationSchema } from "@/entities/application";
import { ImportExportModal } from "@/features";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import { zocker } from "zocker";

beforeAll(() => {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();

  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
});

const mockedApplications: JobApplication[] =
  zocker(JobApplicationSchema).generateMany(5);

const handleExportMock = vi.fn();
const importFileMock = vi.fn();
const clearResultMock = vi.fn();

let mockFormat = "csv";
const setFormatMock = vi.fn((newFormat: string) => {
  mockFormat = newFormat;
});

vi.mock("@/shared/hooks", () => ({
  useLocalStorage: vi.fn(() => [mockFormat, setFormatMock]),
  useApplications: () => mockedApplications,
}));

vi.mock("@/features/import-export/hooks/use-export", () => ({
  useExport: () => ({ handleExport: handleExportMock }),
}));

vi.mock("@/features/import-export/hooks/use-file-import", () => ({
  useFileImport: () => ({
    isImporting: false,
    result: null,
    importFile: importFileMock,
    clearResult: clearResultMock,
  }),
}));

vi.mock("@/features/import-export/file-parser/file-parser", () => ({
  FileParser: vi.fn().mockImplementation(() => ({
    parse: vi.fn().mockResolvedValue([]),
  })),
}));

vi.mock("@/app/providers/service-provider", () => ({
  useApplicationService: () => ({
    createMany: vi.fn().mockResolvedValue({
      inserted: [],
      duplicates: 0,
      errors: [],
    }),
  }),
}));

afterEach(() => {
  cleanup();
  handleExportMock.mockClear();
  importFileMock.mockClear();
  clearResultMock.mockClear();
  setFormatMock.mockClear();
  mockFormat = "csv";
});

describe("Import & Export Modal", () => {
  test("renders modal when open", () => {
    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("Import / Export Data")).toBeDefined();
  });

  test("does not render modal when closed", () => {
    render(<ImportExportModal isOpen={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Import / Export Data")).toBeNull();
  });

  test("calls onClose when Close button is clicked", async () => {
    const user = userEvent.setup();
    const onCloseMock = vi.fn();

    render(<ImportExportModal isOpen={true} onClose={onCloseMock} />);

    const closeButton = screen.getByLabelText("Close import-export dialog");
    await user.click(closeButton);

    expect(clearResultMock).toHaveBeenCalled();
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("should handle export action", async () => {
    const user = userEvent.setup();

    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    const exportButton = screen.getByLabelText("Export your application data");
    await user.click(exportButton);

    expect(handleExportMock).toHaveBeenCalled();
  });

  test("should handle export as CSV", async () => {
    const user = userEvent.setup();

    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    const exportButton = screen.getByLabelText("Export your application data");
    await user.click(exportButton);

    expect(handleExportMock).toHaveBeenCalledWith("csv");
  });

  test("should handle export as JSON", async () => {
    const user = userEvent.setup();
    mockFormat = "json";

    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    const exportButton = screen.getByLabelText("Export your application data");
    await user.click(exportButton);

    expect(handleExportMock).toHaveBeenCalledWith("json");
  });

  test("should handle file selection for import", async () => {
    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    const mockFile = new File(["dummy content"], "test-import.csv", {
      type: "text/csv",
    });

    const importInput = screen.getByLabelText("Import your application data");
    fireEvent.change(importInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(importFileMock).toHaveBeenCalledWith(mockFile);
    });
  });

  test("should handle JSON file selection for import", async () => {
    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    const mockFile = new File(['[{"company":"Test"}]'], "test-import.json", {
      type: "application/json",
    });

    const importInput = screen.getByLabelText("Import your application data");
    fireEvent.change(importInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(importFileMock).toHaveBeenCalledWith(mockFile);
    });
  });

  test("should call setFormat when changing format", async () => {
    const user = userEvent.setup();

    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    const formatTrigger = screen.getByLabelText("Select export format");
    await user.click(formatTrigger);

    const jsonOption = await screen.findByRole("option", { name: "JSON" });
    await user.click(jsonOption);

    expect(setFormatMock).toHaveBeenCalledWith("json");
  });

  test("displays total applications count", () => {
    render(<ImportExportModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText("Total Applications: 5")).toBeDefined();
  });
});
