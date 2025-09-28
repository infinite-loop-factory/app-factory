import { describe, expect, it } from "@jest/globals";
import { formatIsoDate } from "@/utils/format-date";

describe("formatIsoDate", () => {
  it("formats a valid ISO string to yyyy-MM-dd by default", () => {
    expect(formatIsoDate("2024-03-15T10:30:00Z")).toBe("2024-03-15");
  });

  it("respects a custom format option", () => {
    expect(
      formatIsoDate("2024-03-15T10:30:00Z", { format: "dd LLL yyyy" }),
    ).toBe("15 Mar 2024");
  });

  it("returns fallback when date is invalid", () => {
    expect(formatIsoDate("not-a-date", { fallback: "N/A" })).toBe("N/A");
  });

  it("returns original input if invalid and no fallback provided", () => {
    expect(formatIsoDate("not-a-date")).toBe("not-a-date");
  });

  it("uses the provided zone when formatting", () => {
    const iso = "2024-03-15T23:30:00-05:00";
    expect(formatIsoDate(iso, { zone: "UTC" })).toBe("2024-03-16");
  });

  it("returns custom fallback type when provided", () => {
    expect(formatIsoDate("invalid", { fallback: null })).toBeNull();
  });
});
