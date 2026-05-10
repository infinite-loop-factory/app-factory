import type { DateTime } from "luxon";

export type MapFilterMode = "year" | "all" | "range";

export interface SummaryQueryParams {
  year: number | null;
  startDate?: string;
  endDate?: string;
}

interface BuildSummaryQueryParamsArgs {
  filterMode: MapFilterMode;
  selectedYear: number;
  startDate: DateTime | null;
  endDate: DateTime | null;
}

export function buildSummaryQueryParams({
  filterMode,
  selectedYear,
  startDate,
  endDate,
}: BuildSummaryQueryParamsArgs): SummaryQueryParams {
  if (filterMode === "year") {
    return { year: selectedYear };
  }

  if (filterMode === "range" && startDate && endDate) {
    return {
      year: null,
      startDate: startDate.toFormat("yyyy-MM-dd"),
      endDate: endDate.toFormat("yyyy-MM-dd"),
    };
  }

  return { year: null };
}
