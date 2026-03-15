import { DateTime } from "luxon";
import supabase from "@/lib/supabase";
import { toUtcBoundaryTimestamp } from "@/utils/date-range";
import { enqueueOperation, isOnline } from "@/utils/offline-queue";

export async function deleteVisitDays(params: {
  userId: string;
  countryCode: string;
  dateSet: string[];
}): Promise<number> {
  const { userId, countryCode, dateSet } = params;

  const online = await isOnline();
  if (!online) {
    await enqueueOperation({
      type: "delete",
      table: "locations",
      payload: {},
      deleteParams: params,
    });
    return dateSet.length; // optimistic count
  }

  const zoneName = DateTime.local().zoneName;

  let totalDeleted = 0;
  for (const date of dateSet) {
    const startUtc = toUtcBoundaryTimestamp(date, zoneName, "start");
    const endUtc = toUtcBoundaryTimestamp(date, zoneName, "end");

    const { count, error } = await supabase
      .from("locations")
      .delete({ count: "exact" })
      .eq("user_id", userId)
      .eq("country_code", countryCode.toLowerCase())
      .gte("timestamp", startUtc)
      .lte("timestamp", endUtc);

    if (error) throw error;
    totalDeleted += count ?? 0;
  }

  return totalDeleted;
}
