import { JSONFileParser } from "@/features/import-export/file-parser/json-parser";
import { describe, expect, test } from "vitest";

describe("JSON Parser", () => {
  test("should not parse if file type is not text/csv", () => {
    const parser = new JSONFileParser();

    const file = new File(["name,age\nJohn,30"], "test.txt", {
      type: "text/plain",
    });

    expect(parser.supports(file)).toBe(false);
  });
  test("should parse CSV file correctly", async () => {
    const parser = new JSONFileParser<{ name: string; age: string }[]>();

    const data = [
      {
        name: "John",
        age: 30,
      },
      { name: "Jane", age: 25 },
    ];

    const file = new File([JSON.stringify(data)], "test.json", {
      type: "application/json",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([
      { name: "John", age: "30" },
      { name: "Jane", age: "25" },
    ]);
  });

  test("should handle empty values", async () => {
    const parser = new JSONFileParser<{ name: string; age: string }[]>();

    const data = [
      {
        name: "John",
        age: null,
      },
      {
        name: null,
        age: 25,
      },
    ];
    const file = new File([JSON.stringify(data)], "test.json", {
      type: "application/json",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([
      { name: "John", age: "" },
      { name: "", age: "25" },
    ]);
  });
});
