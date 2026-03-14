/**
 * Hook that fetches transfer walking distance between two lines at a station
 * using the KRIC convenientInfo/stationTransferInfo endpoint.
 */

import { useEffect, useState } from "react";
import { getKricRef } from "@/data/kric-station-sync";
import { fetchStationTransferInfo } from "@/lib/kric-api";

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
  }, [stationName, fromLineName, toLineName]);

  return state;
}
