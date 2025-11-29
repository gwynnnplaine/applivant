import NewApplicationPage from "@/app/applications/new/page";
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
const mockCreate = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/app/providers/service-provider", () => ({
  useApplicationService: () => ({
    create: mockCreate,
  }),
}));

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

describe("NewApplicationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should render the page with title and form", () => {
    render(<NewApplicationPage />);

    expect(screen.getByText("Add New Application")).toBeInTheDocument();
    expect(screen.getByLabelText(/Company/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Title/)).toBeInTheDocument();
  });

  it("should create application and navigate home on successful submit", async () => {
    const user = userEvent.setup();
    mockCreate.mockResolvedValueOnce({ id: "new-id" });

    render(<NewApplicationPage />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");
    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          company: "Acme Corp",
          jobTitle: "Software Engineer",
        }),
      );
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Application added successfully",
    );
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should show validation error toast on ApplicationValidationError", async () => {
    const user = userEvent.setup();
    mockCreate.mockRejectedValueOnce(
      new ApplicationValidationError("Invalid data", "company"),
    );

    render(<NewApplicationPage />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");
    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Validation error in company: Invalid data",
      );
    });
  });

  it("should show validation error toast without field when field is not provided", async () => {
    const user = userEvent.setup();
    mockCreate.mockRejectedValueOnce(
      new ApplicationValidationError("Invalid data"),
    );

    render(<NewApplicationPage />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");
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
    mockCreate.mockRejectedValueOnce(new ApplicationNotFoundError("test-id"));

    render(<NewApplicationPage />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");
    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Application not found");
    });
  });

  it("should show database error toast on ApplicationDatabaseError", async () => {
    const user = userEvent.setup();
    mockCreate.mockRejectedValueOnce(
      new ApplicationDatabaseError("Connection failed"),
    );

    render(<NewApplicationPage />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");
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
    mockCreate.mockRejectedValueOnce(new Error("Unknown error"));

    render(<NewApplicationPage />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");
    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to add application. Please try again.",
      );
    });
  });

  it("should log error to console on submission failure", async () => {
    const user = userEvent.setup();
    const error = new Error("Test error");
    mockCreate.mockRejectedValueOnce(error);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<NewApplicationPage />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");
    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Form submission error:", error);
    });
  });
});
