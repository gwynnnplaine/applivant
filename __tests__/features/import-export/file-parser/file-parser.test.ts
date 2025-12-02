import { FileParser } from "@/features/import-export/file-parser/file-parser";
import { beforeEach, describe, expect, test, vi } from "vitest";
import z from "zod";

const testSchema = z.object({
  name: z.string(),
  age: z.number(),
});

describe("File Parser", () => {
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

  test("should apply CSV strategy for CSV files", async () => {
    const parser = new FileParser(testSchema);

    const file = new File(["name,age\nJohn,30\nJane,25"], "test.csv", {
      type: "text/csv",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
    ]);
  });
  test("should apply JSON strategy for JSON files", async () => {
    const parser = new FileParser(testSchema);

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
      { name: "John", age: 30 },
      { name: "Jane", age: 25 },
    ]);
  });
  test("should throw an error if applied not supported file type", async () => {
    const parser = new FileParser(testSchema);

    const file = new File(["name,age\nJohn,30"], "test.txt", {
      type: "text/plain",
    });

    const result = await parser.parse(file).catch((e) => e.message);

    expect(result).toBe("Unsupported file type");
  });

  test("should throw an error if data validation fails", async () => {
    const parser = new FileParser(testSchema);

    const file = new File(["name,age\nJohn,thirty"], "test.csv", {
      type: "text/csv",
    });
    const result = await parser.parse(file).catch((e) => e);

    expect(result).toBeInstanceOf(z.ZodError);
  });
  test("should coerce boolean and number values from strings", async () => {
    const schema = z.object({
      isActive: z.boolean(),
      score: z.number(),
    });
    const parser = new FileParser(schema);

    const file = new File(["isActive,score\ntrue,42\nfalse,100"], "test.csv", {
      type: "text/csv",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([
      { isActive: true, score: 42 },
      { isActive: false, score: 100 },
    ]);
  });
  test("should coerce date string to Date object", async () => {
    const schema = z.object({
      eventDate: z.date(),
      time: z.string(),
    });
    const parser = new FileParser(schema);

    const file = new File(
      [
        "eventDate,time\n2024-01-01T10:00:00Z,10:00 AM\n2024-06-15T15:30:00Z,3:30 PM",
      ],
      "test.csv",
      {
        type: "text/csv",
      },
    );

    const result = await parser.parse(file);

    expect(result).toEqual([
      { eventDate: new Date("2024-01-01T10:00:00Z"), time: "10:00 AM" },
      { eventDate: new Date("2024-06-15T15:30:00Z"), time: "3:30 PM" },
    ]);
  });

  test("should handle optional fields in CSV", async () => {
    const schemaWithOptional = z.object({
      name: z.string(),
      age: z.number().optional(),
    });

    const parser = new FileParser(schemaWithOptional);

    const file = new File(["name,age\nJohn,30\nJane,"], "test.csv", {
      type: "text/csv",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([{ name: "John", age: 30 }, { name: "Jane" }]);
  });

  test("should handle empty values in CSV", async () => {
    const schemaWithNullable = z.object({
      name: z.string().nullable(),
      age: z.number().nullable(),
    });
    const parser = new FileParser(schemaWithNullable);

    const file = new File(["name,age\nJohn,\n,25"], "test.csv", {
      type: "text/csv",
    });

    const result = await parser.parse(file);

    expect(result).toEqual([
      { name: "John", age: null },
      { name: null, age: 25 },
    ]);
  });
  test("should handle empty values in JSON", async () => {
    const schemaWithNullable = z.object({
      name: z.string().nullable(),
      age: z.number().nullable(),
    });
    const parser = new FileParser(schemaWithNullable);

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
      { name: "John", age: null },
      { name: null, age: 25 },
    ]);
  });
});
