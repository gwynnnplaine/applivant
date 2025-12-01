import Papa from "papaparse";
import { FileParserStrategy } from "./parser-strategy";

export class CSVFileParser<T> implements FileParserStrategy<Partial<T>> {
  async parse(file: File): Promise<Partial<T>[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // results.data is already an array of objects!
          // You might need a small mapper to camelCase keys if CSV headers are different
          const formatted = results.data.map((row) => {
            const formattedRow: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(row)) {
              const camelCasedKey = this.#toCamelCase(key);
              formattedRow[camelCasedKey] = this.#cleanValueFromQuotes(
                value as string,
              );
            }
            return formattedRow as Partial<T>;
          });
          resolve(formatted);
        },
        error: (err) => reject(err),
      });
    });
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
