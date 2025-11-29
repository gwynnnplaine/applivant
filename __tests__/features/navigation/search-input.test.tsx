import { SearchInput } from "@/features";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";

describe("SearchInput", () => {
  it("should render empty state correctly", () => {
    render(
      <NuqsTestingAdapter>
        <SearchInput />
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Search applications...",
    );
  });

  it("should render with initial value", () => {
    render(
      <NuqsTestingAdapter searchParams={{ search: "initial query" }}>
        <SearchInput />
      </NuqsTestingAdapter>,
    );

    expect(screen.getByRole("textbox")).toHaveValue("initial query");
  });

  it("should update value on user input", async () => {
    const user = userEvent.setup();

    render(
      <NuqsTestingAdapter>
        <SearchInput />
      </NuqsTestingAdapter>,
    );

    await user.type(screen.getByRole("textbox"), "test search");

    expect(screen.getByRole("textbox")).toHaveValue("test search");
  });
});
