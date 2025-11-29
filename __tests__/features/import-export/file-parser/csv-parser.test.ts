import { CSVFileParser } from "@/features/import-export/file-parser/csv-parser";
import { beforeEach, describe, expect, test, vi } from "vitest";

describe("CSV Parser", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "File",
      class {
        private content: string;
        name: string;
        type: string;

        constructor(chunks: string[], name: string, options: { type: string }) {
          this.content = chunks.join("");
          this.name = name;
          this.type = options.type;
        }

        async text() {
          return this.content;
        }
      },
    );
  });
  test("should not parse if file type is not text/csv", () => {
    const parser = new CSVFileParser();

    const file = new File(["name,age\nJohn,30"], "test.txt", {
      type: "text/plain",
    });

    expect(parser.supports(file)).toBe(false);
  });
  test("should parse CSV file correctly", async () => {
    const parser = new CSVFileParser<{ name: string; age: string }>();

    const file = new File(["name,age\nJohn,30\nJane,25"], "test.csv", {
      type: "text/csv",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([
      { name: "John", age: "30" },
      { name: "Jane", age: "25" },
    ]);
  });
  test("should handle quoted values and spaces in headers", async () => {
    const parser = new CSVFileParser<{ firstName: string; lastName: string }>();

    const file = new File(
      ['"First Name","Last Name"\n"John","Doe"\n"Jane","Smith"'],
      "test.csv",
      { type: "text/csv" },
    );

    const result = await parser.parse(file);

    expect(result).toEqual([
      { firstName: "John", lastName: "Doe" },
      { firstName: "Jane", lastName: "Smith" },
    ]);
  });

  test("should handle empty values", async () => {
    const parser = new CSVFileParser<{ name: string; age: string }>();

    const file = new File(["name,age\nJohn,\n,25"], "test.csv", {
      type: "text/csv",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([
      { name: "John", age: "" },
      { name: "", age: "25" },
    ]);
  });
});
