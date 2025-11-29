import {
  getBaseTypeName,
  isNullable,
  isOptional,
} from "@/shared/utils/zod-utils";
import z from "zod";
import { CSVFileParser } from "./csv-parser";
import { JSONFileParser } from "./json-parser";
import { FileParserStrategy } from "./parser-strategy";

type ZodObjectSchema = z.ZodObject<Record<string, z.ZodType>>;

export class FileParser<T extends ZodObjectSchema> {
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
      const coercedItem = this.#coerceToSchema(item);
      const result = this.#schema.safeParse(coercedItem);
      if (!result.success) {
        throw new Error("Data validation failed: " + result.error.message);
      }
      return result.data;
    });

    return validatedData;
  }

  #coerceToSchema(item: Record<string, unknown>): Record<string, unknown> {
    const schemaShape = this.#schema.shape;

    const coercedItem: Record<string, unknown> = {};

    for (const key in schemaShape) {
      const fieldSchema = schemaShape[key];

      if (!fieldSchema) continue;

      const rawValue = item[key];

      if (typeof rawValue === "string") {
        coercedItem[key] = this.#coerceValue(rawValue, fieldSchema);
        continue;
      }
      if (rawValue !== undefined) {
        coercedItem[key] = rawValue;
      }
    }

    return coercedItem;
  }
  #coerceValue(value: string, fieldSchema: z.ZodType): unknown {
    const isEmpty = value.trim() === "";
    const typeName = getBaseTypeName(fieldSchema);

    if (isEmpty) {
      if (isNullable(fieldSchema)) {
        return null;
      }

      if (isOptional(fieldSchema)) {
        return undefined;
      }

      return value;
    }

    switch (typeName) {
      case "number": {
        const num = Number(value);
        return isNaN(num) ? value : num;
      }
      case "boolean":
        return value.toLowerCase() === "true"
          ? true
          : value.toLowerCase() === "false"
            ? false
            : value;
      case "date": {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date;
      }
      default:
        return value;
    }
  }
}
