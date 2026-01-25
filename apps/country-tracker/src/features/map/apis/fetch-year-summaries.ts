import type { SupabaseYearSummaryRow } from "@/features/map/types/map-summary";
import type { CountryItem } from "@/types/country-item";

import { DateTime } from "luxon";
import { fetchVisitedCountries } from "@/features/map/apis/fetch-visited-countries";
import supabase from "@/lib/supabase";

export async function fetchYearSummaries(
  userId: string,
  year: number | null,
  startDate?: string, // YYYY-MM-DD
  endDate?: string, // YYYY-MM-DD
): Promise<SupabaseYearSummaryRow[]> {
  // If we have a custom date range OR year is explicitly null (All Time),
  // we use client-side aggregation.
  if (startDate && endDate) {
    const items = await fetchVisitedCountries(userId);
    // Filter items overlaps with [startDate, endDate]
    // item.startDate, item.endDate are YYYY-MM-DD strings
    const filteredItems = items.filter((item) => {
      // Simple string comparison works for ISO dates
      const itemStart = item.startDate;
      const itemEnd = item.endDate;

      // Check overlap: (StartA <= EndB) and (EndA >= StartB)
      return itemStart <= endDate && itemEnd >= startDate;
    });

    // Now we need to adjust 'stayDays' for each item to only count days WITHIN the range
    const adjustedItems = filteredItems.map((item) => {
      const iStart = item.startDate < startDate ? startDate : item.startDate;
      const iEnd = item.endDate > endDate ? endDate : item.endDate;

      // Calculate days difference
      const startDt = DateTime.fromISO(iStart);
      const endDt = DateTime.fromISO(iEnd);
      const days = endDt.diff(startDt, "days").days + 1; // Inclusive

      return {
        ...item,
        startDate: iStart,
        endDate: iEnd,
        stayDays: Math.max(0, days), // Ensure non-negative
      };
    });

    return aggregateVisitsToSummaries(adjustedItems);
  }

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
