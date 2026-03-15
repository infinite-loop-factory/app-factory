import { useVisitedCountrySummariesQuery } from "@/features/map/hooks/use-visited-country-summaries";
import { normalizeCountryCode } from "@/utils/country-codes";

/**
 * Returns unique normalized country codes for the given filter params.
 * Shared between native and web map implementations.
 */
export function useVisitedCountryCodes(params: {
  userId: string | null;
  year: number | null;
  startDate?: string;
  endDate?: string;
}) {
  return useVisitedCountrySummariesQuery<string[]>({
    userId: params.userId,
    year: params.year,
    startDate: params.startDate,
    endDate: params.endDate,
    select: (summaries) => {
      const rawCodes = Array.from(
        new Set(
          summaries.map((summary) => summary.countryCode).filter(Boolean),
        ),
      ) as string[];

      return rawCodes
        .map((raw) => normalizeCountryCode(raw))
        .filter((code): code is string => code !== null);
    },
  });
}
