import { describe, expect, it } from "@jest/globals";
import {
  buildIsoDateRange,
  countInclusiveDays,
  isInvalidIsoRange,
  toUtcBoundaryTimestamp,
} from "@/utils/date-range";

describe("date-range utils", () => {
  it("builds inclusive ranges", () => {
    expect(buildIsoDateRange("2024-01-01", "2024-01-03")).toEqual([
      "2024-01-01",
      "2024-01-02",
      "2024-01-03",
    ]);
  });

  it("handles invalid inputs", () => {
    expect(buildIsoDateRange("invalid", "2024-01-01")).toEqual([]);
  });

  it("validates ranges", () => {
    expect(isInvalidIsoRange("2024-02-10", "2024-02-05")).toBe(true);
    expect(isInvalidIsoRange("2024-02-05", "2024-02-10")).toBe(false);
  });

  it("counts inclusive days", () => {
    expect(countInclusiveDays("2024-03-01", "2024-03-05")).toBe(5);
    expect(countInclusiveDays("invalid", "2024-03-05")).toBe(0);
  });

  it("generates UTC boundaries", () => {
    const ts = toUtcBoundaryTimestamp("2024-04-01", "America/New_York", "end");
    expect(ts).toContain("2024-04-02");
  });
});
