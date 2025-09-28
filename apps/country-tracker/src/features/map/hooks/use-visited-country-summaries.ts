import type {
  CountryYearRange,
  CountryYearSummary,
  SupabaseYearRange,
} from "@/features/map/types/map-summary";

import { useQuery } from "@tanstack/react-query";
import { fetchYearSummaries } from "@/features/map/apis/fetch-year-summaries";
import { mapQueryKeys } from "@/features/map/apis/query-keys";

interface UseVisitedCountrySummariesQueryParams<T> {
  userId: string | null;
  year: number;
  select?: (data: CountryYearSummary[]) => T;
}

export function useVisitedCountrySummariesQuery<T = CountryYearSummary[]>(
  params: UseVisitedCountrySummariesQueryParams<T>,
) {
  const { userId, year, select } = params;

  return useQuery({
    queryKey: mapQueryKeys.visitedCountrySummaries({ userId, year }),
    enabled: Boolean(userId),
    queryFn: async () => {
      if (!userId) return [] as CountryYearSummary[];
      const rows = await fetchYearSummaries(userId, year);
      return rows.map((row) => {
        const countryCode = (row.country_code ?? "").toUpperCase();
        const normalizedRanges: CountryYearRange[] = Array.isArray(row.ranges)
          ? row.ranges
              .map((range: SupabaseYearRange) => ({
                startDate: range.startDate ?? "",
                endDate: range.endDate ?? "",
                days: Number(range.days ?? 0),
              }))
              .filter(
                (range) =>
                  range.startDate !== "" &&
                  range.endDate !== "" &&
                  range.days > 0,
              )
          : [];

        return {
          country: row.country ?? (countryCode || "Unknown"),
          countryCode,
          flag: "",
          totalDays: Number(row.total_days ?? 0),
          visitCount: Number(row.visit_count ?? normalizedRanges.length),
          latestVisit: row.latest_visit,
          ranges: normalizedRanges,
        } satisfies CountryYearSummary;
      });
    },
    select,
  });
}
