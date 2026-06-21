import { useEffect, useState } from "react";
import { getKricRef } from "@/data/kric-station-sync";
import { fetchStationTransferInfo } from "@/lib/kric-api";
import { APP_LINE_TO_KRIC } from "@/lib/line-codes";
import { MINS_PER_TRANSFER } from "@/utils/route-calculator";

export interface TransferPoint {
  stationName: string;
  fromLine: string;
  toLine: string;
}

interface RouteTransferMinutesState {
  /** Total transfer walking minutes across the route. Uses the real KRIC
   *  walking estimate per transfer, falling back to the baseline for any
   *  transfer whose distance could not be resolved. */
  transferMinutes: number;
  loading: boolean;
  /** True when at least one transfer used a real fetched distance. */
  hasRealData: boolean;
}

const WALK_SPEED_M_PER_MIN = 80;

async function resolveTransferMinutes(point: TransferPoint): Promise<{
  minutes: number;
  real: boolean;
}> {
  const fromLnCd = APP_LINE_TO_KRIC[point.fromLine];
  const toLnCd = APP_LINE_TO_KRIC[point.toLine];
  if (!(fromLnCd && toLnCd)) return { minutes: MINS_PER_TRANSFER, real: false };

  const ref = getKricRef(point.stationName, fromLnCd);
  if (!ref) return { minutes: MINS_PER_TRANSFER, real: false };

  const items = await fetchStationTransferInfo({
    railOprIsttCd: ref.railOprIsttCd,
    lnCd: ref.lnCd,
    stinCd: ref.stinCd,
  });
  const match = items.find(
    (item) =>
      item.chtnLn === point.toLine || APP_LINE_TO_KRIC[item.chtnLn] === toLnCd,
  );
  const distanceM = match ? Number.parseInt(match.chtnDst, 10) : Number.NaN;
  if (!Number.isFinite(distanceM) || distanceM <= 0) {
    return { minutes: MINS_PER_TRANSFER, real: false };
  }
  return { minutes: Math.ceil(distanceM / WALK_SPEED_M_PER_MIN), real: true };
}

/**
 * Aggregates the real walking time across every transfer on a route so the
 * displayed ETA reflects actual interchange distances instead of the flat
 * per-transfer baseline used during path selection.
 */
/** Callers should pass a referentially stable (memoized) array so the fetch
 *  effect only re-runs when the route actually changes. */
export function useRouteTransferMinutes(
  transfers: TransferPoint[],
): RouteTransferMinutesState {
  const [state, setState] = useState<RouteTransferMinutesState>({
    transferMinutes: transfers.length * MINS_PER_TRANSFER,
    loading: transfers.length > 0,
    hasRealData: false,
  });

  useEffect(() => {
    let cancelled = false;

    if (transfers.length === 0) {
      setState({ transferMinutes: 0, loading: false, hasRealData: false });
      return;
    }

    setState((s) => ({ ...s, loading: true }));

    Promise.all(transfers.map(resolveTransferMinutes))
      .then((results) => {
        if (cancelled) return;
        const transferMinutes = results.reduce((sum, r) => sum + r.minutes, 0);
        setState({
          transferMinutes,
          loading: false,
          hasRealData: results.some((r) => r.real),
        });
      })
      .catch(() => {
        if (cancelled) return;
        // Network failure → keep the baseline estimate rather than blocking UI.
        setState({
          transferMinutes: transfers.length * MINS_PER_TRANSFER,
          loading: false,
          hasRealData: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [transfers]);

  return state;
}
