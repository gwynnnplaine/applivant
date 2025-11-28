import { JobApplication } from "@/entities/application";
import { filterApplications } from "@/features/application-list/lib/filter-applications";
import { ApplicationCard } from "@/features/application-list/ui/application-card";
import { ApplicationGrid } from "@/features/application-list/ui/application-grid";
import { EmptyState } from "@/features/application-list/ui/empty-state";
import { LoadingState } from "@/features/application-list/ui/loading-state";
import { ViewToggle } from "@/features/application-list/ui/view-toggle";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";

afterEach(() => {
  cleanup();
});

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

const baseDate = new Date("2024-01-15T10:00:00Z");

const createApplication = (
  overrides?: Partial<JobApplication>,
): JobApplication => ({
  id: "test-id",
  company: "Test Company",
  jobTitle: "Test Job Title",
  status: "Applied",
  jobType: "Full-time",
  dateAdded: baseDate,
  dateModified: baseDate,
  ...overrides,
});

const mockApplications: JobApplication[] = [
  createApplication({
    id: "1",
    company: "Acme Corp",
    jobTitle: "Software Engineer",
    status: "Applied",
  }),
  createApplication({
    id: "2",
    company: "Tech Inc",
    jobTitle: "Frontend Developer",
    status: "Interview",
    location: "New York",
  }),
  createApplication({
    id: "3",
    company: "Startup LLC",
    jobTitle: "Full Stack Developer",
    status: "Offer",
    salary: "$120,000",
  }),
];

describe("filterApplications", () => {
  test("returns all applications when query is empty", () => {
    const result = filterApplications(mockApplications, "");

    expect(result).toHaveLength(3);
  });

  test("returns all applications when query is whitespace only", () => {
    const result = filterApplications(mockApplications, "   ");

    expect(result).toHaveLength(3);
  });

  test("filters by company name", () => {
    const result = filterApplications(mockApplications, "Acme");

    expect(result).toHaveLength(1);
    expect(result[0]!.company).toBe("Acme Corp");
  });

  test("filters by job title", () => {
    const result = filterApplications(mockApplications, "Frontend");

    expect(result).toHaveLength(1);
    expect(result[0]!.jobTitle).toBe("Frontend Developer");
  });

  test("filters by status", () => {
    const result = filterApplications(mockApplications, "Interview");

    expect(result).toHaveLength(1);
    expect(result[0]!.status).toBe("Interview");
  });

  test("filters by location", () => {
    const result = filterApplications(mockApplications, "New York");

    expect(result).toHaveLength(1);
    expect(result[0]!.location).toBe("New York");
  });

  test("filters by salary", () => {
    const result = filterApplications(mockApplications, "$120,000");

    expect(result).toHaveLength(1);
    expect(result[0]!.salary).toBe("$120,000");
  });

  test("is case insensitive", () => {
    const result = filterApplications(mockApplications, "acme");

    expect(result).toHaveLength(1);
    expect(result[0]!.company).toBe("Acme Corp");
  });

  test("returns empty array when no matches found", () => {
    const result = filterApplications(mockApplications, "nonexistent");

    expect(result).toHaveLength(0);
  });

  test("matches partial strings", () => {
    const result = filterApplications(mockApplications, "Engineer");

    expect(result).toHaveLength(1);
    expect(result[0]!.jobTitle).toBe("Software Engineer");
  });

  test("filters by job type", () => {
    const result = filterApplications(mockApplications, "Full-time");

    expect(result).toHaveLength(3);
  });
});

