/**
 * Hook for fetching upcoming departures at a station using the KRIC
 * convenientInfo/stationTimetable endpoint.
 *
 * Looks up the station's KRIC identifiers from the synced code map,
 * fetches the full day's timetable, then returns only the next N
 * departures from the current time.
 *
 * If the KRIC code map has not been loaded yet (sync in progress), the hook
 * retries every 2 s (up to 8 times ≈ 16 s) so it self-heals once sync
 * completes without requiring the caller to re-mount.
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
import { APP_LINE_TO_KRIC } from "@/lib/line-codes";

const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 2000;

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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const kricLnCd = APP_LINE_TO_KRIC[lineName];
    if (!kricLnCd) {
      setState({ departures: [], loading: false, error: null });
      return;
    }

    const ref = getKricRef(stationName, kricLnCd);
    if (!ref) {
      // Code map not yet synced — retry until available or max retries reached
      if (retryCount < MAX_RETRIES) {
        const t = setTimeout(() => setRetryCount((c) => c + 1), RETRY_DELAY_MS);
        return () => clearTimeout(t);
      }
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
  }, [stationName, lineName, limit, retryCount]);

  return state;
}
