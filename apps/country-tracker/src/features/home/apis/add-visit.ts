import supabase from "@/lib/supabase";
import { formatIsoDate } from "@/utils/format-date";

export async function fetchExistingByDateMap(params: {
  userId: string;
  rangeStartUtc: string;
  rangeEndUtc: string;
  zoneName: string;
}) {
  const { userId, rangeStartUtc, rangeEndUtc, zoneName } = params;
  const { data, error } = await supabase
    .from("locations")
    .select("timestamp,country_code")
    .eq("user_id", userId)
    .gte("timestamp", rangeStartUtc)
    .lte("timestamp", rangeEndUtc);
  if (error) throw error;
  const map = new Map<string, string>();
  data?.forEach((row) => {
    const dateKey = formatIsoDate(row.timestamp, {
      zone: zoneName,
      fallback: null,
    });
    if (!dateKey) return;
    map.set(dateKey, row.country_code?.toUpperCase() ?? "");
  });
  return map;
}

export async function insertManualEntries(
  payload: Array<Record<string, unknown>>,
) {
  const { error } = await supabase.from("locations").insert(payload);
  if (error) throw error;
}
