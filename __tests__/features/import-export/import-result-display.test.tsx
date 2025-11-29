import { ImportResultDisplay } from "@/features/import-export/ui/import-result-display/import-result-display";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("ImportResultDisplay", () => {
  const onDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when result is null", () => {
    const { container } = render(
      <ImportResultDisplay result={null} onDismiss={onDismiss} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should render success variant when there are no issues", () => {
    const result = {
      success: 5,
      duplicates: 0,
      errors: [] as string[],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("border-green-200", "bg-green-50");
  });

  it("should render warning variant when there are duplicates", () => {
    const result = {
      success: 3,
      duplicates: 2,
      errors: [] as string[],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("border-yellow-200", "bg-yellow-50");
  });

  it("should render warning variant when there are errors", () => {
    const result = {
      success: 3,
      duplicates: 0,
      errors: ["Row 1: Invalid data"],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("border-yellow-200", "bg-yellow-50");
  });

  it("should render warning variant when there are both duplicates and errors", () => {
    const result = {
      success: 1,
      duplicates: 2,
      errors: ["Row 1: Invalid data"],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-yellow-200", "bg-yellow-50");
  });

  it("should call onDismiss when dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const result = {
      success: 5,
      duplicates: 0,
      errors: [] as string[],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    const dismissButton = screen.getByRole("button");
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("should have correct aria-label", () => {
    const result = {
      success: 5,
      duplicates: 0,
      errors: [] as string[],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    expect(screen.getByLabelText("Import result")).toBeInTheDocument();
  });

  it("should display success count", () => {
    const result = {
      success: 10,
      duplicates: 0,
      errors: [] as string[],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it("should display error list when errors exist", () => {
    const result = {
      success: 3,
      duplicates: 0,
      errors: ["Row 1: Missing company", "Row 2: Invalid status"],
    };

    render(<ImportResultDisplay result={result} onDismiss={onDismiss} />);

    expect(screen.getByText(/Missing company/)).toBeInTheDocument();
    expect(screen.getByText(/Invalid status/)).toBeInTheDocument();
  });
});
