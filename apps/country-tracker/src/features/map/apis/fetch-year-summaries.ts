import type { SupabaseYearSummaryRow } from "@/features/map/types/map-summary";
import type { CountryItem } from "@/types/country-item";

import { DateTime } from "luxon";
import { fetchVisitedCountries } from "@/features/map/apis/fetch-visited-countries";
import supabase from "@/lib/supabase";

export async function fetchYearSummaries(
  userId: string,
  year: number | null,
): Promise<SupabaseYearSummaryRow[]> {
  // If year is null, we want "All Time" stats.
  // Since the RPC "get_country_year_summaries" might not handle null year correctly (or returns empty),
  // we fallback to fetching all visited countries via fetchVisitedCountries and grouping them.
  if (year === null) {
    const items = await fetchVisitedCountries(userId);
    const result = aggregateVisitsToSummaries(items);
    return result;
  }

  const zone = DateTime.local().zoneName;
  const { data, error } = await supabase.rpc("get_country_year_summaries", {
    p_user_id: userId,
    p_year: year,
    p_timezone: zone,
  });
  if (error) {
    throw error;
  }
  return (data ?? []) as SupabaseYearSummaryRow[];
}

function aggregateVisitsToSummaries(
  items: CountryItem[],
): SupabaseYearSummaryRow[] {
  const groups: Record<string, SupabaseYearSummaryRow> = {};

  for (const item of items) {
    const code = item.country_code;
    if (!groups[code]) {
      groups[code] = {
        country: item.country,
        country_code: code,
        total_days: 0,
        visit_count: 0,
        latest_visit: null,
        ranges: [],
      };
    }
    const g = groups[code];
    const days = typeof item.stayDays === "number" ? item.stayDays : 0;
    g.total_days = (g.total_days ?? 0) + days;
    g.visit_count = (g.visit_count ?? 0) + 1;

    // Update latest_visit
    if (!g.latest_visit || item.endDate > g.latest_visit) {
      g.latest_visit = item.endDate;
    }

    g.ranges?.push({
      startDate: item.startDate,
      endDate: item.endDate,
      days: days,
    });
  }

  return Object.values(groups);
}
