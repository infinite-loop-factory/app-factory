/**
 * Hook that fetches step-by-step accessible transfer movement instructions
 * using the KRIC vulnerableUserInfo/transferMovement endpoint.
 *
 * Requires KRIC station codes for the current station, the previous station
 * on the incoming line, and the next station on the outgoing line.
 * These can be obtained from getKricRef() after syncing the KRIC code map.
 *
 * Retries every 2 s (up to 8 times) when the KRIC code map has not yet been
 * loaded, so the hook self-heals once the initial sync completes.
 */

import type { TransferMovementItem } from "@/lib/kric-api";

import { useEffect, useState } from "react";
import { getKricRef } from "@/data/kric-station-sync";
import { fetchTransferMovement } from "@/lib/kric-api";
import { APP_LINE_TO_KRIC } from "@/lib/line-codes";

const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 2000;

export interface TransferStep {
  /** Step sequence (1-based) */
  order: number;
  /** Description of the movement for this step */
  instruction: string;
  /** Start label (e.g. platform name) */
  from: string;
  /** End label */
  to: string;
  /** Whether an elevator is involved */
  hasElevator: boolean;
  /** Elevator operational status code ("1"=운행, others=unavailable) */
  elevatorStatus: string;
}

interface TransferMovementState {
  steps: TransferStep[];
  loading: boolean;
  error: string | null;
}

/**
 * Returns the accessible step-by-step transfer path.
 *
 * @param stationName     - The transfer station name
 * @param fromLineName    - App line name you are arriving from
 * @param toLineName      - App line name you are transferring to
 * @param prevStationName - Station immediately before the transfer station
 *                          on the incoming line (needed by the KRIC API)
 * @param nextStationName - Station immediately after the transfer station
 *                          on the outgoing line (needed by the KRIC API)
 */
export function useTransferMovement(
  stationName: string,
  fromLineName: string,
  toLineName: string,
  prevStationName: string,
  nextStationName: string,
): TransferMovementState {
  const [state, setState] = useState<TransferMovementState>({
    steps: [],
    loading: true,
    error: null,
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fromLnCd = APP_LINE_TO_KRIC[fromLineName];
    const toLnCd = APP_LINE_TO_KRIC[toLineName];

    if (!(fromLnCd && toLnCd)) {
      setState({ steps: [], loading: false, error: null });
      return;
    }

    const ref = getKricRef(stationName, fromLnCd);
    const prevRef = getKricRef(prevStationName, fromLnCd);
    const nextRef = getKricRef(nextStationName, toLnCd);

    if (!(ref && prevRef && nextRef)) {
      // Code map not yet synced — retry until available or max retries reached
      if (retryCount < MAX_RETRIES) {
        const t = setTimeout(() => setRetryCount((c) => c + 1), RETRY_DELAY_MS);
        return () => clearTimeout(t);
      }
      setState({ steps: [], loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    fetchTransferMovement({
      railOprIsttCd: ref.railOprIsttCd,
      lnCd: ref.lnCd,
      stinCd: ref.stinCd,
      prevStinCd: prevRef.stinCd,
      chthTgtLn: toLnCd,
      chtnNextStinCd: nextRef.stinCd,
    })
      .then((items: TransferMovementItem[]) => {
        if (cancelled) return;

        const steps = items
          .slice()
          .sort((a, b) => Number(a.chtnMvTpOrdr) - Number(b.chtnMvTpOrdr))
          .map((item) => ({
            order: Number(item.chtnMvTpOrdr),
            instruction: item.mvContDtl,
            from: item.stMovePath,
            to: item.edMovePath,
            hasElevator: item.elvtTpCd !== "" && item.elvtTpCd !== "0",
            elevatorStatus: item.elvtSttCd,
          }));

        setState({ steps, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          steps: [],
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Failed to load transfer movement",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [
    stationName,
    fromLineName,
    toLineName,
    prevStationName,
    nextStationName,
    retryCount,
  ]);

  return state;
}
