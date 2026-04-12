import { useEffect, useState } from "react";
import { fetchStationTransferInfo } from "@/lib/kric-api";
import { APP_LINE_TO_KRIC } from "@/lib/line-codes";
import { useKricRefRetry } from "./use-kric-retry";

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

export function useTransferInfo(
  stationName: string,
  fromLineName: string,
  toLineName: string,
): TransferInfoState {
  const fromLnCd = APP_LINE_TO_KRIC[fromLineName];
  const toLnCd = APP_LINE_TO_KRIC[toLineName];
  const { ref, isRetrying } = useKricRefRetry(stationName, fromLnCd);

  const [state, setState] = useState<TransferInfoState>({
    info: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!(fromLnCd && toLnCd)) {
      setState({ info: null, loading: false, error: null });
      return;
    }

    if (isRetrying) {
      setState((s) => ({ ...s, loading: true, error: null }));
      return;
    }

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
  }, [ref, isRetrying, fromLnCd, toLnCd, toLineName]);

  return state;
}
