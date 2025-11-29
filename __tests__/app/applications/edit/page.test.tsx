import { generateMockApplication } from "@/__tests__/helpers/mocks";
import EditApplicationPage from "@/app/applications/edit/[id]/page";
import {
  ApplicationDatabaseError,
  ApplicationNotFoundError,
  ApplicationValidationError,
} from "@/shared/api";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
const mockBack = vi.fn();
const mockDelete = vi.fn();
const mockUpdate = vi.fn();
const mockApplication = generateMockApplication({
  id: "test-id",
  company: "Test Company",
  jobTitle: "Test Job",
});

let mockApplicationValue: typeof mockApplication | null | undefined =
  mockApplication;

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
  useParams: () => ({
    id: "test-id",
  }),
}));

vi.mock("@/app/providers/service-provider", () => ({
  useApplicationService: () => ({
    delete: mockDelete,
    update: mockUpdate,
  }),
}));

vi.mock("@/shared/hooks", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/shared/hooks")>();
  return {
    ...actual,
    useApplication: () => mockApplicationValue,
  };
});

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

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

describe("EditApplicationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockApplicationValue = mockApplication;
  });

  it("should render loading spinner when application is undefined", () => {
    mockApplicationValue = undefined;

    render(<EditApplicationPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render not found message when application is null", () => {
    mockApplicationValue = null;

    render(<EditApplicationPage />);

    expect(screen.getByText("Application not found")).toBeInTheDocument();
  });

  it("should render form with application data when application is loaded", () => {
    render(<EditApplicationPage />);

    expect(
      screen.getByText(/Edit Application - Test Job at Test Company/),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/)).toHaveValue("Test Company");
    expect(screen.getByLabelText(/Job Title/)).toHaveValue("Test Job");
  });

  it("should render delete button", () => {
    render(<EditApplicationPage />);

    expect(
      screen.getByRole("button", { name: "Delete Application" }),
    ).toBeInTheDocument();
  });

  it("should update application and go back on successful submit", async () => {
    const user = userEvent.setup();
    mockUpdate.mockResolvedValueOnce(undefined);

    render(<EditApplicationPage />);

    const companyInput = screen.getByLabelText(/Company/);
    await user.clear(companyInput);
    await user.type(companyInput, "Updated Company");

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        "test-id",
        expect.objectContaining({
          company: "Updated Company",
        }),
      );
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Application updated successfully",
    );
    expect(mockBack).toHaveBeenCalled();
  });

  it("should show validation error toast on ApplicationValidationError with field", async () => {
    const user = userEvent.setup();
    mockUpdate.mockRejectedValueOnce(
      new ApplicationValidationError("Invalid data", "company"),
    );

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Validation error in company: Invalid data",
      );
    });
  });

  it("should show validation error toast on ApplicationValidationError without field", async () => {
    const user = userEvent.setup();
    mockUpdate.mockRejectedValueOnce(
      new ApplicationValidationError("Invalid data"),
    );

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Validation error: Invalid data",
      );
    });
  });

  it("should show not found error toast on ApplicationNotFoundError", async () => {
    const user = userEvent.setup();
    mockUpdate.mockRejectedValueOnce(new ApplicationNotFoundError("test-id"));

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Application not found");
    });
  });

  it("should show database error toast on ApplicationDatabaseError", async () => {
    const user = userEvent.setup();
    mockUpdate.mockRejectedValueOnce(
      new ApplicationDatabaseError("Connection failed"),
    );

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Database error: Connection failed",
      );
    });
  });

  it("should show generic error toast on unknown error", async () => {
    const user = userEvent.setup();
    mockUpdate.mockRejectedValueOnce(new Error("Unknown error"));

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update application. Please try again.",
      );
    });
  });

  it("should log error to console on submission failure", async () => {
    const user = userEvent.setup();
    const error = new Error("Test error");
    mockUpdate.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Form submission error:", error);
    });
  });

  it("should open delete confirmation dialog when Delete button is clicked", async () => {
    const user = userEvent.setup();

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );

    expect(screen.getByText("Delete Application?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This will permanently delete this application. This action cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("should delete application and navigate home on confirm", async () => {
    const user = userEvent.setup();
    mockDelete.mockResolvedValueOnce(undefined);

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith("test-id");
    });

    expect(mockPush).toHaveBeenCalledWith("/");
    expect(toast.success).toHaveBeenCalledWith(
      "Application deleted successfully",
    );
  });

  it("should show validation error toast when delete fails with ApplicationValidationError", async () => {
    const user = userEvent.setup();
    mockDelete.mockRejectedValueOnce(
      new ApplicationValidationError("Cannot delete", "id"),
    );

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Validation error in id: Cannot delete",
      );
    });
  });

  it("should show not found error toast when delete fails with ApplicationNotFoundError", async () => {
    const user = userEvent.setup();
    mockDelete.mockRejectedValueOnce(new ApplicationNotFoundError("test-id"));

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Application not found");
    });
  });

  it("should show database error toast when delete fails with ApplicationDatabaseError", async () => {
    const user = userEvent.setup();
    mockDelete.mockRejectedValueOnce(
      new ApplicationDatabaseError("Database locked"),
    );

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Database error: Database locked",
      );
    });
  });

  it("should close dialog when Cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(<EditApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );

    expect(screen.getByText("Delete Application?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByText("Delete Application?")).not.toBeInTheDocument();
    });
  });
});
