import { StatusIcon } from "@/features/import-export/ui/import-result-display/status-icon";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("StatusIcon", () => {
  it("should render success icon with green color", () => {
    const { container } = render(<StatusIcon variant="success" />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("text-green-600");
  });

  it("should render warning icon with yellow color", () => {
    const { container } = render(<StatusIcon variant="warning" />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("text-yellow-600");
  });
});
