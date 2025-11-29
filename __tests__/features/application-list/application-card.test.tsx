import { generateMockApplication } from "@/__tests__/helpers/mocks";
import { ApplicationCard } from "@/features/application-list/ui/application-card";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
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

describe("ApplicationCard", () => {
  const mockApplication = generateMockApplication({
    id: "test-id",
    company: "Test Company",
    jobTitle: "Software Engineer",
    status: "Applied",
    dateAdded: new Date("2024-01-15"),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render application details", () => {
    render(<ApplicationCard application={mockApplication} />);

    expect(screen.getByText("Test Company")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Added:/)).toBeInTheDocument();
  });

  it("should navigate to view page when card is clicked", async () => {
    const user = userEvent.setup();

    render(<ApplicationCard application={mockApplication} />);

    const card = screen.getByText("Test Company").closest("div[class*='card']");
    if (card) {
      await user.click(card);
    }

    expect(mockPush).toHaveBeenCalledWith("/applications/view/test-id");
  });

  it("should call onClick with updated status when status is changed", async () => {
    const user = userEvent.setup();
    const onClickMock = vi.fn();

    render(
      <ApplicationCard application={mockApplication} onClick={onClickMock} />,
    );

    const statusBadge = screen.getByRole("status", {
      name: /Application status:/,
    });
    await user.click(statusBadge);

    const interviewOption = await screen.findByRole("menuitem", {
      name: "Interview",
    });
    await user.click(interviewOption);

    expect(onClickMock).toHaveBeenCalledWith({
      ...mockApplication,
      status: "Interview",
    });
  });

  it("should not throw when onClick is not provided and status is changed", async () => {
    const user = userEvent.setup();

    render(<ApplicationCard application={mockApplication} />);

    const statusBadge = screen.getByRole("status", {
      name: /Application status:/,
    });
    await user.click(statusBadge);

    const interviewOption = await screen.findByRole("menuitem", {
      name: "Interview",
    });

    await expect(user.click(interviewOption)).resolves.not.toThrow();
  });

  it("should apply cursor-pointer class when onClick is provided", () => {
    const { container } = render(
      <ApplicationCard application={mockApplication} onClick={vi.fn()} />,
    );

    const card = container.querySelector("[class*='cursor-pointer']");
    expect(card).toBeInTheDocument();
  });

  it("should format date correctly", () => {
    render(<ApplicationCard application={mockApplication} />);

    expect(
      screen.getByText(
        `Added: ${mockApplication.dateAdded.toLocaleDateString()}`,
      ),
    ).toBeInTheDocument();
  });
});
