import type {
  TastingNote,
  TastingNoteFilter,
} from "@/features/tasting/repo/types";
import type { DayBucket } from "@/features/tasting/utils/group-by-day";

import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import * as repo from "@/features/tasting/repo/tasting-note-repo";
import { groupByDay } from "@/features/tasting/utils/group-by-day";

export type TastingFeedState = {
  buckets: DayBucket[];
  notes: TastingNote[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
};

export function useTastingFeed(filter: TastingNoteFilter): TastingFeedState {
  const [notes, setNotes] = useState<TastingNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    // refreshKey is intentionally in deps to allow `refresh()` to retrigger.
    void refreshKey;
    let active = true;
    setIsLoading(true);
    repo
      .list(filter)
      .then((result) => {
        if (!active) return;
        setNotes(result);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filter, refreshKey]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return {
    buckets: groupByDay(notes),
    notes,
    isLoading,
    error,
    refresh,
  };
}
