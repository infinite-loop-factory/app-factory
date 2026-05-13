import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { fetchYearSummaries } from "@/features/map/apis/fetch-year-summaries";
import { syncWidget } from "@/features/widget/apis/widget-bridge";
import { EMPTY_SNAPSHOT } from "@/features/widget/types/widget-snapshot";
import { buildWidgetSnapshot } from "@/features/widget/utils/build-snapshot";
import supabase from "@/lib/supabase";

export function useWidgetSync(): void {
  useEffect(() => {
    if (Platform.OS === "web") return;
    let cancelled = false;

    const run = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const userId = data?.user?.id;
        if (!userId) {
          await syncWidget(EMPTY_SNAPSHOT);
          return;
        }
        const summaries = await fetchYearSummaries(userId, null);
        const normalized = summaries.map((row) => ({
          country: row.country ?? "",
          countryCode: (row.country_code ?? "").toUpperCase(),
          flag: "",
          totalDays: Number(row.total_days ?? 0),
          visitCount: Number(row.visit_count ?? 0),
          latestVisit: row.latest_visit,
          ranges: [],
        }));
        if (cancelled) return;
        await syncWidget(buildWidgetSnapshot(normalized));
      } catch {
        // best-effort
      }
    };

    run();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") run();
    });
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);
}
