import { DismissButton } from "@/features/import-export/ui/import-result-display/dismiss-button";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("DismissButton", () => {
  it("should render with accessible label", () => {
    render(<DismissButton onClick={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /dismiss import result/i }),
    ).toBeInTheDocument();
  });

  it("should call onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<DismissButton onClick={handleClick} />);

    await user.click(
      screen.getByRole("button", { name: /dismiss import result/i }),
    );

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
