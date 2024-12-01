import { useCallback, useRef, useState } from "react";

export interface TimeResult {
  startTime: number;
  endTime: number;
  reactionTime: number;
}

export const useReactionTimer = () => {
  const [result, setResult] = useState<TimeResult | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const stop = useCallback(() => {
    const endTime = Date.now();
    const timeResult = {
      startTime: startTimeRef.current,
      endTime,
      reactionTime: endTime - startTimeRef.current,
    };
    setResult(timeResult);
  }, []);

  return {
    result,
    start,
    stop,
  };
};
