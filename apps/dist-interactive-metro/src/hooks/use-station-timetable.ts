import type { StationTimetableItem } from "@/lib/kric-api";

import { useEffect, useState } from "react";
import { getKricRef, getStinConsOrdrByCd } from "@/data/kric-station-sync";
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
  /** Minutes from now until departure */
  minutesFromNow: number;
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
 * Returns true if a train terminating at `tmnStinCd` is heading in the
 * correct direction from start toward destination, using stinConsOrdr for
 * accurate line-position comparison.
 *
 * Falls back to true (show all) when order data is unavailable, e.g. before
 * the first re-sync after this schema update.
 */
function isCorrectDirection(
  tmnStinCd: string,
  startOrder: number,
  destOrder: number,
  kricLnCd: string,
): boolean {
  const tmnOrder = getStinConsOrdrByCd(tmnStinCd, kricLnCd);
  if (tmnOrder === undefined || Number.isNaN(tmnOrder)) return true;
  if (Number.isNaN(startOrder) || Number.isNaN(destOrder)) return true;
  if (destOrder > startOrder) return tmnOrder >= destOrder;
  if (destOrder < startOrder) return tmnOrder <= destOrder;
  return true;
}

export function useStationTimetable(
  stationName: string,
  lineName: string,
  limit = 5,
  destinationStationName?: string,
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

    // _codeMap is guaranteed loaded at this point (ref was found from it).
    const startOrder = ref.stinConsOrdr;
    const destRef = destinationStationName
      ? getKricRef(destinationStationName, kricLnCd)
      : null;
    const destOrder = destRef?.stinConsOrdr;

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
        const seen = new Set<string>();
        const upcoming = items
          .filter((item) => {
            const t = item.dptTm || item.arvTm;
            if (!t || parseApiTime(t) < now) return false;
            if (destOrder === undefined) return true;
            return isCorrectDirection(
              item.tmnStinCd,
              startOrder,
              destOrder,
              kricLnCd,
            );
          })
          .sort((a, b) => {
            const ta = a.dptTm || a.arvTm;
            const tb = b.dptTm || b.arvTm;
            return parseApiTime(ta) - parseApiTime(tb);
          })
          .reduce<typeof items>((acc, item) => {
            const t = item.dptTm || item.arvTm;
            const key = `${t.slice(0, 2)}:${t.slice(2, 4)}`;
            if (!seen.has(key)) {
              seen.add(key);
              acc.push(item);
            }
            return acc;
          }, [])
          .slice(0, limit)
          .map((item) => {
            const raw = item.dptTm || item.arvTm;
            const h = raw.slice(0, 2);
            const m = raw.slice(2, 4);
            const minutesFromNow = parseApiTime(raw) - now;
            return {
              dptTime: `${h}:${m}`,
              minutesFromNow,
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
  }, [ref, isRetrying, kricLnCd, limit, destinationStationName]);

  return state;
}