describe("ApplicationCard", () => {
  test("renders company name", () => {
    const application = createApplication({ company: "Acme Corp" });

    render(<ApplicationCard application={application} />);

    expect(screen.getByText("Acme Corp")).toBeDefined();
  });

  test("renders job title", () => {
    const application = createApplication({ jobTitle: "Software Engineer" });

    render(<ApplicationCard application={application} />);

    expect(screen.getByText("Software Engineer")).toBeDefined();
  });

  test("renders status badge", () => {
    const application = createApplication({ status: "Applied" });

    render(<ApplicationCard application={application} />);

    expect(screen.getByTestId("status-badge")).toBeDefined();
    expect(screen.getByText("Applied")).toBeDefined();
  });

  test("renders date added", () => {
    const application = createApplication();

    render(<ApplicationCard application={application} />);

    expect(screen.getByText(/Added:/)).toBeDefined();
  });

  test("calls onClick when status is changed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const application = createApplication({ status: "Applied" });

    render(<ApplicationCard application={application} onClick={onClick} />);

    await user.click(screen.getByTestId("status-badge"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ status: "Applied" }),
    );
  });
});

describe("ApplicationGrid", () => {
  test("renders applications in a grid", () => {
    render(<ApplicationGrid applications={mockApplications} />);

    expect(screen.getByText("Acme Corp")).toBeDefined();
    expect(screen.getByText("Tech Inc")).toBeDefined();
    expect(screen.getByText("Startup LLC")).toBeDefined();
  });

  test("renders empty message when no applications", () => {
    render(<ApplicationGrid applications={[]} />);

    expect(
      screen.getByText("No applications found matching your search."),
    ).toBeDefined();
  });

  test("calls onApplicationClick when card is clicked", async () => {
    const user = userEvent.setup();
    const onApplicationClick = vi.fn();

    render(
      <ApplicationGrid
        applications={mockApplications}
        onStatusClick={onApplicationClick}
      />,
    );

    const statusBadges = screen.getAllByTestId("status-badge");
    await user.click(statusBadges[0]!);

    expect(onApplicationClick).toHaveBeenCalledTimes(1);
  });
});

describe("EmptyState", () => {
  test("renders heading", () => {
    render(<EmptyState />);

    expect(screen.getByText("Your data stays local")).toBeDefined();
  });

  test("renders description", () => {
    render(<EmptyState />);

    expect(
      screen.getByText(
        "Everything you add is stored in your browser. No servers, no tracking.",
      ),
    ).toBeDefined();
  });

  test("renders add application link", () => {
    render(<EmptyState />);

    const link = screen.getByRole("link", {
      name: "Add Your First Application",
    });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/applications/new");
  });
});

describe("LoadingState", () => {
  test("renders loading text", () => {
    render(<LoadingState />);

    expect(screen.getByText("Loading applications...")).toBeDefined();
  });

  test("renders spinner", () => {
    const { container } = render(<LoadingState />);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeDefined();
  });
});

describe("ViewToggle", () => {
  test("renders table view button", () => {
    render(<ViewToggle viewMode="table" onViewModeChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Table view" })).toBeDefined();
  });

  test("renders grid view button", () => {
    render(<ViewToggle viewMode="table" onViewModeChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Grid view" })).toBeDefined();
  });

  test("calls onViewModeChange with table when table button clicked", async () => {
    const user = userEvent.setup();
    const onViewModeChange = vi.fn();

    render(<ViewToggle viewMode="grid" onViewModeChange={onViewModeChange} />);

    await user.click(screen.getByRole("button", { name: "Table view" }));

    expect(onViewModeChange).toHaveBeenCalledWith("table");
  });

  test("calls onViewModeChange with grid when grid button clicked", async () => {
    const user = userEvent.setup();
    const onViewModeChange = vi.fn();

    render(<ViewToggle viewMode="table" onViewModeChange={onViewModeChange} />);

    await user.click(screen.getByRole("button", { name: "Grid view" }));

    expect(onViewModeChange).toHaveBeenCalledWith("grid");
  });

  test("highlights table button when in table mode", () => {
    render(<ViewToggle viewMode="table" onViewModeChange={vi.fn()} />);

    const tableButton = screen.getByRole("button", { name: "Table view" });
    expect(tableButton.className).toContain("secondary");
  });

  test("highlights grid button when in grid mode", () => {
    render(<ViewToggle viewMode="grid" onViewModeChange={vi.fn()} />);

    const gridButton = screen.getByRole("button", { name: "Grid view" });
    expect(gridButton.className).toContain("secondary");
  });
});
