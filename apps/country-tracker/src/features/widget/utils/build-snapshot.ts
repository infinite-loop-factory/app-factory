import type { CountryYearSummary } from "@/features/map/types/map-summary";
import type { WidgetSnapshot } from "@/features/widget/types/widget-snapshot";

import { countryCodeToFlagEmoji } from "@/utils/country-code-to-flag-emoji";

export function buildWidgetSnapshot(
  summaries: CountryYearSummary[],
): WidgetSnapshot {
  const totalCountries = summaries.length;
  const totalDays = summaries.reduce((sum, s) => sum + s.totalDays, 0);

  const sorted = summaries.slice().sort((a, b) => {
    const aDate = a.latestVisit ?? "";
    const bDate = b.latestVisit ?? "";
    if (aDate === "" && bDate === "") return 0;
    if (aDate === "") return 1;
    if (bDate === "") return -1;
    return bDate.localeCompare(aDate);
  });

  const recent = sorted.slice(0, 3).map((s) => ({
    code: s.countryCode,
    flag: countryCodeToFlagEmoji(s.countryCode),
    name: s.country || s.countryCode,
    days: s.totalDays,
  }));

  return {
    totalCountries,
    totalDays,
    recent,
    updatedAt: new Date().toISOString(),
  };
}
