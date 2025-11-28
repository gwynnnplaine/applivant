import { FileParserStrategy } from "./parser-strategy";

export class JSONFileParser<T> implements FileParserStrategy<T> {
  async parse(file: File): Promise<Partial<T>[]> {
    return JSON.parse(await file.text());
  }

  supports(file: File): boolean {
    return file.type === "application/json";
  }
}
