import { ErrorList } from "@/features/import-export/ui/import-result-display/errors-list";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ErrorList", () => {
  it("should display all errors when 3 or fewer", () => {
    const errors = ["Error 1", "Error 2", "Error 3"];

    render(<ErrorList errors={errors} />);

    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Error 2")).toBeInTheDocument();
    expect(screen.getByText("Error 3")).toBeInTheDocument();
  });

  it("should truncate errors and show remaining count when more than 3", () => {
    const errors = ["Error 1", "Error 2", "Error 3", "Error 4", "Error 5"];

    render(<ErrorList errors={errors} />);

    expect(screen.getByText("Error 1")).toBeInTheDocument();
    expect(screen.getByText("Error 2")).toBeInTheDocument();
    expect(screen.getByText("Error 3")).toBeInTheDocument();
    expect(screen.queryByText("Error 4")).not.toBeInTheDocument();
    expect(screen.queryByText("Error 5")).not.toBeInTheDocument();
    expect(screen.getByText("...and 2 more errors")).toBeInTheDocument();
  });

  it("should display single error", () => {
    render(<ErrorList errors={["Something went wrong"]} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should render empty list when no errors", () => {
    const { container } = render(<ErrorList errors={[]} />);

    expect(container.querySelector("ul")).toBeInTheDocument();
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});
