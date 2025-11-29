import { generateMockApplication } from "@/__tests__/helpers/mocks";
import { JobApplication } from "@/entities/application";
import { ApplicationList } from "@/features/application-list";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
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
  }),
];

let mockApplicationsState: JobApplication[] | undefined = mockApplications;
let mockIsMdOrLarger = true;
let mockViewMode: "table" | "grid" = "table";

vi.mock("@/shared/hooks", () => ({
  useApplications: () => mockApplicationsState,
  useIsMdOrLarger: () => mockIsMdOrLarger,
}));

vi.mock("@/features/application-list/model/use-view-mode", () => ({
  useViewMode: () => ({
    viewMode: mockViewMode,
    setViewMode: vi.fn((mode: "table" | "grid") => {
      mockViewMode = mode;
    }),
  }),
}));

const mockService = {
  update: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  getAll: vi.fn(),
  getById: vi.fn(),
};

const renderApplicationList = (searchParams?: Record<string, string>) =>
  render(
    <NuqsTestingAdapter searchParams={searchParams}>
      <ApplicationList service={mockService as never} />
    </NuqsTestingAdapter>,
  );

describe("ApplicationList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApplicationsState = mockApplications;
    mockIsMdOrLarger = true;
    mockViewMode = "table";
  });

  it("should render loading state when applications are undefined", () => {
    mockApplicationsState = undefined;

    renderApplicationList();

    expect(screen.getByText("Loading applications...")).toBeInTheDocument();
  });

  it("should render empty state when no applications exist", () => {
    mockApplicationsState = [];

    renderApplicationList();

    expect(screen.getByText("Your data stays local")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add Your First Application" }),
    ).toBeInTheDocument();
  });

  it("should render applications in table view on desktop", () => {
    mockIsMdOrLarger = true;
    mockViewMode = "table";

    renderApplicationList();

    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Tech Inc")).toBeInTheDocument();
  });

  it("should render applications in grid view on mobile", () => {
    mockIsMdOrLarger = false;

    renderApplicationList();

    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Tech Inc")).toBeInTheDocument();
  });

  it("should show view toggle only on desktop", () => {
    mockIsMdOrLarger = true;

    renderApplicationList();

    expect(
      screen.getByRole("button", { name: "Table view" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Grid view" }),
    ).toBeInTheDocument();
  });

  it("should call service.update when status changes", async () => {
    const user = userEvent.setup();

    renderApplicationList();

    const statusBadges = screen.getAllByTestId("status-badge");
    await user.click(statusBadges[0]!);

    expect(mockService.update).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ id: "1", company: "Acme Corp" }),
    );
  });
});
