import { ViewToggle } from "@/features/application-list/ui/view-toggle";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("ViewToggle", () => {
  it("should render table and grid view buttons", () => {
    render(<ViewToggle viewMode="table" onViewModeChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Table view" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Grid view" }),
    ).toBeInTheDocument();
  });

  it("should call onViewModeChange with table when table button clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ViewToggle viewMode="grid" onViewModeChange={handleChange} />);

    await user.click(screen.getByRole("button", { name: "Table view" }));

    expect(handleChange).toHaveBeenCalledWith("table");
  });

  it("should call onViewModeChange with grid when grid button clicked", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ViewToggle viewMode="table" onViewModeChange={handleChange} />);

    await user.click(screen.getByRole("button", { name: "Grid view" }));

    expect(handleChange).toHaveBeenCalledWith("grid");
  });

  it("should highlight table button when in table mode", () => {
    render(<ViewToggle viewMode="table" onViewModeChange={vi.fn()} />);

    const tableButton = screen.getByRole("button", { name: "Table view" });
    expect(tableButton.className).toContain("secondary");
  });

  it("should highlight grid button when in grid mode", () => {
    render(<ViewToggle viewMode="grid" onViewModeChange={vi.fn()} />);

    const gridButton = screen.getByRole("button", { name: "Grid view" });
    expect(gridButton.className).toContain("secondary");
  });
});
