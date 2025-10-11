export function normalizeTimestamp(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value.toISOString();
  }
  return new Date().toISOString();
}
