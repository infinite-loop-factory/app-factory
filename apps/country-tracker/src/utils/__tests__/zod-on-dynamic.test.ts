import { describe, expect, it } from "@jest/globals";
import { z } from "zod";
import { zodOnDynamic } from "@/utils/zod-on-dynamic";

describe("zodOnDynamic", () => {
  it("returns undefined when the value passes the schema", () => {
    const schema = z.object({
      name: z.string().min(1),
      age: z.number().int().nonnegative(),
    });

    const validate = zodOnDynamic<{ name: string; age: number }>(schema);

    const result = validate({ value: { name: "Alice", age: 30 } });
    expect(result).toBeUndefined();
  });

  it("maps field errors to strings or arrays for invalid input", () => {
    const schema = z.object({
      name: z.string().min(1),
      tags: z.array(z.string()).min(1),
    });

    const validate = zodOnDynamic<{ name: string; tags: string[] }>(schema);

    // missing name and empty tags
    const result = validate({ value: { name: "", tags: [] } });
    expect(result).toBeDefined();
    if (!result) return; // for TypeScript narrowing

    // name should be a single string error
    expect(result.name).toBeDefined();
    expect(typeof result.name === "string" || Array.isArray(result.name)).toBe(
      true,
    );

    // tags may produce an array of errors (array-level message)
    expect(result.tags).toBeDefined();
    expect(typeof result.tags === "string" || Array.isArray(result.tags)).toBe(
      true,
    );
  });
});
