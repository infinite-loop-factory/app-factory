import type { SupabaseYearSummaryRow } from "@/features/map/types/map-summary";

import { DateTime } from "luxon";
import supabase from "@/lib/supabase";

export async function fetchYearSummaries(
  userId: string,
  year: number | null,
): Promise<SupabaseYearSummaryRow[]> {
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
