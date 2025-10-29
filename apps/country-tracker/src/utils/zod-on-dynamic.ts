import type { ZodType } from "zod";

import { z } from "zod";

/**
 * Create a typed `onDynamic` validator function for TanStack Form from a Zod
 * schema. This returns a function with the shape `(args: { value: T }) =>
 * Record<string, string | string[] | undefined> | undefined` which matches
 * the runtime expectations of TanStack Form's `onDynamic` validators.
 *
 * Using this approach avoids casting Zod schemas to the library's
 * internal `StandardSchemaV1` type and keeps the input/output types
 * strongly typed.
 */
export function zodOnDynamic<T>(schema: ZodType<T>) {
  return (args: { value: T }) => {
    const result = schema.safeParse(args.value as unknown);
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const mapped: Record<string, string | string[] | undefined> = {};
      Object.entries(fieldErrors).forEach(([key, val]) => {
        if (Array.isArray(val) && val.length > 0) {
          mapped[key] = val.length === 1 ? val[0] : val;
        }
      });
      return mapped;
    }
    return undefined;
  };
}
