/**
 * Hook that fetches transfer walking distance between two lines at a station
 * using the KRIC convenientInfo/stationTransferInfo endpoint.
 *
 * Retries every 2 s (up to 8 times) when the KRIC code map has not yet been
 * loaded, so the hook self-heals once the initial sync completes.
 */

import { useEffect, useState } from "react";
import { getKricRef } from "@/data/kric-station-sync";
import { fetchStationTransferInfo } from "@/lib/kric-api";
import { APP_LINE_TO_KRIC } from "@/lib/line-codes";

const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 2000;

export interface TransferInfo {
  /** Walking distance in metres */
  distanceM: number;
  /** Estimated walking time in minutes (rounded up) */
  walkingMinutes: number;
  /** Origin platform description */
  fromPlatform: string;
  /** Destination platform description */
  toPlatform: string;
}

interface TransferInfoState {
  info: TransferInfo | null;
  loading: boolean;
  error: string | null;
}

/**
 * Returns transfer walking info from `fromLineName` to `toLineName`
 * at `stationName`. Returns null info (not an error) when the KRIC
 * code map has not been synced yet.
 */
export function useTransferInfo(
  stationName: string,
  fromLineName: string,
  toLineName: string,
): TransferInfoState {
  const [state, setState] = useState<TransferInfoState>({
    info: null,
    loading: true,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fromLnCd = APP_LINE_TO_KRIC[fromLineName];
    const toLnCd = APP_LINE_TO_KRIC[toLineName];

    if (!(fromLnCd && toLnCd)) {
      setState({ info: null, loading: false, error: null });
      return;
    }

    const ref = getKricRef(stationName, fromLnCd);
    if (!ref) {
      if (retryCount < MAX_RETRIES) {
        const t = setTimeout(() => setRetryCount((c) => c + 1), RETRY_DELAY_MS);
        return () => clearTimeout(t);
      }
      setState({ info: null, loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchStationTransferInfo({
      railOprIsttCd: ref.railOprIsttCd,
      lnCd: ref.lnCd,
      stinCd: ref.stinCd,
    })
      .then((items) => {
        if (cancelled) return;

        // Find the item matching the target line
        const match = items.find(
          (item) =>
            item.chtnLn === toLineName ||
            APP_LINE_TO_KRIC[item.chtnLn] === toLnCd,
        );

        if (!match) {
          setState({ info: null, loading: false, error: null });
          return;
        }

        const distanceM = Number.parseInt(match.chtnDst, 10) || 0;
        // Walk speed ≈ 80 m/min → round up
        const walkingMinutes = Math.ceil(distanceM / 80);

        setState({
          info: {
            distanceM,
            walkingMinutes,
            fromPlatform: match.stLocCont,
            toPlatform: match.clsLocCont,
          },
          loading: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          info: null,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to load transfer info",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [stationName, fromLineName, toLineName, retryCount]);

  return state;
}
