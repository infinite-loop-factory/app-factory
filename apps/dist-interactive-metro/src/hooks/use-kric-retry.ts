import { useCallback, useEffect, useState } from "react";
import { getKricRef, type KricStationRef } from "@/data/kric-station-sync";

const MAX_RETRIES = 8;
const RETRY_DELAY_MS = 2000;

/**
 * Hook that manages retrying KRIC reference lookups when the initial sync
 * may still be in progress.
 */
export function useKricRefRetry(
  stationName: string,
  lineCode: string | undefined,
) {
  const [retryCount, setRetryCount] = useState(0);
  const [ref, setRef] = useState<KricStationRef | null>(null);
  const [isRetrying, setIsRetrying] = useState(true);

  useEffect(() => {
    if (!lineCode) {
      setRef(null);
      setIsRetrying(false);
      return;
    }

    const currentRef = getKricRef(stationName, lineCode);
    if (currentRef) {
      setRef(currentRef);
      setIsRetrying(false);
      return;
    }

    if (retryCount < MAX_RETRIES) {
      const t = setTimeout(() => setRetryCount((c) => c + 1), RETRY_DELAY_MS);
      return () => clearTimeout(t);
    }

    setRef(null);
    setIsRetrying(false);
  }, [stationName, lineCode, retryCount]);

  const resetRetry = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(true);
  }, []);

  return { ref, isRetrying, resetRetry };
}
