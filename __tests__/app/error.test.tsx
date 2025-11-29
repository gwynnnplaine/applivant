import ErrorPage from "@/app/error";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Error Page", () => {
  const mockReset = vi.fn();
  const mockError = new Error("Test error message");

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should render error message", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("should display 'Unknown error' when no message provided", () => {
    const errorWithoutMessage = new Error();
    errorWithoutMessage.message = "";

    render(<ErrorPage error={errorWithoutMessage} reset={mockReset} />);

    expect(screen.getByText("Unknown error")).toBeInTheDocument();
  });

  it("should display error digest when provided", () => {
    const errorWithDigest = Object.assign(new Error("Test"), {
      digest: "abc123",
    });

    render(<ErrorPage error={errorWithDigest} reset={mockReset} />);

    expect(screen.getByText("Error ID: abc123")).toBeInTheDocument();
  });

  it("should call reset when Try Again button is clicked", async () => {
    const user = userEvent.setup();

    render(<ErrorPage error={mockError} reset={mockReset} />);

    await user.click(screen.getByRole("button", { name: "Try Again" }));

    expect(mockReset).toHaveBeenCalledOnce();
  });

  it("should navigate home when Go Home button is clicked", async () => {
    const user = userEvent.setup();

    render(<ErrorPage error={mockError} reset={mockReset} />);

    await user.click(screen.getByRole("button", { name: "Go Home" }));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should log error to console on mount", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(consoleSpy).toHaveBeenCalledWith("Application error:", mockError);
  });
});
