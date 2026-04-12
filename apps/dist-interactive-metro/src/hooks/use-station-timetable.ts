import type { StationTimetableItem } from "@/lib/kric-api";

import { useEffect, useState } from "react";
import {
  fetchStationTimetable,
  getCurrentDayCd,
  nowInMinutes,
  parseApiTime,
} from "@/lib/kric-api";
import { APP_LINE_TO_KRIC } from "@/lib/line-codes";
import { useKricRefRetry } from "./use-kric-retry";

export interface UpcomingDeparture {
  /** Departure time as "HH:MM" */
  dptTime: string;
  /** Terminus station code (direction indicator) */
  terminusCd: string;
  /** Train number */
  trnNo: string;
}

interface TimetableState {
  departures: UpcomingDeparture[];
  loading: boolean;
  error: string | null;
}

export function useStationTimetable(
  stationName: string,
  lineName: string,
  limit = 5,
): TimetableState {
  const kricLnCd = APP_LINE_TO_KRIC[lineName];
  const { ref, isRetrying } = useKricRefRetry(stationName, kricLnCd);

  const [state, setState] = useState<TimetableState>({
    departures: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!kricLnCd) {
      setState({ departures: [], loading: false, error: null });
      return;
    }

    if (isRetrying) {
      setState((s) => ({ ...s, loading: true, error: null }));
      return;
    }

    if (!ref) {
      setState({ departures: [], loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchStationTimetable({
      railOprIsttCd: ref.railOprIsttCd,
      dayCd: getCurrentDayCd(),
      lnCd: ref.lnCd,
      stinCd: ref.stinCd,
    })
      .then((items: StationTimetableItem[]) => {
        if (cancelled) return;
        const now = nowInMinutes();
        const upcoming = items
          .filter((item) => {
            const t = item.dptTm || item.arvTm;
            return t && parseApiTime(t) >= now;
          })
          .slice(0, limit)
          .map((item) => {
            const raw = item.dptTm || item.arvTm;
            const h = raw.slice(0, 2);
            const m = raw.slice(2, 4);
            return {
              dptTime: `${h}:${m}`,
              terminusCd: item.tmnStinCd,
              trnNo: item.trnNo,
            };
          });
        setState({ departures: upcoming, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          departures: [],
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to load timetable",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [ref, isRetrying, kricLnCd, limit]);

  return state;
}
