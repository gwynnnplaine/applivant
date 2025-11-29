import { ResultContent } from "@/features/import-export/ui/import-result-display/result-summary";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("ResultContent", () => {
  it("should display success message when no issues", () => {
    render(<ResultContent success={5} duplicates={0} hasIssues={false} />);

    expect(screen.getByText("Import successful!")).toBeInTheDocument();
    expect(screen.getByText("5 applications imported")).toBeInTheDocument();
  });

  it("should display warning message when has issues", () => {
    render(<ResultContent success={3} duplicates={2} hasIssues={true} />);

    expect(
      screen.getByText("Import completed with issues"),
    ).toBeInTheDocument();
  });

  it("should display singular form for one application", () => {
    render(<ResultContent success={1} duplicates={0} hasIssues={false} />);

    expect(screen.getByText("1 application imported")).toBeInTheDocument();
  });

  it("should display duplicates count", () => {
    render(<ResultContent success={3} duplicates={2} hasIssues={true} />);

    expect(
      screen.getByText("3 applications imported, 2 duplicates skipped"),
    ).toBeInTheDocument();
  });

  it("should display singular form for one duplicate", () => {
    render(<ResultContent success={0} duplicates={1} hasIssues={true} />);

    expect(screen.getByText("1 duplicate skipped")).toBeInTheDocument();
  });

  it("should display no applications message when nothing imported", () => {
    render(<ResultContent success={0} duplicates={0} hasIssues={true} />);

    expect(screen.getByText("No applications imported")).toBeInTheDocument();
  });
});
