import Papa from "papaparse";
import { FileParserStrategy } from "./parser-strategy";

export class CSVFileParser<T> implements FileParserStrategy<Partial<T>> {
  async parse(file: File): Promise<Partial<T>[]> {
    const text = await file.text();
    const results = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const formatted = results.data.map((row) => {
      const formattedRow: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(
        row as Record<string, string>,
      )) {
        const camelCasedKey = this.#toCamelCase(key);
        formattedRow[camelCasedKey] = this.#cleanValueFromQuotes(value);
      }
      return formattedRow as Partial<T>;
    });

    return formatted;
  }

  supports(file: File): boolean {
    return file.type === "text/csv";
  }

  #cleanValueFromQuotes(value: string): string {
    return value.replace(/^"|"$/g, "");
  }

  #toCamelCase(header: string): string {
    let key = this.#cleanValueFromQuotes(header.trim());

    if (key.includes(" ")) {
      const parts = key.split(" ");
      key =
        parts[0]?.toLowerCase() +
        parts
          .slice(1)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("");
    } else {
      key = key.charAt(0).toLowerCase() + key.slice(1);
    }

    return key;
  }
}
