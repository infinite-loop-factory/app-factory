/**
 * Hook for fetching upcoming departures at a station using the KRIC
 * convenientInfo/stationTimetable endpoint.
 *
 * Looks up the station's KRIC identifiers from the synced code map,
 * fetches the full day's timetable, then returns only the next N
 * departures from the current time.
 */

import type { StationTimetableItem } from "@/lib/kric-api";

import { useEffect, useState } from "react";
import { getKricRef } from "@/data/kric-station-sync";
import {
  fetchStationTimetable,
  getCurrentDayCd,
  nowInMinutes,
  parseApiTime,
} from "@/lib/kric-api";

/** KRIC line code for a given app line name */
const APP_LINE_TO_KRIC: Record<string, string> = {
  "1호선": "1",
  "2호선": "2",
  "3호선": "3",
  "4호선": "4",
  "5호선": "5",
  "6호선": "6",
  "7호선": "7",
  "8호선": "8",
  "9호선": "9",
  공항철도: "A1",
  경의중앙선: "K1",
  경춘선: "K4",
  수인분당선: "K2",
  신분당선: "D1",
};

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

/**
 * Returns the next `limit` departures from `stationName` on `lineName`.
 * Returns an empty list (not an error) when the KRIC code map hasn't been
 * synced yet — callers should show a "sync required" prompt in that case.
 */
export function useStationTimetable(
  stationName: string,
  lineName: string,
  limit = 5,
): TimetableState {
  const [state, setState] = useState<TimetableState>({
    departures: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    const kricLnCd = APP_LINE_TO_KRIC[lineName];
    if (!kricLnCd) {
      setState({ departures: [], loading: false, error: null });
      return;
    }

    const ref = getKricRef(stationName, kricLnCd);
    if (!ref) {
      // Code map not yet synced — not an error, just not ready
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
  }, [stationName, lineName, limit]);

  return state;
}
