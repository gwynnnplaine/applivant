import { NavigationBar } from "@/features/navigation";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

vi.mock("@/app/providers/service-provider", () => ({
  useApplicationService: () => ({
    create: vi.fn(),
    getAll: vi.fn().mockResolvedValue([]),
    bulkCreate: vi.fn(),
  }),
}));

const renderNavigationBar = () =>
  render(
    <NuqsTestingAdapter>
      <NavigationBar />
    </NuqsTestingAdapter>,
  );

describe("NavigationBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all navigation elements", () => {
    renderNavigationBar();

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new application/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /import or export data/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /toggle theme/i }),
    ).toBeInTheDocument();
  });

  it("should navigate to add application page when clicking add button", async () => {
    const user = userEvent.setup();

    renderNavigationBar();

    await user.click(
      screen.getByRole("button", { name: /add new application/i }),
    );

    expect(mockPush).toHaveBeenCalledWith("/applications/new");
  });

  it("should open import/export modal when clicking import/export button", async () => {
    const user = userEvent.setup();

    renderNavigationBar();

    await user.click(
      screen.getByRole("button", { name: /import or export data/i }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should close import/export modal when closing", async () => {
    const user = userEvent.setup();

    renderNavigationBar();

    await user.click(
      screen.getByRole("button", { name: /import or export data/i }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /close import-export dialog/i }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
