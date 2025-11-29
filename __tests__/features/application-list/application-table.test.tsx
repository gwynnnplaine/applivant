import { generateMockApplication } from "@/__tests__/helpers/mocks";
import { JobApplication } from "@/entities/application";
import { ApplicationTable } from "@/features/application-list/ui/application-table";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("@/components/ui/application-status-badge", () => ({
  ApplicationStatusBadge: ({
    status,
    onStatusChange,
  }: {
    status: string;
    onStatusChange?: (s: string) => void;
  }) => (
    <button data-testid="status-badge" onClick={() => onStatusChange?.(status)}>
      {status}
    </button>
  ),
}));

const mockApplications: JobApplication[] = [
  generateMockApplication({
    id: "1",
    company: "Acme Corp",
    jobTitle: "Software Engineer",
    status: "Applied",
  }),
  generateMockApplication({
    id: "2",
    company: "Tech Inc",
    jobTitle: "Frontend Developer",
    status: "Interview",
    location: "New York",
  }),
  generateMockApplication({
    id: "3",
    company: "Startup LLC",
    jobTitle: "Full Stack Developer",
    status: "Offer",
    salary: "$120,000",
  }),
];

describe("ApplicationTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render table headers", () => {
    render(<ApplicationTable applications={mockApplications} />);

    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Job Title")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Job Type")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Location")).toBeInTheDocument();
    expect(screen.getByText("Date Added")).toBeInTheDocument();
  });

  it("should render all applications", () => {
    render(<ApplicationTable applications={mockApplications} />);

    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Tech Inc")).toBeInTheDocument();
    expect(screen.getByText("Startup LLC")).toBeInTheDocument();
  });

  it("should display empty state when no applications", () => {
    render(<ApplicationTable applications={[]} />);

    expect(
      screen.getByText("No applications found matching your search."),
    ).toBeInTheDocument();
  });

  it("should navigate to application details on row click", async () => {
    const user = userEvent.setup();

    render(<ApplicationTable applications={mockApplications} />);

    await user.click(screen.getByText("Acme Corp"));

    expect(mockPush).toHaveBeenCalledWith("/applications/view/1");
  });

  it("should call onStatusChange when status is changed", async () => {
    const user = userEvent.setup();
    const handleStatusChange = vi.fn();

    render(
      <ApplicationTable
        applications={mockApplications}
        onStatusChange={handleStatusChange}
      />,
    );

    const statusBadges = screen.getAllByTestId("status-badge");
    await user.click(statusBadges[0]!);

    expect(handleStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        company: "Acme Corp",
      }),
    );
  });

  it("should display application details correctly", () => {
    render(<ApplicationTable applications={mockApplications} />);

    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("$120,000")).toBeInTheDocument();
  });
});
