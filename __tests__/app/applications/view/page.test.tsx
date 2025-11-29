import { generateMockApplication } from "@/__tests__/helpers/mocks";
import ViewApplicationPage from "@/app/applications/view/[id]/page";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();
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

describe("ViewApplicationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApplicationValue = mockApplication;
  });

  it("should render loading spinner when application is undefined", () => {
    mockApplicationValue = undefined;

    render(<ViewApplicationPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render not found message when application is null", () => {
    mockApplicationValue = null;

    render(<ViewApplicationPage />);

    expect(screen.getByText("Application not found")).toBeInTheDocument();
  });

  it("should render application details when application is loaded", () => {
    render(<ViewApplicationPage />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Test Job")).toBeInTheDocument();
  });

  it("should render edit and delete buttons", () => {
    render(<ViewApplicationPage />);

    expect(
      screen.getByRole("button", { name: "Edit Application" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Application" }),
    ).toBeInTheDocument();
  });

  it("should navigate to edit page when Edit button is clicked", async () => {
    const user = userEvent.setup();

    render(<ViewApplicationPage />);

    await user.click(screen.getByRole("button", { name: "Edit Application" }));

    expect(mockPush).toHaveBeenCalledWith("/applications/edit/test-id/");
  });

  it("should open delete confirmation dialog when Delete button is clicked", async () => {
    const user = userEvent.setup();

    render(<ViewApplicationPage />);

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

    render(<ViewApplicationPage />);

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

  it("should show error toast when delete fails", async () => {
    const user = userEvent.setup();
    mockDelete.mockRejectedValueOnce(new Error("Delete failed"));

    render(<ViewApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to delete application. Please try again.",
      );
    });
  });

  it("should close dialog when Cancel button is clicked", async () => {
    const user = userEvent.setup();

    render(<ViewApplicationPage />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );

    expect(screen.getByText("Delete Application?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByText("Delete Application?")).not.toBeInTheDocument();
    });
  });

  it("should update status and show success toast", async () => {
    mockUpdate.mockResolvedValueOnce(undefined);

    render(<ViewApplicationPage />);

    const statusBadge = screen.getByRole("status", {
      name: /Application status:/,
    });
    const user = userEvent.setup();
    await user.click(statusBadge);

    const interviewOption = await screen.findByRole("menuitem", {
      name: "Interview",
    });
    await user.click(interviewOption);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        "test-id",
        expect.objectContaining({
          status: "Interview",
        }),
      );
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Application status updated successfully",
    );
  });

  it("should show error toast when status update fails", async () => {
    mockUpdate.mockRejectedValueOnce(new Error("Update failed"));

    render(<ViewApplicationPage />);

    const statusBadge = screen.getByRole("status", {
      name: /Application status:/,
    });
    const user = userEvent.setup();
    await user.click(statusBadge);

    const interviewOption = await screen.findByRole("menuitem", {
      name: "Interview",
    });
    await user.click(interviewOption);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to update application status. Please try again.",
      );
    });
  });
});
