import { useCallback, useRef, useState } from "react";

export interface TimeResult {
  startTime: number;
  endTime: number;
  reactionTime: number;
}

export const useReactionTimer = () => {
  const [result, setResult] = useState<TimeResult | null>(null);
  const [earlyPress, setEarlyPress] = useState(false);
  const startTimeRef = useRef<number>(0);
  const isStartedRef = useRef<boolean>(false);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    isStartedRef.current = true;
    setEarlyPress(false);
  }, []);

  const stop = useCallback(() => {
    if (!isStartedRef.current) {
      setEarlyPress(true);
      return null;
    }

    const endTime = Date.now();
    const timeResult = {
      startTime: startTimeRef.current,
      endTime,
      reactionTime: endTime - startTimeRef.current,
    };
    setResult(timeResult);
    isStartedRef.current = false;
    return timeResult;
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setEarlyPress(false);
    startTimeRef.current = 0;
    isStartedRef.current = false;
  }, []);

  return {
    result,
    start,
    stop,
    reset,
    earlyPress,
  };
};
