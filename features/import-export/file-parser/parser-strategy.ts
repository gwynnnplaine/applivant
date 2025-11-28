export interface FileParserStrategy<T> {
  parse(file: File): Promise<Partial<T>[]>;
  supports(file: File): boolean;
}
