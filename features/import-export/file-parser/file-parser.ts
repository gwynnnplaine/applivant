import z from "zod";
import { CSVFileParser } from "./csv-parser";
import { JSONFileParser } from "./json-parser";
import { FileParserStrategy } from "./parser-strategy";

export class FileParser<T extends z.ZodType> {
  #schema: T;

  #strategies: FileParserStrategy<T>[] = [
    new CSVFileParser<T>(),
    new JSONFileParser<T>(),
  ];

  constructor(schema: T) {
    this.#schema = schema;
  }

  async parse(file: File): Promise<z.infer<T>[]> {
    const strategy = this.#strategies.find((s) => s.supports(file));

    if (!strategy) {
      throw new Error("Unsupported file type");
    }

    const rawData = await strategy.parse(file);

    const validatedData = rawData.map((item) => {
      const result = this.#schema.safeParse(item);
      if (!result.success) {
        throw new Error("Data validation failed: " + result.error.message);
      }
      return result.data;
    });

    return validatedData;
  }
}
