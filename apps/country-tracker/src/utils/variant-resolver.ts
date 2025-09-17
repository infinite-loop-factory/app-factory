export const createVariantResolver = <
  const T extends readonly (string | number)[],
>(
  values: T,
) => {
  const allowed = new Set<T[number]>(values as readonly T[number][]);
  return (value: unknown): T[number] | undefined => {
    if (typeof value === "string" || typeof value === "number") {
      return allowed.has(value as T[number]) ? (value as T[number]) : undefined;
    }
    return undefined;
  };
};
