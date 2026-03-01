import { describe, expect, it } from "@jest/globals";
import { DateTime } from "luxon";
import { buildSummaryQueryParams } from "@/features/map/utils/summary-query-params";

describe("buildSummaryQueryParams", () => {
  it("returns year-only params in year mode", () => {
    expect(
      buildSummaryQueryParams({
        filterMode: "year",
        selectedYear: 2025,
        startDate: DateTime.fromISO("2025-01-01"),
        endDate: DateTime.fromISO("2025-01-31"),
      }),
    ).toEqual({ year: 2025 });
  });

  it("returns date range params in range mode", () => {
    expect(
      buildSummaryQueryParams({
        filterMode: "range",
        selectedYear: 2025,
        startDate: DateTime.fromISO("2025-02-01"),
        endDate: DateTime.fromISO("2025-02-28"),
      }),
    ).toEqual({
      year: null,
      startDate: "2025-02-01",
      endDate: "2025-02-28",
    });
  });

  it("falls back to all-time when range is incomplete", () => {
    expect(
      buildSummaryQueryParams({
        filterMode: "range",
        selectedYear: 2025,
        startDate: DateTime.fromISO("2025-02-01"),
        endDate: null,
      }),
    ).toEqual({ year: null });
  });

  it("returns all-time params in all mode", () => {
    expect(
      buildSummaryQueryParams({
        filterMode: "all",
        selectedYear: 2025,
        startDate: null,
        endDate: null,
      }),
    ).toEqual({ year: null });
  });
});
