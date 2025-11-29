import z from "zod";

// Recursively unwrap until we hit the base type
export const unwrap = (schema: z.ZodType): z.ZodType => {
  const def = schema._zod.def;
  const typeName = def.type;

  if (
    typeName === "optional" ||
    typeName === "nullable" ||
    typeName === "default"
  ) {
    const inner = (def as unknown as { innerType: z.ZodType }).innerType;
    return unwrap(inner);
  }

  if (typeName === "pipe") {
    const out = (def as unknown as { out: z.ZodType }).out;
    return unwrap(out);
  }

  return schema;
};

export const getBaseTypeName = (schema: z.ZodType): string => {
  const base = unwrap(schema);
  return base._zod.def.type;
};

export const isNullable = (schema: z.ZodType): boolean => {
  const typeName = schema._zod.def.type;

  return typeName === "nullable";
};

export const isOptional = (schema: z.ZodType): boolean => {
  const typeName = schema._zod.def.type;

  return typeName === "optional";
};
