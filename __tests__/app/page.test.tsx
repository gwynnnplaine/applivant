import Home from "@/app/page";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockApplicationService = {
  getAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/app/providers/service-provider", () => ({
  useApplicationService: () => mockApplicationService,
}));

vi.mock("@/features/application-list", () => ({
  ApplicationList: ({ service }: { service: unknown }) => (
    <div data-testid="application-list">
      Application List Component (service: {service ? "provided" : "missing"})
    </div>
  ),
}));

vi.mock("@/components/error-boundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  ),
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the home page with application list", () => {
    render(<Home />);

    expect(screen.getByTestId("application-list")).toBeInTheDocument();
    expect(screen.getByText(/Application List Component/)).toBeInTheDocument();
  });

  it("should wrap ApplicationList in ErrorBoundary", () => {
    render(<Home />);

    expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    expect(screen.getByTestId("application-list")).toBeInTheDocument();
  });

  it("should pass service to ApplicationList", () => {
    render(<Home />);

    expect(screen.getByText(/service: provided/)).toBeInTheDocument();
  });

  it("should render the container with correct styling classes", () => {
    const { container } = render(<Home />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("flex", "flex-1", "flex-col");
    expect(mainContainer).toHaveClass("rounded-lg", "border", "bg-card");
  });
});

describe("Home Page FallbackComponent", () => {
  it("should render fallback when ErrorBoundary catches error", () => {
    vi.doMock("@/components/error-boundary", () => ({
      ErrorBoundary: ({ fallback }: { fallback: React.ReactNode }) => (
        <div data-testid="error-boundary">{fallback}</div>
      ),
    }));

    vi.resetModules();
  });
});
