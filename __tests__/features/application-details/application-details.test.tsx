import { ApplicationDetails } from "@/features/application-details/ui/application-details";
import { DateDisplay } from "@/features/application-details/ui/date-display";
import {
  InfoItem,
  LocationInfo,
  SalaryInfo,
} from "@/features/application-details/ui/info-item";
import { JobLink } from "@/features/application-details/ui/job-link";
import { NotesDisplay } from "@/features/application-details/ui/notes-display";
import { JobApplication } from "@/entities/application";
import { cleanup, render, screen } from "@testing-library/react";
import { Calendar } from "lucide-react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

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

describe("ApplicationDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders company name and job title", () => {
    const application = createApplication({
      company: "Acme Corp",
      jobTitle: "Software Engineer",
    });

    render(<ApplicationDetails application={application} />);

    expect(screen.getByText("Acme Corp")).toBeDefined();
    expect(screen.getByText("Software Engineer")).toBeDefined();
  });

  test("renders status badge", () => {
    const application = createApplication({ status: "Applied" });

    render(<ApplicationDetails application={application} />);

    expect(screen.getByTestId("status-badge")).toBeDefined();
    expect(screen.getByText("Applied")).toBeDefined();
  });

  test("calls onStatusChange when status badge is clicked", () => {
    const onStatusChange = vi.fn();
    const application = createApplication({ status: "Applied" });

    render(
      <ApplicationDetails
        application={application}
        onStatusChange={onStatusChange}
      />,
    );

    screen.getByTestId("status-badge").click();

    expect(onStatusChange).toHaveBeenCalledWith("Applied");
  });

  test("renders salary when provided", () => {
    const application = createApplication({ salary: "$100,000" });

    render(<ApplicationDetails application={application} />);

    expect(screen.getByText("$100,000")).toBeDefined();
  });

  test("renders location when provided", () => {
    const application = createApplication({ location: "New York, NY" });

    render(<ApplicationDetails application={application} />);

    expect(screen.getByText("New York, NY")).toBeDefined();
  });

  test("renders job link when url is provided", () => {
    const application = createApplication({
      jobUrl: "https://example.com/job",
    });

    render(<ApplicationDetails application={application} />);

    const link = screen.getByRole("link", { name: "View Job Posting" });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("https://example.com/job");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("renders notes when provided", () => {
    const application = createApplication({ notes: "Great opportunity!" });

    render(<ApplicationDetails application={application} />);

    expect(screen.getByText("Notes")).toBeDefined();
    expect(screen.getByText("Great opportunity!")).toBeDefined();
  });

  test("does not render optional fields when not provided", () => {
    const application = createApplication({
      salary: undefined,
      location: undefined,
      jobUrl: undefined,
      notes: undefined,
    });

    render(<ApplicationDetails application={application} />);

    expect(screen.queryByText("Notes")).toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("DateDisplay", () => {
  test("renders only added date when dates are the same", () => {
    const date = new Date("2024-01-15T10:00:00Z");

    render(<DateDisplay dateAdded={date} dateModified={date} />);

    expect(screen.getByText(/Added/)).toBeDefined();
    expect(screen.queryByText(/modified/)).toBeNull();
  });

  test("renders modified date when dates differ", () => {
    const dateAdded = new Date("2024-01-15T10:00:00Z");
    const dateModified = new Date("2024-01-20T10:00:00Z");

    render(<DateDisplay dateAdded={dateAdded} dateModified={dateModified} />);

    expect(screen.getByText(/Added/)).toBeDefined();
    expect(screen.getByText(/modified/)).toBeDefined();
  });
});

describe("InfoItem", () => {
  test("renders icon and text", () => {
    render(<InfoItem icon={Calendar} text="Test text" />);

    expect(screen.getByText("Test text")).toBeDefined();
  });

  test("renders with aria-label when provided", () => {
    render(<InfoItem icon={Calendar} text="Test text" label="Test Label" />);

    const element = screen.getByLabelText("Test Label");
    expect(element).toBeDefined();
    expect(element.textContent).toBe("Test text");
  });
});

describe("SalaryInfo", () => {
  test("renders salary when provided", () => {
    render(<SalaryInfo salary="$80,000" />);

    expect(screen.getByText("$80,000")).toBeDefined();
    expect(screen.getByLabelText("Salary")).toBeDefined();
  });

  test("returns null when salary is not provided", () => {
    const { container } = render(<SalaryInfo salary={undefined} />);

    expect(container.firstChild).toBeNull();
  });
});

describe("LocationInfo", () => {
  test("renders location when provided", () => {
    render(<LocationInfo location="San Francisco, CA" />);

    expect(screen.getByText("San Francisco, CA")).toBeDefined();
    expect(screen.getByLabelText("Location")).toBeDefined();
  });

  test("returns null when location is not provided", () => {
    const { container } = render(<LocationInfo location={undefined} />);

    expect(container.firstChild).toBeNull();
  });
});

describe("JobLink", () => {
  test("renders link with default label", () => {
    render(<JobLink url="https://example.com" />);

    const link = screen.getByRole("link");
    expect(link.textContent).toBe("View Job Posting");
    expect(link.getAttribute("href")).toBe("https://example.com");
  });

  test("renders link with custom label", () => {
    render(<JobLink url="https://example.com" label="Apply Now" />);

    const link = screen.getByRole("link");
    expect(link.textContent).toBe("Apply Now");
  });

  test("opens in new tab with security attributes", () => {
    render(<JobLink url="https://example.com" />);

    const link = screen.getByRole("link");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("returns null when url is not provided", () => {
    const { container } = render(<JobLink url={undefined} />);

    expect(container.firstChild).toBeNull();
  });
});

describe("NotesDisplay", () => {
  test("renders notes section with title and content", () => {
    render(<NotesDisplay notes="Interview went well" />);

    expect(screen.getByText("Notes")).toBeDefined();
    expect(screen.getByText("Interview went well")).toBeDefined();
  });

  test("preserves whitespace in notes", () => {
    const notes = "Line 1\nLine 2\nLine 3";
    render(<NotesDisplay notes={notes} />);

    const notesContainer = screen.getByText(/Line 1/);
    expect(notesContainer.textContent).toBe(notes);
  });

  test("returns null when notes is not provided", () => {
    const { container } = render(<NotesDisplay notes={undefined} />);

    expect(container.firstChild).toBeNull();
  });
});
