import type { GameState } from "@/game/types";

import { useEffect, useRef } from "react";
import { TOTAL_CELLS } from "@/game/constants/board";

/** Records a win/loss in stats exactly once per finished game. */
export function useGameResultRecorder(
  state: GameState,
  recordGameResult: (won: boolean) => void,
) {
  const recordedRef = useRef(false);

  useEffect(() => {
    if (!state.gameOver) {
      recordedRef.current = false;
      return;
    }
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordGameResult(state.positions[0] >= TOTAL_CELLS);
  }, [recordGameResult, state.gameOver, state.positions]);

  return {
    /** Call when starting a new game so the next result records again. */
    resetRecorded: () => {
      recordedRef.current = false;
    },
  };
}
