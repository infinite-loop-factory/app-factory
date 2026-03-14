/**
 * Hook that fetches step-by-step accessible transfer movement instructions
 * using the KRIC vulnerableUserInfo/transferMovement endpoint.
 *
 * Requires KRIC station codes for the current station, the previous station
 * on the incoming line, and the next station on the outgoing line.
 * These can be obtained from getKricRef() after syncing the KRIC code map.
 */

import type { TransferMovementItem } from "@/lib/kric-api";

import { useEffect, useState } from "react";
import { getKricRef } from "@/data/kric-station-sync";
import { fetchTransferMovement } from "@/lib/kric-api";

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
      // Code map not yet synced — not an error
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
  }, [stationName, fromLineName, toLineName, prevStationName, nextStationName]);

  return state;
}
