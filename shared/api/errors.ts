export class ApplicationValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = "ApplicationValidationError";
  }
}

export class ApplicationNotFoundError extends Error {
  constructor(public readonly id: string) {
    super(`Application with ID ${id} not found`);
    this.name = "ApplicationNotFoundError";
  }
}

export class ApplicationDatabaseError extends Error {
  constructor(
    message: string,
    public readonly operation: "create" | "update" | "delete" | "read",
  ) {
    super(message);
    this.name = "ApplicationDatabaseError";
  }
}
