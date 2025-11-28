import { ApplicationForm } from "@/features/application-form/ui/application-form";
import { FormActions } from "@/features/application-form/ui/form-actions";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";

beforeAll(() => {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();

  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
});

afterEach(() => {
  cleanup();
});

describe("ApplicationForm", () => {
  test("renders all form fields", () => {
    render(<ApplicationForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Company/)).toBeDefined();
    expect(screen.getByLabelText(/Job Title/)).toBeDefined();
    expect(screen.getByRole("combobox", { name: /Status/ })).toBeDefined();
    expect(screen.getByRole("combobox", { name: /Job Type/ })).toBeDefined();
    expect(screen.getByPlaceholderText("120,000")).toBeDefined();
    expect(screen.getByLabelText(/Location/)).toBeDefined();
    expect(screen.getByLabelText(/Job URL/)).toBeDefined();
    expect(screen.getByLabelText(/Notes/)).toBeDefined();
  });

  test("renders required asterisks on required fields", () => {
    render(<ApplicationForm onSubmit={vi.fn()} />);

    expect(screen.getByText("Company").parentElement?.textContent).toContain(
      "*",
    );
    expect(screen.getByText("Job Title").parentElement?.textContent).toContain(
      "*",
    );
    expect(screen.getByText("Status").parentElement?.textContent).toContain(
      "*",
    );
    expect(screen.getByText("Job Type").parentElement?.textContent).toContain(
      "*",
    );
  });

  test("renders submit button", () => {
    render(<ApplicationForm onSubmit={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Submit Application" }),
    ).toBeDefined();
  });

  test("does not render delete button when onDelete is not provided", () => {
    render(<ApplicationForm onSubmit={vi.fn()} />);

    expect(
      screen.queryByRole("button", { name: "Delete Application" }),
    ).toBeNull();
  });

  test("renders delete button when onDelete is provided", () => {
    render(<ApplicationForm onSubmit={vi.fn()} onDelete={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Delete Application" }),
    ).toBeDefined();
  });

  test("populates form with default values for text fields", () => {
    render(
      <ApplicationForm
        onSubmit={vi.fn()}
        defaultValues={{
          company: "Test Company",
          jobTitle: "Test Title",
          salary: "80,000",
          location: "New York",
          jobUrl: "https://example.com",
          notes: "Some notes",
        }}
      />,
    );

    expect(screen.getByLabelText(/Company/)).toHaveProperty(
      "value",
      "Test Company",
    );
    expect(screen.getByLabelText(/Job Title/)).toHaveProperty(
      "value",
      "Test Title",
    );
    expect(screen.getByPlaceholderText("120,000")).toHaveProperty(
      "value",
      "80,000",
    );
    expect(screen.getByLabelText(/Location/)).toHaveProperty(
      "value",
      "New York",
    );
    expect(screen.getByLabelText(/Job URL/)).toHaveProperty(
      "value",
      "https://example.com",
    );
    expect(screen.getByLabelText(/Notes/)).toHaveProperty(
      "value",
      "Some notes",
    );
  });

  test("has default values for status and job type", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ApplicationForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "Software Engineer");

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    const callArgs = onSubmit.mock.calls[0][0];
    expect(callArgs.status).toBe("Applied");
    expect(callArgs.jobType).toBe("Full-time");
  });

  test("shows validation error for empty company", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ApplicationForm onSubmit={onSubmit} />);

    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      const companyInput = screen.getByLabelText(/Company/);
      expect(companyInput.getAttribute("aria-invalid")).toBe("true");
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for short company name", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ApplicationForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Company/), "A");
    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      const companyInput = screen.getByLabelText(/Company/);
      expect(companyInput.getAttribute("aria-invalid")).toBe("true");
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error for short job title", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<ApplicationForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/Company/), "Acme Corp");
    await user.type(screen.getByLabelText(/Job Title/), "X");
    await user.click(
      screen.getByRole("button", { name: "Submit Application" }),
    );

    await waitFor(() => {
      const jobTitleInput = screen.getByLabelText(/Job Title/);
      expect(jobTitleInput.getAttribute("aria-invalid")).toBe("true");
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<ApplicationForm onSubmit={vi.fn()} onDelete={onDelete} />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("allows typing in text fields", async () => {
    const user = userEvent.setup();

    render(<ApplicationForm onSubmit={vi.fn()} />);

    const companyInput = screen.getByLabelText(/Company/);
    const jobTitleInput = screen.getByLabelText(/Job Title/);
    const salaryInput = screen.getByPlaceholderText("120,000");
    const locationInput = screen.getByLabelText(/Location/);
    const jobUrlInput = screen.getByLabelText(/Job URL/);
    const notesInput = screen.getByLabelText(/Notes/);

    await user.type(companyInput, "Acme Corp");
    await user.type(jobTitleInput, "Software Engineer");
    await user.clear(salaryInput);
    await user.type(salaryInput, "150,000");
    await user.type(locationInput, "San Francisco, CA");
    await user.type(jobUrlInput, "https://example.com/job");
    await user.type(notesInput, "Great opportunity");

    expect(companyInput).toHaveProperty("value", "Acme Corp");
    expect(jobTitleInput).toHaveProperty("value", "Software Engineer");
    expect(salaryInput).toHaveProperty("value", "150,000");
    expect(locationInput).toHaveProperty("value", "San Francisco, CA");
    expect(jobUrlInput).toHaveProperty("value", "https://example.com/job");
    expect(notesInput).toHaveProperty("value", "Great opportunity");
  });

  test("renders select triggers for status and job type", () => {
    render(<ApplicationForm onSubmit={vi.fn()} />);

    expect(screen.getByRole("combobox", { name: /Status/ })).toBeDefined();
    expect(screen.getByRole("combobox", { name: /Job Type/ })).toBeDefined();
  });

  test("shows default values in selects", () => {
    render(<ApplicationForm onSubmit={vi.fn()} />);

    const statusSelect = screen.getByRole("combobox", { name: /Status/ });
    const jobTypeSelect = screen.getByRole("combobox", { name: /Job Type/ });

    expect(statusSelect.textContent).toContain("Applied");
    expect(jobTypeSelect.textContent).toContain("Full-time");
  });

  test("renders salary input with currency selector", () => {
    render(<ApplicationForm onSubmit={vi.fn()} />);

    // Salary input is present
    const salaryInput = screen.getByPlaceholderText("120,000");
    expect(salaryInput).toBeDefined();

    // There are 3 comboboxes: Status, Job Type, and Currency selector
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBe(3);
  });
});

describe("FormActions", () => {
  test("renders submit button with default label", () => {
    render(<FormActions />);

    expect(
      screen.getByRole("button", { name: "Submit Application" }),
    ).toBeDefined();
  });

  test("renders submit button with custom label", () => {
    render(<FormActions submitLabel="Save Changes" />);

    expect(screen.getByRole("button", { name: "Save Changes" })).toBeDefined();
  });

  test("does not render delete button when onDelete is not provided", () => {
    render(<FormActions />);

    expect(
      screen.queryByRole("button", { name: "Delete Application" }),
    ).toBeNull();
  });

  test("renders delete button when onDelete is provided", () => {
    render(<FormActions onDelete={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Delete Application" }),
    ).toBeDefined();
  });

  test("renders delete button with custom label", () => {
    render(<FormActions onDelete={vi.fn()} deleteLabel="Remove" />);

    expect(screen.getByRole("button", { name: "Remove" })).toBeDefined();
  });

  test("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(<FormActions onDelete={onDelete} />);

    await user.click(
      screen.getByRole("button", { name: "Delete Application" }),
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("submit button has type submit", () => {
    render(<FormActions />);

    const submitButton = screen.getByRole("button", {
      name: "Submit Application",
    });
    expect(submitButton.getAttribute("type")).toBe("submit");
  });

  test("delete button has type button", () => {
    render(<FormActions onDelete={vi.fn()} />);

    const deleteButton = screen.getByRole("button", {
      name: "Delete Application",
    });
    expect(deleteButton.getAttribute("type")).toBe("button");
  });
});
