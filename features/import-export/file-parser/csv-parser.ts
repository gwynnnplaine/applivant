import { FileParserStrategy } from "./parser-strategy";

export class CSVFileParser<T> implements FileParserStrategy<Partial<T>> {
  async parse(file: File): Promise<Partial<T>[]> {
    const text = await file.text();

    const splittedLines = text.split("\n");
    const headers = splittedLines[0]?.split(",") || [];
    const dataLines = splittedLines.slice(1);

    const formattedData = dataLines.map((line) => {
      const values = line.split(",");
      const entry: Partial<T> = {};

      headers.forEach((header, index) => {
        const key = this.#toCamelCase(header);
        (entry as Record<string, string>)[key] = this.#cleanValueFromQuotes(
          values[index] || "",
        ).trim();
      });

      return entry;
    });

    return formattedData;
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
